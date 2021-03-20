import { __extends } from "tslib";
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Unit } from '../math/Unit';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { assertConsistentUnits } from './assertConsistentUnits';
import { LockableMeasure } from './LockableMeasure';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';
/**
 * @hidden
 */
var RigidBody = /** @class */ (function (_super) {
    __extends(RigidBody, _super);
    /**
     * @param metric
     */
    function RigidBody(metric) {
        var _this = _super.call(this) || this;
        _this.metric = metric;
        /**
         * the index into the variables array for this rigid body, or -1 if not in vars array.
         */
        _this.varsIndex_ = -1;
        mustBeNonNullObject('metric', metric);
        _this.$mass = new LockableMeasure(metric, metric.scalar(1));
        _this.$charge = new LockableMeasure(metric, metric.zero());
        _this.$X = metric.zero();
        _this.$R = metric.scalar(1);
        _this.$P = metric.zero();
        _this.$L = metric.zero();
        _this.$Ω = metric.zero();
        _this.$rotationalEnergy = new LockableMeasure(metric, metric.zero());
        _this.$translationalEnergy = new LockableMeasure(metric, metric.zero());
        _this.$worldPoint = metric.zero();
        _this.Ω_scratch = metric.zero();
        _this.$centerOfMassLocal = new LockableMeasure(metric, metric.zero());
        _this.$inertiaTensorInverse = metric.identityMatrix();
        return _this;
    }
    Object.defineProperty(RigidBody.prototype, "centerOfMassLocal", {
        /**
         * The center of mass position vector in local coordinates.
         */
        get: function () {
            return this.$centerOfMassLocal.get();
        },
        set: function (centerOfMassLocal) {
            mustBeDimensionlessOrCorrectUnits('centerOfMassLocal', centerOfMassLocal, Unit.METER, this.metric);
            this.$centerOfMassLocal.set(centerOfMassLocal);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "M", {
        /**
         * Mass (scalar). Default is one (1).
         * If dimensioned units are used, they must be compatible with the unit of mass.
         * M is immutable but the property may be reassigned.
         */
        get: function () {
            return this.$mass.get();
        },
        set: function (M) {
            mustBeDimensionlessOrCorrectUnits('M', M, Unit.KILOGRAM, this.metric);
            this.$mass.set(M);
            this.updateInertiaTensor();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "Q", {
        /**
         * Charge (scalar). Default is zero (0).
         * If dimensioned units are used, they must be compatible with the unit of electric charge.
         * Q is immutable but the property may be reassigned.
         */
        get: function () {
            return this.$charge.get();
        },
        set: function (Q) {
            mustBeDimensionlessOrCorrectUnits('Q', Q, Unit.COULOMB, this.metric);
            this.$charge.set(Q);
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
        this.metric.copy(this.L, this.Ω); // Ω = L
        this.metric.rev(this.R); // R = ~R
        this.metric.rotate(this.Ω, this.R); // Ω contains R L ~R ...  ~R L R ?
        this.metric.copy(this.Ω, this.Ω_scratch); // scratch contains R L ~R ... ~R L R
        this.metric.applyMatrix(this.Ω_scratch, this.Iinv); // scratch contains Iinv (R L ~R) ... Iinv (~R L R)
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
            return this.metric.invertMatrix(this.$inertiaTensorInverse);
        },
        /**
         * Sets the Inertia Tensor (in local coordinates) (3x3 matrix), and computes the inverse.
         */
        set: function (I) {
            this.$inertiaTensorInverse = this.metric.invertMatrix(I);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "Iinv", {
        /**
         * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
         */
        get: function () {
            return this.$inertiaTensorInverse;
        },
        set: function (source) {
            mustBeNonNullObject('Iinv', source);
            mustBeNumber('dimensions', source.dimensions);
            mustBeFunction('getElement', source.getElement);
            this.$inertiaTensorInverse = this.metric.copyMatrix(source);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "X", {
        /**
         * Position (vector).
         * If dimensioned units are used, they must be compatible with the unit of length.
         * X is mutable with copy-on-set.
         */
        get: function () {
            return this.$X;
        },
        set: function (position) {
            var metric = this.metric;
            mustBeDimensionlessOrCorrectUnits('position', position, Unit.METER, metric);
            metric.copy(position, this.$X);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "R", {
        /**
         * Attitude (spinor).
         * Effects a rotation from local coordinates to world coordinates.
         * R is mutable with copy-on-set.
         */
        get: function () {
            return this.$R;
        },
        set: function (attitude) {
            mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit.ONE, this.metric);
            this.metric.copy(attitude, this.$R);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "P", {
        /**
         * Linear momentum (vector).
         * If dimensioned units are used, they must be compatible with the unit of momentum.
         * P is mutable with copy-on-set.
         */
        get: function () {
            return this.$P;
        },
        set: function (momentum) {
            mustBeDimensionlessOrCorrectUnits('momentum', momentum, Unit.KILOGRAM_METER_PER_SECOND, this.metric);
            this.metric.copy(momentum, this.$P);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "L", {
        /**
         * Angular momentum (bivector) in world coordinates.
         * If dimensioned units are used, they must be compatible with the unit of angular momentum.
         * L is mutable with copy-on-set.
         */
        get: function () {
            return this.$L;
        },
        set: function (angularMomentum) {
            mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit.JOULE_SECOND, this.metric);
            this.metric.copy(angularMomentum, this.$L);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RigidBody.prototype, "\u03A9", {
        /**
         * Angular velocity (bivector).
         * If dimensioned units are used, they must be compatible with the unit of angular velocity.
         * Ω is mutable with copy-on-set.
         */
        get: function () {
            // A getter is required in order to support the setter existence.
            return this.$Ω;
        },
        set: function (angularVelocity) {
            mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit.INV_SECOND, this.metric);
            this.metric.copy(angularVelocity, this.$Ω);
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
         * @hidden
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
        var E = this.$rotationalEnergy.unlock();
        this.metric.copyBivector(this.Ω, E); // E contains Ω.
        this.metric.rev(E); // E contains ~Ω.
        this.metric.scp(E, this.L); // E contains ~Ω * L, where * means scalar product.
        this.metric.mulByNumber(E, 0.5); // E contains (1/2) ~Ω * L
        return this.$rotationalEnergy.lock();
    };
    /**
     * (1/2) (P * P) / M
     */
    RigidBody.prototype.translationalEnergy = function () {
        assertConsistentUnits('M', this.M, 'P', this.P, this.metric);
        var E = this.$translationalEnergy.unlock();
        this.metric.copyVector(this.P, E); // E contains P.
        this.metric.mulByVector(E, this.P); // E contains P * P.
        this.metric.divByScalar(E, this.metric.a(this.M), this.metric.uom(this.M)); // E contains P * P / M.
        this.metric.mulByNumber(E, 0.5); // E contains (1/2) P * P / M.
        return this.$translationalEnergy.lock();
    };
    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     *
     * @param localPoint (input)
     * @param worldPoint (output)
     */
    RigidBody.prototype.localPointToWorldPoint = function (localPoint, worldPoint) {
        // Note: It appears that we might be able to use the worldPoint argument as a scratch variable.
        // However, it may not have all the features that we need for the intermediate operations.
        this.metric.copyVector(localPoint, this.$worldPoint);
        this.metric.subVector(this.$worldPoint, this.centerOfMassLocal);
        this.metric.rotate(this.$worldPoint, this.R);
        try {
            this.metric.addVector(this.$worldPoint, this.X);
        }
        catch (e) {
            var cause = (e instanceof Error) ? e.message : "" + e;
            throw new Error(this.$worldPoint + " + " + this.X + " is not allowed. Cause: " + cause);
        }
        this.metric.writeVector(this.$worldPoint, worldPoint);
    };
    return RigidBody;
}(AbstractSimObject));
export { RigidBody };
