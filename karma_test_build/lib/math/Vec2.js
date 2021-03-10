"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec2 = void 0;
var mustBeNumber_1 = require("../checks/mustBeNumber");
var veryDifferent_1 = require("../util/veryDifferent");
var Scalar3_1 = require("./Scalar3");
var Unit_1 = require("./Unit");
/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
var Vec2 = /** @class */ (function () {
    /**
     * "v corresponds to `new Vec2(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    function Vec2(x, y, uom) {
        this.x_ = mustBeNumber_1.default('x', x);
        this.y_ = mustBeNumber_1.default('y', y);
        this.uom_ = Unit_1.Unit.mustBeUnit('uom', uom);
        if (this.uom_ && this.uom_.multiplier !== 1) {
            var multiplier = this.uom_.multiplier;
            this.x_ *= multiplier;
            this.y_ *= multiplier;
            this.uom_ = Unit_1.Unit.valueOf(1, uom.dimensions, uom.labels);
        }
    }
    Object.defineProperty(Vec2.prototype, "x", {
        /**
         * readonly x coordinate.
         */
        get: function () {
            return this.x_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "y", {
        /**
         * readonly y coordinate.
         */
        get: function () {
            return this.y_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "uom", {
        /**
         * readonly unit of measure
         */
        get: function () {
            return this.uom_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @returns this + rhs
     */
    Vec2.prototype.add = function (rhs) {
        var uom = Unit_1.Unit.compatible(this.uom_, rhs.uom);
        return new Vec2(this.x + rhs.x, this.y + rhs.y, uom);
    };
    /**
     * @returns this / alpha
     */
    Vec2.prototype.divByScalar = function (alpha) {
        return new Vec2(this.x / alpha, this.y / alpha, this.uom_);
    };
    /**
     * @returns this << B
     */
    Vec2.prototype.lco = function (B) {
        var az = B.xy;
        var bx = this.x;
        var by = this.y;
        var x = -az * by;
        var y = az * bx;
        return new Vec2(x, y, Unit_1.Unit.mul(this.uom_, B.uom));
    };
    /**
     * @returns this - rhs
     */
    Vec2.prototype.subtract = function (rhs) {
        var uom = Unit_1.Unit.compatible(this.uom_, rhs.uom);
        return new Vec2(this.x - rhs.x, this.y - rhs.y, uom);
    };
    /**
     * @returns this * alpha
     */
    Vec2.prototype.mulByScalar = function (alpha) {
        return new Vec2(alpha * this.x, alpha * this.y, this.uom_);
    };
    /**
     * @returns |this - point|
     */
    Vec2.prototype.distanceTo = function (point) {
        var Δx = this.x - point.x;
        var Δy = this.y - point.y;
        var a = Math.sqrt(Δx * Δx + Δy * Δy);
        var uom = Unit_1.Unit.compatible(this.uom_, point.uom);
        return new Scalar3_1.default(a, uom);
    };
    /**
     * @returns this | v
     */
    Vec2.prototype.dot = function (v) {
        var a = this.x * v.x + this.y * v.y;
        var uom = Unit_1.Unit.mul(this.uom_, v.uom);
        return new Scalar3_1.default(a, uom);
    };
    /**
     * @returns |this|
     */
    Vec2.prototype.magnitude = function () {
        var x = this.x;
        var y = this.y;
        return Math.sqrt(x * x + y * y);
    };
    /**
     *
     */
    Vec2.prototype.nearEqual = function (v, tolerance) {
        if (veryDifferent_1.default(this.x_, v.x, tolerance)) {
            return false;
        }
        if (veryDifferent_1.default(this.y_, v.y, tolerance)) {
            return false;
        }
        return true;
    };
    /**
     * @returns this / magnitude(this)
     */
    Vec2.prototype.direction = function () {
        var magnitude = this.magnitude();
        if (magnitude !== 1) {
            if (magnitude === 0) {
                throw new Error("direction is undefined.");
            }
            else {
                return this.divByScalar(magnitude);
            }
        }
        else {
            return this;
        }
    };
    /**
     * @returns R * this * ~R
     */
    Vec2.prototype.rotate = function (R) {
        if (R.a === 1 && R.xy === 0) {
            return this;
        }
        else {
            var x = this.x;
            var y = this.y;
            var a = R.xy;
            var w = R.a;
            var ix = w * x + a * y;
            var iy = w * y - a * x;
            var xPrimed = ix * w + iy * a;
            var yPrimed = iy * w - ix * a;
            return new Vec2(xPrimed, yPrimed, this.uom_);
        }
    };
    /**
     * Returns a string representation of this vector.
     */
    Vec2.prototype.toString = function (radix) {
        return "new Vec2(" + this.x_.toString(radix) + ", " + this.y_.toString(radix) + ")";
    };
    Vec2.prototype.__add__ = function (rhs) {
        return this.add(rhs);
    };
    Vec2.prototype.__div__ = function (rhs) {
        return this.divByScalar(rhs);
    };
    Vec2.prototype.__mul__ = function (rhs) {
        return this.mulByScalar(rhs);
    };
    Vec2.prototype.__rmul__ = function (lhs) {
        return this.mulByScalar(lhs);
    };
    Vec2.prototype.__sub__ = function (rhs) {
        return this.subtract(rhs);
    };
    Vec2.fromVector = function (v) {
        return new Vec2(v.x, v.y, v.uom);
    };
    /**
     * The basis vector corresponding to the x coordinate.
     */
    Vec2.e1 = new Vec2(1, 0);
    /**
     * The basis vector corresponding to the y coordinate.
     */
    Vec2.e2 = new Vec2(0, 1);
    /**
     * The zero vector.
     */
    Vec2.zero = new Vec2(0, 0);
    return Vec2;
}());
exports.Vec2 = Vec2;
