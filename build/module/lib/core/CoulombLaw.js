import { __extends } from "tslib";
import { Unit } from '../math/Unit';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { LockableMeasure } from './LockableMeasure';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';
/**
 * The S.I. unit for 1 / (4 π ε0), i.e. N * m^2 / (C^2).
 */
var kUnitSI = Unit.NEWTON.mul(Unit.METER).mul(Unit.METER).div(Unit.COULOMB).div(Unit.COULOMB);
/**
 * The Electric Force (Coulomb's Law)
 */
var CoulombLaw = /** @class */ (function (_super) {
    __extends(CoulombLaw, _super);
    /**
     *
     */
    function CoulombLaw(body1, body2, k) {
        var _this = _super.call(this) || this;
        _this.body1 = body1;
        _this.body2 = body2;
        _this.metric = body1.metric;
        var metric = _this.metric;
        _this.F1 = metric.createForce(_this.body1);
        _this.F1.locationCoordType = WORLD;
        _this.F1.vectorCoordType = WORLD;
        _this.F2 = metric.createForce(_this.body2);
        _this.F2.locationCoordType = WORLD;
        _this.F2.vectorCoordType = WORLD;
        if (k) {
            _this.$k = new LockableMeasure(metric, k);
        }
        else {
            _this.$k = new LockableMeasure(metric, metric.scalar(1));
        }
        _this.$forces = [_this.F1, _this.F2];
        _this.potentialEnergy_ = metric.scalar(0);
        _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
        return _this;
    }
    Object.defineProperty(CoulombLaw.prototype, "k", {
        /**
         * The proportionality constant, Coulomb's constant.
         * The approximate value in SI units is 9 x 10<sup>9</sup> N·m<sup>2</sup>/C<sup>2</sup>.
         * The default value is one (1).
         */
        get: function () {
            return this.$k.get();
        },
        set: function (k) {
            mustBeDimensionlessOrCorrectUnits('k', k, kUnitSI, this.body1.metric);
            this.$k.set(k);
        },
        enumerable: false,
        configurable: true
    });
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
        metric.copyVector(this.body1.X, numer);
        metric.subVector(numer, this.body2.X);
        metric.copyVector(numer, denom);
        metric.squaredNorm(denom);
        metric.direction(numer);
        metric.mulByScalar(numer, metric.a(this.k), metric.uom(this.k));
        metric.mulByScalar(numer, metric.a(this.body1.Q), metric.uom(this.body1.Q));
        metric.mulByScalar(numer, metric.a(this.body2.Q), metric.uom(this.body2.Q));
        metric.copyVector(numer, this.F1.vector);
        metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
        metric.copyVector(this.F1.vector, this.F2.vector);
        metric.neg(this.F2.vector);
        // Restore the contents of the location variables.
        metric.copyVector(this.body1.X, this.F1.location);
        metric.copyVector(this.body2.X, this.F2.location);
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
        metric.mulByScalar(numer, metric.a(this.body1.Q), metric.uom(this.body1.Q));
        metric.mulByScalar(numer, metric.a(this.body2.Q), metric.uom(this.body2.Q));
        // The denominator is |r1 - r2|.
        metric.copyVector(this.body1.X, denom);
        metric.subVector(denom, this.body2.X);
        metric.norm(denom);
        // Combine the numerator and denominator.
        metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
        metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));
        // Restore the contents of the location variables.
        metric.copyVector(this.body1.X, this.F1.location);
        metric.copyVector(this.body2.X, this.F2.location);
        // We're done. Lock down the result.
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    };
    return CoulombLaw;
}(AbstractSimObject));
export { CoulombLaw };
