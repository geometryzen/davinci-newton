"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpinorE2 = void 0;
var isNull_1 = require("../checks/isNull");
var isNumber_1 = require("../checks/isNumber");
var isObject_1 = require("../checks/isObject");
/**
 * Determines whether the argument supports the SpinorE2 interface.
 * The argument must be a non-null object and must support the a, and xy numeric properties.
 */
function isSpinorE2(v) {
    if (isObject_1.default(v) && !isNull_1.default(v)) {
        return isNumber_1.default(v.a) && isNumber_1.default(v.xy);
    }
    else {
        return false;
    }
}
exports.isSpinorE2 = isSpinorE2;
