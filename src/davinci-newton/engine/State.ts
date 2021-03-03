import SimList from '../core/SimList';
import Simulation from '../core/Simulation';
import { VarsList } from '../core/VarsList';
import { Geometric2 } from '../math/Geometric2';
import { isZeroBivectorE2 } from '../math/isZeroBivectorE2';
import { isZeroVectorE2 } from '../math/isZeroVectorE2';
import { Unit } from '../math/Unit';
import { EnergySystem } from '../solvers/EnergySystem';
import AbstractSubject from '../util/AbstractSubject';
import contains from '../util/contains';
import remove from '../util/remove';
import { Force2 } from './Force2';
import { ForceBody2 } from './ForceBody2';
import { ForceLaw2 } from './ForceLaw2';
import { Measure } from './Measure';
import { Dynamics } from '../core/Dynamics';

const var_names = [
    VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy",
    "total linear momentum - x",
    "total linear momentum - y",
    "total linear momentum - z",
    "total angular momentum - yz",
    "total angular momentum - zx",
    "total angular momentum - xy"
];

/**
 *
 */
function getVarName(index: number): string {
    switch (index) {
        case State.OFFSET_POSITION_X: return "position x";
        case State.OFFSET_POSITION_Y: return "position y";
        case State.OFFSET_ATTITUDE_A: return "attitude a";
        case State.OFFSET_ATTITUDE_XY: return "attitude xy";
        case State.OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
        case State.OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
        case State.OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
    }
    throw new Error(`getVarName(${index})`);
}

/**
 * Each body is described by 7 kinematic components.
 * 2 position
 * 2 attitude (though normalized should be only 1)
 * 2 linear momentum
 * 1 angular momentum
 */
const NUM_VARIABLES_PER_BODY = 7;

/**
 * <p>
 * The Physics2 engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * </p>
 */
export class State<T> extends AbstractSubject implements Simulation {
    public static readonly INDEX_TIME = 0;
    public static readonly INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
    public static readonly INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
    public static readonly INDEX_POTENTIAL_ENERGY = 3;
    public static readonly INDEX_TOTAL_ENERGY = 4;
    public static readonly INDEX_TOTAL_LINEAR_MOMENTUM_X = 5;
    public static readonly INDEX_TOTAL_LINEAR_MOMENTUM_Y = 6;
    public static readonly INDEX_TOTAL_ANGULAR_MOMENTUM_XY = 7;
    public static readonly OFFSET_POSITION_X = 0;
    public static readonly OFFSET_POSITION_Y = 1;
    public static readonly OFFSET_ATTITUDE_A = 2;
    public static readonly OFFSET_ATTITUDE_XY = 3;
    public static readonly OFFSET_LINEAR_MOMENTUM_X = 4;
    public static readonly OFFSET_LINEAR_MOMENTUM_Y = 5;
    public static readonly OFFSET_ANGULAR_MOMENTUM_XY = 6;

    /**
     * 
     */
    private readonly simList_ = new SimList();
    /**
     * The list of variables represents the current state of the simulation.
     */
    private readonly varsList_: VarsList;
    /**
     * The RigidBody(s) in this simulation.
     */
    private readonly bodies_: ForceBody2<T>[] = [];
    /**
     * 
     */
    private readonly forceLaws_: ForceLaw2<T>[] = [];

    /**
     * 
     */
    private showForces_ = false;

    /**
     * 
     */
    private readonly potentialOffset_: T;

    /**
     * Scratch variable for computing force.
     */
    private readonly force_: T;
    /**
     * Scratch variable for computing torque.
     */
    private readonly torque_: T;
    /**
     * Scratch variable for computing total energy.
     */
    private readonly totalEnergy_: T;
    private totalEnergyLock_: number;

    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor(private readonly metric: Measure<T>, private readonly dynamics: Dynamics<T>) {
        super();
        this.varsList_ = new VarsList(var_names);
        this.potentialOffset_ = metric.zero();
        this.force_ = metric.zero();
        this.torque_ = metric.zero();
        this.totalEnergy_ = metric.zero();
        this.totalEnergyLock_ = metric.lock(this.totalEnergy_);
    }

    /**
     * Determines whether calculated forces will be added to the simulation list.
     */
    get showForces(): boolean {
        return this.showForces_;
    }
    set showForces(showForces: boolean) {
        this.showForces_ = showForces;
    }

