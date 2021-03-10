"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isZeroBivectorE3_1 = require("./isZeroBivectorE3");
var isZeroVectorE3_1 = require("./isZeroVectorE3");
/**
 * Returns true if all coordinates of the vector are exactly zero.
 */
function isZeroGeometricE3(m) {
    return isZeroVectorE3_1.default(m) && isZeroBivectorE3_1.default(m) && m.a === 0 && m.b === 0;
}
exports.default = isZeroGeometricE3;
