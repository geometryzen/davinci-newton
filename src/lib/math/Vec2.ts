import { mustBeNumber } from '../checks/mustBeNumber';
import { veryDifferent } from '../util/veryDifferent';
import { BivectorE2 } from './BivectorE2';
import Scalar3 from './Scalar3';
import { SpinorE2 } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 } from './VectorE2';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 * @hidden
 */
export class Vec2 implements VectorE2 {

    /**
     * The basis vector corresponding to the x coordinate.
     */
    public static readonly e1 = new Vec2(1, 0);

    /**
     * The basis vector corresponding to the y coordinate.
     */
    public static readonly e2 = new Vec2(0, 1);

    /**
     * The zero vector.
     */
    public static readonly zero = new Vec2(0, 0);

    private readonly x_: number;
    private readonly y_: number;
    /**
     * The optional unit of measure.
     */
    private readonly uom_: Unit;

    /**
     * "v corresponds to `new Vec2(x, y, z)` in the [e1, e2, e3] basis"
     * means
     * v = x * e1 + y * e2 + z * e3
     */
    constructor(x: number, y: number, uom?: Unit) {
        this.x_ = mustBeNumber('x', x);
        this.y_ = mustBeNumber('y', y);
        this.uom_ = Unit.mustBeUnit('uom', uom);
        if (this.uom_ && this.uom_.multiplier !== 1) {
            const multiplier: number = this.uom_.multiplier;
            this.x_ *= multiplier;
            this.y_ *= multiplier;
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
     * readonly unit of measure
     */
    get uom(): Unit {
        return this.uom_;
    }

    /**
     * @returns this + rhs
     */
    add(rhs: VectorE2): Vec2 {
        const uom = Unit.compatible(this.uom_, rhs.uom);
        return new Vec2(this.x + rhs.x, this.y + rhs.y, uom);
    }

    /**
     * @returns this / alpha
     */
    divByScalar(alpha: number): Vec2 {
        return new Vec2(this.x / alpha, this.y / alpha, this.uom_);
    }

    /**
     * @returns this << B
     */
    lco(B: BivectorE2): Vec2 {
        const az = B.xy;
        const bx = this.x;
        const by = this.y;
        const x = - az * by;
        const y = az * bx;
        return new Vec2(x, y, Unit.mul(this.uom_, B.uom));
    }

    /**
     * @returns this - rhs
     */
    subtract(rhs: VectorE2): Vec2 {
        const uom = Unit.compatible(this.uom_, rhs.uom);
        return new Vec2(this.x - rhs.x, this.y - rhs.y, uom);
    }

    /**
     * @returns this * alpha
     */
    mulByScalar(alpha: number): Vec2 {
        return new Vec2(alpha * this.x, alpha * this.y, this.uom_);
    }

    /**
     * @returns |this - point|
     */
    public distanceTo(point: VectorE2): Scalar3 {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        const a = Math.sqrt(Δx * Δx + Δy * Δy);
        const uom = Unit.compatible(this.uom_, point.uom);
        return new Scalar3(a, uom);
    }

    /**
     * @returns this | v
     */
    public dot(v: VectorE2): Scalar3 {
        const a = this.x * v.x + this.y * v.y;
        const uom = Unit.mul(this.uom_, v.uom);
        return new Scalar3(a, uom);
    }

    /**
     * @returns |this|
     */
    private magnitude(): number {
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
     * @returns this / magnitude(this)
     */
    direction(): Vec2 {
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
    rotate(R: SpinorE2): Vec2 {
        if (R.a === 1 && R.xy === 0) {
            return this;
        }
        else {
            const x = this.x;
            const y = this.y;

            const a = R.xy;
            const w = R.a;

            const ix = w * x + a * y;
            const iy = w * y - a * x;

            const xPrimed = ix * w + iy * a;
            const yPrimed = iy * w - ix * a;

            return new Vec2(xPrimed, yPrimed, this.uom_);
        }
    }

    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string {
        return `new Vec2(${this.x_.toString(radix)}, ${this.y_.toString(radix)})`;
    }

    __add__(rhs: VectorE2): Vec2 {
        return this.add(rhs);
    }

    __div__(rhs: number): Vec2 {
        return this.divByScalar(rhs);
    }

    __mul__(rhs: number): Vec2 {
        return this.mulByScalar(rhs);
    }

    __rmul__(lhs: number): Vec2 {
        return this.mulByScalar(lhs);
    }

    __sub__(rhs: VectorE2): Vec2 {
        return this.subtract(rhs);
    }

    static fromVector(v: VectorE2): Vec2 {
        return new Vec2(v.x, v.y, v.uom);
    }
}
