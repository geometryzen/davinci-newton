"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isInteger_1 = require("../checks/isInteger");
function beAnInteger() {
    return "be an integer";
}
function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
    return value;
}
exports.default = mustBeInteger;
