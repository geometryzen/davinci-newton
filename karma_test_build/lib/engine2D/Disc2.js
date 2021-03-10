"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disc2 = void 0;
var tslib_1 = require("tslib");
var RigidBody_1 = require("../core/RigidBody");
var Geometric2_1 = require("../math/Geometric2");
var Mat1_1 = require("../math/Mat1");
var Unit_1 = require("../math/Unit");
var Euclidean2_1 = require("./Euclidean2");
/**
 * A solid disk of uniform surface density.
 */
var Disc2 = /** @class */ (function (_super) {
    tslib_1.__extends(Disc2, _super);
    /**
     *
     */
    function Disc2(radius) {
        if (radius === void 0) { radius = Geometric2_1.Geometric2.one; }
        var _this = _super.call(this, new Euclidean2_1.Euclidean2()) || this;
        _this.radius_ = Geometric2_1.Geometric2.fromScalar(radius);
        _this.radiusLock_ = _this.radius_.lock();
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
        this.Ω.quaditude(true); // Ω contains R^2
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
        var I = new Mat1_1.Mat1(s);
        I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(r.uom, r.uom));
        this.I = I;
    };
    return Disc2;
}(RigidBody_1.RigidBody));
exports.Disc2 = Disc2;
