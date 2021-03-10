"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var removeAt_1 = require("./removeAt");
/**
 * Removes the first occurrence of a particular value from an array.
 * @param xs Array from which to remove value.
 * @param x Object to remove.
 * @return True if an element was removed.
 */
function remove(xs, x) {
    var i = xs.indexOf(x);
    var rv;
    if ((rv = i >= 0)) {
        removeAt_1.default(xs, i);
    }
    return rv;
}
exports.default = remove;
