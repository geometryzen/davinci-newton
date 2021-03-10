"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZeroGeometricE2 = void 0;
var isZeroBivectorE2_1 = require("./isZeroBivectorE2");
var isZeroVectorE2_1 = require("./isZeroVectorE2");
/**
 * Returns true if all coordinates of the vector are exactly zero.
 */
function isZeroGeometricE2(m) {
    return isZeroVectorE2_1.isZeroVectorE2(m) && isZeroBivectorE2_1.isZeroBivectorE2(m) && m.a === 0 && m.b === 0;
}
exports.isZeroGeometricE2 = isZeroGeometricE2;
