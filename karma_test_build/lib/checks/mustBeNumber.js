"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isNumber_1 = require("../checks/isNumber");
function beANumber() {
    return "be a `number`";
}
function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
    return value;
}
exports.default = default_1;
