"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mustBeBivectorE3(name, B) {
    if (isNaN(B.yz) || isNaN(B.zx) || isNaN(B.xy)) {
        throw new Error(name + ", (" + B.yz + ", " + B.zx + ", " + B.xy + "), must be a BivectorE3.");
    }
    return B;
}
exports.default = mustBeBivectorE3;
