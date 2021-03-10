import { __extends } from "tslib";
import mustBeFunction from '../checks/mustBeFunction';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import mustBeNumber from '../checks/mustBeNumber';
import { Unit } from '../math/Unit';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { assertConsistentUnits } from './assertConsistentUnits';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';
/**
 *
 */
var RigidBody = /** @class */ (function (_super) {
    __extends(RigidBody, _super);
    /**
     *
     */
    function RigidBody(metric) {
        var _this = _super.call(this) || this;
        _this.metric = metric;
        /**
         * the index into the variables array for this rigid body, or -1 if not in vars array.
         */
        _this.varsIndex_ = -1;
        _this.mass_ = metric.scalar(1);
        _this.massLock_ = metric.lock(_this.mass_);
        _this.charge_ = metric.zero();
        _this.chargeLock_ = metric.lock(_this.charge_);
        _this.position_ = metric.zero();
        _this.attitude_ = metric.scalar(1);
        _this.linearMomentum_ = metric.zero();
        _this.angularMomentum_ = metric.zero();
        _this.angularVelocity_ = metric.zero();
        _this.rotationalEnergy_ = metric.zero();
        _this.rotationalEnergyLock_ = metric.lock(_this.rotationalEnergy_);
        _this.translationalEnergy_ = metric.zero();
        _this.translationalEnergyLock_ = metric.lock(_this.translationalEnergy_);
        _this.worldPoint_ = metric.zero();
        _this.Ω_scratch = metric.zero();
        _this.centerOfMassLocal_ = metric.zero();
        _this.centerOfMassLocalLock_ = metric.lock(_this.centerOfMassLocal_);
        _this.inertiaTensorInverse_ = metric.identityMatrix();
        return _this;
    }
    Object.defineProperty(RigidBody.prototype, "centerOfMassLocal", {
        /**
         * The center of mass position vector in local coordinates.
         */
        get: function () {
            return this.centerOfMassLocal_;
        },
        set: function (centerOfMassLocal) {
            this.metric.unlock(this.centerOfMassLocal_, this.centerOfMassLocalLock_);
            this.metric.copyVector(centerOfMassLocal, this.centerOfMassLocal_);
            this.centerOfMassLocalLock_ = this.metric.lock(this.centerOfMassLocal_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "M", {
        /**
         * Mass (scalar). Default is one (1).
         * If dimensioned units are used, they must be compatible with the unit of mass.
         */
        get: function () {
            return this.mass_;
        },
        set: function (M) {
            mustBeDimensionlessOrCorrectUnits('M', M, Unit.KILOGRAM, this.metric);
            this.metric.unlock(this.mass_, this.massLock_);
            this.metric.copy(M, this.mass_);
            this.massLock_ = this.metric.lock(this.mass_);
            this.updateInertiaTensor();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "Q", {
        /**
         * Charge (scalar). Default is zero (0).
         * If dimensioned units are used, they must be compatible with the unit of electric charge.
         */
        get: function () {
            return this.charge_;
        },
        set: function (Q) {
            mustBeDimensionlessOrCorrectUnits('Q', Q, Unit.COULOMB, this.metric);
            this.metric.unlock(this.charge_, this.chargeLock_);
            this.metric.copy(Q, this.charge_);
            this.chargeLock_ = this.metric.lock(this.charge_);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates the angular velocity, Ω, bivector based upon the angular momentum.
     * Derived classes may override to provide more efficient implementations based upon symmetry.
     */
    RigidBody.prototype.updateAngularVelocity = function () {
        // In matrix notation,
        // L = I Ω => Ω = Iinv L.
        // Either the inertia tensor must be converted from local coordinates to world, or
        // we convert L to local coordinates, apply the local inertial tensor and then rotate
        // Ω back to world coordinates.
        // Notice that in the following we avoid creating temporary variables by computing
        // the reversion of the mutable body.R twice.
        this.metric.copy(this.L, this.Ω); // Ω contains L
        this.metric.rev(this.R);
        this.metric.rotate(this.Ω, this.R); // Ω contains R L ~R
        this.metric.copy(this.Ω, this.Ω_scratch); // scratch contains R L ~R
        this.metric.applyMatrix(this.Ω_scratch, this.Iinv); // scratch contains Iinv (R L ~R)
        this.metric.copyBivector(this.Ω_scratch, this.Ω); // Ω contains Iinv (R L ~R)
        this.metric.rev(this.R);
        this.metric.rotate(this.Ω, this.R); // Ω contains R (Iinv (R L ~R)) ~R
    };
    /**
     * Derived classes should override.
     */
    RigidBody.prototype.updateInertiaTensor = function () {
        // Do nothing.
    };
    Object.defineProperty(RigidBody.prototype, "I", {
        /**
         * Inertia Tensor (in body coordinates) (3x3 matrix).
         */
        get: function () {
            return this.metric.invertMatrix(this.inertiaTensorInverse_);
        },
        /**
         * Sets the Inertia Tensor (in local coordinates) (3x3 matrix), and computes the inverse.
         */
        set: function (I) {
            this.inertiaTensorInverse_ = this.metric.invertMatrix(I);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "Iinv", {
        /**
         * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
         */
        get: function () {
            return this.inertiaTensorInverse_;
        },
        set: function (source) {
            mustBeNonNullObject('Iinv', source);
            mustBeNumber('dimensions', source.dimensions);
            mustBeFunction('getElement', source.getElement);
            this.inertiaTensorInverse_ = this.metric.copyMatrix(source);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "X", {
        /**
         * Position (vector).
         * If dimensioned units are used, they must be compatible with the unit of length.
         */
        get: function () {
            return this.position_;
        },
        set: function (position) {
            mustBeDimensionlessOrCorrectUnits('position', position, Unit.METER, this.metric);
            this.metric.copy(position, this.position_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "R", {
        /**
         * Attitude (spinor).
         * Effects a rotation from local coordinates to world coordinates.
         */
        get: function () {
            return this.attitude_;
        },
        set: function (attitude) {
            mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit.ONE, this.metric);
            this.metric.copy(attitude, this.attitude_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "P", {
        /**
         * Linear momentum (vector).
         * If dimensioned units are used, they must be compatible with the unit of momentum.
         */
        get: function () {
            return this.linearMomentum_;
        },
        set: function (momentum) {
            mustBeDimensionlessOrCorrectUnits('momentum', momentum, Unit.KILOGRAM_METER_PER_SECOND, this.metric);
            this.metric.copy(momentum, this.linearMomentum_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "L", {
        /**
         * Angular momentum (bivector) in world coordinates.
         * If dimensioned units are used, they must be compatible with the unit of angular momentum.
         */
        get: function () {
            return this.angularMomentum_;
        },
        set: function (angularMomentum) {
            mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit.JOULE_SECOND, this.metric);
            this.metric.copy(angularMomentum, this.angularMomentum_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "\u03A9", {
        /**
         * Angular velocity (bivector).
         * If dimensioned units are used, they must be compatible with the unit of angular velocity.
         */
        get: function () {
            // A getter is required in order to support the setter existence.
            return this.angularVelocity_;
        },
        set: function (angularVelocity) {
            mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit.INV_SECOND, this.metric);
            // A setter is used so that assignments do not cause the member vaiable to become immutable.
            this.metric.copy(angularVelocity, this.angularVelocity_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "expireTime", {
        /**
         *
         */
        get: function () {
            return Number.POSITIVE_INFINITY;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "varsIndex", {
        /**
         *
         */
        get: function () {
            return this.varsIndex_;
        },
        set: function (index) {
            this.varsIndex_ = index;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * In the following formula, notice the reversion on either Ω or L.
     * Geometrically, this means we depend on the cosine of the angle between the bivectors, since
     * A * ~B = |A||B|cos(...).
     * (1/2) Ω * ~L(Ω) = (1/2) ~Ω * L(Ω) = (1/2) ω * J(ω), where * means scalar product (equals dot product for vectors).
     */
    RigidBody.prototype.rotationalEnergy = function () {
        assertConsistentUnits('Ω', this.Ω, 'L', this.L, this.metric);
        this.metric.unlock(this.rotationalEnergy_, this.rotationalEnergyLock_);
        this.metric.copyBivector(this.Ω, this.rotationalEnergy_); // rotationalEnergy contains Ω.
        this.metric.rev(this.rotationalEnergy_); // rotationalEnergy contains ~Ω.
        this.metric.scp(this.rotationalEnergy_, this.L); // rotationalEnergy contains ~Ω * L, where * means scalar product.
        this.metric.mulByNumber(this.rotationalEnergy_, 0.5);
        this.rotationalEnergyLock_ = this.metric.lock(this.rotationalEnergy_);
        return this.rotationalEnergy_;
    };
    /**
     * (1/2) (P * P) / M
     */
    RigidBody.prototype.translationalEnergy = function () {
        assertConsistentUnits('M', this.M, 'P', this.P, this.metric);
        this.metric.unlock(this.translationalEnergy_, this.translationalEnergyLock_);
        this.metric.copyVector(this.P, this.translationalEnergy_); // translationalEnergy contains P.
        this.metric.mulByVector(this.translationalEnergy_, this.P); // translationalEnergy contains P * P.
        this.metric.divByScalar(this.translationalEnergy_, this.metric.a(this.M), this.metric.uom(this.M)); // translationalEnergy contains P * P / M.
        this.metric.mulByNumber(this.translationalEnergy_, 0.5);
        this.translationalEnergyLock_ = this.metric.lock(this.translationalEnergy_);
        return this.translationalEnergy_;
    };
    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    RigidBody.prototype.localPointToWorldPoint = function (localPoint, worldPoint) {
        // Note: It appears that we might be able to use the worldPoint argument as a scratch variable.
        // However, it may not have all the features that we need for the intermediate operations.
        this.metric.copyVector(localPoint, this.worldPoint_);
        this.metric.subVector(this.worldPoint_, this.centerOfMassLocal_);
        this.metric.rotate(this.worldPoint_, this.attitude_);
        this.metric.addVector(this.worldPoint_, this.position_);
        this.metric.writeVector(this.worldPoint_, worldPoint);
    };
    return RigidBody;
}(AbstractSimObject));
export { RigidBody };
