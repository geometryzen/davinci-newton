"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gauss_1 = require("./gauss");
describe("gauss", function () {
    it("4x = 8", function () {
        var A = [[4]];
        var b = [8];
        var result = gauss_1.gauss(A, b);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(2);
    });
    it("x + y = 10, 2x + y = 16", function () {
        var A = [[1, 1], [2, 1]];
        var b = [10, 16];
        var result = gauss_1.gauss(A, b);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(6);
        expect(result[1]).toBe(4);
    });
    it("x + y + z = 6, 2x + y + 2z = 10, x + 2y + 3z = 14", function () {
        var A = [[1, 1, 1], [2, 1, 2], [1, 2, 3]];
        var b = [6, 10, 14];
        var result = gauss_1.gauss(A, b);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
    });
});
