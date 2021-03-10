import { BivectorE2 } from './BivectorE2';
import { MatrixLike } from './MatrixLike';
import { SpinorE2 } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 } from './VectorE2';
/**
 *
 */
export declare class Bivector2 implements BivectorE2 {
    xy: number;
    uom: Unit;
    /**
     *
     */
    constructor(xy: number, uom?: Unit);
    /**
     *
     */
    add(B: BivectorE2): this;
    /**
     * Pre-multiplies the column vector corresponding to this bivector by the matrix.
     * The result is applied to this bivector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this bivector column vector.
     */
    applyMatrix(σ: MatrixLike): this;
    /**
     *
     */
    copy(B: BivectorE2): this;
    isZero(): boolean;
    rev(): this;
    /**
     * R * this * ~R
     */
    rotate(R: SpinorE2): this;
    /**
     * Computes the scalar product of this bivector with B.
     */
    /**
     *
     */
    sub(B: BivectorE2): this;
    toExponential(fractionDigits?: number): string;
    toFixed(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    /**
     * Returns a string representation of this Bivector.
     */
    toString(radix?: number): string;
    /**
     *
     */
    wedge(a: VectorE2, b: VectorE2): this;
    /**
     *
     */
    write(B: BivectorE2): this;
    /**
     *
     */
    zero(): this;
    __add__(rhs: BivectorE2): Bivector2;
    __mul__(rhs: number): Bivector2;
    __rmul__(lhs: number): Bivector2;
    __sub__(rhs: BivectorE2): Bivector2;
    /**
     *
     */
    static wedge(a: VectorE2, b: VectorE2): Bivector2;
}
