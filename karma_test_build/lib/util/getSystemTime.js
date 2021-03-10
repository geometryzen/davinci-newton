"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the current time as given by the system clock, in seconds.
 */
function getSystemTime() {
    return Date.now() * 1E-3;
}
exports.default = getSystemTime;
