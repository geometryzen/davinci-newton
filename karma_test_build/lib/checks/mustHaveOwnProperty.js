"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var mustBeDefined_1 = require("../checks/mustBeDefined");
var mustSatisfy_1 = require("../checks/mustSatisfy");
function haveOwnProperty(prop) {
    return function () {
        return "have own property `" + prop + "`";
    };
}
function mustHaveOwnProperty(name, value, prop, contextBuilder) {
    mustBeDefined_1.default('name', name);
    mustBeDefined_1.default('prop', prop);
    if (isDefined_1.default(value)) {
        if (!value.hasOwnProperty(prop)) {
            mustSatisfy_1.default(name, false, haveOwnProperty(prop), contextBuilder);
        }
    }
    else {
        mustBeDefined_1.default(name, value, contextBuilder);
    }
}
exports.default = mustHaveOwnProperty;
