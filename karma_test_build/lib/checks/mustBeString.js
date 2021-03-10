"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isString_1 = require("../checks/isString");
function beAString() {
    return "be a string";
}
function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
    return value;
}
exports.default = default_1;
