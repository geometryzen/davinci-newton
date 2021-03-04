import isNumber from '../checks/isNumber';
import mustBeNumber from '../checks/mustBeNumber';
import readOnly from '../i18n/readOnly';
import { BivectorE3 } from './BivectorE3';
import { GradeMasked } from './CartesianG3';
import isSpinorE3 from './isSpinorE3';
import isVectorE3 from './isVectorE3';
import { MatrixLike } from './MatrixLike';
import mustBeVectorE3 from './mustBeVectorE3';
import randomRange from './randomRange';
import { SpinorE3 } from './SpinorE3';
import { Unit } from './Unit';
import { VectorE3 } from './VectorE3';

/**
 * 
 */
export class Vector3 implements VectorE3, GradeMasked {
    public x: number;
    public y: number;
    public z: number;
    public uom: Unit;

    /**
     * 
     */
    constructor(x: number, y: number, z: number, uom?: Unit) {
        this.x = mustBeNumber('x', x);
        this.y = mustBeNumber('y', y);
        this.z = mustBeNumber('z', z);
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
    add(rhs: VectorE3): this {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
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
        const z = this.z;

        const n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
        const n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
        const n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);

        this.x = n11 * x + n12 * y + n13 * z;
        this.y = n21 * x + n22 * y + n23 * z;
        this.z = n31 * x + n32 * y + n33 * z;

        return this;
    }

    /**
     * 
     */
    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z, this.uom);
    }

    /**
     * 
     */
    copy(source: VectorE3): this {
        mustBeVectorE3('source', source);
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
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
        this.z /= alpha;
        return this;
    }

    /**
     * 
     */
    dot(v: VectorE3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
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

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0;
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
        this.z *= alpha;
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
    write(destination: VectorE3): this {
        destination.x = this.x;
        destination.y = this.y;
        destination.z = this.z;
        return this;
    }

    /**
     * 
     */
    zero(): this {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Computes the square of this vector.
     * This is an alias for the `squaredNorm` method.
     */
    quaditude(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        return x * x + y * y + z * z;
    }

    /**
     * 
     */
    quadranceTo(point: VectorE3): number {
        const Δx = this.x - point.x;
        const Δy = this.y - point.y;
        const Δz = this.z - point.z;
        return Δx * Δx + Δy * Δy + Δz * Δz;
    }

    /**
     * 
     */
    rotate(spinor: SpinorE3): this {
        if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
            return this;
        }
        else {
            const x = this.x;
            const y = this.y;
            const z = this.z;

            const a = spinor.xy;
            const b = spinor.yz;
            const c = spinor.zx;
            const w = spinor.a;

            const ix = w * x - c * z + a * y;
            const iy = w * y - a * x + b * z;
            const iz = w * z - b * y + c * x;
            const iw = b * x + c * y + a * z;

            this.x = ix * w + iw * b + iy * a - iz * c;
            this.y = iy * w + iw * c + iz * b - ix * a;
            this.z = iz * w + iw * a + ix * c - iy * b;
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
        const z = this.z;
        return x * x + y * y + z * z;
    }

    /**
     * 
     */
    sub(rhs: VectorE3): this {
        this.x -= rhs.x;
        this.y -= rhs.y;
        this.z -= rhs.z;
        return this;
    }

    /**
     * Returns a string containing a number in exponential notation. 
     */
    toExponential(fractionDigits?: number): string {
        return `new Vector3(${this.x.toExponential(fractionDigits)}, ${this.y.toExponential(fractionDigits)}, ${this.z.toExponential(fractionDigits)})`;
    }

    /**
     * Returns a string containing a number in fixed-point notation. 
     */
    toFixed(fractionDigits?: number): string {
        return `new Vector3(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.z.toFixed(fractionDigits)})`;
    }

    /**
     * Returns a string containing a number represented either in exponential or fixed-point notation
     * with a specified number of digits.
     */
    toPrecision(precision?: number): string {
        return `new Vector3(${this.x.toPrecision(precision)}, ${this.y.toPrecision(precision)}, ${this.z.toPrecision(precision)})`;
    }

    /**
     * Returns a string representation of this vector.
     */
    toString(radix?: number): string {
        return `new Vector3(${this.x.toString(radix)}, ${this.y.toString(radix)}, ${this.z.toString(radix)})`;
    }

    __add__(rhs: VectorE3): Vector3 {
        if (isVectorE3(rhs) && !isSpinorE3(rhs)) {
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Vector3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, uom);
        }
        else {
            return void 0;
        }
    }

    __div__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return new Vector3(this.x / rhs, this.y / rhs, this.z / rhs, this.uom);
        }
        else {
            return void 0;
        }
    }

    __mul__(rhs: number): Vector3 {
        if (isNumber(rhs)) {
            return new Vector3(this.x * rhs, this.y * rhs, this.z * rhs, this.uom);
        }
        else {
            return void 0;
        }
    }

    __neg__(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z, this.uom);
    }

    __radd__(lhs: VectorE3): Vector3 {
        if (isVectorE3(lhs) && !isSpinorE3(lhs)) {
            const uom = Unit.compatible(lhs.uom, this.uom);
            return new Vector3(lhs.x + this.x, lhs.y + this.y, lhs.z + this.z, uom);
        }
        else {
            return void 0;
        }
    }

    __rmul__(lhs: number): Vector3 {
        if (isNumber(lhs)) {
            return new Vector3(lhs * this.x, lhs * this.y, lhs * this.z, this.uom);
        }
        else {
            return void 0;
        }
    }

    __rsub__(lhs: VectorE3): Vector3 {
        if (isVectorE3(lhs) && !isSpinorE3(lhs)) {
            const uom = Unit.compatible(lhs.uom, this.uom);
            return new Vector3(lhs.x - this.x, lhs.y - this.y, lhs.z - this.z, uom);
        }
        else {
            return void 0;
        }
    }

    __sub__(rhs: VectorE3): Vector3 {
        if (isVectorE3(rhs) && !isSpinorE3(rhs)) {
            const uom = Unit.compatible(this.uom, rhs.uom);
            return new Vector3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, uom);
        }
        else {
            return void 0;
        }
    }

    /**
     * Constructs a vector by computing the dual of a bivector.
     */
    static dual(B: BivectorE3): Vector3 {
        return new Vector3(0, 0, 0, void 0).dual(B);
    }

    /**
     * <p>
     * Computes a unit vector with a random direction.
     * </p>
     */
    static random(): Vector3 {
        const x = randomRange(-1, 1);
        const y = randomRange(-1, 1);
        const z = randomRange(-1, 1);
        return Vector3.vector(x, y, z).normalize();
    }

    /**
     * @param x
     * @param y
     * @param z
     * @param uom
     */
    static vector(x: number, y: number, z: number, uom?: Unit): Vector3 {
        return new Vector3(x, y, z, uom);
    }

}
