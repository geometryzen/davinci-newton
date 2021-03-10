"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Throws an error if the argument is not a finite number.
 * @param value the number to test
 * @return the value that passed the test
 * @throws if the argument is not a finite number
 */
function mustBeFinite(value) {
    if (typeof value !== 'number' || !isFinite(value)) {
        throw new Error('not a finite number ' + value);
    }
    return value;
}
exports.default = mustBeFinite;
