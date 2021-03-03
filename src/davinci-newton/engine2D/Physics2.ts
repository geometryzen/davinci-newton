// Copyright 2017-2021 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
        case Physics2.OFFSET_POSITION_X: return "position x";
        case Physics2.OFFSET_POSITION_Y: return "position y";
        case Physics2.OFFSET_ATTITUDE_A: return "attitude a";
        case Physics2.OFFSET_ATTITUDE_XY: return "attitude xy";
        case Physics2.OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
        case Physics2.OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
        case Physics2.OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
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
export class Physics2 extends AbstractSubject implements Simulation, EnergySystem {
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
    private readonly bodies_: ForceBody2[] = [];
    /**
     * 
     */
    private readonly forceLaws_: ForceLaw2[] = [];

    /**
     * 
     */
    private showForces_ = false;

    /**
     * 
     */
    private readonly potentialOffset_ = Geometric2.scalar(0);

    /**
     * Scratch variable for computing force.
     */
    private readonly force_ = Geometric2.vector(0, 0);
    /**
     * Scratch variable for computing torque.
     */
    private readonly torque_ = Geometric2.bivector(0);
    /**
     * Scratch variable for computing total energy.
     */
    private readonly totalEnergy_ = Geometric2.scalar(0);
    private totalEnergyLock_ = this.totalEnergy_.lock();

    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor() {
        super();
        this.varsList_ = new VarsList(var_names);
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
    addBody(body: ForceBody2): void {
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
    removeBody(body: ForceBody2): void {
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
    addForceLaw(forceLaw: ForceLaw2): void {
        if (!contains(this.forceLaws_, forceLaw)) {
            this.forceLaws_.push(forceLaw);
        }
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeForceLaw(forceLaw: ForceLaw2): void {
        forceLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.forceLaws_, forceLaw);
    }

    private discontinuosChangeToEnergy(): void {
        this.varsList_.incrSequence(
            Physics2.INDEX_TRANSLATIONAL_KINETIC_ENERGY,
            Physics2.INDEX_ROTATIONAL_KINETIC_ENERGY,
            Physics2.INDEX_POTENTIAL_ENERGY,
            Physics2.INDEX_TOTAL_ENERGY,
            Physics2.INDEX_TOTAL_LINEAR_MOMENTUM_X,
            Physics2.INDEX_TOTAL_LINEAR_MOMENTUM_Y,
            Physics2.INDEX_TOTAL_ANGULAR_MOMENTUM_XY
        );
    }

    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private updateBodies(vars: number[]): void {

        const bodies = this.bodies_;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            const body = bodies[i];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }

            // Update state variables.
            body.X.x = vars[idx + Physics2.OFFSET_POSITION_X];
            body.X.y = vars[idx + Physics2.OFFSET_POSITION_Y];

            body.R.a = vars[idx + Physics2.OFFSET_ATTITUDE_A];
            body.R.xy = vars[idx + Physics2.OFFSET_ATTITUDE_XY];

            // Keep the magnitude of the attitude as close to 1 as possible.
            const R = body.R;
            const magR = Math.sqrt(R.a * R.a + R.xy * R.xy);
            body.R.a = body.R.a / magR;
            body.R.xy = body.R.xy / magR;

            body.P.x = vars[idx + Physics2.OFFSET_LINEAR_MOMENTUM_X];
            body.P.y = vars[idx + Physics2.OFFSET_LINEAR_MOMENTUM_Y];

            body.L.xy = vars[idx + Physics2.OFFSET_ANGULAR_MOMENTUM_XY];

            body.updateAngularVelocity();
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
            const mass = body.M.a;
            if (mass === Number.POSITIVE_INFINITY) {
                for (let k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                    rateOfChange[idx + k] = 0;  // infinite mass objects don't move
                }
            }
            else {
                // The rate of change of position is the velocity.
                // dX/dt = V = P / M
                const P = body.P;
                rateOfChange[idx + Physics2.OFFSET_POSITION_X] = P.x / mass;
                rateOfChange[idx + Physics2.OFFSET_POSITION_Y] = P.y / mass;

                // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
                // requiring the geometric product of Ω and R.
                // Ω and R are auxiliary and primary variables that have already been computed.
                const R = body.R;
                const Ω = body.Ω;
                rateOfChange[idx + Physics2.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
                rateOfChange[idx + Physics2.OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);

                // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
                rateOfChange[idx + Physics2.OFFSET_LINEAR_MOMENTUM_X] = 0;
                rateOfChange[idx + Physics2.OFFSET_LINEAR_MOMENTUM_Y] = 0;

                rateOfChange[idx + Physics2.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
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
    private applyForce(rateOfChange: number[], forceApp: Force2, Δt: number, uomTime?: Unit): void {
        const body = forceApp.getBody();
        if (!(contains(this.bodies_, body))) {
            return;
        }
        const idx = body.varsIndex;
        if (idx < 0) {
            return;
        }

        // The rate of change of momentum is force.
        // dP/dt = F
        forceApp.computeForce(this.force_);
        const F = this.force_;
        // Bootstrap the linear momentum unit of measure.
        if (Unit.isOne(body.P.uom) && isZeroVectorE2(body.P)) {
            body.P.uom = Unit.mul(F.uom, uomTime);
        }
        rateOfChange[idx + Physics2.OFFSET_LINEAR_MOMENTUM_X] += F.x;
        rateOfChange[idx + Physics2.OFFSET_LINEAR_MOMENTUM_Y] += F.y;

        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.torque_);
        const T = this.torque_;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(body.L.uom) && isZeroBivectorE2(body.L)) {
            body.L.uom = Unit.mul(T.uom, uomTime);
        }
        rateOfChange[idx + Physics2.OFFSET_ANGULAR_MOMENTUM_XY] += T.xy;

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
    private updateFromBody(body: ForceBody2): void {
        const idx = body.varsIndex;
        if (idx > -1) {
            const va = this.varsList_;

            va.setValue(Physics2.OFFSET_POSITION_X + idx, body.X.x);
            va.setValue(Physics2.OFFSET_POSITION_Y + idx, body.X.y);

            va.setValue(Physics2.OFFSET_ATTITUDE_A + idx, body.R.a);
            va.setValue(Physics2.OFFSET_ATTITUDE_XY + idx, body.R.xy);

            va.setValue(Physics2.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
            va.setValue(Physics2.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);

            va.setValue(Physics2.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
        }
    }

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     */
    epilog(): void {
        const varsList = this.varsList_;
        const vars = varsList.getValues();
        this.updateBodies(vars);

        // update the variables that track energy
        let pe = this.potentialOffset_.a;
        let re = 0;
        let te = 0;
        // update the variable that track linear momentum (vector)
        let Px = 0;
        let Py = 0;
        let Pz = 0;
        // update the variable that track angular momentum (bivector)
        let Lyz = 0;
        let Lzx = 0;
        let Lxy = 0;

        const bs = this.bodies_;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const b = bs[i];
            if (isFinite(b.M.a)) {
                re += b.rotationalEnergy().a;
                te += b.translationalEnergy().a;
                // linear momentum
                Px += b.P.x;
                Py += b.P.y;
                // orbital angular momentum
                // Lyz += wedgeYZ(b.X, b.P);
                // Lzx += wedgeZX(b.X, b.P);
                // Lxy += wedgeXY(b.X, b.P);
                Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                // spin angular momentum
                Lxy += b.L.xy;
            }
        }

        const fs = this.forceLaws_;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy().a;
        }

        varsList.setValue(Physics2.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
        varsList.setValue(Physics2.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
        varsList.setValue(Physics2.INDEX_POTENTIAL_ENERGY, pe, true);
        varsList.setValue(Physics2.INDEX_TOTAL_ENERGY, te + re + pe, true);
        varsList.setValue(Physics2.INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
        varsList.setValue(Physics2.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
        varsList.setValue(Physics2.INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
    }

    /**
     * Provides a reference to the bodies in the simulation.
     */
    get bodies(): ForceBody2[] {
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
    totalEnergy(): Geometric2 {
        this.totalEnergy_.unlock(this.totalEnergyLock_);

        this.totalEnergy_.zero();

        this.totalEnergy_.add(this.potentialOffset_);

        const bs = this.bodies_;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const body = bs[i];
            if (isFinite(body.M.a)) {
                this.totalEnergy_.add(body.rotationalEnergy());
                this.totalEnergy_.add(body.translationalEnergy());
            }
        }

        const fs = this.forceLaws_;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            this.totalEnergy_.add(fs[i].potentialEnergy());
        }

        this.totalEnergyLock_ = this.totalEnergy_.lock();

        return this.totalEnergy_;
    }
}
