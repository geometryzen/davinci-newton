import { Unit } from "./Unit";

/**
 * @hidden
 */
const zero = function (): number[] {
    return [0, 0];
};

/**
 * Sentinel value to indicate that the Geometric2 is not locked.
 * UNLOCKED is in the range -1 to 0.
 * @hidden
 */
const UNLOCKED = -1 * Math.random();

export class Geometric1 {
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
    get a(): number {
        return this.coords[0];
    }
    set a(a: number) {
        this.coords[0] = a;
    }
    get x(): number {
        return this.coords[1];
    }
    set x(x: number) {
        this.coords[1] = x;
    }
    get uom(): Unit {
        return this.unit;
    }
    set uom(uom: Unit) {
        this.unit = uom;
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
