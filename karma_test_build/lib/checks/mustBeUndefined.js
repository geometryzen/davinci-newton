"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isUndefined_1 = require("../checks/isUndefined");
function beUndefined() {
    return "be 'undefined'";
}
function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isUndefined_1.default(value), beUndefined, contextBuilder);
    return value;
}
exports.default = default_1;
