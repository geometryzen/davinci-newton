import { __extends } from "tslib";
import { RigidBody } from "../core/RigidBody";
import { Euclidean3 } from "./Euclidean3";
/**
 *
 */
var RigidBody3 = /** @class */ (function (_super) {
    __extends(RigidBody3, _super);
    function RigidBody3() {
        return _super.call(this, new Euclidean3()) || this;
    }
    return RigidBody3;
}(RigidBody));
export { RigidBody3 };
