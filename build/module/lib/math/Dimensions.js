import { QQ } from '../math/QQ';
import detectDimensions from './detectDimensions';
import { DimensionsSummary } from './DimensionsSummary';
/**
 * @hidden
 */
var R0 = QQ.valueOf(0, 1);
/**
 * @hidden
 */
var R1 = QQ.valueOf(1, 1);
/**
 * @hidden
 */
var R2 = QQ.valueOf(2, 1);
/**
 * @hidden
 */
var R3 = QQ.valueOf(3, 1);
/**
 * @hidden
 */
var M1 = QQ.valueOf(-1, 1);
/**
 * @hidden
 */
var M2 = QQ.valueOf(-2, 1);
/**
 * @hidden
 * @param name
 * @param arg
 * @returns
 */
function assertArgRational(name, arg) {
    if (arg instanceof QQ) {
        return arg;
    }
    else {
        throw new Error("Argument " + name + " => " + arg + " must be a QQ");
    }
}
/**
 * @hidden
 */
var dimsChecking = 'strict';
/**
 * @param mode
 */
export function setDimensionsChecking(mode) {
    switch (mode) {
        case 'strict':
        case 'none': {
            dimsChecking = mode;
            break;
        }
        default: {
            throw new Error("mode must be 'none' or 'strict'.");
        }
    }
}
/**
 * @hidden
 */
export function getDimensionsChecking() {
    return dimsChecking;
}
/**
 * Keeps track of the dimensions of a physical quantity using seven rational exponents.
 * Each of the exponents corresponds to a dimension in the S.I. system of units.
 * @hidden
 */
