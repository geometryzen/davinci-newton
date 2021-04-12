import { AbstractGeometric } from './AbstractGeometric';
import { BivectorE2 as Bivector } from "./BivectorE2";
import { GeometricE2 as Geometric } from "./GeometricE2";
import { GeometricNumber } from './GeometricNumber';
import { GeometricOperators } from './GeometricOperators';
import { GradeMasked } from "./GradeMasked";
import { Scalar } from "./Scalar";
import { SpinorE2 as Spinor } from "./SpinorE2";
import { Unit } from "./Unit";
import { VectorE2 as Vector } from "./VectorE2";
/**
 * A mutable and lockable multivector in 2D with a Euclidean metric and optional unit of measure.
 */
export declare class Geometric2 extends AbstractGeometric implements GradeMasked, Geometric, GeometricNumber<Geometric2, Geometric2, Spinor, Vector, number>, GeometricOperators<Geometric2> {
    /**
     * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static scalar(a: number, uom?: Unit): Geometric2;
    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     * The bivector returned is in the unlocked (mutable) state.
     * @param b The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static bivector(b: number, uom?: Unit): Geometric2;
    /**
     * Creates a spinor valued multivector from the specified cartesian coordinates.
     * The spinor returned is in the unlocked (mutable) state.
     * @param a The scalar coordinate.
     * @param b The pseudoscalar coordinate.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static spinor(a: number, b: number, uom?: Unit): Geometric2;
    /**
     * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param y The coordinate corresponding to the e2 basis vector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static vector(x: number, y: number, uom?: Unit): Geometric2;
    static copy(mv: Geometric): Geometric2;
    static fromBivector(B: Bivector): Geometric2;
    static fromScalar(alpha: Scalar): Geometric2;
    static fromSpinor(R: Spinor): Geometric2;
    static fromVector(v: Vector): Geometric2;
    static rotorFromDirections(a: Vector, b: Vector): Geometric2;
    static rotorFromVectorToVector(a: Vector, b: Vector): Geometric2;
    /**
     * Constructs a Geometric2 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    static readonly zero: Geometric2;
    /**
     * Constructs a Geometric2 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    static readonly one: Geometric2;
    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly e1: Geometric2;
    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly e2: Geometric2;
    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly I: Geometric2;
    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    static readonly meter: Geometric2;
    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    static readonly kilogram: Geometric2;
    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    static readonly second: Geometric2;
    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    static readonly ampere: Geometric2;
    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    static readonly kelvin: Geometric2;
    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     *
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    static readonly mole: Geometric2;
    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    static readonly candela: Geometric2;
    /**
     * SI derived unit of electric charge, quantity of electricity.
     */
    static readonly coulomb: Geometric2;
    /**
     * SI derived unit of force.
     */
    static readonly newton: Geometric2;
    /**
     * SI derived unit of energy, work, quantity of heat.
     */
    static readonly joule: Geometric2;
    /**
     *
     */
    private readonly coords_;
    /**
     * Constructs a mutable instance of Geometric2 from coordinates and an optional unit of measure.
     * @param coords The 4 coordinates are in the order [a, x, y, b].
     * @param uom The optional unit of measure.
     */
    constructor(coords?: [a: number, x: number, y: number, b: number], uom?: Unit);
    scale(α: number): Geometric2;
    /**
     * @hidden
     */
    __div__(rhs: Geometric2 | number | Unit): Geometric2;
    /**
     * @hidden
     */
    __rdiv__(lhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __vbar__(rhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __rvbar__(lhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __wedge__(rhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __rwedge__(lhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __lshift__(rhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __rlshift__(lhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __rshift__(rhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __rrshift__(lhs: number | Geometric2): Geometric2;
    /**
     * @hidden
     */
    __bang__(): Geometric2;
    /**
     * @hidden
     */
    __eq__(rhs: Geometric2 | number | Unit): boolean;
    /**
     * @hidden
     */
    __ne__(rhs: Geometric2 | number | Unit): boolean;
    /**
     * @hidden
     */
    __tilde__(): Geometric2;
    /**
     * @hidden
     */
    __add__(rhs: Geometric2 | number | Unit): Geometric2;
    /**
     * @hidden
     */
    __radd__(lhs: Geometric2 | number | Unit): Geometric2;
    /**
     * @hidden
     */
    __sub__(rhs: Geometric2 | number | Unit): Geometric2;
    /**
     * @hidden
     */
    __rsub__(lhs: Geometric2 | number): Geometric2;
    /**
     * @hidden
     */
    __pos__(): Geometric2;
    /**
     * @hidden
     */
    __neg__(): Geometric2;
    /**
     * @hidden
     */
    __mul__(rhs: Geometric2 | number | Unit): Geometric2;
    /**
     * @hidden
     */
    __rmul__(lhs: any): Geometric2;
    /**
     * @hidden
     */
    add2(a: Geometric, b: Geometric): Geometric2;
    addPseudo(β: number, uom?: Unit): Geometric2;
    /**
     * Adds a multiple of a scalar to this multivector.
     * @param a The scalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @param α The fraction of (a * uom) to be added. Default is 1.
     * @returns this + (a * uom) * α
     */
    addScalar(a: number, uom?: Unit, α?: number): Geometric2;
    /**
     * @hidden
     */
    approx(n: number): Geometric2;
    conj(): Geometric2;
    copySpinor(spinor: Spinor): Geometric2;
    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    div(rhs: Geometric): Geometric2;
    /**
     * @hidden
     */
    div2(a: Spinor, b: Spinor): Geometric2;
    divByNumber(α: number): Geometric2;
    divByVector(v: Vector): Geometric2;
    dual(): Geometric2;
    equals(other: unknown): boolean;
    /**
     * @hidden
     */
    ext2(lhs: Geometric, rhs: Geometric): this;
    grade(n: number): Geometric2;
    I(): Geometric2;
    lco(rhs: Geometric): Geometric2;
    /**
     * @hidden
     */
    lco2(lhs: Geometric, rhs: Geometric): this;
    one(): Geometric2;
    rco(m: Geometric): Geometric2;
    /**
     * @hidden
     */
    rco2(lhs: Geometric, rhs: Geometric): this;
    /**
     * If `this` is mutable, then sets `this` multivector to its reflection in the plane orthogonal to vector n. The result is mutable.
     * If `this` is immutable (locked), a copy of `this` is made, which is then reflected. The result is immutable (locked).
     *
     * i.e. The result is mutable (unlocked) iff `this` is mutable (unlocked).
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
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
     */
    reflect(n: Readonly<Vector>): Geometric2;
    /**
     * <p>
     * Computes a rotor, R, from two unit vectors, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * </p>
     *
     * The result is independent of the magnitudes of a and b.
     *
     * @param a The starting vector
     * @param b The ending vector
     * @returns The rotor representing a rotation from a to b.
     */
    rotorFromDirections(a: Vector, b: Vector): Geometric2;
    rotorFromFrameToFrame(es: Vector[], fs: Vector[]): Geometric2;
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromGeneratorAngle(B: Bivector, θ: number): Geometric2;
    /**
     * R = sqrt(|b|/|a|) * (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is depends  on the magnitudes of a and b.
     */
    rotorFromVectorToVector(a: Vector, b: Vector): Geometric2;
    sqrt(): Geometric2;
    squaredNorm(): Geometric2;
    /**
     * @hidden
     */
    sub2(a: Geometric, b: Geometric): Geometric2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric2 to the geometric product a * b of the vector arguments.
     */
    versor(a: Vector, b: Vector): this;
    /**
     * Consistently set a coordinate value in the most optimized way.
     * Permits mutation only when the lock status is UNLOCKED.
     * It is safe to use this as an alternative to the named property accessors.
     */
    private setCoordinate;
    /**
     * The scalar part of this multivector.
     */
    get a(): number;
    set a(a: number);
    /**
     * The pseudoscalar part of this multivector.
     */
    get b(): number;
    set b(b: number);
    get xy(): number;
    set xy(xy: number);
    /**
     * A bitmask describing the grades.
     *
     * 0x0 = zero
     * 0x1 = scalar
     * 0x2 = vector
     * 0x4 = bivector
     * 0x8 = pseudoscalar
     */
    get grades(): number;
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    get x(): number;
    set x(x: number);
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    get y(): number;
    set y(y: number);
    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * @param M The multivector to be added to this multivector.
     * @param α An optional scale factor that multiplies the multivector argument.
     * @returns this + M * α
     */
    add(M: Geometric, α?: number): Geometric2;
    /**
     * @param v The vector to be added to this multivector.
     * @param α An optional scale factor that multiplies the vector argument.
     * @returns this + v * α
     */
    addVector(v: Vector, α?: number): Geometric2;
    /**
     * @returns copy(this)
     */
    clone(): Geometric2;
    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @param M The multivector to be copied.
     */
    copy(M: Geometric): this;
    /**
     * <p>
     * <code>this ⟼ copy(B)</code>
     * </p>
     *
     * @param B The bivector to be copied.
     */
    copyBivector(B: Bivector): this;
    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     * @param uom The unit of measure.
     */
    copyScalar(α: number, uom: Unit): this;
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: Vector): this;
    /**
     * @returns this / magnitude(this)
     */
    direction(): Geometric2;
    divByPseudo(β: number, uom?: Unit): Geometric2;
    /**
     * <p>
     * <code>this ⟼ this / (α * uom)</code>
     * </p>
     *
     * @param α The scalar dividend.
     * @param uom The unit of measure.
     */
    divByScalar(α: number, uom: Unit): Geometric2;
    /**
     * @param m
     * @returns this ^ m
     */
    ext(m: Geometric): Geometric2;
    /**
     * Computes the right inverse of this multivector.
     * inv(X) satisfies X * inv(X) = 1.
     * @returns inverse(this)
     */
    inv(): Geometric2;
    isBivector(): boolean;
    isOne(): boolean;
    isScalar(): boolean;
    isSpinor(): boolean;
    isVector(): boolean;
    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    isZero(): boolean;
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    magnitude(): Geometric2;
    /**
     * @hidden
     */
    magnitudeNoUnits(): number;
    /**
     * @param rhs
     * @returns this * m
     */
    mul(rhs: Geometric): Geometric2;
    /**
     * @hidden
     */
    mul2(lhs: Geometric, rhs: Geometric): this;
    mulByBivector(B: Bivector): Geometric2;
    /**
     * @param α
     * @returns this * α
     */
    mulByNumber(α: number): Geometric2;
    /**
     * @param α
     * @param uom
     * @returns this * (α * uom)
     */
    mulByScalar(α: number, uom: Unit): Geometric2;
    mulByVector(v: Vector): Geometric2;
    /**
     * @returns this * -1
     */
    neg(): Geometric2;
    /**
     * @hidden
     * The quad of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quaditude(): Geometric2;
    /**
     * reverse has a ++-- structure on the grades.
     * The scalar component, a, will not change.
     * The vector components, x and y, will not change.
     * The bivector component, b, will change sign.
     */
    rev(): Geometric2;
    /**
     * (α + βI)(a + x.e1 + y.e2 + b.I)(α - β.I)
     *
     * @param spinor the spinor that rotates this multivector.
     * @returns R * this * reverse(R)
     */
    rotate(spinor: Spinor): Geometric2;
    /**
     * @param m
     * @returns this | m
     */
    scp(m: Geometric): Geometric2;
    /**
     * @hidden
     */
    scp2(a: Geometric, b: Geometric): this;
    /**
     * @hidden
     */
    quaditudeNoUnits(): number;
    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    sub(M: Geometric, α?: number): Geometric2;
    /**
     * Subtracts a multiple of a scalar from this multivector.
     * @param a The scalar value to be subtracted from this multivector.
     * @param uom The optional unit of measure.
     * @param α The fraction of (a * uom) to be subtracted. Default is 1.
     * @returns this - (a * uom) * α
     */
    subScalar(a: number, uom?: Unit, α?: number): Geometric2;
    /**
     * @param v The vector to subtract from this multivector.
     * @param α The multiplier for the amount of the vector to subtract.
     * @returns this - v * α
     */
    subVector(v: Vector, α?: number): Geometric2;
    /**
     * Returns a string representing the number in exponential notation.
     *
     * @param fractionDigits
     * @returns
     */
    toExponential(fractionDigits?: number): string;
    /**
     * Returns a string representing the number in fixed-point notation.
     *
     * @param fractionDigits
     * @returns
     */
    toFixed(fractionDigits?: number): string;
    /**
     * @param precision
     * @returns
     */
    toPrecision(precision?: number): string;
    /**
     * Returns a string representation of the number.
     *
     * @param radix
     * @returns
     */
    toString(radix?: number): string;
    write(mv: Geometric): void;
    /**
     * Sets this Geometric2 to have the specified cartesian coordinates and unit of measure.
     *
     * this.a   ⟼ 0,
     * this.x   ⟼ x,
     * this.y   ⟼ y,
     * this.b   ⟼ 0,
     * this.uom ⟼ uom
     *
     * @param x The cartesian x coordinate corresponding to the e1 basis vector.
     * @param y The cartesian y coordinate corresponding to the e2 basis vector.
     * @param uom The optional unit of measure.
     * @returns this Geometric2.
     * @throws An Error if this Geometric2 is not mutable.
     */
    vectorFromCoords(x: number, y: number, uom?: Unit): this | never;
    writeVector(v: Vector): void;
    writeBivector(B: Bivector): void;
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this;
}
