import BivectorE3 from './BivectorE3';
import SpinorE3 from './SpinorE3';
import VectorE3 from './VectorE3';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vector implements VectorE3 {

    /**
     * 
     */
    static ORIGIN = new Vector(0, 0, 0);

    /**
     * 
     */
    constructor(private x_: number, private y_: number, private z_: number) {

    }

    /**
     * 
     */
    get x(): number {
        return this.x_;
    }

    /**
     * 
     */
    get y(): number {
        return this.y_;
    }
    /**
     * 
     */
    get z(): number {
        return this.z_;
    }

    /**
     * 
     */
    add(rhs: VectorE3): Vector {
        return new Vector(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    /**
     * this << B
     */
    lco(B: BivectorE3): Vector {
        const ax = B.yz;
        const ay = B.zx;
        const az = B.xy;
        const bx = this.x;
        const by = this.y;
        const bz = this.z;
        const x = ay * bz - az * by;
        const y = az * bx - ax * bz;
        const z = ax * by - ay * bx;
        return new Vector(x, y, z);
    }

    /**
     * 
     */
    subtract(rhs: VectorE3): Vector {
        return new Vector(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    /**
     * 
     */
    multiply(alpha: number): Vector {
        return new Vector(alpha * this.x, alpha * this.y, alpha * this.z);
    }

    /**
     * 
     */
    cross(rhs: VectorE3): Vector {
        const ax = this.x;
        const ay = this.y;
        const az = this.z;
        const bx = rhs.x;
        const by = rhs.y;
        const bz = rhs.z;
        const x = ay * bz - az * by;
        const y = az * bx - ax * bz;
        const z = ax * by - ay * bx;
        return new Vector(x, y, z);
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
    immutable(): Vector {
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
    direction(): Vector {
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
    rotate(spinor: SpinorE3): Vector {
        if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
            return this;
        }
        else {
            throw new Error("TODO: rotate(spinor)");
        }
    }

    static dual(B: BivectorE3): Vector {
        return new Vector(-B.yz, -B.zx, -B.xy);
    }

    static fromVector(v: VectorE3): Vector {
        return new Vector(v.x, v.y, v.z);
    }
}

export default Vector;
