import mustBeNumber from '../checks/mustBeNumber';
import veryDifferent from '../util/veryDifferent';
import Scalar3 from './Scalar3';
import { Unit } from './Unit';
/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
var Vec3 = /** @class */ (function () {
    /**
     * "v corresponds to `new Vec3(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    function Vec3(x, y, z, uom) {
        this.x_ = mustBeNumber('x', x);
        this.y_ = mustBeNumber('y', y);
        this.z_ = mustBeNumber('z', z);
        this.uom_ = Unit.mustBeUnit('uom', uom);
        if (this.uom_ && this.uom_.multiplier !== 1) {
            var multiplier = this.uom_.multiplier;
            this.x_ *= multiplier;
            this.y_ *= multiplier;
            this.z_ *= multiplier;
            this.uom_ = Unit.valueOf(1, uom.dimensions, uom.labels);
        }
    }
    Object.defineProperty(Vec3.prototype, "x", {
        /**
         * readonly x coordinate.
         */
        get: function () {
            return this.x_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "y", {
        /**
         * readonly y coordinate.
         */
        get: function () {
            return this.y_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "z", {
        /**
         * readonly z coordinate.
         */
        get: function () {
            return this.z_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec3.prototype, "uom", {
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
    Vec3.prototype.add = function (rhs) {
        var uom = Unit.compatible(this.uom_, rhs.uom);
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, uom);
    };
    /**
     * @returns this / alpha
     */
    Vec3.prototype.divByScalar = function (alpha) {
        return new Vec3(this.x / alpha, this.y / alpha, this.z / alpha, this.uom_);
    };
    /**
     * @returns this << B
     */
    Vec3.prototype.lco = function (B) {
        var ax = B.yz;
        var ay = B.zx;
        var az = B.xy;
        var bx = this.x;
        var by = this.y;
        var bz = this.z;
        var x = ay * bz - az * by;
        var y = az * bx - ax * bz;
        var z = ax * by - ay * bx;
        return new Vec3(x, y, z, Unit.mul(this.uom_, B.uom));
    };
    /**
     * @returns this - rhs
     */
    Vec3.prototype.subtract = function (rhs) {
        var uom = Unit.compatible(this.uom_, rhs.uom);
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, uom);
    };
    /**
     * @returns this * alpha
     */
    Vec3.prototype.mulByScalar = function (alpha) {
        return new Vec3(alpha * this.x, alpha * this.y, alpha * this.z, this.uom_);
    };
    /**
     * @returns this x alpha
     */
    Vec3.prototype.cross = function (rhs) {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var bx = rhs.x;
        var by = rhs.y;
        var bz = rhs.z;
        var x = ay * bz - az * by;
        var y = az * bx - ax * bz;
        var z = ax * by - ay * bx;
        return new Vec3(x, y, z, Unit.mul(this.uom_, rhs.uom));
    };
    /**
     * @returns |this - point|
     */
    Vec3.prototype.distanceTo = function (point) {
        var Δx = this.x - point.x;
        var Δy = this.y - point.y;
        var Δz = this.z - point.z;
        var a = Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
        var uom = Unit.compatible(this.uom_, point.uom);
        return new Scalar3(a, uom);
    };
    /**
     * @returns this | v
     */
    Vec3.prototype.dot = function (v) {
        var a = this.x * v.x + this.y * v.y + this.z * v.z;
        var uom = Unit.mul(this.uom_, v.uom);
        return new Scalar3(a, uom);
    };
    /**
     * @returns |this|
     */
    Vec3.prototype.magnitude = function () {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    };
    /**
     *
     */
    Vec3.prototype.nearEqual = function (v, tolerance) {
        if (veryDifferent(this.x_, v.x, tolerance)) {
            return false;
        }
        if (veryDifferent(this.y_, v.y, tolerance)) {
            return false;
        }
        if (veryDifferent(this.z_, v.z, tolerance)) {
            return false;
        }
        return true;
    };
    /**
     * @returns this / magnitude(this)
     */
    Vec3.prototype.direction = function () {
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
    Vec3.prototype.rotate = function (R) {
        if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
            return this;
        }
        else {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var w = R.a;
            var ix = w * x - c * z + a * y;
            var iy = w * y - a * x + b * z;
            var iz = w * z - b * y + c * x;
            var iw = b * x + c * y + a * z;
            var xPrimed = ix * w + iw * b + iy * a - iz * c;
            var yPrimed = iy * w + iw * c + iz * b - ix * a;
            var zPrimed = iz * w + iw * a + ix * c - iy * b;
            return new Vec3(xPrimed, yPrimed, zPrimed, this.uom_);
        }
    };
    /**
     * Returns a string representation of this vector.
     */
    Vec3.prototype.toString = function (radix) {
        return "new Vec3(" + this.x_.toString(radix) + ", " + this.y_.toString(radix) + ", " + this.z_.toString(radix) + ")";
    };
    Vec3.prototype.__add__ = function (rhs) {
        return this.add(rhs);
    };
    Vec3.prototype.__div__ = function (rhs) {
        return this.divByScalar(rhs);
    };
    Vec3.prototype.__mul__ = function (rhs) {
        return this.mulByScalar(rhs);
    };
    Vec3.prototype.__rmul__ = function (lhs) {
        return this.mulByScalar(lhs);
    };
    Vec3.prototype.__sub__ = function (rhs) {
        return this.subtract(rhs);
    };
    Vec3.fromVector = function (v) {
        return new Vec3(v.x, v.y, v.z, v.uom);
    };
    /**
     * The basis vector corresponding to the x coordinate.
     */
    Vec3.e1 = new Vec3(1, 0, 0);
    /**
     * The basis vector corresponding to the y coordinate.
     */
    Vec3.e2 = new Vec3(0, 1, 0);
    /**
     * The basis vector corresponding to the z coordinate.
     */
    Vec3.e3 = new Vec3(0, 0, 1);
    /**
     * The zero vector.
     */
    Vec3.zero = new Vec3(0, 0, 0);
    return Vec3;
}());
export { Vec3 };
