import { GradeMasked } from './GradeMasked';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
/**
 * A mutable representation of a spinor with cartesian coordinates in 3 dimensions.
 */
export declare class Spinor3 implements SpinorE3, GradeMasked {
    /**
     * The scalar coordinate of the spinor.
     */
    a: number;
    /**
     * The coordinate corresponding to the bivector e2 ^ e3.
     */
    yz: number;
    /**
     * The coordinate corresponding to the bivector e3 ^ e1.
     */
    zx: number;
    /**
     * The coordinate corresponding to the bivector e1 ^ e2.
     */
    xy: number;
    /**
     *
     */
    uom: Unit;
    /**
     *
     */
    constructor(a: number, yz: number, zx: number, xy: number, uom?: Unit);
    /**
     *
     */
    get grades(): number;
    set grades(unused: number);
    /**
     *
     */
    copy(spinor: SpinorE3): this;
    /**
     *
     */
    divByScalar(alpha: number): this;
    /**
     *
     */
    isOne(): boolean;
    /**
     *
     */
    magnitude(): number;
    /**
     *
     */
    normalize(): this;
    /**
     *
     */
    one(): this;
    /**
     * a.k.a. squared norm
     */
    private quaditude;
    /**
     *
     */
    rev(): this;
    /**
     *
     */
    toExponential(fractionDigits?: number): string;
    /**
     *
     */
    toFixed(fractionDigits?: number): string;
    /**
     *
     */
    toPrecision(precision?: number): string;
    /**
     * Returns a string representation of this spinor.
     */
    toString(radix?: number): string;
    /**
     * <p>
     * Computes a unit spinor with a random direction.
     * </p>
     */
    static random(): Spinor3;
    /**
     * @param yz
     * @param zx
     * @param xy
     * @param α
     */
    static spinor(yz: number, zx: number, xy: number, α: number, uom?: Unit): Spinor3;
}
