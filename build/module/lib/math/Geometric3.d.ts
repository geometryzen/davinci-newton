import { AbstractGeometric } from './AbstractGeometric';
import { BivectorE3 } from './BivectorE3';
import { GeometricE3 } from './GeometricE3';
import { GeometricNumber } from './GeometricNumber';
import { GeometricOperators } from './GeometricOperators';
import { GradeMasked } from './GradeMasked';
import { MatrixLike } from './MatrixLike';
import { Scalar } from './Scalar';
import { SpinorE3 as Spinor, SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
import { VectorE3 as Vector, VectorE3 } from './VectorE3';
/**
 * A mutable and lockable multivector in 3D with a Euclidean metric and optional unit of measure.
 */
export declare class Geometric3 extends AbstractGeometric implements GradeMasked, GeometricE3, GeometricNumber<Geometric3, Geometric3, Spinor, Vector>, GeometricOperators<Geometric3> {
    /**
     *
     */
    private readonly coords_;
    /**
     * Constructs a mutable instance of Geometric3 from coordinates and an optional unit of measure.
     * @param coords The 8 coordinates are in the order [a, x, y, z, xy, yz, zx, b].
     * @param uom The optional unit of measure.
     */
    constructor(coords?: number[], uom?: Unit);
    __eq__(rhs: Geometric3 | number): boolean;
    __ne__(rhs: number | Geometric3): boolean;
    scale(α: number): Geometric3;
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
     * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
     */
    get z(): number;
    set z(z: number);
    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
     */
    get yz(): number;
    set yz(yz: number);
    /**
     * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
     */
    get zx(): number;
    set zx(zx: number);
    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
     */
    get xy(): number;
    set xy(xy: number);
    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * @param M The multivector to be added to this multivector.
     * @param α An optional scale factor that multiplies the multivector argument.
     * @returns this + M * α
     */
    add(M: GeometricE3, α?: number): Geometric3;
    /**
     * this ⟼ a + b
     *
     * @param a
     * @param b
     * @returns this multivector
     */
    add2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @returns this + (Iβ * uom)
     */
    addPseudo(β: number, uom?: Unit): Geometric3;
    /**
     * Adds a scalar value to this multivector.
     *
     * @param α The scalar value to be added to this multivector.
     * @param uom The optional unit of measure.
     * @returns this + (α * uom)
     */
    addScalar(a: number, uom?: Unit, α?: number): Geometric3;
    /**
     * @param v The vector to be added to this multivector.
     * @param α An optional scale factor that multiplies the vector argument.
     * @returns this + v * α
     */
    addVector(v: VectorE3, α?: number): Geometric3;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    applyMatrix(σ: MatrixLike): this;
    /**
     * Sets this multivector to the angle, defined as the bivector part of the logarithm.
     * @returns grade(log(this), 2)
     */
    angle(): Geometric3;
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
     * @param n
     * @returns approx(this, n)
     */
    approx(n: number): Geometric3;
    /**
     * @returns copy(this)
     */
    clone(): Geometric3;
    /**
     * Clifford conjugation
     */
    conj(): Geometric3;
    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @param M The multivector to be copied.
     */
    copy(M: GeometricE3): this;
    /**
     * <p>
     * <code>this ⟼ copy(B)</code>
     * </p>
     *
     * @param B The bivector to be copied.
     */
    copyBivector(B: BivectorE3): this;
    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     * @param uom The unit of measure.
     */
    copyScalar(α: number, uom: Unit): this;
    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    copySpinor(spinor: SpinorE3): this;
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: VectorE3): this;
    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     *
     * @returns -I * (this ^ m)
     */
    cross(m: GeometricE3): Geometric3;
    /**
     * @returns this / magnitude(this)
     */
    direction(): Geometric3;
    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    div(m: GeometricE3): Geometric3;
    divByNumber(α: number): Geometric3;
    /**
     * <p>
     * <code>this ⟼ this / (α * uom)</code>
     * </p>
     *
     * @param α The scalar dividend.
     * @param uom The unit of measure.
     */
    divByScalar(α: number, uom?: Unit): Geometric3;
    divByVector(v: VectorE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @param a The numerator.
     * @param b The denominator.
     */
    div2(a: SpinorE3, b: SpinorE3): this;
    /**
     * dualization: dual(Ak) = Ak << inv(I)
     *
     * In an n-dimensional Euclidean space, the inverse is the reverse.
     */
    dual(): Geometric3;
    /**
     * @param other
     * @returns
     */
    equals(other: any): boolean;
    /**
     * <p>
     * <code>this ⟼ e<sup>this</sup></code>
     * </p>
     */
    exp(): Geometric3;
    /**
     * Computes the inverse of this multivector.
     * @returns inverse(this)
     */
    inv(): Geometric3;
    isBivector(): boolean;
    /**
     * Determines whether this multivector is exactly 1 (one).
     */
    isOne(): boolean;
    isScalar(): boolean;
    isSpinor(): boolean;
    isVector(): boolean;
    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    isZero(): boolean;
    /**
     * @param m
     * @returns this << m
     */
    lco(m: GeometricE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a << b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    lco2(a: GeometricE3, b: GeometricE3): this;
    /**
     * <p>
     * <code>this ⟼ log(this)</code>
     * </p>
     */
    log(): Geometric3;
    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    magnitude(): Geometric3;
    magnitudeNoUnits(): number;
    /**
     * Returns the geometric product of this multivector with the rhs multivector.
     * @param rhs The operand on the right hand side of the * operator.
     * @return this * rhs
     */
    mul(rhs: GeometricE3): Geometric3;
    mulByBivector(B: BivectorE3): Geometric3;
    mulByVector(v: VectorE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    mul2(a: GeometricE3, b: GeometricE3): this;
    /**
     * @returns this * -1
     */
    neg(): Geometric3;
    /**
     * Sets this multivector to the identity element for multiplication, <b>1</b>.
     */
    one(): this;
    /**
     * The quaditude of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quaditude(): Geometric3;
    /**
     * @param m
     * @returns this >> m
     */
    rco(m: GeometricE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    rco2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Computes the <em>squared norm</em> of this multivector.
     *
     * This is an alias for the `quaditude` method.
     */
    squaredNorm(): Geometric3;
    quaditudeNoUnits(): number;
    /**
     * Sets this multivector to its reflection in the plane orthogonal to vector n.
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     *
     * @param n The unit vector that defines the reflection plane.
     */
    reflect(n: VectorE3): Geometric3;
    /**
     * @returns reverse(this)
     */
    rev(): Geometric3;
    /**
     * @param R the spinor that rotates this multivector.
     * @returns R * this * reverse(R)
     */
    rotate(R: SpinorE3): Geometric3;
    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation aspect and orientation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromAxisAngle(axis: VectorE3, θ: number): this;
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
    rotorFromDirections(a: VectorE3, b: VectorE3): this;
    /**
     * Helper function for rotorFromFrameToFrame.
     */
    private rotorFromTwoVectors;
    /**
     *
     */
    rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): this;
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromGeneratorAngle(B: BivectorE3, θ: number): this;
    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     */
    rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): this;
    /**
     * @param m
     * @returns this | m
     */
    scp(m: GeometricE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ scp(a, b) = a | b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    scp2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Currently limited to taking the square root of a positive scalar quantity.
     */
    sqrt(): Geometric3;
    /**
     * @param α
     * @returns this * α
     */
    mulByNumber(α: number): Geometric3;
    /**
     * @param α
     * @param uom
     * @returns this * (α * uom)
     */
    mulByScalar(α: number, uom?: Unit): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     *
     * @param a
     * @param b
     */
    versor(a: VectorE3, b: VectorE3): this;
    write(mv: GeometricE3): void;
    writeVector(v: VectorE3): void;
    writeBivector(B: BivectorE3): void;
    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    sub(M: GeometricE3, α?: number): Geometric3;
    /**
     * Subtracts a multiple of a scalar from this multivector.
     * @param a The scalar value to be subtracted from this multivector.
     * @param uom The optional unit of measure.
     * @param α The fraction of (a * uom) to be subtracted. Default is 1.
     * @returns this - (a * uom) * α
     */
    subScalar(a: number, uom?: Unit, α?: number): Geometric3;
    /**
     * @param v The vector to subtract from this multivector.
     * @param α The multiplier for the amount of the vector to subtract.
     * @returns this - v * α
     */
    subVector(v: VectorE3, α?: number): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    sub2(a: GeometricE3, b: GeometricE3): this;
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
    /**
     * Sets this multivector to the result of keeping only the specified grade.
     * This is the grade extraction operation.
     *
     * @param n the grade to be retained.
     * @returns grade(this, n)
     */
    grade(n: number): Geometric3;
    /**
     * @param m
     * @return this ^ m
     */
    ext(m: GeometricE3): Geometric3;
    /**
     * <p>
     * <code>this ⟼ a ^ b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    ext2(a: GeometricE3, b: GeometricE3): this;
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this;
    /**
     * Implements `this + rhs`.
     */
    __add__(rhs: Geometric3 | number | Unit): Geometric3;
    /**
     * Implements `this / rhs`.
     */
    __div__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs / this`.
     */
    __rdiv__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `this * rhs`.
     */
    __mul__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs * this`.
     */
    __rmul__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs + this`.
     */
    __radd__(lhs: Geometric3 | number | Unit): Geometric3;
    /**
     * Implements `this - rhs`.
     */
    __sub__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs - rhs`.
     */
    __rsub__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `~this`.
     */
    __tilde__(): Geometric3;
    /**
     * Implements `this ^ rhs`.
     */
    __wedge__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs ^ this`.
     */
    __rwedge__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `this << rhs`.
     */
    __lshift__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs << this`.
     */
    __rlshift__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `this >> rhs`.
     */
    __rshift__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs >> rhs`.
     */
    __rrshift__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `this | rhs`.
     */
    __vbar__(rhs: number | Geometric3): Geometric3;
    /**
     * Implements `lhs | this`.
     */
    __rvbar__(lhs: number | Geometric3): Geometric3;
    /**
     * Implements `!this`.
     */
    __bang__(): Geometric3;
    /**
     * Implements `+this`.
     */
    __pos__(): Geometric3;
    /**
     * Implements `-this`.
     */
    __neg__(): Geometric3;
    /**
     * Constructs a Geometric3 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    static readonly zero: Geometric3;
    /**
     * Constructs a Geometric3 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    static readonly one: Geometric3;
    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly e1: Geometric3;
    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly e2: Geometric3;
    /**
     * Constructs a basis vector corresponding to the <code>z</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly e3: Geometric3;
    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly I: Geometric3;
    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    static readonly meter: Geometric3;
    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    static readonly kilogram: Geometric3;
    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    static readonly second: Geometric3;
    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    static readonly ampere: Geometric3;
    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    static readonly kelvin: Geometric3;
    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     *
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    static readonly mole: Geometric3;
    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    static readonly candela: Geometric3;
    /**
     * SI derived unit of electric charge, quantity of electricity.
     */
    static readonly coulomb: Geometric3;
    /**
     * SI derived unit of force.
     */
    static readonly newton: Geometric3;
    /**
     * SI derived unit of energy, work, quantity of heat.
     */
    static readonly joule: Geometric3;
    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     * The bivector returned is in the unlocked (mutable) state.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static bivector(yz: number, zx: number, xy: number, uom?: Unit): Geometric3;
    /**
     * @param mv The multivector to be copied.
     */
    static copy(mv: GeometricE3): Geometric3;
    static dual(m: Geometric3): Geometric3;
    static dualOfBivector(B: BivectorE3): Geometric3;
    static dualOfVector(v: VectorE3): Geometric3;
    static fromBivector(B: BivectorE3): Geometric3;
    /**
     * @param alpha
     */
    static fromScalar(alpha: Scalar): Geometric3;
    /**
     * @param s
     */
    static fromSpinor(R: SpinorE3): Geometric3;
    /**
     * @param v
     * @returns
     */
    static fromVector(v: VectorE3): Geometric3;
    static pseudo(b: number, uom?: Unit): Geometric3;
    /**
     * <p>
     * Computes a multivector with random components.
     * </p>
     */
    static random(): Geometric3;
    /**
     * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
     *
     * @param a The <em>from</em> vector.
     * @param b The <em>to</em> vector.
     */
    static rotorFromDirections(a: VectorE3, b: VectorE3): Geometric3;
    static rotorFromFrameToFrame(es: VectorE3[], fs: VectorE3[]): Geometric3;
    static rotorFromVectorToVector(a: VectorE3, b: VectorE3, B: BivectorE3): Geometric3;
    /**
     * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static scalar(a: number, uom?: Unit): Geometric3;
    /**
     * Creates a spinor valued multivector from the specified cartesian coordinates.
     * The spinor returned is in the unlocked (mutable) state.
     * @param a The scalar coordinate.
     * @param yz The coordinate corresponding to the e2e3 basis bivector.
     * @param zx The coordinate corresponding to the e3e1 basis bivector.
     * @param xy The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static spinor(a: number, yz: number, zx: number, xy: number, uom?: Unit): Geometric3;
    /**
     * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param y The coordinate corresponding to the e2 basis vector.
     * @param z The coordinate corresponding to the e3 basis vector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Geometric3;
    /**
     * @param a
     * @param b
     */
    static wedge(a: Geometric3, b: Geometric3): Geometric3;
}
