"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns an array consisting of the given `value` repeated `N` times.
 */
function repeat(value, N) {
    var xs = [];
    for (var i = 0; i < N; i++) {
        xs[i] = value;
    }
    return xs;
}
exports.default = repeat;
