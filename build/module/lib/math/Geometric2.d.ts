import { BivectorE2 as Bivector } from "./BivectorE2";
import { GeometricE2 as Geometric } from "./GeometricE2";
import { GeometricNumber } from './GeometricNumber';
import { GeometricOperators } from './GeometricOperators';
import { GradeMasked } from "./GradeMasked";
import { Scalar } from "./Scalar";
import { SpinorE2 as Spinor } from "./SpinorE2";
import { Unit } from "./Unit";
import { VectorE2 as Vector } from "./VectorE2";
export declare class Geometric2 implements GradeMasked, Geometric, GeometricNumber<Geometric2, Geometric2, Spinor, Vector, Geometric2, number, Unit>, GeometricOperators<Geometric2, Unit> {
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
     * The unit of measure.
     * This property should only be changed through the accessors.
     */
    private uom_;
    /**
     *
     */
    private lock_;
    /**
     * Do not call this constructor. Use the static construction methods instead.
     * The multivector is constructed in the unlocked (mutable) state.
     */
    constructor(coords?: number[], uom?: Unit);
    adj(): Geometric2;
    isScalar(): boolean;
    quad(): Geometric2;
    scale(α: number): Geometric2;
    slerp(target: Geometric2, α: number): Geometric2;
    stress(σ: Vector): Geometric2;
    __div__(rhs: number | Geometric2): Geometric2;
    __rdiv__(lhs: number | Geometric2): Geometric2;
    __vbar__(rhs: number | Geometric2): Geometric2;
    __rvbar__(lhs: number | Geometric2): Geometric2;
    __wedge__(rhs: number | Geometric2): Geometric2;
    __rwedge__(lhs: number | Geometric2): Geometric2;
    __lshift__(rhs: number | Geometric2): Geometric2;
    __rlshift__(lhs: number | Geometric2): Geometric2;
    __rshift__(rhs: number | Geometric2): Geometric2;
    __rrshift__(lhs: number | Geometric2): Geometric2;
    __bang__(): Geometric2;
    __eq__(rhs: number | Geometric2): boolean;
    __ne__(rhs: Geometric2): boolean;
    __ge__(rhs: Geometric2): boolean;
    __gt__(rhs: Geometric2): boolean;
    __le__(rhs: Geometric2): boolean;
    __lt__(rhs: Geometric2): boolean;
    __tilde__(): Geometric2;
    __add__(rhs: Geometric2 | Unit): Geometric2;
    __radd__(lhs: Geometric2 | Unit): Geometric2;
    __sub__(rhs: Geometric2 | Unit): Geometric2;
    __rsub__(lhs: Geometric2 | Unit): Geometric2;
    __pos__(): Geometric2;
    __neg__(): Geometric2;
    __mul__(rhs: any): Geometric2;
    __rmul__(lhs: any): Geometric2;
    add2(a: Geometric, b: Geometric): Geometric2;
    addPseudo(β: number, uom?: Unit): Geometric2;
    addScalar(α: number, uom?: Unit): Geometric2;
    angle(): Geometric2;
    approx(n: number): Geometric2;
    conj(): Geometric2;
    copySpinor(spinor: Spinor): Geometric2;
    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    div(rhs: Geometric): Geometric2;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @param a The numerator.
     * @param b The denominator.
     */
    div2(a: Spinor, b: Spinor): Geometric2;
    divByNumber(α: number): Geometric2;
    divByVector(v: Vector): Geometric2;
    /**
     * dual(m) = I<sub>n</sub> * m = m / I<sub>n</sub>
     *
     * @returns dual(m) or dual(this) if m is undefined.
     */
    dual(m?: Geometric): Geometric2;
    equals(other: unknown): boolean;
    exp(): Geometric2;
    /**
     * <p>
     * <code>this ⟼ lhs ^ rhs</code>
     * </p>
     */
    ext2(lhs: Geometric, rhs: Geometric): this;
    grade(n: number): Geometric2;
    isOne(): boolean;
    isSpinor(): boolean;
    I(): Geometric2;
    lco(rhs: Geometric): Geometric2;
    /**
     * <p>
     * <code>this ⟼ lhs << rhs</code>
     * </p>
     *
     * @param a
     * @param b
     */
    lco2(lhs: Geometric, rhs: Geometric): this;
    lerp(target: Geometric, α: number): Geometric2;
    lerp2(a: Geometric, b: Geometric, α: number): Geometric2;
    log(): Geometric2;
    norm(): Geometric2;
    one(): Geometric2;
    rco(m: Geometric): Geometric2;
    /**
     * <p>
     * <code>this ⟼ lhs >> rhs</code>
     * </p>
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
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
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
    squaredNorm(mutate?: boolean): Geometric2;
    sub2(a: Geometric, b: Geometric): Geometric2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     */
    versor(a: Vector, b: Vector): this;
    /**
     * Determines whether this multivector is locked.
     * If the multivector is in the unlocked state then it is mutable.
     * If the multivector is in the locked state then it is immutable.
     */
    isLocked(): boolean;
    isMutable(): boolean;
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
     * The optional unit of measure.
     */
    get uom(): Unit;
    set uom(uom: Unit);
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
     * @param mutate Must be `true` when calling the `direction` method on an unlocked Geometric3.
     * @returns this / magnitude(this)
     */
    direction(mutate: boolean): Geometric2;
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
     * Computes the inverse of this multivector.
     * TODO: Define what inverse means.
     * @returns inverse(this)
     */
    inv(): Geometric2;
    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    isZero(): boolean;
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    magnitude(mutate?: boolean): Geometric2;
    /**
     * Intentionally undocumented.
     */
    private magnitudeSansUnits;
    /**
     * @param rhs
     * @returns this * m
     */
    mul(rhs: Geometric): Geometric2;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @param a
     * @param b
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
     * The quaditude of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quaditude(mutate: boolean): Geometric2;
    /**
     * @returns reverse(this)
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
     * <p>
     * <code>this ⟼ scp(a, b) = a | b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    scp2(a: Geometric, b: Geometric): this;
    /**
     * Intentionally undocumented
     */
    private squaredNormSansUnits;
    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    sub(M: Geometric, α?: number): Geometric2;
    subScalar(M: Scalar, α?: number): Geometric2;
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
    writeVector(vector: Vector): void;
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this;
}
