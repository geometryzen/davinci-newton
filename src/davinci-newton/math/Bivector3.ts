import BivectorE3 from './BivectorE3';
import MatrixLike from './MatrixLike';
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
    applyMatrix(σ: MatrixLike): this {
        const x = this.yz;
        const y = this.zx;
        const z = this.xy;

        const n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
        const n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
        const n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);

        this.yz = n11 * x + n12 * y + n13 * z;
        this.zx = n21 * x + n22 * y + n23 * z;
        this.xy = n31 * x + n32 * y + n33 * z;

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
     * Returns a string representation of this Bivector.
     */
    toString(radix?: number): string {
        return `new Bivector3(yz: ${this.yz.toString(radix)}, zx: ${this.zx.toString(radix)}, xy: ${this.xy.toString(radix)})`;
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
