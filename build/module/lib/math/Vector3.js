import isNumber from '../checks/isNumber';
import mustBeNumber from '../checks/mustBeNumber';
import { readOnly } from '../i18n/readOnly';
import isSpinorE3 from './isSpinorE3';
import isVectorE3 from './isVectorE3';
import mustBeVectorE3 from './mustBeVectorE3';
import randomRange from './randomRange';
import { Unit } from './Unit';
/**
 *
 */
var Vector3 = /** @class */ (function () {
    /**
     *
     */
    function Vector3(x, y, z, uom) {
        this.x = mustBeNumber('x', x);
        this.y = mustBeNumber('y', y);
        this.z = mustBeNumber('z', z);
        this.uom = Unit.mustBeUnit('uom', uom);
    }
    Object.defineProperty(Vector3.prototype, "grades", {
        /**
         *
         */
        get: function () {
            return this.isZero() ? 0x0 : 0x2;
        },
        set: function (unused) {
            throw new Error(readOnly('grades').message);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    Vector3.prototype.add = function (rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
        this.uom = Unit.compatible(this.uom, rhs.uom);
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    Vector3.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
        var n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
        var n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);
        this.x = n11 * x + n12 * y + n13 * z;
        this.y = n21 * x + n22 * y + n23 * z;
        this.z = n31 * x + n32 * y + n33 * z;
        return this;
    };
    /**
     *
     */
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z, this.uom);
    };
    /**
     *
     */
    Vector3.prototype.copy = function (source) {
        mustBeVectorE3('source', source);
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
        return this;
    };
    /**
     *
     */
    Vector3.prototype.direction = function () {
        var m = this.magnitude();
        return this.divByScalar(m);
    };
    /**
     *
     */
    Vector3.prototype.divByScalar = function (alpha) {
        this.x /= alpha;
        this.y /= alpha;
        this.z /= alpha;
        return this;
    };
    /**
     *
     */
    Vector3.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
    /**
     *
     */
    Vector3.prototype.dual = function (B) {
        this.x = -B.yz;
        this.y = -B.zx;
        this.z = -B.xy;
        return this;
    };
    Vector3.prototype.isZero = function () {
        return this.x === 0 && this.y === 0 && this.z === 0;
    };
    /**
     *
     */
    Vector3.prototype.magnitude = function () {
        return Math.sqrt(this.quaditude());
    };
    /**
     *
     */
    Vector3.prototype.mulByScalar = function (alpha) {
        this.x *= alpha;
        this.y *= alpha;
        this.z *= alpha;
        return this;
    };
    Vector3.prototype.neg = function () {
        return this.mulByScalar(-1);
    };
    /**
     *
     */
    Vector3.prototype.normalize = function (magnitude) {
        if (magnitude === void 0) { magnitude = 1; }
        var m = this.magnitude();
        return this.mulByScalar(magnitude).divByScalar(m);
    };
    /**
     *
     */
    Vector3.prototype.write = function (destination) {
        destination.x = this.x;
        destination.y = this.y;
        destination.z = this.z;
        return this;
    };
    /**
     *
     */
    Vector3.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    };
    /**
     * Computes the square of this vector.
     * This is an alias for the `squaredNorm` method.
     */
    Vector3.prototype.quaditude = function () {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return x * x + y * y + z * z;
    };
    /**
     *
     */
    Vector3.prototype.quadranceTo = function (point) {
        var Δx = this.x - point.x;
        var Δy = this.y - point.y;
        var Δz = this.z - point.z;
        return Δx * Δx + Δy * Δy + Δz * Δz;
    };
    /**
     *
     */
    Vector3.prototype.rotate = function (spinor) {
        if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
            return this;
        }
        else {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = spinor.xy;
            var b = spinor.yz;
            var c = spinor.zx;
            var w = spinor.a;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
            return this;
        }
    };
    /**
     * Computes the square of this vector.
     * This is an alias for the `quaditude` method.
     */
    Vector3.prototype.squaredNorm = function () {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return x * x + y * y + z * z;
    };
    /**
     *
     */
    Vector3.prototype.sub = function (rhs) {
        this.x -= rhs.x;
        this.y -= rhs.y;
        this.z -= rhs.z;
        return this;
    };
    /**
     * Returns a string containing a number in exponential notation.
     */
    Vector3.prototype.toExponential = function (fractionDigits) {
        return "new Vector3(" + this.x.toExponential(fractionDigits) + ", " + this.y.toExponential(fractionDigits) + ", " + this.z.toExponential(fractionDigits) + ")";
    };
    /**
     * Returns a string containing a number in fixed-point notation.
     */
    Vector3.prototype.toFixed = function (fractionDigits) {
        return "new Vector3(" + this.x.toFixed(fractionDigits) + ", " + this.y.toFixed(fractionDigits) + ", " + this.z.toFixed(fractionDigits) + ")";
    };
    /**
     * Returns a string containing a number represented either in exponential or fixed-point notation
     * with a specified number of digits.
     */
    Vector3.prototype.toPrecision = function (precision) {
        return "new Vector3(" + this.x.toPrecision(precision) + ", " + this.y.toPrecision(precision) + ", " + this.z.toPrecision(precision) + ")";
    };
    /**
     * Returns a string representation of this vector.
     */
    Vector3.prototype.toString = function (radix) {
        return "new Vector3(" + this.x.toString(radix) + ", " + this.y.toString(radix) + ", " + this.z.toString(radix) + ")";
    };
    Vector3.prototype.__add__ = function (rhs) {
        if (isVectorE3(rhs) && !isSpinorE3(rhs)) {
            var uom = Unit.compatible(this.uom, rhs.uom);
            return new Vector3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, uom);
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__div__ = function (rhs) {
        if (isNumber(rhs)) {
            return new Vector3(this.x / rhs, this.y / rhs, this.z / rhs, this.uom);
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__mul__ = function (rhs) {
        if (isNumber(rhs)) {
            return new Vector3(this.x * rhs, this.y * rhs, this.z * rhs, this.uom);
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__neg__ = function () {
        return new Vector3(-this.x, -this.y, -this.z, this.uom);
    };
    Vector3.prototype.__radd__ = function (lhs) {
        if (isVectorE3(lhs) && !isSpinorE3(lhs)) {
            var uom = Unit.compatible(lhs.uom, this.uom);
            return new Vector3(lhs.x + this.x, lhs.y + this.y, lhs.z + this.z, uom);
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rmul__ = function (lhs) {
        if (isNumber(lhs)) {
            return new Vector3(lhs * this.x, lhs * this.y, lhs * this.z, this.uom);
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__rsub__ = function (lhs) {
        if (isVectorE3(lhs) && !isSpinorE3(lhs)) {
            var uom = Unit.compatible(lhs.uom, this.uom);
            return new Vector3(lhs.x - this.x, lhs.y - this.y, lhs.z - this.z, uom);
        }
        else {
            return void 0;
        }
    };
    Vector3.prototype.__sub__ = function (rhs) {
        if (isVectorE3(rhs) && !isSpinorE3(rhs)) {
            var uom = Unit.compatible(this.uom, rhs.uom);
            return new Vector3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, uom);
        }
        else {
            return void 0;
        }
    };
    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    Vector3.dual = function (B) {
        return new Vector3(0, 0, 0, void 0).dual(B);
    };
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    Vector3.random = function () {
        var x = randomRange(-1, 1);
        var y = randomRange(-1, 1);
        var z = randomRange(-1, 1);
        return Vector3.vector(x, y, z).normalize();
    };
    /**
     * @param x
     * @param y
     * @param z
     * @param uom
     */
    Vector3.vector = function (x, y, z, uom) {
        return new Vector3(x, y, z, uom);
    };
    return Vector3;
}());
export { Vector3 };
