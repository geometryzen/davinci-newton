import AbstractSubject from '../util/AbstractSubject';
import Collision from './Collision';
import contains from '../util/contains';
import EnergyInfo from '../model/EnergyInfo';
import Force from '../model/Force';
import ForceLaw from '../model/ForceLaw';
import remove from '../util/remove';
import RigidBody from './RigidBody';
import SimList from '../core/SimList';
import Simulation from '../core/Simulation';
import VarsList from '../core/VarsList';

const var_names = [
    'time',
    'kinetic enetry',
    'potential energy',
    'total energy'
];

const i18n_names = [
    'time',
    'kinetic enetry',
    'potential energy',
    'total energy'
];

enum Offset {
    POSITION_X = 0,
    POSITION_Y = 1,
    POSITION_Z = 2,
    ATTITUDE_A = 3,
    ATTITUDE_YZ = 4,
    ATTITUDE_ZX = 5,
    ATTITUDE_XY = 6,
    LINEAR_MOMENTUM_X = 7,
    LINEAR_MOMENTUM_Y = 8,
    LINEAR_MOMENTUM_Z = 9,
    ANGULAR_VELOCITY_YZ = 10,
    ANGULAR_VELOCITY_ZX = 11,
    ANGULAR_VELOCITY_XY = 12
}

/**
 *
 */
function getVarName(index: number, localized: boolean): string {
    switch (index) {
        case Offset.POSITION_X: return "position x";
        case Offset.POSITION_Y: return "position y";
        case Offset.POSITION_Z: return "position z";
        case Offset.ATTITUDE_A: return "attitude a";
        case Offset.ATTITUDE_YZ: return "attitude yz";
        case Offset.ATTITUDE_ZX: return "attitude zx";
        case Offset.ATTITUDE_XY: return "attitude xy";
        case Offset.LINEAR_MOMENTUM_X: return "momentum x";
        case Offset.LINEAR_MOMENTUM_Y: return "momentum y";
        case Offset.LINEAR_MOMENTUM_Z: return "momentum z";
        case Offset.ANGULAR_VELOCITY_YZ: return "angular velocity yz";
        case Offset.ANGULAR_VELOCITY_ZX: return "angular velocity zx";
        case Offset.ANGULAR_VELOCITY_XY: return "angular velocity xy";
    }
    throw new Error(`getVarName(${index})`);
}

const NUM_VARS_IN_STATE = 13;

/**
 * 
 */
export default class RigidBodySim extends AbstractSubject implements Simulation {
    /**
     * 
     */
    private simList_ = new SimList();
    /**
     * 
     */
    private varsList_: VarsList;
    //
    // What is the difference between the simList and the list of RigidBody?
    //
    /**
     * The polygons in this simulation.
     */
    private bods_: RigidBody[] = [];
    private forceLaws_: ForceLaw[] = [];
    private showForces_: boolean;
    private potentialOffset_: number;
    private recentState_: number[];

    /**
     * 
     */
    constructor(name = 'SIM') {
        super(name);
        this.varsList_ = new VarsList(var_names, i18n_names, this.getName() + '_VARS');
    }

    /**
     * 
     */
    addBody(body: RigidBody): void {
        if (!contains(this.bods_, body)) {
            // create variables in vars array for this body
            const names = [];
            for (let k = 0; k < NUM_VARS_IN_STATE; k++) {
                names.push(getVarName(k, false));
            }
            const localNames = [];
            for (let k = 0; k < NUM_VARS_IN_STATE; k++) {
                localNames.push(getVarName(k, true));
            }
            const idx = this.varsList_.addVariables(names, localNames);
            body.setVarsIndex(idx);
            // add body to end of list of bodies
            this.bods_.push(body);
            this.getSimList().add(body);
        }
        this.initializeFromBody(body);
        this.bods_.forEach(function (b) {
            // eraseOldCopy(b);
        });
    }

    /**
     * 
     */
    removeBody(body: RigidBody): void {
        if (contains(this.bods_, body)) {
            this.varsList_.deleteVariables(body.getVarsIndex(), NUM_VARS_IN_STATE);
            remove(this.bods_, body);
            body.setVarsIndex(-1);
        }
        this.getSimList().remove(body);
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
    }

    /**
     * 
     */
    addForceLaw(forceLaw: ForceLaw) {
        if (!contains(this.forceLaws_, forceLaw)) {
            this.forceLaws_.push(forceLaw);
        }
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
    }

    /**
     * 
     */
    removeForceLaw(forceLaw: ForceLaw) {
        forceLaw.disconnect();
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
        return remove(this.forceLaws_, forceLaw);
    };

