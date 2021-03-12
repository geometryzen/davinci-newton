import { Geometric3 } from "../math/Geometric3";
import { Mat3 } from "../math/Mat3";
import { Matrix3 } from "../math/Matrix3";
/**
 * @hidden
 */
var Euclidean3 = /** @class */ (function () {
    function Euclidean3() {
    }
    Euclidean3.prototype.a = function (mv) {
        return mv.a;
    };
    Euclidean3.prototype.add = function (lhs, rhs) {
        return lhs.add(rhs);
    };
    Euclidean3.prototype.addVector = function (lhs, rhs) {
        return lhs.addVector(rhs);
    };
    Euclidean3.prototype.applyMatrix = function (mv, matrix) {
        throw new Error("applyMatrix(mv, matrix) method not implemented.");
    };
    Euclidean3.prototype.copy = function (source, target) {
        return target.copy(source);
    };
    Euclidean3.prototype.copyBivector = function (source, target) {
        return target.copyBivector(source);
    };
    Euclidean3.prototype.copyMatrix = function (m) {
        return new Mat3(m);
    };
    Euclidean3.prototype.copyVector = function (source, target) {
        return target.copyVector(source);
    };
    Euclidean3.prototype.copyScalar = function (a, uom, target) {
        return target.copyScalar(a, uom);
    };
    Euclidean3.prototype.direction = function (mv, mutate) {
        return mv.direction(mutate);
    };
    Euclidean3.prototype.divByScalar = function (lhs, a, uom) {
        return lhs.divByScalar(a, uom);
    };
    Euclidean3.prototype.identityMatrix = function () {
        return new Mat3(Matrix3.one());
    };
    Euclidean3.prototype.invertMatrix = function (m) {
        var I = Matrix3.zero().copy(m).inv();
        return new Mat3(I);
    };
    Euclidean3.prototype.isZero = function (mv) {
        return mv.isZero();
    };
    Euclidean3.prototype.lock = function (mv) {
        return mv.lock();
    };
    Euclidean3.prototype.magnitude = function (mv, mutate) {
        return mv.magnitude(mutate);
    };
    Euclidean3.prototype.mulByNumber = function (lhs, alpha) {
        return lhs.mulByNumber(alpha);
    };
    Euclidean3.prototype.mulByScalar = function (lhs, a, uom) {
        return lhs.mulByScalar(a, uom);
    };
    Euclidean3.prototype.mulByVector = function (lhs, rhs) {
        return lhs.mulByVector(rhs);
    };
    Euclidean3.prototype.neg = function (mv) {
        return mv.neg();
    };
    Euclidean3.prototype.quaditude = function (mv, mutate) {
        return mv.quaditude(mutate);
    };
    Euclidean3.prototype.rev = function (mv) {
        return mv.rev();
    };
    Euclidean3.prototype.rotate = function (mv, spinor) {
        return mv.rotate(spinor);
    };
    Euclidean3.prototype.scalar = function (a, uom) {
        return Geometric3.scalar(a, uom);
    };
    Euclidean3.prototype.scp = function (lhs, rhs) {
        return lhs.scp(rhs);
    };
    Euclidean3.prototype.setUom = function (mv, uom) {
        mv.uom = uom;
    };
    Euclidean3.prototype.sub = function (lhs, rhs) {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.sub(rhs);
    };
    Euclidean3.prototype.subScalar = function (lhs, rhs) {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subScalar(rhs);
    };
    Euclidean3.prototype.subVector = function (lhs, rhs) {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subVector(rhs);
    };
    Euclidean3.prototype.unlock = function (mv, token) {
        mv.unlock(token);
    };
    Euclidean3.prototype.uom = function (mv) {
        return mv.uom;
    };
    Euclidean3.prototype.ext = function (lhs, rhs) {
        return lhs.ext(rhs);
    };
    Euclidean3.prototype.write = function (source, target) {
        source.write(target);
    };
    Euclidean3.prototype.writeVector = function (source, target) {
        source.writeVector(target);
    };
    Euclidean3.prototype.zero = function () {
        return Geometric3.zero.clone();
    };
    return Euclidean3;
}());
export { Euclidean3 };
