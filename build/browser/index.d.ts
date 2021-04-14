// Type definitions for davinci-newton 1.0.80
// Project: https://github.com/geometryzen/davinci-newton
// Definitions by: David Geo Holmes david.geo.holmes@gmail.com https://www.stemcstudio.com
//
// This file was created manually in order to support the davinci-newton library.
// These declarations are appropriate when using the library through the global
// variable, 'NEWTON'.
//

/**
 * The QQ class represents a rational number.
 * The QQ implementation is that of an immutable value.
 * The numerator and denominator are reduced to their lowest form.
 * Construct new instances using the static valueOf method.
 */
export class QQ {

    /**
     * The denominator.
     */
    readonly denom: number;

    /**
     * The numerator.
     */
    readonly numer: number;

    /**
     *
     */
    add(rhs: QQ): QQ

    /**
     *
     */
    div(rhs: QQ): QQ

    /**
     *
     */
    equals(other: QQ): boolean

    /**
     * Computes the multiplicative inverse of this rational number.
     */
    inv(): QQ

    /**
     * Determines whether this rational number is the multiplicative identity, 1.
     */
    isOne(): boolean

    /**
     * Determines whether this rational number is the additive identity, 0.
     */
    isZero(): boolean

    /**
     *
     */
    mul(rhs: QQ): QQ

    /**
     * Computes the additive inverse of this rational number.
     */
    neg(): QQ

    /**
     *
     */
    sub(rhs: QQ): QQ

    /**
     *
     */
    toString(): string

    /**
     *
     */
    static valueOf(numer: number, denom: number): QQ
}

/**
 * Determines the behavior when incompatibilities are detected in units of measure.
 * 'none':           no warnings.
 * 'strict':         throws an Error.
 * The default value is 'strict'.
 * @param mode The desired dimensions checking mode.
 */
export function setDimensionsChecking(mode: 'none' | 'strict'): void;

/**
 * The dimensions of a physical quantity.
 */
export class Dimensions {
    readonly M: QQ;
    readonly L: QQ;
    readonly T: QQ;
    readonly Q: QQ;
    readonly temperature: QQ;
    readonly amount: QQ;
    readonly intensity: QQ;
    constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity: QQ);
    isOne(): boolean;
    isZero(): boolean;
    inv(): Dimensions;
    neg(): Dimensions;

    /**
     *
     */
    static readonly ONE: Dimensions;

    /**
     *
     */
    static readonly MASS: Dimensions;

    /**
     *
     */
    static readonly LENGTH: Dimensions;

    /**
     *
     */
    static readonly TIME: Dimensions;

    /**
     *
     */
    static readonly ELECTRIC_CHARGE: Dimensions;

    /**
     *
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
}

/**
 * The unit of measure for a physical quantity.
 */
export class Unit {
    dimensions: Dimensions;

    /**
     * The label strings to use for each dimension.
     */
    labels: string[];
    multiplier: number;

    /**
     * The ampere.
     */
    static AMPERE: Unit;

    /**
     * The candela.
     */
    static CANDELA: Unit;

    /**
     * The coulomb.
     */
    static COULOMB: Unit;

    /**
     * The kelvin.
     */
    static KELVIN: Unit;

    /**
     * The kilogram.
     */
    static KILOGRAM: Unit;

    /**
     * The meter.
     */
    static METER: Unit;

    /**
     * The mole.
     */
    static MOLE: Unit;

    /**
     * The second.
     */
    static SECOND: Unit;

    /**
     * The unit of angular momentum.
     */
    static JOULE_SECOND: Unit;

    /**
    * The unit of linear momentum.
    */
    static KILOGRAM_METER_PER_SECOND: Unit;

    /**
     * The unit of force.
     */
    static NEWTON: Unit;

    /**
     * 
     */
    public static valueOf(multiplier: number, dimensions: Dimensions, labels: string[]): Unit;

    /**
     * 
     */
    private constructor(multiplier: number, dimensions: Dimensions, labels: string[]);

    /**
     * Computes the unit equal to `this / rhs`.
     */
    div(rhs: Unit): Unit;

    /**
     * 
     */
    isOne(): boolean;

    /**
     * Computes the unit equal to `this * rhs`.
     */
    mul(rhs: Unit): Unit;

    /**
     * 
     */
    toExponential(fractionDigits?: number, compact?: boolean): string;

    /**
     * 
     */
    toFixed(fractionDigits?: number, compact?: boolean): string;

    /**
     * 
     */
    toPrecision(precision?: number, compact?: boolean): string;

    /**
     * 
     */
    toString(radix?: number, compact?: boolean): string;

    /**
     * 
     */
    static assertDimensionless(uom: Unit | undefined): void;

    /**
     * Returns the compatible unit of measure or throws an error if the units are not compatible.
     * If either argument is undefined or null it is considered to be equal to unity.
     * This function should be used when adding or subtracting measures.
     */
    static compatible(lhs: Unit | undefined, rhs: Unit | undefined): Unit;

    /**
     * Returns the quotient of the two units of measure.
     * If either argument is undefined or null it is considered to be equal to unity.
     * This function should be used when dividing measures.
     */
    static div(lhs: Unit | undefined, rhs: Unit | undefined): Unit;

    /**
     * Computes the multiplicative inverse of the specified unit of measure.
     */
    static inv(uom: Unit): Unit;

    /**
     * @param uom The unit of measure.
     * @returns `true` if the uom is one or if it is undefined.
     */
    static isOne(uom: Unit | undefined): boolean;

    /**
     * Returns the product of the two units of measure.
     * If either argument is undefined or null it is considered to be equal to unity.
     * This function should be used when multiplying measures.
     */
    static mul(lhs: Unit | undefined, rhs: Unit | undefined): Unit;

    static mustBeUnit(name: string, uom: Unit): Unit;

    /**
     * Computes the value of the unit of measure raised to the specified power.
     */
    static pow(uom: Unit, exponent: QQ): Unit;

    static sqrt(uom: Unit): Unit;
}

/**
 *
 */
export interface SimObject {
    /**
     * 
     */
    expireTime: number;
}

export class SimList {
    constructor();
    add(simObject: SimObject): void;
    forEach(callBack: (simObject: SimObject, index: number) => any): void;
    remove(simObject: SimObject): void;
    removeTemporary(time: number): void;
}

/**
 * Defines the methods that must be supported by a simulation system in order to be
 * integrated by a differential equation solver.
 */
export interface DiffEqSolverSystem {
    /**
     * Gets the state vector, Y(t).
     * This is the first method that is called by the solver.
     */
    getState(): number[];

    /**
     * Computes the derivatives of the state variables based upon the specified state.
     * This is the second method that is called by the solver.
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void;

    /**
     * Sets the state vector, Y(t).
     * This is the third method that is called by the solver.
     */
    setState(state: number[]): void;
}

/**
 * Defines a standard interface for integrators (differential equation solvers) so that
 * they may be used in an interoperable way with various strategies for advancing the simulation.
 */
export interface DiffEqSolver {
    step(stepSize: number, uomStep: Unit): void;
}

/**
 *
 */
export interface Simulation extends DiffEqSolverSystem {
    /**
     * 
     */
    readonly time: number;

    /**
     * Handler for actions to be performed before getState and the evaluate calls.
     */
    prolog(): void;

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     */
    epilog(): void;
}

/**
 *
 */
export class VarsList {
    constructor(varNames: string[]);
    addVariables(names: string[]): number;
    deleteVariables(index: number, howMany: number): void;
    incrSequence(...indexes: number[]): void;
    getValues(): number[];
    setValues(values: number[], continuous?: boolean): void;
    setValue(index: number, value: number, continuous?: boolean): void;
    getTime(): number;
    timeIndex(): number;
}

export interface Scalar {
    a: number;
    uom?: Unit;
}

export interface Pseudo {
    b: number;
    uom?: Unit;
}

export interface VectorE1 {
    x: number;
    uom?: Unit;
}

export interface VectorE2 {
    x: number;
    y: number;
    uom?: Unit;
}

export interface VectorE3 {
    x: number;
    y: number;
    z: number;
    uom?: Unit;
}

export interface BivectorE1 {
    uom?: Unit;
}

export interface BivectorE2 {
    xy: number;
    uom?: Unit;
}

export interface BivectorE3 {
    yz: number;
    zx: number;
    xy: number;
    uom?: Unit;
}

export interface SpinorE1 extends Scalar, BivectorE1 {
}

export interface SpinorE2 extends Scalar, BivectorE2 {
}

export interface SpinorE3 extends Scalar, BivectorE3 {
}

/**
 * The coordinates for a multivector in 2D in geometric Cartesian basis.
 */
export interface GeometricE1 extends Scalar, SpinorE1, VectorE1 {

}

/**
 * The coordinates for a multivector in 2D in geometric Cartesian basis.
 */
export interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {

}

/**
 * The coordinates for a multivector in 3D in geometric Cartesian basis.
 */
export interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

}

export interface LinearNumber<I, M, S, V> {
    add(rhs: I, α?: number): M;
    divByScalar(α: number, uom?: Unit): M;
    equals(other: unknown): boolean;
    scale(α: number): M;
    neg(): M;
    reflect(n: V): M;
    rotate(rotor: S): M;
    sub(rhs: I, α?: number): M;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
}

export interface GeometricNumber<I, M, S, V> extends LinearNumber<I, M, S, V> {

    /**
     * Addition of a scalar.
     */
    addScalar(a: number, uom?: Unit, α?: number): M;

    /**
     * Conjugate
     */
    conj(): M;

    /**
     * Left contraction
     */
    lco(rhs: I): M;

    /**
     * divide really only applies to division algebras, may not be defined.
     */
    div(rhs: I): M;

    /**
     * Exterior or Outer Product.
     */
    ext(rhs: I): M;

    /**
     * extraction of grade.
     */
    grade(grade: number): M;

    /**
     * Inverse (may not exist).
     */
    inv(): M;

    /**
     *
     */
    isOne(): boolean;

    /**
     *
     */
    isScalar(): boolean;

    /**
     *
     */
    isZero(): boolean;

    /**
     * Multiplication.
     */
    mul(rhs: I): M;

    /**
     * Right contraction
     */
    rco(rhs: I): M;

    /**
     * Reverse
     */
    rev(): M;

    /**
     * Scalar Product
     */
    scp(rhs: I): M;

    /**
     * squared norm, scp(x, rev(x))
     */
    squaredNorm(): M;

    subScalar(a: number, uom?: Unit, α?: number): M;
}

/**
 * A mutable and lockable multivector in 1D with a Euclidean metric and optional unit of measure.
 */
export class Geometric1 implements GeometricE1, GeometricNumber<GeometricE1, Geometric1, SpinorE1, VectorE1> {

    /**
     * Constructs a new scalar from a number and a unit of measure.
     * The multivector (scalar) is mutable (unlocked).
     * @param a The coordinate corresponding to the scalar component of the multivector. 
     * @param uom The optional unit of measure.
     */
    static scalar(a: number, uom?: Unit): Geometric1;

    /**
     * Constructs a new vector from Cartesian coordinates and a unit of measure.
     * The multivector (vector) is mutable (unlocked).
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param uom The optional unit of measure.
     */
    static vector(x: number, uom?: Unit): Geometric1;

    /**
     * Standard Basis vector corresponding to the x coordinate.
     * The e1 multivector (vector) is immutable (locked).
     */
    static readonly e1: Geometric1;

