"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if all coordinates of the vector are exactly zero.
 */
function isZeroVectorE3(v) {
    return v.x === 0 && v.y === 0 && v.z === 0;
}
exports.default = isZeroVectorE3;