    /**
     * 
     */
    addBody(body: ForceBody2<T>): void {
        if (!contains(this.bodies_, body)) {
            // create variables in vars array for this body
            const names = [];
            for (let k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                names.push(getVarName(k));
            }
            body.varsIndex = this.varsList_.addVariables(names);
            // add body to end of list of bodies
            this.bodies_.push(body);
            this.simList_.add(body);
        }
        this.updateFromBody(body);
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeBody(body: ForceBody2<T>): void {
        if (contains(this.bodies_, body)) {
            this.varsList_.deleteVariables(body.varsIndex, NUM_VARIABLES_PER_BODY);
            remove(this.bodies_, body);
            body.varsIndex = -1;
        }
        this.simList_.remove(body);
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    addForceLaw(forceLaw: ForceLaw2<T>): void {
        if (!contains(this.forceLaws_, forceLaw)) {
            this.forceLaws_.push(forceLaw);
        }
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeForceLaw(forceLaw: ForceLaw2<T>): void {
        forceLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.forceLaws_, forceLaw);
    }

    private discontinuosChangeToEnergy(): void {
        // const dynamics = this.dynamics;
        this.varsList_.incrSequence(
            State.INDEX_TRANSLATIONAL_KINETIC_ENERGY,
            State.INDEX_ROTATIONAL_KINETIC_ENERGY,
            State.INDEX_POTENTIAL_ENERGY,
            State.INDEX_TOTAL_ENERGY,
            State.INDEX_TOTAL_LINEAR_MOMENTUM_X,
            State.INDEX_TOTAL_LINEAR_MOMENTUM_Y,
            State.INDEX_TOTAL_ANGULAR_MOMENTUM_XY
        );
    }

    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private updateBodies(vars: number[]): void {
        const dynamics = this.dynamics;
        const bodies = this.bodies_;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            const body = bodies[i];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            // Update state variables.
            dynamics.updateBody(vars, idx, body);
        }
    }

    /**
     * Handler for actions to be performed before the evaluate calls.
     * The physics engine removes objects that were temporarily added to the simulation
     * list but have expired.
     */
    prolog(): void {
        this.simList.removeTemporary(this.varsList.getTime());
    }

    /**
     * Gets the state vector, Y(t). 
     */
    getState(): number[] {
        return this.varsList_.getValues();
    }

    /**
     * Sets the state vector, Y(t).
     */
    setState(state: number[]): void {
        this.varsList.setValues(state, true);
    }

    /**
     * The time value is not being used because the DiffEqSolver has updated the vars.
     * This will move the objects and forces will be recalculated.
     * If anything it could be passed to forceLaw.updateForces.
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void {
        const metric = this.metric;
        const dynamics = this.dynamics;
        // Move objects so that rigid body objects know their current state.
        this.updateBodies(state);
        const bodies = this.bodies_;
        const Nb = bodies.length;
        for (let bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
            const body = bodies[bodyIndex];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            const mass = metric.a(body.M);
            if (mass === Number.POSITIVE_INFINITY) {
                for (let k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                    rateOfChange[idx + k] = 0;  // infinite mass objects don't move
                }
            }
            else {
                dynamics.setPositionRateOfChange(rateOfChange, idx, body);
                dynamics.setAttitudeRateOfChange(rateOfChange, idx, body);
                dynamics.zeroLinearMomentum(rateOfChange, idx);
                dynamics.zeroAngularMomentum(rateOfChange, idx);
            }
        }
        const forceLaws = this.forceLaws_;
        const Nlaws = forceLaws.length;
        for (let lawIndex = 0; lawIndex < Nlaws; lawIndex++) {
            const forceLaw = forceLaws[lawIndex];
            // The forces will give rise to changes in both linear and angular momentum.
            const forces = forceLaw.updateForces();
            const Nforces = forces.length;
            for (let forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, forces[forceIndex], Δt, uomTime);
            }
        }
        rateOfChange[this.varsList_.timeIndex()] = 1; // time variable
        return null;
    }

    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChange The (output) rate of change of the state variables.
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    private applyForce(rateOfChange: number[], forceApp: Force2<T>, Δt: number, uomTime?: Unit): void {
        const body = forceApp.getBody();
        if (!(contains(this.bodies_, body))) {
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
        forceApp.computeForce(this.force_);
        const F = this.force_;
        // Bootstrap the linear momentum unit of measure.
        if (Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
            metric.setUom(body.P, Unit.mul(metric.uom(F), uomTime));
        }
        dynamics.addForce(rateOfChange, idx, F);

        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.torque_);
        const T = this.torque_;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            metric.setUom(body.L, Unit.mul(metric.uom(T), uomTime));
        }
        dynamics.addTorque(rateOfChange, idx, T);

        if (this.showForces_) {
            forceApp.expireTime = this.varsList_.getTime();
            this.simList_.add(forceApp);
        }
    }

    /**
     * 
     */
    get time(): number {
        return this.varsList_.getTime();
    }

    public updateFromBodies(): void {
        const bodies = this.bodies_;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            this.updateFromBody(bodies[i]);
        }
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    private updateFromBody(body: ForceBody2<T>): void {
        const idx = body.varsIndex;
        if (idx > -1) {
            this.dynamics.updateVarsFromBody(body, idx, this.varsList_);
        }
    }

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     */
    epilog(): void {
        const metric = this.metric;
        const varsList = this.varsList_;
        const vars = varsList.getValues();
        this.updateBodies(vars);
        const dynamics = this.dynamics;

        dynamics.epilog(this.bodies_, this.forceLaws_, this.potentialOffset_, varsList);
    }

    /**
     * Provides a reference to the bodies in the simulation.
     */
    get bodies(): ForceBody2<T>[] {
        return this.bodies_;
    }

    /**
     * 
     */
    get simList(): SimList {
        return this.simList_;
    }

    /**
     * 
     */
    get varsList(): VarsList {
        return this.varsList_;
    }

    /**
     * Computes the sum of the translational and rotational kinetic energy of all bodies,
     * and the potential energy due to body interactions for the force laws.
     */
    totalEnergy(): T {
        const metric = this.metric;

        metric.unlock(this.totalEnergy_, this.totalEnergyLock_);

        // TODO: Could be more efficient...
        metric.write(metric.zero(), this.totalEnergy_);

        metric.add(this.totalEnergy_, this.potentialOffset_);

        const bs = this.bodies_;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const body = bs[i];
            if (isFinite(metric.a(body.M))) {
                metric.add(this.totalEnergy_, body.rotationalEnergy());
                metric.add(this.totalEnergy_, body.translationalEnergy());
            }
        }

        const fs = this.forceLaws_;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            metric.add(this.totalEnergy_, fs[i].potentialEnergy());
        }

        this.totalEnergyLock_ = metric.lock(this.totalEnergy_);

        return this.totalEnergy_;
    }
}
