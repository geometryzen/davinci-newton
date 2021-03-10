"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeDimensionlessOrCorrectUnits = void 0;
var Unit_1 = require("../math/Unit");
function mustBeDimensionlessOrCorrectUnits(name, value, unit, metric) {
    if (!Unit_1.Unit.isOne(metric.uom(value)) && !Unit_1.Unit.isCompatible(metric.uom(value), unit)) {
        throw new Error(name + " unit of measure, " + metric.uom(value) + ", must be compatible with " + unit);
    }
    else {
        return value;
    }
}
exports.mustBeDimensionlessOrCorrectUnits = mustBeDimensionlessOrCorrectUnits;
