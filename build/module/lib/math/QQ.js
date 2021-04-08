import { reduceToLowestForm } from "./reduceToLowestForm";
var tempND = [0, 0];
var entries = [];
/**
 * The QQ class represents a rational number, ℚ.
 *
 * The QQ implementation is that of an <em>immutable</em> (value) type.
 *
 * The numerator and denominator are reduced to their lowest form.
 *
 * Construct new instances using the static <code>valueOf</code> method.
 * @hidden
 */
var QQ = /** @class */ (function () {
    /**
     * @param n The numerator.
     * @param d The denominator.
     */
    function QQ(n, d) {
        var g;
        var gcd = function (a, b) {
            var temp;
            if (a < 0) {
                a = -a;
            }
            if (b < 0) {
                b = -b;
            }
            if (b > a) {
                temp = a;
                a = b;
                b = temp;
            }
            while (true) {
                a %= b;
                if (a === 0) {
                    return b;
                }
                b %= a;
                if (b === 0) {
                    return a;
                }
            }
        };
        if (d === 0) {
            throw new Error("denominator must not be zero");
        }
        if (n === 0) {
            g = 1;
        }
        else {
            g = gcd(Math.abs(n), Math.abs(d));
        }
        if (d < 0) {
            n = -n;
            d = -d;
        }
        this.numer_ = n / g;
        this.denom_ = d / g;
    }
    Object.defineProperty(QQ.prototype, "numer", {
        /**
         * The numerator of the rational number.
         */
        get: function () {
            return this.numer_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QQ.prototype, "denom", {
        /**
         * The denominator of the rational number.
         */
        get: function () {
            return this.denom_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @returns this + rhs
     */
    QQ.prototype.add = function (rhs) {
        return QQ.valueOf(this.numer_ * rhs.denom_ + this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
    };
    /**
     * @returns this - rhs
     */
    QQ.prototype.sub = function (rhs) {
        return QQ.valueOf(this.numer_ * rhs.denom_ - this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
    };
    /**
     * @returns this * rhs
     */
    QQ.prototype.mul = function (rhs) {
        return QQ.valueOf(this.numer_ * rhs.numer_, this.denom_ * rhs.denom_);
    };
    /**
     * @returns this / rhs
     */
    QQ.prototype.div = function (rhs) {
        var numer = this.numer_ * rhs.denom_;
        var denom = this.denom_ * rhs.numer_;
        if (numer === 0) {
            if (denom === 0) {
                // How do we handle undefined?
                return QQ.valueOf(numer, denom);
            }
            else {
                return QQ.ZERO;
            }
        }
        else {
            if (denom === 0) {
                // How do we handle division by zero.
                return QQ.valueOf(numer, denom);
            }
            else {
                return QQ.valueOf(numer, denom);
            }
        }
    };
    /**
     * @returns `true` if this rational number is one (1), otherwise `false`.
     */
    QQ.prototype.isOne = function () {
        return this.numer_ === 1 && this.denom_ === 1;
    };
    /**
     * @returns `true` if this rational number is zero (0), otherwise `false`.
     */
    QQ.prototype.isZero = function () {
        return this.numer_ === 0 && this.denom_ === 1;
    };
    /**
     * @returns 37 * numerator + 13 * denominator
     */
    QQ.prototype.hashCode = function () {
        return 37 * this.numer_ + 13 * this.denom_;
    };
    /**
     * Computes the multiplicative inverse of this rational number.
     *
     * @returns 1 / this
     */
    QQ.prototype.inv = function () {
        return QQ.valueOf(this.denom_, this.numer_);
    };
    /**
     * Computes the additive inverse of this rational number.
     *
     * @returns -this
     */
    QQ.prototype.neg = function () {
        return QQ.valueOf(-this.numer_, this.denom_);
    };
    /**
     * Determines whether two rational numbers are equal.
     *
     * @returns `true` if `this` rational number equals the `other` rational number.
     */
    QQ.prototype.equals = function (other) {
        if (this === other) {
            return true;
        }
        else if (other instanceof QQ) {
            return this.numer_ * other.denom_ === this.denom_ * other.numer_;
        }
        else {
            return false;
        }
    };
    /**
     * Computes a non-normative string representation of this rational.
     *
     * @returns
     */
    QQ.prototype.toString = function (radix) {
        return "" + this.numer_.toString(radix) + "/" + this.denom_.toString(radix) + "";
    };
    /**
     * @returns this + rhs
     */
    QQ.prototype.__add__ = function (rhs) {
        if (rhs instanceof QQ) {
            return this.add(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns lhs + this
     */
    QQ.prototype.__radd__ = function (lhs) {
        if (lhs instanceof QQ) {
            return lhs.add(this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns this - rhs
     */
    QQ.prototype.__sub__ = function (rhs) {
        if (rhs instanceof QQ) {
            return this.sub(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns lhs - this
     */
    QQ.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof QQ) {
            return lhs.sub(this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns this * rhs
     */
    QQ.prototype.__mul__ = function (rhs) {
        if (rhs instanceof QQ) {
            return this.mul(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns lhs * this
     */
    QQ.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof QQ) {
            return lhs.mul(this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns this / rhs
     */
    QQ.prototype.__div__ = function (rhs) {
        if (rhs instanceof QQ) {
            return this.div(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns lhs / this
     */
    QQ.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof QQ) {
            return lhs.div(this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns +this
     */
    QQ.prototype.__pos__ = function () {
        return this;
    };
    /**
     * @returns -this
     */
    QQ.prototype.__neg__ = function () {
        return this.neg();
    };
    /**
     * @param numer The numerator of the rational number.
     * @param denom The denominator of the rational number.
     * @returns The rational number numer / denom reduced to its lowest form.
     */
    QQ.valueOf = function (n, d) {
        reduceToLowestForm(n, d, tempND);
        n = tempND[0];
        d = tempND[1];
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry_1 = entries_1[_i];
            if (entry_1.n === n && entry_1.d === d) {
                return entry_1.value;
            }
        }
        // console.warn(`QQ.valueOf(${n},${d}) is not cached.`);
        var value = new QQ(n, d);
        var entry = { n: n, d: d, value: value };
        entries.push(entry);
        // console.warn(`QQ cache size = ${entries.length}`);
        return value;
    };
    //
    // Immutable constants allow us to avoid creating
    // temporary QQ instances for the common values.
    //
    QQ.ZERO = new QQ(0, 1);
    return QQ;
}());
export { QQ };
