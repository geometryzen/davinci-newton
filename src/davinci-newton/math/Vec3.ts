import BivectorE3 from './BivectorE3';
import mustBeNumber from '../checks/mustBeNumber';
import Scalar3 from './Scalar3';
import SpinorE3 from './SpinorE3';
import { Unit } from './Unit';
import VectorE3 from './VectorE3';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vec3 implements VectorE3 {

    /**
     * The basis vector corresponding to the x coordinate.
     */
    public static readonly e1 = new Vec3(1, 0, 0);

    /**
     * The basis vector corresponding to the y coordinate.
     */
    public static readonly e2 = new Vec3(0, 1, 0);

    /**
     * The basis vector corresponding to the z coordinate.
     */
    public static readonly e3 = new Vec3(0, 0, 1);

    /**
     * The zero vector.
     */
    public static readonly zero = new Vec3(0, 0, 0);

    private readonly x_: number;
    private readonly y_: number;
    private readonly z_: number;
    /**
     * The optional unit of measure.
     */
    private readonly uom_: Unit;

    /**
     * "v corresponds to `new Vec3(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    constructor(x: number, y: number, z: number, uom?: Unit) {
        this.x_ = mustBeNumber('x', x);
        this.y_ = mustBeNumber('y', y);
        this.z_ = mustBeNumber('z', z);
        this.uom_ = Unit.mustBeUnit('uom', uom);
        if (this.uom_ && this.uom_.multiplier !== 1) {
            const multiplier: number = this.uom_.multiplier;
            this.x_ *= multiplier;
            this.y_ *= multiplier;
            this.z_ *= multiplier;
            this.uom_ = Unit.valueOf(1, uom.dimensions, uom.labels);
        }
    }

    /**
     * readonly x coordinate.
     */
    get x(): number {
        return this.x_;
    }

    /**
     * readonly y coordinate.
     */
    get y(): number {
        return this.y_;
    }

    /**
     * readonly z coordinate.
     */
    get z(): number {
        return this.z_;
    }

    /**
     * readonly unit of measure
     */
    get uom(): Unit {
        return this.uom_;
    }

    /**
     * @returns this + rhs
     */
    add(rhs: VectorE3): Vec3 {
        const uom = Unit.compatible(this.uom_, rhs.uom);
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, uom);
    }

    /**
     * @returns this / alpha
     */
    divByScalar(alpha: number): Vec3 {
        return new Vec3(this.x / alpha, this.y / alpha, this.z / alpha, this.uom_);
    }

    /**
     * @returns this << B
     */
    lco(B: BivectorE3): Vec3 {
        const ax = B.yz;
        const ay = B.zx;
        const az = B.xy;
        const bx = this.x;
        const by = this.y;
        const bz = this.z;
        const x = ay * bz - az * by;
        const y = az * bx - ax * bz;
        const z = ax * by - ay * bx;
        return new Vec3(x, y, z, Unit.mul(this.uom_, B.uom));
    }

    /**
     * @returns this - rhs
     */
    subtract(rhs: VectorE3): Vec3 {
        const uom = Unit.compatible(this.uom_, rhs.uom);
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, uom);
    }

    /**
     * @returns this * alpha
     */
    mulByScalar(alpha: number): Vec3 {
        return new Vec3(alpha * this.x, alpha * this.y, alpha * this.z, this.uom_);
    }

    /**
     * @returns this x alpha
     */
    cross(rhs: VectorE3): Vec3 {
        const ax = this.x;
        const ay = this.y;
        const az = this.z;
        const bx = rhs.x;
        const by = rhs.y;
        const bz = rhs.z;
        const x = ay * bz - az * by;
        const y = az * bx - ax * bz;
        const z = ax * by - ay * bx;
        return new Vec3(x, y, z, Unit.mul(this.uom_, rhs.uom));
    }

    /**
     * @returns |this - point|
     */
    public distanceTo(point: VectorE3): Scalar3 {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        const Δz = this.z - point.z;
        const a = Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
        const uom = Unit.compatible(this.uom_, point.uom);
        return new Scalar3(a, uom);
    }

    /**
     * @returns this | v
     */
    public dot(v: VectorE3): Scalar3 {
        const a = this.x * v.x + this.y * v.y + this.z * v.z;
        const uom = Unit.mul(this.uom_, v.uom);
        return new Scalar3(a, uom);
    }

    /**
     * @returns |this|
     */
    private magnitude(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * 
     */
    nearEqual(v: VectorE3, tolerance?: number): boolean {
        if (veryDifferent(this.x_, v.x, tolerance)) {
            return false;
        }
        if (veryDifferent(this.y_, v.y, tolerance)) {
            return false;
        }
        if (veryDifferent(this.z_, v.z, tolerance)) {
            return false;
        }
        return true;
    }

    /**
     * @returns this / magnitude(this)
     */
    direction(): Vec3 {
        const magnitude = this.magnitude();
        if (magnitude !== 1) {
            if (magnitude === 0) {
                throw new Error("direction is undefined.");
            }
            else {
                return this.divByScalar(magnitude);
            }
        }
        else {
            return this;
        }
    }

    /**
     * @returns R * this * ~R
     */
    rotate(R: SpinorE3): Vec3 {
        if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
            return this;
        }
        else {
            const x = this.x;
            const y = this.y;
            const z = this.z;

            const a = R.xy;
            const b = R.yz;
            const c = R.zx;
            const w = R.a;

            const ix = w * x - c * z + a * y;
            const iy = w * y - a * x + b * z;
            const iz = w * z - b * y + c * x;
            const iw = b * x + c * y + a * z;

            const xPrimed = ix * w + iw * b + iy * a - iz * c;
            const yPrimed = iy * w + iw * c + iz * b - ix * a;
            const zPrimed = iz * w + iw * a + ix * c - iy * b;

            return new Vec3(xPrimed, yPrimed, zPrimed, this.uom_);
        }
    }

    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string {
        return `new Vec3(${this.x_.toString(radix)}, ${this.y_.toString(radix)}, ${this.z_.toString(radix)})`;
    }

    __add__(rhs: VectorE3): Vec3 {
        return this.add(rhs);
    }

    __div__(rhs: number): Vec3 {
        return this.divByScalar(rhs);
    }

    __mul__(rhs: number): Vec3 {
        return this.mulByScalar(rhs);
    }

    __rmul__(lhs: number): Vec3 {
        return this.mulByScalar(lhs);
    }

    __sub__(rhs: VectorE3): Vec3 {
        return this.subtract(rhs);
    }

    static fromVector(v: VectorE3): Vec3 {
        return new Vec3(v.x, v.y, v.z, v.uom);
    }
}

export default Vec3;
