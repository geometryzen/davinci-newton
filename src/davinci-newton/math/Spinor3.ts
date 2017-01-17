import SpinorE3 from './SpinorE3';

/**
 * 
 */
export class Spinor3 implements SpinorE3 {
    /**
     * 
     */
    constructor(public a = 1, public xy = 0, public yz = 0, public zx = 0) {

    }

    /**
     * 
     */
    copy(spinor: SpinorE3): this {
        this.a = spinor.a;
        this.xy = spinor.xy;
        this.yz = spinor.yz;
        this.zx = spinor.zx;
        return this;
    }

    /**
     * 
     */
    one(): this {
        this.a = 1;
        this.xy = 0;
        this.yz = 0;
        this.zx = 0;
        return this;
    }
}

export default Spinor3;
