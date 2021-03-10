"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskG2 = void 0;
var isNumber_1 = require("../checks/isNumber");
var isObject_1 = require("../checks/isObject");
var Unit_1 = require("./Unit");
var ONE = void 0; // Unit.ONE;
var scratch = { a: 0, x: 0, y: 0, xy: 0, b: 0, uom: ONE };
/**
 * "Promotes" the argument to a GeometricE2.
 */
function maskG2(arg) {
    var duck = arg;
    if (isObject_1.default(arg) && 'grades' in arg) {
        var g = arg;
        if (duck.grades & 0x1) {
            scratch.a = g.a;
        }
        else {
            scratch.a = 0;
        }
        if (duck.grades & 0x2) {
            scratch.x = g.x;
            scratch.y = g.y;
        }
        else {
            scratch.x = 0;
            scratch.y = 0;
        }
        if (duck.grades & 0x4) {
            scratch.xy = g.xy;
        }
        else {
            scratch.xy = 0;
        }
        scratch.uom = Unit_1.Unit.mustBeUnit('g.uom', g.uom);
        return scratch;
    }
    else if (isNumber_1.default(arg)) {
        scratch.a = arg;
        scratch.x = 0;
        scratch.y = 0;
        scratch.xy = 0;
        scratch.b = 0;
        scratch.uom = ONE;
        return scratch;
    }
    else {
        return void 0;
    }
}
exports.maskG2 = maskG2;
