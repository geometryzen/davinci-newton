"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QQ_1 = require("./QQ");
describe("QQ", function () {
    describe("constructor", function () {
        it("numer matches construction argument", function () {
            var x = QQ_1.QQ.valueOf(3, 5);
            expect(x.numer).toBe(3);
        });
        it("denom matches construction argument", function () {
            var x = QQ_1.QQ.valueOf(3, 5);
            expect(x.denom).toBe(5);
        });
        it("Construction", function () {
            var x = QQ_1.QQ.valueOf(1, 1);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(1);
        });
        it("Construction on zero", function () {
            var x = QQ_1.QQ.valueOf(0, 1);
            expect(x.numer).toBe(0);
            expect(x.denom).toBe(1);
        });
        it("GCD", function () {
            var x = QQ_1.QQ.valueOf(2, 2);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(1);
        });
        it("Canonical (-1,3) => (-1,3)", function () {
            var x = QQ_1.QQ.valueOf(-1, 3);
            expect(x.numer).toBe(-1);
            expect(x.denom).toBe(3);
        });
        it("Canonical (1,-3) => (-1,3)", function () {
            var x = QQ_1.QQ.valueOf(1, -3);
            expect(x.numer).toBe(-1);
            expect(x.denom).toBe(3);
        });
        it("add QQ", function () {
            var x = QQ_1.QQ.valueOf(1, 3);
            var y = QQ_1.QQ.valueOf(2, 1);
            var sum = x.add(y);
            expect(sum.numer).toBe(7);
            expect(sum.denom).toBe(3);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(3);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("sub QQ", function () {
            var x = QQ_1.QQ.valueOf(1, 3);
            var y = QQ_1.QQ.valueOf(2, 1);
            var sum = x.sub(y);
            expect(sum.numer).toBe(-5);
            expect(sum.denom).toBe(3);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(3);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("mul", function () {
            var x = QQ_1.QQ.valueOf(1, 3);
            var y = QQ_1.QQ.valueOf(2, 1);
            var sum = x.mul(y);
            expect(sum.numer).toBe(2);
            expect(sum.denom).toBe(3);
            expect(x.numer).toBe(1);
            expect(x.denom).toBe(3);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("div", function () {
            var x = QQ_1.QQ.valueOf(0, 1);
            var y = QQ_1.QQ.valueOf(2, 1);
            var q = x.div(y);
            expect(q.numer).toBe(0);
            expect(q.denom).toBe(1);
            expect(x.numer).toBe(0);
            expect(x.denom).toBe(1);
            expect(y.numer).toBe(2);
            expect(y.denom).toBe(1);
        });
        it("neg() should change the sign of the numerator", function () {
            var x = QQ_1.QQ.valueOf(1, 3);
            var n = x.neg();
            expect(x.numer).toBe(+1);
            expect(n.numer).toBe(-1);
        });
        it("neg() should leave the denominator unchanged", function () {
            var x = QQ_1.QQ.valueOf(1, 3);
            var n = x.neg();
            expect(x.denom).toBe(+3);
            expect(n.denom).toBe(+3);
        });
        it("toString", function () {
            var x = QQ_1.QQ.valueOf(1, 2);
            expect("" + x).toBe("1/2");
        });
        describe("valueOf", function () {
            it("should return an equivalent number", function () {
                for (var n = -10; n < 10; n++) {
                    for (var d = -10; d < 10; d++) {
                        if (d !== 0) {
                            var x = QQ_1.QQ.valueOf(n, d);
                            expect(x.numer * d).toBe(x.denom * n);
                            if (n === 0) {
                                expect(x).toEqual(QQ_1.QQ.valueOf(0, 1));
                            }
                            else if (n === +d) {
                                expect(x).toEqual(QQ_1.QQ.valueOf(+1, 1));
                            }
                            else if (n === -d) {
                                expect(x).toEqual(QQ_1.QQ.valueOf(-1, 1));
                            }
                        }
                    }
                }
            });
        });
    });
});
