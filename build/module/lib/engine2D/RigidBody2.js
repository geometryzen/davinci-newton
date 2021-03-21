import { __extends } from "tslib";
import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";
import { Euclidean2 } from "./Euclidean2";
/**
 * @hidden
 */
var L = new Geometric2();
/**
 *
 */
var RigidBody2 = /** @class */ (function (_super) {
    __extends(RigidBody2, _super);
    function RigidBody2() {
        return _super.call(this, new Euclidean2()) || this;
    }
    /**
     *
     */
    RigidBody2.prototype.updateAngularVelocity = function () {
        // If the angular momentum is mutable then we don't want to accidentally change it.
        // If the angular momentum is immutable then we will need a scratch variable to avoid creating temporary objects. 
        L.copyBivector(this.L);
        // We know that (in 2D) the moment of inertia is a scalar.
        // The angular velocity property performs copy on assignment.
        this.Ω = L.mulByScalar(this.Iinv.getElement(0, 0), this.Iinv.uom);
    };
    return RigidBody2;
}(RigidBody));
export { RigidBody2 };
