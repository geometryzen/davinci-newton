"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = void 0;
var isNumber_1 = require("../checks/isNumber");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var readOnly_1 = require("../i18n/readOnly");
var isSpinorE2_1 = require("./isSpinorE2");
var isVectorE2_1 = require("./isVectorE2");
var mustBeVectorE2_1 = require("./mustBeVectorE2");
var randomRange_1 = require("./randomRange");
var Unit_1 = require("./Unit");
/**
 *
 */
var Vector2 = /** @class */ (function () {
    /**
     *
     */
    function Vector2(x, y, uom) {
        this.x = mustBeNumber_1.default('x', x);
        this.y = mustBeNumber_1.default('y', y);
        this.uom = Unit_1.Unit.mustBeUnit('uom', uom);
    }
    Object.defineProperty(Vector2.prototype, "grades", {
        /**
         *
         */
        get: function () {
            return this.isZero() ? 0x0 : 0x2;
        },
        set: function (unused) {
            throw new Error(readOnly_1.readOnly('grades').message);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    Vector2.prototype.add = function (rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
        return this;
    };
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    Vector2.prototype.applyMatrix = function (σ) {
        var x = this.x;
        var y = this.y;
        var n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1);
        var n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1);
        this.x = n11 * x + n12 * y;
        this.y = n21 * x + n22 * y;
        return this;
    };
    /**
     *
     */
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y, this.uom);
    };
    /**
     *
     */
    Vector2.prototype.copy = function (source) {
        mustBeVectorE2_1.mustBeVectorE2('source', source);
        this.x = source.x;
        this.y = source.y;
        return this;
    };
    /**
     *
     */
    Vector2.prototype.direction = function () {
        var m = this.magnitude();
        return this.divByScalar(m);
    };
    /**
     *
     */
    Vector2.prototype.divByScalar = function (alpha) {
        this.x /= alpha;
        this.y /= alpha;
        return this;
    };
    /**
     *
     */
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    /**
     * ??
     */
    Vector2.prototype.dual = function (B) {
        this.x = 0;
        this.y = 0;
        return this;
    };
    Vector2.prototype.isZero = function () {
        return this.x === 0 && this.y === 0;
    };
    /**
     *
     */
    Vector2.prototype.magnitude = function () {
        return Math.sqrt(this.quaditude());
    };
    /**
     *
     */
    Vector2.prototype.mulByScalar = function (alpha) {
        this.x *= alpha;
        this.y *= alpha;
        return this;
    };
    Vector2.prototype.neg = function () {
        return this.mulByScalar(-1);
    };
    /**
     *
     */
    Vector2.prototype.normalize = function (magnitude) {
        if (magnitude === void 0) { magnitude = 1; }
        var m = this.magnitude();
        return this.mulByScalar(magnitude).divByScalar(m);
    };
    /**
     *
     */
    Vector2.prototype.write = function (destination) {
        destination.x = this.x;
        destination.y = this.y;
        return this;
    };
    /**
     *
     */
    Vector2.prototype.zero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    /**
     * Computes the square of this vector.
     * This is an alias for the `squaredNorm` method.
     */
    Vector2.prototype.quaditude = function () {
        var x = this.x;
        var y = this.y;
        return x * x + y * y;
    };
    /**
     *
     */
    Vector2.prototype.quadranceTo = function (point) {
        var Δx = this.x - point.x;
        var Δy = this.y - point.y;
        return Δx * Δx + Δy * Δy;
    };
    /**
     *
     */
    Vector2.prototype.rotate = function (spinor) {
        if (spinor.a === 1 && spinor.xy === 0) {
            return this;
        }
        else {
            var x = this.x;
            var y = this.y;
            var a = spinor.xy;
            var w = spinor.a;
            var ix = w * x + a * y;
            var iy = w * y - a * x;
            this.x = ix * w + iy * a;
            this.y = iy * w - ix * a;
            return this;
        }
    };
    /**
     * Computes the square of this vector.
     * This is an alias for the `quaditude` method.
     */
    Vector2.prototype.squaredNorm = function () {
        var x = this.x;
        var y = this.y;
        return x * x + y * y;
    };
    /**
     *
     */
    Vector2.prototype.sub = function (rhs) {
        this.x -= rhs.x;
        this.y -= rhs.y;
        return this;
    };
    /**
     * Returns a string containing a number in exponential notation.
     */
    Vector2.prototype.toExponential = function (fractionDigits) {
        return "new Vector2(" + this.x.toExponential(fractionDigits) + ", " + this.y.toExponential(fractionDigits) + ")";
    };
    /**
     * Returns a string containing a number in fixed-point notation.
     */
    Vector2.prototype.toFixed = function (fractionDigits) {
        return "new Vector2(" + this.x.toFixed(fractionDigits) + ", " + this.y.toFixed(fractionDigits) + ")";
    };
    /**
     * Returns a string containing a number represented either in exponential or fixed-point notation
     * with a specified number of digits.
     */
    Vector2.prototype.toPrecision = function (precision) {
        return "new Vector2(" + this.x.toPrecision(precision) + ", " + this.y.toPrecision(precision) + ")";
    };
    /**
     * Returns a string representation of this vector.
     */
    Vector2.prototype.toString = function (radix) {
        return "new Vector2(" + this.x.toString(radix) + ", " + this.y.toString(radix) + ")";
    };
    Vector2.prototype.__add__ = function (rhs) {
        if (isVectorE2_1.isVectorE2(rhs) && !isSpinorE2_1.isSpinorE2(rhs)) {
            var uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
            return new Vector2(this.x + rhs.x, this.y + rhs.y, uom);
        }
        else {
            return void 0;
        }
    };
    Vector2.prototype.__div__ = function (rhs) {
        if (isNumber_1.default(rhs)) {
            return new Vector2(this.x / rhs, this.y / rhs, this.uom);
        }
        else {
            return void 0;
        }
    };
    Vector2.prototype.__mul__ = function (rhs) {
        if (isNumber_1.default(rhs)) {
            return new Vector2(this.x * rhs, this.y * rhs, this.uom);
        }
        else {
            return void 0;
        }
    };
    Vector2.prototype.__neg__ = function () {
        return new Vector2(-this.x, -this.y, this.uom);
    };
    Vector2.prototype.__radd__ = function (lhs) {
        if (isVectorE2_1.isVectorE2(lhs) && !isSpinorE2_1.isSpinorE2(lhs)) {
            var uom = Unit_1.Unit.compatible(lhs.uom, this.uom);
            return new Vector2(lhs.x + this.x, lhs.y + this.y, uom);
        }
        else {
            return void 0;
        }
    };
    Vector2.prototype.__rmul__ = function (lhs) {
        if (isNumber_1.default(lhs)) {
            return new Vector2(lhs * this.x, lhs * this.y, this.uom);
        }
        else {
            return void 0;
        }
    };
    Vector2.prototype.__rsub__ = function (lhs) {
        if (isVectorE2_1.isVectorE2(lhs) && !isSpinorE2_1.isSpinorE2(lhs)) {
            var uom = Unit_1.Unit.compatible(lhs.uom, this.uom);
            return new Vector2(lhs.x - this.x, lhs.y - this.y, uom);
        }
        else {
            return void 0;
        }
    };
    Vector2.prototype.__sub__ = function (rhs) {
        if (isVectorE2_1.isVectorE2(rhs) && !isSpinorE2_1.isSpinorE2(rhs)) {
            var uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
            return new Vector2(this.x - rhs.x, this.y - rhs.y, uom);
        }
        else {
            return void 0;
        }
    };
    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    Vector2.dual = function (B) {
        return new Vector2(0, 0, void 0).dual(B);
    };
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    Vector2.random = function () {
        var x = randomRange_1.default(-1, 1);
        var y = randomRange_1.default(-1, 1);
        return Vector2.vector(x, y).normalize();
    };
    /**
     * @param x
     * @param y
     * @param z
     * @param uom
     */
    Vector2.vector = function (x, y, uom) {
        return new Vector2(x, y, uom);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
