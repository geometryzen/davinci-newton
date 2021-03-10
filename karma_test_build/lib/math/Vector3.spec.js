"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Matrix3_1 = require("./Matrix3");
var Spinor3_1 = require("./Spinor3");
var Unit_1 = require("./Unit");
var Vector3_1 = require("./Vector3");
describe("Vector3", function () {
    describe("", function () {
        var s = new Spinor3_1.Spinor3(1 / Math.SQRT1_2, 1 / Math.SQRT1_2, 0, 0).normalize();
        var m = Matrix3_1.Matrix3.zero().rotation(s);
        var u = new Vector3_1.Vector3(1, 0, 0, Unit_1.Unit.METER).applyMatrix(m);
        var v = new Vector3_1.Vector3(1, 0, 0, Unit_1.Unit.METER).rotate(s);
        it("", function () {
            expect(s.magnitude()).toBe(1);
            expect(u.x).toBeCloseTo(v.x, 15);
            expect(u.y).toBeCloseTo(v.y, 15);
            expect(u.z).toBeCloseTo(v.z, 15);
        });
    });
});