    /**
     * The identity element for multiplication, 1 (scalar).
     * The one multivector (scalar) is immutable (locked).
     */
    static readonly one: Geometric1;

    /**
     * The identity element for addition, 0.
     * The zero multivector is immutable (locked).
     */
    static readonly zero: Geometric1;

    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum
     * during a time interval of 1 / 299 792 458 of a second.
     * The meter multivector (scalar) is immutable (locked).
     */
    static readonly meter: Geometric1;

    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the
     * international prototype of the kilogram.
     * The kilogram multivector (scalar) is immutable (locked).
     */
    static readonly kilogram: Geometric1;

    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation
     * corresponding to the transition between
     * the two hyperfine levels of the ground state of the cesium 133 atom.
     * The second multivector (scalar) is immutable (locked).
     */
    static readonly second: Geometric1;

    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel
     * conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum,
     * would produce between these conductors a force equal to 2E-7 newton per meter of length.
     * The ampere multivector (scalar) is immutable (locked).
     */
    static readonly ampere: Geometric1;

    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature
     * of the triple point of water.
     * The kelvin multivector (scalar) is immutable (locked).
     */
    static readonly kelvin: Geometric1;

    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are
     * atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions,
     * electrons, other particles, or specified groups of such particles.
     * The mole multivector (scalar) is immutable (locked).
     */
    static readonly mole: Geometric3;

    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction,
     * of a source that emits monochromatic radiation of frequency 540 x 10E12
     * hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     * The candela multivector (scalar) is immutable (locked).
     */
    static readonly candela: Geometric1;

    /**
     * SI derived unit of electric charge, quantity of electricity.
     * The coulomb multivector (scalar) is immutable (locked).
     */
    static readonly coulomb: Geometric1;

    /**
     * SI derived unit of force.
     * The newton multivector (scalar) is immutable (locked).
     */
    static readonly newton: Geometric1;

    /**
     * SI derived unit of energy, work, quantity of heat.
     * The joule multivector (scalar) is immutable (locked).
     */
    static readonly joule: Geometric1;

    /**
     * The scalar coordinate of this multivector.
     */
    a: number;
    /**
     * The vector coordinate of this multivector corresponding to the e1 standard basis vector.
     */
    x: number;
    /**
     * The optional unit of measure of this multivector. If undefined then it is equivalent to one.
     */
    uom?: Unit;
    /**
     * The grades that are present in this multivector.
     * This is a bitmask describing the grades that are non-zero in this multivector.
     * 0x1 = scalar, 0x2 = vector.
     */
    readonly grades: number;
    /**
     * Constructs a mutable instance of Geometric1 from coordinates and an optional unit of measure.
     * @param coords The 2 coordinates are in the order [a, x]. 
     * @param uom The optional unit of measure.
     */
    constructor(coords?: [a: number, x: number], uom?: Unit);
    add(rhs: Geometric1, α?: number): Geometric1;
    addScalar(a: number, uom?: Unit, α?: number): Geometric1;
    addVector(v: VectorE1, α?: number): Geometric1;
    clone(): Geometric1;
    conj(): Geometric1;
    copy(source: Geometric1): Geometric1;
    copyVector(vector: Geometric1): Geometric1;
    div(rhs: Geometric1): Geometric1;
    divByNumber(α: number): Geometric1;
    divByScalar(α: number, uom?: Unit): Geometric1;
    equals(other: unknown): boolean;
    ext(rhs: Geometric1): Geometric1;
    grade(grade: number): Geometric1;
    /**
     * Determines whether this multivector is locked.
     * If the multivector is in the unlocked state then it is mutable.
     * If the multivector is in the locked state then it is immutable.
     */
    isLocked(): boolean;
    isMutable(): boolean;
    isOne(): boolean;
    isScalar(): boolean;
    isZero(): boolean;
    lco(rhs: Geometric1): Geometric1;
    mul(rhs: Geometric1): Geometric1;
    mulByNumber(α: number): Geometric1;
    mulByScalar(α: number, uom?: Unit): Geometric1;
    magnitude(): Geometric1;
    rco(rhs: Geometric1): Geometric1;
    rev(): Geometric1;
    scale(α: number): Geometric1;
    scp(rhs: Geometric1): Geometric1;
    squaredNorm(): Geometric1;
    subScalar(a: number, uom?: Unit, α?: number): Geometric1;
    reflect(n: Geometric1): Geometric1;
    rotate(rotor: Geometric1): Geometric1;
    sub(rhs: Geometric1, α?: number): Geometric1;
    subScalar(a: number, uom?: Unit, α?: number): Geometric1;
    subVector(v: VectorE1, α?: number): Geometric1;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
    zero(): Geometric1;
    inv(): Geometric1;
    neg(): Geometric1;
    /**
     * Locks this multivector (preventing any further mutation),
     * and returns a token that may be used to unlock it.
     */
    lock(): number;
    /**
     * Unlocks this multivector (allowing mutation),
     * using a token that was obtained from a preceding lock method call.
     */
    unlock(token: number): void;
}

/**
 * A mutable and lockable multivector in 2D with a Euclidean metric and optional unit of measure.
 */
export class Geometric2 implements GeometricE2, GeometricNumber<GeometricE2, Geometric2, SpinorE2, VectorE2> {
    /**
     * The coordinate corresponding to the unit standard basis scalar.
     */
    a: number;

    /**
     * The coordinate corresponding to the e1 standard basis vector.
     */
    x: number;

    /**
     * The coordinate corresponding to the e2 standard basis vector.
     */
    y: number;

    /**
     * The coordinate corresponding to the e1e2 standard basis bivector.
     */
    xy: number;

    /**
     * The pseudoscalar coordinate of the multivector.
     */
    b: number;

    /**
     * The optional unit of measure.
     */
    uom?: Unit;

    /**
     * Constructs a mutable instance of Geometric2 from coordinates and an optional unit of measure.
     * @param coords The 4 coordinates are in the order [a, x, y, b]. 
     * @param uom The optional unit of measure.
     */
    constructor(coords?: [a: number, x: number, y: number, b: number], uom?: Unit);
    isScalar(): boolean;
    scale(α: number): Geometric2;

    /**
     * Adds M * α to this multivector.
     *
     * this ⟼ this + M * α
     */
    add(M: GeometricE2, α?: number): Geometric2;

    /**
     * Sets this multivector to the sum of a and b.
     *
     * this ⟼ a + b
     */
    add2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * Adds the pseudoscalar coordinate to this multivector.
     */
    addPseudo(β: number, uom?: Unit): Geometric2;

    /**
     * Adds a scalar to this multivector.
     * 
     * @param a The scalar component value.
     * @param uom The optional unit of measure.
     * @param α The fraction of a that should be added.
     */
    addScalar(a: number, uom?: Unit, α?: number): Geometric2;

    /**
     * Adds v * α to this multivector where v is a vector and α is an optional scalar.
     *
     * this ⟼ this + v * α
     */
    addVector(v: VectorE2, α?: number): Geometric2;

    /**
     * Returns a clone of this multivector.
     */
    clone(): Geometric2;

    /**
     * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
     * 
     * this ⟼ conj(this)
     */
    conj(): Geometric2;

    /**
     * Copies the multivector M into this multivector.
     *
     * this ⟼ copy(M)
     */
    copy(M: GeometricE2): Geometric2;

    /**
     * 
     */
    copyBivector(B: BivectorE2): Geometric2;

    /**
     * Copies the scalar α into this multivector.
     *
     * this ⟼ copy(α, uom)
     */
    copyScalar(α: number, uom?: Unit): Geometric2;

    /**
     * Copies the spinor into this multivector.
     *
     * this ⟼ copy(spinor)
     */
    copySpinor(spinor: SpinorE2): Geometric2;

    /**
     * Copies the vector into this multivector.
     *
     * this ⟼ copyVector(vector)
     */
    copyVector(vector: VectorE2): Geometric2;

    /**
     * Normalizes this multivector by dividing it by its magnitude.
     */
    direction(): Geometric2;

    /**
     * Sets this multivector to the result of division by another multivector.
     * 
     * this ⟼ this / m
     * 
     */
    div(m: GeometricE2): Geometric2;

    /**
     * 
     * this ⟼ a / b
     * 
     * a
     * b
     */
    div2(a: SpinorE2, b: SpinorE2): Geometric2;

    /**
     * 
     * this ⟼ this / α
     * 
     */
    divByNumber(α: number): Geometric2;

    /**
     * 
     * this ⟼ this / (α * uom)
     * 
     */
    divByScalar(α: number, uom?: Unit): Geometric2;

    /**
     * 
     */
    divByVector(vector: VectorE2): Geometric2;

    /**
     * 
     */
    dual(): Geometric2;

    /**
     * 
     */
    equals(other: unknown): boolean;

    /**
     * 
     * this ⟼ this ^ m
     * 
     * m
     */
    ext(m: GeometricE2): Geometric2;

    /**
     * 
     * this ⟼ a ^ b
     * 
     * a
     * b
     */
    ext2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * Sets this multivector to the result of keeping only the specified grade.
     * This is the grade extraction operation.
     */
    grade(grade: number): Geometric2;

    /**
     * Sets this multivector to its inverse.
     * this ⟼ conj(this) / quad(this)
     */
    inv(): Geometric2;

    /**
     * 
     */
    isLocked(): boolean;

    isOne(): boolean;

    isZero(): boolean;

    /**
     * Sets this multivector to the unit pseudoscalar.
     */
    I(): Geometric2;

    /**
     * Sets this multivector to the left contraction with another multivector.
     * 
     * this ⟼ this << m
     * 
     * m
     */
    lco(m: GeometricE2): Geometric2;

    /**
     * Sets this multivector to the left contraction of two multivectors. 
     * 
     * this ⟼ a << b
     * 
     * a
     * b
     */
    lco2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * 
     */
    lock(): number;

    /**
     * 
     * this ⟼ this * s
     * 
     * m {GeometricE3}
     */
    mul(m: GeometricE2): Geometric2;

    /**
     * 
     * this ⟼ a * b
     * 
     * a
     * b
     */
    mul2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * this ⟼ this * α
     */
    mulByNumber(α: number): Geometric2;

    /**
     * this ⟼ this * (α * uom)
     */
    mulByScalar(α: number, uom?: Unit): Geometric2;

    /**
     * Computes this * v.
     * `this` is mutated iff `this` is mutable.
     * @param v The vector operand.
     * @returns this * v 
     */
    mulByVector(v: VectorE2): Geometric2;

    /**
     * 
     * this ⟼ -1 * this
     * 
     */
    neg(): Geometric2;

    /**
     * 
     * this ⟼ sqrt(this * conj(this))
     * 
     */
    magnitude(): Geometric2;

    /**
     * Sets this multivector to the identity element for multiplication, 1.
     */
    one(): Geometric2;

    /**
     * Sets this multivector to the right contraction with another multivector.
     * 
     * this ⟼ this >> m
     * 
     * m
     */
    rco(m: GeometricE2): Geometric2;

    /**
     * Sets this multivector to the right contraction of two multivectors.
     * 
     * this ⟼ a >> b
     * 
     * a
     * b
     */
    rco2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * If `this` is mutable, then sets `this` multivector to its reflection in the plane orthogonal to vector n. The result is mutable.
     * If `this` is immutable (locked), a copy of `this` is made, which is then reflected. The result is immutable (locked).
     * 
     * i.e. The result is mutable (unlocked) iff `this` is mutable (unlocked). 
     *
     * Mathematically,
     *
     * this  ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     * This implementation does assume that n is a vector, but does not assume that it is normalized to unity.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     * The scalar component gets an extra minus sign. The pseudoscalar component does not change sign.
     * The units of measure are carried through but in most cases n SHOULD be dimensionless.
     *
     * @param n The unit vector that defines the reflection plane.
     * @returns The reflected multivector of `this`.
     */
    reflect(n: VectorE2): Geometric2;

