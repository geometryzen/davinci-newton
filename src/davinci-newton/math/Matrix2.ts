import AbstractMatrix from './AbstractMatrix';
import inv2x2 from './inv2x2';
import mul2x2 from './mul2x2';
import SpinorE2 from './SpinorE2';

/**
 * 
 */
export class Matrix2 extends AbstractMatrix<Matrix2> {
    /**
     * @param elements
     */
    constructor(elements = new Float32Array([1, 0, 0, 1])) {
        super(elements, 2);
    }

    /**
     *
     */
    inv(): this {
        inv2x2(this.elements, this.elements);
        return this;
    }

    /**
     * @param rhs
     */
    mul(rhs: Matrix2): this {
        return this.mul2(this, rhs);
    }

    /**
     * @param lhs
     */
    rmul(lhs: Matrix2): this {
        mul2x2(lhs.elements, this.elements, this.elements);
        return this;
    }

    /**
     * @param a
     * @param b
     */
    mul2(a: Matrix2, b: Matrix2): this {
        mul2x2(a.elements, b.elements, this.elements);
        return this;
    }

    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: SpinorE2): this {
        const z: number = -spinor.xy;
        const α: number = spinor.a;

        const z2 = z + z;
        const zz = z * z2;
        const wz = α * z2;

        this.set(
            1 - zz, - wz,
            wz, 1 - zz,
        );

        return this;
    }

    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): number[] {
        const te = this.elements;
        return [te[0 + i], te[3 + i], te[6 + i]];
    }

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
     * @param n21
     * @param n22
     */
    set(n11: number, n12: number,
        n21: number, n22: number): this {

        const te = this.elements;

        te[0] = n11; te[2] = n12;
        te[1] = n21; te[3] = n22;

        return this;
    }

    /**
     * @param radix
     */
    toString(radix?: number): string {
        const text: string[] = [];
        for (let i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element: number, index: number) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    }

    /**
     *
     */
    transpose(): this {
        let tmp: number;
        const m = this.elements;

        tmp = m[1]; m[1] = m[2]; m[2] = tmp;

        return this;
    }

    /**
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     */
    public static one(): Matrix2 {
        return new Matrix2(new Float32Array([1, 0, 0, 1]));
    }

    public static zero(): Matrix2 {
        return new Matrix2(new Float32Array([0, 0, 0, 0]));
    }
}

export default Matrix2;
