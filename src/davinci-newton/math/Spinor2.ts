import SpinorE2 from './SpinorE2';

/**
 * 
 */
export class Spinor2 implements SpinorE2 {
    /**
     * 
     */
    constructor(public a = 1, public xy = 0) {

    }

    /**
     * 
     */
    copy(spinor: SpinorE2): this {
        this.a = spinor.a;
        this.xy = spinor.xy;
        return this;
    }

    divByScalar(alpha: number): this {
        if (alpha !== 1) {
            this.a /= alpha;
            this.xy /= alpha;
        }
        return this;
    }

    isOne(): boolean {
        return this.a === 1 && this.xy === 0;
    }

    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }

    normalize(): this {
        const m = this.magnitude();
        if (m !== 1) {
            return this.divByScalar(m);
        }
        else {
            return this;
        }
    }

    /**
     * 
     */
    one(): this {
        this.a = 1;
        this.xy = 0;
        return this;
    }

    /**
     * a.k.a. squared norm
     */
    private quaditude(): number {
        const a = this.a;
        const z = this.xy;
        return a * a + z * z;
    }

    rev(): this {
        this.xy = -this.xy;
        return this;
    }
}

export default Spinor2;
