"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isArray_1 = require("../checks/isArray");
function beAnArray() {
    return "be an array";
}
function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
    return value;
}
exports.default = default_1;
