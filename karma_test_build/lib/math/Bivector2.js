"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bivector2 = void 0;
var isNumber_1 = require("../checks/isNumber");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var isBivectorE3_1 = require("./isBivectorE3");
var isVectorE2_1 = require("./isVectorE2");
var mustBeBivectorE2_1 = require("./mustBeBivectorE2");
var mustBeVectorE2_1 = require("./mustBeVectorE2");
var Unit_1 = require("./Unit");
/**
 *
 */
var Bivector2 = /** @class */ (function () {
    /**
     *
     */
    function Bivector2(xy, uom) {
        this.xy = mustBeNumber_1.default('xy', xy);
        this.uom = Unit_1.Unit.mustBeUnit('uom', uom);
    }
    /**
     *
     */
    Bivector2.prototype.add = function (B) {
        mustBeBivectorE2_1.mustBeBivectorE2('B', B);
        this.xy += B.xy;
        this.uom = Unit_1.Unit.compatible(this.uom, B.uom);
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this bivector by the matrix.
     * The result is applied to this bivector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this bivector column vector.
     */
    Bivector2.prototype.applyMatrix = function (σ) {
        var z = this.xy;
        var n33 = σ.getElement(2, 2);
        this.xy = n33 * z;
        return this;
    };
    /**
     *
     */
    Bivector2.prototype.copy = function (B) {
        mustBeBivectorE2_1.mustBeBivectorE2('B', B);
        this.xy = B.xy;
        return this;
    };
    Bivector2.prototype.isZero = function () {
        return this.xy === 0;
    };
    Bivector2.prototype.rev = function () {
        this.xy = -this.xy;
        return this;
    };
    /**
     * R * this * ~R
     */
    Bivector2.prototype.rotate = function (R) {
        if (R.a === 1 && R.xy === 0) {
            return this;
        }
        else {
            var xy = this.xy;
            var Rxy = R.xy;
            var Ra = R.a;
            var Sxy = Ra * xy;
            var Sa = Rxy * xy;
            this.xy = Sxy * Ra + Sa * Rxy;
            return this;
        }
    };
    /**
     * Computes the scalar product of this bivector with B.
     */
    /*
    scp(B: BivectorE3): number {
        mustBeBivectorE3('B', B);
        // FIXME: This is wrong by a sign.
        return this.xy * B.xy + this.yz * B.yz + this.zx * B.zx;
    }
    */
    /**
     *
     */
    Bivector2.prototype.sub = function (B) {
        mustBeBivectorE2_1.mustBeBivectorE2('B', B);
        this.xy -= B.xy;
        return this;
    };
    Bivector2.prototype.toExponential = function (fractionDigits) {
        return "new Bivector3(xy: " + this.xy.toExponential(fractionDigits) + ")";
    };
    Bivector2.prototype.toFixed = function (fractionDigits) {
        return "new Bivector3(xy: " + this.xy.toFixed(fractionDigits) + ")";
    };
    Bivector2.prototype.toPrecision = function (precision) {
        return "new Bivector3(xy: " + this.xy.toPrecision(precision) + ")";
    };
    /**
     * Returns a string representation of this Bivector.
     */
    Bivector2.prototype.toString = function (radix) {
        return "new Bivector3(xy: " + this.xy.toString(radix) + ")";
    };
    /**
     *
     */
    Bivector2.prototype.wedge = function (a, b) {
        mustBeVectorE2_1.mustBeVectorE2('a', a);
        mustBeVectorE2_1.mustBeVectorE2('b', b);
        this.xy = a.x * b.y - a.y * b.x;
        this.uom = Unit_1.Unit.mul(a.uom, b.uom);
        return this;
    };
    /**
     *
     */
    Bivector2.prototype.write = function (B) {
        B.xy = this.xy;
        B.uom = this.uom;
        return this;
    };
    /**
     *
     */
    Bivector2.prototype.zero = function () {
        this.xy = 0;
        return this;
    };
    Bivector2.prototype.__add__ = function (rhs) {
        if (isBivectorE3_1.default(rhs) && !isVectorE2_1.isVectorE2(rhs)) {
            var xy = this.xy + rhs.xy;
            var uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
            return new Bivector2(xy, uom);
        }
        else {
            return void 0;
        }
    };
    Bivector2.prototype.__mul__ = function (rhs) {
        if (isNumber_1.default(rhs)) {
            var xy = this.xy * rhs;
            return new Bivector2(xy, this.uom);
        }
        else {
            return void 0;
        }
    };
    Bivector2.prototype.__rmul__ = function (lhs) {
        if (isNumber_1.default(lhs)) {
            var xy = lhs * this.xy;
            return new Bivector2(xy, this.uom);
        }
        else {
            return void 0;
        }
    };
    Bivector2.prototype.__sub__ = function (rhs) {
        if (isBivectorE3_1.default(rhs) && !isVectorE2_1.isVectorE2(rhs)) {
            var xy = this.xy - rhs.xy;
            var uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
            return new Bivector2(xy, uom);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Bivector2.wedge = function (a, b) {
        return new Bivector2(0).wedge(a, b);
    };
    return Bivector2;
}());
exports.Bivector2 = Bivector2;
