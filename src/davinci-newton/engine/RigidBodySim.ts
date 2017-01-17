import AbstractSubject from '../util/AbstractSubject';
import Collision from './Collision';
import contains from '../util/contains';
import EnergyInfo from '../model/EnergyInfo';
import ForceApp from '../model/ForceApp';
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
    ANGULAR_MOMENTUM_YZ = 10,
    ANGULAR_MOMENTUM_ZX = 11,
    ANGULAR_MOMENTUM_XY = 12
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
        case Offset.ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
        case Offset.ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
        case Offset.ANGULAR_MOMENTUM_XY: return "angular momentum xy";
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
    /**
     * The RigidBody(s) in this simulation.
     */
    private bodies_: RigidBody[] = [];
    /**
     * 
     */
    private forceLaws_: ForceLaw[] = [];

    /**
     * 
     */
    private showForces_ = false;

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
    addBody(body: RigidBody): void {
        if (!contains(this.bodies_, body)) {
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
            this.bodies_.push(body);
            this.getSimList().add(body);
        }
        this.initializeFromBody(body);
        this.bodies_.forEach(function (b) {
            // eraseOldCopy(b);
        });
    }

    /**
     * 
     */
    removeBody(body: RigidBody): void {
        if (contains(this.bodies_, body)) {
            this.varsList_.deleteVariables(body.getVarsIndex(), NUM_VARS_IN_STATE);
            remove(this.bodies_, body);
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
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private moveObjects(vars: number[]) {
        this.bodies_.forEach(function (body) {
            const idx = body.getVarsIndex();
            if (idx < 0) {
                return;
            }

            // Update state variables.
            body.X.x = vars[idx + Offset.POSITION_X];
            body.X.y = vars[idx + Offset.POSITION_Y];
            body.X.z = vars[idx + Offset.POSITION_Z];

            body.R.a = vars[idx + Offset.ATTITUDE_A];
            body.R.xy = vars[idx + Offset.ATTITUDE_XY];
            body.R.yz = vars[idx + Offset.ATTITUDE_YZ];
            body.R.zx = vars[idx + Offset.ATTITUDE_ZX];

            body.P.x = vars[idx + Offset.LINEAR_MOMENTUM_X];
            body.P.y = vars[idx + Offset.LINEAR_MOMENTUM_Y];
            body.P.z = vars[idx + Offset.LINEAR_MOMENTUM_Z];

            body.L.xy = vars[idx + Offset.ANGULAR_MOMENTUM_XY];
            body.L.yz = vars[idx + Offset.ANGULAR_MOMENTUM_YZ];
            body.L.zx = vars[idx + Offset.ANGULAR_MOMENTUM_ZX];

            // Update derived quantities (auxiliary variables).
            body.V.copy(body.P).divByScalar(body.M);
            // We must compute Iinv before computing ω!
            // TODO: body.Iinv = R(t) * Ibodyinv * transpose(R(t))
            body.ω.dual(body.L).neg().applyMatrix(body.Iinv);
            body.Ω.dual(body.ω);
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
        this.bodies_.forEach(function (body) {
            const idx = body.getVarsIndex();
            if (idx < 0) {
                return;
            }
            const mass = body.M;
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

                // The rate of change of attitude is given by: dR/dt = (1/2) * Ω * R
                // Ω and R are auxiliary variables that have already been computed.
                const R = body.R;
                const Ω = body.Ω;
                change[idx + Offset.ATTITUDE_A] = -0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                change[idx + Offset.ATTITUDE_XY] = 0.5 * Ω.xy * R.a;
                change[idx + Offset.ATTITUDE_YZ] = 0.5 * Ω.yz * R.a;
                change[idx + Offset.ATTITUDE_ZX] = 0.5 * Ω.zx * R.a;

                // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
                change[idx + Offset.LINEAR_MOMENTUM_X] = 0;
                change[idx + Offset.LINEAR_MOMENTUM_Y] = 0;
                change[idx + Offset.LINEAR_MOMENTUM_Z] = 0;

                change[idx + Offset.ANGULAR_MOMENTUM_XY] = 0;
                change[idx + Offset.ANGULAR_MOMENTUM_YZ] = 0;
                change[idx + Offset.ANGULAR_MOMENTUM_ZX] = 0;
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
    private applyForce(change: number[], forceApp: ForceApp) {
        const body = forceApp.getBody();
        if (!(contains(this.bodies_, body))) {
            return;
        }
        const idx = body.getVarsIndex();
        if (idx < 0) {
            return;
        }

        const {F, Γ} = forceApp;

        // The rate of change of momentum is force.
        // dP/dt = F
        change[idx + Offset.LINEAR_MOMENTUM_X] += F.x;
        change[idx + Offset.LINEAR_MOMENTUM_Y] += F.y;
        change[idx + Offset.LINEAR_MOMENTUM_Z] += F.z;

        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        change[idx + Offset.ANGULAR_MOMENTUM_YZ] += Γ.yz;
        change[idx + Offset.ANGULAR_MOMENTUM_ZX] += Γ.zx;
        change[idx + Offset.ANGULAR_MOMENTUM_XY] += Γ.xy;

        if (this.showForces_) {
            forceApp.setExpireTime(this.getTime());
            this.getSimList().add(forceApp);
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

            va.setValue(Offset.ANGULAR_MOMENTUM_XY + idx, body.L.xy);
            va.setValue(Offset.ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
            va.setValue(Offset.ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
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
        this.bodies_.forEach(function (b) {
            if (isFinite(b.M)) {
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
        this.bodies_.forEach(function (b) {
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
        this.bodies_.forEach(function (b) {
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
