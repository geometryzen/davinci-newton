import readOnly from "../i18n/readOnly";
import { BivectorE2 } from "./BivectorE2";
import { GradeMasked } from "./CartesianG3";
import gauss from "./gauss";
import { GeometricE2 } from "./GeometricE2";
import { isZeroGeometricE2 } from "./isZeroGeometricE2";
import { isZeroVectorE2 } from "./isZeroVectorE2";
import { Scalar } from "./Scalar";
import { SpinorE2 } from "./SpinorE2";
import { Unit } from "./Unit";
import { VectorE2 } from "./VectorE2";
// Symbolic constants for the coordinate indices into the data array.
const COORD_SCALAR = 0;
const COORD_X = 1;
const COORD_Y = 2;
const COORD_PSEUDO = 3;

// FIXME: Change to Canonical ordering.
const BASIS_LABELS = ["1", "e1", "e2", "e12"];
BASIS_LABELS[COORD_SCALAR] = '1';
BASIS_LABELS[COORD_X] = 'e1';
BASIS_LABELS[COORD_Y] = 'e2';
BASIS_LABELS[COORD_PSEUDO] = 'e12';

const zero = function zero(): number[] {
    return [0, 0, 0, 0];
};

const scalar = function scalar(a: number): number[] {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    return coords;
};

const vector = function vector(x: number, y: number): number[] {
    const coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    return coords;
};

const pseudo = function pseudo(b: number): number[] {
    const coords = zero();
    coords[COORD_PSEUDO] = b;
    return coords;
};

const spinor = function spinor(a: number, b: number): number[] {
    const coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_PSEUDO] = b;
    return coords;
};
/**
 * Coordinates corresponding to basis labels.
 */
const coordinates = function coordinates(m: GeometricE2): number[] {
    const coords = zero();
    coords[COORD_SCALAR] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_PSEUDO] = m.b;
    return coords;
};

/**
 * Sets the lock on the multivector argument and returns the same argument.
 * This is a convenience function for the dunder (double underscore) methods.
 * All dunder methods should return locked values.
 */
function lock(m: Geometric2): Geometric2 {
    m.lock();
    return m;
}

/**
 * Sentinel value to indicate that the Geometric2 is not locked.
 * UNLOCKED is in the range -1 to 0.
 */
const UNLOCKED = -1 * Math.random();

export class Geometric2 implements GradeMasked, GeometricE2 {

    /**
     * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static scalar(a: number, uom?: Unit): Geometric2 {
        return new Geometric2(scalar(a), uom);
    }

    /**
     * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
     * The bivector returned is in the unlocked (mutable) state.
     * @param b The coordinate corresponding to the e1e2 basis bivector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static bivector(b: number, uom?: Unit): Geometric2 {
        return Geometric2.spinor(0, b, uom);
    }


    /**
     * Creates a spinor valued multivector from the specified cartesian coordinates.
     * The spinor returned is in the unlocked (mutable) state.
     * @param a The scalar coordinate.
     * @param b The pseudoscalar coordinate.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static spinor(a: number, b: number, uom?: Unit): Geometric2 {
        return new Geometric2(spinor(a, b), uom);
    }

    /**
     * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
     * @param x The coordinate corresponding to the e1 basis vector.
     * @param y The coordinate corresponding to the e2 basis vector.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    static vector(x: number, y: number, uom?: Unit): Geometric2 {
        return new Geometric2(vector(x, y), uom);
    }

    static copy(mv: GeometricE2): Geometric2 {
        return new Geometric2(coordinates(mv), mv.uom);
    }

    /**
     * @param alpha
     */
    static fromScalar(alpha: Scalar): Geometric2 {
        return new Geometric2(scalar(alpha.a), alpha.uom);
    }

