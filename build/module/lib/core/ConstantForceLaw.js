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
    function ConstantForceLaw($body, value, valueCoordType) {
        if (valueCoordType === void 0) { valueCoordType = WORLD; }
        var _this = _super.call(this) || this;
        _this.$body = $body;
        _this.$forces = [];
        var metric = _this.$body.metric;
        _this.$force = metric.createForce(_this.$body);
        _this.$force.locationCoordType = LOCAL;
        metric.copyVector(value, _this.$force.vector);
        _this.$force.vectorCoordType = valueCoordType;
        _this.$forces = [_this.$force];
        _this.$potentialEnergy = metric.scalar(0);
        _this.$potentialEnergyLock = metric.lock(_this.$potentialEnergy);
        return _this;
    }
    Object.defineProperty(ConstantForceLaw.prototype, "forces", {
        get: function () {
            return this.$forces;
        },
        enumerable: false,
        configurable: true
    });
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
        // Does nothing yet.
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
