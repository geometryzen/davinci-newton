"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotVectorE2 = void 0;
/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
function dotVectorE2(a, b) {
    return a.x * b.x + a.y * b.y;
}
exports.dotVectorE2 = dotVectorE2;
