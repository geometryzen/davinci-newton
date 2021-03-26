import { __extends } from "tslib";
import { Geometric2 } from "../math/Geometric2";
import { Matrix1 } from "../math/Matrix1";
import { Unit } from "../math/Unit";
import { RigidBody2 } from "./RigidBody2";
/**
 * @hidden
 */
var fromVector = Geometric2.fromVector;
var Polygon2 = /** @class */ (function (_super) {
    __extends(Polygon2, _super);
    function Polygon2(points) {
        var _this = _super.call(this) || this;
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
        if (points.every(function (point) { return Unit.isOne(point.uom); })) {
            // dimensionless
            _this.updateInertiaTensor();
        }
        else {
            // Changing the mass will trigger an update of the inertia tensor.
            _this.M = Geometric2.scalar(_this.M.a, Unit.KILOGRAM);
            _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
            _this.X.uom = Unit.METER;
            _this.R.uom = Unit.ONE;
            _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            _this.L.uom = Unit.JOULE_SECOND;
        }
        return _this;
    }
    /**
     * The inertia tensor matrix must be updated any time the geometry changes.
     * The geometry is defined by the total mass, M, and the positions of the vertices.
     */
    Polygon2.prototype.updateInertiaTensor = function () {
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
        var matrixInv = Matrix1.one();
        matrixInv.setElement(0, 0, 1 / I.a);
        matrixInv.uom = Unit.div(Unit.ONE, I.uom);
        this.Iinv = matrixInv;
    };
    return Polygon2;
}(RigidBody2));
export { Polygon2 };
/**
 * @hidden
 * @param xs
 * @returns
 */
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
/**
 * @hidden
 * @param xs
 * @returns
 */
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
/**
 * @hidden
 * @param xs
 */
function mustBeAtLeastThreePoints(xs) {
    var N = xs.length;
    if (N >= 3) {
        // Test for non-collinear?
    }
    else {
        throw new Error("must be at least 3 points.");
    }
}
