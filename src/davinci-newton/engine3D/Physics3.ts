// Copyright 2017 David Holmes.  All Rights Reserved.
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

import AbstractSubject from '../util/AbstractSubject';
import Bivector3 from '../math/Bivector3';
// import Collision from './Collision';
import contains from '../util/contains';
import Force from './Force3';
import ForceLaw from './ForceLaw3';
import Matrix3 from '../math/Matrix3';
import remove from '../util/remove';
import RigidBody3 from './RigidBody3';
import SimList from '../core/SimList';
import Simulation from '../core/Simulation';
import VarsList from '../core/VarsList';
import Vector3 from '../math/Vector3';

const var_names = [
    VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy"
];

/**
 *
 */
function getVarName(index: number): string {
    switch (index) {
        case Physics3.OFFSET_POSITION_X: return "position x";
        case Physics3.OFFSET_POSITION_Y: return "position y";
        case Physics3.OFFSET_POSITION_Z: return "position z";
        case Physics3.OFFSET_ATTITUDE_A: return "attitude a";
        case Physics3.OFFSET_ATTITUDE_YZ: return "attitude yz";
        case Physics3.OFFSET_ATTITUDE_ZX: return "attitude zx";
        case Physics3.OFFSET_ATTITUDE_XY: return "attitude xy";
        case Physics3.OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
        case Physics3.OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
        case Physics3.OFFSET_LINEAR_MOMENTUM_Z: return "linear momentum z";
        case Physics3.OFFSET_ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
        case Physics3.OFFSET_ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
        case Physics3.OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
    }
    throw new Error(`getVarName(${index})`);
}

const NUM_VARIABLES_PER_BODY = 13;

/**
 * 
 */
export class Physics3 extends AbstractSubject implements Simulation {
    public static readonly INDEX_TIME = 0;
    public static readonly INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
    public static readonly INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
    public static readonly INDEX_POTENTIAL_ENERGY = 3;
    public static readonly INDEX_TOTAL_ENERGY = 4;
    public static readonly OFFSET_POSITION_X = 0;
    public static readonly OFFSET_POSITION_Y = 1;
    public static readonly OFFSET_POSITION_Z = 2;
    public static readonly OFFSET_ATTITUDE_A = 3;
    public static readonly OFFSET_ATTITUDE_YZ = 4;
    public static readonly OFFSET_ATTITUDE_ZX = 5;
    public static readonly OFFSET_ATTITUDE_XY = 6;
    public static readonly OFFSET_LINEAR_MOMENTUM_X = 7;
    public static readonly OFFSET_LINEAR_MOMENTUM_Y = 8;
    public static readonly OFFSET_LINEAR_MOMENTUM_Z = 9;
    public static readonly OFFSET_ANGULAR_MOMENTUM_YZ = 10;
    public static readonly OFFSET_ANGULAR_MOMENTUM_ZX = 11;
    public static readonly OFFSET_ANGULAR_MOMENTUM_XY = 12;

    /**
     * 
     */
    private simList_ = new SimList();
    /**
     * The list of variables represents the current state of the simulation.
     */
    private varsList_: VarsList;
    /**
     * The RigidBody(s) in this simulation.
     */
    private bodies_: RigidBody3[] = [];
    /**
     * 
     */
    private forceLaws_: ForceLaw[] = [];

    /**
     * 
     */
    private showForces_ = false;

    /**
     * 
     */
    private potentialOffset_ = 0;

    /**
     * 
     */
    private recentState_: number[];

    /**
     * Scratch variable for computing force.
     */
    private force_ = new Vector3(0, 0, 0);
    /**
     * Scratch variable for computing torque.
     */
    private torque_ = new Bivector3();
    /**
     * Scratch variable for computing Inertia Tensor.
     */
    private R_ = Matrix3.one();
    private T_ = Matrix3.one();
    private Iinv_ = Matrix3.one();

