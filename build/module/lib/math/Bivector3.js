import isNumber from '../checks/isNumber';
import { mustBeNumber } from '../checks/mustBeNumber';
import isBivectorE3 from './isBivectorE3';
import isVectorE3 from './isVectorE3';
import mustBeBivectorE3 from './mustBeBivectorE3';
import mustBeVectorE3 from './mustBeVectorE3';
import { Unit } from './Unit';
import { wedgeXY, wedgeYZ, wedgeZX } from './wedge3';
/**
 * @hidden
 */
var Bivector3 = /** @class */ (function () {
    /**
     *
     */
    function Bivector3(yz, zx, xy, uom) {
        this.yz = mustBeNumber('yz', yz);
        this.zx = mustBeNumber('zx', zx);
        this.xy = mustBeNumber('xy', xy);
        this.uom = Unit.mustBeUnit('uom', uom);
        /*
        if (this.isZero()) {
            this.uom = uom;
        }
        else {
            this.uom = mustBeUnit('uom', uom);
        }
        */
    }
    /**
     *
     */
    Bivector3.prototype.add = function (B) {
        mustBeBivectorE3('B', B);
        this.yz += B.yz;
        this.zx += B.zx;
        this.xy += B.xy;
        this.uom = Unit.compatible(this.uom, B.uom);
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this bivector by the matrix.
     * The result is applied to this bivector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this bivector column vector.
     */
    Bivector3.prototype.applyMatrix = function (σ) {
        var x = this.yz;
        var y = this.zx;
        var z = this.xy;
        var n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
        var n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
        var n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);
        this.yz = n11 * x + n12 * y + n13 * z;
        this.zx = n21 * x + n22 * y + n23 * z;
        this.xy = n31 * x + n32 * y + n33 * z;
        return this;
    };
    /**
     *
     */
    Bivector3.prototype.copy = function (B) {
        mustBeBivectorE3('B', B);
        this.yz = B.yz;
        this.zx = B.zx;
        this.xy = B.xy;
        return this;
    };
    Bivector3.prototype.isZero = function () {
        return this.xy === 0 && this.yz === 0 && this.zx === 0;
    };
    Bivector3.prototype.rev = function () {
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    };
    /**
     * R * this * ~R
     */
    Bivector3.prototype.rotate = function (R) {
        if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
            return this;
        }
        else {
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            var Rxy = R.xy;
            var Ryz = R.yz;
            var Rzx = R.zx;
            var Ra = R.a;
            var Syz = Ra * yz - Rzx * xy + Rxy * zx;
            var Szx = Ra * zx - Rxy * yz + Ryz * xy;
            var Sxy = Ra * xy - Ryz * zx + Rzx * yz;
            var Sa = Ryz * yz + Rzx * zx + Rxy * xy;
            this.yz = Syz * Ra + Sa * Ryz + Szx * Rxy - Sxy * Rzx;
            this.zx = Szx * Ra + Sa * Rzx + Sxy * Ryz - Syz * Rxy;
            this.xy = Sxy * Ra + Sa * Rxy + Syz * Rzx - Szx * Ryz;
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
    Bivector3.prototype.sub = function (B) {
        mustBeBivectorE3('B', B);
        this.yz -= B.yz;
        this.zx -= B.zx;
        this.xy -= B.xy;
        return this;
    };
    Bivector3.prototype.toExponential = function (fractionDigits) {
        return "new Bivector3(yz: " + this.yz.toExponential(fractionDigits) + ", zx: " + this.zx.toExponential(fractionDigits) + ", xy: " + this.xy.toExponential(fractionDigits) + ")";
    };
    Bivector3.prototype.toFixed = function (fractionDigits) {
        return "new Bivector3(yz: " + this.yz.toFixed(fractionDigits) + ", zx: " + this.zx.toFixed(fractionDigits) + ", xy: " + this.xy.toFixed(fractionDigits) + ")";
    };
    Bivector3.prototype.toPrecision = function (precision) {
        return "new Bivector3(yz: " + this.yz.toPrecision(precision) + ", zx: " + this.zx.toPrecision(precision) + ", xy: " + this.xy.toPrecision(precision) + ")";
    };
    /**
     * Returns a string representation of this Bivector.
     */
    Bivector3.prototype.toString = function (radix) {
        return "new Bivector3(yz: " + this.yz.toString(radix) + ", zx: " + this.zx.toString(radix) + ", xy: " + this.xy.toString(radix) + ")";
    };
    /**
     *
     */
    Bivector3.prototype.wedge = function (a, b) {
        mustBeVectorE3('a', a);
        mustBeVectorE3('b', b);
        this.yz = wedgeYZ(a, b);
        this.zx = wedgeZX(a, b);
        this.xy = wedgeXY(a, b);
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    };
    /**
     *
     */
    Bivector3.prototype.write = function (B) {
        B.xy = this.xy;
        B.yz = this.yz;
        B.zx = this.zx;
        B.uom = this.uom;
        return this;
    };
    /**
     *
     */
    Bivector3.prototype.zero = function () {
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    };
    Bivector3.prototype.__add__ = function (rhs) {
        if (isBivectorE3(rhs) && !isVectorE3(rhs)) {
            var yz = this.yz + rhs.yz;
            var zx = this.zx + rhs.zx;
            var xy = this.xy + rhs.xy;
            var uom = Unit.compatible(this.uom, rhs.uom);
            return new Bivector3(yz, zx, xy, uom);
        }
        else {
            return void 0;
        }
    };
    Bivector3.prototype.__mul__ = function (rhs) {
        if (isNumber(rhs)) {
            var yz = this.yz * rhs;
            var zx = this.zx * rhs;
            var xy = this.xy * rhs;
            return new Bivector3(yz, zx, xy, this.uom);
        }
        else {
            return void 0;
        }
    };
    Bivector3.prototype.__rmul__ = function (lhs) {
        if (isNumber(lhs)) {
            var yz = lhs * this.yz;
            var zx = lhs * this.zx;
            var xy = lhs * this.xy;
            return new Bivector3(yz, zx, xy, this.uom);
        }
        else {
            return void 0;
        }
    };
    Bivector3.prototype.__sub__ = function (rhs) {
        if (isBivectorE3(rhs) && !isVectorE3(rhs)) {
            var yz = this.yz - rhs.yz;
            var zx = this.zx - rhs.zx;
            var xy = this.xy - rhs.xy;
            var uom = Unit.compatible(this.uom, rhs.uom);
            return new Bivector3(yz, zx, xy, uom);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     */
    Bivector3.wedge = function (a, b) {
        return new Bivector3(0, 0, 0).wedge(a, b);
    };
    return Bivector3;
}());
export { Bivector3 };
