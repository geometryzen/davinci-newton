import SpinorE3 from './SpinorE3';

/**
 * A mutable representation of a spinor with cartesian coordinates in 3 dimensions.
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

    divByScalar(alpha: number): this {
        if (alpha !== 1) {
            this.a /= alpha;
            this.xy /= alpha;
            this.yz /= alpha;
            this.zx /= alpha;
        }
        return this;
    }

    isOne(): boolean {
        return this.a === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
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
        this.yz = 0;
        this.zx = 0;
        return this;
    }

    /**
     * a.k.a. squared norm
     */
    private quaditude(): number {
        const a = this.a;
        const x = this.yz;
        const y = this.zx;
        const z = this.xy;
        return a * a + x * x + y * y + z * z;
    }

    rev(): this {
        this.xy = -this.xy;
        this.yz = -this.yz;
        this.zx = -this.zx;
        return this;
    }
}

export default Spinor3;
