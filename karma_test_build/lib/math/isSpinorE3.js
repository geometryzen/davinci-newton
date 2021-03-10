"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isNull_1 = require("../checks/isNull");
var isNumber_1 = require("../checks/isNumber");
var isObject_1 = require("../checks/isObject");
/**
 * Determines whether the argument supports the SpinorE3 interface.
 * The argument must be a non-null object and must support the a, xy, yz, and zx numeric properties.
 */
function isSpinorE3(v) {
    if (isObject_1.default(v) && !isNull_1.default(v)) {
        return isNumber_1.default(v.a) && isNumber_1.default(v.xy) && isNumber_1.default(v.yz) && isNumber_1.default(v.zx);
    }
    else {
        return false;
    }
}
exports.default = isSpinorE3;
