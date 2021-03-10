import { __extends } from "tslib";
import { GravitationLaw } from "../core/GravitationLaw";
import { Geometric2 } from "../math/Geometric2";
var GravitationForceLaw2 = /** @class */ (function (_super) {
    __extends(GravitationForceLaw2, _super);
    function GravitationForceLaw2(body1, body2) {
        return _super.call(this, body1, body2, Geometric2.one) || this;
    }
    return GravitationForceLaw2;
}(GravitationLaw));
export { GravitationForceLaw2 };
