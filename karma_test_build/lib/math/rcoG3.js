"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compG3Get_1 = require("./compG3Get");
var compG3Set_1 = require("./compG3Set");
var rcoE3_1 = require("./rcoE3");
var Unit_1 = require("./Unit");
function rcoG3(a, b, out) {
    out.uom = Unit_1.Unit.mul(a.uom, b.uom);
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
        compG3Set_1.default(out, i, rcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
}
exports.default = rcoG3;
