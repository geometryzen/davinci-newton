import { Metric } from "./Metric";
/**
 * @hidden
 */
export declare class LockableMeasure<T> {
    private readonly metric;
    private readonly $value;
    private $lock;
    /**
     *
     * @param metric
     * @param initialValue A value that is copied.
     */
    constructor(metric: Metric<T>, initialValue: T);
    get(): T;
    /**
     * 1. Asserts that the value is defined and not null.
     * 2. Unlocks the `this` value.
     * 3. Copies the value to the `this` value.
     * 4. Locks the `this` value.
     *
     * @param value The value to be set into `this` value.
     */
    set(value: T): void;
    lock(): T;
    unlock(): T;
}
