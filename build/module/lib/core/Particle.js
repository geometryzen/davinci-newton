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
     * @param mass The mass of the particle.
     * @param charge The electric charge of the particle.
     */
    function Particle(mass, charge, metric) {
        var _this = _super.call(this, metric) || this;
        _this.M = mass;
        _this.Q = charge;
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
            if (!Unit.isOne(this.I.uom)) {
                this.I.uom = Unit.ONE;
            }
        }
        else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(this.I.uom, Unit.KILOGRAM_METER_SQUARED)) {
                this.I.uom = Unit.KILOGRAM_METER_SQUARED;
            }
        }
        else {
            throw new Error("updateInertiaTensor() body.L.uom=" + metric.uom(this.L) + ", body.\u03A9.uom=" + metric.uom(this.Ω));
        }
    };
    return Particle;
}(RigidBody));
export { Particle };
