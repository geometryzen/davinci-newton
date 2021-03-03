import isNumber from '../checks/isNumber';
import mustBeNumber from '../checks/mustBeNumber';
import readOnly from '../i18n/readOnly';
import { BivectorE2 } from './BivectorE2';
import { GradeMasked } from './CartesianG3';
import { isSpinorE2 } from './isSpinorE2';
import { isVectorE2 } from './isVectorE2';
import MatrixLike from './MatrixLike';
import { mustBeVectorE2 } from './mustBeVectorE2';
import randomRange from './randomRange';
import { SpinorE2 } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 } from './VectorE2';

/**
 * 
 */
export class Vector2 implements VectorE2, GradeMasked {
    public x: number;
    public y: number;
    public uom: Unit;

    /**
     * 
     */
    constructor(x: number, y: number, uom?: Unit) {
        this.x = mustBeNumber('x', x);
        this.y = mustBeNumber('y', y);
        this.uom = Unit.mustBeUnit('uom', uom);
    }

    /**
     *
     */
    get grades(): number {
        return this.isZero() ? 0x0 : 0x2;
    }
    set grades(unused: number) {
        throw new Error(readOnly('grades').message);
    }

    /**
     * 
     */
    add(rhs: VectorE2): this {
        this.x += rhs.x;
        this.y += rhs.y;
        this.uom = Unit.compatible(this.uom, rhs.uom);
        return this;
    }

    /**
     * Pre-multiplies the column vector corresponding to this vector by the matrix.
     * The result is applied to this vector.
     *
     * @param σ The 3x3 matrix that pre-multiplies this column vector.
     */
    applyMatrix(σ: MatrixLike): this {
        const x = this.x;
        const y = this.y;

        const n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1);
        const n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1);

        this.x = n11 * x + n12 * y;
        this.y = n21 * x + n22 * y;

        return this;
    }

    /**
     * 
     */
    clone(): Vector2 {
        return new Vector2(this.x, this.y, this.uom);
    }

    /**
     * 
     */
    copy(source: VectorE2): this {
        mustBeVectorE2('source', source);
        this.x = source.x;
        this.y = source.y;
        return this;
    }

    /**
     * 
     */
    direction(): this {
        const m = this.magnitude();
        return this.divByScalar(m);
    }

    /**
     * 
     */
    divByScalar(alpha: number): this {
        this.x /= alpha;
        this.y /= alpha;
        return this;
    }

    /**
     * 
     */
    dot(v: VectorE2): number {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * ??
     */
    dual(B: BivectorE2): this {
        this.x = 0;
        this.y = 0;
        return this;
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0;
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
    mulByScalar(alpha: number): this {
        this.x *= alpha;
        this.y *= alpha;
        return this;
    }

    neg(): this {
        return this.mulByScalar(-1);
    }

    /**
     * 
     */
    normalize(magnitude = 1): this {
        const m = this.magnitude();
        return this.mulByScalar(magnitude).divByScalar(m);
    }

    /**
     * 
     */
    write(destination: VectorE2): this {
        destination.x = this.x;
        destination.y = this.y;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * Computes the square of this vector.
     * This is an alias for the `squaredNorm` method.
     */
    quaditude(): number {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }

    /**
     * 
     */
    quadranceTo(point: VectorE2): number {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        return Δx * Δx + Δy * Δy;
    }

    /**
     * 
     */
    rotate(spinor: SpinorE2): this {
        if (spinor.a === 1 && spinor.xy === 0) {
            return this;
        }
        else {
            const x = this.x;
            const y = this.y;

            const a = spinor.xy;
            const w = spinor.a;

            const ix = w * x + a * y;
            const iy = w * y - a * x;

            this.x = ix * w + iy * a;
            this.y = iy * w - ix * a;
            return this;
        }
    }

    /**
     * Computes the square of this vector.
     * This is an alias for the `quaditude` method.
     */
    squaredNorm(): number {
        const x = this.x;
        const y = this.y;
        return x * x + y * y;
    }

    /**
     * 
     */
    sub(rhs: VectorE2): this {
        this.x -= rhs.x;
        this.y -= rhs.y;
        return this;
    }

    /**
     * Returns a string containing a number in exponential notation. 
     */
    toExponential(fractionDigits?: number): string {
        return `new Vector2(${this.x.toExponential(fractionDigits)}, ${this.y.toExponential(fractionDigits)})`;
    }

    /**
     * Returns a string containing a number in fixed-point notation. 
     */
    toFixed(fractionDigits?: number): string {
        return `new Vector2(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)})`;
    }

    /**
     * Returns a string containing a number represented either in exponential or fixed-point notation
     * with a specified number of digits.
     */
    toPrecision(precision?: number): string {
        return `new Vector2(${this.x.toPrecision(precision)}, ${this.y.toPrecision(precision)})`;
    }

    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string {
        return `new Vector2(${this.x.toString(radix)}, ${this.y.toString(radix)})`;
    }

    __add__(rhs: VectorE2): Vector2 {
        if (isVectorE2(rhs) && !isSpinorE2(rhs)) {
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Vector2(this.x + rhs.x, this.y + rhs.y, uom);
        }
        else {
            return void 0;
        }
    }

    __div__(rhs: number): Vector2 {
        if (isNumber(rhs)) {
            return new Vector2(this.x / rhs, this.y / rhs, this.uom);
        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: number): Vector2 {
        if (isNumber(rhs)) {
            return new Vector2(this.x * rhs, this.y * rhs, this.uom);
        }
        else {
            return void 0;
        }
    }

    __neg__(): Vector2 {
        return new Vector2(-this.x, -this.y, this.uom);
    }

    __radd__(lhs: VectorE2): Vector2 {
        if (isVectorE2(lhs) && !isSpinorE2(lhs)) {
            const uom = Unit.compatible(lhs.uom, this.uom);
            return new Vector2(lhs.x + this.x, lhs.y + this.y, uom);
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: number): Vector2 {
        if (isNumber(lhs)) {
            return new Vector2(lhs * this.x, lhs * this.y, this.uom);
        }
        else {
            return void 0;
        }
    }

    __rsub__(lhs: VectorE2): Vector2 {
        if (isVectorE2(lhs) && !isSpinorE2(lhs)) {
            const uom = Unit.compatible(lhs.uom, this.uom);
            return new Vector2(lhs.x - this.x, lhs.y - this.y, uom);
        }
        else {
            return void 0;
        }
    }

    __sub__(rhs: VectorE2): Vector2 {
        if (isVectorE2(rhs) && !isSpinorE2(rhs)) {
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Vector2(this.x - rhs.x, this.y - rhs.y, uom);
        }
        else {
            return void 0;
        }
    }

    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE2): Vector2 {
        return new Vector2(0, 0, void 0).dual(B);
    }

    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    static random(): Vector2 {
        const x = randomRange(-1, 1);
        const y = randomRange(-1, 1);
        const z = randomRange(-1, 1);
        return Vector2.vector(x, y).normalize();
    }

    /**
     * @param x
     * @param y
     * @param z
     * @param uom
     */
    static vector(x: number, y: number, uom?: Unit): Vector2 {
        return new Vector2(x, y, uom);
    }

}
