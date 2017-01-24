import BivectorE3 from './BivectorE3';
import Matrix3 from './Matrix3';
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
    applyMatrix(σ: Matrix3): this {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        const e = σ.elements;

        this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
        this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
        this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;

        return this;
    }

    /**
     * 
     */
    copy(source: VectorE3): this {
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
        return this;
    }

    /**
     * 
     */
    distanceTo(rhs: VectorE3): number {
        return Math.sqrt(this.quadranceTo(rhs));
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
        this.z /= alpha;
        return this;
    }

    magnitude(): number {
        return Math.sqrt(this.quadrance());
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
    write(destination: VectorE3): this {
        destination.x = this.x;
        destination.y = this.y;
        destination.z = this.z;
        return this;
    }

    /**
     * Computes the square of this vector.
     */
    quadrance(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        return x * x + y * y + z * z;
    }

    /**
     * 
     */
    quadranceTo(rhs: VectorE3): number {
        const Δx = this.x - rhs.x;
        const Δy = this.y - rhs.y;
        const Δz = this.z - rhs.z;
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
            throw new Error("TODO: rotate(spinor)");
        }
    }

    /**
     * 
     */
    subtract(rhs: VectorE3): this {
        this.x -= rhs.x;
        this.y -= rhs.y;
        this.z -= rhs.z;
        return this;
    }

    __add__(rhs: VectorE3): Vector3 {
        return new Vector3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    __div__(rhs: number): Vector3 {
        return new Vector3(this.x / rhs, this.y / rhs, this.z / rhs);
    }

    __mul__(rhs: number): Vector3 {
        return new Vector3(this.x * rhs, this.y * rhs, this.z * rhs);
    }

    __neg__(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE3): Vector3 {
        return new Vector3().dual(B);
    }
}

export default Vector3;
