import BivectorE2 from './BivectorE2';
import MatrixLike from './MatrixLike';
import VectorE2 from './VectorE2';
import { wedgeXY } from './wedge2';

/**
 * 
 */
export class Bivector2 implements BivectorE2 {
    xy = 0;

    /**
     * Pre-multiplies the column vector corresponding to this bivector by the matrix.
     * The result is applied to this bivector.
     *
     * @param σ The 2x2 matrix that pre-multiplies this bivector column vector.
     */
    applyMatrix(σ: MatrixLike): this {
        const z = this.xy;

        this.xy = z;

        return this;
    }

    /**
     * 
     */
    copy(B: BivectorE2): this {
        this.xy = B.xy;
        return this;
    }

    isZero(): boolean {
        return this.xy === 0;
    }

    /**
     * Computes the scalar product of this bivector with B.
     */
    scp(B: BivectorE2): number {
        return this.xy * B.xy;
    }

    /**
     * Returns a string representation of this Bivector.
     */
    toString(radix?: number): string {
        return `new Bivector2(xy: ${this.xy.toString(radix)})`;
    }

    /**
     * 
     */
    wedge(a: VectorE2, b: VectorE2): this {
        this.xy = wedgeXY(a, b);
        return this;
    }

    /**
     * 
     */
    write(B: BivectorE2): this {
        B.xy = this.xy;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.xy = 0;
        return this;
    }
}

export default Bivector2;
