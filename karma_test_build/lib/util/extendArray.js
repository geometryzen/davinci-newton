"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = require("../checks/isArray");
/**
 * Returns a new array which is an expanded copy of the given array.
 * Adds `quantity` new entries at `position` location in the array.
 * Negative quantity will delete array entries.
 */
function extendArray(array, quantity, value) {
    if (quantity === 0) {
        return;
    }
    if (quantity < 0) {
        throw new Error();
    }
    var startIdx = array.length;
    array.length = startIdx + quantity;
    if (isArray_1.default(value)) {
        var vs = value;
        if (vs.length !== quantity) {
            throw new Error();
        }
        for (var i = startIdx, n = array.length; i < n; i++) {
            array[i] = value[i - startIdx];
        }
    }
    else {
        for (var i = startIdx, n = array.length; i < n; i++) {
            array[i] = value;
        }
    }
}
exports.default = extendArray;
