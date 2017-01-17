import BivectorE3 from './BivectorE3';
import Matrix3 from './Matrix3';
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
    apply(matrix: Matrix3): this {
        throw new Error("TODO");
        // return this;
    }

    /**
     * 
     */
    copy(v: VectorE3): this {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
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
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE3): Vector3 {
        return new Vector3().dual(B);
    }
}

export default Vector3;
