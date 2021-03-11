import { Geometric2 } from "../math/Geometric2";
import { Mat1 } from "../math/Mat1";
var Euclidean2 = /** @class */ (function () {
    function Euclidean2() {
    }
    Euclidean2.prototype.a = function (mv) {
        return mv.a;
    };
    Euclidean2.prototype.add = function (lhs, rhs) {
        return lhs.add(rhs);
    };
    Euclidean2.prototype.addVector = function (lhs, rhs) {
        return lhs.addVector(rhs);
    };
    Euclidean2.prototype.applyMatrix = function (mv, matrix) {
        throw new Error("applyMatrix(mv, matrix) method not implemented.");
    };
    Euclidean2.prototype.copy = function (source, target) {
        return target.copy(source);
    };
    Euclidean2.prototype.copyBivector = function (source, target) {
        return target.copyBivector(source);
    };
    Euclidean2.prototype.copyMatrix = function (m) {
        if (m.dimensions !== 1) {
            throw new Error("matrix dimensions must be 1.");
        }
        var value = m.getElement(0, 0);
        return new Mat1(value);
    };
    Euclidean2.prototype.copyVector = function (source, target) {
        return target.copyVector(source);
    };
    Euclidean2.prototype.copyScalar = function (a, uom, target) {
        return target.copyScalar(a, uom);
    };
    Euclidean2.prototype.direction = function (mv, mutate) {
        return mv.direction(mutate);
    };
    Euclidean2.prototype.divByScalar = function (lhs, a, uom) {
        return lhs.divByScalar(a, uom);
    };
    Euclidean2.prototype.identityMatrix = function () {
        return new Mat1(1);
    };
    Euclidean2.prototype.invertMatrix = function (m) {
        if (m.dimensions !== 1) {
            throw new Error("matrix dimensions must be 1.");
        }
        var value = m.getElement(0, 0);
        return new Mat1(1 / value);
    };
    Euclidean2.prototype.isZero = function (mv) {
        return mv.isZero();
    };
    Euclidean2.prototype.lock = function (mv) {
        return mv.lock();
    };
    Euclidean2.prototype.magnitude = function (mv, mutate) {
        return mv.magnitude(mutate);
    };
    Euclidean2.prototype.mulByNumber = function (lhs, alpha) {
        return lhs.mulByNumber(alpha);
    };
    Euclidean2.prototype.mulByScalar = function (lhs, a, uom) {
        return lhs.mulByScalar(a, uom);
    };
    Euclidean2.prototype.mulByVector = function (lhs, rhs) {
        return lhs.mulByVector(rhs);
    };
    Euclidean2.prototype.neg = function (mv) {
        return mv.neg();
    };
    Euclidean2.prototype.quaditude = function (mv, mutate) {
        return mv.quaditude(mutate);
    };
    Euclidean2.prototype.rev = function (mv) {
        return mv.rev();
    };
    Euclidean2.prototype.rotate = function (mv, spinor) {
        return mv.rotate(spinor);
    };
    Euclidean2.prototype.scalar = function (a, uom) {
        return Geometric2.scalar(a, uom);
    };
    Euclidean2.prototype.scp = function (lhs, rhs) {
        return lhs.scp(rhs);
    };
    Euclidean2.prototype.setUom = function (mv, uom) {
        mv.uom = uom;
    };
    Euclidean2.prototype.sub = function (lhs, rhs) {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.sub(rhs, 1);
    };
    Euclidean2.prototype.subScalar = function (lhs, rhs) {
        return lhs.subScalar(rhs.a, rhs.uom, 1);
    };
    Euclidean2.prototype.subVector = function (lhs, rhs) {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subVector(rhs);
    };
    Euclidean2.prototype.unlock = function (mv, token) {
        mv.unlock(token);
    };
    Euclidean2.prototype.uom = function (mv) {
        return mv.uom;
    };
    Euclidean2.prototype.ext = function (lhs, rhs) {
        return lhs.ext(rhs);
    };
    Euclidean2.prototype.write = function (source, target) {
        source.write(target);
    };
    Euclidean2.prototype.writeVector = function (source, target) {
        source.writeVector(target);
    };
    Euclidean2.prototype.zero = function () {
        return Geometric2.zero.clone();
    };
    return Euclidean2;
}());
export { Euclidean2 };
