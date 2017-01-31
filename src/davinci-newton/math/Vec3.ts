import BivectorE3 from './BivectorE3';
import mustBeNumber from '../checks/mustBeNumber';
import SpinorE3 from './SpinorE3';
import VectorE3 from './VectorE3';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vec3 implements VectorE3 {

    /**
     * The basis vector corresponding to the x coordinate.
     */
    static e1 = new Vec3(1, 0, 0);

    /**
     * The basis vector corresponding to the y coordinate.
     */
    static e2 = new Vec3(0, 1, 0);

    /**
     * The basis vector corresponding to the z coordinate.
     */
    static e3 = new Vec3(0, 0, 1);

    /**
     * The zero vector.
     */
    static zero = new Vec3(0, 0, 0);

    private readonly x_: number;
    private readonly y_: number;
    private readonly z_: number;

    /**
     * "v corresponds to `new Vec3(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    constructor(x: number, y: number, z: number) {
        this.x_ = mustBeNumber('x', x);
        this.y_ = mustBeNumber('y', y);
        this.z_ = mustBeNumber('z', z);
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
     * 
     */
    add(rhs: VectorE3): Vec3 {
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    /**
     * 
     */
    divByScalar(alpha: number): Vec3 {
        return new Vec3(this.x / alpha, this.y / alpha, this.z / alpha);
    }

    /**
     * this << B
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
        return new Vec3(x, y, z);
    }

    /**
     * 
     */
    subtract(rhs: VectorE3): Vec3 {
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    /**
     * 
     */
    mulByScalar(alpha: number): Vec3 {
        return new Vec3(alpha * this.x, alpha * this.y, alpha * this.z);
    }

    /**
     * 
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
        return new Vec3(x, y, z);
    }

    /**
     * 
     */
    distanceTo(point: VectorE3): number {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        const Δz = this.z - point.z;
        return Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
    }

    /**
     * 
     */
    dot(v: VectorE3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * 
     */
    magnitude(): number {
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
     * 
     */
    direction(): Vec3 {
        const magnitude = this.magnitude();
        if (magnitude !== 1) {
            if (magnitude === 0) {
                throw new Error("direction is undefined.");
                // return void 0;
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
     * 
     */
    rotate(spinor: SpinorE3): Vec3 {
        if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
            return this;
        }
        else {
            const x = this.x;
            const y = this.y;
            const z = this.z;

            const a = spinor.xy;
            const b = spinor.yz;
            const c = spinor.zx;
            const w = spinor.a;

            const ix = w * x - c * z + a * y;
            const iy = w * y - a * x + b * z;
            const iz = w * z - b * y + c * x;
            const iw = b * x + c * y + a * z;

            const xPrimed = ix * w + iw * b + iy * a - iz * c;
            const yPrimed = iy * w + iw * c + iz * b - ix * a;
            const zPrimed = iz * w + iw * a + ix * c - iy * b;

            return new Vec3(xPrimed, yPrimed, zPrimed);
        }
    }

    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string {
        return `new Vec3(${this.x_.toString(radix)}, ${this.y_.toString(radix)}, ${this.z_.toString(radix)})`;
    }

    __add__(rhs: VectorE3): Vec3 {
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    __div__(rhs: number): Vec3 {
        return new Vec3(this.x / rhs, this.y / rhs, this.z / rhs);
    }

    __mul__(rhs: number): Vec3 {
        return new Vec3(this.x * rhs, this.y * rhs, this.z * rhs);
    }

    __rmul__(lhs: number): Vec3 {
        return new Vec3(lhs * this.x, lhs * this.y, lhs * this.z);
    }

    __sub__(rhs: VectorE3): Vec3 {
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    static fromVector(v: VectorE3): Vec3 {
        return new Vec3(v.x, v.y, v.z);
    }
}

export default Vec3;
