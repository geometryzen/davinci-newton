"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isDefined_1 = require("../checks/isDefined");
function beDefined() {
    return "not be 'undefined'";
}
function mustBeDefined(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
    return value;
}
exports.default = mustBeDefined;
