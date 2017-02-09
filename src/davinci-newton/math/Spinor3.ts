import CartesianG3 from './CartesianG3';
import mustBeNumber from '../checks/mustBeNumber';
import randomRange from './randomRange';
import readOnly from '../i18n/readOnly';
import SpinorE3 from './SpinorE3';
import Unit from './Unit';

/**
 * A mutable representation of a spinor with cartesian coordinates in 3 dimensions.
 */
export class Spinor3 implements SpinorE3, CartesianG3 {

    /**
     * The scalar coordinate of the spinor.
     */
    public a: number;

    /**
     * The coordinate corresponding to the bivector e2 ^ e3.
     */
    public yz: number;

    /**
     * The coordinate corresponding to the bivector e3 ^ e1.
     */
    public zx: number;

    /**
     * The coordinate corresponding to the bivector e1 ^ e2.
     */
    public xy: number;

    /**
     * 
     */
    public uom: Unit;

    /**
     * 
     */
    constructor(a: number, yz: number, zx: number, xy: number, uom?: Unit) {
        this.a = mustBeNumber('a', a);
        this.yz = mustBeNumber('yz', yz);
        this.zx = mustBeNumber('zx', zx);
        this.xy = mustBeNumber('xy', xy);
        this.uom = Unit.mustBeUnit('uom', uom);
    }

    /**
     *
     */
    get maskG3(): number {
        const α = this.a;
        const yz = this.yz;
        const zx = this.zx;
        const xy = this.xy;
        let m = 0x0;
        if (α !== 0) {
            m += 0x1;
        }
        if (yz !== 0 || zx !== 0 || xy !== 0) {
            m += 0x4;
        }
        return m;
    }
    set maskG3(unused: number) {
        throw new Error(readOnly('maskG3').message);
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
    divByScalar(alpha: number): this {
        if (alpha !== 1) {
            this.a /= alpha;
            this.xy /= alpha;
            this.yz /= alpha;
            this.zx /= alpha;
        }
        return this;
    }

    /**
     * 
     */
    isOne(): boolean {
        return this.a === 1 && this.xy === 0 && this.yz === 0 && this.zx === 0;
    }

    /**
     * 
     */
    magnitude(): number {
        return Math.sqrt(this.quaditude());
    }

    /**
     * 
     */
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

    /**
     * 
     */
    rev(): this {
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    }

    /**
     * 
     */
    toExponential(fractionDigits?: number): string {
        return `new Spinor3(${this.a.toExponential(fractionDigits)}, ${this.yz.toExponential(fractionDigits)}, ${this.zx.toExponential(fractionDigits)}, ${this.xy.toExponential(fractionDigits)})`;
    }

    /**
     * 
     */
    toFixed(fractionDigits?: number): string {
        return `new Spinor3(${this.a.toFixed(fractionDigits)}, ${this.yz.toFixed(fractionDigits)}, ${this.zx.toFixed(fractionDigits)}, ${this.xy.toFixed(fractionDigits)})`;
    }

    /**
     * 
     */
    toPrecision(precision?: number): string {
        return `new Spinor3(${this.a.toPrecision(precision)}, ${this.yz.toPrecision(precision)}, ${this.zx.toPrecision(precision)}, ${this.xy.toPrecision(precision)})`;
    }

    /**
     * Returns a string representation of this spinor.
     */
    toString(radix?: number): string {
        return `new Spinor3(${this.a.toString(radix)}, ${this.yz.toString(radix)}, ${this.zx.toString(radix)}, ${this.xy.toString(radix)})`;
    }

    /**
     * <p>
     * Computes a unit spinor with a random direction.
     * </p>
     */
    static random(): Spinor3 {
        const yz = randomRange(-1, 1);
        const zx = randomRange(-1, 1);
        const xy = randomRange(-1, 1);
        const α = randomRange(-1, 1);
        return Spinor3.spinor(yz, zx, xy, α).normalize();
    }

    /**
     * @param yz
     * @param zx
     * @param xy
     * @param α
     */
    static spinor(yz: number, zx: number, xy: number, α: number, uom?: Unit): Spinor3 {
        return new Spinor3(α, yz, zx, xy, uom);
    }
}

export default Spinor3;
