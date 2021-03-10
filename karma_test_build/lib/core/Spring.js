"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spring = void 0;
var tslib_1 = require("tslib");
var Unit_1 = require("../math/Unit");
var CoordType_1 = require("../model/CoordType");
var AbstractSimObject_1 = require("../objects/AbstractSimObject");
var assertConsistentUnits_1 = require("./assertConsistentUnits");
var Force_1 = require("./Force");
var mustBeDimensionlessOrCorrectUnits_1 = require("./mustBeDimensionlessOrCorrectUnits");
/**
 *
 */
var Spring = /** @class */ (function (_super) {
    tslib_1.__extends(Spring, _super);
    /**
     *
     */
    function Spring(body1_, body2_) {
        var _this = _super.call(this) || this;
        _this.body1_ = body1_;
        _this.body2_ = body2_;
        /**
         *
         */
        _this.forces = [];
        _this.metric = body1_.metric;
        var metric = _this.metric;
        _this.$restLength = metric.scalar(1);
        _this.$restLengthLock = metric.lock(_this.$restLength);
        _this.$stiffness = metric.scalar(1);
        _this.$stiffnessLock = metric.lock(_this.$stiffness);
        _this.attach1_ = metric.zero();
        _this.attach1Lock = metric.lock(_this.attach1_);
        _this.attach2_ = metric.zero();
        _this.attach2Lock = metric.lock(_this.attach2_);
        _this.end1_ = metric.zero();
        _this.end1Lock_ = metric.lock(_this.end1_);
        _this.end2_ = metric.zero();
        _this.end2Lock_ = metric.lock(_this.end2_);
        _this.F1 = new Force_1.Force(_this.body1_, metric);
        _this.F1.locationCoordType = CoordType_1.WORLD;
        _this.F1.vectorCoordType = CoordType_1.WORLD;
        _this.F2 = new Force_1.Force(_this.body2_, metric);
        _this.F2.locationCoordType = CoordType_1.WORLD;
        _this.F2.vectorCoordType = CoordType_1.WORLD;
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
            mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('restLength', restLength, Unit_1.Unit.METER, this.metric);
            this.metric.unlock(this.$restLength, this.$restLengthLock);
            this.metric.copy(restLength, this.$restLength);
            this.$restLengthLock = this.metric.lock(this.$restLength);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spring.prototype, "stiffness", {
        get: function () {
            return this.$stiffness;
        },
        set: function (stiffness) {
            mustBeDimensionlessOrCorrectUnits_1.mustBeDimensionlessOrCorrectUnits('stiffness', stiffness, Unit_1.Unit.STIFFNESS, this.metric);
            this.metric.unlock(this.$stiffness, this.$stiffnessLock);
            this.metric.copy(stiffness, this.$stiffness);
            this.$stiffnessLock = this.metric.lock(this.$stiffness);
        },
        enumerable: false,
        configurable: true
    });
    Spring.prototype.computeBody1AttachPointInWorldCoords = function (x) {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.localPointToWorldPoint(this.attach1_, x);
    };
    Spring.prototype.computeBody2AttachPointInWorldCoords = function (x) {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.localPointToWorldPoint(this.attach2_, x);
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
    Spring.prototype.updateForces = function () {
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
        assertConsistentUnits_1.assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location, this.metric);
        metric.copyVector(this.F2.location, this.potentialEnergy_);
        metric.subVector(this.potentialEnergy_, this.F1.location);
        metric.magnitude(this.potentialEnergy_, true);
        // 2. Compute the stretch.
        assertConsistentUnits_1.assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength, this.metric);
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
}(AbstractSimObject_1.AbstractSimObject));
exports.Spring = Spring;
