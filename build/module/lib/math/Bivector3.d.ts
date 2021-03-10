import { BivectorE3 } from './BivectorE3';
import { MatrixLike } from './MatrixLike';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
import { VectorE3 } from './VectorE3';
/**
 *
 */
export declare class Bivector3 implements BivectorE3 {
    yz: number;
    zx: number;
    xy: number;
    uom: Unit;
    /**
     *
     */
    constructor(yz: number, zx: number, xy: number, uom?: Unit);
    /**
     *
     */
    add(B: BivectorE3): this;
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
    copy(B: BivectorE3): this;
    isZero(): boolean;
    rev(): this;
    /**
     * R * this * ~R
     */
    rotate(R: SpinorE3): this;
    /**
     * Computes the scalar product of this bivector with B.
     */
    /**
     *
     */
    sub(B: BivectorE3): this;
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
    wedge(a: VectorE3, b: VectorE3): this;
    /**
     *
     */
    write(B: BivectorE3): this;
    /**
     *
     */
    zero(): this;
    __add__(rhs: BivectorE3): Bivector3;
    __mul__(rhs: number): Bivector3;
    __rmul__(lhs: number): Bivector3;
    __sub__(rhs: BivectorE3): Bivector3;
    /**
     *
     */
    static wedge(a: VectorE3, b: VectorE3): Bivector3;
}
