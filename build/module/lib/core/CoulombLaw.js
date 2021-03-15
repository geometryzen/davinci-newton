import { __extends } from "tslib";
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
/**
 *
 */
var CoulombLaw = /** @class */ (function (_super) {
    __extends(CoulombLaw, _super);
    /**
     *
     */
    function CoulombLaw(body1_, body2_, k) {
        var _this = _super.call(this) || this;
        _this.body1_ = body1_;
        _this.body2_ = body2_;
        _this.$forces = [];
        _this.metric = body1_.metric;
        var metric = _this.metric;
        _this.F1 = metric.createForce(_this.body1_);
        _this.F1.locationCoordType = WORLD;
        _this.F1.vectorCoordType = WORLD;
        _this.F2 = metric.createForce(_this.body2_);
        _this.F2.locationCoordType = WORLD;
        _this.F2.vectorCoordType = WORLD;
        _this.k = k;
        _this.$forces = [_this.F1, _this.F2];
        _this.potentialEnergy_ = metric.zero();
        _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
        return _this;
    }
    Object.defineProperty(CoulombLaw.prototype, "forces", {
        get: function () {
            return this.$forces;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Computes the forces due to the Coulomb interaction.
     * F = k * q1 * q2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    CoulombLaw.prototype.updateForces = function () {
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        var numer = this.F1.location;
        var denom = this.F2.location;
        var metric = this.metric;
        // The direction of the force is computed such that like charges repel each other.
        metric.copyVector(this.body1_.X, numer);
        metric.subVector(numer, this.body2_.X);
        metric.copyVector(numer, denom);
        metric.quaditude(denom, true);
        metric.direction(numer, true);
        metric.mulByScalar(numer, metric.a(this.k), metric.uom(this.k));
        metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
        metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
        metric.copyVector(numer, this.F1.vector);
        metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
        metric.copyVector(this.F1.vector, this.F2.vector);
        metric.neg(this.F2.vector);
        // Restore the contents of the location variables.
        metric.copyVector(this.body1_.X, this.F1.location);
        metric.copyVector(this.body2_.X, this.F2.location);
        return this.$forces;
    };
    /**
     *
     */
    CoulombLaw.prototype.disconnect = function () {
        // Does nothing
    };
    /**
     * Computes the potential energy of the gravitational interaction.
     * U = k q1 q2 / r, where
     * r is the center to center separation of m1 and m2.
     */
    CoulombLaw.prototype.potentialEnergy = function () {
        var metric = this.metric;
        // Unlock the variable that we will use for the result.
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        var numer = this.F1.location;
        var denom = this.F2.location;
        // The numerator of the potential energy formula is k * Q1 * Q2.
        metric.copyScalar(metric.a(this.k), metric.uom(this.k), numer);
        metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
        metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
        // The denominator is |r1 - r2|.
        metric.copyVector(this.body1_.X, denom);
        metric.subVector(denom, this.body2_.X);
        metric.magnitude(denom, true);
        // Combine the numerator and denominator.
        metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
        metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));
        // Restore the contents of the location variables.
        metric.copyVector(this.body1_.X, this.F1.location);
        metric.copyVector(this.body2_.X, this.F2.location);
        // We're done. Lock down the result.
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    };
    return CoulombLaw;
}(AbstractSimObject));
export { CoulombLaw };
