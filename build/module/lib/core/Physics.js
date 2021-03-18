import { __extends } from "tslib";
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Unit } from '../math/Unit';
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import remove from '../util/remove';
import { SimList } from './SimList';
import { VarsList } from './VarsList';
/**
 * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * @hidden
 */
var Physics = /** @class */ (function (_super) {
    __extends(Physics, _super);
    /**
     * Constructs a Physics engine for 3D simulations.
     */
    function Physics(metric, dynamics) {
        var _this = _super.call(this) || this;
        _this.metric = metric;
        _this.dynamics = dynamics;
        /**
         *
         */
        _this.$simList = new SimList();
        /**
         * The RigidBody(s) in this simulation.
         */
        _this.$bodies = [];
        /**
         *
         */
        _this.$forceLaws = [];
        /**
         *
         */
        _this.$torqueLaws = [];
        /**
         *
         */
        _this.$constraints = [];
        /**
         *
         */
        _this.$driftLaws = [];
        /**
         *
         */
        _this.$showForces = false;
        /**
         *
         */
        _this.$showTorques = false;
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('dynamics', dynamics);
        _this.$varsList = new VarsList(dynamics.getVarNames());
        _this.$potentialOffset = metric.zero();
        _this.$force = metric.zero();
        _this.$torque = metric.zero();
        _this.$totalEnergy = metric.zero();
        _this.$totalEnergyLock = metric.lock(_this.$totalEnergy);
        _this.$numVariablesPerBody = dynamics.numVarsPerBody();
        return _this;
    }
    Object.defineProperty(Physics.prototype, "showForces", {
        /**
         * Determines whether calculated forces will be added to the simulation list.
         */
        get: function () {
            return this.$showForces;
        },
        set: function (showForces) {
            mustBeBoolean('showForces', showForces);
            this.$showForces = showForces;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Physics.prototype, "showTorques", {
        /**
         * Determines whether calculated torques will be added to the simulation list.
         */
        get: function () {
            return this.$showTorques;
        },
        set: function (showTorques) {
            mustBeBoolean('showTorques', showTorques);
            this.$showTorques = showTorques;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    Physics.prototype.addBody = function (body) {
        mustBeNonNullObject('body', body);
        if (!contains(this.$bodies, body)) {
            // const X = body.X;
            // const R = body.R;
            // const P = body.P;
            // const L = body.L;
            var dynamics = this.dynamics;
            // create variables in vars array for this body
            var names = [];
            for (var k = 0; k < this.$numVariablesPerBody; k++) {
                names.push(dynamics.getOffsetName(k));
            }
            body.varsIndex = this.$varsList.addVariables(names);
            // add body to end of list of bodies
            this.$bodies.push(body);
            this.$simList.add(body);
        }
        this.updateVarsFromBody(body);
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    Physics.prototype.removeBody = function (body) {
        mustBeNonNullObject('body', body);
        if (contains(this.$bodies, body)) {
            this.$varsList.deleteVariables(body.varsIndex, this.$numVariablesPerBody);
            remove(this.$bodies, body);
            body.varsIndex = -1;
        }
        this.$simList.remove(body);
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    Physics.prototype.addForceLaw = function (forceLaw) {
        mustBeNonNullObject('forceLaw', forceLaw);
        if (!contains(this.$forceLaws, forceLaw)) {
            this.$forceLaws.push(forceLaw);
        }
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    Physics.prototype.removeForceLaw = function (forceLaw) {
        mustBeNonNullObject('forceLaw', forceLaw);
        forceLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.$forceLaws, forceLaw);
    };
    /**
     *
     */
    Physics.prototype.addTorqueLaw = function (torqueLaw) {
        mustBeNonNullObject('torqueLaw', torqueLaw);
        if (!contains(this.$torqueLaws, torqueLaw)) {
            this.$torqueLaws.push(torqueLaw);
        }
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    Physics.prototype.removeTorqueLaw = function (torqueLaw) {
        mustBeNonNullObject('torqueLaw', torqueLaw);
        torqueLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.$torqueLaws, torqueLaw);
    };
    /**
     *
     * @param geometry
     */
    Physics.prototype.addConstraint = function (geometry) {
        mustBeNonNullObject('geometry', geometry);
        if (!contains(this.$constraints, geometry)) {
            this.$constraints.push(geometry);
        }
    };
    Physics.prototype.removeConstraint = function (geometry) {
        mustBeNonNullObject('geometry', geometry);
        remove(this.$constraints, geometry);
    };
    /**
     *
     */
    Physics.prototype.addDriftLaw = function (driftLaw) {
        mustBeNonNullObject('driftLaw', driftLaw);
        if (!contains(this.$driftLaws, driftLaw)) {
            this.$driftLaws.push(driftLaw);
        }
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    Physics.prototype.removeDriftLaw = function (driftLaw) {
        mustBeNonNullObject('driftLaw', driftLaw);
        driftLaw.disconnect();
        this.discontinuosChangeToEnergy();
        remove(this.$driftLaws, driftLaw);
    };
    Physics.prototype.discontinuosChangeToEnergy = function () {
        var _a;
        var dynamics = this.dynamics;
        (_a = this.$varsList).incrSequence.apply(_a, dynamics.discontinuousEnergyVars());
    };
    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    Physics.prototype.updateBodiesFromStateVariables = function (vars, units) {
        var dynamics = this.dynamics;
        var bodies = this.$bodies;
        var N = bodies.length;
        for (var i = 0; i < N; i++) {
            var body = bodies[i];
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            // Delegate the updating of the body from the state variables because
            // we do not know how to access the properties of the bodies in the
            // various dimensions.
            dynamics.updateBodyFromVars(vars, units, idx, body);
        }
    };
    /**
     * Handler for actions to be performed before the evaluate calls.
     * The physics engine removes objects that were temporarily added to the simulation
     * list but have expired.
     * @hidden
     */
    Physics.prototype.prolog = function () {
        this.simList.removeTemporary(this.varsList.getTime());
    };
    /**
     * Gets the state vector, Y(t).
     * The returned array is a copy of the state vector variable values.
     * However, for performance, the array is maintained between invocations.
     * @hidden
     */
    Physics.prototype.getState = function () {
        return this.$varsList.getValues();
    };
    /**
     * Sets the state vector, Y(t).
     * @hidden
     */
    Physics.prototype.setState = function (state) {
        this.varsList.setValuesContinuous(state);
    };
    Physics.prototype.getUnits = function () {
        return this.$varsList.getUnits();
    };
    Physics.prototype.setUnits = function (units) {
        this.varsList.setUnits(units);
    };
    /**
     * The time value is not being used because the DiffEqSolver has updated the vars?
     * This will move the objects and forces will be recalculated.u
     * @hidden
     */
    Physics.prototype.evaluate = function (state, stateUnits, rateOfChangeVals, rateOfChangeUoms, Δt, uomTime) {
        var metric = this.metric;
        var dynamics = this.dynamics;
        // Move objects so that rigid body objects know their current state.
        this.updateBodiesFromStateVariables(state, stateUnits);
        var bodies = this.$bodies;
        var Nb = bodies.length;
        for (var bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
            var body = bodies[bodyIndex];
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            var mass = metric.a(body.M);
            if (mass === Number.POSITIVE_INFINITY) {
                for (var k = 0; k < this.$numVariablesPerBody; k++) {
                    rateOfChangeVals[idx + k] = 0; // infinite mass objects don't move
                }
            }
            else {
                dynamics.setPositionRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, idx, body);
                dynamics.setAttitudeRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, idx, body);
                dynamics.zeroLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                dynamics.zeroAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
            }
        }
        this.applyForceLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        this.applyTorqueLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        this.applyConstraints(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        this.applyDriftLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
        rateOfChangeVals[this.$varsList.timeIndex()] = 1;
    };
    /**
     *
     * @param rateOfChange (output)
     * @param rateOfChangeUnits (output)
     * @param Δt
     * @param uomTime
     */
    Physics.prototype.applyForceLaws = function (rateOfChange, rateOfChangeUnits, Δt, uomTime) {
        var forceLaws = this.$forceLaws;
        var N = forceLaws.length;
        for (var i = 0; i < N; i++) {
            var forceLaw = forceLaws[i];
            var forces = forceLaw.updateForces();
            var Nforces = forces.length;
            for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, rateOfChangeUnits, forces[forceIndex], Δt, uomTime);
            }
        }
    };
    Physics.prototype.applyDriftLaws = function (rateOfChange, rateOfChangeUnits, Δt, uomTime) {
        var driftLaws = this.$driftLaws;
        var N = driftLaws.length;
        for (var i = 0; i < N; i++) {
            var driftLaw = driftLaws[i];
            var forces = driftLaw.updateForces();
            var Nforces = forces.length;
            for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                this.applyForce(rateOfChange, rateOfChangeUnits, forces[forceIndex], Δt, uomTime);
            }
        }
    };
    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    Physics.prototype.applyForce = function (rateOfChangeVals, rateOfChangeUoms, forceApp, Δt, uomTime) {
        var body = forceApp.getBody();
        if (!(contains(this.$bodies, body))) {
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
        forceApp.computeForce(this.$force);
        var F = this.$force;
        // TODO: We may not need to bootstrap when units are correctly handled?
        // Bootstrap the linear momentum unit of measure for the body.
        if (Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
            var uom = Unit.mul(metric.uom(F), uomTime);
            // console.lg(`Bootstrap P.uom to ${uom}`);
            metric.setUom(body.P, uom);
        }
        // TODO: Here we could apply geometric constraints on the forces.
        dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, F, uomTime);
        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        forceApp.computeTorque(this.$torque);
        var T = this.$torque;
        // TODO: We may not need to bootstrap when units are correctly handled?
        // Bootstrap the angular momentum unit of measure for the body.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            var uom = Unit.mul(metric.uom(T), uomTime);
            // console.lg(`Bootstrap L.uom to ${uom}`);
            metric.setUom(body.L, uom);
        }
        // TODO: Could we add geometric constraints for torques here?
        // TODO: we don't know how to handle the indices, so dynamics must check units compatibility.
        dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, T, uomTime);
        if (this.$showForces) {
            forceApp.expireTime = this.$varsList.getTime();
            this.$simList.add(forceApp);
        }
    };
    Physics.prototype.applyTorqueLaws = function (rateOfChange, units, Δt, uomTime) {
        var torqueLaws = this.$torqueLaws;
        var Ni = torqueLaws.length;
        for (var i = 0; i < Ni; i++) {
            var torqueLaw = torqueLaws[i];
            var torques = torqueLaw.updateTorques();
            var Nj = torques.length;
            for (var j = 0; j < Nj; j++) {
                this.applyTorque(rateOfChange, units, torques[j], Δt, uomTime);
            }
        }
    };
    /**
     *
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param torqueApp
     * @param Δt
     * @param uomTime
     * @returns
     */
    Physics.prototype.applyTorque = function (rateOfChangeVals, rateOfChangeUoms, torqueApp, Δt, uomTime) {
        var body = torqueApp.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        var idx = body.varsIndex;
        if (idx < 0) {
            return;
        }
        var metric = this.metric;
        var dynamics = this.dynamics;
        // The rate of change of angular momentum is torque.
        // dL/dt = T
        torqueApp.computeTorque(this.$torque);
        var T = this.$torque;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            var uom = Unit.mul(metric.uom(T), uomTime);
            // console.lg(`Bootstrap L.uom to ${uom}`);
            metric.setUom(body.L, uom);
        }
        dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, T, uomTime);
        // TODO: When the torque is applied away from the center of mass, do we add linear momentum?
        // The rate of change of angular momentum (bivector) is given by
        // dL/dt = r ^ F = Γ
        /*
        torqueApp.computeTorque(this.$torque);
        const T = this.$torque;
        // Bootstrap the angular momentum unit of measure.
        if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
            metric.setUom(body.L, Unit.mul(metric.uom(T), uomTime));
        }
        // TODO: Could we add geometric constraints for torques here?
        dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChange, idx, T);
        */
        if (this.$showTorques) {
            torqueApp.expireTime = this.$varsList.getTime();
            this.$simList.add(torqueApp);
        }
    };
    Physics.prototype.applyConstraints = function (rateOfChange, rateOfChangeUoms, Δt, uomTime) {
        var constraints = this.$constraints;
        var Nconstraints = constraints.length;
        for (var i = 0; i < Nconstraints; i++) {
            var constraint = constraints[i];
            this.applyConstraint(rateOfChange, rateOfChangeUoms, constraint, Δt, uomTime);
        }
    };
    Physics.prototype.applyConstraint = function (rateOfChangeVals, rateOfChangeUoms, constraint, Δt, uomTime) {
        var body = constraint.getBody();
        if (!(contains(this.$bodies, body))) {
            return;
        }
        var idx = body.varsIndex;
        if (idx < 0) {
            return;
        }
        var metric = this.metric;
        var dynamics = this.dynamics;
        // TODO: This could be a scratch variable.
        var F = metric.zero();
        var r = metric.zero();
        var B = metric.zero();
        var eΘ = metric.zero();
        var Fnew = metric.zero();
        var FnewR = metric.zero();
        var FnewΘ = metric.zero();
        var N = metric.zero();
        dynamics.getForce(rateOfChangeVals, rateOfChangeUoms, idx, F);
        var X = body.X;
        var P = body.P;
        var M = body.M;
        constraint.computeRadius(X, r);
        constraint.computeRotation(X, B);
        constraint.computeTangent(X, eΘ);
        metric.copyVector(eΘ, FnewR); // FnewR = eΘ
        metric.mul(FnewR, B); // FnewR = eΘ * B = -er
        metric.neg(FnewR); // FnewR = er (approx)
        metric.direction(FnewR); // FnewR = er 
        metric.mulByVector(FnewR, P); // FnewR = er * P
        metric.mulByVector(FnewR, P); // FnewR = er * P * P = (P * P) er
        metric.divByScalar(FnewR, metric.a(M), metric.uom(M)); // FnewR = ((P * P) / m) er
        metric.divByScalar(FnewR, metric.a(r), metric.uom(r)); // FnewR = ((P * P) / (m * r)) er
        metric.neg(FnewR); // FnewR = - ((P * P) / (m * r)) er
        metric.copyVector(F, FnewΘ); // FnewΘ = F
        metric.scp(FnewΘ, eΘ); // FnewΘ = F | eΘ
        metric.mulByVector(FnewΘ, eΘ); // FnewΘ = (F | eΘ) eΘ
        metric.copyVector(FnewR, Fnew); // Fnew = FnewR
        metric.addVector(Fnew, FnewΘ); // Fnew = FnewR + FnewΘ
        metric.copyVector(Fnew, N); // N = Fnew
        metric.subVector(N, F); // N = Fnew - F or Fnew = F + N 
        // Update the rateOfChange of Linear Momentum (force); 
        dynamics.setForce(rateOfChangeVals, rateOfChangeUoms, idx, Fnew);
        // The constraint holds the computed force so that it can be visualized.
        constraint.setForce(N);
    };
    Object.defineProperty(Physics.prototype, "time", {
        /**
         *
         */
        get: function () {
            return this.$varsList.getTime();
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    Physics.prototype.updateFromBodies = function () {
        var bodies = this.$bodies;
        var N = bodies.length;
        for (var i = 0; i < N; i++) {
            this.updateVarsFromBody(bodies[i]);
        }
        this.discontinuosChangeToEnergy();
    };
    /**
     *
     */
    Physics.prototype.updateVarsFromBody = function (body) {
        var idx = body.varsIndex;
        if (idx > -1) {
            this.dynamics.updateVarsFromBody(body, idx, this.$varsList);
        }
    };
    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     * @hidden
     */
    Physics.prototype.epilog = function () {
        var varsList = this.$varsList;
        var vars = varsList.getValues();
        var units = varsList.getUnits();
        this.updateBodiesFromStateVariables(vars, units);
        var dynamics = this.dynamics;
        dynamics.epilog(this.$bodies, this.$forceLaws, this.$potentialOffset, varsList);
    };
    Object.defineProperty(Physics.prototype, "bodies", {
        /**
         * Provides a reference to the bodies in the simulation.
         */
        get: function () {
            return this.$bodies;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Physics.prototype, "simList", {
        /**
         * @hidden
         */
        get: function () {
            return this.$simList;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Physics.prototype, "varsList", {
        /**
         * @hidden
         */
        get: function () {
            return this.$varsList;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Computes the sum of the translational and rotational kinetic energy of all bodies,
     * and the potential energy due to body interactions for the force laws.
     */
    Physics.prototype.totalEnergy = function () {
        var metric = this.metric;
        metric.unlock(this.$totalEnergy, this.$totalEnergyLock);
        // TODO: Could be more efficient...
        metric.write(metric.zero(), this.$totalEnergy);
        metric.add(this.$totalEnergy, this.$potentialOffset);
        var bs = this.$bodies;
        var Nb = bs.length;
        for (var i = 0; i < Nb; i++) {
            var body = bs[i];
            if (isFinite(metric.a(body.M))) {
                metric.add(this.$totalEnergy, body.rotationalEnergy());
                metric.add(this.$totalEnergy, body.translationalEnergy());
            }
        }
        var fs = this.$forceLaws;
        var Nf = fs.length;
        for (var i = 0; i < Nf; i++) {
            metric.add(this.$totalEnergy, fs[i].potentialEnergy());
        }
        this.$totalEnergyLock = metric.lock(this.$totalEnergy);
        return this.$totalEnergy;
    };
    return Physics;
}(AbstractSubject));
export { Physics };
