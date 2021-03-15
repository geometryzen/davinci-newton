import { __extends } from "tslib";
import { Unit } from '../math/Unit';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { assertConsistentUnits } from './assertConsistentUnits';
import { LockableMeasure } from './LockableMeasure';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';
/**
 * @hidden
 */
var Spring = /** @class */ (function (_super) {
    __extends(Spring, _super);
    /**
     *
     */
    function Spring(body1, body2) {
        var _this = _super.call(this) || this;
        _this.body1 = body1;
        _this.body2 = body2;
        /**
         *
         */
        _this.forces = [];
        _this.metric = body1.metric;
        var metric = _this.metric;
        _this.$restLength = metric.scalar(1);
        _this.$restLengthLock = metric.lock(_this.$restLength);
        _this.$springConstant = new LockableMeasure(metric, metric.scalar(1));
        _this.attach1_ = metric.zero();
        _this.attach1Lock = metric.lock(_this.attach1_);
        _this.attach2_ = metric.zero();
        _this.attach2Lock = metric.lock(_this.attach2_);
        _this.end1_ = metric.zero();
        _this.end1Lock_ = metric.lock(_this.end1_);
        _this.end2_ = metric.zero();
        _this.end2Lock_ = metric.lock(_this.end2_);
        _this.F1 = metric.createForce(_this.body1);
        _this.F1.locationCoordType = WORLD;
        _this.F1.vectorCoordType = WORLD;
        _this.F2 = metric.createForce(_this.body2);
        _this.F2.locationCoordType = WORLD;
        _this.F2.vectorCoordType = WORLD;
        _this.potentialEnergy_ = metric.zero();
        _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
        _this.forces = [_this.F1, _this.F2];
        return _this;
    }
    Object.defineProperty(Spring.prototype, "restLength", {
        get: function () {
            return this.$restLength;
        },
        set: function (restLength) {
            mustBeDimensionlessOrCorrectUnits('restLength', restLength, Unit.METER, this.metric);
            this.metric.unlock(this.$restLength, this.$restLengthLock);
            this.metric.copy(restLength, this.$restLength);
            this.$restLengthLock = this.metric.lock(this.$restLength);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "k", {
        get: function () {
            return this.$springConstant.get();
        },
        set: function (k) {
            mustBeDimensionlessOrCorrectUnits('k', k, Unit.STIFFNESS, this.metric);
            this.$springConstant.set(k);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "springConstant", {
        get: function () {
            return this.$springConstant.get();
        },
        set: function (springConstant) {
            mustBeDimensionlessOrCorrectUnits('springConstant', springConstant, Unit.STIFFNESS, this.metric);
            this.$springConstant.set(springConstant);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "stiffness", {
        get: function () {
            return this.$springConstant.get();
        },
        set: function (stiffness) {
            mustBeDimensionlessOrCorrectUnits('stiffness', stiffness, Unit.STIFFNESS, this.metric);
            this.$springConstant.set(stiffness);
        },
        enumerable: false,
        configurable: true
    });
    Spring.prototype.computeBody1AttachPointInWorldCoords = function (x) {
        if (this.attach1_ == null || this.body1 == null) {
            throw new Error();
        }
        this.body1.localPointToWorldPoint(this.attach1_, x);
    };
    Spring.prototype.computeBody2AttachPointInWorldCoords = function (x) {
        if (this.attach2_ == null || this.body2 == null) {
            throw new Error();
        }
        this.body2.localPointToWorldPoint(this.attach2_, x);
    };
    Object.defineProperty(Spring.prototype, "attach1", {
        get: function () {
            return this.attach1_;
        },
        set: function (attach1) {
            this.metric.unlock(this.attach1_, this.attach1Lock);
            this.metric.copyVector(attach1, this.attach1_);
            this.attach1Lock = this.metric.lock(this.attach1_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "attach2", {
        get: function () {
            return this.attach2_;
        },
        set: function (attach2) {
            this.metric.unlock(this.attach2_, this.attach2Lock);
            this.metric.copyVector(attach2, this.attach2_);
            this.attach2Lock = this.metric.lock(this.attach2_);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "end1", {
        get: function () {
            this.metric.unlock(this.end1_, this.end1Lock_);
            this.computeBody1AttachPointInWorldCoords(this.end1_);
            this.end1Lock_ = this.metric.lock(this.end1_);
            return this.end1_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "end2", {
        get: function () {
            this.metric.unlock(this.end2_, this.end2Lock_);
            this.computeBody2AttachPointInWorldCoords(this.end2_);
            this.end2Lock_ = this.metric.lock(this.end2_);
            return this.end2_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    Spring.prototype.calculateForces = function () {
        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);
        var metric = this.metric;
        // Temporarily use the F2 vector property to compute the direction (unit vector).
        metric.copyVector(this.F2.location, this.F2.vector);
        metric.subVector(this.F2.vector, this.F1.location);
        metric.direction(this.F2.vector, true);
        // this.F2.vector.copyVector(this.F2.location).subVector(this.F1.location).direction(true);
        // Use the the F1 vector property as working storage.
        // 1. Compute the extension.
        metric.copyVector(this.F1.location, this.F1.vector); // vector contains F1.location
        metric.subVector(this.F1.vector, this.F2.location); // vector contains (F1.location - F2.location)
        metric.magnitude(this.F1.vector, true); // vector contains |F1.location - F2.location|
        metric.subScalar(this.F1.vector, this.restLength); // vector contains (|F1.loc - F2.loc| - restLength)
        // 2. Multiply by the stiffness.
        metric.mulByScalar(this.F1.vector, metric.a(this.stiffness), metric.uom(this.stiffness));
        // 3. Multiply by the direction (temporarily in F2 vector) to complete the F1 vector.
        metric.mulByVector(this.F1.vector, this.F2.vector);
        // 4. The F2 vector property is the reaction to the F1 vector action.
        this.metric.copyVector(this.F1.vector, this.F2.vector);
        this.metric.neg(this.F2.vector);
        return this.forces;
    };
    /**
     *
     */
    Spring.prototype.disconnect = function () {
        // Does nothing
    };
    /**
     *
     */
    Spring.prototype.potentialEnergy = function () {
        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);
        var metric = this.metric;
        this.metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
        this.potentialEnergyLock_ = -1;
        // spring potential energy = 0.5 * stiffness * (stretch * stretch)
        // 1. Compute the magnitude of the distance between the endpoints.
        assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location, this.metric);
        metric.copyVector(this.F2.location, this.potentialEnergy_);
        metric.subVector(this.potentialEnergy_, this.F1.location);
        metric.magnitude(this.potentialEnergy_, true);
        // 2. Compute the stretch.
        assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength, this.metric);
        metric.sub(this.potentialEnergy_, this.restLength);
        // 3. Square it.
        metric.quaditude(this.potentialEnergy_, true);
        // 4. Multiply by the stiffness.
        metric.mulByScalar(this.potentialEnergy_, metric.a(this.stiffness), metric.uom(this.stiffness));
        // 5. Multiply by the 0.5 factor.
        metric.mulByNumber(this.potentialEnergy_, 0.5);
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    };
    return Spring;
}(AbstractSimObject));
export { Spring };
