"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isNull_1 = require("./isNull");
describe("isNull", function () {
    it("should be a function", function () {
        expect(typeof isNull_1.default === 'function').toBe(true);
    });
    it("(null) should be true", function () {
        expect(isNull_1.default(null)).toBe(true);
    });
    it("(void 0) should be false", function () {
        expect(isNull_1.default(void 0)).toBe(false);
    });
    it("({}) should be false", function () {
        expect(isNull_1.default({})).toBe(false);
    });
    it("('') should be false", function () {
        expect(isNull_1.default('')).toBe(false);
    });
    it("(' ') should be false", function () {
        expect(isNull_1.default(' ')).toBe(false);
    });
    it("(0) should be false", function () {
        expect(isNull_1.default(0)).toBe(false);
    });
    it("(1) should be false", function () {
        expect(isNull_1.default(1)).toBe(false);
    });
    it("(NaN) should be false", function () {
        expect(isNull_1.default(NaN)).toBe(false);
    });
    it("(Infinity) should be false", function () {
        expect(isNull_1.default(Infinity)).toBe(false);
    });
    it("(true) should be false", function () {
        expect(isNull_1.default(true)).toBe(false);
    });
    it("(false) should be false", function () {
        expect(isNull_1.default(false)).toBe(false);
    });
});
