import { __extends } from "tslib";
import SimList from './SimList';
import { VarsList } from './VarsList';
import { Unit } from '../math/Unit';
import AbstractSubject from '../util/AbstractSubject';
import contains from '../util/contains';
import remove from '../util/remove';
/**
 * <p>
 * The Physics2 engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * </p>
 */
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    /**
     * Constructs a Physics engine for 3D simulations.
     */
    function State(metric, dynamics) {
        var _this = _super.call(this) || this;
        _this.metric = metric;
        _this.dynamics = dynamics;
        /**
         *
         */
        _this.simList_ = new SimList();
        /**
         * The RigidBody(s) in this simulation.
         */
        _this.bodies_ = [];
        /**
         *
         */
        _this.forceLaws_ = [];
        /**
         *
         */
        _this.showForces_ = false;
        _this.varsList_ = new VarsList(dynamics.getVarNames());
        _this.potentialOffset_ = metric.zero();
        _this.force_ = metric.zero();
        _this.torque_ = metric.zero();
        _this.totalEnergy_ = metric.zero();
        _this.totalEnergyLock_ = metric.lock(_this.totalEnergy_);
        _this.numVariablesPerBody = dynamics.numVariablesPerBody();
        return _this;
    }
    Object.defineProperty(State.prototype, "showForces", {
        /**
         * Determines whether calculated forces will be added to the simulation list.
         */
        get: function () {
            return this.showForces_;
        },
        set: function (showForces) {
            this.showForces_ = showForces;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    State.prototype.addBody = function (body) {
        if (!contains(this.bodies_, body)) {
            var dynamics = this.dynamics;
            // create variables in vars array for this body
            var names = [];
            for (var k = 0; k < this.numVariablesPerBody; k++) {
                names.push(dynamics.getOffsetName(k));
            }
            body.varsIndex = this.varsList_.addVariables(names);
            // add body to end of list of bodies
            this.bodies_.push(body);
            this.simList_.add(body);
        }
        this.updateFromBody(body);
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    State.prototype.removeBody = function (body) {
        if (contains(this.bodies_, body)) {
            this.varsList_.deleteVariables(body.varsIndex, this.numVariablesPerBody);
            remove(this.bodies_, body);
            body.varsIndex = -1;
        }
        this.simList_.remove(body);
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    State.prototype.addForceLaw = function (forceLaw) {
        if (!contains(this.forceLaws_, forceLaw)) {
            this.forceLaws_.push(forceLaw);
        }
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    State.prototype.removeForceLaw = function (forceLaw) {
        forceLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.forceLaws_, forceLaw);
    };
    State.prototype.discontinuosChangeToEnergy = function () {
        var _a;
        var dynamics = this.dynamics;
        (_a = this.varsList_).incrSequence.apply(_a, dynamics.discontinuousEnergyVariables());
    };
    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    State.prototype.updateBodies = function (vars) {
        var dynamics = this.dynamics;
        var bodies = this.bodies_;
        var N = bodies.length;
        for (var i = 0; i < N; i++) {
            var body = bodies[i];
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            // Update state variables.
            dynamics.updateBody(vars, idx, body);
        }
    };
    /**
     * Handler for actions to be performed before the evaluate calls.
     * The physics engine removes objects that were temporarily added to the simulation
     * list but have expired.
     */
    State.prototype.prolog = function () {
        this.simList.removeTemporary(this.varsList.getTime());
    };
    /**
     * Gets the state vector, Y(t).
     */
    State.prototype.getState = function () {
        return this.varsList_.getValues();
    };
    /**
     * Sets the state vector, Y(t).
     */
    State.prototype.setState = function (state) {
        this.varsList.setValues(state, true);
    };
    /**
     * The time value is not being used because the DiffEqSolver has updated the vars.
     * This will move the objects and forces will be recalculated.
     * If anything it could be passed to forceLaw.updateForces.
     */
    State.prototype.evaluate = function (state, rateOfChange, Δt, uomTime) {
        var metric = this.metric;
        var dynamics = this.dynamics;
        // Move objects so that rigid body objects know their current state.
        this.updateBodies(state);
        var bodies = this.bodies_;
        var Nb = bodies.length;
        for (var bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
            var body = bodies[bodyIndex];
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            var mass = metric.a(body.M);
            if (mass === Number.POSITIVE_INFINITY) {
                for (var k = 0; k < this.numVariablesPerBody; k++) {
                    rateOfChange[idx + k] = 0; // infinite mass objects don't move
                }
            }
            else {
                dynamics.setPositionRateOfChange(rateOfChange, idx, body);
                dynamics.setAttitudeRateOfChange(rateOfChange, idx, body);
                dynamics.zeroLinearMomentum(rateOfChange, idx);
                dynamics.zeroAngularMomentum(rateOfChange, idx);
            }
        }
        var forceLaws = this.forceLaws_;
        var Nlaws = forceLaws.length;
        for (var lawIndex = 0; lawIndex < Nlaws; lawIndex++) {
            var forceLaw = forceLaws[lawIndex];
            // The forces will give rise to changes in both linear and angular momentum.
            var forces = forceLaw.updateForces();
            var Nforces = forces.length;
            for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, forces[forceIndex], Δt, uomTime);
            }
        }
        rateOfChange[this.varsList_.timeIndex()] = 1; // time variable
        return null;
    };
    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChange The (output) rate of change of the state variables.
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    State.prototype.applyForce = function (rateOfChange, forceApp, Δt, uomTime) {
        var body = forceApp.getBody();
        if (!(contains(this.bodies_, body))) {
            return;
        }
        var idx = body.varsIndex;
        if (idx < 0) {
            return;
        }
        var metric = this.metric;
        var dynamics = this.dynamics;
        // The rate of change of momentum is force.
        // dP/dt = F
        forceApp.computeForce(this.force_);
        var F = this.force_;
        // Bootstrap the linear momentum unit of measure.
        if (Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
            metric.setUom(body.P, Unit.mul(metric.uom(F), uomTime));
        }
        dynamics.addForce(rateOfChange, idx, F);
        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.torque_);
        var T = this.torque_;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            metric.setUom(body.L, Unit.mul(metric.uom(T), uomTime));
        }
        dynamics.addTorque(rateOfChange, idx, T);
        if (this.showForces_) {
            forceApp.expireTime = this.varsList_.getTime();
            this.simList_.add(forceApp);
        }
    };
    Object.defineProperty(State.prototype, "time", {
        /**
         *
         */
        get: function () {
            return this.varsList_.getTime();
        },
        enumerable: false,
        configurable: true
    });
    State.prototype.updateFromBodies = function () {
        var bodies = this.bodies_;
        var N = bodies.length;
        for (var i = 0; i < N; i++) {
            this.updateFromBody(bodies[i]);
        }
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    State.prototype.updateFromBody = function (body) {
        var idx = body.varsIndex;
        if (idx > -1) {
            this.dynamics.updateVarsFromBody(body, idx, this.varsList_);
        }
    };
    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     */
    State.prototype.epilog = function () {
        var varsList = this.varsList_;
        var vars = varsList.getValues();
        this.updateBodies(vars);
        var dynamics = this.dynamics;
        dynamics.epilog(this.bodies_, this.forceLaws_, this.potentialOffset_, varsList);
    };
    Object.defineProperty(State.prototype, "bodies", {
        /**
         * Provides a reference to the bodies in the simulation.
         */
        get: function () {
            return this.bodies_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "simList", {
        /**
         *
         */
        get: function () {
            return this.simList_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "varsList", {
        /**
         *
         */
        get: function () {
            return this.varsList_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Computes the sum of the translational and rotational kinetic energy of all bodies,
     * and the potential energy due to body interactions for the force laws.
     */
    State.prototype.totalEnergy = function () {
        var metric = this.metric;
        metric.unlock(this.totalEnergy_, this.totalEnergyLock_);
        // TODO: Could be more efficient...
        metric.write(metric.zero(), this.totalEnergy_);
        metric.add(this.totalEnergy_, this.potentialOffset_);
        var bs = this.bodies_;
        var Nb = bs.length;
        for (var i = 0; i < Nb; i++) {
            var body = bs[i];
            if (isFinite(metric.a(body.M))) {
                metric.add(this.totalEnergy_, body.rotationalEnergy());
                metric.add(this.totalEnergy_, body.translationalEnergy());
            }
        }
        var fs = this.forceLaws_;
        var Nf = fs.length;
        for (var i = 0; i < Nf; i++) {
            metric.add(this.totalEnergy_, fs[i].potentialEnergy());
        }
        this.totalEnergyLock_ = metric.lock(this.totalEnergy_);
        return this.totalEnergy_;
    };
    return State;
}(AbstractSubject));
export { State };
