import { __extends } from "tslib";
import { Physics } from "../core/Physics";
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
}(Physics));
export { Physics3 };
