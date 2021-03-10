"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isLT_1 = require("../checks/isLT");
function default_1(name, value, limit, contextBuilder) {
    mustSatisfy_1.default(name, isLT_1.default(value, limit), function () { return "be less than " + limit; }, contextBuilder);
    return value;
}
exports.default = default_1;
