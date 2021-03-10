"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVectorE2 = void 0;
var isNull_1 = require("../checks/isNull");
var isNumber_1 = require("../checks/isNumber");
var isObject_1 = require("../checks/isObject");
/**
 * Determines whether the argument supports the VectorE3 interface.
 * The argument must be a non-null object and must support the x, y, and z numeric properties.
 * @deprecated Do not use this because it could accept types that have scalar and bivector components.
 */
function isVectorE2(v) {
    if (isObject_1.default(v) && !isNull_1.default(v)) {
        return isNumber_1.default(v.x) && isNumber_1.default(v.y);
    }
    else {
        return false;
    }
}
exports.isVectorE2 = isVectorE2;
