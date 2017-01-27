import BivectorE3 from './BivectorE3';
import SpinorE3 from './SpinorE3';
import VectorE3 from './VectorE3';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vec3 implements VectorE3 {

    /**
     * 
     */
    static ORIGIN = new Vec3(0, 0, 0);

    /**
     * 
     */
    constructor(private x_: number, private y_: number, private z_: number) {

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
    multiply(alpha: number): Vec3 {
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
    distanceTo(rhs: VectorE3): number {
        const Δx = this.x - rhs.x;
        const Δy = this.y - rhs.y;
        const Δz = this.z - rhs.z;
        return Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
    }

    /**
     * 
     */
    immutable(): Vec3 {
        return this;
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
    nearEqual(vector: VectorE3, tolerance?: number): boolean {
        if (veryDifferent(this.x_, vector.x, tolerance)) {
            return false;
        }
        if (veryDifferent(this.y_, vector.y, tolerance)) {
            return false;
        }
        if (veryDifferent(this.z_, vector.z, tolerance)) {
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
                return this.multiply(1 / magnitude);
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

    __sub__(rhs: VectorE3): Vec3 {
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    __mul__(rhs: number): Vec3 {
        return new Vec3(this.x * rhs, this.y * rhs, this.z * rhs);
    }

    __div__(rhs: number): Vec3 {
        return new Vec3(this.x / rhs, this.y / rhs, this.z / rhs);
    }

    static dual(B: BivectorE3): Vec3 {
        return new Vec3(-B.yz, -B.zx, -B.xy);
    }

    static fromVector(v: VectorE3): Vec3 {
        return new Vec3(v.x, v.y, v.z);
    }
}

export default Vec3;