    /**
     * 
     * this ⟼ rev(this)
     * 
     */
    /**
     * 
     */
    rev(): Geometric2;

    /**
     * 
     * this ⟼ R * this * rev(R)
     * 
     * R
     */
    rotate(R: SpinorE2): Geometric2;

    /**
     * If `this` is mutable (unlocked), then sets `this` multivector to a rotor representing a rotation from a to b.
     * `this` = ⟼ R, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * If `this` is immutable (locked), throws an Error.
     * 
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @returns `this`.
     */
    rotorFromDirections(a: VectorE2, b: VectorE2): this;

    /**
     * 
     */
    rotorFromFrameToFrame(es: VectorE2[], fs: VectorE2[]): Geometric2;

    /**
     * Sets this multivector to a rotor represented by the plane B and angle θ.
     *
     * B is the (unit) bivector generating the rotation, B * B = -1.
     * θ The rotation angle in radians.
     */
    rotorFromGeneratorAngle(B: BivectorE2, θ: number): Geometric2;

    /**
     * Computes the rotor that rotates and scales vector a to vector b.
     *
     * R = sqrt(|b|/|a|) * (|b||a| + b a) / sqrt(2 |b||a|(|b||a| + b << a))
     * 
     * The result is depends on the magnitudes of a and b.
     * 
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @returns A rotor which is mutable/immutable iff this is mutable/immutable.
     */
    rotorFromVectorToVector(a: VectorE2, b: VectorE2): Geometric2;

    /**
     * 
     * this ⟼ scp(this, m)
     * 
     * m
     */
    scp(m: GeometricE2): Geometric2;

    /**
     * 
     * this ⟼ scp(a, b)
     * 
     * a
     * b
     */
    scp2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * Currently limited to taking the square root of a positive scalar quantity.
     */
    sqrt(): Geometric2;

    squaredNorm(): Geometric2;

    /**
     * 
     * this ⟼ this - M * α
     * 
     * M
     * α
     */
    sub(M: GeometricE2, α?: number): Geometric2;

    /**
     * 
     * this ⟼ a - b
     * 
     * a
     * b
     */
    sub2(a: GeometricE2, b: GeometricE2): Geometric2;

    /**
     * Subtracts a scalar from this multivector.
     * 
     * @param a The scalar component value.
     * @param uom The optional unit of measure.
     * @param α The fraction of a that should be subtracted.
     */
    subScalar(a: number, uom?: Unit, α?: number): Geometric2;

    /**
     * Subtracts v * α from this multivector where v is a vector and α is an optional scalar.
     *
     * this ⟼ this - v * α
     */
    subVector(v: VectorE2, α?: number): Geometric2;

    /**
     * Returns a string representing the number in exponential notation.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Returns a string representing the number in fixed-point notation.
     * fractionDigits
     */
    toFixed(fractionDigits?: number): string;

    /**
     *
     */
    toPrecision(precision?: number): string;

    /**
     * Returns a string representation of the number.
     */
    toString(radix?: number): string;

    /**
     * 
     */
    unlock(token: number): void;

    /**
     * Sets this Geometric2 to have the specified cartesian coordinates and unit of measure.
     * 
     * this.a   ⟼ 0,
     * this.x   ⟼ x,
     * this.y   ⟼ y,
     * this.b   ⟼ 0,
     * this.uom ⟼ uom
     * 
     * 
     * 
     * @param x The cartesian x coordinate corresponding to the e1 basis vector.
     * @param y The cartesian y coordinate corresponding to the e2 basis vector.
     * @param uom The optional unit of measure.
     * @returns this Geometric2.
     * @throws An Error if this Geometric2 is not mutable.
     */
    vectorFromCoords(x: number, y: number, uom?: Unit): this | never;

    /**
     * 
     * this ⟼ a * b
     * 
     * Sets this Geometric2 to the geometric product a * b of the vector arguments.
     * a
     * b
     */
    versor(a: VectorE2, b: VectorE2): Geometric2;

    /**
     * 
     */
    writeVector(vector: VectorE2): void;

    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): Geometric2;

    /**
     * Standard Basis vector corresponding to the x coordinate.
     * The e1 multivector (vector) is immutable (locked).
     */
    static readonly e1: Geometric2;

    /**
     * Basis vector corresponding to the y coordinate.
     * The e2 multivector (vector) is immutable (locked).
     */
    static readonly e2: Geometric2;

    /**
     * Basis vector corresponding to the pseudoscalar coordinate.
     * The I multivector (pseudoscalar) is immutable (locked).
     */
    static readonly I: Geometric2;

    /**
     * The identity element for multiplication, 1 (scalar).
     * The one multivector (scalar) is immutable (locked).
     */
    static readonly one: Geometric2;

    /**
     * The identity element for addition, 0.
     * The zero multivector is immutable (locked).
     */
    static readonly zero: Geometric2;

    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum
     * during a time interval of 1 / 299 792 458 of a second.
     * The meter multivector (scalar) is immutable (locked).
     */
    static readonly meter: Geometric2;

    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the
     * international prototype of the kilogram.
     * The kilogram multivector (scalar) is immutable (locked).
     */
    static readonly kilogram: Geometric2;

    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation
     * corresponding to the transition between
     * the two hyperfine levels of the ground state of the cesium 133 atom.
     * The second multivector (scalar) is immutable (locked).
     */
    static readonly second: Geometric2;

    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel
     * conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum,
     * would produce between these conductors a force equal to 2E-7 newton per meter of length.
     * The ampere multivector (scalar) is immutable (locked).
     */
    static readonly ampere: Geometric2;

    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature
     * of the triple point of water.
     * The kelvin multivector (scalar) is immutable (locked).
     */
    static readonly kelvin: Geometric2;

    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are
     * atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions,
     * electrons, other particles, or specified groups of such particles.
     * The mole multivector (scalar) is immutable (locked).
     */
    static readonly mole: Geometric2;

    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction,
     * of a source that emits monochromatic radiation of frequency 540 x 10E12
     * hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     * The candela multivector (scalar) is immutable (locked).
     */
    static readonly candela: Geometric2;

    /**
     * SI derived unit of electric charge, quantity of electricity.
     * The coulomb multivector (scalar) is immutable (locked).
     */
    static readonly coulomb: Geometric2;

    /**
     * SI derived unit of force.
     * The newton multivector (scalar) is immutable (locked).
     */
    static readonly newton: Geometric2;

    /**
     * SI derived unit of energy, work, quantity of heat.
     * The joule multivector (scalar) is immutable (locked).
     */
    static readonly joule: Geometric2;

    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     */
    static bivector(xy: number, uom?: Unit): Geometric2;

    static copy(m: GeometricE2): Geometric2;

    static dual(m: GeometricE2): Geometric2;

    static dualOfBivector(B: BivectorE2): Geometric2;

    static dualOfVector(v: VectorE2): Geometric2;

    /**
     * Creates a copy of a bivector.
     */
    static fromBivector(B: BivectorE3): Geometric3;

    /**
     * Creates a copy of a scalar.
     */
    static fromScalar(scalar: Scalar): Geometric2;

    /**
     * Creates a copy of a spinor.
     */
    static fromSpinor(spinor: SpinorE2): Geometric2;

    /**
     * Creates a copy of a vector.
     */
    static fromVector(vector: VectorE2): Geometric2;

    /**
     * Computes a random multivector.
     */
    static random(): Geometric2;

    /**
     * Computes the rotor that rotates vector a to vector b.
     * 
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * 
     * The result is independent of the magnitudes of a and b.
     * 
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @returns The mutable (unlocked) rotor, R.
     */
    static rotorFromDirections(a: VectorE2, b: VectorE2): Geometric2;

    /**
     * Computes the rotor that rotates and scales vector a to vector b.
     *
     * R = sqrt(|b|/|a|) * (|b||a| + b a) / sqrt(2 |b||a|(|b||a| + b << a))
     * 
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @returns A rotor which is mutable (unlocked).
     */
    static rotorFromVectorToVector(a: VectorE2, b: VectorE2): Geometric2;

    /**
     * Constructs a new scalar from a number and a unit of measure.
     * The multivector (scalar) is mutable (unlocked).
     */
    static scalar(α: number, uom?: Unit): Geometric2;

    static spinor(a: number, xy: number, uom?: Unit): Geometric2;

    /**
     * Constructs a new vector from Cartesian coordinates and a unit of measure.
     * The multivector (vector) is mutable (unlocked).
     */
    static vector(x: number, y: number, uom?: Unit): Geometric2;

    static wedge(a: Geometric2, b: Geometric2): Geometric2;
}

/**
 * A mutable and lockable multivector in 3D with a Euclidean metric and optional unit of measure.
 */
export class Geometric3 implements GeometricE3, GeometricNumber<GeometricE3, Geometric3, SpinorE3, VectorE3> {
    /**
     * The coordinate corresponding to the unit standard basis scalar.
     */
    a: number;

    /**
     * The coordinate corresponding to the e1 standard basis vector.
     */
    x: number;

    /**
     * The coordinate corresponding to the e2 standard basis vector.
     */
    y: number;

    /**
     * The coordinate corresponding to the e3 standard basis vector.
     */
    z: number;

    /**
     * The bivector component in the e2e3 plane.
     */
    yz: number;

    /**
     * The bivector component in the e3e1 plane.
     */
    zx: number;

    /**
     * The coordinate corresponding to the e1e2 standard basis bivector.
     */
    xy: number;

    /**
     * The pseudoscalar coordinate of the multivector.
     */
    b: number;

    /**
     * The optional unit of measure.
     */
    uom?: Unit;

    /**
     * Constructs a mutable instance of Geometric3 from coordinates and an optional unit of measure.
     * @param coords The 8 coordinates are in the order [a, x, y, z, xy, yz, zx, b]. 
     * @param uom The optional unit of measure.
     */
    constructor(coords?: [a: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, b: number], uom?: Unit);
    isScalar(): boolean;
    subScalar(a: number, uom?: Unit, α?: number): Geometric3;
    scale(α: number): Geometric3;

    /**
     * Adds M * α to this multivector.
     *
     * this ⟼ this + M * α
     */
    add(M: GeometricE3, α?: number): Geometric3;

    /**
     * Sets this multivector to the sum of a and b.
     *
     * this ⟼ a + b
     */
    add2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * Adds the pseudoscalar coordinate to this multivector.
     */
    addPseudo(β: number, uom?: Unit): Geometric3;

    /**
     * Adds the scalar coordinate to this multivector.
     */
    addScalar(α: number, uom?: Unit): Geometric3;

    /**
     * Adds v * α to this multivector where v is a vector and α is an optional scalar.
     *
     * this ⟼ this + v * α
     */
    addVector(v: VectorE3, α?: number): Geometric3;

    /**
     * Returns a clone of this multivector.
     */
    clone(): Geometric3;

    /**
     * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
     * 
     * this ⟼ conj(this)
     */
    conj(): Geometric3;