var Dimensions = /** @class */ (function () {
    /**
     * The Dimensions class captures the physical dimensions associated with a unit of measure.
     *
     * @param M The mass component of the dimensions object.
     * @param L The length component of the dimensions object.
     * @param T The time component of the dimensions object.
     * @param Q The charge component of the dimensions object.
     * @param temperature The temperature component of the dimensions object.
     * @param amount The amount component of the dimensions object.
     * @param intensity The intensity component of the dimensions object.
     */
    function Dimensions(M, L, T, Q, temperature, amount, intensity, summary) {
        this.M = assertArgRational('M', M);
        this.L = assertArgRational('L', L);
        this.T = assertArgRational('T', T);
        this.Q = assertArgRational('Q', Q);
        this.temperature = assertArgRational('temperature', temperature);
        this.amount = assertArgRational('amount', amount);
        this.intensity = assertArgRational('intensity', intensity);
        this.summary_ = summary;
    }
    Object.defineProperty(Dimensions.prototype, "summary", {
        get: function () {
            return this.summary_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
     */
    Dimensions.prototype.compatible = function (rhs) {
        if (typeof this.summary_ === 'number' && this.summary_ === rhs.summary_) {
            return this;
        }
        else if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
            return this;
        }
        else {
            if (this.isOne()) {
                if (rhs.isOne()) {
                    throw new Error();
                }
                else {
                    var msg = "Dimensions must be equal (dimensionless, " + rhs + ")";
                    switch (dimsChecking) {
                        case 'none': {
                            return rhs;
                        }
                        default: {
                            throw new Error(msg);
                        }
                    }
                }
            }
            else {
                if (rhs.isOne()) {
                    var msg = "Dimensions must be equal (" + this + ", dimensionless)";
                    switch (dimsChecking) {
                        case 'none': {
                            return this;
                        }
                        default: {
                            throw new Error(msg);
                        }
                    }
                }
                else {
                    var msg = "Dimensions must be equal (" + this + ", " + rhs + ")";
                    switch (dimsChecking) {
                        case 'none': {
                            return this;
                        }
                        default: {
                            throw new Error(msg);
                        }
                    }
                }
            }
        }
    };
    Dimensions.prototype.equals = function (rhs) {
        if (this === rhs) {
            return true;
        }
        else {
            return this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity);
        }
    };
    /**
     * Multiplies dimensions by adding rational exponents.
     *
     * @param rhs
     * @returns <code>this * rhs</code>
     */
    Dimensions.prototype.mul = function (rhs) {
        return Dimensions.valueOf(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
    };
    /**
     * Divides dimensions by subtracting rational exponents.
     *
     * @param rhs
     * @returns <code>this / rhs</code>
     */
    Dimensions.prototype.div = function (rhs) {
        return Dimensions.valueOf(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
    };
    /**
     * Computes the power function by multiplying rational exponents.
     *
     * @param rhs
     * @returns <code>pow(this, rhs)</code>
     */
    Dimensions.prototype.pow = function (exponent) {
        return Dimensions.valueOf(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
    };
    /**
     * Computes the square root by dividing each rational component by two.
     *
     * @returns
     */
    Dimensions.prototype.sqrt = function () {
        return Dimensions.valueOf(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
    };
    /**
     * Determines whether all the exponents of this dimensions number are zero.
     * This implies a dimensionless quantity.
     *
     * @returns <code>true</code> if all the exponents are zero, otherwise <code>false</code>.
     */
    Dimensions.prototype.isOne = function () {
        if (this === Dimensions.ONE) {
            return true;
        }
        else {
            return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        }
    };
    /**
     * Computes the multiplicative inverse of this dimensions number.
     * This is achived by changing the signs of all the exponent quantities.
     *
     * @returns The multiplicative inverse of this dimensions number.
     */
    Dimensions.prototype.inv = function () {
        return Dimensions.valueOf(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
    };
    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     *
     * @returns
     */
    Dimensions.prototype.toString = function () {
        var stringify = function (rational, label) {
            if (rational.numer === 0) {
                return null;
            }
            else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    return "" + label;
                }
                else {
                    return "" + label + " ** " + rational.numer;
                }
            }
            return "" + label + " ** " + rational;
        };
        return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
            return typeof x === 'string';
        }).join(" * ");
    };
    /**
     * @returns this + rhs
     */
    Dimensions.prototype.__add__ = function (rhs) {
        if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns lhs + this
     */
    Dimensions.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     * @param rhs
     * @returns
     */
    Dimensions.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     * @param lhs
     * @returns
     */
    Dimensions.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     * @param rhs
     * @returns
     */
    Dimensions.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Dimensions) {
            return this.mul(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     * @param lhs
     * @returns
     */
    Dimensions.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Dimensions) {
            return lhs.mul(this);
        }
        else {
            return void 0;
        }
    };
    /**
     *
     * @param rhs
     * @returns
     */
    Dimensions.prototype.__div__ = function (rhs) {
        if (rhs instanceof Dimensions) {
            return this.div(rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @param lhs
     * @returns
     */
    Dimensions.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Dimensions) {
            return lhs.div(this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @returns
     */
    Dimensions.prototype.__pos__ = function () {
        return this;
    };
    /**
     *
     * @returns
     */
    Dimensions.prototype.__neg__ = function () {
        return this;
    };
    /**
     * Constructor function for Dimensions.
     * @param M The mass component of the dimensions object.
     * @param L The length component of the dimensions object.
     * @param T The time component of the dimensions object.
     * @param Q The charge component of the dimensions object.
     * @param temperature The temperature component of the dimensions object.
     * @param amount The amount component of the dimensions object.
     * @param intensity The intensity component of the dimensions object.
     */
    Dimensions.valueOf = function (M, L, T, Q, temperature, amount, intensity) {
        // This function is optimized to minimize the need for object creation.
        var summary = detectDimensions(M, L, T, Q, temperature, amount, intensity);
        switch (summary) {
            case DimensionsSummary.AMOUNT_OF_SUBSTANCE: return Dimensions.AMOUNT_OF_SUBSTANCE;
            case DimensionsSummary.ANGULAR_MOMENTUM: return Dimensions.ANGULAR_MOMENTUM;
            case DimensionsSummary.AREA: return Dimensions.AREA;
            case DimensionsSummary.ELECTRIC_CHARGE: return Dimensions.ELECTRIC_CHARGE;
            case DimensionsSummary.ELECTRIC_CURRENT: return Dimensions.ELECTRIC_CURRENT;
            case DimensionsSummary.ELECTRIC_FIELD: return Dimensions.ELECTRIC_FIELD;
            case DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA: return Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA;
            case DimensionsSummary.ENERGY_OR_TORQUE: return Dimensions.ENERGY_OR_TORQUE;
            case DimensionsSummary.FORCE: return Dimensions.FORCE;
            case DimensionsSummary.LUMINOUS_INTENSITY: return Dimensions.LUMINOUS_INTENSITY;
            case DimensionsSummary.INV_LENGTH: return Dimensions.INV_LENGTH;
            case DimensionsSummary.INV_MASS: return Dimensions.INV_MASS;
            case DimensionsSummary.INV_MOMENT_OF_INERTIA: return Dimensions.INV_MOMENT_OF_INERTIA;
            case DimensionsSummary.INV_TIME: return Dimensions.INV_TIME;
            case DimensionsSummary.LENGTH: return Dimensions.LENGTH;
            case DimensionsSummary.MASS: return Dimensions.MASS;
            case DimensionsSummary.MOMENT_OF_INERTIA: return Dimensions.MOMENT_OF_INERTIA;
            case DimensionsSummary.MOMENTUM: return Dimensions.MOMENTUM;
            case DimensionsSummary.MOMENTUM_SQUARED: return Dimensions.MOMENTUM_SQUARED;
            case DimensionsSummary.ONE: return Dimensions.ONE;
            case DimensionsSummary.RATE_OF_CHANGE_OF_AREA: return Dimensions.RATE_OF_CHANGE_OF_AREA;
            case DimensionsSummary.STIFFNESS: return Dimensions.STIFFNESS;
            case DimensionsSummary.THERMODYNAMIC_TEMPERATURE: return Dimensions.THERMODYNAMIC_TEMPERATURE;
            case DimensionsSummary.TIME: return Dimensions.TIME;
            case DimensionsSummary.TIME_SQUARED: return Dimensions.TIME_SQUARED;
            case DimensionsSummary.VELOCITY: return Dimensions.VELOCITY;
            case DimensionsSummary.VELOCITY_SQUARED: return Dimensions.VELOCITY_SQUARED;
            default: {
                // console.warn(`Dimensions.valueOf(${M},${L},${T},${Q},${temperature},${amount},${intensity}) is not cached.`);
                return new Dimensions(M, L, T, Q, temperature, amount, intensity, summary);
            }
        }
    };
    /**
     * All exponents are zero, a dimensionless quantity.
     */
    Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0, DimensionsSummary.ONE);
    /**
     * M<sup>1</sup>
     */
    Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0, DimensionsSummary.MASS);
    /**
     * L<sup>1</sup>
     */
    Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0, DimensionsSummary.LENGTH);
    /**
     * L<sup>2</sup>
     */
    Dimensions.AREA = new Dimensions(R0, R2, R0, R0, R0, R0, R0, DimensionsSummary.AREA);
    /**
     * L<sup>3</sup>
     */
    Dimensions.VOLUME = new Dimensions(R0, R3, R0, R0, R0, R0, R0, DimensionsSummary.VOLUME);
    /**
     * Inverse Length.
     */
    Dimensions.INV_LENGTH = new Dimensions(R0, M1, R0, R0, R0, R0, R0, DimensionsSummary.INV_LENGTH);
    /**
     * T<sup>1</sup>
     */
    Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0, DimensionsSummary.TIME);
    /**
     * Q<sup>1</sup>
     */
    Dimensions.ELECTRIC_CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0, DimensionsSummary.ELECTRIC_CHARGE);
    /**
     * Q<sup>1</sup>T<sup>-1<sup>
     */
    Dimensions.ELECTRIC_CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0, DimensionsSummary.ELECTRIC_CURRENT);
    /**
     *
     */
    Dimensions.THERMODYNAMIC_TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0, DimensionsSummary.THERMODYNAMIC_TEMPERATURE);
    /**
     *
     */
    Dimensions.AMOUNT_OF_SUBSTANCE = new Dimensions(R0, R0, R0, R0, R0, R1, R0, DimensionsSummary.AMOUNT_OF_SUBSTANCE);
    /**
     *
     */
    Dimensions.LUMINOUS_INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1, DimensionsSummary.LUMINOUS_INTENSITY);
    /**
     * Angular Momentum.
     */
    Dimensions.ANGULAR_MOMENTUM = new Dimensions(R1, R2, M1, R0, R0, R0, R0, DimensionsSummary.ANGULAR_MOMENTUM);
    /**
     * Rate of change of Area.
     */
    Dimensions.RATE_OF_CHANGE_OF_AREA = new Dimensions(R0, R2, M1, R0, R0, R0, R0, DimensionsSummary.RATE_OF_CHANGE_OF_AREA);
    /**
     * Electric Field.
     */
    Dimensions.ELECTRIC_FIELD = new Dimensions(R1, R1, M2, M1, R0, R0, R0, DimensionsSummary.ELECTRIC_FIELD);
    /**
     * Electric Permittivity times Area.
     */
    Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA = new Dimensions(M1, M1, R2, R2, R0, R0, R0, DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA);
    /**
     * Energy or Torque.
     */
    Dimensions.ENERGY_OR_TORQUE = new Dimensions(R1, R2, M2, R0, R0, R0, R0, DimensionsSummary.ENERGY_OR_TORQUE);
    /**
     * Force.
     */
    Dimensions.FORCE = new Dimensions(R1, R1, M2, R0, R0, R0, R0, DimensionsSummary.FORCE);
    /**
     * Inverse Mass.
     */
    Dimensions.INV_MASS = new Dimensions(M1, R0, R0, R0, R0, R0, R0, DimensionsSummary.INV_MASS);
    /**
     * Inverse Moment of Inertia.
     */
    Dimensions.INV_MOMENT_OF_INERTIA = new Dimensions(M1, M2, R0, R0, R0, R0, R0, DimensionsSummary.INV_MOMENT_OF_INERTIA);
    /**
     * Inverse Time.
     */
    Dimensions.INV_TIME = new Dimensions(R0, R0, M1, R0, R0, R0, R0, DimensionsSummary.INV_TIME);
    /**
     * Moment of Inertia.
     */
    Dimensions.MOMENT_OF_INERTIA = new Dimensions(R1, R2, R0, R0, R0, R0, R0, DimensionsSummary.MOMENT_OF_INERTIA);
    /**
     * Momentum.
     */
    Dimensions.MOMENTUM = new Dimensions(R1, R1, M1, R0, R0, R0, R0, DimensionsSummary.MOMENTUM);
    /**
     * Momentum squared.
     */
    Dimensions.MOMENTUM_SQUARED = new Dimensions(R2, R2, M2, R0, R0, R0, R0, DimensionsSummary.MOMENTUM_SQUARED);
    /**
     * Stiffness.
     */
    Dimensions.STIFFNESS = new Dimensions(R1, R0, M2, R0, R0, R0, R0, DimensionsSummary.STIFFNESS);
    /**
     * Friction.
     */
    Dimensions.FRICTION_COEFFICIENT = new Dimensions(R1, R0, M1, R0, R0, R0, R0, DimensionsSummary.FRICTION_COEFFICIENT);
    /**
     * Time squared.
     */
    Dimensions.TIME_SQUARED = new Dimensions(R0, R0, R2, R0, R0, R0, R0, DimensionsSummary.TIME_SQUARED);
    /**
     * Velocity
     */
    Dimensions.VELOCITY = new Dimensions(R0, R1, M1, R0, R0, R0, R0, DimensionsSummary.VELOCITY);
    /**
     * Velocity squared
     */
    Dimensions.VELOCITY_SQUARED = new Dimensions(R0, R2, M2, R0, R0, R0, R0, DimensionsSummary.VELOCITY_SQUARED);
    return Dimensions;
}());
export { Dimensions };
