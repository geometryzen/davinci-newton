import { __extends } from "tslib";
import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { WORLD } from "../model/CoordType";
var ConstantForceLaw3 = /** @class */ (function (_super) {
    __extends(ConstantForceLaw3, _super);
    function ConstantForceLaw3(body, vector, vectorCoordType) {
        if (vectorCoordType === void 0) { vectorCoordType = WORLD; }
        return _super.call(this, body, vector, vectorCoordType) || this;
    }
    return ConstantForceLaw3;
}(ConstantForceLaw));
export { ConstantForceLaw3 };
