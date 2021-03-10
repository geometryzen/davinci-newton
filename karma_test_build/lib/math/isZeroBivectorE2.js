"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZeroBivectorE2 = void 0;
/**
 * Returns true if all coordinates of the bivector are exactly zero.
 */
function isZeroBivectorE2(m) {
    return m.xy === 0;
}
exports.isZeroBivectorE2 = isZeroBivectorE2;