    /**
     * Copies the multivector M into this multivector.
     *
     * this ⟼ copy(M)
     */
    copy(M: GeometricE3): Geometric3;

    /**
     * 
     */
    copyBivector(B: BivectorE3): Geometric3;

    /**
     * Copies the scalar α into this multivector.
     *
     * this ⟼ copy(α, uom)
     */
    copyScalar(α: number, uom?: Unit): Geometric3;

    /**
     * Copies the spinor into this multivector.
     *
     * this ⟼ copy(spinor)
     */
    copySpinor(spinor: SpinorE3): Geometric3;

    /**
     * Copies the vector into this multivector.
     *
     * this ⟼ copyVector(vector)
     */
    copyVector(vector: VectorE3): Geometric3;

    /**
     * Sets this multivector to the vector cross product of this with m.
     * this ⟼ this x m
     */
    cross(m: GeometricE3): Geometric3;

    /**
     * Normalizes this multivector by dividing it by its magnitude.
     */
    direction(): Geometric3;

    /**
     * Sets this multivector to the result of division by another multivector.
     * 
     * this ⟼ this / m
     * 
     */
    div(m: GeometricE3): Geometric3;

    /**
     * 
     * this ⟼ a / b
     * 
     * a
     * b
     */
    div2(a: SpinorE3, b: SpinorE3): Geometric3;

    /**
     * 
     * this ⟼ this / α
     * 
     */
    divByNumber(α: number): Geometric3;

    /**
     * 
     * this ⟼ this / (α * uom)
     * 
     */
    divByScalar(α: number, uom?: Unit): Geometric3;

    /**
     * 
     */
    divByVector(vector: VectorE3): Geometric3;

    /**
     * 
     */
    dual(m?: GeometricE3): Geometric3;

    /**
     * 
     */
    equals(other: unknown): boolean;

    /**
     * 
     * this ⟼ this ^ m
     * 
     * m
     */
    ext(m: GeometricE3): Geometric3;

    /**
     * 
     * this ⟼ a ^ b
     * 
     * a
     * b
     */
    ext2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * Sets this multivector to the result of keeping only the specified grade.
     * This is the grade extraction operation.
     */
    grade(grade: number): Geometric3;

    /**
     * Sets this multivector to its inverse.
     * this ⟼ conj(this) / quad(this)
     */
    inv(): Geometric3;

    /**
     * 
     */
    isLocked(): boolean;

    isOne(): boolean;

    isZero(): boolean;

    /**
     * Sets this multivector to the unit pseudoscalar.
     */
    I(): Geometric3;

    /**
     * Sets this multivector to the left contraction with another multivector.
     * 
     * this ⟼ this << m
     * 
     * m
     */
    lco(m: GeometricE3): Geometric3;

    /**
     * Sets this multivector to the left contraction of two multivectors. 
     * 
     * this ⟼ a << b
     * 
     * a
     * b
     */
    lco2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * 
     */
    lock(): number;

    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     */
    magnitude(): Geometric3;

    /**
     * 
     * this ⟼ this * s
     * 
     * m {GeometricE3}
     */
    mul(m: GeometricE3): Geometric3;

    /**
     * 
     * this ⟼ a * b
     * 
     * a
     * b
     */
    mul2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * this ⟼ this * α
     */
    mulByNumber(α: number): Geometric3;

    /**
     * this ⟼ this * (α * uom)
     */
    mulByScalar(α: number, uom?: Unit): Geometric3;

    /**
     * 
     * this ⟼ -1 * this
     * 
     */
    neg(): Geometric3;

    /**
     * 
     * this ⟼ sqrt(this * conj(this))
     * 
     */
    magnitude(): Geometric3;

    /**
     * Sets this multivector to the identity element for multiplication, 1.
     */
    one(): Geometric3;

    /**
     * Sets this multivector to the right contraction with another multivector.
     * 
     * this ⟼ this >> m
     * 
     * m
     */
    rco(m: GeometricE3): Geometric3;

    /**
     * Sets this multivector to the right contraction of two multivectors.
     * 
     * this ⟼ a >> b
     * 
     * a
     * b
     */
    rco2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * 
     * this ⟼ - n * this * n
     * 
     * n
     */
    reflect(n: VectorE3): Geometric3;

    /**
     * 
     * this ⟼ rev(this)
     * 
     */
    rev(): Geometric3;

    /**
     * 
     * this ⟼ R * this * rev(R)
     * 
     * R
     */
    rotate(R: SpinorE3): Geometric3;

    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified direction.
     *
     * n: The (unit) vector defining the rotation direction.
     * θ: The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromAxisAngle(n: VectorE3, θ: number): Geometric3;

    /**
     * If `this` is mutable (unlocked), then sets `this` multivector to a rotor representing a rotation from a to b.
     * `this` = ⟼ R, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * If `this` is immutable (locked), then throws an Error.
     * 
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @returns `this`.
     */
    rotorFromDirections(a: VectorE3, b: VectorE3): this;

    /**
     * 
     */
    rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): Geometric3;

    /**
     * Sets this multivector to a rotor represented by the plane B and angle θ.
     *
     * B is the (unit) bivector generating the rotation, B * B = -1.
     * θ The rotation angle in radians.
     */
    rotorFromGeneratorAngle(B: BivectorE3, θ: number): Geometric3;

    /**
     * R = (|b||a| + b a) / sqrt(2 |b||a|(|b||a| + b << a))
     * 
     * The result is independent of the magnitudes of a and b.
     */
    rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;

    /**
     * 
     * this ⟼ scp(this, m)
     * 
     * m
     */
    scp(m: GeometricE3): Geometric3;

    /**
     * 
     * this ⟼ scp(a, b)
     * 
     * a
     * b
     */
    scp2(a: GeometricE3, b: GeometricE3): Geometric3;

    squaredNorm(): Geometric3;

    /**
     * Currently limited to taking the square root of a positive scalar quantity.
     */
    sqrt(): Geometric3;

    /**
     * 
     * this ⟼ this - M * α
     * 
     * M
     * α
     */
    sub(M: GeometricE3, α?: number): Geometric3;

    /**
     * 
     * this ⟼ a - b
     * 
     * a
     * b
     */
    sub2(a: GeometricE3, b: GeometricE3): Geometric3;

    /**
     * Subtracts v * α from this multivector where v is a vector and α is an optional scalar.
     *
     * this ⟼ this - v * α
     */
    subVector(v: VectorE3, α?: number): Geometric3;

    /**
     * Returns a string representing the number in exponential notation.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Returns a string representing the number in fixed-point notation.
     * fractionDigits
     */
    toFixed(fractionDigits?: number): string;

    /**
     *
     */
    toPrecision(precision?: number): string;

    /**
     * Returns a string representation of the number.
     */
    toString(radix?: number): string;

    /**
     * 
     */
    unlock(token: number): boolean;

    /**
     * 
     * this ⟼ a * b
     * 
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     * a
     * b
     */
    versor(a: VectorE3, b: VectorE3): Geometric3;

    /**
     * 
     */
    writeVector(vector: VectorE3): void;

    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): Geometric3;

    /**
     * Standard Basis vector corresponding to the x coordinate.
     * The e1 multivector (vector) is immutable (locked).
     */
    static readonly e1: Geometric3;

    /**
     * Basis vector corresponding to the y coordinate.
     * The e2 multivector (vector) is immutable (locked).
     */
    static readonly e2: Geometric3;

    /**
     * Basis vector corresponding to the z coordinate.
     * The e3 multivector (vector) is immutable (locked).
     */
    static readonly e3: Geometric3;

    /**
     * Basis vector corresponding to the pseudoscalar coordinate.
     * The I multivector (pseudoscalar) is immutable (locked).
     */
    static readonly I: Geometric3;

    /**
     * The identity element for multiplication, 1 (scalar).
     * The one multivector (scalar) is immutable (locked).
     */
    static readonly one: Geometric3;

    /**
     * The identity element for addition, 0.
     * The zero multivector is immutable (locked).
     */
    static readonly zero: Geometric3;

    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum
     * during a time interval of 1 / 299 792 458 of a second.
     * The meter multivector (scalar) is immutable (locked).
     */
    static readonly meter: Geometric3;

    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the
     * international prototype of the kilogram.
     * The kilogram multivector (scalar) is immutable (locked).
     */
    static readonly kilogram: Geometric3;

    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation
     * corresponding to the transition between
     * the two hyperfine levels of the ground state of the cesium 133 atom.
     * The second multivector (scalar) is immutable (locked).
     */
    static readonly second: Geometric3;

    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel
     * conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum,
     * would produce between these conductors a force equal to 2E-7 newton per meter of length.
     * The ampere multivector (scalar) is immutable (locked).
     */
    static readonly ampere: Geometric3;

    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature
     * of the triple point of water.
     * The kelvin multivector (scalar) is immutable (locked).
     */
    static readonly kelvin: Geometric3;

    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are
     * atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions,
     * electrons, other particles, or specified groups of such particles.
     * The mole multivector (scalar) is immutable (locked).
     */
    static readonly mole: Geometric3;

    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction,
     * of a source that emits monochromatic radiation of frequency 540 x 10E12
     * hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     * The candela multivector (scalar) is immutable (locked).
     */
    static readonly candela: Geometric3;

    /**
     * SI derived unit of electric charge, quantity of electricity.
     * The coulomb multivector (scalar) is immutable (locked).
     */
    static readonly coulomb: Geometric3;

    /**
     * SI derived unit of force.
     * The newton multivector (scalar) is immutable (locked).
     */
    static readonly newton: Geometric3;

    /**
     * SI derived unit of energy, work, quantity of heat.
     * The joule multivector (scalar) is immutable (locked).
     */
    static readonly joule: Geometric3;

    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     */
    static bivector(yz: number, zx: number, xy: number, uom?: Unit): Geometric3;

    static copy(m: GeometricE3): Geometric3;

    static dual(m: GeometricE3): Geometric3;

    static dualOfBivector(B: BivectorE3): Geometric3;

    static dualOfVector(v: VectorE3): Geometric3;

    /**
     * Creates a copy of a bivector.
     */
    static fromBivector(B: BivectorE3): Geometric3;

    /**
     * Creates a copy of a scalar.
     */
    static fromScalar(scalar: Scalar): Geometric3;

    /**
     * Creates a copy of a spinor.
     */
    static fromSpinor(spinor: SpinorE3): Geometric3;

    /**
     * Creates a copy of a vector.
     */
    static fromVector(vector: VectorE3): Geometric3;

    /**
     * Computes a random multivector.
     */
    static random(): Geometric3;

    /**
     * Computes the rotor that rotates vector a to vector b.
     * 
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * 
     * The result is independent of the magnitudes of a and b.
     * 
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @returns The mutable (unlocked) rotor, R.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;

    /**
     * Computes the rotor that rotates vector a to vector b.
     * a The from vector.
     * b The to vector.
     * B The plane of rotation when the rotation plane is ambiguous.
     */
    static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;

    /**
     * Constructs a new scalar from a number and a unit of measure.
     * The multivector (scalar) is mutable (unlocked).
     */
    static scalar(α: number, uom?: Unit): Geometric3;

    static spinor(a: number, yz: number, zx: number, xy: number, uom?: Unit): Geometric3;

    /**
     * Constructs a new vector from Cartesian coordinates and a unit of measure.
     * The multivector (vector) is mutable (unlocked).
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Geometric3;

    static wedge(a: Geometric3, b: Geometric3): Geometric3;
}

export declare class Spacetime1 {
    static readonly zero: Spacetime1;
    static readonly one: Spacetime1;
    static readonly e0: Spacetime1;
    static readonly e1: Spacetime1;
    static readonly I: Spacetime1;
    static readonly kilogram: Spacetime1;
    static readonly meter: Spacetime1;
    static readonly second: Spacetime1;
    static readonly ampere: Spacetime1;
    static readonly kelvin: Spacetime1;
    static readonly mole: Spacetime1;
    static readonly candela: Spacetime1;
    /**
     * Creates a grade 0 (scalar) multivector with value `a * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static scalar(a: number, uom?: Unit): Spacetime1;
    static vector(t: number, x: number, uom?: Unit): Spacetime1;
    /**
     *
     * @param a
     * @param t
     * @param x
     * @param b
     * @param uom
     */
    constructor(a?: number, t?: number, x?: number, b?: number, uom?: Unit);
    a: number;
    t: number;
    x: number;
    b: number;
    readonly grades;
    add(rhs: Spacetime1, α?: number): Spacetime1;
    addScalar(a: number, uom?: Unit, α?: number): Spacetime1;
    clone(): Spacetime1;
    conj(): Spacetime1;
    div(rhs: Spacetime1): Spacetime1;
    divByNumber(α: number): Spacetime1;
    divByScalar(α: number, uom?: Unit): Spacetime1;
    divByVector(v: { t: number; x: number; uom?: Unit; }): Spacetime1;
    dual(): Spacetime1;
    equals(other: unknown): boolean;
    ext(rhs: Spacetime1): Spacetime1;
    grade(n: number): Spacetime1;
    inv(): Spacetime1;
    isBivector(): boolean;
    isOne(): boolean;
    isScalar(): boolean;
    isSpinor(): boolean;
    isVector(): boolean;
    isZero(): boolean;
    lco(rhs: Spacetime1): Spacetime1;
    mul(rhs: Spacetime1): Spacetime1;
    mulByNumber(a: number): Spacetime1;
    mulByScalar(a: number, uom: Unit): Spacetime1;
    mulByVector(v: { t: number; x: number; uom?: Unit; }): Spacetime1;
    neg(): Spacetime1;
    rco(rhs: Spacetime1): Spacetime1;
    reflect(n: { t: number; x: number; uom?: Unit; }): Spacetime1;
    rev(): Spacetime1;
    rotate(rotor: { a: number; b: number; uom?: Unit; }): Spacetime1;
    scale(α: number): Spacetime1;
    scp(rhs: Spacetime1): Spacetime1;
    squaredNorm(): Spacetime1;
    sub(rhs: Spacetime1, α?: number): Spacetime1;
    subScalar(a: number, uom?: Unit, α?: number): Spacetime1;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
}

