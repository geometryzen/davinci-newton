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

const NUM_VARS_IN_STATE = 8;

/**
 * 
 */
export default class RigidBodySim extends AbstractSubject implements Simulation {
    private static X_ = 0;
    private static Y_ = 1;
    private static Z_ = 2;
    private static VX_ = 3;
    private static VY_ = 4;
    private static VZ_ = 5;
    private static W_ = 6;
    private static VW_ = 7;
    private simList_ = new SimList();
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
                names.push(body.getVarName(k, false));
            }
            const localNames = [];
            for (let k = 0; k < NUM_VARS_IN_STATE; k++) {
                localNames.push(body.getVarName(k, true));
            }
            const idx = this.varsList_.addVariables(names, localNames);
            body.setVarsIndex(idx);
            // add body to end of list of bodies
            this.bods_.push(body);
            this.getSimList().add(body);
        }
        this.initializeFromBody(body);
        this.bods_.forEach(function (b) {
            b.eraseOldCopy();
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
            // This actually sets position and attitude.
            const x = vars[idx + RigidBodySim.X_];
            const y = vars[idx + RigidBodySim.Y_];
            const z = vars[idx + RigidBodySim.Z_];
            b.setPosition(x, y, z);
            b.setAttitude(vars[idx + RigidBodySim.W_]);
            // This actually sets velocity and angular velocity.
            const vx = vars[idx + RigidBodySim.VX_];
            const vy = vars[idx + RigidBodySim.VY_];
            const vz = vars[idx + RigidBodySim.VZ_];
            b.setVelocity(vx, vy, vz);
            b.setAngularVelocity(vars[idx + RigidBodySim.VW_]);
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
                // The change in position is the velocity.
                change[idx + RigidBodySim.X_] = vars[idx + RigidBodySim.VX_];
                change[idx + RigidBodySim.Y_] = vars[idx + RigidBodySim.VY_];
                change[idx + RigidBodySim.Z_] = vars[idx + RigidBodySim.VZ_];
                // The change in attitude is the angular velocity.
                change[idx + RigidBodySim.W_] = vars[idx + RigidBodySim.VW_];
                // The change in linear and angular momentum are set to zero, ready for accumulation.
                change[idx + RigidBodySim.VX_] = 0;
                change[idx + RigidBodySim.VY_] = 0;
                change[idx + RigidBodySim.VZ_] = 0;

                change[idx + RigidBodySim.VW_] = 0;
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
        const forceDir = force.getVector();
        /**
         * The point of application.
         */
        const forceLoc = force.getStartPoint();
        const mass = body.getMass();

        change[idx + RigidBodySim.VX_] += forceDir.getX() / mass;
        change[idx + RigidBodySim.VY_] += forceDir.getY() / mass;
        change[idx + RigidBodySim.VZ_] += forceDir.getZ() / mass;

        // w'' = R x F / I
        const position = body.getPosition();
        const rx = forceLoc.getX() - position.x;
        const ry = forceLoc.getY() - position.y;
        // const rz = forceLoc.getZ() - body.getPosition().getZ();
        change[idx + RigidBodySim.VW_] += (rx * forceDir.getY() - ry * forceDir.getX()) / body.momentAboutCM();
        const torque = force.getTorque();
        if (torque !== 0) {
            change[idx + RigidBodySim.VW_] += torque / body.momentAboutCM();
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
        body.eraseOldCopy();
        const idx = body.getVarsIndex();
        if (idx > -1) {
            const va = this.varsList_;

            const position = body.getPosition();
            va.setValue(RigidBodySim.X_ + idx, position.x);
            va.setValue(RigidBodySim.Y_ + idx, position.y);
            va.setValue(RigidBodySim.Z_ + idx, position.z);

            va.setValue(RigidBodySim.W_ + idx, body.getAttitude());

            const velocity = body.getVelocity();
            va.setValue(RigidBodySim.VX_ + idx, velocity.x);
            va.setValue(RigidBodySim.VY_ + idx, velocity.y);
            va.setValue(RigidBodySim.VZ_ + idx, velocity.z);

            va.setValue(RigidBodySim.VW_ + idx, body.getAngularVelocity());
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
            b.saveOldCopy();
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
            b.eraseOldCopy();
        });
    }

    /**
     * 
     */
    findCollisions(collisions: Collision[], vars: number[], stepSize: number): void {
        throw new Error("TODO: findCollisions");
    }
}
