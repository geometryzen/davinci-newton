"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertConsistentUnits = void 0;
var Unit_1 = require("../math/Unit");
/**
 * Asserts that the specified quantities are either both dimensionless or neither dimensionless.
 * If either measure is zero, the unit of dimensions are meaningless and can be ignored.
 */
function assertConsistentUnits(aName, A, bName, B, metric) {
    if (!metric.isZero(A) && !metric.isZero(B)) {
        if (Unit_1.Unit.isOne(metric.uom(A))) {
            if (!Unit_1.Unit.isOne(metric.uom(B))) {
                throw new Error(aName + " => " + A + " must have dimensions if " + bName + " => " + B + " has dimensions.");
            }
        }
        else {
            if (Unit_1.Unit.isOne(metric.uom(B))) {
                throw new Error(bName + " => " + B + " must have dimensions if " + aName + " => " + A + " has dimensions.");
            }
        }
    }
}
exports.assertConsistentUnits = assertConsistentUnits;
