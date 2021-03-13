import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
/**
 * @hidden
 */
var LockableMeasure = /** @class */ (function () {
    function LockableMeasure(metric, initialValue) {
        this.metric = metric;
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('initialValue', initialValue);
        this.$value = initialValue;
        this.lock();
    }
    LockableMeasure.prototype.get = function () {
        return this.$value;
    };
    LockableMeasure.prototype.set = function (value) {
        mustBeNonNullObject('value', value);
        this.metric.copy(value, this.unlock());
        this.lock();
    };
    LockableMeasure.prototype.lock = function () {
        var value = this.$value;
        this.$lock = this.metric.lock(value);
        return value;
    };
    LockableMeasure.prototype.unlock = function () {
        var value = this.$value;
        this.metric.unlock(value, this.$lock);
        return value;
    };
    return LockableMeasure;
}());
export { LockableMeasure };
