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
        return Math.sqrt(this.quadrance());
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

    quadrance(): number {
        const a = this.a;
        const x = this.yz;
        const y = this.zx;
        const z = this.xy;
        return a * a + x * x + y * y + z * z;
    }
}

export default Spinor3;
