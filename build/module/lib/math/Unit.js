import isUndefined from '../checks/isUndefined';
import { Dimensions } from '../math/Dimensions';
import { DimensionsSummary } from '../math/DimensionsSummary';
var entries = [];
// const NAMES_SI = ['kilogram', 'meter', 'second', 'coulomb', 'kelvin', 'mole', 'candela'];
/**
 * @hidden
 */
var SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];
/**
 * The numerator, denominator values for each dimension (M, L, T, Q, temperature, amount, intensity).
 * @hidden
 */
var patterns = [
    [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
    [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
    [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
    [-1, 1, -1, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
    [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [-1, 1, +3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [+0, 1, -2, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [+0, 1, -1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
    [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1],
    [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],
    [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 3, 1, -2, 1, -2, 1, 0, 1, 0, 1, 0, 1] // N·m**2/C**2
];
/**
 * The string literals for the patterns.
 * The convention is to write the unit compactly (without whitespace).
 * TODO: Would be nice to separate...
 * Name (same as the variable name)
 * Symbol
 * Expression in terms of other SI units
 * Expression in terms of SI base units.
 * @hidden
 */
var decodes = [
    ["F/m or C**2/N·m**2"],
    ["S or A/V"],
    ["F or C/V"],
    ["C**2/N"],
    ["C/kg"],
    ["N·m·m/kg·kg"],
    ["C/m**3"],
    ["C/m**2"],
    ["C/m"],
    ["J/kg"],
    ["Hz"],
    ["A"],
    ["m/s**2"],
    ["m/s"],
    ["kg·m/s"],
    ["Pa or N/m**2 or J/m**3"],
    ["Pa·s"],
    ["W/m**2"],
    ["N/m"],
    ["T or Wb/m**2"],
    ["W/(m·K)"],
    ["V/m or N/C"],
    ["N"],
    ["H/m"],
    ["J/K"],
    ["J/(kg·K)"],
    ["J/(mol·K)"],
    ["J/mol"],
    ["J or N·m"],
    ["J·s"],
    ["W or J/s"],
    ["V or W/A"],
    ["Ω or V/A"],
    ["H or Wb/A"],
    ["Wb"],
    ["N·m**2/C**2"]
];
/**
 * @hidden
 * @param multiplier
 * @param formatted
 * @param dimensions
 * @param labels
 * @param compact
 * @returns
 */
var dumbString = function (multiplier, formatted, dimensions, labels, compact) {
    var stringify = function (rational, label) {
        if (rational.numer === 0) {
            return null;
        }
        else if (rational.denom === 1) {
            if (rational.numer === 1) {
                if (compact) {
                    return label;
                }
                else {
                    return label;
                }
            }
            else {
                return label + "**" + rational.numer;
            }
        }
        else {
            return label + "**" + rational;
        }
    };
    var operatorStr = multiplier === 1 || dimensions.isOne() ? (compact ? "" : " ") : " ";
    var scaleString = multiplier === 1 ? (compact ? "" : formatted) : formatted;
    var unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
        return typeof x === 'string';
    }).join(" ");
    return "" + scaleString + operatorStr + unitsString;
};
/**
 * @hidden
 * @param multiplier
 * @param formatted
 * @param dimensions
 * @param labels
 * @param compact
 * @returns
 */
var unitString = function (multiplier, formatted, dimensions, labels, compact) {
    var M = dimensions.M;
    var L = dimensions.L;
    var T = dimensions.T;
    var Q = dimensions.Q;
    var temperature = dimensions.temperature;
    var amount = dimensions.amount;
    var intensity = dimensions.intensity;
    for (var i = 0, len = patterns.length; i < len; i++) {
        var pattern = patterns[i];
        if (M.numer === pattern[0] && M.denom === pattern[1] &&
            L.numer === pattern[2] && L.denom === pattern[3] &&
            T.numer === pattern[4] && T.denom === pattern[5] &&
            Q.numer === pattern[6] && Q.denom === pattern[7] &&
            temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
            amount.numer === pattern[10] && amount.denom === pattern[11] &&
            intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
            if (!compact) {
                return multiplier + " * " + decodes[i][0];
            }
            else {
                if (multiplier !== 1) {
                    return multiplier + " * " + decodes[i][0];
                }
                else {
                    return decodes[i][0];
                }
            }
        }
    }
    return dumbString(multiplier, formatted, dimensions, labels, compact);
};
/**
 * @hidden
 * @param lhs
 * @param rhs
 * @returns
 */
function add(lhs, rhs) {
    return Unit.valueOf(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}
/**
 * @hidden
 * @param lhs
 * @param rhs
 * @returns
 */
function sub(lhs, rhs) {
    return Unit.valueOf(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
}
/**
 * @hidden
 * @param lhs
 * @param rhs
 * @returns
 */
function mul(lhs, rhs) {
    return Unit.valueOf(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
}
/**
 * @hidden
 * @param α
 * @param unit
 * @returns
 */
function scale(α, unit) {
    return Unit.valueOf(α * unit.multiplier, unit.dimensions, unit.labels);
}
/**
 * @hidden
 * @param lhs
 * @param rhs
 * @returns
 */
function div(lhs, rhs) {
    return Unit.valueOf(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
}
/**
 * <p>
 * The Unit class represents the units for a measure.
 * </p>
 * <p>
 * It is important to note that the <code>Unit.ONE</code> value is considered to be equivalent to the absence
 * of a <code>Unit</code> instance or <code>undefined</code>. For this reason, it is convenient to use the
 * <code>static</code> methods when comparing or computing with the <code>Unit</code> class.
 * </p>
 */
var Unit = /** @class */ (function () {
    /**
     * @param multiplier
     * @param dimensions
     * @param labels The label strings to use for each dimension.
     */
    function Unit(multiplier, dimensions, labels) {
        this.multiplier = multiplier;
        this.dimensions = dimensions;
        this.labels = labels;
        if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
        }
        this.multiplier = multiplier;
        this.dimensions = dimensions;
        this.labels = labels;
    }
    /**
     * @param uom The unit of measure.
     * @returns `true` if the uom is one or if it is undefined.
     */
    Unit.isOne = function (uom) {
        if (uom === void 0) {
            return true;
        }
        else if (uom instanceof Unit) {
            return uom.isOne();
        }
        else {
            throw new Error("isOne argument must be a Unit or undefined.");
        }
    };
    /**
     * @param uom The unit of measure that must be dimensionless.
     */
    Unit.assertDimensionless = function (uom) {
        if (!Unit.isOne(uom)) {
            throw new Error("uom " + uom + " must be dimensionless.");
        }
    };
    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    Unit.compatible = function (lhs, rhs) {
        if (lhs) {
            if (rhs) {
                return lhs.compatible(rhs);
            }
            else {
                if (lhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new Error(lhs + " is incompatible with 1");
                }
            }
        }
        else {
            if (rhs) {
                if (rhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new Error("1 is incompatible with " + rhs);
                }
            }
            else {
                return void 0;
            }
        }
    };
    Unit.isCompatible = function (lhs, rhs) {
        if (lhs) {
            if (rhs) {
                return lhs.isCompatible(rhs);
            }
            else {
                if (lhs.isOne()) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            if (rhs) {
                if (rhs.isOne()) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
    };
    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    Unit.mul = function (lhs, rhs) {
        if (lhs) {
            if (rhs) {
                return lhs.mul(rhs);
            }
            else if (Unit.isOne(rhs)) {
                return lhs;
            }
            else {
                return void 0;
            }
        }
        else if (Unit.isOne(lhs)) {
            return rhs;
        }
        else {
            return void 0;
        }
    };
    /**
     * @param lhs
     * @param rhs
     */
    Unit.div = function (lhs, rhs) {
        if (lhs) {
            if (rhs) {
                return lhs.div(rhs);
            }
            else {
                return lhs;
            }
        }
        else {
            if (rhs) {
                return rhs.inv();
            }
            else {
                return Unit.ONE;
            }
        }
    };
    /**
     * Computes the multiplicative inverse of the specified unit of measure.
     */
    Unit.inv = function (uom) {
        if (uom instanceof Unit) {
            if (uom.isOne()) {
                return Unit.ONE;
            }
            else {
                return uom.inv();
            }
        }
        else {
            return Unit.ONE;
        }
    };
    /**
     *
     */
    Unit.mustBeUnit = function (name, uom) {
        if (uom instanceof Unit) {
            return uom;
        }
        else if (isUndefined(uom)) {
            return Unit.ONE;
        }
        else {
            throw new Error(name + " must be a Unit or undefined (meaning 1).");
        }
    };
    /**
     * Computes the value of the unit of measure raised to the specified power.
     */
    Unit.pow = function (uom, exponent) {
        if (uom instanceof Unit) {
            if (uom.isOne()) {
                return void 0;
            }
            else {
                if (exponent.isZero()) {
                    return void 0;
                }
                else {
                    return uom.pow(exponent);
                }
            }
        }
        else {
            return void 0;
        }
    };
    /**
     * @param uom
     * @returns
     */
    Unit.sqrt = function (uom) {
        if (uom instanceof Unit) {
            if (uom.isOne()) {
                return void 0;
            }
            else {
                return uom.sqrt();
            }
        }
        else {
            return void 0;
        }
    };
    /**
     * Constructs a Unit.
     */
    Unit.valueOf = function (multiplier, dimensions, labels) {
        // This method is optimized to minimize object creation.
        // The summary on the dimensions is used to improve lookup time.
        if (multiplier === 1) {
            switch (dimensions.summary) {
                case DimensionsSummary.AMOUNT_OF_SUBSTANCE: return Unit.MOLE;
                case DimensionsSummary.ANGULAR_MOMENTUM: return Unit.JOULE_SECOND;
                case DimensionsSummary.AREA: return Unit.METER_SQUARED;
                case DimensionsSummary.ELECTRIC_CHARGE: return Unit.COULOMB;
                case DimensionsSummary.ELECTRIC_CURRENT: return Unit.AMPERE;
                case DimensionsSummary.ELECTRIC_FIELD: return Unit.ELECTRIC_FIELD;
                case DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA: return Unit.COULOMB_SQUARED_PER_NEWTON;
                case DimensionsSummary.ENERGY_OR_TORQUE: return Unit.JOULE;
                case DimensionsSummary.FORCE: return Unit.NEWTON;
                case DimensionsSummary.FRICTION_COEFFICIENT: return Unit.FRICTION_COEFFICIENT;
                case DimensionsSummary.INV_LENGTH: return Unit.INV_METER;
                case DimensionsSummary.INV_MASS: return Unit.INV_KILOGRAM;
                case DimensionsSummary.INV_MOMENT_OF_INERTIA: return Unit.INV_KILOGRAM_METER_SQUARED;
                case DimensionsSummary.INV_TIME: return Unit.INV_SECOND;
                case DimensionsSummary.LENGTH: return Unit.METER;
                case DimensionsSummary.LUMINOUS_INTENSITY: return Unit.CANDELA;
                case DimensionsSummary.MASS: return Unit.KILOGRAM;
                case DimensionsSummary.MOMENT_OF_INERTIA: return Unit.KILOGRAM_METER_SQUARED;
                case DimensionsSummary.MOMENTUM: return Unit.KILOGRAM_METER_PER_SECOND;
                case DimensionsSummary.MOMENTUM_SQUARED: return Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED;
                case DimensionsSummary.ONE: return Unit.ONE;
                case DimensionsSummary.RATE_OF_CHANGE_OF_AREA: return Unit.METER_SQUARED_PER_SECOND;
                case DimensionsSummary.STIFFNESS: return Unit.STIFFNESS;
                case DimensionsSummary.THERMODYNAMIC_TEMPERATURE: return Unit.KELVIN;
                case DimensionsSummary.TIME: return Unit.SECOND;
                case DimensionsSummary.TIME_SQUARED: return Unit.SECOND_SQUARED;
                case DimensionsSummary.VELOCITY: return Unit.METER_PER_SECOND;
                case DimensionsSummary.VELOCITY_SQUARED: return Unit.METER_SQUARED_PER_SECOND_SQUARED;
                case DimensionsSummary.VOLUME: return Unit.METER_CUBED;
                default: {
                    // Do nothing.
                }
            }
        }
        // console.warn(`Unit.valueOf(${multiplier},${dimensions}) is not cached.`);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.multiplier === multiplier && entry.dimensions.equals(dimensions)) {
                return entry;
            }
        }
        // console.warn(`Unit.valueOf(${multiplier},${dimensions}) is not cached.`);
        var value = new Unit(multiplier, dimensions, labels);
        entries.push(value);
        // console.warn(`Unit cache size = ${entries.length}`);
        return value;
    };
    Unit.prototype.compatible = function (rhs) {
        if (rhs instanceof Unit) {
            try {
                this.dimensions.compatible(rhs.dimensions);
            }
            catch (e) {
                var cause = (e instanceof Error) ? e.message : "" + e;
                throw new Error(this + " is not compatible with " + rhs + ". Cause: " + cause);
            }
            return this;
        }
        else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
        }
    };
    /**
     * Computes the unit equal to `this / rhs`.
     */
    Unit.prototype.div = function (rhs) {
        return div(this, rhs);
    };
    /**
     * @returns true if this and rhs have the same dimensions.
     */
    Unit.prototype.isCompatible = function (rhs) {
        if (rhs instanceof Unit) {
            return this.dimensions.equals(rhs.dimensions);
        }
        else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
        }
    };
    Unit.prototype.isOne = function () {
        return this.dimensions.isOne() && (this.multiplier === 1);
    };
    Unit.prototype.inv = function () {
        return Unit.valueOf(1 / this.multiplier, this.dimensions.inv(), this.labels);
    };
    /**
     * Computes the unit equal to `this * rhs`.
     */
    Unit.prototype.mul = function (rhs) {
        return mul(this, rhs);
    };
    Unit.prototype.neg = function () {
        return Unit.valueOf(-this.multiplier, this.dimensions, this.labels);
    };
    Unit.prototype.pow = function (exponent) {
        return Unit.valueOf(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
    };
    Unit.prototype.sqrt = function () {
        return Unit.valueOf(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
    };
    Unit.prototype.toExponential = function (fractionDigits, compact) {
        return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels, compact);
    };
    Unit.prototype.toFixed = function (fractionDigits, compact) {
        return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels, compact);
    };
    Unit.prototype.toPrecision = function (precision, compact) {
        return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels, compact);
    };
    Unit.prototype.toString = function (radix, compact) {
        return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels, compact);
    };
    /**
     * @hidden
     * @param rhs
     * @returns
     */
    Unit.prototype.__add__ = function (rhs) {
        if (rhs instanceof Unit) {
            return add(this, rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param lhs
     * @returns
     */
    Unit.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Unit) {
            return add(lhs, this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param rhs
     * @returns
     */
    Unit.prototype.__sub__ = function (rhs) {
        if (rhs instanceof Unit) {
            return sub(this, rhs);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param lhs
     * @returns
     */
    Unit.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Unit) {
            return sub(lhs, this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param rhs
     * @returns
     */
    Unit.prototype.__mul__ = function (rhs) {
        if (rhs instanceof Unit) {
            return mul(this, rhs);
        }
        else if (typeof rhs === 'number') {
            return scale(rhs, this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param lhs
     * @returns
     */
    Unit.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Unit) {
            return mul(lhs, this);
        }
        else if (typeof lhs === 'number') {
            return scale(lhs, this);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param rhs
     * @returns
     */
    Unit.prototype.__div__ = function (rhs) {
        if (rhs instanceof Unit) {
            return div(this, rhs);
        }
        else if (typeof rhs === 'number') {
            return Unit.valueOf(this.multiplier / rhs, this.dimensions, this.labels);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @param lhs
     * @returns
     */
    Unit.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Unit) {
            return div(lhs, this);
        }
        else if (typeof lhs === 'number') {
            return Unit.valueOf(lhs / this.multiplier, this.dimensions.inv(), this.labels);
        }
        else {
            return void 0;
        }
    };
    /**
     * @hidden
     * @returns
     */
    Unit.prototype.__pos__ = function () {
        return this;
    };
    /**
     * @hidden
     * @returns
     */
    Unit.prototype.__neg__ = function () {
        return this.neg();
    };
    /**
     * Internal symbolic constant to improve code readability.
     * May be undefined or an instance of Unit.
     */
    Unit.ONE = new Unit(1, Dimensions.ONE, SYMBOLS_SI);
    /**
     * Unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    Unit.KILOGRAM = new Unit(1, Dimensions.MASS, SYMBOLS_SI);
    /**
     * Unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1/299 792 458 of a second.
     */
    Unit.METER = new Unit(1, Dimensions.LENGTH, SYMBOLS_SI);
    /**
     * Unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    Unit.SECOND = new Unit(1, Dimensions.TIME, SYMBOLS_SI);
    /**
     * Unit of electric charge.
     *
     */
    Unit.COULOMB = new Unit(1, Dimensions.ELECTRIC_CHARGE, SYMBOLS_SI);
    /**
     * Unit of electric current.
     * The ampere is that constant current which,
     * if maintained in two straight parallel conductors of infinite length,
     * of negligible circular cross-section,
     * and placed 1 meter apart in vacuum,
     * would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    Unit.AMPERE = new Unit(1, Dimensions.ELECTRIC_CURRENT, SYMBOLS_SI);
    /**
     * Unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1/273.16 of the thermodynamic temperature of the triple point of water.
     */
    Unit.KELVIN = new Unit(1, Dimensions.THERMODYNAMIC_TEMPERATURE, SYMBOLS_SI);
    /**
     * Unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    Unit.MOLE = new Unit(1, Dimensions.AMOUNT_OF_SUBSTANCE, SYMBOLS_SI);
    /**
     * Unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction,
     * of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1/683 watt per steradian.
     */
    Unit.CANDELA = new Unit(1, Dimensions.LUMINOUS_INTENSITY, SYMBOLS_SI);
    Unit.COULOMB_SQUARED_PER_NEWTON = new Unit(1, Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA, SYMBOLS_SI);
    Unit.ELECTRIC_FIELD = new Unit(1, Dimensions.ELECTRIC_FIELD, SYMBOLS_SI);
    /**
     *
     */
    Unit.NEWTON = new Unit(1, Dimensions.FORCE, SYMBOLS_SI);
    /**
     *
     */
    Unit.JOULE = new Unit(1, Dimensions.ENERGY_OR_TORQUE, SYMBOLS_SI);
    /**
     * The unit of angular momentum.
     */
    Unit.JOULE_SECOND = new Unit(1, Dimensions.ANGULAR_MOMENTUM, SYMBOLS_SI);
    Unit.METER_SQUARED = new Unit(1, Dimensions.AREA, SYMBOLS_SI);
    Unit.METER_CUBED = new Unit(1, Dimensions.VOLUME, SYMBOLS_SI);
    Unit.SECOND_SQUARED = new Unit(1, Dimensions.TIME_SQUARED, SYMBOLS_SI);
    Unit.INV_KILOGRAM = new Unit(1, Dimensions.INV_MASS, SYMBOLS_SI);
    Unit.INV_METER = new Unit(1, Dimensions.INV_LENGTH, SYMBOLS_SI);
    /**
     * The unit of angular velocity.
     */
    Unit.INV_SECOND = new Unit(1, Dimensions.INV_TIME, SYMBOLS_SI);
    /**
     * The unit of moment of inertia.
     */
    Unit.KILOGRAM_METER_SQUARED = new Unit(1, Dimensions.MOMENT_OF_INERTIA, SYMBOLS_SI);
    /**
     * The unit of linear momentum.
     */
    Unit.KILOGRAM_METER_PER_SECOND = new Unit(1, Dimensions.MOMENTUM, SYMBOLS_SI);
    Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions.MOMENTUM_SQUARED, SYMBOLS_SI);
    Unit.INV_KILOGRAM_METER_SQUARED = new Unit(1, Dimensions.INV_MOMENT_OF_INERTIA, SYMBOLS_SI);
    /**
     * The unit for a Spring constant, N/m.
     */
    Unit.STIFFNESS = new Unit(1, Dimensions.STIFFNESS, SYMBOLS_SI);
    /**
     * The unit for a Friction Coefficient, Ns/m.
     */
    Unit.FRICTION_COEFFICIENT = new Unit(1, Dimensions.FRICTION_COEFFICIENT, SYMBOLS_SI);
    /**
     *
     */
    Unit.METER_PER_SECOND = new Unit(1, Dimensions.VELOCITY, SYMBOLS_SI);
    Unit.METER_SQUARED_PER_SECOND = new Unit(1, Dimensions.RATE_OF_CHANGE_OF_AREA, SYMBOLS_SI);
    Unit.METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions.VELOCITY_SQUARED, SYMBOLS_SI);
    return Unit;
}());
export { Unit };