export declare class Spacetime2 {
    static readonly zero: Spacetime2;
    static readonly one: Spacetime2;
    static readonly e0: Spacetime2;
    static readonly e1: Spacetime2;
    static readonly e2: Spacetime2;
    static readonly I: Spacetime2;
    static readonly kilogram: Spacetime2;
    static readonly meter: Spacetime2;
    static readonly second: Spacetime2;
    static readonly ampere: Spacetime2;
    static readonly kelvin: Spacetime2;
    static readonly mole: Spacetime2;
    static readonly candela: Spacetime2;
    /**
     * Creates a grade 0 (scalar) multivector with value `a * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static scalar(a: number, uom?: Unit): Spacetime2;
    static vector(t: number, x: number, y: number, uom?: Unit): Spacetime2;
    constructor(a?: number, t?: number, x?: number, tx?: number, y?: number, ty?: number, xy?: number, b?: number, uom?: Unit);
    a: number;
    t: number;
    x: number;
    y: number;
    tx: number;
    ty: number;
    xy: number;
    b: number;
    readonly grades: number;
    add(rhs: Spacetime2, α?: number): Spacetime2;
    addScalar(a: number, uom?: Unit, α?: number): Spacetime2;
    clone(): Spacetime2;
    conj(): Spacetime2;
    div(rhs: Spacetime2): Spacetime2;
    divByNumber(α: number): Spacetime2;
    divByScalar(α: number, uom?: Unit): Spacetime2;
    divByVector(v: { t: number; x: number; y: number; uom?: Unit; }): Spacetime2;
    dual(): Spacetime2;
    equals(other: unknown): boolean;
    ext(rhs: Spacetime2): Spacetime2;
    grade(n: number): Spacetime2;
    inv(): Spacetime2;
    isBivector(): boolean;
    isOne(): boolean;
    isScalar(): boolean;
    isSpinor(): boolean;
    isVector(): boolean;
    isZero(): boolean;
    lco(rhs: Spacetime2): Spacetime2;
    mul(rhs: Spacetime2): Spacetime2;
    mulByNumber(a: number): Spacetime2;
    mulByScalar(a: number, uom: Unit): Spacetime2;
    mulByVector(v: { t: number; x: number; y: number; uom?: Unit; }): Spacetime2;
    neg(): Spacetime2;
    rco(rhs: Spacetime2): Spacetime2;
    reflect(n: { t: number; x: number; y: number; uom?: Unit; }): Spacetime2;
    rev(): Spacetime2;
    rotate(rotor: { a: number; tx: number; ty: number; xy: number; uom?: Unit; }): Spacetime2;
    scale(α: number): Spacetime2;
    scp(rhs: Spacetime2): Spacetime2;
    squaredNorm(): Spacetime2;
    sub(rhs: Spacetime2, α?: number): Spacetime2;
    subScalar(a: number, uom?: Unit, α?: number): Spacetime2;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    toString(radix?: number): string;
}

/**
 *
 */
export interface MatrixLike {
    readonly dimensions: number;
    uom?: Unit;
    getElement(row: number, column: number): number;
}

/**
 * A mutable 1x1 matrix with an optional unit of measure.
 */
export class Matrix1 implements MatrixLike {
    static one(): Matrix1;
    static zero(): Matrix1;
    readonly dimensions: number;
    uom?: Unit;
    /**
     * Constructs a mutable 1x1 matrix.
     * @param elements 
     * @param uom 
     */
    constructor(elements: Float32Array, uom?: Unit);
    getElement(row: number, column: number): number;
    setElement(row: number, column: number, value: number): void;
}

/**
 * A mutable 3x3 matrix with an optional unit of measure.
 */
export class Matrix3 implements MatrixLike {
    static one(): Matrix3;
    static zero(): Matrix3;
    readonly dimensions: number;
    uom?: Unit;
    elements: Float32Array;
    modified: boolean;
    /**
     * Constructs a mutable 3x3 matrix.
     * @param elements 
     * @param uom 
     */
    constructor(elements: Float32Array, uom?: Unit);
    copy(source: MatrixLike): this;
    getElement(row: number, column: number): number;
    inv(): this;
    isOne(): boolean;
    mul(rhs: Matrix3): this;
    mul2(a: Matrix3, b: Matrix3): this;
    rmul(lhs: Matrix3): this;
    row(i: number): number[];
    setElement(row: number, column: number, value: number): void;
    toString(radix?: number): string;
    transpose(): this;
}

/**
 *
 */
export interface Metric<T> {
    /**
     * 
     */
    readonly e0: T;

    /**
     * Returns the scalar component of the multivector.
     * @param mv The multivector for which the scalar component is required.
     */
    a(mv: T): number;

    add(lhs: T, rhs: T): T;

    addScalar(lhs: T, a: number, uom?: Unit): T;

    addVector(lhs: T, rhs: T): T;

    /**
     * TODO: Describe semantics of how this is expected to change the multivector argument. 
     * @param mv 
     * @param matrix 
     */
    applyMatrix(mv: T, matrix: MatrixLike): T;

    clone(source: T): T;

    /**
     * Modifies the target to have the same property values as the source.
     * @param source 
     * @param target
     * @returns the target.
     */
    copy(source: T, target: T): T;

    copyBivector(source: T, target: T): T;

    copyMatrix(m: MatrixLike): MatrixLike;

    copyScalar(a: number, uom: Unit, target: T): T;

    copyVector(source: T, target: T): T;

    /**
     * Create a non-generic instance derived from Force; Force is to be considered an abstract base type.
     * This will make it easier for clients; after instanceof Force2 or Force3, the properties of the
     * force application (F, and x) will have non-generic types.
     * 
     * @param body The body that the force will be applied to.
     */
    createForce(body: ForceBody<T>): Force<T>;

    /**
     * 
     * @param body The body that the torque will be applied to.
     */
    createTorque(body: ForceBody<T>): Torque<T>;

    direction(mv: T): T;

    divByScalar(lhs: T, a: number, uom?: Unit): T;

    ext(lhs: T, rhs: T): T;

    identityMatrix(): MatrixLike;

    /**
     * 
     * @param matrix The matrix to be inverted.
     * @returns A new matrix which is the inverse of the specified matrix.
     */
    invertMatrix(matrix: MatrixLike): MatrixLike;

    isBivector(mv: T): boolean;

    isOne(mv: T): boolean;

    isScalar(mv: T): boolean;

    isSpinor(mv: T): boolean;

    isVector(mv: T): boolean;

    isZero(mv: T): boolean;

    lco(lhs: T, rhs: T): T;

    /**
     * Used to change the mutability of the multivector from mutable to immutable.
     * An immutable multivector is also described as locked. The number returned is
     * a token that may be used to unlock the multivector, making it mutable again.
     * @param mv The multivector to be locked.
     * @returns A token that may be used to unlock the multivector.
     */
    lock(mv: T): number;

    norm(mv: T): T;

    mul(lhs: T, rhs: T): T;

    mulByNumber(lhs: T, alpha: number): T;

    mulByScalar(lhs: T, a: number, uom?: Unit): T;

    mulByVector(lhs: T, rhs: T): T;

    neg(mv: T): T;

    /**
     * squared norm: |A| * |A| = A * rev(A)
     */
    squaredNorm(A: T): T;

    rco(lhs: T, rhs: T): T;

    rev(mv: T): T;

    rotate(mv: T, spinor: T): T;

    /**
     * Creates a grade 0 (scalar) multivector with value `a * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    scalar(a: number, uom?: Unit): T;

    scp(lhs: T, rhs: T): T;

    setUom(mv: T, uom: Unit): void;

    sub(lhs: T, rhs: T): T;

    subScalar(lhs: T, a: number, uom?: Unit): T;

    subVector(lhs: T, rhs: T): T;

    unlock(mv: T, token: number): void;

    uom(mv: T): Unit;

    write(source: T, target: T): void;

    /**
     * TODO: This looks a lot like copyVector. Is there any difference?
     * @param source 
     * @param target 
     */
    writeVector(source: T, target: T): void;

