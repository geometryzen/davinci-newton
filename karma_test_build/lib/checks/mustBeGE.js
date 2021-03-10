"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isGE_1 = require("../checks/isGE");
function default_1(name, value, limit, contextBuilder) {
    mustSatisfy_1.default(name, isGE_1.default(value, limit), function () { return "be greater than or equal to " + limit; }, contextBuilder);
    return value;
}
exports.default = default_1;
