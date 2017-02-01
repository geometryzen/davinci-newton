import BivectorE3 from './BivectorE3';
import isNumber from '../checks/isNumber';
import isSpinorE3 from './isSpinorE3';
import isVectorE3 from './isVectorE3';
import MatrixLike from './MatrixLike';
import mustBeVectorE3 from './mustBeVectorE3';
import SpinorE3 from './SpinorE3';
import VectorE3 from './VectorE3';

/**
 * 
 */
export class Vector3 implements VectorE3 {

    /**
     * 
     */
    constructor(public x = 0, public y = 0, public z = 0) {

    }

    /**
     * 
     */
    add(rhs: VectorE3): this {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
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
        const z = this.z;

        const n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
        const n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
        const n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);

        this.x = n11 * x + n12 * y + n13 * z;
        this.y = n21 * x + n22 * y + n23 * z;
        this.z = n31 * x + n32 * y + n33 * z;

        return this;
    }

    /**
     * 
     */
    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * 
     */
    copy(source: VectorE3): this {
        mustBeVectorE3('source', source);
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
        return this;
    }

    /**
     * 
     */
    direction(): this {
        const m = this.magnitude();
        return this.divByScalar(m);
    }

    /**
     * 
     */
    distanceTo(point: VectorE3): number {
        return Math.sqrt(this.quadranceTo(point));
    }

    /**
     * 
     */
    divByScalar(alpha: number): this {
        this.x /= alpha;
        this.y /= alpha;
        this.z /= alpha;
        return this;
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
    dual(B: BivectorE3): this {
        this.x = -B.yz;
        this.y = -B.zx;
        this.z = -B.xy;
        return this;
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }

    /**
     * 
     */
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }

    /**
     * 
     */
    mulByScalar(alpha: number): this {
        this.x *= alpha;
        this.y *= alpha;
        this.z *= alpha;
        return this;
    }

    neg(): this {
        return this.mulByScalar(-1);
    }

    /**
     * 
     */
    normalize(magnitude = 1): this {
        const m = this.magnitude();
        return this.mulByScalar(magnitude).divByScalar(m);
    }

    /**
     * 
     */
    write(destination: VectorE3): this {
        destination.x = this.x;
        destination.y = this.y;
        destination.z = this.z;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Computes the square of this vector.
     * This is an alias for the `squaredNorm` method.
     */
    quaditude(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        return x * x + y * y + z * z;
    }

    /**
     * 
     */
    quadranceTo(point: VectorE3): number {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        const Δz = this.z - point.z;
        return Δx * Δx + Δy * Δy + Δz * Δz;
    }

    /**
     * 
     */
    rotate(spinor: SpinorE3): this {
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

            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
            return this;
        }
    }

    /**
     * Computes the square of this vector.
     * This is an alias for the `quaditude` method.
     */
    squaredNorm(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        return x * x + y * y + z * z;
    }

    /**
     * 
     */
    sub(rhs: VectorE3): this {
        this.x -= rhs.x;
        this.y -= rhs.y;
        this.z -= rhs.z;
        return this;
    }

    /**
     * Returns a string representation of this Vector.
     */
    toString(radix?: number): string {
        return `new Vector3(${this.x.toString(radix)}, ${this.y.toString(radix)}, ${this.z.toString(radix)})`;
    }

    __add__(rhs: VectorE3): Vector3 {
        if (isVectorE3(rhs) && !isSpinorE3(rhs)) {
            return new Vector3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
        }
        else {
            return void 0;
        }
    }

    __div__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return new Vector3(this.x / rhs, this.y / rhs, this.z / rhs);
        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return new Vector3(this.x * rhs, this.y * rhs, this.z * rhs);
        }
        else {
            return void 0;
        }
    }

    __neg__(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    __radd__(lhs: VectorE3): Vector3 {
        if (isVectorE3(lhs) && !isSpinorE3(lhs)) {
            return new Vector3(lhs.x + this.x, lhs.y + this.y, lhs.z + this.z);
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: number): Vector3 {
        if (isNumber(lhs)) {
            return new Vector3(lhs * this.x, lhs * this.y, lhs * this.z);
        }
        else {
            return void 0;
        }
    }

    __rsub__(lhs: VectorE3): Vector3 {
        if (isVectorE3(lhs) && !isSpinorE3(lhs)) {
            return new Vector3(lhs.x - this.x, lhs.y - this.y, lhs.z - this.z);
        }
        else {
            return void 0;
        }
    }

    __sub__(rhs: VectorE3): Vector3 {
        if (isVectorE3(rhs) && !isSpinorE3(rhs)) {
            return new Vector3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
        }
        else {
            return void 0;
        }
    }

    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE3): Vector3 {
        return new Vector3().dual(B);
    }
}

export default Vector3;