    /**
     * Constructs a Geometric2 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    public static readonly zero = lock(new Geometric2(zero(), void 0));

    /**
     * Constructs a Geometric2 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    public static readonly one = lock(new Geometric2(scalar(1), void 0));

    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly e1 = lock(new Geometric2(vector(1, 0), void 0));

    /**
     * Constructs a basis vector corresponding to the <code>y</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly e2 = lock(new Geometric2(vector(0, 1), void 0));

    /**
     * Constructs a basis vector corresponding to the <code>β</code> coordinate.
     * The returned multivector is locked.
     */
    public static readonly I = lock(new Geometric2(pseudo(1), void 0));

    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    public static readonly meter = lock(new Geometric2(scalar(1), Unit.METER));

    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    public static readonly kilogram = lock(new Geometric2(scalar(1), Unit.KILOGRAM));

    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    public static readonly second = lock(new Geometric2(scalar(1), Unit.SECOND));

    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    public static readonly ampere = lock(new Geometric2(scalar(1), Unit.AMPERE));

    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    public static readonly kelvin = lock(new Geometric2(scalar(1), Unit.KELVIN));

    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    public static readonly mole = lock(new Geometric2(scalar(1), Unit.MOLE));

    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    public static readonly candela = lock(new Geometric2(scalar(1), Unit.CANDELA));

    /**
     * SI derived unit of electric charge, quantity of electricity.
     */
    public static readonly coulomb = lock(new Geometric2(scalar(1), Unit.COULOMB));

    /**
     * SI derived unit of force.
     */
    public static readonly newton = lock(new Geometric2(scalar(1), Unit.NEWTON));

    /**
     * SI derived unit of energy, work, quantity of heat.
     */
    public static readonly joule = lock(new Geometric2(scalar(1), Unit.JOULE));

    /**
     * 
     */
    private readonly coords_: number[];

    /**
     * 
     */
    private modified_: boolean;

    /**
     * The unit of measure.
     * This property should only be changed through the accessors.
     */
    private uom_: Unit;

    /**
     * 
     */
    private lock_ = UNLOCKED;

    /**
     * Do not call this constructor. Use the static construction methods instead.
     * The multivector is constructed in the unlocked (mutable) state.
     */
    constructor(coords: number[] = zero(), uom?: Unit) {
        if (coords.length !== 4) {
            throw new Error("coords.length must be 4");
        }
        this.coords_ = coords;
        this.uom_ = uom;
        this.modified_ = false;
    }

    /**
     * Determines whether this multivector is locked.
     * If the multivector is in the unlocked state then it is mutable.
     * If the multivector is in the locked state then it is immutable.
     */
    public isLocked(): boolean {
        return this.lock_ !== UNLOCKED;
    }

    /**
     * Locks this multivector (preventing any further mutation),
     * and returns a token that may be used to unlock it.
     */
    public lock(): number {
        if (this.lock_ !== UNLOCKED) {
            throw new Error("already locked");
        }
        else {
            this.lock_ = Math.random();
            return this.lock_;
        }
    }

    /**
     * Unlocks this multivector (allowing mutation),
     * using a token that was obtained from a preceding lock method call.
     */
    public unlock(token: number): void {
        if (this.lock_ === UNLOCKED) {
            throw new Error("not locked");
        }
        else if (this.lock_ === token) {
            this.lock_ = UNLOCKED;
        }
        else {
            throw new Error("unlock denied");
        }
    }

    /**
     * Consistently set a coordinate value in the most optimized way.
     * Permits mutation only when the lock status is UNLOCKED.
     * It is safe to use this as an alternative to the named property accessors.
     */
    private setCoordinate(index: number, newValue: number, name: string) {
        if (this.lock_ === UNLOCKED) {
            const coords = this.coords_;
            const previous = coords[index];
            if (newValue !== previous) {
                coords[index] = newValue;
                this.modified_ = true;
            }
        }
        else {
            throw new Error(readOnly(name).message);
        }
    }

    /**
     * The scalar part of this multivector.
     */
    get a(): number {
        return this.coords_[COORD_SCALAR];
    }
    set a(a: number) {
        this.setCoordinate(COORD_SCALAR, a, 'a');
    }

