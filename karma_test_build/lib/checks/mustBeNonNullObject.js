"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isNull_1 = require("../checks/isNull");
var isObject_1 = require("../checks/isObject");
function beObject() {
    return "be a non-null `object`";
}
function mustBeObject(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isObject_1.default(value) && !isNull_1.default(value), beObject, contextBuilder);
    return value;
}
exports.default = mustBeObject;
