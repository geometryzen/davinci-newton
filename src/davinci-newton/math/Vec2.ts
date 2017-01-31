import BivectorE2 from './BivectorE2';
import SpinorE2 from './SpinorE2';
import VectorE2 from './VectorE2';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vec2 implements VectorE2 {

    /**
     * 
     */
    static ORIGIN = new Vec2(0, 0);

    /**
     * 
     */
    constructor(private x_: number, private y_: number) {

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
     * 
     */
    add(rhs: VectorE2): Vec2 {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    }

    /**
     * 
     */
    divByScalar(alpha: number): Vec2 {
        return new Vec2(this.x / alpha, this.y / alpha);
    }

    /**
     * this << B
     */
    lco(B: BivectorE2): Vec2 {
        const az = B.xy;
        const bx = this.x;
        const by = this.y;
        const x = - az * by;
        const y = az * bx;
        return new Vec2(x, y);
    }

    /**
     * 
     */
    subtract(rhs: VectorE2): Vec2 {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    }

    /**
     * 
     */
    mulByScalar(alpha: number): Vec2 {
        return new Vec2(alpha * this.x, alpha * this.y);
    }

    /**
     * 
     */
    cross(rhs: VectorE2): Vec2 {
        const x = 0;
        const y = 0;
        return new Vec2(x, y);
    }

    /**
     * 
     */
    distanceTo(point: VectorE2): number {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        return Math.sqrt(Δx * Δx + Δy * Δy);
    }

    /**
     * 
     */
    magnitude(): number {
        const x = this.x;
        const y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * 
     */
    nearEqual(v: VectorE2, tolerance?: number): boolean {
        if (veryDifferent(this.x_, v.x, tolerance)) {
            return false;
        }
        if (veryDifferent(this.y_, v.y, tolerance)) {
            return false;
        }
        return true;
    }

    /**
     * 
     */
    direction(): Vec2 {
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
    rotate(spinor: SpinorE2): Vec2 {
        if (spinor.a === 1 && spinor.xy === 0) {
            return this;
        }
        else {
            const x = this.x;
            const y = this.y;

            const a = spinor.xy;
            const w = spinor.a;

            const ix = w * x + a * y;
            const iy = w * y - a * x;

            const xPrimed = ix * w + iy * a;
            const yPrimed = iy * w - ix * a;

            return new Vec2(xPrimed, yPrimed);
        }
    }

    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string {
        return `new Vec2(${this.x_.toString(radix)}, ${this.y_.toString(radix)})`;
    }

    __add__(rhs: VectorE2): Vec2 {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    }

    __sub__(rhs: VectorE2): Vec2 {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    }

    __mul__(rhs: number): Vec2 {
        return new Vec2(this.x * rhs, this.y * rhs);
    }

    __div__(rhs: number): Vec2 {
        return new Vec2(this.x / rhs, this.y / rhs);
    }

    static fromVector(v: VectorE2): Vec2 {
        return new Vec2(v.x, v.y);
    }
}

export default Vec2;
