import { readOnly } from "../i18n/readOnly";
import { GeometricNumber } from "./GeometricNumber";
import { GeometricOperators } from "./GeometricOperators";
import { GradeMasked } from "./GradeMasked";
import { Unit } from "./Unit";
import { SpinorE1 as Spinor } from "./SpinorE1";
import { VectorE1 as Vector } from "./VectorE1";
import { GeometricE1 as Geometric } from "./GeometricE1";

/**
 * @hidden
 */
const zero = function (): number[] {
    return [0, 0];
};

function copy(mv: Geometric1): Geometric1 {
    return new Geometric1([mv.a, mv.x], mv.uom);
}

function lock(mv: Geometric1): Geometric1 {
    mv.lock();
    return mv;
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
 * Sentinel value to indicate that the Geometric2 is not locked.
 * UNLOCKED is in the range -1 to 0.
 * @hidden
 */
const UNLOCKED = -1 * Math.random();

export class Geometric1 implements GradeMasked, Geometric, GeometricNumber<Geometric1, Geometric1, Spinor, Vector, Geometric1, number, Unit>, GeometricOperators<Geometric1, Unit> {
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
    constructor(coords: number[] = zero(), uom?: Unit) {
        if (coords.length !== 2) {
            throw new Error("coords.length must be 2.");
        }
        this.coords = coords;
        this.unit = uom;
    }
    grades: number;
    addScalar(a: number, uom?: Unit, α?: number): Geometric1 {
        throw new Error("addScalar Method not implemented.");
    }
    adj(): Geometric1 {
        throw new Error("adj Method not implemented.");
    }
    angle(): Geometric1 {
        throw new Error("angle Method not implemented.");
    }
    conj(): Geometric1 {
        throw new Error("conj Method not implemented.");
    }
    lco(rhs: Geometric1): Geometric1 {
        throw new Error("lco Method not implemented.");
    }
    div(rhs: Geometric1): Geometric1 {
        throw new Error("div Method not implemented.");
    }
    exp(): Geometric1 {
        throw new Error("exp Method not implemented.");
    }
    ext(rhs: Geometric1): Geometric1 {
        throw new Error("ext Method not implemented.");
    }
    grade(grade: number): Geometric1 {
        throw new Error("grade Method not implemented.");
    }
    isScalar(): boolean {
        throw new Error("isScalar Method not implemented.");
    }
    log(): Geometric1 {
        throw new Error("log Method not implemented.");
    }
    magnitude(mutate: boolean): Geometric1 {
        throw new Error("magnitude Method not implemented.");
    }
    mul(rhs: Geometric1): Geometric1 {
        throw new Error("mul Method not implemented.");
    }
    norm(): Geometric1 {
        throw new Error("norm Method not implemented.");
    }
    quad(): Geometric1 {
        throw new Error("quad Method not implemented.");
    }
    rco(rhs: Geometric1): Geometric1 {
        throw new Error("rco Method not implemented.");
    }
    rev(): Geometric1 {
        throw new Error("rev Method not implemented.");
    }
    squaredNorm(): Geometric1 {
        throw new Error("squaredNorm Method not implemented.");
    }
    subScalar(a: number, uom?: Unit, α?: number): Geometric1 {
        throw new Error("suScalar Method not implemented.");
    }
    scp(rhs: Geometric1): Geometric1 {
        throw new Error("scp Method not implemented.");
    }
    add(rhs: Geometric1, α?: number): Geometric1 {
        throw new Error("add Method not implemented.");
    }
    divByScalar(α: number, uom: Unit): Geometric1 {
        throw new Error("divByScalar Method not implemented.");
    }
    lerp(target: Geometric1, α: number): Geometric1 {
        throw new Error("lerp Method not implemented.");
    }
    scale(α: number): Geometric1 {
        throw new Error("scale Method not implemented.");
    }
    reflect(n: Vector): Geometric1 {
        throw new Error("reflect Method not implemented.");
    }
    rotate(rotor: Spinor): Geometric1 {
        throw new Error("rotate Method not implemented.");
    }
    slerp(target: Geometric1, α: number): Geometric1 {
        throw new Error("slerp Method not implemented.");
    }
    stress(σ: Vector): Geometric1 {
        throw new Error("stress Method not implemented.");
    }
    sub(rhs: Geometric1, α?: number): Geometric1 {
        throw new Error("sub Method not implemented.");
    }
    toExponential(fractionDigits?: number): string {
        throw new Error("toExponential Method not implemented.");
    }
    toFixed(fractionDigits?: number): string {
        throw new Error("toFixed Method not implemented.");
    }
    toPrecision(precision?: number): string {
        throw new Error("toPrecision Method not implemented.");
    }
    toString(radix?: number): string {
        throw new Error("toString Method not implemented.");
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
    __div__(rhs: any): Geometric1 {
        throw new Error("__div__ Method not implemented.");
    }
    __rdiv__(lhs: any): Geometric1 {
        throw new Error("__rdiv__ Method not implemented.");
    }
    __vbar__(rhs: any): Geometric1 {
        throw new Error("__vbar__ Method not implemented.");
    }
    __rvbar__(lhs: any): Geometric1 {
        throw new Error("__rvbar__ Method not implemented.");
    }
    __wedge__(rhs: any): Geometric1 {
        throw new Error("__wedge__ Method not implemented.");
    }
    __rwedge__(lhs: any): Geometric1 {
        throw new Error("__rwedge__ Method not implemented.");
    }
    __lshift__(rhs: any): Geometric1 {
        throw new Error("__lshift__ Method not implemented.");
    }
    __rlshift__(lhs: any): Geometric1 {
        throw new Error("__rlshift__ Method not implemented.");
    }
    __rshift__(rhs: any): Geometric1 {
        throw new Error("__rshift__ Method not implemented.");
    }
    __rrshift__(lhs: any): Geometric1 {
        throw new Error("__rrshift__ Method not implemented.");
    }
    __bang__(): Geometric1 {
        throw new Error("__bang__ Method not implemented.");
    }
    inv(): Geometric1 {
        throw new Error("inv Method not implemented.");
    }
    __eq__(rhs: Geometric1): boolean {
        throw new Error("__eq__ Method not implemented.");
    }
    __ne__(rhs: Geometric1): boolean {
        throw new Error("__ne__ Method not implemented.");
    }
    __ge__(rhs: Geometric1): boolean {
        throw new Error("__ge__ Method not implemented.");
    }
    __gt__(rhs: Geometric1): boolean {
        throw new Error("__gt__ Method not implemented.");
    }
    __le__(rhs: Geometric1): boolean {
        throw new Error("__le__ Method not implemented.");
    }
    __lt__(rhs: Geometric1): boolean {
        throw new Error("__lt__ Method not implemented.");
    }
    __tilde__(): Geometric1 {
        throw new Error("__tilde__ Method not implemented.");
    }
    __add__(other: Unit | Geometric1): Geometric1 {
        throw new Error("__add__ Method not implemented.");
    }
    __radd__(other: Unit | Geometric1): Geometric1 {
        throw new Error("__radd__ Method not implemented.");
    }
    __sub__(other: Unit | Geometric1): Geometric1 {
        throw new Error("__sub__ Method not implemented.");
    }
    __rsub__(other: Unit | Geometric1): Geometric1 {
        throw new Error("__rsub__ Method not implemented.");
    }
    __pos__(): Geometric1 {
        throw new Error("__pos__ Method not implemented.");
    }
    __neg__(): Geometric1 {
        throw new Error("__neg__ Method not implemented.");
    }
    neg(): Geometric1 {
        throw new Error("neg Method not implemented.");
    }
    isZero(): boolean {
        return this.coords[COORD_A] === 0 && this.coords[COORD_X] === 0;
    }
    __mul__(rhs: any): Geometric1 {
        throw new Error("__mul__ Method not implemented.");
    }
    __rmul__(lhs: any): Geometric1 {
        throw new Error("__rmul__ Method not implemented.");
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
