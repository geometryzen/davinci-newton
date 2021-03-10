"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findIndex_1 = require("./findIndex");
/**
 * Search an array for the first element that satisfies a given condition and
 * return that element. Returns the first array element that passes the test,
 * or null if no element is found.
 */
function find(xs, test) {
    var i = findIndex_1.default(xs, test);
    return i < 0 ? null : xs[i];
}
exports.default = find;
