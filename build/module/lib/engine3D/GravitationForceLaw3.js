import { __extends } from "tslib";
import { GravitationLaw } from "../core/GravitationLaw";
import { Geometric3 } from "../math/Geometric3";
var GravitationForceLaw3 = /** @class */ (function (_super) {
    __extends(GravitationForceLaw3, _super);
    function GravitationForceLaw3(body1, body2) {
        return _super.call(this, body1, body2, Geometric3.one) || this;
    }
    return GravitationForceLaw3;
}(GravitationLaw));
export { GravitationForceLaw3 };
