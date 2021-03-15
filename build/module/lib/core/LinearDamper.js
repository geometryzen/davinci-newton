import { __extends } from "tslib";
import { Unit } from '../math/Unit';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from "../objects/AbstractSimObject";
import { LockableMeasure } from './LockableMeasure';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';
/**
 * @hidden
 */
var LinearDamper = /** @class */ (function (_super) {
    __extends(LinearDamper, _super);
    /**
     *
     * @param body1
     * @param body2
     */
    function LinearDamper(body1, body2) {
        var _this = _super.call(this) || this;
        _this.body1 = body1;
        _this.body2 = body2;
        /**
         *
         */
        _this.$forces = [];
        var metric = body1.metric;
        _this.$frictionCoefficient = new LockableMeasure(metric, metric.scalar(1));
        _this.F1 = metric.createForce(_this.body1);
        _this.F1.locationCoordType = WORLD;
        _this.F1.vectorCoordType = WORLD;
        _this.F2 = metric.createForce(_this.body2);
        _this.F2.locationCoordType = WORLD;
        _this.F2.vectorCoordType = WORLD;
        _this.$forces = [_this.F1, _this.F2];
        return _this;
    }
    Object.defineProperty(LinearDamper.prototype, "forces", {
        get: function () {
            return this.$forces;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinearDamper.prototype, "b", {
        get: function () {
            return this.$frictionCoefficient.get();
        },
        set: function (b) {
            mustBeDimensionlessOrCorrectUnits('b', b, Unit.FRICTION_COEFFICIENT, this.body1.metric);
            this.$frictionCoefficient.set(b);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinearDamper.prototype, "frictionCoefficient", {
        get: function () {
            return this.$frictionCoefficient.get();
        },
        set: function (frictionCoefficient) {
            mustBeDimensionlessOrCorrectUnits('frictionCoefficient', frictionCoefficient, Unit.FRICTION_COEFFICIENT, this.body1.metric);
            this.$frictionCoefficient.set(frictionCoefficient);
        },
        enumerable: false,
        configurable: true
    });
    LinearDamper.prototype.updateForces = function () {
        var metric = this.body1.metric;
        var b = this.$frictionCoefficient.get();
        var x1 = this.body1.X;
        var x2 = this.body2.X;
        var e = metric.zero();
        metric.addVector(e, x1);
        metric.subVector(e, x2);
        metric.direction(e);
        var v1 = metric.zero();
        metric.copyVector(this.body1.P, v1);
        metric.divByScalar(v1, metric.a(this.body1.M), metric.uom(this.body1.M));
        var v2 = metric.zero();
        metric.copyVector(this.body2.P, v2);
        metric.divByScalar(v2, metric.a(this.body2.M), metric.uom(this.body2.M));
        var v = metric.zero();
        metric.copyVector(v1, v);
        metric.subVector(v, v2);
        var f1 = this.F1.vector;
        metric.copyVector(v, f1); // f1 = v
        metric.scp(f1, e); // f1 = v | e
        metric.mulByScalar(f1, metric.a(b), metric.uom(b)); // f1 = b * (v | e)
        metric.neg(f1); // f1 = - b * (v | e)
        metric.mulByVector(f1, e); // f1 = - b * (v | e) e
        var f2 = this.F2.vector;
        metric.copyVector(f1, f2); // f2 = f1
        metric.neg(f2); // f2 = - f1
        metric.copyVector(x1, this.F1.location);
        metric.copyVector(x2, this.F2.location);
        return this.$forces;
    };
    LinearDamper.prototype.disconnect = function () {
        // Do nothing yet.
        // TODO: zero the forces?
    };
    LinearDamper.prototype.potentialEnergy = function () {
        var metric = this.body1.metric;
        return metric.zero();
    };
    return LinearDamper;
}(AbstractSimObject));
export { LinearDamper };