    /**
     * The pseudoscalar part of this multivector.
     */
    get b(): number {
        return this.coords_[COORD_PSEUDO];
    }
    set b(b: number) {
        this.setCoordinate(COORD_PSEUDO, b, 'b');
    }
    get xy(): number {
        return this.coords_[COORD_PSEUDO];
    }
    set xy(xy: number) {
        this.setCoordinate(COORD_PSEUDO, xy, 'xy');
    }

    /**
     * A bitmask describing the grades.
     *
     * 0x0 = zero
     * 0x1 = scalar
     * 0x2 = vector
     * 0x4 = bivector
     * 0x8 = pseudoscalar
     */
    get grades(): number {
        const coords = this.coords_;
        const α = coords[COORD_SCALAR];
        const x = coords[COORD_X];
        const y = coords[COORD_Y];
        const β = coords[COORD_PSEUDO];
        let mask = 0x0;
        if (α !== 0) {
            mask += 0x1;
        }
        if (x !== 0 || y !== 0) {
            mask += 0x2;
        }
        if (β !== 0) {
            mask += 0x4;
        }
        return mask;
    }

    /**
     * The optional unit of measure.
     */
    get uom(): Unit {
        return this.uom_;
    }
    set uom(uom: Unit) {
        if (this.lock_ === UNLOCKED) {
            // This is the only place where we should check the unit of measure.
            // It also should be the only place where we access the private member.
            this.uom_ = Unit.mustBeUnit('uom', uom);
        }
        else {
            throw new Error(readOnly('uom').message);
        }
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
     */
    get x(): number {
        return this.coords_[COORD_X];
    }
    set x(x: number) {
        this.setCoordinate(COORD_X, x, 'x');
    }

    /**
     * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
     */
    get y(): number {
        return this.coords_[COORD_Y];
    }
    set y(y: number) {
        this.setCoordinate(COORD_Y, y, 'y');
    }

    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * @param M The multivector to be added to this multivector.
     * @param α An optional scale factor that multiplies the multivector argument.
     * @returns this + M * α
     */
    add(M: GeometricE2, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().add(M, α));
        }
        else {
            if (this.isZero()) {
                this.a = M.a * α;
                this.x = M.x * α;
                this.y = M.y * α;
                this.b = M.b * α;
                this.uom = M.uom;
                return this;
            }
            else if (isZeroGeometricE2(M)) {
                // α has no effect because M is zero.
                return this;
            }
            else {
                this.a += M.a * α;
                this.x += M.x * α;
                this.y += M.y * α;
                this.b += M.b * α;
                this.uom = Unit.compatible(this.uom, M.uom);
                return this;
            }
        }
    }

    /**
     * @param v The vector to be added to this multivector.
     * @param α An optional scale factor that multiplies the vector argument.
     * @returns this + v * α
     */
    addVector(v: VectorE2, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVectorE2(v)) {
                // α has no effect because v is zero.
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x += v.x * α;
            this.y += v.y * α;
            return this;
        }
    }

    /**
     * @returns copy(this)
     */
    clone(): Geometric2 {
        return Geometric2.copy(this);
    }

    /**
     * <p>
     * <code>this ⟼ copy(M)</code>
     * </p>
     *
     * @param M The multivector to be copied.
     */
    copy(M: GeometricE2): this {
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.b = M.b;
        this.uom = M.uom;
        return this;
    }

    /**
     * <p>
     * <code>this ⟼ copy(B)</code>
     * </p>
     *
     * @param B The bivector to be copied.
     */
    copyBivector(B: BivectorE2): this {
        this.setCoordinate(COORD_SCALAR, 0, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_PSEUDO, B.xy, 'b');
        this.uom = B.uom;
        return this;
    }

    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     * @param uom The unit of measure.
     */
    copyScalar(α: number, uom: Unit): this {
        this.setCoordinate(COORD_SCALAR, α, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        this.uom = uom;
        return this;
    }

    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: VectorE2): this {
        this.setCoordinate(COORD_SCALAR, 0, 'a');
        this.setCoordinate(COORD_X, vector.x, 'x');
        this.setCoordinate(COORD_Y, vector.y, 'y');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        this.uom = vector.uom;
        return this;
    }

    /**
     * @param mutate Must be `true` when calling the `direction` method on an unlocked Geometric3.
     * @returns this / magnitude(this)
     */
    direction(mutate: boolean): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            if (!mutate) {
                return lock(this.clone().direction(true));
            }
            else {
                throw new Error("Unable to mutate this locked Geometric2.");
            }
        }
        else {
            if (mutate) {
                const norm: number = this.magnitudeSansUnits();
                if (norm !== 0) {
                    this.a = this.a / norm;
                    this.x = this.x / norm;
                    this.y = this.y / norm;
                    this.b = this.b / norm;
                }
                this.uom = void 0;
                return this;
            }
            else {
                return lock(this.clone().direction(true));
            }
        }
    }

    /**
     * <p>
     * <code>this ⟼ this / (α * uom)</code>
     * </p>
     *
     * @param α The scalar dividend.
     * @param uom The unit of measure.
     */
    divByScalar(α: number, uom: Unit): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByScalar(α, uom));
        }
        else {
            this.uom = Unit.div(this.uom, uom);
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.b /= α;
            return this;
        }
    }

    /**
     * Computes the inverse of this multivector.
     * TODO: Define what inverse means. 
     * @returns inverse(this)
     */
    inv(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().inv());
        }
        else {
            const α = this.a;
            const x = this.x;
            const y = this.y;
            const β = this.b;

            const A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];

            const b = [1, 0, 0, 0];

            const X = gauss(A, b);

            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.b = X[3];

            this.uom = Unit.inv(this.uom);

            return this;
        }
    }

    /**
     * Determines whether this multivector is exactly 0 (zero).
     */
    isZero(): boolean {
        // It does not matter what the unit of measure is if all the coordinates are zero.
        return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
    }

    /**
     * <p>
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * </p>
     */
    magnitude(mutate: boolean): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            if (!mutate) {
                return lock(this.clone().magnitude(true));
            }
            else {
                throw new Error("Unable to mutate this locked Geometric3.");
            }
        }
        else {
            if (mutate) {
                this.a = Math.sqrt(this.squaredNormSansUnits());
                this.x = 0;
                this.y = 0;
                this.b = 0;
                // The unit of measure is unchanged.
                return this;
            }
            else {
                return lock(this.clone().magnitude(true));
            }
        }
    }

    /**
     * Intentionally undocumented.
     */
    private magnitudeSansUnits(): number {
        return Math.sqrt(this.squaredNormSansUnits());
    }

    public mulByBivector(B: BivectorE2): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByBivector(B));
        }
        else {
            this.uom = Unit.mul(this.uom, B.uom);

            const a = this.a;
            const x = this.x;
            const y = this.y;
            const b = this.b;

            const β = B.xy;

            this.a = - b * β;
            this.x = - y * β;
            this.y = + x * β;
            this.b = a * β;

            return this;
        }
    }

    /**
     * @param α
     * @returns this * α
     */
    mulByNumber(α: number): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByNumber(α));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.b *= α;
            // There is no change in the unit of measure.
            return this;
        }
    }

    /**
     * @param α
     * @param uom
     * @returns this * (α * uom)
     */
    mulByScalar(α: number, uom: Unit): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByScalar(α, uom));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.y *= α;
            this.b *= α;
            this.uom = Unit.mul(this.uom, uom);
            return this;
        }
    }

    public mulByVector(v: VectorE2): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByVector(v));
        }
        else {
            this.uom = Unit.mul(this.uom, v.uom);

            const a0 = this.a;
            const a1 = this.x;
            const a2 = this.y;
            const a4 = this.xy;

            const b1 = v.x;
            const b2 = v.y;

            this.a = a1 * b1 + a2 * b2;
            this.x = a0 * b1 + a4 * b2;
            this.y = a0 * b2 - a4 * b1;
            this.b = a1 * b2 - a2 * b1;

            return this;
        }
    }

    /**
     * @returns this * -1
     */
    neg(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().neg());
        }
        else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.b = -this.b;
            // There is no change in the unit of measure.
            return this;
        }
    }

    /**
     * The quaditude of a multivector is defined in terms of the scalar products
     * of its blades.
     * this ⟼ scp(this, rev(this)) = this | ~this
     */
    quaditude(mutate: boolean): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            if (!mutate) {
                return lock(this.clone().quaditude(true));
            }
            else {
                throw new Error("Unable to mutate this locked Geometric3.");
            }
        }
        else {
            if (mutate) {
                this.a = this.squaredNormSansUnits();
                this.x = 0;
                this.y = 0;
                this.b = 0;
                this.uom = Unit.mul(this.uom, this.uom);
                return this;
            }
            else {
                return lock(this.clone().quaditude(true));
            }
        }
    }

    /**
     * @returns reverse(this)
     */
    rev(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rev());
        }
        else {
            // reverse has a ++-- structure on the grades.
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.b = -this.b;
            // The unit of measure is unchanged.
            return this;
        }
    }

    /**
     * (α + βI)(a + x.e1 + y.e2 + b.I)(α - β.I)
     * 
     * @param spinor the spinor that rotates this multivector.
     * @returns R * this * reverse(R)
     */
    rotate(spinor: SpinorE2): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rotate(spinor));
        }
        else {
            // We are assuming that R is dimensionless.
            Unit.assertDimensionless(spinor.uom);
            const a = this.a;
            const x = this.x;
            const y = this.y;
            const b = this.b;
            const α = spinor.a;
            const β = spinor.xy;
            const α2 = α * α;
            const β2 = β * β;
            const p = α2 - β2;
            const q = 2 * α * β;
            const s = α2 + β2;
            this.a = s * a;
            this.x = p * x + q * y;
            this.y = p * y - q * x;
            this.b = s * b;
            return this;
        }
    }
    /**
     * @param m
     * @returns this | m
     */
    scp(m: GeometricE2): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().scp(m));
        }
        else {
            return this.scp2(this, m);
        }
    }

    /**
     * <p>
     * <code>this ⟼ scp(a, b) = a | b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    scp2(a: GeometricE2, b: GeometricE2): this {
        const a0 = a.a;
        const a1 = a.x;
        const a2 = a.y;
        const a3 = a.b;

        const b0 = b.a;
        const b1 = b.x;
        const b2 = b.y;
        const b3 = b.b;

        const s = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;

        this.a = s;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        this.uom = Unit.mul(a.uom, b.uom);

        return this;
    }

    /**
     * Intentionally undocumented
     */
    private squaredNormSansUnits(): number {
        return this.a * this.a + this.x * this.x + this.y * this.y + this.b * this.b;
    }

    /**
     * @param M
     * @param α
     * @returns this - M * α
     */
    sub(M: GeometricE2, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().sub(M, α));
        }
        else {
            if (this.isZero()) {
                this.uom = M.uom;
            }
            else if (isZeroGeometricE2(M)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, M.uom);
            }
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.b -= M.b * α;
            return this;
        }
    }

    subScalar(M: Scalar, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subScalar(M, α));
        }
        else {
            if (this.isZero()) {
                this.uom = M.uom;
            }
            else {
                this.uom = Unit.compatible(this.uom, M.uom);
            }
            this.a -= M.a * α;
            return this;
        }
    }

    /**
     * @param v The vector to subtract from this multivector.
     * @param α The multiplier for the amount of the vector to subtract.
     * @returns this - v * α
     */
    subVector(v: VectorE2, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVectorE2(v)) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x -= v.x * α;
            this.y -= v.y * α;
            return this;
        }
    }

    writeVector(vector: VectorE2): void {
        vector.x = this.x;
        vector.y = this.y;
        vector.uom = this.uom;
    }

    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    zero(): this {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        // The unit of measure does not matter if all the coordinates are zero.
        return this;
    }

}