    writeBivector(source: T, target: T): void;
}

/**
 * A handle-body pattern abstraction of the conversion of the multivector to the system state vector.
 * An implementation of this interface provides the mapping from a specific multivector implementation to a vector of state variables.
 * Each state variable is a pair consisting of (number, Unit). This decomposition allows the solvers (integrators) to treat the whole
 * system as a single particle in a large vector space.
 */
export interface Kinematics<T> {
    /**
     * 
     */
    speedOfLight: T;
    /**
     * The rate of change of position is the velocity (non-relativistic).
     * dX/dt = V = P / M
     * In the relativistic case,
     * dX/dt = P / sqrt(M * M + P * P), where P is the spatial part of the energy-momentum spacetime vector, M is the rest mass.
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output) 
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * Let Ω(t) be the (bivector) angular velocity.
     * Let R(t) be the (spinor) attitude of the rigid body. 
     * The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
     * requiring the geometric product of Ω and R.
     * Ω and R are auxiliary and primary variables that have already been computed.
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output) 
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input) 
     */
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param stateVals (input)
     * @param stateUoms (input)
     * @param idx (input)
     * @param body (output)
     * @param uomTime (input)
     */
    updateBodyFromVars(stateVals: number[], stateUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     * 
     * @param body (input)
     * @param idx (input)
     * @param vars (output)
     */
    updateVarsFromBody(body: ForceBody<T>, idx: number, vars: VarsList): void;
    /**
     * Adds the specified force to the rateOfChange variables for Linear Momentum.
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param idx (input)
     * @param force (input)
     * @param uomTime (input)
     */
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: T, uomTime: Unit): void;
    /**
     * 
     * @param rateOfChangeVals (input)
     * @param rateOfChangeUoms (input)
     * @param idx (input)
     * @param force (output)
     */
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: T): void;
    /**
     * 
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output) 
     * @param idx (input)
     * @param force (input)
     */
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: T): void;
    /**
     * Adds the specified torque to the rateOfChange variables for AngularMomentum.
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param idx (input)
     * @param torque (input)
     * @param uomTime (input)
     */
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: T, uomTime: Unit): void;
    /**
     * Called by the Physics Engine during the epilog.
     * @param bodies (input) Provides intrinsic kinetic energy.
     * @param forceLaws (input) Provides potential energy.
     * @param potentialOffset  (input) Provides a an offset in the potential energy.
     * @param vars (output) The list of variables containing the summary variables to be updated.
     */
    epilog(bodies: ForceBody<T>[], forceLaws: ForceLaw<T>[], potentialOffset: T, vars: VarsList): void;
    /**
     * Called by the Physics Engine to determine the indices of all the variables that are affected by a
     * discontinuous change to the energy of the system. i.e., an "intervention" where the bodies in the
     * system are changed independently of the differential equations that are implemented by the Physics Engine.
     * @returns The indices into the variables list.
     */
    discontinuousEnergyVars(): number[];
    /**
     * Used by the Physics engine when adding a body to the system.
     * Returns the name of the kinematic variable at the specified index which
     * ranges over [0, numVarsPerBody - 1].
     * 
     * The name must be valid (isValidName) after having being munged (toName).
     */
    getOffsetName(offset: number): string;
    /**
     * Used by the Physics class constructor to create a list of variables.
     * One of the names returned must be the (case-sensitive) "TIME" variable.
     */
    getVarNames(): string[];
    /**
     * Use by the Physics engine to add the correct number of variables for each body added.
     * The number of variables must be at least one.
     */
    numVarsPerBody(): number;
}


/**
 * 
 */
export class RigidBody<T> implements ForceBody<T>, SimObject {
    metric: Metric<T>;
    /**
     * The application defined unique identifier.
     */
    uuid: string;
    /**
     * The center of mass position vector in local coordinates.
     */
    centerOfMassLocal: T;
    /**
     * Mass (scalar).
     * M is immutable but the property may be reassigned.
     */
    M: T;
    /**
     * Electric Charge (scalar).
     * Q is immutable but the property may be reasigned.
     */
    Q: T;
    /**
     * Inertia Tensor (in body coordinates) (3x3 matrix).
     */
    I: MatrixLike;
    /**
     * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
     */
    Iinv: MatrixLike;
    /**
     * Position (vector).
     * X is mutable with copy-on-set.
     */
    X: T;
    /**
     * Attitude (spinor).
     * R is mutable with copy-on-set.
     */
    R: T;
    /**
     * Linear momentum (vector).
     * P is mutable with copy-on-set.
     */
    P: T;
    /**
     * Angular momentum (bivector).
     * L is mutable with copy-on-set.
     */
    L: T;
    /**
     * Angular velocity (bivector).
     * Ω is mutable with copy-on-set.
     */
    Ω: T;
    /**
     * 
     */
    expireTime: number;
    /**
     * The starting index of this rigid body in the state variables.
     */
    varsIndex: number;
    /**
     * 
     */
    constructor(metric: Metric<T>);
    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: VectorE3, worldPoint: VectorE3): void;
    /**
     * Updates the angular velocity, Ω, bivector based upon the angular momentum.
     * Derived classes may override to provide more efficient implementations based upon symmetry.
     */
    public updateAngularVelocity(): void;
    /**
     * 
     */
    protected updateInertiaTensor(): void;
    /**
     * 
     */
    rotationalEnergy(): T;
    /**
     * 
     */
    translationalEnergy(): T;
}

export class RigidBody1 extends RigidBody<Geometric1> {
    constructor();
    /**
     *
     */
    updateAngularVelocity(): void;
}

export class RigidBody2 extends RigidBody<Geometric2> {
    constructor();
    /**
     *
     */
    updateAngularVelocity(): void;
}

export class RigidBody3 extends RigidBody<Geometric3> {
    constructor();
}

/**
 * A block of uniform line density.
 */
export class Block1 extends RigidBody1 {
    width: Geometric1;
    constructor(width?: Geometric1);
}

/**
 * A block of uniform surface density.
 */
export class Block2 extends RigidBody2 {
    width: Geometric2;
    height: Geometric2;
    constructor(width?: Geometric2, height?: Geometric2);
}

/**
 * A block of uniform volume density.
 */
export class Block3 extends RigidBody<Geometric3> {
    width: Geometric3;
    height: Geometric3;
    depth: Geometric3;
    constructor(width?: Geometric3, height?: Geometric3, depth?: Geometric3);
}

/**
 * A solid cylinder of uniform density.
 */
export class Cylinder3 extends RigidBody<Geometric3> {
    /**
     * 
     */
    radius: Geometric3;
    /**
     * 
     */
    height: Geometric3;
    /**
     * 
     */
    constructor(radius?: GeometricE3, height?: GeometricE3);
}

/**
 * A thin, solid disk of uniform surface density.
 */
export class Disc2 extends RigidBody2 {
    radius: Geometric2;
    constructor(radius?: GeometricE2);
}

/**
 * Plane polygon with vertices points[0], points[1], ..., points[N-1] and mass M uniformly distributed
 * on its interior.
 */
export class Polygon2 extends RigidBody2 {
    /**
     * The vertex positions relative to the polygon center of mass.
     */
    readonly rs: Geometric2[];
    /**
     * Constructs the polygon rigid body by computing the center of mass, updating X,
     * computing the vertex positions relative to the center of mass, and then updating
     * the inertia tensor.
     * @param points The points of the polygon relative to the origin.
     */
    constructor(points: Geometric2[]);
}

/**
 * A homogeneous rod in 2D.
 * The rod has directed length 2 * a.
 * The rod may be thought of as a continuous line of mass points with direction specified by the vector a.
 */
export class Rod2 extends RigidBody2 {
    /**
     * A vector from the center of mass to one end of the rod.
     */
    readonly a: Geometric2;
    /**
     * Constructs the rod of length 2 * |a|.
     * 
     * @param a a vector from the center of mass to one of the ends of the rod. 
     */
    constructor(a: Geometric2);
}

/**
 * An object with no internal structure.
 */
export class Particle<T> extends RigidBody<T> {
    /**
     * M is the mass of the particle. Defaults to 1.
     * Q is the electric charge of the particle. Defaults to 0.
     */
    constructor(mass: T, charge: T, metric: Metric<T>);
}

/**
 * An physical object with no internal structure living in 1 Euclidean dimension.
 */
export class Particle1 extends Particle<Geometric1> {
    /**
     * Constructs a particle living in 1 Euclidean dimension.
     * @param M the mass of the particle. Defaults to 1 (dimensionless).
     * @param Q the electric charge of the particle. Defaults to 1 (dimensionless).
     */
    constructor(M?: Geometric1, Q?: Geometric1);
}

/**
 * An physical object with no internal structure living in 2 Euclidean dimensions.
 */
export class Particle2 extends Particle<Geometric2> {
    /**
     * Constructs a particle living in 2 Euclidean dimensions.
     * @param M the mass of the particle. Defaults to 1 (dimensionless).
     * @param Q the electric charge of the particle. Defaults to 1 (dimensionless).
     */
    constructor(M?: Geometric2, Q?: Geometric2);
}

/**
 * An physical object with no internal structure living in 3 Euclidean dimensions.
 */
export class Particle3 extends Particle<Geometric3> {
    /**
     * Constructs a particle living in 3 Euclidean dimensions.
     * @param M the mass of the particle. Defaults to 1 (dimensionless).
     * @param Q the electric charge of the particle. Defaults to 1 (dimensionless).
     */
    constructor(M?: Geometric3, Q?: Geometric3);
}

/**
 * An physical object with no internal structure living in Spacetime1 - G(1,1).
 */
export class ParticleG11 extends Particle<Spacetime1> {
    /**
     * @param M the mass of the particle. Defaults to 1 (dimensionless).
     * @param Q the electric charge of the particle. Defaults to 1 (dimensionless).
     */
    constructor(M?: Spacetime1, Q?: Spacetime1);
}

/**
 * A solid sphere of uniform density.
 */
export class Sphere3 extends RigidBody<Geometric3> {
    /**
     * 
     */
    radius: Geometric3;
    /**
     * 
     */
    constructor(radius?: GeometricE3);
}

/**
 * 0 => LOCAL
 * 1 => WORLD
 */
export type CoordType = 0 | 1;

/**
 * The application of a force to a particle in a rigid body.
 */
export abstract class Force<T> implements SimObject {
    /**
     * The force vector in world coordinates.
     */
    readonly F: T;
    /**
     * The point of application of the force in world coordinates.
     */
    readonly x: T;
    /**
     * 
     */
    expireTime: number;
    vector: T;
    vectorCoordType: CoordType;
    location: T;
    locationCoordType: CoordType;
    /**
     * 
     */
    constructor(body: RigidBody<T>);
    /**
     * 
     */
    getBody(): RigidBody<T>;
    /**
     * Computes the force being applied (vector) in WORLD coordinates.
     * 
     * @param force (output)
     */
    computeForce(force: T): void;
    /**
     * Computes the point of application of the force in world coordinates.
     * 
     * @param position (output)
     */
    computePosition(position: T): void;
    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     * 
     * @param torque (output)
     */
    computeTorque(torque: T): void;
}

/**
 *
 */
export class Force1 extends Force<Geometric1> {
    constructor(body: ForceBody<Geometric1>);
}
/**
 *
 */
export class Force2 extends Force<Geometric2> {
    constructor(body: ForceBody<Geometric2>);
}

/**
 *
 */
export class Force3 extends Force<Geometric3> {
    constructor(body: ForceBody<Geometric3>);
}

