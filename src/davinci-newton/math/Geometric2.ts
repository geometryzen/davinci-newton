import { notImplemented } from '../i18n/notImplemented';
import { readOnly } from "../i18n/readOnly";
import { approx } from "./approx";
import { arraysEQ } from "./arraysEQ";
import { BivectorE2 as Bivector } from "./BivectorE2";
import { gauss } from "./gauss";
import { GeometricE2 as Geometric } from "./GeometricE2";
import { GeometricNumber } from './GeometricNumber';
import { GeometricOperators } from './GeometricOperators';
import { GradeMasked } from "./GradeMasked";
import { isVectorE2 as isVector } from "./isVectorE2";
import { isZeroGeometricE2 as isZeroGeometric } from "./isZeroGeometricE2";
import { isZeroVectorE2 as isZeroVector } from "./isZeroVectorE2";
import { maskG2 as mask } from './maskG2';
import { QQ } from "./QQ";
import { rotorFromDirectionsE2 as rotorFromDirections } from './rotorFromDirectionsE2';
import { Scalar } from "./Scalar";
import { SpinorE2 as Spinor } from "./SpinorE2";
import { stringFromCoordinates } from "./stringFromCoordinates";
import { Unit } from "./Unit";
import { VectorE2 as Vector } from "./VectorE2";

// Symbolic constants for the coordinate indices into the data array.
const COORD_A = 0;
const COORD_X = 1;
const COORD_Y = 2;
const COORD_B = 3;

const BASIS_LABELS = ["1", "e1", "e2", "e12"];
BASIS_LABELS[COORD_A] = '1';
BASIS_LABELS[COORD_X] = 'e1';
BASIS_LABELS[COORD_Y] = 'e2';
BASIS_LABELS[COORD_B] = 'e12';

const zero = function zero(): number[] {
    return [0, 0, 0, 0];
};

const scalar = function scalar(a: number): number[] {
    const coords = zero();
    coords[COORD_A] = a;
    return coords;
};

const vector = function vector(x: number, y: number): number[] {
    const coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    return coords;
};

const bivector = function bivector(b: number): number[] {
    const coords = zero();
    coords[COORD_B] = b;
    return coords;
};

const pseudo = function pseudo(b: number): number[] {
    const coords = zero();
    coords[COORD_B] = b;
    return coords;
};

const spinor = function spinor(a: number, b: number): number[] {
    const coords = zero();
    coords[COORD_A] = a;
    coords[COORD_B] = b;
    return coords;
};

/**
 * Coordinates corresponding to basis labels.
 */
const coordinates = function coordinates(m: Geometric): number[] {
    const coords = zero();
    coords[COORD_A] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_B] = m.b;
    return coords;
};

function isScalar(m: Geometric): boolean {
    return m.x === 0 && m.y === 0 && m.b === 0;
}

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

export class Geometric2 implements GradeMasked, Geometric, GeometricNumber<Geometric2, Geometric2, Spinor, Vector, Geometric2, number, Unit>, GeometricOperators<Geometric2, Unit> {

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

    static copy(mv: Geometric): Geometric2 {
        return new Geometric2(coordinates(mv), mv.uom);
    }

    static fromBivector(B: Bivector): Geometric2 {
        return new Geometric2(bivector(B.xy), B.uom);
    }

    static fromScalar(alpha: Scalar): Geometric2 {
        return new Geometric2(scalar(alpha.a), alpha.uom);
    }

    static fromSpinor(R: Spinor): Geometric2 {
        return new Geometric2(spinor(R.a, R.xy), R.uom);
    }

