import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Unit } from '../math/Unit';
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import remove from '../util/remove';
import { Dynamics } from './Dynamics';
import { EnergySystem } from './EnergySystem';
import { Force } from './Force';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
import { Metric } from './Metric';
import { SimList } from './SimList';
import { Simulation } from './Simulation';
import { VarsList } from './VarsList';

/**
 * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * @hidden
 */
export class Physics<T> extends AbstractSubject implements Simulation, EnergySystem<T> {
    /**
     * 
     */
    private readonly $simList = new SimList();
    /**
     * The list of variables represents the current state of the simulation.
     */
    private readonly $varsList: VarsList;
    /**
     * The RigidBody(s) in this simulation.
     */
    private readonly $bodies: ForceBody<T>[] = [];
    /**
     * 
     */
    private readonly $forceLaws: ForceLaw<T>[] = [];
    /**
     *
     */
    private readonly $constraints: GeometricConstraint<T>[] = [];

    /**
     * 
     */
    private $showForces = false;

    /**
     * 
     */
    private readonly $potentialOffset: T;

    /**
     * Scratch variable for computing force.
     */
    private readonly $force: T;
    /**
     * Scratch variable for computing torque.
     */
    private readonly $torque: T;
    /**
     * Scratch variable for computing total energy.
     */
    private readonly $totalEnergy: T;
    private $totalEnergyLock: number;

    private readonly $numVariablesPerBody: number;

    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor(public readonly metric: Metric<T>, private readonly dynamics: Dynamics<T>) {
        super();
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('dynamics', dynamics);
        this.$varsList = new VarsList(dynamics.getVarNames());
        this.$potentialOffset = metric.zero();
        this.$force = metric.zero();
        this.$torque = metric.zero();
        this.$totalEnergy = metric.zero();
        this.$totalEnergyLock = metric.lock(this.$totalEnergy);
        this.$numVariablesPerBody = dynamics.numVarsPerBody();
    }

    /**
     * Determines whether calculated forces will be added to the simulation list.
     */
    get showForces(): boolean {
        return this.$showForces;
    }
    set showForces(showForces: boolean) {
        mustBeBoolean('showForces', showForces);
        this.$showForces = showForces;
    }

