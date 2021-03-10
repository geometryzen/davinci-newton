import { BivectorE2 } from './BivectorE2';
import Scalar3 from './Scalar3';
import { SpinorE2 } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 } from './VectorE2';
/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export declare class Vec2 implements VectorE2 {
    /**
     * The basis vector corresponding to the x coordinate.
     */
    static readonly e1: Vec2;
    /**
     * The basis vector corresponding to the y coordinate.
     */
    static readonly e2: Vec2;
    /**
     * The zero vector.
     */
    static readonly zero: Vec2;
    private readonly x_;
    private readonly y_;
    /**
     * The optional unit of measure.
     */
    private readonly uom_;
    /**
     * "v corresponds to `new Vec2(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    constructor(x: number, y: number, uom?: Unit);
    /**
     * readonly x coordinate.
     */
    get x(): number;
    /**
     * readonly y coordinate.
     */
    get y(): number;
    /**
     * readonly unit of measure
     */
    get uom(): Unit;
    /**
     * @returns this + rhs
     */
    add(rhs: VectorE2): Vec2;
    /**
     * @returns this / alpha
     */
    divByScalar(alpha: number): Vec2;
    /**
     * @returns this << B
     */
    lco(B: BivectorE2): Vec2;
    /**
     * @returns this - rhs
     */
    subtract(rhs: VectorE2): Vec2;
    /**
     * @returns this * alpha
     */
    mulByScalar(alpha: number): Vec2;
    /**
     * @returns |this - point|
     */
    distanceTo(point: VectorE2): Scalar3;
    /**
     * @returns this | v
     */
    dot(v: VectorE2): Scalar3;
    /**
     * @returns |this|
     */
    private magnitude;
    /**
     *
     */
    nearEqual(v: VectorE2, tolerance?: number): boolean;
    /**
     * @returns this / magnitude(this)
     */
    direction(): Vec2;
    /**
     * @returns R * this * ~R
     */
    rotate(R: SpinorE2): Vec2;
    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string;
    __add__(rhs: VectorE2): Vec2;
    __div__(rhs: number): Vec2;
    __mul__(rhs: number): Vec2;
    __rmul__(lhs: number): Vec2;
    __sub__(rhs: VectorE2): Vec2;
    static fromVector(v: VectorE2): Vec2;
}
