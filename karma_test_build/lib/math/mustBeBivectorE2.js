"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeBivectorE2 = void 0;
function mustBeBivectorE2(name, B) {
    if (isNaN(B.xy)) {
        throw new Error(name + ", (" + B.xy + "), must be a BivectorE2.");
    }
    return B;
}
exports.mustBeBivectorE2 = mustBeBivectorE2;
