import { Unit } from "../math/Unit";
import { Metric } from "./Metric";
/**
 * @hidden
 * @param name
 * @param value
 * @param unit
 * @param metric
 * @returns
 */
export declare function mustBeDimensionlessOrCorrectUnits<T>(name: string, value: T, unit: Unit, metric: Metric<T>): T;
