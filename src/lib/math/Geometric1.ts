import { readOnly } from "../i18n/readOnly";
import { GeometricOperators } from "./GeometricOperators";
import { Unit } from "./Unit";

/**
 * @hidden
 */
const zero = function (): number[] {
    return [0, 0];
};

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

export class Geometric1 implements GeometricOperators<Geometric1, Unit> {
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
    __div__(rhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rdiv__(lhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __vbar__(rhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rvbar__(lhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __wedge__(rhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rwedge__(lhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __lshift__(rhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rlshift__(lhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rshift__(rhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rrshift__(lhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __bang__(): Geometric1 {
        throw new Error("Method not implemented.");
    }
    inv(): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __eq__(rhs: Geometric1): boolean {
        throw new Error("Method not implemented.");
    }
    __ne__(rhs: Geometric1): boolean {
        throw new Error("Method not implemented.");
    }
    __ge__(rhs: Geometric1): boolean {
        throw new Error("Method not implemented.");
    }
    __gt__(rhs: Geometric1): boolean {
        throw new Error("Method not implemented.");
    }
    __le__(rhs: Geometric1): boolean {
        throw new Error("Method not implemented.");
    }
    __lt__(rhs: Geometric1): boolean {
        throw new Error("Method not implemented.");
    }
    __tilde__(): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __add__(other: Unit | Geometric1): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __radd__(other: Unit | Geometric1): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __sub__(other: Unit | Geometric1): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rsub__(other: Unit | Geometric1): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __pos__(): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __neg__(): Geometric1 {
        throw new Error("Method not implemented.");
    }
    neg(): Geometric1 {
        throw new Error("Method not implemented.");
    }
    isZero(): boolean {
        return this.coords[COORD_A] === 0 && this.coords[COORD_X] === 0;
    }
    __mul__(rhs: any): Geometric1 {
        throw new Error("Method not implemented.");
    }
    __rmul__(lhs: any): Geometric1 {
        throw new Error("Method not implemented.");
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
