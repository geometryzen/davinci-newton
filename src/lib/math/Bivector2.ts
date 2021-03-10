import isNumber from '../checks/isNumber';
import mustBeNumber from '../checks/mustBeNumber';
import { BivectorE2 } from './BivectorE2';
import isBivectorE3 from './isBivectorE3';
import { isVectorE2 } from './isVectorE2';
import { MatrixLike } from './MatrixLike';
import { mustBeBivectorE2 } from './mustBeBivectorE2';
import { mustBeVectorE2 } from './mustBeVectorE2';
import { SpinorE2 } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 } from './VectorE2';

/**
 * 
 */
export class Bivector2 implements BivectorE2 {
    public xy: number;
    public uom: Unit;

    /**
     * 
     */
    constructor(xy: number, uom?: Unit) {
        this.xy = mustBeNumber('xy', xy);
        this.uom = Unit.mustBeUnit('uom', uom);
    }

    /**
     * 
     */
    add(B: BivectorE2): this {
        mustBeBivectorE2('B', B);
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
        const z = this.xy;

        const n33 = σ.getElement(2, 2);

        this.xy = n33 * z;

        return this;
    }

    /**
     * 
     */
    copy(B: BivectorE2): this {
        mustBeBivectorE2('B', B);
        this.xy = B.xy;
        return this;
    }

    isZero(): boolean {
        return this.xy === 0;
    }

    rev(): this {
        this.xy = -this.xy;
        return this;
    }

    /**
     * R * this * ~R
     */
    rotate(R: SpinorE2): this {
        if (R.a === 1 && R.xy === 0) {
            return this;
        }
        else {
            const xy = this.xy;

            const Rxy = R.xy;
            const Ra = R.a;

            const Sxy = Ra * xy;
            const Sa = Rxy * xy;

            this.xy = Sxy * Ra + Sa * Rxy;

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
    sub(B: BivectorE2): this {
        mustBeBivectorE2('B', B);
        this.xy -= B.xy;
        return this;
    }

    toExponential(fractionDigits?: number): string {
        return `new Bivector3(xy: ${this.xy.toExponential(fractionDigits)})`;
    }

    toFixed(fractionDigits?: number): string {
        return `new Bivector3(xy: ${this.xy.toFixed(fractionDigits)})`;
    }

    toPrecision(precision?: number): string {
        return `new Bivector3(xy: ${this.xy.toPrecision(precision)})`;
    }

    /**
     * Returns a string representation of this Bivector.
     */
    toString(radix?: number): string {
        return `new Bivector3(xy: ${this.xy.toString(radix)})`;
    }

    /**
     * 
     */
    wedge(a: VectorE2, b: VectorE2): this {
        mustBeVectorE2('a', a);
        mustBeVectorE2('b', b);
        this.xy = a.x * b.y - a.y * b.x;
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    }

    /**
     * 
     */
    write(B: BivectorE2): this {
        B.xy = this.xy;
        B.uom = this.uom;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.xy = 0;
        return this;
    }

    __add__(rhs: BivectorE2): Bivector2 {
        if (isBivectorE3(rhs) && !isVectorE2(rhs)) {
            const xy = this.xy + rhs.xy;
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Bivector2(xy, uom);
        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: number): Bivector2 {
        if (isNumber(rhs)) {
            const xy = this.xy * rhs;
            return new Bivector2(xy, this.uom);
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: number): Bivector2 {
        if (isNumber(lhs)) {
            const xy = lhs * this.xy;
            return new Bivector2(xy, this.uom);
        }
        else {
            return void 0;
        }
    }

    __sub__(rhs: BivectorE2): Bivector2 {
        if (isBivectorE3(rhs) && !isVectorE2(rhs)) {
            const xy = this.xy - rhs.xy;
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Bivector2(xy, uom);
        }
        else {
            return void 0;
        }
    }

    /**
     * 
     */
    static wedge(a: VectorE2, b: VectorE2): Bivector2 {
        return new Bivector2(0).wedge(a, b);
    }
}
