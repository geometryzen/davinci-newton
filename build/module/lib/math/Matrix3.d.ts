import AbstractMatrix from './AbstractMatrix';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
/**
 *
 */
export declare class Matrix3 extends AbstractMatrix<Matrix3> {
    /**
     * @param elements
     * @param uom The optional unit of measure.
     */
    constructor(elements: Float32Array, uom?: Unit);
    /**
     *
     */
    inv(): this;
    /**
     * @param rhs
     */
    mul(rhs: Matrix3): this;
    /**
     * @param lhs
     */
    rmul(lhs: Matrix3): this;
    /**
     * @param a
     * @param b
     */
    mul2(a: Matrix3, b: Matrix3): this;
    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: SpinorE3): this;
    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): number[];
    /**
     * <p>
     * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
     * </p>
     * <p>
     * An advantage of this method is that the function call resembles the matrix written out.
     * </p>
     * <p>
     * The parameters are named according to the 1-based row and column.
     * </p>
     *
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
    /**
     * @param radix
     */
    toString(radix?: number): string;
    /**
     *
     */
    transpose(): this;
    /**
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     */
    static one(): Matrix3;
    static zero(): Matrix3;
}
