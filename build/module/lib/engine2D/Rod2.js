import { __extends } from "tslib";
import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { Matrix1 } from "../math/Matrix1";
import { Unit } from "../math/Unit";
import { RigidBody2 } from "./RigidBody2";
var Rod2 = /** @class */ (function (_super) {
    __extends(Rod2, _super);
    function Rod2(a) {
        var _this = _super.call(this) || this;
        var contextBuilder = function () { return "Rod2.constructor(a: Geometric2): Rod2"; };
        mustBeNonNullObject('a', a, contextBuilder);
        _this.a = a;
        _this.updateInertiaTensor();
        return _this;
    }
    Rod2.prototype.updateInertiaTensor = function () {
        // L(Ω) = (m / 3) a ^ (a << Ω)
        // In 2D, this simplifies to...
        // L(Ω) = (m / 3) |a||a| Ω
        var I = this.M.divByNumber(3).mulByVector(this.a).mulByVector(this.a);
        this.Iinv = new Matrix1(new Float32Array([1 / I.a]), Unit.div(Unit.ONE, I.uom));
    };
    return Rod2;
}(RigidBody2));
export { Rod2 };