export interface ForceLaw<T> extends SimObject {
    /**
     * The forces which are being applied to the bodies.
     */
    readonly forces: Force<T>[];
    /**
     * Updates the forces which are being applied to the bodies.
     */
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

export abstract class Torque<T> implements SimObject {
    expireTime: number;
    constructor(body: RigidBody<T>);
}

export class Torque1 extends Torque<Geometric1> {
    constructor(body: ForceBody<Geometric1>);
}

export class Torque2 extends Torque<Geometric2> {
    constructor(body: ForceBody<Geometric2>);
}

export class Torque3 extends Torque<Geometric3> {
    constructor(body: ForceBody<Geometric3>);
}

export interface TorqueLaw<T> extends SimObject {
    /**
     * The torques which are being applied to the bodies.
     */
    readonly torques: Torque<T>[];
    /**
     * Updates the torques which are being applied to the bodies.
     */
    updateTorques(): Torque<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

export interface GeometricConstraint<T> {
    getBody(): ForceBody<T>;
    /**
     * Computes the radius of the curve.
     * @param x (input) The location at which the radius is required.
     * @param r (output) The radius (scalar).
     */
    computeRadius(x: T, r: T): void;
    /**
     * Computes the plane containing the rotation.
     * The orientation is ambiguous.
     * However tangent * rotation should give the direction towards the center of curvature. 
     * @param x (input) The position (vector) at which the rotation is required.
     * @param B (output) The rotation (bivector).
     */
    computeRotation(x: T, B: T): void;
    /**
    * Computes the tangent to the wire.
    * The orientation is ambiguous.
    * However tangent * rotation should give the direction towards the center of curvature. 
    * @param x (input) The position (vector) at which the tangent is required.
    * @param v (output) The tangent (vector).
    */
    computeTangent(x: T, v: T): void;
    setForce(N: T): void;
}

export class SurfaceConstraint<T> implements GeometricConstraint<T> {
    readonly N: T;
    constructor(body: ForceBody<T>, radiusFn: (x: T, radius: T) => void, rotationFn: (x: T, plane: T) => void, tangentFn: (x: T, tangent: T) => void);
    getBody(): ForceBody<T>;
    computeRadius(x: T, radius: T): void;
    computeRotation(x: T, plane: T): void;
    computeTangent(x: T, tangent: T): void;
    setForce(N: T): void;
}

export class SurfaceConstraint2 extends SurfaceConstraint<Geometric2> {
    constructor(body: ForceBody<Geometric2>, radiusFn: (x: Geometric2, radius: Geometric2) => void, rotationFn: (x: Geometric2, plane: Geometric2) => void, tangentFn: (x: Geometric2, tangent: Geometric2) => void);
}

export class SurfaceConstraint3 extends SurfaceConstraint<Geometric3> {
    constructor(body: ForceBody<Geometric3>, radiusFn: (x: Geometric3, radius: Geometric3) => void, rotationFn: (x: Geometric3, plane: Geometric3) => void, tangentFn: (x: Geometric3, tangent: Geometric3) => void);
}

/**
 * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 */
export class Physics<T> implements Simulation, EnergySystem<T> {
    /**
     * 
     */
    readonly metric: Metric<T>;
    /**
     * 
     */
    bodies: ForceBody<T>[];

    /**
     * Determines whether calculated forces will be added to the simulation list.
     */
    showForces: boolean;

    /**
     * 
     */
    readonly simList: SimList;

    /**
     * 
     */
    time: number;

    /**
     * 
     */
    readonly varsList: VarsList;

    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor(metric: Metric<T>, dynamics: Kinematics<T>);

    /**
     * 
     */
    addBody(body: ForceBody<T>): void;

    /**
     * 
     */
    addForceLaw(forceLaw: ForceLaw<T>): void;
    removeForceLaw(forceLaw: ForceLaw<T>): void;

    /**
     *
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void;

    /**
     *
     */
    addConstraint(geometry: GeometricConstraint<T>): void;
    removeConstraint(geometry: GeometricConstraint<T>): void;

    /**
     * 
     */
    addDriftLaw(driftLaw: ForceLaw<T>): void;
    removeDriftLaw(driftLaw: ForceLaw<T>): void;

    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     */
    epilog(): void;

    /**
     * 
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void;

    /**
     * 
     */
    getState(): number[];

    /**
     * 
     */
    prolog(): void;
    /**
     * 
     */
    removeBody(body: ForceBody<T>): void;

    /**
     * 
     */
    /**
    * Sets the 
    */
    setState(state: number[]): void;
    /**
     * 
     */
    totalEnergy(): T;
    /**
     * Update the state variables following a change to the simulation bodies.
     */
    updateFromBodies(): void;
}

export interface EngineOptions {
    method?: 'rk4';
}

export class Engine<T> {
    /**
     * 
     * @param metric 
     * @param dynamics 
     * @param options 
     */
    constructor(metric: Metric<T>, dynamics: Kinematics<T>, options?: Partial<EngineOptions>);

    /**
     * 
     */
    readonly bodies: ForceBody<T>[];
    /**
     * 
     */
    readonly simList: SimList;

    /**
    * The speed of light is for use in the special-relativity domain.
    * Default is 1 (dimensionless).
    * When using S.I. Units, this constant may be set appropriately.
    */
    speedOfLight: T;

    /**
     * The state variables of the system.
     */
    readonly varsList: VarsList;

    /**
     * Adds a body to the system.
     * The state variables of the body will become part of the state vector of the system.
     * The state variables of the body will be updated each time the system is advanced in time.
     * @param body The body to be added to the system.
     */
    addBody(body: ForceBody<T>): void;

    /**
     * Adds a geometric constraint to the system.
     * Geometric constraints are applied after the force and torques have been computed and before drift forces and torques are applied.
     * @param geometry The geometric constraint to be added to the system.
     */
    addConstraint(geometry: GeometricConstraint<T>): void;

    /**
     * Adds a force law that is designed to compensate for numerical drift in the system.
     * A drift law is usually small and may take the form of a spring and/or damping force.
     * The drift laws are applied after any geometric constraints have been applied.
     * @param driftLaw The drift force law to be applied.
     */
    addDriftLaw(driftLaw: ForceLaw<T>): void;

    /**
     * Adds a force law to the system.
     * @param forceLaw The force law to be added to the system.
     */
    addForceLaw(forceLaw: ForceLaw<T>): void;

    /**
     * Adds a torque law to the system.
     * @param torqueLaw The torque law to be added to the system.
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void;

    /**
     * Advances the Physics model by the specified time interval, Δt * uomTime.
     * @param Δt The time interval.
     * @param uomTime The optional unit of measure for the time interval.
     */
    advance(Δt: number, uomTime?: Unit): void;

    /**
     * Removes a body from the system.
     * @param body The body to be removed from the system.
     */
    removeBody(body: ForceBody<T>): void;

    /**
     * Removes a geometric constraint from the system.
     * @param geometry The geometric constraint to be removed from the system.
     */
    removeConstraint(geometry: GeometricConstraint<T>): void;

    /**
     * Removes a force law that is designed to compensate for numerical drift in the system.
     * @param driftLaw The drift force law to be removed.
     */
    removeDriftLaw(driftLaw: ForceLaw<T>): void;

    /**
     * Removes a force law from the system.
     * @param forceLaw The force law to be removed.
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void;

    /**
     * Removes a torque law from the system.
     * @param torqueLaw The torque law to be removed from the system.
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void;

    /**
     * The total energy (kinetic and potential) of the system.
     */
    totalEnergy(): T;

    /**
     * Updates the state vector of the simulation from the states of the bodies in the system.
     * It is necessary to call this method after an intervention which changes the state of a body in the system.
     */
    updateFromBodies(): void;
}

/**
 * The Physics Engine specialized to 1 dimension with a Euclidean metric.
 */
export class Engine1 extends Engine<Geometric1> {
    /**
     * Constructs an instance of Engine using the Geometric1 multivector.
     * @param options Specify the integration algorithm, and adaptive step sizing.
     */
    constructor(options?: Partial<EngineOptions>);
}

/**
 * The Physics Engine specialized to 2 dimensions with a Euclidean metric.
 */
export class Engine2 extends Engine<Geometric2> {
    /**
     * Constructs an instance of Engine using the Geometric2 multivector.
     * @param options Specify the integration algorithm, and adaptive step sizing.
     */
    constructor(options?: Partial<EngineOptions>);
}

/**
 * The Physics Engine specialized to 3 dimensions with a Euclidean metric.
 */
export class Engine3 extends Engine<Geometric3> {
    /**
     * Constructs an instance of Engine using the Geometric3 multivector.
     * @param options Specify the integration algorithm, and adaptive step sizing.
     */
    constructor(options?: Partial<EngineOptions>);
}

export class EngineG11 extends Engine<Spacetime1> {
    /**
     * Constructs an instance of Engine using the Spacetime1 multivector.
     * @param options Specify the integration algorithm, and adaptive step sizing.
     */
    constructor(options?: Partial<EngineOptions>);
}

export class EngineG21 extends Engine<Spacetime2> {
    /**
     * Constructs an instance of Engine using the Spacetime2 multivector.
     * @param options Specify the integration algorithm, and adaptive step sizing.
     */
    constructor(options?: Partial<EngineOptions>);
}

/**
 * The Euler algorithm uses the rate of change values at the
 * beginning of the step in order to perform the integration.
 */
export class EulerMethod implements DiffEqSolver {
    constructor(system: DiffEqSolverSystem);
    step(stepSize: number, uomStep: Unit): void;
}

/**
 * The modified Euler algorithm uses the rate of change values at both
 * the beginning of the step and at the end, taking an average in order
 * to perform the integration.
 */
export class ModifiedEuler implements DiffEqSolver {
    constructor(system: DiffEqSolverSystem);
    step(stepSize: number, uomStep: Unit): void;
}

/**
 * A differential equation solver that achieves O(h*h*h) Local Truncation Error (LTE),
 * where h is the step size.
 */
export class RungeKutta implements DiffEqSolver {
    /**
     * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
     */
    constructor(system: DiffEqSolverSystem);
    /**
     * 
     */
    step(stepSize: number, uomStep: Unit): void;
}

export interface EnergySystem<T> {
    readonly metric: Metric<T>;
    totalEnergy(): T;
}

export class AdaptiveStepSolver<T> implements DiffEqSolver {
    /**
     * Whether to use second order differences for deciding when to reduce the step size.
     * The first difference is the change in energy of the system over a time step.
     * We can only use first differences when the energy of the system is constant.
     * If the energy of the system changes over time, then we need to reduce the step size
     * until the change of energy over the step stabilizes.  Put another way:  we reduce
     * the step size until the change in the change in energy becomes small.
     * true means use *change in change in energy* (second derivative)
     * as the criteria for accuracy
     */
    secondDiff: boolean;
    /**
     * The smallest time step that will executed.
     * Setting a reasonable lower bound prevents the solver from taking too long to give up.
     * This value may be reduced incrementally to improve the accuracy.
     * Default is 1E-5;
     */
    stepLBound: number;
    /**
     * Returns the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     */
    tolerance: number;
    /**
     * 
     */
    constructor(simulation: Simulation, energySystem: EnergySystem<T>, diffEqSolver: DiffEqSolver);
    /**
     * 
     */
    step(stepSize: number, uomStep: Unit): void;
}

/**
 * An adaptive step solver that adjusts the step size in order to
 * ensure that the energy change be less than a tolerance amount.
 */
export class ConstantEnergySolver<T> implements DiffEqSolver {
    /**
     * The smallest time step that will executed.
     * Setting a reasonable lower bound prevents the solver from taking too long to give up.
     * This value may be reduced incrementally to improve the accuracy.
     * Default is 1E-5;
     */
    stepLowerBound: number;
    /**
     * Returns the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     */
    tolerance: number;
    /**
     * Constructs an adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     */
    constructor(simulation: Simulation, energySystem: EnergySystem<T>, solverMethod: DiffEqSolver);
    /**
     * 
     */
    step(stepSize: number, uomStep: Unit): void;
}

export interface AdvanceStrategy {
    /**
     * 
     */
    advance(stepSize: number, uomStep?: Unit): void;
}

export class DefaultAdvanceStrategy implements AdvanceStrategy {
    /**
     * 
     */
    constructor(simulation: Simulation, solver: DiffEqSolver);
    advance(stepSize: number, uomStep?: Unit): void;
}

/**
 * 
 */
export interface ForceBody<T> {
    /**
     * A placeholder for applications to define a unique identifier. 
     */
    uuid: string;

