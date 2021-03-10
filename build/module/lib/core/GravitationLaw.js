import { __extends } from "tslib";
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force } from './Force';
/**
 *
 */
var GravitationLaw = /** @class */ (function (_super) {
    __extends(GravitationLaw, _super);
    /**
     *
     */
    function GravitationLaw(body1_, body2_, G) {
        var _this = _super.call(this) || this;
        _this.body1_ = body1_;
        _this.body2_ = body2_;
        _this.forces = [];
        _this.metric = body1_.metric;
        var metric = _this.metric;
        _this.F1 = new Force(_this.body1_, metric);
        _this.F1.locationCoordType = WORLD;
        _this.F1.vectorCoordType = WORLD;
        _this.F2 = new Force(_this.body2_, metric);
        _this.F2.locationCoordType = WORLD;
        _this.F2.vectorCoordType = WORLD;
        _this.G = G;
        _this.forces = [_this.F1, _this.F2];
        _this.potentialEnergy_ = metric.zero();
        _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
        return _this;
    }
    /**
     * Computes the forces due to the gravitational interaction.
     * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    GravitationLaw.prototype.updateForces = function () {
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        var numer = this.F1.location;
        var denom = this.F2.location;
        var metric = this.metric;
        // The direction of the force is computed such that masses always attract each other.
        metric.copyVector(this.body2_.X, numer);
        metric.subVector(numer, this.body1_.X);
        metric.copyVector(numer, denom);
        metric.quaditude(denom, true);
        metric.direction(numer, true);
        metric.mulByScalar(numer, metric.a(this.G), metric.uom(this.G));
        metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
        metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
        metric.copyVector(numer, this.F1.vector);
        metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
        metric.copyVector(this.F1.vector, this.F2.vector);
        metric.neg(this.F2.vector);
        // Restore the contents of the location variables.
        metric.copyVector(this.body1_.X, this.F1.location);
        metric.copyVector(this.body2_.X, this.F2.location);
        return this.forces;
    };
    /**
     *
     */
    GravitationLaw.prototype.disconnect = function () {
        // Does nothing
    };
    /**
     * Computes the potential energy of the gravitational interaction.
     * U = -G m1 m2 / r, where
     * r is the center-of-mass to center-of-mass separation of m1 and m2.
     */
    GravitationLaw.prototype.potentialEnergy = function () {
        var metric = this.metric;
        // Unlock the variable that we will use for the result.
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        var numer = this.F1.location;
        var denom = this.F2.location;
        // The numerator of the potential energy formula is -G * m1 * m2.
        metric.copyScalar(metric.a(this.G), metric.uom(this.G), numer);
        metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
        metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
        metric.neg(numer);
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
    return GravitationLaw;
}(AbstractSimObject));
export { GravitationLaw };
