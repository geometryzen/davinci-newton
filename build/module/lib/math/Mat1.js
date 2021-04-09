/**
 * @hidden
 */
var Mat1 = /** @class */ (function () {
    function Mat1(value) {
        this.value = value;
    }
    Object.defineProperty(Mat1.prototype, "dimensions", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Mat1.prototype.getElement = function (row, column) {
        if (row === 0 && column === 0) {
            return this.value;
        }
        else {
            throw new Error('row and column must both be zero.');
        }
    };
    return Mat1;
}());
export { Mat1 };
