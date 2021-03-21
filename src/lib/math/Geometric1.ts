import { readOnly } from "../i18n/readOnly";
import { GeometricNumber } from "./GeometricNumber";
import { GeometricOperators } from "./GeometricOperators";
import { GradeMasked } from "./GradeMasked";
import { Unit } from "./Unit";
import { SpinorE1 as Spinor } from "./SpinorE1";
import { VectorE1 as Vector } from "./VectorE1";
import { GeometricE1 as Geometric } from "./GeometricE1";
import { notImplemented } from "../i18n/notImplemented";
import { stringFromCoordinates } from "./stringFromCoordinates";
import { gauss } from "./gauss";

/**
 * @hidden
 */
const zero = function (): [number, number] {
    return [0, 0];
};

/**
 * @hidden
 */
const scalar = function scalar(a: number): [number, number] {
    const coords = zero();
    coords[COORD_A] = a;
    return coords;
};

/**
 * @hidden
 */
const vector = function vector(x: number): [number, number] {
    const coords = zero();
    coords[COORD_X] = x;
    return coords;
};

/**
 * @hidden
 */
function copy(mv: Geometric1): Geometric1 {
    return new Geometric1([mv.a, mv.x], mv.uom);
}

/**
 * @hidden
 */
function lock(mv: Geometric1): Geometric1 {
    mv.lock();
    return mv;
}

/**
 * Coordinates corresponding to basis labels.
 * @hidden
 */
const coordinates = function coordinates(m: Geometric): number[] {
    const coords = zero();
    coords[COORD_A] = m.a;
    coords[COORD_X] = m.x;
    return coords;
};

/**
 * @hidden
 */
function isScalar(m: Geometric): boolean {
    return m.x === 0;
}

/**
 * @hidden
 */
const COORD_A = 0;
/**
 * @hidden
 */
const COORD_X = 1;

/**
 * @hidden
 */
const BASIS_LABELS = ["1", "e1"];
BASIS_LABELS[COORD_A] = '1';
BASIS_LABELS[COORD_X] = 'e1';

/**
 * Sentinel value to indicate that the Geometric1 is not locked.
 * UNLOCKED is in the range -1 to 0.
 * @hidden
 */
const UNLOCKED = -1 * Math.random();

export class Geometric1 implements GradeMasked, Geometric, GeometricNumber<Geometric1, Geometric1, Spinor, Vector, Geometric1, number, Unit>, GeometricOperators<Geometric1, Unit> {
    static scalar(a: number, uom?: Unit): Geometric1 {
        return new Geometric1(scalar(a), uom);
    }

    /**
     * Constructs a Geometric1 representing the number zero.
     * The identity element for addition, <b>0</b>.
     * The returned multivector is locked.
     */
    static readonly zero = lock(new Geometric1(zero(), void 0));

    /**
     * Constructs a Geometric1 representing the number one.
     * The identity element for multiplication, <b>1</b>.
     * The returned multivector is locked.
     */
    static readonly one = lock(new Geometric1(scalar(1), void 0));

    /**
     * Constructs a basis vector corresponding to the <code>x</code> coordinate.
     * The returned multivector is locked.
     */
    static readonly e1 = lock(new Geometric1(vector(1), void 0));

    /**
     * SI base unit of length.
     * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
     */
    static readonly meter = lock(new Geometric1(scalar(1), Unit.METER));

    /**
     * SI base unit of mass.
     * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
     */
    static readonly kilogram = lock(new Geometric1(scalar(1), Unit.KILOGRAM));

    /**
     * SI base unit of time.
     * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
     */
    static readonly second = lock(new Geometric1(scalar(1), Unit.SECOND));

    /**
     * SI base unit of electric current.
     * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
     */
    static readonly ampere = lock(new Geometric1(scalar(1), Unit.AMPERE));

    /**
     * SI base unit of thermodynamic temperature.
     * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
     */
    static readonly kelvin = lock(new Geometric1(scalar(1), Unit.KELVIN));

    /**
     * SI base unit of amount of substance.
     * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
     * 
     * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
     */
    static readonly mole = lock(new Geometric1(scalar(1), Unit.MOLE));

    /**
     * SI base unit of luminous intensity.
     * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
     */
    static readonly candela = lock(new Geometric1(scalar(1), Unit.CANDELA));

    /**
     * SI derived unit of electric charge, quantity of electricity.
     */
    static readonly coulomb = lock(new Geometric1(scalar(1), Unit.COULOMB));

