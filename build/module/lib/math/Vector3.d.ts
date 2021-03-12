import { BivectorE3 } from './BivectorE3';
import { GradeMasked } from './GradeMasked';
import { MatrixLike } from './MatrixLike';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
import { VectorE3 } from './VectorE3';
/**
 * @hidden
 */
export declare class Vector3 implements VectorE3, GradeMasked {
    x: number;
    y: number;
    z: number;
    uom: Unit;
    /**
     *
     */
    constructor(x: number, y: number, z: number, uom?: Unit);
    /**
     *
     */
    get grades(): number;
    set grades(unused: number);
    /**
     *
     */
    add(rhs: VectorE3): this;
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    applyMatrix(σ: MatrixLike): this;
    /**
     *
     */
    clone(): Vector3;
    /**
     *
     */
    copy(source: VectorE3): this;
    /**
     *
     */
    direction(): this;
    /**
     *
     */
    divByScalar(alpha: number): this;
    /**
     *
     */
    dot(v: VectorE3): number;
    /**
     *
     */
    dual(B: BivectorE3): this;
    isZero(): boolean;
    /**
     *
     */
    magnitude(): number;
    /**
     *
     */
    mulByScalar(alpha: number): this;
    neg(): this;
    /**
     *
     */
    normalize(magnitude?: number): this;
    /**
     *
     */
    write(destination: VectorE3): this;
    /**
     *
     */
    zero(): this;
    /**
     * Computes the square of this vector.
     * This is an alias for the `squaredNorm` method.
     */
    quaditude(): number;
    /**
     *
     */
    quadranceTo(point: VectorE3): number;
    /**
     *
     */
    rotate(spinor: SpinorE3): this;
    /**
     * Computes the square of this vector.
     * This is an alias for the `quaditude` method.
     */
    squaredNorm(): number;
    /**
     *
     */
    sub(rhs: VectorE3): this;
    /**
     * Returns a string containing a number in exponential notation.
     */
    toExponential(fractionDigits?: number): string;
    /**
     * Returns a string containing a number in fixed-point notation.
     */
    toFixed(fractionDigits?: number): string;
    /**
     * Returns a string containing a number represented either in exponential or fixed-point notation
     * with a specified number of digits.
     */
    toPrecision(precision?: number): string;
    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string;
    __add__(rhs: VectorE3): Vector3;
    __div__(rhs: number): Vector3;
    __mul__(rhs: number): Vector3;
    __neg__(): Vector3;
    __radd__(lhs: VectorE3): Vector3;
    __rmul__(lhs: number): Vector3;
    __rsub__(lhs: VectorE3): Vector3;
    __sub__(rhs: VectorE3): Vector3;
    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE3): Vector3;
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    static random(): Vector3;
    /**
     * @param x
     * @param y
     * @param z
     * @param uom
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Vector3;
}
