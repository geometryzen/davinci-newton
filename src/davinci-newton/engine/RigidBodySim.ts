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
import Vector from '../math/Vector';

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

/**
 * 
 */
export default class RigidBodySim extends AbstractSubject implements Simulation {
    private static X_ = 0;
    private static VX_ = 1;
    private static Y_ = 2;
    private static VY_ = 3;
    private static W_ = 4;
    private static VW_ = 5;
    private simList_ = new SimList();
    private varsList_ = new VarsList(var_names, i18n_names, this.getName() + '_VARS');
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
    constructor(name = 'SIM') {
        super(name);
    }
    addBody(body: RigidBody): void {
        if (!contains(this.bods_, body)) {
            // create 6 variables in vars array for this body
            const names = [];
            for (let k = 0; k < 6; k++) {
                names.push(body.getVarName(k, false));
            }
            const localNames = [];
            for (let k = 0; k < 6; k++) {
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
    removeBody(body: RigidBody): void {
        if (contains(this.bods_, body)) {
            this.varsList_.deleteVariables(body.getVarsIndex(), 6);
            remove(this.bods_, body);
            body.setVarsIndex(-1);
        }
        this.getSimList().remove(body);
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
    }
    addForceLaw(forceLaw: ForceLaw) {
        if (!contains(this.forceLaws_, forceLaw)) {
            this.forceLaws_.push(forceLaw);
        }
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
    }
    removeForceLaw(forceLaw: ForceLaw) {
        forceLaw.disconnect();
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
        return remove(this.forceLaws_, forceLaw);
    };

    private moveObjects(vars: number[]) {
        this.bods_.forEach(function (b) {
            const idx = b.getVarsIndex();
            if (idx < 0) {
                return;
            }
            // This actually sets position and attitude.
            b.setPosition(new Vector(vars[idx + RigidBodySim.X_], vars[idx + RigidBodySim.Y_]), vars[idx + RigidBodySim.W_]);
            // This actually sets velocity and angular velocity.
            b.setVelocity(new Vector(vars[idx + RigidBodySim.VX_], vars[idx + RigidBodySim.VY_]), vars[idx + RigidBodySim.VW_]);
        });
        /*
        if (this.debugPaint_ != null) {
            this.debugPaint_();
        }
        */
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
            if (idx < 0)
                return;
            const mass = body.getMass();
            if (mass === Number.POSITIVE_INFINITY) {
                for (var k = 0; k < 6; k++)
                    change[idx + k] = 0;  // infinite mass objects don't move
            }
            else {
                // The change in position is the velocity.
                change[idx + RigidBodySim.X_] = vars[idx + RigidBodySim.VX_];
                change[idx + RigidBodySim.Y_] = vars[idx + RigidBodySim.VY_];
                // The change in attitude is the angular velocity.
                change[idx + RigidBodySim.W_] = vars[idx + RigidBodySim.VW_];
                // The change in linear and angular momentum are set to zero, ready for accumulation.
                change[idx + RigidBodySim.VX_] = 0;
                change[idx + RigidBodySim.VY_] = 0;
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
        // w'' = R x F / I
        const rx = forceLoc.getX() - body.getPosition().getX();
        const ry = forceLoc.getY() - body.getPosition().getY();
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

    getTime() {
        return this.varsList_.getTime();
    }

    private initializeFromBody(body: RigidBody): void {
        body.eraseOldCopy();
        const idx = body.getVarsIndex();
        if (idx > -1) {
            const va = this.varsList_;
            va.setValue(RigidBodySim.X_ + idx, body.getPosition().getX());
            va.setValue(RigidBodySim.Y_ + idx, body.getPosition().getY());
            va.setValue(RigidBodySim.W_ + idx, body.getAngle());
            va.setValue(RigidBodySim.VX_ + idx, body.getVelocity().getX());
            va.setValue(RigidBodySim.VY_ + idx, body.getVelocity().getY());
            va.setValue(RigidBodySim.VW_ + idx, body.getAngularVelocity());
        }
        // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
        this.getVarsList().incrSequence(1, 2, 3);
    }
    modifyObjects() {
        const va = this.varsList_;
        const vars = va.getValues();
        this.moveObjects(vars);
        // update the variables that track energy
        const einfo = this.getEnergyInfo_(vars);
        va.setValue(1, einfo.getTranslational() + einfo.getRotational(), true);
        va.setValue(2, einfo.getPotential(), true);
        va.setValue(3, einfo.getTotalEnergy(), true);
    };
    getSimList(): SimList {
        return this.simList_;
    }
    getVarsList(): VarsList {
        return this.varsList_;
    }
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
    saveState(): void {
        this.recentState_ = this.varsList_.getValues();
        this.bods_.forEach(function (b) {
            b.saveOldCopy();
        });
    }
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
