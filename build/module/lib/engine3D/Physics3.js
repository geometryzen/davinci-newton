import { __extends } from "tslib";
import { State } from "../core/State";
import { Dynamics3 } from "./Dynamics3";
import { Euclidean3 } from "./Euclidean3";
/**
 *
 */
var Physics3 = /** @class */ (function (_super) {
    __extends(Physics3, _super);
    function Physics3() {
        return _super.call(this, new Euclidean3(), new Dynamics3()) || this;
    }
    return Physics3;
}(State));
export { Physics3 };
