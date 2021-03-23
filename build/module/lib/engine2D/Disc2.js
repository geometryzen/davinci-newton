import { __extends } from "tslib";
import { Geometric2 } from '../math/Geometric2';
import { Matrix1 } from '../math/Matrix1';
import { Unit } from '../math/Unit';
import { RigidBody2 } from './RigidBody2';
/**
 * A solid disk of uniform surface density.
 */
var Disc2 = /** @class */ (function (_super) {
    __extends(Disc2, _super);
    /**
     *
     */
    function Disc2(radius) {
        if (radius === void 0) { radius = Geometric2.one; }
        var _this = _super.call(this) || this;
        _this.radius_ = Geometric2.fromScalar(radius);
        _this.radiusLock_ = _this.radius_.lock();
        if (Unit.isOne(radius.uom)) {
            // dimensionless
        }
        else {
            _this.M = Geometric2.scalar(_this.M.a, Unit.KILOGRAM);
            _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            _this.X.uom = Unit.METER;
            _this.R.uom = Unit.ONE;
            _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            _this.L.uom = Unit.JOULE_SECOND;
        }
        _this.updateInertiaTensor();
        return _this;
    }
    Object.defineProperty(Disc2.prototype, "radius", {
        get: function () {
            return this.radius_;
        },
        set: function (radius) {
            this.radius_.unlock(this.radiusLock_);
            this.radius_.copyScalar(radius.a, radius.uom);
            this.radiusLock_ = this.radius_.lock();
            this.updateInertiaTensor();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * L = J(Ω) = (1/2) M R^2 Ω => Ω = 2 * L * (1/M) * (1/R)^2
     */
    Disc2.prototype.updateAngularVelocity = function () {
        this.Ω.copyScalar(this.radius_.a, this.radius_.uom); // Ω contains R 
        this.Ω.quad(); // Ω contains R^2
        this.Ω.mulByScalar(this.M.a, this.M.uom); // Ω contains M * R^2
        this.Ω.mulByNumber(0.5); // Ω contains (1/2) * M * R^2
        this.Ω.inv(); // Ω contains 2 * (1/M) * (1/R)^2
        this.Ω.mulByBivector(this.L); // Ω contains 2 * L * (1/M) * (1/R)^2
    };
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     * I = (1/2) M * R^2
     */
    Disc2.prototype.updateInertiaTensor = function () {
        var r = this.radius_;
        var s = 0.5 * this.M.a * r.a * r.a;
        var Iuom = Unit.mul(this.M.uom, Unit.mul(r.uom, r.uom));
        var matrixInv = Matrix1.one();
        matrixInv.setElement(0, 0, 1 / s);
        matrixInv.uom = Unit.div(Unit.ONE, Iuom);
        this.Iinv = matrixInv;
    };
    return Disc2;
}(RigidBody2));
export { Disc2 };
