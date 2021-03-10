import { __extends } from "tslib";
import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";
import { Matrix1 } from "../math/Matrix1";
import { Euclidean2 } from "./Euclidean2";
var PolygonRigidBody2 = /** @class */ (function (_super) {
    __extends(PolygonRigidBody2, _super);
    function PolygonRigidBody2(points) {
        var _this = _super.call(this, new Euclidean2()) || this;
        _this.points = points;
        return _this;
    }
    PolygonRigidBody2.prototype.updateInertiaTensor = function () {
        var r = Geometric2.scalar(1);
        var s = 0.5 * this.M.a * r.a * r.a;
        var I = Matrix1.zero();
        I.setElement(0, 0, s);
        // TODO: Units
        this.I = I;
    };
    return PolygonRigidBody2;
}(RigidBody));
export { PolygonRigidBody2 };
