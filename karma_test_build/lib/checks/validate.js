"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("./isDefined");
/**
 * Helper function for validating a named value and providing a default.
 */
function validate(name, value, defaultValue, assertFn) {
    if (isDefined_1.default(value)) {
        return assertFn(name, value);
    }
    else {
        return defaultValue;
    }
}
exports.default = validate;
