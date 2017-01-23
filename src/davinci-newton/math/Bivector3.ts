import BivectorE3 from './BivectorE3';
import Matrix3 from './Matrix3';
import VectorE3 from './VectorE3';
import { wedgeYZ, wedgeZX, wedgeXY } from './wedge';

/**
 * 
 */
export class Bivector3 implements BivectorE3 {
    yz = 0;
    zx = 0;
    xy = 0;

    /**
     * Pre-multiplies the column vector corresponding to this bivector by the matrix.
     * The result is applied to this bivector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this bivector column vector.
     */
    applyMatrix(σ: Matrix3): this {
        const x = this.yz;
        const y = this.zx;
        const z = this.xy;

        const e = σ.elements;

        this.yz = e[0x0] * x + e[0x3] * y + e[0x6] * z;
        this.zx = e[0x1] * x + e[0x4] * y + e[0x7] * z;
        this.xy = e[0x2] * x + e[0x5] * y + e[0x8] * z;

        return this;
    }

    /**
     * 
     */
    copy(B: BivectorE3): this {
        this.yz = B.yz;
        this.zx = B.zx;
        this.xy = B.xy;
        return this;
    }

    /**
     * 
     */
    dual(v: VectorE3): this {
        this.yz = v.x;
        this.zx = v.y;
        this.xy = v.z;
        return this;
    }

    /**
     * 
     */
    wedge(a: VectorE3, b: VectorE3): this {
        this.yz = wedgeYZ(a, b);
        this.zx = wedgeZX(a, b);
        this.xy = wedgeXY(a, b);
        return this;
    }

    /**
     * 
     */
    write(B: BivectorE3): this {
        B.xy = this.xy;
        B.yz = this.yz;
        B.zx = this.zx;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    }
}

export default Bivector3;
