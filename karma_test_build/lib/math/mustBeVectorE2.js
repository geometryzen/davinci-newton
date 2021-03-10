"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeVectorE2 = void 0;
function mustBeVectorE2(name, v) {
    if (isNaN(v.x) || isNaN(v.y)) {
        throw new Error(name + ", (" + v.x + ", " + v.y + "), must be a VectorE2.");
    }
    return v;
}
exports.mustBeVectorE2 = mustBeVectorE2;