    /**
     * SI derived unit of force.
     */
    static readonly newton = lock(new Geometric1(scalar(1), Unit.NEWTON));

    /**
     * SI derived unit of energy, work, quantity of heat.
     */
    static readonly joule = lock(new Geometric1(scalar(1), Unit.JOULE));

    private readonly coords: number[];
    private unit: Unit;

    /**
     * 
     */
    private lock_ = UNLOCKED;

    /**
     * 
     * @param coords 
     * @param uom 
     */
    constructor(coords: [number, number] = zero(), uom?: Unit) {
        if (coords.length !== 2) {
            throw new Error("coords.length must be 2.");
        }
        this.coords = coords;
        this.unit = uom;
    }
    grades: number;
    clone(): Geometric1 {
        return copy(this);
    }
    addScalar(a: number, uom?: Unit, α?: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(copy(this).addScalar(a, uom, α));
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
            this.a += a * α;
            return this;
        }
    }
    adj(): Geometric1 {
        throw new Error("adj Method not implemented.");
    }
    angle(): Geometric1 {
        return this.log().grade(2);
    }
    conj(): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().conj());
        }
        else {
            this.x = -this.x;
            return this;
        }
    }
    copyVector(vector: Vector): this {
        this.a = 0;
        this.x = vector.x;
        this.uom = vector.uom;
        return this;
    }
    lco(rhs: Geometric1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lco(rhs));
        }
        else {
            return this.lco2(this, rhs);
        }
    }
    lco2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const b0 = rhs.a;
        const b1 = rhs.x;
        this.a = a0 * b0 + a1 * b1;
        this.x = a0 * b1;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }
    div(rhs: Geometric1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().div(rhs));
        }
        else {
            if (isScalar(rhs)) {
                return this.divByScalar(rhs.a, rhs.uom);
            } else {
                return this.mul(copy(rhs).inv());
            }
        }
    }
    exp(): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().exp());
        }
        else {
            Unit.assertDimensionless(this.uom);
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            const expW = Math.exp(this.a);

            // In Geometric1 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)

            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.

            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = 1;
            return this.mulByNumber(expW);
        }
    }
    ext(m: Geometric1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().ext(m));
        }
        else {
            const a0 = this.a;
            const a1 = this.x;
            const b0 = m.a;
            const b1 = m.x;
            this.a = a0 * b0;
            this.x = a0 * b1 + a1 * b0;
            this.uom = Unit.mul(this.uom, m.uom);
            return this;
        }
    }
    grade(n: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().grade(n));
        }
        else {
            // There is no change to the unit of measure.
            switch (n) {
                case 0: {
                    this.x = 0;
                    break;
                }
                case 1: {
                    this.a = 0;
                    break;
                }
                case 2: {
                    this.a = 0;
                    this.x = 0;
                    break;
                }
                default: {
                    this.a = 0;
                    this.x = 0;
                }
            }
            return this;
        }
    }
    isScalar(): boolean {
        return isScalar(this);
    }
    isSpinor(): boolean {
        return this.x === 0;
    }
    log(): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().log());
        }
        else {
            Unit.assertDimensionless(this.uom);
            if (this.isSpinor()) {
                const α = this.a;
                this.a = Math.log(Math.sqrt(α * α));
                return this;
            } else {
                throw new Error(notImplemented(`log(${this.toString()})`).message);
            }
        }
    }
    magnitude(mutate: boolean): Geometric1 {
        if (typeof mutate === 'boolean') {
            if (this.isLocked()) {
                if (!mutate) {
                    return lock(this.clone().magnitude(true));
                }
                else {
                    throw new Error(`mutate is ${mutate}, but isMutable() is ${this.isMutable()}.`);
                }
            } else {
                if (mutate) {
                    this.a = Math.sqrt(this.squaredNormSansUnits());
                    this.x = 0;
                    // The unit of measure is unchanged.
                    return this;
                }
                else {
                    return lock(this.clone().magnitude(true));
                }
            }
        } else {
            return this.magnitude(this.isMutable());
        }
    }
    private squaredNormSansUnits(): number {
        return this.a * this.a + this.x * this.x;
    }
    mul(rhs: Geometric1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mul(rhs));
        }
        else {
            return this.mul2(this, rhs);
        }
    }
    mul2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const b0 = rhs.a;
        const b1 = rhs.x;
        this.a = a0 * b0 + a1 * b1;
        this.x = a0 * b1 + a1 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }
    mulByNumber(α: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByNumber(α));
        }
        else {
            this.a *= α;
            this.x *= α;
            // There is no change in the unit of measure.
            return this;
        }
    }
    norm(): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().norm());
        }
        else {
            this.a = this.magnitudeSansUnits();
            this.x = 0;
            // There is no change to the unit of measure.
            return this;
        }
    }
    private magnitudeSansUnits(): number {
        return Math.sqrt(this.squaredNormSansUnits());
    }
    quad(): Geometric1 {
        return new Geometric1([this.squaredNormSansUnits(), 0], Unit.mul(this.uom, this.uom));
    }
    rco(m: Geometric1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rco(m));
        }
        else {
            return this.rco2(this, m);
        }
    }
    rco2(lhs: Geometric, rhs: Geometric): this {
        const a0 = lhs.a;
        const a1 = lhs.x;
        const b0 = rhs.a;
        const b1 = rhs.x;
        this.a = a0 * b0 + a1 * b1;
        this.x = - a1 * b0;
        this.uom = Unit.mul(this.uom, rhs.uom);
        return this;
    }
    rev(mutate?: boolean): Geometric1 {
        if (typeof mutate === 'boolean') {
            if (mutate) {
                if (this.isMutable()) {
                    // reverse has a ++-- structure on the grades.
                    this.a = +this.a;
                    this.x = +this.x;
                    // The unit of measure is unchanged.
                    return this;
                } else {
                    // You can't ask to mutate that which is immutable.
                    throw new Error("Unable to mutate this locked Geometric1.");
                }
            } else {
                return lock(this.clone().rev(true));
            }
        } else {
            return this.rev(this.isMutable());
        }
    }
    squaredNorm(mutate?: boolean): Geometric1 {
        return this.quaditude(mutate);
    }
    quaditude(mutate: boolean): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            if (!mutate) {
                return lock(this.clone().quaditude(true));
            }
            else {
                throw new Error("Unable to mutate this locked Geometric1.");
            }
        }
        else {
            if (mutate) {
                this.a = this.squaredNormSansUnits();
                this.x = 0;
                this.uom = Unit.mul(this.uom, this.uom);
                return this;
            }
            else {
                return lock(this.clone().quaditude(true));
            }
        }
    }
    subScalar(a: number, uom?: Unit, α?: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subScalar(a, uom, α));
        }
        else {
            if (this.isZero()) {
                this.uom = uom;
            }
            else {
                this.uom = Unit.compatible(this.uom, uom);
            }
            this.a -= a * α;
            return this;
        }
    }
    scp(m: Geometric1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().scp(m));
        }
        else {
            return this.scp2(this, m);
        }
    }
    scp2(a: Geometric, b: Geometric): this {
        const a0 = a.a;
        const a1 = a.x;

        const b0 = b.a;
        const b1 = b.x;

        const s = a0 * b0 + a1 * b1;

        this.a = s;
        this.x = 0;
        this.uom = Unit.mul(a.uom, b.uom);

        return this;
    }
    add(M: Geometric1, α?: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().add(M, α));
        }
        else {
            if (this.isZero()) {
                this.a = M.a * α;
                this.x = M.x * α;
                this.uom = M.uom;
                return this;
            }
            else if (M.isZero()) {
                // α has no effect because M is zero.
                return this;
            }
            else {
                this.a += M.a * α;
                this.x += M.x * α;
                this.uom = Unit.compatible(this.uom, M.uom);
                return this;
            }
        }
    }
    addVector(v: Vector, α = 1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().addVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (v.x === 0) {
                // α has no effect because v is zero.
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x += v.x * α;
            return this;
        }
    }
    subVector(v: Vector, α = 1): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().subVector(v, α));
        }
        else {
            if (this.isZero()) {
                this.uom = v.uom;
            }
            else if (v.x === 0) {
                // α has no effect because v is zero.
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, v.uom);
            }
            this.x -= v.x * α;
            return this;
        }
    }
    divByScalar(α: number, uom: Unit): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByScalar(α, uom));
        }
        else {
            this.uom = Unit.div(this.uom, uom);
            this.a /= α;
            this.x /= α;
            return this;
        }
    }
    lerp(target: Geometric1, α: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().lerp(target, α));
        }
        else {
            if (this.isZero()) {
                this.uom = target.uom;
            }
            else if (target.isZero()) {
                // Fall through.
            }
            else {
                this.uom = Unit.compatible(this.uom, target.uom);
            }
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            return this;
        }
    }
    scale(α: number): Geometric1 {
        return new Geometric1([this.a * α, this.x * α], this.uom);
    }
    reflect(n: Vector): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().reflect(n));
        }
        else {
            const nx = n.x;
            const nu = n.uom;
            const a = this.a;
            const x = this.x;
            const u = this.uom;

            const nx2 = nx * nx;
            const μ = nx2;
            const β = nx2;

            // The scalar component picks up a minus sign and the factor |n||n|.
            this.a = -β * a;
            this.x = - μ * x;
            // In most cases, n SHOULD be dimensionless.
            this.uom = Unit.mul(nu, Unit.mul(u, nu));
            return this;
        }
    }
    rotate(spinor: Spinor): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().rotate(spinor));
        }
        else {
            // We are assuming that R is dimensionless.
            Unit.assertDimensionless(spinor.uom);
            const a = this.a;
            const x = this.x;
            const α = spinor.a;
            const α2 = α * α;
            const p = α2;
            const s = α2;
            this.a = s * a;
            this.x = p * x;
            return this;
        }
    }
    slerp(target: Geometric1, α: number): Geometric1 {
        throw new Error(notImplemented('slerp').message);
    }
    stress(σ: Vector): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().stress(σ));
        }
        else {
            this.x *= σ.x;
            this.uom = Unit.mul(σ.uom, this.uom);
            // TODO: Action on other components TBD.
            return this;
        }
    }
    sub(M: Geometric1, α?: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().sub(M, α));
        }
        else {
            if (this.isZero()) {
                this.uom = M.uom;
            }
            else if (M.isZero()) {
                return this;
            }
            else {
                this.uom = Unit.compatible(this.uom, M.uom);
            }
            this.a -= M.a * α;
            this.x -= M.x * α;
            return this;
        }
    }
    toExponential(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }
    toFixed(fractionDigits?: number): string {
        const coordToString = function (coord: number): string { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }
    toPrecision(precision?: number): string {
        const coordToString = function (coord: number): string { return coord.toPrecision(precision); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }
    toString(radix?: number): string {
        const coordToString = function (coord: number): string { return coord.toString(radix); };
        return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
    }
    zero(): Geometric1 {
        if (this.isMutable()) {
            this.a = 0;
            this.x = 0;
            this.uom = Unit.ONE;
            return this;
        } else {
            return lock(copy(this).zero());
        }
    }
    /**
     * @hidden 
     */
    __div__(rhs: any): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(this.clone().div(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().divByNumber(rhs));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().divByScalar(1, rhs));
        }
        else {
            return void 0;
        }
    }
    divByNumber(α: number): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().divByNumber(α));
        }
        else {
            this.a /= α;
            this.x /= α;
            return this;
        }
    }
    /**
     * @hidden 
     */
    __rdiv__(lhs: any): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric1.scalar(lhs, void 0).div(this));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __vbar__(rhs: any): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(copy(this).scp(Geometric1.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rvbar__(lhs: any): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric1.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __wedge__(rhs: any): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return lock(copy(this).mulByNumber(rhs));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rwedge__(lhs: any): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return lock(copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __lshift__(rhs: any): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(copy(this).lco(Geometric1.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rlshift__(lhs: any): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric1.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rshift__(rhs: any): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(copy(this).rco(Geometric1.scalar(rhs)));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rrshift__(lhs: any): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric1.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __bang__(): Geometric1 {
        return lock(copy(this).inv());
    }
    inv(): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().inv());
        }
        else {
            const α = this.a;
            const x = this.x;

            const A = [
                [α, x],
                [x, α]
            ];

            const b = [1, 0];

            const X = gauss(A, b);

            this.a = X[0];
            this.x = X[1];

            this.uom = Unit.inv(this.uom);

            return this;
        }
    }
    /**
     * @hidden 
     */
    __eq__(rhs: number | Geometric1): boolean {
        if (rhs instanceof Geometric1) {
            const a0 = this.a;
            const a1 = this.x;
            const b0 = rhs.a;
            const b1 = rhs.x;
            // TODO: Should be equals on Unit, but this is close.
            return a0 === b0 && a1 === b1 && Unit.isCompatible(this.uom, rhs.uom);
        } else if (typeof rhs === 'number') {
            return false;
        } else {
            return false;
        }
    }
    /**
     * @hidden 
     */
    __ne__(rhs: Geometric1): boolean {
        throw new Error(notImplemented('__ne_').message);
    }
    /**
     * @hidden 
     */
    __ge__(rhs: Geometric1): boolean {
        throw new Error(notImplemented('__ge_').message);
    }
    /**
     * @hidden 
     */
    __gt__(rhs: Geometric1): boolean {
        throw new Error(notImplemented('__gt_').message);
    }
    /**
     * @hidden 
     */
    __le__(rhs: Geometric1): boolean {
        throw new Error(notImplemented('__le_').message);
    }
    /**
     * @hidden 
     */
    __lt__(rhs: Geometric1): boolean {
        throw new Error(notImplemented('__lt_').message);
    }
    /**
     * @hidden 
     */
    __tilde__(): Geometric1 {
        return lock(copy(this).rev(true));
    }
    /**
     * @hidden 
     */
    __add__(rhs: Unit | Geometric1): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(this.clone().add(rhs));
        }
        else if (typeof rhs === 'number') {
            return lock(this.clone().addScalar(rhs, void 0, 1));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().addScalar(1, rhs, 1));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __radd__(lhs: Unit | Geometric1): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric1.scalar(lhs).add(this));
        }
        else if (lhs instanceof Unit) {
            return lock(Geometric1.scalar(1, lhs).add(this));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __sub__(rhs: Unit | Geometric1): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(this.clone().sub(rhs));
        }
        else if (typeof rhs === 'number') {

            return lock(this.clone().subScalar(rhs, void 0, 1));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().subScalar(1, rhs, 1));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rsub__(lhs: Unit | Geometric1): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return lock(Geometric1.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __pos__(): Geometric1 {
        return lock(copy(this));
    }
    /**
     * @hidden 
     */
    __neg__(): Geometric1 {
        return lock(copy(this).neg());
    }
    neg(): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().neg());
        }
        else {
            this.a = -this.a;
            this.x = -this.x;
            // There is no change in the unit of measure.
            return this;
        }
    }
    isZero(): boolean {
        return this.coords[COORD_A] === 0 && this.coords[COORD_X] === 0;
    }
    /**
     * @hidden 
     */
    __mul__(rhs: any): Geometric1 {
        if (rhs instanceof Geometric1) {
            return lock(this.clone().mul(rhs));
        } else if (typeof rhs === 'number') {
            return lock(this.clone().mulByNumber(rhs));
        }
        else if (rhs instanceof Unit) {
            return lock(this.clone().mulByScalar(1, rhs));
        }
        else {
            return void 0;
        }
    }
    /**
     * @hidden 
     */
    __rmul__(lhs: any): Geometric1 {
        if (lhs instanceof Geometric1) {
            return lock(copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            // The ordering of operands is not important for scalar multiplication.
            return lock(copy(this).mulByNumber(lhs));
        }
        else {
            return void 0;
        }
    }
    mulByScalar(α: number, uom?: Unit): Geometric1 {
        if (this.lock_ !== UNLOCKED) {
            return lock(this.clone().mulByScalar(α, uom));
        }
        else {
            this.a *= α;
            this.x *= α;
            this.uom = Unit.mul(this.uom, uom);
            return this;
        }
    }
    isOne(): boolean {
        return this.coords[COORD_A] === 1 && this.coords[COORD_X] === 0 && Unit.isOne(this.unit);
    }

    get a(): number {
        return this.coords[COORD_A];
    }
    set a(a: number) {
        if (this.isMutable()) {
            this.coords[COORD_A] = a;
        }
        else {
            throw new Error(readOnly('a').message);
        }
    }

    get x(): number {
        return this.coords[COORD_X];
    }
    set x(x: number) {
        if (this.isMutable()) {
            this.coords[COORD_X] = x;
        }
        else {
            throw new Error(readOnly('x').message);
        }
    }

    get uom(): Unit {
        return this.unit;
    }
    set uom(uom: Unit) {
        if (this.isMutable()) {
            this.unit = uom;
        }
        else {
            throw new Error(readOnly('uom').message);
        }
    }

    /**
     * Determines whether this multivector is locked.
     * If the multivector is in the unlocked state then it is mutable.
     * If the multivector is in the locked state then it is immutable.
     */
    isLocked(): boolean {
        return this.lock_ !== UNLOCKED;
    }

    isMutable(): boolean {
        return this.lock_ === UNLOCKED;
    }

    /**
     * Locks this multivector (preventing any further mutation),
     * and returns a token that may be used to unlock it.
     */
    lock(): number {
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
    unlock(token: number): void {
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
}