    /**
     * 
     */
    addBody(body: ForceBody<T>): void {
        mustBeNonNullObject('body', body);
        if (!contains(this.$bodies, body)) {
            const dynamics = this.dynamics;
            // create variables in vars array for this body
            const names = [];
            for (let k = 0; k < this.$numVariablesPerBody; k++) {
                names.push(dynamics.getOffsetName(k));
            }
            body.varsIndex = this.$varsList.addVariables(names);
            // add body to end of list of bodies
            this.$bodies.push(body);
            this.$simList.add(body);
        }
        this.updateVarsFromBody(body);
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeBody(body: ForceBody<T>): void {
        mustBeNonNullObject('body', body);
        if (contains(this.$bodies, body)) {
            this.$varsList.deleteVariables(body.varsIndex, this.$numVariablesPerBody);
            remove(this.$bodies, body);
            body.varsIndex = -1;
        }
        this.$simList.remove(body);
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    addForceLaw(forceLaw: ForceLaw<T>): void {
        mustBeNonNullObject('forceLaw', forceLaw);
        if (!contains(this.$forceLaws, forceLaw)) {
            this.$forceLaws.push(forceLaw);
        }
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void {
        mustBeNonNullObject('forceLaw', forceLaw);
        forceLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.$forceLaws, forceLaw);
    }

    /**
     * 
     * @param geometry 
     */
    addConstraint(geometry: GeometricConstraint<T>): void {
        mustBeNonNullObject('geometry', geometry);
        if (!contains(this.$constraints, geometry)) {
            this.$constraints.push(geometry);
        }
    }

    removeConstraint(geometry: GeometricConstraint<T>): void {
        mustBeNonNullObject('geometry', geometry);
        remove(this.$constraints, geometry);
    }

    private discontinuosChangeToEnergy(): void {
        const dynamics = this.dynamics;
        this.$varsList.incrSequence(...dynamics.discontinuousEnergyVars());
    }

    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private updateBodiesFromStateVariables(vars: number[]): void {
        const dynamics = this.dynamics;
        const bodies = this.$bodies;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            const body = bodies[i];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            // Delegate the updating of the body from the state variables because
            // we do not know how to access the properties of the bodies in the
            // various dimensions.
            dynamics.updateBodyFromVars(vars, idx, body);
        }
    }

    /**
     * Handler for actions to be performed before the evaluate calls.
     * The physics engine removes objects that were temporarily added to the simulation
     * list but have expired.
     * @hidden
     */
    prolog(): void {
        this.simList.removeTemporary(this.varsList.getTime());
    }

    /**
     * Gets the state vector, Y(t).
     * The returned array is a copy of the state vector variable values.
     * However, for performance, the array is maintained between invocations.
     * @hidden
     */
    getState(): number[] {
        return this.$varsList.getValues();
    }

    /**
     * Sets the state vector, Y(t).
     * @hidden
     */
    setState(state: number[]): void {
        this.varsList.setValuesContinuous(state);
    }

    /**
     * The time value is not being used because the DiffEqSolver has updated the vars.
     * This will move the objects and forces will be recalculated.
     * If anything it could be passed to forceLaw.calculateForces.
     * @hidden
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void {
        const metric = this.metric;
        const dynamics = this.dynamics;
        // Move objects so that rigid body objects know their current state.
        this.updateBodiesFromStateVariables(state);
        const bodies = this.$bodies;
        const Nb = bodies.length;
        for (let bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
            const body = bodies[bodyIndex];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            const mass = metric.a(body.M);
            if (mass === Number.POSITIVE_INFINITY) {
                for (let k = 0; k < this.$numVariablesPerBody; k++) {
                    rateOfChange[idx + k] = 0;  // infinite mass objects don't move
                }
            }
            else {
                dynamics.setPositionRateOfChangeVars(rateOfChange, idx, body);
                dynamics.setAttitudeRateOfChangeVars(rateOfChange, idx, body);
                dynamics.zeroLinearMomentumVars(rateOfChange, idx);
                dynamics.zeroAngularMomentumVars(rateOfChange, idx);
            }
        }
        const forceLaws = this.$forceLaws;
        const Nlaws = forceLaws.length;
        for (let lawIndex = 0; lawIndex < Nlaws; lawIndex++) {
            const forceLaw = forceLaws[lawIndex];
            // The forces will give rise to changes in both linear and angular momentum.
            const forces = forceLaw.calculateForces();
            const Nforces = forces.length;
            for (let forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, forces[forceIndex], Δt, uomTime);
            }
        }
        const constraints = this.$constraints;
        const Nconstraints = constraints.length;
        for (let i = 0; i < Nconstraints; i++) {
            const constraint = constraints[i];
            this.constrainForce(rateOfChange, constraint);
        }
        rateOfChange[this.$varsList.timeIndex()] = 1;
    }

    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChange The (output) rate of change of the state variables.
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    private applyForce(rateOfChange: number[], forceApp: Force<T>, Δt: number, uomTime?: Unit): void {
        const body = forceApp.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        const idx = body.varsIndex;
        if (idx < 0) {
            return;
        }

        const metric = this.metric;
        const dynamics = this.dynamics;

        // The rate of change of momentum is force.
        // dP/dt = F
        forceApp.computeForce(this.$force);
        const F = this.$force;
        // Bootstrap the linear momentum unit of measure.
        if (Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
            metric.setUom(body.P, Unit.mul(metric.uom(F), uomTime));
        }
        // TODO: Here we could apply geometric constraints on the forces.
        dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChange, idx, F);

        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.$torque);
        const T = this.$torque;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            metric.setUom(body.L, Unit.mul(metric.uom(T), uomTime));
        }
        // TODO: Could we add geometric constraints for torques here?
        dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChange, idx, T);

        if (this.$showForces) {
            forceApp.expireTime = this.$varsList.getTime();
            this.$simList.add(forceApp);
        }
    }

    private constrainForce(rateOfChange: number[], constraint: GeometricConstraint<T>): void {
        const body = constraint.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        const idx = body.varsIndex;
        if (idx < 0) {
            return;
        }

        const metric = this.metric;
        const dynamics = this.dynamics;

        // TODO: This could be a scratch variable.
        const F = metric.scalar(0);
        const e = metric.scalar(0);
        const N = metric.scalar(0);

        dynamics.getForce(rateOfChange, idx, F);
        const X = body.X;
        constraint.computeNormal(X, e);

        metric.copyVector(e, N);
        metric.scp(N, e);
        metric.mulByVector(N, e);
        metric.subVector(F, N);

        // Update the rateOfChange of Linear Momentum (force); 
        dynamics.setForce(rateOfChange, idx, F);

        // The constraint holds the computed force so that it can be visualized.
        constraint.setForce(N);
    }

    /**
     * 
     */
    get time(): number {
        return this.$varsList.getTime();
    }

    /**
     * 
     */
    updateFromBodies(): void {
        const bodies = this.$bodies;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            this.updateVarsFromBody(bodies[i]);
        }
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    private updateVarsFromBody(body: ForceBody<T>): void {
        const idx = body.varsIndex;
        if (idx > -1) {
            this.dynamics.updateVarsFromBody(body, idx, this.$varsList);
        }
    }

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     * @hidden
     */
    epilog(): void {
        const varsList = this.$varsList;
        const vars = varsList.getValues();
        this.updateBodiesFromStateVariables(vars);
        const dynamics = this.dynamics;
        dynamics.epilog(this.$bodies, this.$forceLaws, this.$potentialOffset, varsList);
    }

    /**
     * Provides a reference to the bodies in the simulation.
     */
    get bodies(): ForceBody<T>[] {
        return this.$bodies;
    }

    /**
     * @hidden
     */
    get simList(): SimList {
        return this.$simList;
    }

    /**
     * @hidden
     */
    get varsList(): VarsList {
        return this.$varsList;
    }

    /**
     * Computes the sum of the translational and rotational kinetic energy of all bodies,
     * and the potential energy due to body interactions for the force laws.
     */
    totalEnergy(): T {
        const metric = this.metric;

        metric.unlock(this.$totalEnergy, this.$totalEnergyLock);

        // TODO: Could be more efficient...
        metric.write(metric.zero(), this.$totalEnergy);

        metric.add(this.$totalEnergy, this.$potentialOffset);

        const bs = this.$bodies;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const body = bs[i];
            if (isFinite(metric.a(body.M))) {
                metric.add(this.$totalEnergy, body.rotationalEnergy());
                metric.add(this.$totalEnergy, body.translationalEnergy());
            }
        }

        const fs = this.$forceLaws;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            metric.add(this.$totalEnergy, fs[i].potentialEnergy());
        }

        this.$totalEnergyLock = metric.lock(this.$totalEnergy);

        return this.$totalEnergy;
    }
}