    /**
     * 
     */
    L: T;

    /**
     * 
     */
    M: T;

    /**
     * 
     */
    P: T;

    /**
     * 
     */
    R: T;

    /**
     * 
     */
    X: T;

    /**
     * 
     */
    expireTime: number;

    /**
     * 
     */
    varsIndex: number;

    /**
     * 
     */
    Ω: T;

    /**
     * 
     */
    rotationalEnergy(): T;

    /**
     * 
     */
    translationalEnergy(): T;

    /**
     * 
     */
    updateAngularVelocity(): void;
}

/**
 * 
 */
export class ConstantForceLaw<T> implements ForceLaw<T> {
    /**
     * 
     */
    readonly forces: Force<T>[];
    /**
     * 
     */
    expireTime: number;
    /**
     * The attachment point to the body in body coordinates.
     */
    location: T;
    /**
     * The vector representation of the constant force.
     */
    vector: T;
    /**
     * 
     */
    constructor(body: RigidBody<T>, vector: T, vectorCoordType?: CoordType);
    /**
     * 
     */
    updateForces(): Force<T>[];
    /**
     * 
     */
    disconnect(): void;
    /**
     * 
     */
    potentialEnergy(): T;
}

/**
 * @deprecated Use ConstantForceLaw.
 */
export class ConstantForceLaw1 extends ConstantForceLaw<Geometric1> {
    constructor(body: ForceBody<Geometric1>, vector: Geometric1, vectorCoordType?: CoordType);
}

/**
 * @deprecated Use ConstantForceLaw.
 */
export class ConstantForceLaw2 extends ConstantForceLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, vector: Geometric2, vectorCoordType?: CoordType);
}

/**
 * @deprecated Use ConstantForceLaw.
 */
export class ConstantForceLaw3 extends ConstantForceLaw<Geometric3> {
    constructor(body: ForceBody<Geometric3>, vector: Geometric3, vectorCoordType?: CoordType);
}

export class ConstantTorqueLaw<T> implements TorqueLaw<T> {
    readonly torques: Torque<T>[];
    expireTime: number;
    constructor(body: RigidBody<T>, value: T, valueCoordType?: CoordType);
    updateTorques(): Torque<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

/**
 * @deprecated Use ConstantTorqueLaw.
 */
export class ConstantTorqueLaw1 extends ConstantTorqueLaw<Geometric1> {
    constructor(body: ForceBody<Geometric1>, value: Geometric1);
}

/**
 * @deprecated Use ConstantTorqueLaw.
 */
export class ConstantTorqueLaw2 extends ConstantTorqueLaw<Geometric2> {
    constructor(body: ForceBody<Geometric2>, value: Geometric2);
}

/**
 * @deprecated Use ConstantTorqueLaw.
 */
export class ConstantTorqueLaw3 extends ConstantTorqueLaw<Geometric3> {
    constructor(body: ForceBody<Geometric3>, value: Geometric3, valueCoordType?: CoordType);
}

/**
 * 
 */
export class CoulombLaw<T> implements ForceLaw<T> {
    /**
     * 
     */
    readonly forces: Force<T>[];
    /**
    *
    */
    k: Geometric3;
    /**
     * 
     */
    expireTime: number;
    /**
     * 
     */
    constructor(body1: RigidBody<T>, body2: RigidBody<T>, G?: T);
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

export class FaradayLaw<T> implements ForceLaw<T> {
    forces: Force<T>[];
    constructor(body: RigidBody<T>, field: (position: T) => T);
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
    expireTime: number;
}

export class GravitationLaw<T> implements ForceLaw<T> {
    /**
     * 
     */
    readonly forces: Force<T>[];
    /**
    * The proportionality constant, Newton's constant or Universal Gravitational constant.
    * The default value is one (1).
    */
    public G: T;
    /**
     * 
     */
    expireTime: number;
    /**
     * 
     */
    constructor(body1: RigidBody<T>, body2: RigidBody<T>);
    /**
     * Computes the forces due to the gravitational interaction.
     * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force<T>[];
    /**
     * 
     */
    disconnect(): void;
    /**
     * Computes the potential energy of the gravitational interaction.
     * U = -G m1 m2 / r, where
     * r is the center-of-mass to center-of-mass separation of m1 and m2.
     */
    potentialEnergy(): T;
}

export class GravitationForceLaw1 extends GravitationLaw<Geometric1> {
    constructor(body1: RigidBody<Geometric1>, body2: RigidBody<Geometric1>);
}

export class GravitationForceLaw2 extends GravitationLaw<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
}

export class GravitationForceLaw3 extends GravitationLaw<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>);
}

/**
 * 
 */
export class Spring<T> implements ForceLaw<T> {
    /**
     * 
     */
    readonly forces: Force<T>[];
    /**
    * 
    */
    restLength: T;
    /**
     * Alias for springConstant or stiffness.
     */
    k: T;
    /**
    * Alias for k or stiffness.
    */
    springConstant: T;
    /**
     * Alias for k or springConstant.
     */
    stiffness: T;
    /**
     * 
     */
    attach1: T;
    /**
     * 
     */
    attach2: T;
    /**
     * 
     */
    end1: T;
    /**
     * 
     */
    end2: T;
    /**
     * 
     */
    expireTime: number;
    /**
     * 
     */
    constructor(body1: RigidBody<T>, body2: RigidBody<T>);
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

/**
 * @deprecated Use Spring.
 */
export class Spring1 extends Spring<Geometric1> {
    constructor(body1: RigidBody<Geometric1>, body2: RigidBody<Geometric1>);
}

/**
 * @deprecated Use Spring.
 */
export class Spring2 extends Spring<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
}

/**
 * @deprecated Use Spring.
 */
export class Spring3 extends Spring<Geometric3> {
    constructor(body1: RigidBody<Geometric3>, body2: RigidBody<Geometric3>);
}

export class LinearDamper<T> implements ForceLaw<T> {
    /**
     * 
     */
    readonly forces: Force<T>[];
    /**
    * Alias for frictionCoefficient.
    */
    b: T;
    /**
     * Alias for b.
     */
    frictionCoefficient: T;
    /**
     *
     */
    expireTime: number;
    constructor(body1: RigidBody<T>, body2: RigidBody<T>);
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

/**
 * @deprecated Use LinearDamper.
 */
export class LinearDamper1 extends LinearDamper<Geometric1> {
    constructor(body1: RigidBody<Geometric1>, body2: RigidBody<Geometric1>);
}

/**
 * @deprecated Use LinearDamper.
 */
export class LinearDamper2 extends LinearDamper<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
}

/**
 * @deprecated Use LinearDamper.
 */
export class LinearDamper3 extends LinearDamper<Geometric2> {
    constructor(body1: RigidBody<Geometric2>, body2: RigidBody<Geometric2>);
}

/**
 * A rectangle whose boundaries are stored with double floating point precision.
 * This is an immutable class: once an instance is created it cannot be changed.
 * 
 * Note that for DoubleRect we regard the vertical coordinate as increasing upwards,
 * so the top coordinate is greater than the bottom coordinate.
 * This is in contrast to HTML5 canvas where vertical coordinates increase downwards.
 */
export class DoubleRect {
    /**
     * 
     */
    static EMPTY_RECT: DoubleRect;
    /**
     * 
     */
    constructor(left: number, bottom: number, right: number, top: number);
}

export class SimView {

}

/**
 * 
 */
export enum AxisChoice {
    HORIZONTAL = 1,
    VERTICAL = 2,
    BOTH = 3
}

/**
 * 
 */
export class AutoScale {
    /**
     * 
     */
    active: boolean;
    /**
     * 
     */
    axisChoice: AxisChoice;
    /**
     * 
     */
    enabled: boolean;
    /**
     * 
     */
    timeWindow: number;
    /**
     * 
     */
    constructor(view: SimView);
    /**
     * 
     */
    addGraphLine(graphLine: GraphLine): void;
    /**
     * 
     */
    clearRange(): void;
    /**
     * 
     */
    getRangeRect(): DoubleRect;
    /**
     * 
     */
    memorize(): void;
    // observe(event: SubjectEvent): void;
    /**
     * 
     */
    removeGraphLine(graphLine: GraphLine): void;
    /**
     * 
     */
    reset(): void;
}

export enum AlignH {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    FULL = 3
}

export enum AlignV {
    TOP = 0,
    MIDDLE = 1,
    BOTTOM = 2,
    FULL = 3
}

/**
 * 
 */
export class DisplayAxes {

    /**
     * 
     */
    color: string;

    /**
     * The alignment for the horizontal axis.
     */
    hAxisAlign: AlignV;

    /**
     * The label for the horizontal axis.
     */
    hAxisLabel: string;

    /**
     * The scale for the horizontal axis (scalar).
     */
    hAxisScale: Unit;

    /**
     * The alignment for the vertical axis.
     */
    vAxisAlign: AlignH;

    /**
     * The label for the vertical axis.
     */
    vAxisLabel: string;

    /**
     * The scale for the vertical axis (scalar).
     */
    vAxisScale: Unit;
}

/**
 * 
 */
export enum DrawingMode {
    DOTS = 0,
    LINES = 1
}

/**
 * 
 */
export interface GraphLine {
    /**
     * 
     */
    color: string;
    /**
     * 
     */
    drawingMode: DrawingMode;
    /**
     * The variable index used for the horizontal coordinate.
     */
    hCoordIndex: number;
    /**
     * 
     */
    hotspotColor: string;
    /**
     * 
     */
    lineWidth: number;
    /**
     * 
     */
    varsList: VarsList;
    /**
     * The variable index used for the vertical coordinate.
     */
    vCoordIndex: number;
    /**
     * 
     */
    // getGraphPoints(): CircularList<GraphPoint>;
    // getGraphStyle(index: number): GraphStyle;
    /**
     * 
     */
    getXVarName(): string;
    /**
     * 
     */
    getYVarName(): string;
    reset(): void;
    resetStyle(): void;
}

/**
 * 
 */
export class Graph {
    /**
     * 
     */
    autoScale: AutoScale;
    /**
     * 
     */
    axes: DisplayAxes;
    /**
     * 
     */
    constructor(canvasId: string, varsList: VarsList);
    /**
     * 
     */
    addGraphLine(hCoordIndex: number, vCoordIndex: number, color?: string): GraphLine;
    /**
     * 
     */
    memorize(): void;
    /**
     * 
     */
    removeGraphLine(graphLine: GraphLine): void;
    /**
     * 
     */
    render(): void;
    /**
     * 
     */
    reset(): void;
}

/**
 * 
 */
export class EnergyTimeGraph extends Graph {

    /**
     * 
     */
    public translationalEnergyGraphLine: GraphLine;

    /**
     * 
     */
    public rotationalEnergyGraphLine: GraphLine;

    /**
     * 
     */
    public potentialEnergyGraphLine: GraphLine;

    /**
     * 
     */
    public totalEnergyGraphLine: GraphLine;

    /**
     * 
     */
    constructor(canvasId: string, varsList: VarsList);
}
