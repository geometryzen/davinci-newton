import { __extends } from "tslib";
import { Physics } from "../core/Physics";
import { Dynamics2 } from "./Dynamics2";
import { Euclidean2 } from "./Euclidean2";
/**
 *
 */
var Physics2 = /** @class */ (function (_super) {
    __extends(Physics2, _super);
    function Physics2() {
        return _super.call(this, new Euclidean2(), new Dynamics2()) || this;
    }
    return Physics2;
}(Physics));
export { Physics2 };
