import { __extends } from "tslib";
import { AbstractMatrix } from "./AbstractMatrix";
var Matrix1 = /** @class */ (function (_super) {
    __extends(Matrix1, _super);
    /**
     *
     * @param elements
     * @param uom The optional unit of measure.
     */
    function Matrix1(elements, uom) {
        return _super.call(this, elements, 1, uom) || this;
    }
    Matrix1.one = function () {
        return new Matrix1(new Float32Array([1]));
    };
    Matrix1.zero = function () {
        return new Matrix1(new Float32Array([0]));
    };
    return Matrix1;
}(AbstractMatrix));
export { Matrix1 };
