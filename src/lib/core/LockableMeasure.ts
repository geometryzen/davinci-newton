import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { Metric } from "./Metric";

/**
 * @hidden
 */
export class LockableMeasure<T> {
    private readonly $value: T;
    private $lock: number;
    constructor(private readonly metric: Metric<T>, initialValue: T) {
        mustBeNonNullObject('metric', metric);
        mustBeNonNullObject('initialValue', initialValue);
        this.$value = initialValue;
        this.lock();
    }
    get(): T {
        return this.$value;
    }
    set(value: T): void {
        mustBeNonNullObject('value', value);
        this.metric.copy(value, this.unlock());
        this.lock();
    }
    lock(): T {
        const value = this.$value;
        this.$lock = this.metric.lock(value);
        return value;
    }
    unlock(): T {
        const value = this.$value;
        this.metric.unlock(value, this.$lock);
        return value;
    }
}
