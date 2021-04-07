import { readOnly } from "../i18n/readOnly";
import { AbstractGeometric } from "./AbstractGeometric";
import { GeometricM21 } from "./GeometricM21";
import { GeometricNumber } from "./GeometricNumber";
import { GeometricOperators } from "./GeometricOperators";
import { GradeMasked } from "./GradeMasked";
import { SpinorM21 as Spinor } from './SpinorM21';
import { stringFromCoordinates } from "./stringFromCoordinates";
import { Unit } from "./Unit";
import { VectorM21 as Vector } from './VectorM21';

/**
 * @hidden
 */
const COORD_0_A = 0;
/**
 * @hidden
 */
const COORD_1_T = 1;
/**
 * @hidden
 */
const COORD_2_X = 2;
/**
 * @hidden
 */
const COORD_3_TX = 3;
/**
 * @hidden
 */
const COORD_4_Y = 4;
/**
 * @hidden
 */
const COORD_5_TY = 5;
/**
 * @hidden
 */
const COORD_6_XY = 6;
/**
 * @hidden
 */
const COORD_7_B = 7;

/**
 * Coordinates corresponding to basis labels.
 * @hidden
 */
const coordinates = function (m: GeometricM21): [a: number, t: number, x: number, tx: number, y: number, ty: number, xy: number, b: number] {
    const coords: [number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0];
    coords[COORD_0_A] = m.a;
    coords[COORD_1_T] = m.t;
    coords[COORD_2_X] = m.x;
    coords[COORD_3_TX] = m.tx;
    coords[COORD_4_Y] = m.y;
    coords[COORD_5_TY] = m.ty;
    coords[COORD_6_XY] = m.xy;
    coords[COORD_7_B] = m.b;
    return coords;
};

/**
 * @hidden
 */
const BASIS_LABELS: ['1', 'γ0', 'γ1', 'γ0γ1', 'γ2', 'γ0γ2', 'γ1γ2', 'I'] = ["1", "γ0", "γ1", "γ0γ1", "γ2", "γ0γ2", "γ1γ2", "I"];

/**
 * diag(+--)
 */
