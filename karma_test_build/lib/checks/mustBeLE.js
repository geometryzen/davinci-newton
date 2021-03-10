"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isLE_1 = require("../checks/isLE");
function default_1(name, value, limit, contextBuilder) {
    mustSatisfy_1.default(name, isLE_1.default(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
    return value;
}
exports.default = default_1;