    /**
     * 
     */
    private moveObjects(vars: number[]) {
        this.bods_.forEach(function (b) {
            const idx = b.getVarsIndex();
            if (idx < 0) {
                return;
            }

            // position, X (vector).
            b.X.x = vars[idx + Offset.POSITION_X];
            b.X.y = vars[idx + Offset.POSITION_Y];
            b.X.z = vars[idx + Offset.POSITION_Z];

            // attitude, R (spinor).
            b.R.a = vars[idx + Offset.ATTITUDE_A];
            b.R.xy = vars[idx + Offset.ATTITUDE_XY];
            b.R.yz = vars[idx + Offset.ATTITUDE_YZ];
            b.R.zx = vars[idx + Offset.ATTITUDE_ZX];

            // velocity, V (vector).
            b.P.x = vars[idx + Offset.LINEAR_MOMENTUM_X];
            b.P.y = vars[idx + Offset.LINEAR_MOMENTUM_Y];
            b.P.z = vars[idx + Offset.LINEAR_MOMENTUM_Z];

            // angular velocity, Ω (bivector).
            b.Ω.xy = vars[idx + Offset.ANGULAR_VELOCITY_XY];
            b.Ω.yz = vars[idx + Offset.ANGULAR_VELOCITY_YZ];
            b.Ω.zx = vars[idx + Offset.ANGULAR_VELOCITY_ZX];
        });
    }