    /**
     * 
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
    addBody(body: RigidBody3): void {
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
        this.initializeFromBody(body);
        this.bodies_.forEach(function (b) {
            // eraseOldCopy(b);
        });
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeBody(body: RigidBody3): void {
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
    addForceLaw(forceLaw: ForceLaw): void {
        if (!contains(this.forceLaws_, forceLaw)) {
            this.forceLaws_.push(forceLaw);
        }
        this.discontinuosChangeToEnergy();
    }

    /**
     * 
     */
    removeForceLaw(forceLaw: ForceLaw): void {
        forceLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.forceLaws_, forceLaw);
    }

    private discontinuosChangeToEnergy(): void {
        this.varsList_.incrSequence(Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, Physics3.INDEX_POTENTIAL_ENERGY, Physics3.INDEX_TOTAL_ENERGY);
    }

    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private moveObjects(vars: number[]): void {
        const R = this.R_;
        const T = this.T_;
        const Iinv = this.Iinv_;

        const bodies = this.bodies_;
        const N = bodies.length;
        for (let i = 0; i < N; i++) {
            const body = bodies[i];
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }

            // Update state variables.
            body.X.x = vars[idx + Physics3.OFFSET_POSITION_X];
            body.X.y = vars[idx + Physics3.OFFSET_POSITION_Y];
            body.X.z = vars[idx + Physics3.OFFSET_POSITION_Z];

            body.R.a = vars[idx + Physics3.OFFSET_ATTITUDE_A];
            body.R.xy = vars[idx + Physics3.OFFSET_ATTITUDE_XY];
            body.R.yz = vars[idx + Physics3.OFFSET_ATTITUDE_YZ];
            body.R.zx = vars[idx + Physics3.OFFSET_ATTITUDE_ZX];

            body.P.x = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X];
            body.P.y = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y];
            body.P.z = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z];

            body.L.xy = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY];
            body.L.yz = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ];
            body.L.zx = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX];

            // Update derived quantities (auxiliary variables).
            // We must calculate Ω.
            // L = I * Ω => Ω = Iinv * L
            // The inertia tensor must be converted from body coordinates to world.
            R.rotation(body.R);
            T.copy(R).transpose();
            Iinv.copy(body.Iinv).mul(T).rmul(R);
            body.Ω.copy(body.L).applyMatrix(Iinv);
        }
    }

    /**
     * Handler for actions to be performed before the evaluate calls.
     */
    prolog(): void {
        this.simList.removeTemporary(this.varsList.getTime());
    }

    getState(): number[] {
        return this.varsList_.getValues();
    }

    setState(state: number[]): void {
        this.varsList.setValues(state, true);
    }

    /**
     * The time value is not being used because the DiffEqSolver has updated the vars.
     * This will move the objects and forces will be recalculated.
     * If anything it could be passed to forceLaw.updateForces.
     */
    evaluate(state: number[], change: number[], timeOffset: number): void {
        // Move objects so that rigid body objects know their current state.
        this.moveObjects(state);
        this.bodies_.forEach(function (body) {
            const idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            const mass = body.M;
            if (mass === Number.POSITIVE_INFINITY) {
                for (let k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                    change[idx + k] = 0;  // infinite mass objects don't move
                }
            }
            else {
                // The rate of change of position is the velocity.
                // dX/dt = V = P / M
                change[idx + Physics3.OFFSET_POSITION_X] = state[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] / mass;
                change[idx + Physics3.OFFSET_POSITION_Y] = state[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] / mass;
                change[idx + Physics3.OFFSET_POSITION_Z] = state[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] / mass;

                // The rate of change of attitude is given by: dR/dt = -(1/2) * Ω * R
                // Ω and R are auxiliary and primary variables that have already been computed.
                const R = body.R;
                const Ω = body.Ω;
                change[idx + Physics3.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                change[idx + Physics3.OFFSET_ATTITUDE_XY] = -0.5 * Ω.xy * R.a;
                change[idx + Physics3.OFFSET_ATTITUDE_YZ] = -0.5 * Ω.yz * R.a;
                change[idx + Physics3.OFFSET_ATTITUDE_ZX] = -0.5 * Ω.zx * R.a;

                // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
                change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] = 0;
                change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] = 0;
                change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] = 0;

                change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
                change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
                change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
            }
        });
        this.forceLaws_.forEach((forceLaw) => {
            // The forces will give rise to changes in both linear and angular momentum.
            const forces = forceLaw.updateForces();
            forces.forEach((force) => {
                this.applyForce(change, force);
            });
        });
        change[this.varsList_.timeIndex()] = 1; // time variable
        return null;
    }

    /**
     * Applying forces gives rise to linear and angular momentum.
     */
    private applyForce(change: number[], forceApp: Force): void {
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
        change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] += F.x;
        change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] += F.y;
        change[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] += F.z;

        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.torque_);
        const Γ = this.torque_;
        change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ] += Γ.yz;
        change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX] += Γ.zx;
        change[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY] += Γ.xy;

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

    /**
     * 
     */
    private initializeFromBody(body: RigidBody3): void {
        // eraseOldCopy(body);
        const idx = body.varsIndex;
        if (idx > -1) {
            const va = this.varsList_;

            va.setValue(Physics3.OFFSET_POSITION_X + idx, body.X.x);
            va.setValue(Physics3.OFFSET_POSITION_Y + idx, body.X.y);
            va.setValue(Physics3.OFFSET_POSITION_Z + idx, body.X.z);

            va.setValue(Physics3.OFFSET_ATTITUDE_A + idx, body.R.a);
            va.setValue(Physics3.OFFSET_ATTITUDE_XY + idx, body.R.xy);
            va.setValue(Physics3.OFFSET_ATTITUDE_YZ + idx, body.R.yz);
            va.setValue(Physics3.OFFSET_ATTITUDE_ZX + idx, body.R.zx);

            va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
            va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
            va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);

            va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
            va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
            va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
        }
    }

    /**
     * Handler for actions to be performed after the evaluate calls.
     */
    epilog(): void {
        const varsList = this.varsList_;
        const vars = varsList.getValues();
        this.moveObjects(vars);

        // update the variables that track energy
        let pe = this.potentialOffset_;
        let re = 0;
        let te = 0;

        const bs = this.bodies_;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const b = bs[i];
            if (isFinite(b.M)) {
                re += b.rotationalEnergy();
                te += b.translationalEnergy();
            }
        }

        const fs = this.forceLaws_;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy();
        }

        varsList.setValue(Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
        varsList.setValue(Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
        varsList.setValue(Physics3.INDEX_POTENTIAL_ENERGY, pe, true);
        varsList.setValue(Physics3.INDEX_TOTAL_ENERGY, te + re + pe, true);
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
     * 
     */
    saveState(): void {
        this.recentState_ = this.varsList_.getValues();
        /*
        this.bodies_.forEach(function (b) {
            saveOldCopy(b);
        });
        */
    }

    /**
     * 
     */
    restoreState(): void {
        if (this.recentState_ != null) {
            this.varsList_.setValues(this.recentState_, true);
        }
        /*
        this.bodies_.forEach(function (b) {
            eraseOldCopy(b);
        });
        */
    }

    /**
     * 
     */
    /*
    findCollisions(collisions: Collision[], vars: number[], stepSize: number): void {
        throw new Error("TODO: findCollisions");
    }
    */
}

export default Physics3;
