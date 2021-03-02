import isNumber from '../checks/isNumber';
import mustBeNumber from '../checks/mustBeNumber';
import { BivectorE3 } from './BivectorE3';
import isBivectorE3 from './isBivectorE3';
import isVectorE3 from './isVectorE3';
import MatrixLike from './MatrixLike';
import mustBeBivectorE3 from './mustBeBivectorE3';
import mustBeVectorE3 from './mustBeVectorE3';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
import { VectorE3 } from './VectorE3';
import { wedgeXY, wedgeYZ, wedgeZX } from './wedge3';

/**
 * 
 */
export class Bivector3 implements BivectorE3 {
    public yz: number;
    public zx: number;
    public xy: number;
    public uom: Unit;

    /**
     * 
     */
    constructor(yz: number, zx: number, xy: number, uom?: Unit) {
        this.yz = mustBeNumber('yz', yz);
        this.zx = mustBeNumber('zx', zx);
        this.xy = mustBeNumber('xy', xy);
        this.uom = Unit.mustBeUnit('uom', uom);
        /*
        if (this.isZero()) {
            this.uom = uom;
        }
        else {
            this.uom = mustBeUnit('uom', uom);
        }
        */
    }

    /**
     * 
     */
    add(B: BivectorE3): this {
        mustBeBivectorE3('B', B);
        this.yz += B.yz;
        this.zx += B.zx;
        this.xy += B.xy;
        this.uom = Unit.compatible(this.uom, B.uom);
        return this;
    }

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
        mustBeBivectorE3('B', B);
        this.yz = B.yz;
        this.zx = B.zx;
        this.xy = B.xy;
        return this;
    }

    isZero(): boolean {
        return this.xy === 0 && this.yz === 0 && this.zx === 0;
    }

    rev(): this {
        this.yz = -this.yz;
        this.zx = -this.zx;
        this.xy = -this.xy;
        return this;
    }

    /**
     * R * this * ~R
     */
    rotate(R: SpinorE3): this {
        if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
            return this;
        }
        else {
            const yz = this.yz;
            const zx = this.zx;
            const xy = this.xy;

            const Rxy = R.xy;
            const Ryz = R.yz;
            const Rzx = R.zx;
            const Ra = R.a;

            const Syz = Ra * yz - Rzx * xy + Rxy * zx;
            const Szx = Ra * zx - Rxy * yz + Ryz * xy;
            const Sxy = Ra * xy - Ryz * zx + Rzx * yz;
            const Sa = Ryz * yz + Rzx * zx + Rxy * xy;

            this.yz = Syz * Ra + Sa * Ryz + Szx * Rxy - Sxy * Rzx;
            this.zx = Szx * Ra + Sa * Rzx + Sxy * Ryz - Syz * Rxy;
            this.xy = Sxy * Ra + Sa * Rxy + Syz * Rzx - Szx * Ryz;

            return this;
        }
    }

    /**
     * Computes the scalar product of this bivector with B.
     */
    /*
    scp(B: BivectorE3): number {
        mustBeBivectorE3('B', B);
        // FIXME: This is wrong by a sign.
        return this.xy * B.xy + this.yz * B.yz + this.zx * B.zx;
    }
    */

    /**
     * 
     */
    sub(B: BivectorE3): this {
        mustBeBivectorE3('B', B);
        this.yz -= B.yz;
        this.zx -= B.zx;
        this.xy -= B.xy;
        return this;
    }

    toExponential(fractionDigits?: number): string {
        return `new Bivector3(yz: ${this.yz.toExponential(fractionDigits)}, zx: ${this.zx.toExponential(fractionDigits)}, xy: ${this.xy.toExponential(fractionDigits)})`;
    }

    toFixed(fractionDigits?: number): string {
        return `new Bivector3(yz: ${this.yz.toFixed(fractionDigits)}, zx: ${this.zx.toFixed(fractionDigits)}, xy: ${this.xy.toFixed(fractionDigits)})`;
    }

    toPrecision(precision?: number): string {
        return `new Bivector3(yz: ${this.yz.toPrecision(precision)}, zx: ${this.zx.toPrecision(precision)}, xy: ${this.xy.toPrecision(precision)})`;
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
        mustBeVectorE3('a', a);
        mustBeVectorE3('b', b);
        this.yz = wedgeYZ(a, b);
        this.zx = wedgeZX(a, b);
        this.xy = wedgeXY(a, b);
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    }

    /**
     * 
     */
    write(B: BivectorE3): this {
        B.xy = this.xy;
        B.yz = this.yz;
        B.zx = this.zx;
        B.uom = this.uom;
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

    __add__(rhs: BivectorE3): Bivector3 {
        if (isBivectorE3(rhs) && !isVectorE3(rhs)) {
            const yz = this.yz + rhs.yz;
            const zx = this.zx + rhs.zx;
            const xy = this.xy + rhs.xy;
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Bivector3(yz, zx, xy, uom);
        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: number): Bivector3 {
        if (isNumber(rhs)) {
            const yz = this.yz * rhs;
            const zx = this.zx * rhs;
            const xy = this.xy * rhs;
            return new Bivector3(yz, zx, xy, this.uom);
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: number): Bivector3 {
        if (isNumber(lhs)) {
            const yz = lhs * this.yz;
            const zx = lhs * this.zx;
            const xy = lhs * this.xy;
            return new Bivector3(yz, zx, xy, this.uom);
        }
        else {
            return void 0;
        }
    }

    __sub__(rhs: BivectorE3): Bivector3 {
        if (isBivectorE3(rhs) && !isVectorE3(rhs)) {
            const yz = this.yz - rhs.yz;
            const zx = this.zx - rhs.zx;
            const xy = this.xy - rhs.xy;
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Bivector3(yz, zx, xy, uom);
        }
        else {
            return void 0;
        }
    }

    /**
     * 
     */
    static wedge(a: VectorE3, b: VectorE3): Bivector3 {
        return new Bivector3(0, 0, 0).wedge(a, b);
    }
}
