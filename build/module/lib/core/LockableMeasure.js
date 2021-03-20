import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
/**
 * @hidden
 */
var LockableMeasure = /** @class */ (function () {
    /**
     *
     * @param metric
     * @param initialValue A value that is copied.
     */
    function LockableMeasure(metric, initialValue) {
        this.metric = metric;
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('initialValue', initialValue);
        this.$value = metric.zero();
        metric.copy(initialValue, this.$value);
        this.lock();
    }
    LockableMeasure.prototype.get = function () {
        return this.$value;
    };
    /**
     * 1. Asserts that the value is defined and not null.
     * 2. Unlocks the `this` value.
     * 3. Copies the value to the `this` value.
     * 4. Locks the `this` value.
     *
     * @param value The value to be set into `this` value.
     */
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
