import { Metric } from "./Metric";
/**
 * @hidden
 */
export declare class LockableMeasure<T> {
    private readonly metric;
    private readonly $value;
    private $lock;
    constructor(metric: Metric<T>, initialValue: T);
    get(): T;
    set(value: T): void;
    lock(): T;
    unlock(): T;
}