    static fromVector(v: Vector): Geometric2 {
        return new Geometric2(vector(v.x, v.y), v.uom);
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
    adj(): Geometric2 {
        throw new Error(notImplemented('adj').message);
    }
    isScalar(): boolean {
        return isScalar(this);
    }
    quad(): Geometric2 {
        return new Geometric2([this.squaredNormSansUnits(), 0, 0, 0], Unit.mul(this.uom, this.uom));
    }
    scale(α: number): Geometric2 {
        return new Geometric2([this.a * α, this.x * α, this.y * α, this.b * α], this.uom);
    }
    slerp(target: Geometric2, α: number): Geometric2 {
        throw new Error(notImplemented('slerp').message);
    }
    stress(σ: Vector): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().stress(σ));
        }
        else {
            this.x *= σ.x;
            this.y *= σ.y;
            this.uom = Unit.mul(σ.uom, this.uom);
            // TODO: Action on other components TBD.
            return this;
        }
    }
    __div__(rhs: number | Geometric2): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(this.clone().div(rhs));
        } else if (typeof rhs === 'number') {
            return lock(this.clone().divByNumber(rhs));
        } else {
            const duckR = mask(rhs);
            if (duckR) {
                return lock(this.clone().div(duckR));
            }
            else {
                return void 0;
            }
        }
    }
    __rdiv__(lhs: number | Geometric2): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs, void 0).div(this));
        }
        else {
            return void 0;
        }
    }
    __vbar__(rhs: number | Geometric2): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).scp(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }
    __rvbar__(lhs: number | Geometric2): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    }
    __wedge__(rhs: number | Geometric2): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return lock(Geometric2.copy(this).mulByNumber(rhs));
        }
        else {
            return void 0;
        }
    }
    __rwedge__(lhs: number | Geometric2): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return lock(Geometric2.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    }
    __lshift__(rhs: number | Geometric2): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).lco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }
    __rlshift__(lhs: number | Geometric2): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    }
    __rshift__(rhs: number | Geometric2): Geometric2 {
        if (rhs instanceof Geometric2) {
            return lock(Geometric2.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(Geometric2.copy(this).rco(Geometric2.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }
    __rrshift__(lhs: number | Geometric2): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    }
    __bang__(): Geometric2 {
        return lock(Geometric2.copy(this).inv());
    }
    __eq__(rhs: number | Geometric2): boolean {
        if (rhs instanceof Geometric2) {
            const a0 = this.a;
            const a1 = this.x;
            const a2 = this.y;
            const a3 = this.b;
            const b0 = rhs.a;
            const b1 = rhs.x;
            const b2 = rhs.y;
            const b3 = rhs.b;
            // TODO: Should be equals on Unit, but this is close.
            return a0 === b0 && a1 === b1 && a2 === b2 && a3 === b3 && Unit.isCompatible(this.uom, rhs.uom);
        } else if (typeof rhs === 'number') {
            return false;
        } else {
            return false;
        }
    }
    __ne__(rhs: Geometric2): boolean {
        throw new Error(notImplemented('__ne_').message);
    }
    __ge__(rhs: Geometric2): boolean {
        throw new Error(notImplemented('__ge_').message);
    }
    __gt__(rhs: Geometric2): boolean {
        throw new Error(notImplemented('__gt_').message);
    }
    __le__(rhs: Geometric2): boolean {
        throw new Error(notImplemented('__le_').message);
    }
    __lt__(rhs: Geometric2): boolean {
        throw new Error(notImplemented('__lt_').message);
    }
    __tilde__(): Geometric2 {
        return lock(Geometric2.copy(this).rev());
    }
    __add__(rhs: Geometric2 | Unit): Geometric2 {
        const duckR = mask(rhs);
        if (duckR) {
            return lock(this.clone().add(duckR));
        }
        else if (isVector(rhs)) {
            return lock(this.clone().addVector(rhs));
        }
        else {
            return void 0;
        }
    }
    __radd__(lhs: Geometric2 | Unit): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).add(this));
        }
        else if (isVector(lhs)) {
            return lock(Geometric2.fromVector(lhs).add(this));
        }
        else {
            return void 0;
        }
    }
    __sub__(rhs: Geometric2 | Unit): Geometric2 {
        const duckR = mask(rhs);
        if (duckR) {
            return lock(this.clone().sub(duckR));
        }
        else {
            return void 0;
        }
    }
    __rsub__(lhs: Geometric2 | Unit): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    }
    __pos__(): Geometric2 {
        return lock(Geometric2.copy(this));
    }
    __neg__(): Geometric2 {
        return lock(Geometric2.copy(this).neg());
    }
    __mul__(rhs: any): Geometric2 {
        const duckR = mask(rhs);
        if (duckR) {
            return lock(this.clone().mul(duckR));
        }
        else {
            return void 0;
        }
    }
    __rmul__(lhs: any): Geometric2 {
        if (lhs instanceof Geometric2) {
            return lock(Geometric2.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric2.copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    }
    add2(a: Geometric, b: Geometric): Geometric2 {
        if (isZeroGeometric(a)) {
            this.uom = b.uom;
        }
        else if (isZeroGeometric(b)) {
            this.uom = a.uom;
        }
        else {
            this.uom = Unit.compatible(a.uom, b.uom);
        }
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.b = a.b + b.b;
        return this;
    }
    addPseudo(β: number, uom?: Unit): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addPseudo(β, uom));
        }
        else {
            if (this.isZero()) {
                this.uom = uom;
            }
            else if (β === 0) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, uom);
            }
            this.b += β;
            return this;
        }
    }
    addScalar(α: number, uom?: Unit): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addScalar(α, uom));
        }
        else {
            if (this.isZero()) {
                this.uom = uom;
            }
            else if (α === 0) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, uom);
            }
            this.a += α;
            return this;
        }
    }
    angle(): Geometric2 {
        return this.log().grade(2);
    }
    approx(n: number): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().approx(n));
        }
        else {
            approx(this.coords_, n);
            return this;
        }
    }
    conj(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().conj());
        }
        else {
            this.x = -this.x;
            this.y = -this.y;
            this.b = -this.b;
            return this;
        }
    }
    copySpinor(spinor: Spinor): Geometric2 {
        const a = spinor.a;
        const b = spinor.xy;
        this.setCoordinate(COORD_A, a, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_B, b, 'b');
        this.uom = spinor.uom;
        return this;
    }
    /**
     * @param m The multivector dividend.
     * @returns this / m;
     */
    div(rhs: Geometric): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().div(rhs));
        }
        else {
            if (isScalar(rhs)) {
                return this.divByScalar(rhs.a, rhs.uom);
            } else {
                return this.mul(Geometric2.copy(rhs).inv());
            }
        }
    }
    /**
     * <p>
     * <code>this ⟼ a / b</code>
     * </p>
     *
     * @param a The numerator.
     * @param b The denominator.
     */
    div2(a: Spinor, b: Spinor): Geometric2 {
        throw new Error(notImplemented('div2').message);
    }
    divByNumber(α: number): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByNumber(α));
        }
        else {
            this.a /= α;
            this.x /= α;
            this.y /= α;
            this.b /= α;
            return this;
        }
    }
    divByVector(v: Vector): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByVector(v));
        }
        else {
            const x = v.x;
            const y = v.y;
            const uom2 = Unit.pow(v.uom, QQ.valueOf(2, 1));
            const squaredNorm = x * x + y * y;
            return this.mulByVector(v).divByScalar(squaredNorm, uom2);
        }
    }
    /**
     * dual(m) = I<sub>n</sub> * m = m / I<sub>n</sub>
     *
     * @returns dual(m) or dual(this) if m is undefined.
     */
    dual(m?: Geometric): Geometric2 {
        throw new Error(notImplemented('dual').message);
    }
    equals(other: unknown): boolean {
        if (other instanceof Geometric2) {
            // TODO: Check units of measure.
            return arraysEQ(this.coords_, other.coords_);
        }
        else {
            return false;
        }
    }
    exp(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().exp());
        }
        else {
            Unit.assertDimensionless(this.uom);
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            const expW = Math.exp(this.a);

            // In Geometric3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)

            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            const xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            const φ = Math.sqrt(xy * xy);
            const s = φ !== 0 ? Math.sin(φ) / φ : 1;
            const cosφ = Math.cos(φ);

            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = cosφ;
            this.xy = xy * s;
            return this.mulByNumber(expW);
        }
    }
    /**
     * <p>
     * <code>this ⟼ lhs ^ rhs</code>
     * </p>
     */
    ext2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const a2 = lhs.y;
        const a3 = lhs.b;
        const b0 = rhs.a;
        const b1 = rhs.x;
        const b2 = rhs.y;
        const b3 = rhs.b;
        this.a = a0 * b0;
        this.x = a0 * b1 + a1 * b0;
        this.y = a0 * b2 + a2 * b0;
        this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }
    grade(n: number): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().grade(n));
        }
        else {
            // There is no change to the unit of measure.
            switch (n) {
                case 0: {
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                    break;
                }
                case 1: {
                    this.a = 0;
                    this.b = 0;
                    break;
                }
                case 2: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    break;
                }
                default: {
                    this.a = 0;
                    this.x = 0;
                    this.y = 0;
                    this.b = 0;
                }
            }
            return this;
        }
    }
    isOne(): boolean {
        if (Unit.isOne(this.uom)) {
            return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
        }
        else {
            return false;
        }
    }
    isSpinor(): boolean {
        return this.x === 0 && this.y === 0;
    }
    I(): Geometric2 {
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.b = 1;
        this.uom = void 0;
        return this;
    }
    lco(rhs: Geometric): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lco(rhs));
        }
        else {
            return this.lco2(this, rhs);
        }
    }
    /**
     * <p>
     * <code>this ⟼ lhs << rhs</code>
     * </p>
     *
     * @param a
     * @param b
     */
    lco2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const a2 = lhs.y;
        const a3 = lhs.b;
        const b0 = rhs.a;
        const b1 = rhs.x;
        const b2 = rhs.y;
        const b3 = rhs.b;
        this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        this.x = a0 * b1 - a2 * b3;
        this.y = a0 * b2 + a1 * b3;
        this.b = a0 * b3;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }
    lerp(target: Geometric, α: number): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            if (this.isZero()) {
                this.uom = target.uom;
            }
            else if (isZeroGeometric(target)) {
                // Fall through.
            }
            else {
                this.uom = Unit.compatible(this.uom, target.uom);
            }
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    }
    lerp2(a: Geometric, b: Geometric, α: number): Geometric2 {
        this.copy(a).lerp(b, α);
        return this;
    }
    log(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().log());
        }
        else {
            Unit.assertDimensionless(this.uom);
            if (this.isSpinor()) {
                const α = this.a;
                const β = this.b;
                this.a = Math.log(Math.sqrt(α * α + β * β));
                this.b = Math.atan2(β, α);
                return this;
            } else {
                throw new Error(notImplemented(`log(${this.toString()})`).message);
            }
        }
    }
    norm(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().norm());
        }
        else {
            this.a = this.magnitudeSansUnits();
            this.x = 0;
            this.y = 0;
            this.b = 0;
            // There is no change to the unit of measure.
            return this;
        }
    }
    one(): Geometric2 {
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.b = 0;
        this.uom = void 0;
        return this;
    }
    rco(m: Geometric): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rco(m));
        }
        else {
            return this.rco2(this, m);
        }
    }
    /**
     * <p>
     * <code>this ⟼ lhs >> rhs</code>
     * </p>
     */
    rco2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const a2 = lhs.y;
        const a3 = lhs.b;
        const b0 = rhs.a;
        const b1 = rhs.x;
        const b2 = rhs.y;
        const b3 = rhs.b;
        this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        this.x = - a1 * b0 - a3 * b2;
        this.y = - a2 * b0 + a3 * b1;
        this.b = a3 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }
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
    reflect(n: Vector): this {
        throw new Error(notImplemented('reflect').message);
    }
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
    rotorFromDirections(a: Vector, b: Vector): this {
        rotorFromDirections(a, b, this);
        return this;
    }
    rotorFromFrameToFrame(es: Vector[], fs: Vector[]): Geometric2 {
        throw new Error(notImplemented('rotorFromFrameToFrame').message);
    }
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    rotorFromGeneratorAngle(B: Bivector, θ: number): Geometric2 {
        throw new Error(notImplemented('rotorFromGeneratorAngle').message);
    }
    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b. 
     */
    rotorFromVectorToVector(a: Vector, b: Vector, B: Bivector): Geometric2 {
        throw new Error(notImplemented('rotorFromVectorToVector').message);
    }
    sqrt(): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().sqrt());
        }
        else {
            this.a = Math.sqrt(this.a);
            this.x = 0;
            this.y = 0;
            this.b = 0;
            this.uom = Unit.sqrt(this.uom);
            return this;
        }
    }
    squaredNorm(mutate?: boolean): Geometric2 {
        return this.quaditude(mutate);
    }
    sub2(a: Geometric, b: Geometric): Geometric2 {
        if (isZeroGeometric(a)) {
            this.a = -b.a;
            this.x = -b.x;
            this.y = -b.y;
            this.b = -b.b;
            this.uom = b.uom;
        }
        else if (isZeroGeometric(b)) {
            this.a = a.a;
            this.x = a.x;
            this.y = a.y;
            this.b = a.b;
            this.uom = a.uom;
        }
        else {
            this.a = a.a - b.a;
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.b = a.b - b.b;
            this.uom = Unit.compatible(a.uom, b.uom);
        }
        return this;
    }
    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     * Sets this Geometric3 to the geometric product a * b of the vector arguments.
     */
    versor(a: Vector, b: Vector): this {
        this.a = a.x * b.x + a.y * b.y;
        this.x = 0;
        this.y = 0;
        this.b = a.x * b.y - a.y * b.x;
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
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
        return this.coords_[COORD_A];
    }
    set a(a: number) {
        this.setCoordinate(COORD_A, a, 'a');
    }

    /**
     * The pseudoscalar part of this multivector.
     */
    get b(): number {
        return this.coords_[COORD_B];
    }
    set b(b: number) {
        this.setCoordinate(COORD_B, b, 'b');
    }
    get xy(): number {
        return this.coords_[COORD_B];
    }
    set xy(xy: number) {
        this.setCoordinate(COORD_B, xy, 'xy');
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
        const α = coords[COORD_A];
        const x = coords[COORD_X];
        const y = coords[COORD_Y];
        const β = coords[COORD_B];
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
    add(M: Geometric, α = 1): Geometric2 {
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
            else if (isZeroGeometric(M)) {
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
    addVector(v: Vector, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVector(v)) {
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
    copy(M: Geometric): this {
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
    copyBivector(B: Bivector): this {
        const b = B.xy;
        this.setCoordinate(COORD_A, 0, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_B, b, 'b');
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
        this.setCoordinate(COORD_A, α, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_B, 0, 'b');
        this.uom = uom;
        return this;
    }

    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    copyVector(vector: Vector): this {
        const x = vector.x;
        const y = vector.y;
        this.setCoordinate(COORD_A, 0, 'a');
        this.setCoordinate(COORD_X, x, 'x');
        this.setCoordinate(COORD_Y, y, 'y');
        this.setCoordinate(COORD_B, 0, 'b');
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
     * @param m
     * @returns this ^ m
     */
    ext(m: Geometric): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().ext(m));
        }
        else {
            const a0 = this.a;
            const a1 = this.x;
            const a2 = this.y;
            const a3 = this.b;
            const b0 = m.a;
            const b1 = m.x;
            const b2 = m.y;
            const b3 = m.b;
            this.a = a0 * b0;
            this.x = a0 * b1 + a1 * b0;
            this.y = a0 * b2 + a2 * b0;
            this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
            this.uom = Unit.mul(this.uom, m.uom);
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

    /**
     * @param rhs
     * @returns this * m
     */
    mul(rhs: Geometric): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mul(rhs));
        }
        else {
            return this.mul2(this, rhs);
        }
    }

    /**
     * <p>
     * <code>this ⟼ a * b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    mul2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const a2 = lhs.y;
        const a3 = lhs.b;
        const b0 = rhs.a;
        const b1 = rhs.x;
        const b2 = rhs.y;
        const b3 = rhs.b;
        this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
        this.x = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
        this.y = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
        this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }

    public mulByBivector(B: Bivector): Geometric2 {
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

    public mulByVector(v: Vector): Geometric2 {
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
    rotate(spinor: Spinor): Geometric2 {
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
    scp(m: Geometric): Geometric2 {
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
    scp2(a: Geometric, b: Geometric): this {
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
    sub(M: Geometric, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().sub(M, α));
        }
        else {
            if (this.isZero()) {
                this.uom = M.uom;
            }
            else if (isZeroGeometric(M)) {
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
    subVector(v: Vector, α = 1): Geometric2 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (isZeroVector(v)) {
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

    /**
     * Returns a string representing the number in exponential notation.
     *
     * @param fractionDigits
     * @returns
     */
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * Returns a string representing the number in fixed-point notation.
     *
     * @param fractionDigits
     * @returns
     */
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * @param precision
     * @returns
     */
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    /**
     * Returns a string representation of the number.
     *
     * @param radix
     * @returns
     */
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }

    write(mv: Geometric): void {
        mv.a = this.a;
        mv.x = this.x;
        mv.y = this.y;
        mv.b = this.b;
        mv.uom = this.uom;
    }

    writeVector(vector: Vector): void {
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
        this.uom = void 0;
        return this;
    }
}