export class Spacetime2 extends AbstractGeometric implements GradeMasked, GeometricM21, GeometricNumber<Spacetime2, Spacetime2, Spinor, Vector>, GeometricOperators<Spacetime2> {
    static readonly zero = new Spacetime2().permlock();
    static readonly one = new Spacetime2(1).permlock();
    static readonly γ0 = new Spacetime2(0, 1).permlock();
    static readonly γ1 = new Spacetime2(0, 0, 1).permlock();
    static readonly γ0γ1 = new Spacetime2(0, 0, 0, 1).permlock();
    static readonly γ2 = new Spacetime2(0, 0, 0, 0, 1).permlock();
    static readonly γ0γ2 = new Spacetime2(0, 0, 0, 0, 0, 1).permlock();
    static readonly γ1γ2 = new Spacetime2(0, 0, 0, 0, 0, 0, 1).permlock();
    static readonly I = new Spacetime2(0, 0, 0, 0, 0, 0, 0, 1).permlock();
    /**
     * a
     */
    private $M000: number;
    /**
     * t
     */
    private $M001: number;
    /**
     * x
     */
    private $M010: number;
    /**
     * tx
     */
    private $M011: number;
    /**
     * y
     */
    private $M100: number;
    /**
     * ty
     */
    private $M101: number;
    /**
     * xy
     */
    private $M110: number;
    /**
     * b
     */
    private $M111: number;
    constructor(a = 0, t = 0, x = 0, tx = 0, y = 0, ty = 0, xy = 0, b = 0, uom?: Unit) {
        super(uom);
        this.$M000 = a;
        this.$M001 = t;
        this.$M010 = x;
        this.$M011 = tx;
        this.$M100 = y;
        this.$M101 = ty;
        this.$M110 = xy;
        this.$M111 = b;
    }
    get a(): number {
        return this.$M000;
    }
    set a(a: number) {
        if (this.isMutable()) {
            this.$M000 = a;
        } else {
            throw new Error(readOnly('a').message);
        }
    }
    get t(): number {
        return this.$M001;
    }
    set t(t: number) {
        if (this.isMutable()) {
            this.$M001 = t;
        } else {
            throw new Error(readOnly('t').message);
        }
    }
    get x(): number {
        return this.$M010;
    }
    set x(x: number) {
        if (this.isMutable()) {
            this.$M010 = x;
        } else {
            throw new Error(readOnly('x').message);
        }
    }
    get tx(): number {
        return this.$M011;
    }
    set tx(tx: number) {
        if (this.isMutable()) {
            this.$M011 = tx;
        } else {
            throw new Error(readOnly('tx').message);
        }
    }
    get y(): number {
        return this.$M100;
    }
    set y(y: number) {
        if (this.isMutable()) {
            this.$M100 = y;
        } else {
            throw new Error(readOnly('y').message);
        }
    }
    get ty(): number {
        return this.$M101;
    }
    set ty(ty: number) {
        if (this.isMutable()) {
            this.$M101 = ty;
        } else {
            throw new Error(readOnly('ty').message);
        }
    }
    get xy(): number {
        return this.$M110;
    }
    set xy(xy: number) {
        if (this.isMutable()) {
            this.$M110 = xy;
        } else {
            throw new Error(readOnly('xy').message);
        }
    }
    get b(): number {
        return this.$M111;
    }
    set b(b: number) {
        if (this.isMutable()) {
            this.$M111 = b;
        } else {
            throw new Error(readOnly('b').message);
        }
    }
    get grades(): number {
        let mask = 0x0;
        if (this.$M000 !== 0) {
            mask += 0x1;
        }
        if (this.t !== 0 || this.x !== 0 || this.y !== 0) {
            mask += 0x2;
        }
        if (this.tx !== 0 || this.ty !== 0 || this.xy !== 0) {
            mask += 0x4;
        }
        if (this.b !== 0) {
            mask += 0x8;
        }
        return mask;
    }
    add(rhs: Spacetime2, α = 1): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().add(rhs, α).permlock();
        } else {
            if (this.isZero()) {
                this.a = rhs.a * α;
                this.t = rhs.t * α;
                this.x = rhs.x * α;
                this.tx = rhs.tx * α;
                this.y = rhs.y * α;
                this.ty = rhs.ty * α;
                this.xy = rhs.xy * α;
                this.b = rhs.b * α;
                this.uom = rhs.uom;
                return this;
            }
            else if (rhs.isZero() || α === 0) {
                return this;
            }
            else {
                this.a += rhs.a * α;
                this.t += rhs.t * α;
                this.x += rhs.x * α;
                this.tx += rhs.tx * α;
                this.y += rhs.y * α;
                this.ty += rhs.ty * α;
                this.xy += rhs.xy * α;
                this.b += rhs.b * α;
                this.uom = Unit.compatible(this.uom, rhs.uom);
                return this;
            }
        }
    }
    addScalar(a: number, uom?: Unit, α?: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    angle(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    clone(): Spacetime2 {
        return new Spacetime2(this.a, this.t, this.x, this.tx, this.y, this.ty, this.xy, this.b, this.uom);
    }
    conj(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    div(rhs: Spacetime2): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    exp(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    ext(rhs: Spacetime2): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().ext(rhs).permlock();
        } else {
            const L000 = this.$M000;
            const L001 = this.$M001;
            const L010 = this.$M010;
            const L011 = this.$M011;
            const L100 = this.$M100;
            const L101 = this.$M101;
            const L110 = this.$M110;
            const L111 = this.$M111;

            const R000 = rhs.$M000;
            const R001 = rhs.$M001;
            const R010 = rhs.$M010;
            const R011 = rhs.$M011;
            const R100 = rhs.$M100;
            const R101 = rhs.$M101;
            const R110 = rhs.$M110;
            const R111 = rhs.$M111;

            this.$M000 = L000 * R000;
            this.$M001 = L000 * R001 + L001 * R000;
            this.$M010 = L000 * R010 + L010 * R000;
            this.$M011 = L000 * R011 + L001 * R010 - L010 * R001 + L011 * R000;
            this.$M100 = L000 * R100 + L100 * R000;
            this.$M101 = L000 * R101 + L001 * R100 - L100 * R001 + L101 * R000;
            this.$M110 = L000 * R110 + L010 * R100 - L100 * R010 + L110 * R000;
            this.$M111 = L000 * R111 + L001 * R110 - L010 * R101 + L011 * R100 + L100 * R011 - L101 * R010 + L110 * R001 + L111 * R000;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        }
    }
    grade(grade: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    inv(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    isOne(): boolean {
        return this.a === 1 && this.t === 0 && this.x === 0 && this.tx === 0 && this.y === 0 && this.ty === 0 && this.xy === 0 && this.b === 0 && Unit.isOne(this.uom);
    }
    isScalar(): boolean {
        throw new Error("Method not implemented.");
    }
    isSpinor(): boolean {
        throw new Error("Method not implemented.");
    }
    isVector(): boolean {
        throw new Error("Method not implemented.");
    }
    isBivector(): boolean {
        throw new Error("Method not implemented.");
    }
    isZero(): boolean {
        return this.a === 0 && this.t === 0 && this.x === 0 && this.tx === 0 && this.y === 0 && this.ty === 0 && this.xy === 0 && this.b === 0;
    }
    lco(rhs: Spacetime2): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().lco(rhs).permlock();
        } else {
            const L000 = this.$M000;
            const L001 = this.$M001;
            const L010 = this.$M010;
            const L011 = this.$M011;
            const L100 = this.$M100;
            const L101 = this.$M101;
            const L110 = this.$M110;
            const L111 = this.$M111;

            const R000 = rhs.$M000;
            const R001 = rhs.$M001;
            const R010 = rhs.$M010;
            const R011 = rhs.$M011;
            const R100 = rhs.$M100;
            const R101 = rhs.$M101;
            const R110 = rhs.$M110;
            const R111 = rhs.$M111;

            this.$M000 = L000 * R000 + L001 * R001 - L010 * R010 + L011 * R011 - L100 * R100 + L101 * R101 - L110 * R110 - L111 * R111;
            this.$M001 = L000 * R001 + L010 * R011 + L100 * R101 - L110 * R111;
            this.$M010 = L000 * R010 + L001 * R011 + L100 * R110 - L101 * R111;
            this.$M011 = L000 * R011 - L100 * R111;
            this.$M100 = L000 * R100 + L001 * R101 - L010 * R110 + L011 * R111;
            this.$M101 = L000 * R101 + L010 * R111;
            this.$M110 = L000 * R110 + L001 * R111;
            this.$M111 = L000 * R111;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        }
    }
    log(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    mul(rhs: Spacetime2): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().mul(rhs).permlock();
        } else {
            const L000 = this.$M000;
            const L001 = this.$M001;
            const L010 = this.$M010;
            const L011 = this.$M011;
            const L100 = this.$M100;
            const L101 = this.$M101;
            const L110 = this.$M110;
            const L111 = this.$M111;

            const R000 = rhs.$M000;
            const R001 = rhs.$M001;
            const R010 = rhs.$M010;
            const R011 = rhs.$M011;
            const R100 = rhs.$M100;
            const R101 = rhs.$M101;
            const R110 = rhs.$M110;
            const R111 = rhs.$M111;

            this.$M000 = L000 * R000 + L001 * R001 - L010 * R010 + L011 * R011 - L100 * R100 + L101 * R101 - L110 * R110 - L111 * R111;
            this.$M001 = L000 * R001 + L001 * R000 + L010 * R011 - L011 * R010 + L100 * R101 - L101 * R100 - L110 * R111 - L111 * R110;
            this.$M010 = L000 * R010 + L010 * R000 + L001 * R011 - L011 * R001 + L100 * R110 - L101 * R111 - L110 * R100 - L111 * R101;
            this.$M011 = L000 * R011 + L001 * R010 - L010 * R001 + L011 * R000 - L100 * R111 + L101 * R110 - L110 * R101 - L111 * R100;
            this.$M100 = L000 * R100 + L001 * R101 - L010 * R110 + L011 * R111 + L100 * R000 - L101 * R001 + L110 * R010 + L111 * R011;
            this.$M101 = L000 * R101 + L001 * R100 + L010 * R111 - L011 * R110 - L100 * R001 + L101 * R000 + L110 * R011 + L111 * R010;
            this.$M110 = L000 * R110 + L001 * R111 + L010 * R100 - L011 * R101 - L100 * R010 + L101 * R011 + L110 * R000 + L111 * R001;
            this.$M111 = L000 * R111 + L001 * R110 - L010 * R101 + L011 * R100 + L100 * R011 - L101 * R010 + L110 * R001 + L111 * R000;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        }
    }
    magnitude(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    magnitudeNoUnits(): number {
        throw new Error("Method not implemented.");
    }
    quaditude(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    quaditudeNoUnits(): number {
        throw new Error("Method not implemented.");
    }
    rco(rhs: Spacetime2): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().rco(rhs).permlock();
        } else {
            const L000 = this.$M000;
            const L001 = this.$M001;
            const L010 = this.$M010;
            const L011 = this.$M011;
            const L100 = this.$M100;
            const L101 = this.$M101;
            const L110 = this.$M110;
            const L111 = this.$M111;

            const R000 = rhs.$M000;
            const R001 = rhs.$M001;
            const R010 = rhs.$M010;
            const R011 = rhs.$M011;
            const R100 = rhs.$M100;
            const R101 = rhs.$M101;
            const R110 = rhs.$M110;
            const R111 = rhs.$M111;

            this.$M000 = L000 * R000 + L001 * R001 - L010 * R010 + L011 * R011 - L100 * R100 + L101 * R101 - L110 * R110 - L111 * R111;
            this.$M001 = L001 * R000 - L011 * R010 - L101 * R100 - L111 * R110;
            this.$M010 = L010 * R000 - L011 * R001 - L110 * R100 - L111 * R101;
            this.$M011 = L011 * R000 - L111 * R100;
            this.$M100 = L100 * R000 - L101 * R001 + L110 * R010 + L111 * R011;
            this.$M101 = L101 * R000 + L111 * R010;
            this.$M110 = L110 * R000 + L111 * R001;
            this.$M111 = L111 * R000;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        }
    }
    rev(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    subScalar(a: number, uom?: Unit, α?: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    scp(rhs: Spacetime2): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().scp(rhs).permlock();
        } else {
            const L000 = this.$M000;
            const L001 = this.$M001;
            const L010 = this.$M010;
            const L011 = this.$M011;
            const L100 = this.$M100;
            const L101 = this.$M101;
            const L110 = this.$M110;
            const L111 = this.$M111;

            const R000 = rhs.$M000;
            const R001 = rhs.$M001;
            const R010 = rhs.$M010;
            const R011 = rhs.$M011;
            const R100 = rhs.$M100;
            const R101 = rhs.$M101;
            const R110 = rhs.$M110;
            const R111 = rhs.$M111;

            this.$M000 = L000 * R000 + L001 * R001 - L010 * R010 + L011 * R011 - L100 * R100 + L101 * R101 - L110 * R110 - L111 * R111;
            this.$M001 = 0;
            this.$M010 = 0;
            this.$M011 = 0;
            this.$M100 = 0;
            this.$M101 = 0;
            this.$M110 = 0;
            this.$M111 = 0;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        }
    }
    divByScalar(α: number, uom: Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    lerp(target: Spacetime2, α: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    scale(α: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    neg(): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().neg().permlock();
        } else {
            this.a = -this.a;
            this.t = -this.t;
            this.x = -this.x;
            this.tx = -this.tx;
            this.y = -this.y;
            this.ty = -this.ty;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    }
    reflect(n: Vector): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    rotate(rotor: Spinor): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    slerp(target: Spacetime2, α: number): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    stress(σ: Vector): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    sub(rhs: Spacetime2, α = 1): Spacetime2 {
        if (this.isLocked()) {
            return this.clone().sub(rhs, α).permlock();
        } else {
            if (this.isZero()) {
                this.a = -rhs.a * α;
                this.t = -rhs.t * α;
                this.x = -rhs.x * α;
                this.tx = -rhs.tx * α;
                this.y = -rhs.y * α;
                this.ty = -rhs.ty * α;
                this.xy = -rhs.xy * α;
                this.b = -rhs.b * α;
                this.uom = rhs.uom;
                return this;
            }
            else if (rhs.isZero() || α === 0) {
                return this;
            }
            else {
                this.a -= rhs.a * α;
                this.t -= rhs.t * α;
                this.x -= rhs.x * α;
                this.tx -= rhs.tx * α;
                this.y -= rhs.y * α;
                this.ty -= rhs.ty * α;
                this.xy -= rhs.xy * α;
                this.b -= rhs.b * α;
                this.uom = Unit.compatible(this.uom, rhs.uom);
                return this;
            }
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
    /**
     * @hidden
     */
    __div__(rhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rdiv__(lhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __vbar__(rhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rvbar__(lhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __wedge__(rhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rwedge__(lhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __lshift__(rhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rlshift__(lhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rshift__(rhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rrshift__(lhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __bang__(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __eq__(rhs: number | Spacetime2 | Unit): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __ne__(rhs: number | Spacetime2 | Unit): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __ge__(rhs: number | Spacetime2 | Unit): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __gt__(rhs: number | Spacetime2 | Unit): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __le__(rhs: number | Spacetime2 | Unit): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __lt__(rhs: number | Spacetime2 | Unit): boolean {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __tilde__(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __add__(other: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __radd__(other: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __sub__(other: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rsub__(other: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __pos__(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __neg__(): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __mul__(rhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
    /**
     * @hidden
     */
    __rmul__(lhs: number | Spacetime2 | Unit): Spacetime2 {
        throw new Error("Method not implemented.");
    }
}
