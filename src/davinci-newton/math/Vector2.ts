import MatrixLike from './MatrixLike';
import SpinorE2 from './SpinorE2';
import VectorE2 from './VectorE2';

/**
 * 
 */
export class Vector2 implements VectorE2 {

    /**
     * 
     */
    constructor(public x = 0, public y = 0) {

    }

    /**
     * 
     */
    add(rhs: VectorE2): this {
        this.x += rhs.x;
        this.y += rhs.y;
        return this;
    }
    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    applyMatrix(σ: MatrixLike): this {
        const x = this.x;
        const y = this.y;

        const n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1);
        const n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1);

        this.x = n11 * x + n12 * y;
        this.y = n21 * x + n22 * y;

        return this;
    }

    /**
     * 
     */
    copy(source: VectorE2): this {
        this.x = source.x;
        this.y = source.y;
        return this;
    }

    /**
     * 
     */
    distanceTo(point: VectorE2): number {
        return Math.sqrt(this.quadranceTo(point));
    }

    /**
     * 
     */
    dot(v: VectorE2): number {
        return this.x * v.x + this.y * v.y;
    }

    direction(): this {
        const m = this.magnitude();
        return this.divByScalar(m);
    }

    /**
     * 
     */
    divByScalar(alpha: number): this {
        this.x /= alpha;
        this.y /= alpha;
        return this;
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }

    /**
     * 
     */
    mulByScalar(alpha: number): this {
        this.x *= alpha;
        this.y *= alpha;
        return this;
    }

    neg(): this {
        return this.mulByScalar(-1);
    }

    /**
     * 
     */
    write(destination: VectorE2): this {
        destination.x = this.x;
        destination.y = this.y;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * Computes the square of this vector.
     * a.k.a squared norm.
     */
    quaditude(): number {
        const x = this.x;
        const y = this.y;

        return x * x + y * y;
    }

    /**
     * 
     */
    quadranceTo(point: VectorE2): number {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        return Δx * Δx + Δy * Δy;
    }

    /**
     * 
     */
    rotate(spinor: SpinorE2): this {
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

            this.x = ix * w + iy * a;
            this.y = iy * w - ix * a;
            return this;
        }
    }

    /**
     * 
     */
    subtract(rhs: VectorE2): this {
        this.x -= rhs.x;
        this.y -= rhs.y;
        return this;
    }
    /**
     * Returns a string representation of this Vector.
     */
    toString(radix?: number): string {
        return `new Vector2(${this.x.toString(radix)}, ${this.y.toString(radix)})`;
    }

    __add__(rhs: VectorE2): Vector2 {
        return new Vector2(this.x + rhs.x, this.y + rhs.y);
    }

    __div__(rhs: number): Vector2 {
        return new Vector2(this.x / rhs, this.y / rhs);
    }

    __mul__(rhs: number): Vector2 {
        return new Vector2(this.x * rhs, this.y * rhs);
    }

    __neg__(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }
}

export default Vector2;
