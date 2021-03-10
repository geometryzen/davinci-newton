"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if all coordinates of the bivector are exactly zero.
 */
function isZeroBivectorE3(m) {
    return m.yz === 0 && m.zx === 0 && m.xy === 0;
}
exports.default = isZeroBivectorE3;
