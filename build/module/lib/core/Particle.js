import { __extends } from "tslib";
import { Unit } from '../math/Unit';
import { RigidBody } from './RigidBody';
/**
 * An object with no internal structure.
 * @hidden
 */
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    /**
     * @param M The mass of the particle. The mass is copied into the `M` property. Default is 1 (dimensionless).
     * @param Q The electric charge of the particle. The charge is copied into the `Q` property. Default is 1 (dimensionless).
     */
    function Particle(M, Q, metric) {
        var _this = _super.call(this, metric) || this;
        _this.M = M ? M : metric.scalar(1);
        _this.Q = Q ? Q : metric.scalar(1);
        return _this;
    }
    /**
     *
     */
    Particle.prototype.updateAngularVelocity = function () {
        var metric = this.metric;
        if (Unit.isOne(metric.uom(this.L))) {
            if (!Unit.isOne(metric.uom(this.Ω))) {
                metric.setUom(this.Ω, Unit.ONE);
            }
        }
        else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(metric.uom(this.Ω), Unit.INV_SECOND)) {
                metric.setUom(this.Ω, Unit.INV_SECOND);
            }
        }
        else {
            throw new Error("updateAngularVelocity() body.L.uom=" + metric.uom(this.L) + ", body.\u03A9.uom=" + metric.uom(this.Ω));
        }
    };
    /**
     *
     */
    Particle.prototype.updateInertiaTensor = function () {
        var metric = this.metric;
        if (Unit.isOne(metric.uom(this.L))) {
            if (!Unit.isOne(this.Iinv.uom)) {
                this.Iinv.uom = Unit.ONE;
            }
        }
        else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(this.Iinv.uom, Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED))) {
                this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            }
        }
        else {
            throw new Error("updateInertiaTensor() body.L.uom=" + metric.uom(this.L) + ", body.\u03A9.uom=" + metric.uom(this.Ω));
        }
    };
    return Particle;
}(RigidBody));
export { Particle };
