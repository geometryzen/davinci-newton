import { __extends } from "tslib";
import { AbstractMatrix } from './AbstractMatrix';
import inv3x3 from './inv3x3';
import { mul3x3 } from './mul3x3';
import { Unit } from './Unit';
/**
 *
 */
var Matrix3 = /** @class */ (function (_super) {
    __extends(Matrix3, _super);
    /**
     * @param elements The matrix elements in column-major order. i.e. [m00, m10, m20, m01, m11, m21,,m02, m12, m22]
     * @param uom The optional unit of measure.
     */
    function Matrix3(elements /* = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])*/, uom) {
        return _super.call(this, elements, 3, uom) || this;
    }
    /**
     *
     */
    Matrix3.prototype.inv = function () {
        inv3x3(this.elements, this.elements);
        this.uom = Unit.div(Unit.ONE, this.uom);
        return this;
    };
    /**
     * @param rhs
     */
    Matrix3.prototype.mul = function (rhs) {
        return this.mul2(this, rhs);
    };
    /**
     * @param lhs
     */
    Matrix3.prototype.rmul = function (lhs) {
        mul3x3(lhs.elements, this.elements, this.elements);
        this.uom = Unit.mul(lhs.uom, this.uom);
        return this;
    };
    /**
     * @param a
     * @param b
     */
    Matrix3.prototype.mul2 = function (a, b) {
        mul3x3(a.elements, b.elements, this.elements);
        this.uom = Unit.mul(a.uom, b.uom);
        return this;
    };
    /**
     * Sets this matrix to be equivalent to the spinor.
     *
     * this ⟼ rotation(spinor)
     *
     * @param attitude  The spinor from which the rotation will be computed.
     */
    Matrix3.prototype.rotation = function (spinor) {
        // The correspondence between quaternions and spinors is
        // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
        var x = -spinor.yz;
        var y = -spinor.zx;
        var z = -spinor.xy;
        var α = spinor.a;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = α * x2;
        var wy = α * y2;
        var wz = α * z2;
        this.set(1 - yy - zz, xy - wz, xz + wy, xy + wz, 1 - xx - zz, yz - wx, xz - wy, yz + wx, 1 - xx - yy);
        return this;
    };
    /**
     * @param i the zero-based index of the row.
     */
    Matrix3.prototype.row = function (i) {
        var te = this.elements;
        return [te[0 + i], te[3 + i], te[6 + i]];
    };
    /**
     * <p>
     * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
     * </p>
     * <p>
     * An advantage of this method is that the function call resembles the matrix written out.
     * </p>
     * <p>
     * The parameters are named according to the 1-based row and column.
     * </p>
     *
     * @param n11
     * @param n12
     * @param n13
     * @param n21
     * @param n22
     * @param n23
     * @param n31
     * @param n32
     * @param n33
     */
    Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        var te = this.elements;
        te[0] = n11;
        te[3] = n12;
        te[6] = n13;
        te[1] = n21;
        te[4] = n22;
        te[7] = n23;
        te[2] = n31;
        te[5] = n32;
        te[8] = n33;
        return this;
    };
    /**
     * @param radix
     */
    Matrix3.prototype.toString = function (radix) {
        var text = [];
        for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
        }
        return text.join('\n');
    };
    /**
     *
     */
    Matrix3.prototype.transpose = function () {
        var tmp;
        var m = this.elements;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
    };
    /**
     * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
     */
    Matrix3.one = function () {
        return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
    };
    Matrix3.zero = function () {
        return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
    };
    return Matrix3;
}(AbstractMatrix));
export { Matrix3 };