    /**
     * The time value is not being used because the DiffEqSolver has updated the vars.
     * This will move the objects and forces will be recalculated.
     * If anything it could be passed to forceLaw.calculateForces.
     */
    evaluate(vars: number[], change: number[], time: number): void {
        // Move objects so that rigid body objects know their current state.
        this.moveObjects(vars);
        this.bods_.forEach(function (body) {
            const idx = body.getVarsIndex();
            if (idx < 0) {
                return;
            }
            const mass = body.getMass();
            if (mass === Number.POSITIVE_INFINITY) {
                for (var k = 0; k < NUM_VARS_IN_STATE; k++)
                    change[idx + k] = 0;  // infinite mass objects don't move
            }
            else {
                // The rate of change of position is the velocity.
                // dX/dt = V = P / M
                change[idx + Offset.POSITION_X] = vars[idx + Offset.LINEAR_MOMENTUM_X] / mass;
                change[idx + Offset.POSITION_Y] = vars[idx + Offset.LINEAR_MOMENTUM_Y] / mass;
                change[idx + Offset.POSITION_Z] = vars[idx + Offset.LINEAR_MOMENTUM_Z] / mass;
                // The rate of change of attitude is given by the formula.
                // dR/dt = (1/2) * Ω * R
                const Ωxy = vars[idx + Offset.ANGULAR_VELOCITY_XY];
                const Ωyz = vars[idx + Offset.ANGULAR_VELOCITY_YZ];
                const Ωzx = vars[idx + Offset.ANGULAR_VELOCITY_ZX];
                const Ra = vars[idx + Offset.ATTITUDE_A];
                const Rxy = vars[idx + Offset.ATTITUDE_XY];
                const Ryz = vars[idx + Offset.ATTITUDE_YZ];
                const Rzx = vars[idx + Offset.ATTITUDE_ZX];

                change[idx + Offset.ATTITUDE_A] = -0.5 * (Ωxy * Rxy + Ωyz * Ryz + Ωzx * Rzx);
                change[idx + Offset.ATTITUDE_XY] = 0.5 * Ωxy * Ra;
                change[idx + Offset.ATTITUDE_YZ] = 0.5 * Ωyz * Ra;
                change[idx + Offset.ATTITUDE_ZX] = 0.5 * Ωzx * Ra;

                // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
                change[idx + Offset.LINEAR_MOMENTUM_X] = 0;
                change[idx + Offset.LINEAR_MOMENTUM_Y] = 0;
                change[idx + Offset.LINEAR_MOMENTUM_Z] = 0;

                change[idx + Offset.ANGULAR_VELOCITY_XY] = 0;
                change[idx + Offset.ANGULAR_VELOCITY_YZ] = 0;
                change[idx + Offset.ANGULAR_VELOCITY_ZX] = 0;
            }
        });
        this.forceLaws_.forEach((forceLaw) => {
            // The forces will give rise to changes in both linear and angulat momentum.
            const forces = forceLaw.calculateForces();
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
    private applyForce(change: number[], force: Force) {
        const massObj: any = force.getBody();
        if (!(contains(this.bods_, massObj))) {
            return;
        }
        const body = <RigidBody>(massObj);
        const idx = body.getVarsIndex();
        if (idx < 0) {
            return;
        }
        const F = force.getVector();
        /**
         * The point of application.
         */
        const forceLoc = force.getStartPoint();

        // The rate of change of momentum is force.
        // dP/dt = F
        change[idx + Offset.LINEAR_MOMENTUM_X] += F.x;
        change[idx + Offset.LINEAR_MOMENTUM_Y] += F.y;
        change[idx + Offset.LINEAR_MOMENTUM_Z] += F.z;

        // TODO
        // The rate of change of angular velocity (bivector) is given by
        // dΩ/dt = I * dω/dt, where I is the unit pseudoscalar.
        // ω'' = r x F / I
        // const position = body.X;
        const r = forceLoc.subtract(body.X);
        const rF = r.cross(F);
        // const rx = forceLoc.x - position.x;
        // const ry = forceLoc.y - position.y;
        // const rz = forceLoc.getZ() - body.getPosition().getZ();
        change[idx + Offset.ANGULAR_VELOCITY_XY] += rF.z; // not correct
        change[idx + Offset.ANGULAR_VELOCITY_XY] += 0;
        // change[idx + RigidBodySim.VW_] += (rx * forceDir.y - ry * forceDir.x) / body.momentAboutCM();
        const torque = force.getTorque();
        if (torque !== 0) {
            // change[idx + RigidBodySim.VW_] += torque / body.momentAboutCM();
        }
        if (this.showForces_) {
            force.setExpireTime(this.getTime());
            this.getSimList().add(force);
        }
    }

    /**
     * 
     */
    getTime() {
        return this.varsList_.getTime();
    }

    /**
     * 
     */
    private initializeFromBody(body: RigidBody): void {
        // eraseOldCopy(body);
        const idx = body.getVarsIndex();
        if (idx > -1) {
            const va = this.varsList_;

            va.setValue(Offset.POSITION_X + idx, body.X.x);
            va.setValue(Offset.POSITION_Y + idx, body.X.y);
            va.setValue(Offset.POSITION_Z + idx, body.X.z);

            va.setValue(Offset.ATTITUDE_A + idx, body.R.a);
            va.setValue(Offset.ATTITUDE_XY + idx, body.R.xy);
            va.setValue(Offset.ATTITUDE_YZ + idx, body.R.yz);
            va.setValue(Offset.ATTITUDE_ZX + idx, body.R.zx);

            va.setValue(Offset.LINEAR_MOMENTUM_X + idx, body.P.x);
            va.setValue(Offset.LINEAR_MOMENTUM_Y + idx, body.P.y);
            va.setValue(Offset.LINEAR_MOMENTUM_Z + idx, body.P.z);

            va.setValue(Offset.ANGULAR_VELOCITY_XY + idx, body.Ω.xy);
            va.setValue(Offset.ANGULAR_VELOCITY_YZ + idx, body.Ω.yz);
            va.setValue(Offset.ANGULAR_VELOCITY_ZX + idx, body.Ω.zx);
        }
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
    }

    /**
     * 
     */
    modifyObjects(): void {
        const va = this.varsList_;
        const vars = va.getValues();
        this.moveObjects(vars);
        // update the variables that track energy
        const einfo = this.getEnergyInfo_(vars);
        va.setValue(1, einfo.getTranslational() + einfo.getRotational(), true);
        va.setValue(2, einfo.getPotential(), true);
        va.setValue(3, einfo.getTotalEnergy(), true);
    }

    /**
     * 
     */
    getSimList(): SimList {
        return this.simList_;
    }

    /**
     * 
     */
    getVarsList(): VarsList {
        return this.varsList_;
    }

    /**
     * 
     */
    private getEnergyInfo_(vars: number[]): EnergyInfo {
        // assumes bodies match current vars
        let pe = 0;
        let re = 0;
        let te = 0;
        this.bods_.forEach(function (b) {
            if (isFinite(b.getMass())) {
                re += b.rotationalEnergy();
                te += b.translationalEnergy();
            }
        });
        this.forceLaws_.forEach(function (forceLaw) {
            pe += forceLaw.getPotentialEnergy();
        });
        return new EnergyInfo(pe + this.potentialOffset_, te, re);
    }

    /**
     * 
     */
    saveState(): void {
        this.recentState_ = this.varsList_.getValues();
        this.bods_.forEach(function (b) {
            // saveOldCopy(b);
        });
    }

    /**
     * 
     */
    restoreState(): void {
        if (this.recentState_ != null) {
            this.varsList_.setValues(this.recentState_, true);
        }
        this.bods_.forEach(function (b) {
            // eraseOldCopy(b);
        });
    }

    /**
     * 
     */
    findCollisions(collisions: Collision[], vars: number[], stepSize: number): void {
        throw new Error("TODO: findCollisions");
    }
}
