import { __extends } from "tslib";
import { RigidBody } from "../core/RigidBody";
import { Geometric2 } from "../math/Geometric2";
import { Matrix1 } from "../math/Matrix1";
import { Euclidean2 } from "./Euclidean2";
var fromVector = Geometric2.fromVector;
var PolygonRigidBody2 = /** @class */ (function (_super) {
    __extends(PolygonRigidBody2, _super);
    function PolygonRigidBody2(points) {
        var _this = _super.call(this, new Euclidean2()) || this;
        /**
         * The position of the polygon point relative to the center of mass.
         *
         * r = x - X, where x is the world position, X is the center of mass.
         */
        _this.rs = [];
        mustBeAtLeastThreePoints(points);
        var X = centerOfMass(points);
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            var r = fromVector(point).sub(X);
            r.lock();
            _this.rs.push(r);
        }
        _this.X = X;
        _this.updateInertiaTensor();
        return _this;
    }
    /**
     * The inertia tensor matrix must be updated any time the geometry changes.
     * The geometry is defined by the total mass, M, and the positions of the vertices.
     */
    PolygonRigidBody2.prototype.updateInertiaTensor = function () {
        var matrix = Matrix1.one();
        var rs = this.rs;
        var N = rs.length;
        var numer = new Geometric2();
        var denom = new Geometric2();
        for (var i = 0; i < N; i++) {
            var ith = rs[i];
            var nxt = rs[(i + 1) % N];
            var A = nxt.ext(ith);
            var s = ith.scp(ith).add(ith.scp(nxt)).add(nxt.scp(nxt));
            numer.add(A.mul(s));
            denom.add(A);
        }
        var I = this.M.mul(numer).divByNumber(6).divByPseudo(denom.b, denom.uom);
        matrix.setElement(0, 0, I.a);
        matrix.uom = I.uom;
        this.I = matrix;
    };
    return PolygonRigidBody2;
}(RigidBody));
export { PolygonRigidBody2 };
function polygonArea(xs) {
    var N = xs.length;
    var A = new Geometric2();
    var ΔA = new Geometric2();
    for (var i = 0; i < N; i++) {
        ΔA.copy(xs[i]).ext(xs[(i + 1) % N]).mulByNumber(0.5);
        A.add(ΔA);
    }
    return A;
}
function centerOfMass(xs) {
    var N = xs.length;
    var X = new Geometric2();
    for (var i = 0; i < N; i++) {
        var a = xs[i];
        var b = xs[(i + 1) % N];
        var w = fromVector(a).ext(b);
        var v = fromVector(a).add(b);
        var vw = fromVector(v).mul(w);
        X.add(vw);
    }
    var A = polygonArea(xs);
    X.divByPseudo(A.b, A.uom);
    X.divByNumber(6);
    return X;
}
function mustBeAtLeastThreePoints(xs) {
    var N = xs.length;
    if (N > 3) {
        // Test for non-collinear.
    }
    else {
        throw new Error("must be at least 3 points.");
    }
}
