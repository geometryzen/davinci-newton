import { Dimensions } from '../math/Dimensions';
import { QQ } from '../math/QQ';
/**
 * <p>
 * The Unit class represents the units for a measure.
 * </p>
 */
export declare class Unit {
    readonly multiplier: number;
    readonly dimensions: Dimensions;
    readonly labels: string[];
    /**
     * Internal symbolic constant to improve code readability.
     * May be undefined or an instance of Unit.
     */
    static readonly ONE: Unit;
    /**
     * Unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    static readonly KILOGRAM: Unit;
    /**
     * Unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1/299 792 458 of a second.
     */
    static readonly METER: Unit;
    /**
     * Unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    static readonly SECOND: Unit;
    /**
     * Unit of electric charge.
     *
     */
    static readonly COULOMB: Unit;
    /**
     * Unit of electric current.
     * The ampere is that constant current which,
     * if maintained in two straight parallel conductors of infinite length,
     * of negligible circular cross-section,
     * and placed 1 meter apart in vacuum,
     * would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    static readonly AMPERE: Unit;
    /**
     * Unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1/273.16 of the thermodynamic temperature of the triple point of water.
     */
    static readonly KELVIN: Unit;
    /**
     * Unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    static readonly MOLE: Unit;
    /**
     * Unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction,
     * of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1/683 watt per steradian.
     */
    static readonly CANDELA: Unit;
    private static readonly COULOMB_SQUARED_PER_NEWTON;
    private static readonly ELECTRIC_FIELD;
    /**
     *
     */
    static readonly NEWTON: Unit;
    /**
     *
     */
    static readonly JOULE: Unit;
    /**
     * The unit of angular momentum.
     */
    static readonly JOULE_SECOND: Unit;
    private static readonly METER_SQUARED;
    private static readonly METER_CUBED;
    private static readonly SECOND_SQUARED;
    private static readonly INV_KILOGRAM;
    private static readonly INV_METER;
    /**
     * The unit of angular velocity.
     */
    static readonly INV_SECOND: Unit;
    private static readonly KILOGRAM_METER_SQUARED;
    /**
     * The unit of momentum.
     */
    static readonly KILOGRAM_METER_PER_SECOND: Unit;
    private static readonly KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED;
    private static readonly INV_KILOGRAM_METER_SQUARED;
    /**
     * The unit for a Spring constant, N/m.
     */
    static readonly STIFFNESS: Unit;
    /**
     * The unit for a Friction Coefficient, Ns/m.
     */
    static readonly FRICTION_COEFFICIENT: Unit;
    /**
     *
     */
    private static readonly METER_PER_SECOND;
    private static readonly METER_SQUARED_PER_SECOND;
    private static readonly METER_SQUARED_PER_SECOND_SQUARED;
    /**
     * @param multiplier
     * @param dimensions
     * @param labels The label strings to use for each dimension.
     */
    private constructor();
    private compatible;
    /**
     * @returns true if this and rhs have the same dimensions.
     */
    private isCompatible;
    /**
     *
     */
    __add__(rhs: Unit): Unit | undefined;
    __radd__(lhs: Unit): Unit | undefined;
    __sub__(rhs: Unit): Unit;
    __rsub__(lhs: Unit): Unit;
    /**
     * Computes the unit equal to `this * rhs`.
     */
    mul(rhs: Unit): Unit;
    __mul__(rhs: number | Unit): Unit;
    __rmul__(lhs: number | Unit): Unit;
    /**
     * Computes the unit equal to `this / rhs`.
     */
    div(rhs: Unit): Unit;
    __div__(rhs: number | Unit): Unit;
    __rdiv__(lhs: number | Unit): Unit;
    private pow;
    private inv;
    private neg;
    isOne(): boolean;
    private sqrt;
    toExponential(fractionDigits?: number, compact?: boolean): string;
    toFixed(fractionDigits?: number, compact?: boolean): string;
    toPrecision(precision?: number, compact?: boolean): string;
    toString(radix?: number, compact?: boolean): string;
    __pos__(): Unit;
    __neg__(): Unit;
    /**
     * @param uom The unit of measure.
     */
    static isOne(uom: Unit): boolean;
    /**
     * @param uom The unit of measure that must be dimensionless.
     */
    static assertDimensionless(uom: Unit): void;
    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    static compatible(lhs: Unit, rhs: Unit): Unit | undefined;
    static isCompatible(lhs: Unit, rhs: Unit): boolean;
    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    static mul(lhs: Unit, rhs: Unit): Unit | undefined;
    /**
     * @param lhs
     * @param rhs
     */
    static div(lhs: Unit, rhs: Unit): Unit;
    /**
     * Computes the multiplicative inverse of the specified unit of measure.
     */
    static inv(uom: Unit): Unit;
    /**
     *
     */
    static mustBeUnit(name: string, uom: Unit): Unit;
    /**
     * Computes the value of the unit of measure raised to the specified power.
     */
    static pow(uom: Unit, exponent: QQ): Unit | undefined;
    /**
     * @param uom
     * @returns
     */
    static sqrt(uom: Unit): Unit | undefined;
    /**
     * Constructs a Unit.
     */
    static valueOf(multiplier: number, dimensions: Dimensions, labels: string[]): Unit;
}
