import { __extends } from "tslib";
import { LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
/**
 * @hidden
 */
var ConstantForceLaw = /** @class */ (function (_super) {
    __extends(ConstantForceLaw, _super);
    /**
     *
     */
    function ConstantForceLaw($body, vector, vectorCoordType) {
        if (vectorCoordType === void 0) { vectorCoordType = WORLD; }
        var _this = _super.call(this) || this;
        _this.$body = $body;
        _this.$forces = [];
        var metric = _this.$body.metric;
        _this.$force = metric.createForce(_this.$body);
        _this.$force.locationCoordType = LOCAL;
        _this.vector = vector;
        _this.$force.vectorCoordType = vectorCoordType;
        _this.$forces = [_this.$force];
        _this.$potentialEnergy = metric.zero();
        _this.$potentialEnergyLock = metric.lock(_this.$potentialEnergy);
        return _this;
    }
    Object.defineProperty(ConstantForceLaw.prototype, "location", {
        get: function () {
            return this.$force.location;
        },
        set: function (location) {
            var metric = this.$body.metric;
            metric.copyVector(location, this.$force.location);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ConstantForceLaw.prototype, "vector", {
        get: function () {
            return this.$force.vector;
        },
        set: function (vector) {
            var metric = this.$body.metric;
            metric.copyVector(vector, this.$force.vector);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    ConstantForceLaw.prototype.updateForces = function () {
        return this.$forces;
    };
    /**
     *
     */
    ConstantForceLaw.prototype.disconnect = function () {
        // Does nothing
    };
    /**
     *
     */
    ConstantForceLaw.prototype.potentialEnergy = function () {
        // TODO: Why do we do this initialization to zero then return a locked object?
        var metric = this.$body.metric;
        metric.unlock(this.$potentialEnergy, this.$potentialEnergyLock);
        // metric.se
        // this.potentialEnergy_.a = 0;
        this.$potentialEnergyLock = metric.lock(this.$potentialEnergy);
        return this.$potentialEnergy;
    };
    return ConstantForceLaw;
}(AbstractSimObject));
export { ConstantForceLaw };
