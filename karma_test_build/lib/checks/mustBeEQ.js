"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isEQ_1 = require("../checks/isEQ");
function mustBeEQ(name, value, limit, contextBuilder) {
    mustSatisfy_1.default(name, isEQ_1.default(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
    return value;
}
exports.default = mustBeEQ;
