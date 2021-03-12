import { Metric } from "./Metric";
/**
 * Asserts that the specified quantities are either both dimensionless or neither dimensionless.
 * If either measure is zero, the unit of dimensions are meaningless and can be ignored.
 * @hidden
 */
export declare function assertConsistentUnits<T>(aName: string, A: T, bName: string, B: T, metric: Metric<T>): void;
