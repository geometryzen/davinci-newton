import { __extends } from "tslib";
import { ConstantForceLaw } from "../core/ConstantForceLaw";
import { WORLD } from "../model/CoordType";
var ConstantForceLaw2 = /** @class */ (function (_super) {
    __extends(ConstantForceLaw2, _super);
    function ConstantForceLaw2(body, vector, vectorCoordType) {
        if (vectorCoordType === void 0) { vectorCoordType = WORLD; }
        return _super.call(this, body, vector, vectorCoordType) || this;
    }
    return ConstantForceLaw2;
}(ConstantForceLaw));
export { ConstantForceLaw2 };
