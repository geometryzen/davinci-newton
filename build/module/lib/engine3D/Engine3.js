import { __extends } from "tslib";
import { Engine } from "../core/Engine";
import { Dynamics3 } from "./Dynamics3";
import { Euclidean3 } from "./Euclidean3";
/**
 *
 */
var Engine3 = /** @class */ (function (_super) {
    __extends(Engine3, _super);
    function Engine3(options) {
        return _super.call(this, new Euclidean3(), new Dynamics3(), options) || this;
    }
    return Engine3;
}(Engine));
export { Engine3 };
