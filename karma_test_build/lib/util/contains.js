"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function contains(xs, x) {
    var N = xs.length;
    for (var i = 0; i < N; i++) {
        if (xs[i] === x) {
            return true;
        }
    }
    return false;
}
exports.default = contains;