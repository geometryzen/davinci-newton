import BivectorE3 from './BivectorE3';
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
    zero(): this {
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        return this;
    }
}

export default Bivector3;
