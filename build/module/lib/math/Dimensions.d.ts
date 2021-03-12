import { QQ } from '../math/QQ';
/**
 * The type of the argument os the `setDimensionsChecking` function.
 */
export declare type DimensionsChecking = 'none' | 'strict';
/**
 * @param mode
 */
export declare function setDimensionsChecking(mode: DimensionsChecking): void;
/**
 * @hidden
 */
export declare function getDimensionsChecking(): DimensionsChecking;
/**
 * Keeps track of the dimensions of a physical quantity using seven rational exponents.
 * Each of the exponents corresponds to a dimension in the S.I. system of units.
 * @hidden
 */
export declare class Dimensions {
    /**
     * All exponents are zero, a dimensionless quantity.
     */
    static readonly ONE: Dimensions;
    /**
     * M<sup>1</sup>
     */
    static readonly MASS: Dimensions;
    /**
     * L<sup>1</sup>
     */
    static readonly LENGTH: Dimensions;
    /**
     * L<sup>2</sup>
     */
    static readonly AREA: Dimensions;
    /**
     * L<sup>3</sup>
     */
    static readonly VOLUME: Dimensions;
    /**
     * Inverse Length.
     */
    static readonly INV_LENGTH: Dimensions;
    /**
     * T<sup>1</sup>
     */
    static readonly TIME: Dimensions;
    /**
     * Q<sup>1</sup>
     */
    static readonly ELECTRIC_CHARGE: Dimensions;
    /**
     * Q<sup>1</sup>T<sup>-1<sup>
     */
    static readonly ELECTRIC_CURRENT: Dimensions;
    /**
     *
     */
    static readonly THERMODYNAMIC_TEMPERATURE: Dimensions;
    /**
     *
     */
    static readonly AMOUNT_OF_SUBSTANCE: Dimensions;
    /**
     *
     */
    static readonly LUMINOUS_INTENSITY: Dimensions;
    /**
     * Angular Momentum.
     */
    static readonly ANGULAR_MOMENTUM: Dimensions;
    /**
     * Rate of change of Area.
     */
    static readonly RATE_OF_CHANGE_OF_AREA: Dimensions;
    /**
     * Electric Field.
     */
    static readonly ELECTRIC_FIELD: Dimensions;
    /**
     * Electric Permittivity times Area.
     */
    static readonly ELECTRIC_PERMITTIVITY_TIMES_AREA: Dimensions;
    /**
     * Energy or Torque.
     */
    static readonly ENERGY_OR_TORQUE: Dimensions;
    /**
     * Force.
     */
    static readonly FORCE: Dimensions;
    /**
     * Inverse Mass.
     */
    static readonly INV_MASS: Dimensions;
    /**
     * Inverse Moment of Inertia.
     */
    static readonly INV_MOMENT_OF_INERTIA: Dimensions;
    /**
     * Inverse Time.
     */
    static readonly INV_TIME: Dimensions;
    /**
     * Moment of Inertia.
     */
    static readonly MOMENT_OF_INERTIA: Dimensions;
    /**
     * Momentum.
     */
    static readonly MOMENTUM: Dimensions;
    /**
     * Momentum squared.
     */
    static readonly MOMENTUM_SQUARED: Dimensions;
    /**
     * Stiffness.
     */
    static readonly STIFFNESS: Dimensions;
    /**
     * Time squared.
     */
    static readonly TIME_SQUARED: Dimensions;
    /**
     * Velocity
     */
    static readonly VELOCITY: Dimensions;
    /**
     * Velocity squared
     */
    static readonly VELOCITY_SQUARED: Dimensions;
    readonly M: QQ;
    readonly L: QQ;
    readonly T: QQ;
    readonly Q: QQ;
    readonly temperature: QQ;
    readonly amount: QQ;
    readonly intensity: QQ;
    private readonly summary_;
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
    private constructor();
    get summary(): number;
    /**
     * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
     */
    compatible(rhs: Dimensions): Dimensions;
    equals(rhs: Dimensions): boolean;
    /**
     * Multiplies dimensions by adding rational exponents.
     *
     * @param rhs
     * @returns <code>this * rhs</code>
     */
    mul(rhs: Dimensions): Dimensions;
    /**
     * Divides dimensions by subtracting rational exponents.
     *
     * @param rhs
     * @returns <code>this / rhs</code>
     */
    div(rhs: Dimensions): Dimensions;
    /**
     * Computes the power function by multiplying rational exponents.
     *
     * @param rhs
     * @returns <code>pow(this, rhs)</code>
     */
    pow(exponent: QQ): Dimensions;
    /**
     * Computes the square root by dividing each rational component by two.
     *
     * @returns
     */
    sqrt(): Dimensions;
    /**
     * Determines whether all the exponents of this dimensions number are zero.
     * This implies a dimensionless quantity.
     *
     * @returns <code>true</code> if all the exponents are zero, otherwise <code>false</code>.
     */
    isOne(): boolean;
    /**
     * Computes the multiplicative inverse of this dimensions number.
     * This is achived by changing the signs of all the exponent quantities.
     *
     * @returns The multiplicative inverse of this dimensions number.
     */
    inv(): Dimensions;
    /**
     * Creates a representation of this <code>Dimensions</code> instance.
     *
     * @returns
     */
    toString(): string;
    /**
     * @returns this + rhs
     */
    __add__(rhs: Dimensions): Dimensions;
    /**
     * @returns lhs + this
     */
    __radd__(lhs: Dimensions): Dimensions;
    /**
     *
     * @param rhs
     * @returns
     */
    __sub__(rhs: Dimensions): Dimensions;
    /**
     *
     * @param lhs
     * @returns
     */
    __rsub__(lhs: Dimensions): Dimensions;
    /**
     *
     * @param rhs
     * @returns
     */
    __mul__(rhs: Dimensions): Dimensions;
    /**
     *
     * @param lhs
     * @returns
     */
    __rmul__(lhs: Dimensions): Dimensions;
    /**
     *
     * @param rhs
     * @returns
     */
    __div__(rhs: Dimensions): Dimensions;
    /**
     * @param lhs
     * @returns
     */
    __rdiv__(lhs: Dimensions): Dimensions;
    /**
     * @returns
     */
    __pos__(): Dimensions;
    /**
     *
     * @returns
     */
    __neg__(): Dimensions;
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
    static valueOf(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ): Dimensions;
}
