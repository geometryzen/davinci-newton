import AbstractMatrix from './AbstractMatrix';
import SpinorE3 from './SpinorE3';

/**
 * 
 */
export class Matrix3 extends AbstractMatrix<Matrix3> {
    /**
     * @param elements
     */
    constructor(elements: Float32Array) {
        super(elements, 3);
    }
    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    rotation(spinor: SpinorE3): this {
        // The correspondence between quaternions and spinors is
        // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
        const x: number = -spinor.yz;
        const y: number = -spinor.zx;
        const z: number = -spinor.xy;
        const α: number = spinor.a;

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = α * x2;
        const wy = α * y2;
        const wz = α * z2;

        this.set(
            1 - yy - zz, xy - wz, xz + wy,
            xy + wz, 1 - xx - zz, yz - wx,
            xz - wy, yz + wx, 1 - xx - yy
        );

        return this;
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
     * @method set
     * @param n11 {number}
     * @param n12 {number}
     * @param n13 {number}
     * @param n21 {number}
     * @param n22 {number}
     * @param n23 {number}
     * @param n31 {number}
     * @param n32 {number}
     * @param n33 {number}
     * @return {Matrix3}
     * @chainable
     */
    set(n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number): Matrix3 {

        const te = this.elements;

        te[0] = n11; te[3] = n12; te[6] = n13;
        te[1] = n21; te[4] = n22; te[7] = n23;
        te[2] = n31; te[5] = n32; te[8] = n33;

        return this;
    }

    /**
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     */
    public static one(): Matrix3 {
        return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
    }

}

export default Matrix3;
