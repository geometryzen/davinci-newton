import { BivectorE3 } from './BivectorE3';
import Scalar3 from './Scalar3';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
import { VectorE3 } from './VectorE3';
/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 * @hidden
 */
export declare class Vec3 implements VectorE3 {
    /**
     * The basis vector corresponding to the x coordinate.
     */
    static readonly e1: Vec3;
    /**
     * The basis vector corresponding to the y coordinate.
     */
    static readonly e2: Vec3;
    /**
     * The basis vector corresponding to the z coordinate.
     */
    static readonly e3: Vec3;
    /**
     * The zero vector.
     */
    static readonly zero: Vec3;
    private readonly x_;
    private readonly y_;
    private readonly z_;
    /**
     * The optional unit of measure.
     */
    private readonly uom_;
    /**
     * "v corresponds to `new Vec3(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    constructor(x: number, y: number, z: number, uom?: Unit);
    /**
     * readonly x coordinate.
     */
    get x(): number;
    /**
     * readonly y coordinate.
     */
    get y(): number;
    /**
     * readonly z coordinate.
     */
    get z(): number;
    /**
     * readonly unit of measure
     */
    get uom(): Unit;
    /**
     * @returns this + rhs
     */
    add(rhs: VectorE3): Vec3;
    /**
     * @returns this / alpha
     */
    divByScalar(alpha: number): Vec3;
    /**
     * @returns this << B
     */
    lco(B: BivectorE3): Vec3;
    /**
     * @returns this - rhs
     */
    subtract(rhs: VectorE3): Vec3;
    /**
     * @returns this * alpha
     */
    mulByScalar(alpha: number): Vec3;
    /**
     * @returns this x alpha
     */
    cross(rhs: VectorE3): Vec3;
    /**
     * @returns |this - point|
     */
    distanceTo(point: VectorE3): Scalar3;
    /**
     * @returns this | v
     */
    dot(v: VectorE3): Scalar3;
    /**
     * @returns |this|
     */
    private magnitude;
    /**
     *
     */
    nearEqual(v: VectorE3, tolerance?: number): boolean;
    /**
     * @returns this / magnitude(this)
     */
    direction(): Vec3;
    /**
     * @returns R * this * ~R
     */
    rotate(R: SpinorE3): Vec3;
    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string;
    __add__(rhs: VectorE3): Vec3;
    __div__(rhs: number): Vec3;
    __mul__(rhs: number): Vec3;
    __rmul__(lhs: number): Vec3;
    __sub__(rhs: VectorE3): Vec3;
    static fromVector(v: VectorE3): Vec3;
}
