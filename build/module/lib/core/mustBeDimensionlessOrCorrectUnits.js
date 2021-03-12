import { Unit } from "../math/Unit";
/**
 * @hidden
 * @param name
 * @param value
 * @param unit
 * @param metric
 * @returns
 */
export function mustBeDimensionlessOrCorrectUnits(name, value, unit, metric) {
    if (!Unit.isOne(metric.uom(value)) && !Unit.isCompatible(metric.uom(value), unit)) {
        throw new Error(name + " unit of measure, " + metric.uom(value) + ", must be compatible with " + unit);
    }
    else {
        return value;
    }
}
