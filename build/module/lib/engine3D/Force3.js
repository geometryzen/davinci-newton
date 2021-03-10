import { __extends } from "tslib";
import { Force } from "../core/Force";
/**
 *
 */
var Force3 = /** @class */ (function (_super) {
    __extends(Force3, _super);
    function Force3(body) {
        return _super.call(this, body, body.metric) || this;
    }
    return Force3;
}(Force));
export { Force3 };
