import { __extends } from "tslib";
import { Engine } from "../core/Engine";
import { Dynamics2 } from "./Dynamics2";
import { Euclidean2 } from "./Euclidean2";
/**
 * The Physics Engine specialized to 2 dimensions with a Euclidean metric.
 */
var Engine2 = /** @class */ (function (_super) {
    __extends(Engine2, _super);
    function Engine2(options) {
        return _super.call(this, new Euclidean2(), new Dynamics2(), options) || this;
    }
    return Engine2;
}(Engine));
export { Engine2 };
