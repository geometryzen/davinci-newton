import { BivectorE2 } from './BivectorE2';
import { GradeMasked } from './GradeMasked';
import { MatrixLike } from './MatrixLike';
import { SpinorE2 } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 } from './VectorE2';
/**
 *
 */
export declare class Vector2 implements VectorE2, GradeMasked {
    x: number;
    y: number;
    uom: Unit;
    /**
     *
     */
    constructor(x: number, y: number, uom?: Unit);
    /**
     *
     */
    get grades(): number;
    set grades(unused: number);
    /**
     *
     */
    add(rhs: VectorE2): this;
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
    clone(): Vector2;
    /**
     *
     */
    copy(source: VectorE2): this;
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
    dot(v: VectorE2): number;
    /**
     * ??
     */
    dual(B: BivectorE2): this;
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
    write(destination: VectorE2): this;
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
    quadranceTo(point: VectorE2): number;
    /**
     *
     */
    rotate(spinor: SpinorE2): this;
    /**
     * Computes the square of this vector.
     * This is an alias for the `quaditude` method.
     */
    squaredNorm(): number;
    /**
     *
     */
    sub(rhs: VectorE2): this;
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
    __add__(rhs: VectorE2): Vector2;
    __div__(rhs: number): Vector2;
    __mul__(rhs: number): Vector2;
    __neg__(): Vector2;
    __radd__(lhs: VectorE2): Vector2;
    __rmul__(lhs: number): Vector2;
    __rsub__(lhs: VectorE2): Vector2;
    __sub__(rhs: VectorE2): Vector2;
    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE2): Vector2;
    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    static random(): Vector2;
    /**
     * @param x
     * @param y
     * @param z
     * @param uom
     */
    static vector(x: number, y: number, uom?: Unit): Vector2;
}
