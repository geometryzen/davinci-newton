import { Matrix3 } from './Matrix3';
import { Unit } from './Unit';
/**
 *
 */
var Mat3 = /** @class */ (function () {
    /**
     *
     */
    function Mat3(source) {
        /**
         *
         */
        this.data = Matrix3.one();
        var n11 = source.getElement(0, 0);
        var n12 = source.getElement(0, 1);
        var n13 = source.getElement(0, 2);
        var n21 = source.getElement(1, 0);
        var n22 = source.getElement(1, 1);
        var n23 = source.getElement(1, 2);
        var n31 = source.getElement(2, 0);
        var n32 = source.getElement(2, 1);
        var n33 = source.getElement(2, 2);
        this.data.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
        this.uom = Unit.mustBeUnit('uom', source.uom);
    }
    Object.defineProperty(Mat3.prototype, "dimensions", {
        /**
         *
         */
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the element at the specified (zero-based) row and column.
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    Mat3.prototype.getElement = function (row, column) {
        return this.data.getElement(row, column);
    };
    /**
     * @param i the zero-based index of the row.
     */
    Mat3.prototype.row = function (i) {
        return this.data.row(i);
    };
    /**
     * @param radix
     */
    Mat3.prototype.toString = function (radix) {
        return this.data.toString(radix);
    };
    return Mat3;
}());
export { Mat3 };
