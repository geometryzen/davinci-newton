import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
var GeometricConstraint = /** @class */ (function () {
    function GeometricConstraint(body, normalFn) {
        this.body = body;
        this.normalFn = normalFn;
        mustBeNonNullObject('body', body);
        var metric = body.metric;
        this.N = metric.zero();
    }
    GeometricConstraint.prototype.getBody = function () {
        return this.body;
    };
    GeometricConstraint.prototype.computeNormal = function (x, N) {
        this.normalFn(x, N);
    };
    GeometricConstraint.prototype.setForce = function (N) {
        var metric = this.body.metric;
        metric.copyVector(N, this.N);
    };
    return GeometricConstraint;
}());
export { GeometricConstraint };
