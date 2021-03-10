"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric2_1 = require("./Geometric2");
var Unit_1 = require("./Unit");
var one = Geometric2_1.Geometric2.one;
var e1 = Geometric2_1.Geometric2.e1;
var e2 = Geometric2_1.Geometric2.e2;
describe("Geometric2", function () {
    describe("constructor", function () {
        it("empty", function () {
            var M = new Geometric2_1.Geometric2();
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(false);
        });
        it("coordinates", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(false);
        });
        it("uom", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4], Unit_1.Unit.KILOGRAM);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
            expect(M.uom).toBe(Unit_1.Unit.KILOGRAM);
            expect(M.isLocked()).toBe(false);
        });
        it("should throw Error when coords.length is not 4.", function () {
            expect(function () {
                var M = new Geometric2_1.Geometric2([]);
                M.toString();
            }).toThrowError("coords.length must be 4");
        });
    });
    describe("static", function () {
        it("scalar", function () {
            var a = Math.random();
            var M = Geometric2_1.Geometric2.scalar(a, Unit_1.Unit.METER);
            expect(M.a).toBe(a);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.METER);
            expect(M.isLocked()).toBe(false);
        });
        it("bivector", function () {
            var b = Math.random();
            var M = Geometric2_1.Geometric2.bivector(b, Unit_1.Unit.JOULE);
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.JOULE);
            expect(M.isLocked()).toBe(false);
        });
        it("spinor", function () {
            var a = Math.random();
            var b = Math.random();
            var M = Geometric2_1.Geometric2.spinor(a, b, Unit_1.Unit.ONE);
            expect(M.a).toBe(a);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.ONE);
            expect(M.isLocked()).toBe(false);
        });
        it("vector", function () {
            var x = Math.random();
            var y = Math.random();
            var M = Geometric2_1.Geometric2.vector(x, y, Unit_1.Unit.AMPERE);
            expect(M.a).toBe(0);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("copy", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var M = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.AMPERE);
            var K = Geometric2_1.Geometric2.copy(M);
            expect(K.a).toBe(a);
            expect(K.x).toBe(x);
            expect(K.y).toBe(y);
            expect(K.b).toBe(b);
            expect(K.uom).toBe(Unit_1.Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("fromBivector", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var M = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.AMPERE);
            var K = Geometric2_1.Geometric2.fromBivector(M);
            expect(K.a).toBe(0);
            expect(K.x).toBe(0);
            expect(K.y).toBe(0);
            expect(K.b).toBe(b);
            expect(K.uom).toBe(Unit_1.Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("fromScalar", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var M = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.AMPERE);
            var K = Geometric2_1.Geometric2.fromScalar(M);
            expect(K.a).toBe(a);
            expect(K.x).toBe(0);
            expect(K.y).toBe(0);
            expect(K.b).toBe(0);
            expect(K.uom).toBe(Unit_1.Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("fromSpinor", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var M = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.AMPERE);
            var K = Geometric2_1.Geometric2.fromSpinor(M);
            expect(K.a).toBe(a);
            expect(K.x).toBe(0);
            expect(K.y).toBe(0);
            expect(K.b).toBe(b);
            expect(K.uom).toBe(Unit_1.Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("fromVector", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var M = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.AMPERE);
            var K = Geometric2_1.Geometric2.fromVector(M);
            expect(K.a).toBe(0);
            expect(K.x).toBe(x);
            expect(K.y).toBe(y);
            expect(K.b).toBe(0);
            expect(K.uom).toBe(Unit_1.Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
    });
    describe("constants", function () {
        it("zero", function () {
            var M = Geometric2_1.Geometric2.zero;
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("one", function () {
            var M = Geometric2_1.Geometric2.one;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("e1", function () {
            var M = Geometric2_1.Geometric2.e1;
            expect(M.a).toBe(0);
            expect(M.x).toBe(1);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("e2", function () {
            var M = Geometric2_1.Geometric2.e2;
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(1);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("I", function () {
            var M = Geometric2_1.Geometric2.I;
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(1);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("meter", function () {
            var M = Geometric2_1.Geometric2.meter;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.METER);
            expect(M.isLocked()).toBe(true);
        });
        it("kilogram", function () {
            var M = Geometric2_1.Geometric2.kilogram;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.KILOGRAM);
            expect(M.isLocked()).toBe(true);
        });
        it("second", function () {
            var M = Geometric2_1.Geometric2.second;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.SECOND);
            expect(M.isLocked()).toBe(true);
        });
        it("ampere", function () {
            var M = Geometric2_1.Geometric2.ampere;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.AMPERE);
            expect(M.isLocked()).toBe(true);
        });
        it("kelvin", function () {
            var M = Geometric2_1.Geometric2.kelvin;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.KELVIN);
            expect(M.isLocked()).toBe(true);
        });
        it("mole", function () {
            var M = Geometric2_1.Geometric2.mole;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.MOLE);
            expect(M.isLocked()).toBe(true);
        });
        it("candela", function () {
            var M = Geometric2_1.Geometric2.candela;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.CANDELA);
            expect(M.isLocked()).toBe(true);
        });
        it("newton", function () {
            var M = Geometric2_1.Geometric2.newton;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.NEWTON);
            expect(M.isLocked()).toBe(true);
        });
        it("joule", function () {
            var M = Geometric2_1.Geometric2.joule;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit_1.Unit.JOULE);
            expect(M.isLocked()).toBe(true);
        });
    });
    describe("locking", function () {
        it("should work.", function () {
            var M = new Geometric2_1.Geometric2();
            expect(M.isLocked()).toBe(false);
            var token = M.lock();
            expect(M.isLocked()).toBe(true);
            M.unlock(token);
            expect(M.isLocked()).toBe(false);
        });
        it("should not be able to lock if locked.", function () {
            var M = new Geometric2_1.Geometric2();
            expect(M.isLocked()).toBe(false);
            M.lock();
            expect(function () {
                M.lock();
            }).toThrowError("already locked");
        });
        it("should not be able to unlock if unlocked.", function () {
            var M = new Geometric2_1.Geometric2();
            expect(M.isLocked()).toBe(false);
            expect(function () {
                M.unlock(42);
            }).toThrowError("not locked");
        });
        it("should not be able to unlock with wrong token.", function () {
            var M = new Geometric2_1.Geometric2();
            expect(M.isLocked()).toBe(false);
            M.lock();
            expect(M.isLocked()).toBe(true);
            expect(function () {
                M.unlock(42);
            }).toThrowError("unlock denied");
        });
    });
    describe("properties", function () {
        it("a", function () {
            var M = new Geometric2_1.Geometric2();
            M.a = Math.PI;
            expect(M.a).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.a = Math.random();
            }).toThrowError("Property `a` is readonly.");
        });
        it("x", function () {
            var M = new Geometric2_1.Geometric2();
            M.x = Math.PI;
            expect(M.x).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.x = Math.random();
            }).toThrowError("Property `x` is readonly.");
        });
        it("y", function () {
            var M = new Geometric2_1.Geometric2();
            M.y = Math.PI;
            expect(M.y).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.y = Math.random();
            }).toThrowError("Property `y` is readonly.");
        });
        it("b", function () {
            var M = new Geometric2_1.Geometric2();
            M.b = Math.PI;
            expect(M.b).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.b = Math.random();
            }).toThrowError("Property `b` is readonly.");
        });
        it("xy", function () {
            var M = new Geometric2_1.Geometric2();
            M.xy = Math.PI;
            expect(M.xy).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.xy = Math.random();
            }).toThrowError("Property `xy` is readonly.");
        });
        it("b and xy are equivalent", function () {
            var M = new Geometric2_1.Geometric2();
            M.xy = Math.PI;
            expect(M.b).toBe(Math.PI);
            expect(M.xy).toBe(Math.PI);
            M.b = Math.E;
            expect(M.b).toBe(Math.E);
            expect(M.xy).toBe(Math.E);
        });
        it("uom", function () {
            var M = new Geometric2_1.Geometric2();
            M.uom = Unit_1.Unit.METER;
            expect(M.uom).toBe(Unit_1.Unit.METER);
            M.lock();
            expect(function () {
                M.uom = Unit_1.Unit.SECOND;
            }).toThrowError("Property `uom` is readonly.");
        });
    });
    describe("grades", function () {
        it("scalar", function () {
            expect(Geometric2_1.Geometric2.zero.grades).toBe(0);
            expect(Geometric2_1.Geometric2.one.grades).toBe(1);
        });
        it("vector", function () {
            expect(Geometric2_1.Geometric2.e1.grades).toBe(2);
            expect(Geometric2_1.Geometric2.e2.grades).toBe(2);
            expect(Geometric2_1.Geometric2.vector(0, 0).grades).toBe(0);
        });
        it("pseudoscalar", function () {
            expect(Geometric2_1.Geometric2.I.grades).toBe(4);
            expect(Geometric2_1.Geometric2.bivector(0).grades).toBe(0);
        });
        it("ALL", function () {
            expect(new Geometric2_1.Geometric2([1, 2, 3, 4]).grades).toBe(7);
        });
    });
    describe("add", function () {
        it("LHS is zero.", function () {
            var lhs = new Geometric2_1.Geometric2([0, 0, 0, 0]);
            var rhs = new Geometric2_1.Geometric2([5, 6, 7, 8]);
            var sum = lhs.add(rhs);
            expect(sum.a).toBe(5);
            expect(sum.x).toBe(6);
            expect(sum.y).toBe(7);
            expect(sum.b).toBe(8);
            expect(lhs.a).toBe(5);
            expect(lhs.x).toBe(6);
            expect(lhs.y).toBe(7);
            expect(lhs.b).toBe(8);
            expect(rhs.a).toBe(5);
            expect(rhs.x).toBe(6);
            expect(rhs.y).toBe(7);
            expect(rhs.b).toBe(8);
        });
        it("RHS is zero.", function () {
            var lhs = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            var rhs = new Geometric2_1.Geometric2([0, 0, 0, 0]);
            var sum = lhs.add(rhs);
            expect(sum.a).toBe(1);
            expect(sum.x).toBe(2);
            expect(sum.y).toBe(3);
            expect(sum.b).toBe(4);
            expect(lhs.a).toBe(1);
            expect(lhs.x).toBe(2);
            expect(lhs.y).toBe(3);
            expect(lhs.b).toBe(4);
            expect(rhs.a).toBe(0);
            expect(rhs.x).toBe(0);
            expect(rhs.y).toBe(0);
            expect(rhs.b).toBe(0);
        });
        it("mutates LHS if it is unlocked.", function () {
            var lhs = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            var rhs = new Geometric2_1.Geometric2([5, 6, 7, 8]);
            var sum = lhs.add(rhs);
            expect(sum.a).toBe(1 + 5);
            expect(sum.x).toBe(2 + 6);
            expect(sum.y).toBe(3 + 7);
            expect(sum.b).toBe(4 + 8);
            expect(lhs.a).toBe(1 + 5);
            expect(lhs.x).toBe(2 + 6);
            expect(lhs.y).toBe(3 + 7);
            expect(lhs.b).toBe(4 + 8);
            expect(rhs.a).toBe(5);
            expect(rhs.x).toBe(6);
            expect(rhs.y).toBe(7);
            expect(rhs.b).toBe(8);
        });
        it("leaves LHS if it is unlocked.", function () {
            var lhs = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            lhs.lock();
            var rhs = new Geometric2_1.Geometric2([5, 6, 7, 8]);
            var sum = lhs.add(rhs);
            expect(sum.a).toBe(1 + 5);
            expect(sum.x).toBe(2 + 6);
            expect(sum.y).toBe(3 + 7);
            expect(sum.b).toBe(4 + 8);
            expect(lhs.a).toBe(1);
            expect(lhs.x).toBe(2);
            expect(lhs.y).toBe(3);
            expect(lhs.b).toBe(4);
            expect(rhs.a).toBe(5);
            expect(rhs.x).toBe(6);
            expect(rhs.y).toBe(7);
            expect(rhs.b).toBe(8);
        });
    });
    describe("div", function () {
        it("scalar/scalar", function () {
            var result = one.__div__(one);
            expect(result.a).toBe(one.a);
            expect(result.__eq__(one)).toBe(true);
        });
        it("scalar/number", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var lhs = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.KELVIN);
            var rhs = 0.5;
            var result = lhs.__div__(rhs);
            expect(result.a).toBe(2 * a);
            expect(result.x).toBe(2 * x);
            expect(result.y).toBe(2 * y);
            expect(result.b).toBe(2 * b);
            expect(result.uom).toBe(Unit_1.Unit.KELVIN);
        });
    });
    describe("direction", function () {
        it("locked=false, mutate=false", function () {
            var M = Geometric2_1.Geometric2.vector(5, 0);
            var dir = M.direction(false);
            expect(dir.a).toBe(0);
            expect(dir.x).toBe(1);
            expect(dir.y).toBe(0);
            expect(dir.b).toBe(0);
            expect(M.a).toBe(0);
            expect(M.x).toBe(5);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
        });
        it("locked=false, mutate=true", function () {
            var M = Geometric2_1.Geometric2.vector(5, 0);
            var dir = M.direction(true);
            expect(dir.a).toBe(0);
            expect(dir.x).toBe(1);
            expect(dir.y).toBe(0);
            expect(dir.b).toBe(0);
            expect(M.a).toBe(0);
            expect(M.x).toBe(1);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
        });
        it("locked=true, mutate=false", function () {
            var M = Geometric2_1.Geometric2.vector(5, 0);
            M.lock();
            var dir = M.direction(false);
            expect(dir.a).toBe(0);
            expect(dir.x).toBe(1);
            expect(dir.y).toBe(0);
            expect(dir.b).toBe(0);
            expect(M.a).toBe(0);
            expect(M.x).toBe(5);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
        });
        it("locked=true, mutate=true", function () {
            var M = Geometric2_1.Geometric2.vector(5, 0);
            M.lock();
            expect(function () {
                M.direction(true);
            }).toThrowError("Unable to mutate this locked Geometric2.");
        });
    });
    describe("inv", function () {
        it("scalar(2) should be 0.5", function () {
            var M = Geometric2_1.Geometric2.scalar(2, Unit_1.Unit.METER);
            var inverse = M.inv();
            expect(inverse.a).toBe(0.5);
            expect(inverse.x).toBe(0);
            expect(inverse.y).toBe(0);
            expect(inverse.b).toBe(0);
            expect(inverse.uom).toBe(Unit_1.Unit.ONE.div(Unit_1.Unit.METER));
        });
        it("2 * e1 should be 0.5 * e1", function () {
            var M = Geometric2_1.Geometric2.vector(2, 0, Unit_1.Unit.METER);
            var inverse = M.inv();
            expect(inverse.a).toBe(0);
            expect(inverse.x).toBe(0.5);
            expect(inverse.y).toBe(0);
            expect(inverse.b).toBe(0);
            expect(inverse.uom).toBe(Unit_1.Unit.ONE.div(Unit_1.Unit.METER));
        });
        it("2 * e2 should be 0.5 * e2", function () {
            var M = Geometric2_1.Geometric2.vector(0, 2, Unit_1.Unit.METER);
            var inverse = M.inv();
            expect(inverse.a).toBe(0);
            expect(inverse.x).toBe(0);
            expect(inverse.y).toBe(0.5);
            expect(inverse.b).toBe(0);
            expect(inverse.uom).toBe(Unit_1.Unit.ONE.div(Unit_1.Unit.METER));
        });
        it("2 * I should be -0.5 * I", function () {
            var M = Geometric2_1.Geometric2.bivector(2, Unit_1.Unit.METER);
            var inverse = M.inv();
            expect(inverse.a).toBe(0);
            expect(inverse.x).toBe(0);
            expect(inverse.y).toBe(0);
            expect(inverse.b).toBe(-0.5);
            expect(inverse.uom).toBe(Unit_1.Unit.ONE.div(Unit_1.Unit.METER));
        });
    });
    describe("isScalar", function () {
        it("should only be true if all other components are zero.", function () {
            var a = 0;
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var M = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.KILOGRAM);
            expect(M.isScalar()).toBe(false);
            M.x = 0;
            M.y = 0;
            M.b = 0;
            expect(M.isScalar()).toBe(true);
            M.x = x;
            M.y = 0;
            M.b = 0;
            expect(M.isScalar()).toBe(false);
            M.x = 0;
            M.y = y;
            M.b = 0;
            expect(M.isScalar()).toBe(false);
            M.x = 0;
            M.y = 0;
            M.b = b;
            expect(M.isScalar()).toBe(false);
        });
    });
    describe("magnitude", function () {
        it("zero is scalar(0)", function () {
            var M = Geometric2_1.Geometric2.zero;
            var mag = M.magnitude(false);
            expect(mag.a).toBe(0);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("one is scalar(1)", function () {
            var M = Geometric2_1.Geometric2.one;
            var mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("e1 is scalar(1)", function () {
            var M = Geometric2_1.Geometric2.e1;
            var mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("e2 is scalar(1)", function () {
            var M = Geometric2_1.Geometric2.e2;
            var mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("I is scalar(1)", function () {
            var M = Geometric2_1.Geometric2.I;
            var mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("should mutate if mutate is undefined and the multivector is Mutable.", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            var norm = Math.sqrt(1 + 4 + 9 + 16);
            var mag = M.magnitude();
            expect(mag.a).toBe(norm);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
            expect(M.a).toBe(norm);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
        });
        it("should mutate if mutate is true and the multivector is Mutable.", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            var norm = Math.sqrt(1 + 4 + 9 + 16);
            var mag = M.magnitude(true);
            expect(mag.a).toBe(norm);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
            expect(M.a).toBe(norm);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
        });
        it("should preserve if mutate is false and the multivector is Mutable.", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            var norm = Math.sqrt(1 + 4 + 9 + 16);
            var mag = M.magnitude(false);
            expect(mag.a).toBe(norm);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
        });
        it("should preserve if mutate is undefined and the multivector is Locked.", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            M.lock();
            var norm = Math.sqrt(1 + 4 + 9 + 16);
            var mag = M.magnitude();
            expect(mag.a).toBe(norm);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
        });
        it("should preserve if mutate is false and the multivector is Locked.", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            M.lock();
            var norm = Math.sqrt(1 + 4 + 9 + 16);
            var mag = M.magnitude(false);
            expect(mag.a).toBe(norm);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
        });
        it("should throw an Error if mutate is true and the multivector is Locked.", function () {
            var M = new Geometric2_1.Geometric2([1, 2, 3, 4]);
            M.lock();
            expect(function () {
                M.magnitude(true);
            }).toThrowError("mutate is true, but isMutable() is false.");
        });
    });
    describe("toString", function () {
        it("zero is scalar(0)", function () {
            var M = Geometric2_1.Geometric2.zero;
            expect(M.toString()).toBe("0");
        });
        it("one", function () {
            var M = Geometric2_1.Geometric2.one;
            expect(M.toString()).toBe("1");
        });
        it("e1", function () {
            var M = Geometric2_1.Geometric2.e1;
            expect(M.toString()).toBe("e1");
        });
        it("e2", function () {
            var M = Geometric2_1.Geometric2.e2;
            expect(M.toString()).toBe("e2");
        });
        it("I is e12", function () {
            var M = Geometric2_1.Geometric2.I;
            expect(M.toString()).toBe("e12");
        });
        it("10", function () {
            var M = Geometric2_1.Geometric2.one.mulByNumber(10);
            expect(M.toString()).toBe("10");
            expect(M.toString(10)).toBe("10");
            expect(M.toString(2)).toBe("1010");
            expect(M.toString(16)).toBe("a");
        });
        it("kilogram", function () {
            var M = Geometric2_1.Geometric2.kilogram;
            expect(M.toString()).toBe("1 kg");
        });
        it("meter", function () {
            var M = Geometric2_1.Geometric2.meter;
            expect(M.toString()).toBe("1 m");
        });
        it("second", function () {
            var M = Geometric2_1.Geometric2.second;
            expect(M.toString()).toBe("1 s");
        });
    });
    describe("rotorFromDirections", function () {
        it("(e1, e2)", function () {
            var m = new Geometric2_1.Geometric2([Math.random(), Math.random(), Math.random(), Math.random()]);
            m.rotorFromDirections(e1, e2);
            expect(m.a).toBe(0.7071067811865475);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.b).toBe(-0.7071067811865475);
            expect(m.uom).toBe(Unit_1.Unit.ONE);
        });
        it("(e1, e1)", function () {
            var m = new Geometric2_1.Geometric2([Math.random(), Math.random(), Math.random(), Math.random()]);
            m.rotorFromDirections(e1, e1);
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.b).toBe(0);
            expect(m.uom).toBe(Unit_1.Unit.ONE);
        });
        it("(e2, e2)", function () {
            var m = new Geometric2_1.Geometric2([Math.random(), Math.random(), Math.random(), Math.random()]);
            m.rotorFromDirections(e2, e2);
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.b).toBe(0);
            expect(m.uom).toBe(Unit_1.Unit.ONE);
        });
        it("on locked should not mutate and should return the rotor.", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var m = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.KELVIN);
            m.lock();
            var R = m.rotorFromDirections(e1, e2);
            expect(m.a).toBe(a);
            expect(m.x).toBe(x);
            expect(m.y).toBe(y);
            expect(m.b).toBe(b);
            expect(m.uom).toBe(Unit_1.Unit.KELVIN);
            expect(R.a).toBe(0.7071067811865475);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.b).toBe(-0.7071067811865475);
            expect(R.uom).toBe(Unit_1.Unit.ONE);
        });
        it("static", function () {
            var R = Geometric2_1.Geometric2.rotorFromDirections(e1, e2);
            expect(R.a).toBe(0.7071067811865475);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.b).toBe(-0.7071067811865475);
            expect(R.uom).toBe(Unit_1.Unit.ONE);
        });
        it("result should be independent of |b| and |a|.", function () {
            var R = Geometric2_1.Geometric2.rotorFromDirections(e1.mulByNumber(0.5), e2.mulByNumber(2));
            expect(R.a).toBe(0.7071067811865475);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.b).toBe(-0.7071067811865475);
            expect(R.uom).toBe(Unit_1.Unit.ONE);
        });
    });
    describe("rotorFromVectorToVector", function () {
        it("(e1, e2)", function () {
            var m = new Geometric2_1.Geometric2([Math.random(), Math.random(), Math.random(), Math.random()]);
            m.rotorFromVectorToVector(e1, e2);
            expect(m.a).toBe(0.7071067811865475);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.b).toBe(-0.7071067811865475);
            expect(m.uom).toBe(Unit_1.Unit.ONE);
        });
        it("(e1, e1)", function () {
            var m = new Geometric2_1.Geometric2([Math.random(), Math.random(), Math.random(), Math.random()]);
            m.rotorFromVectorToVector(e1, e1);
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.b).toBe(0);
            expect(m.uom).toBe(Unit_1.Unit.ONE);
        });
        it("(e2, e2)", function () {
            var m = new Geometric2_1.Geometric2([Math.random(), Math.random(), Math.random(), Math.random()]);
            m.rotorFromVectorToVector(e2, e2);
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.b).toBe(0);
            expect(m.uom).toBe(Unit_1.Unit.ONE);
        });
        it("on locked should not mutate and should return the rotor.", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var m = new Geometric2_1.Geometric2([a, x, y, b], Unit_1.Unit.KELVIN);
            m.lock();
            var R = m.rotorFromVectorToVector(e1, e2);
            expect(m.a).toBe(a);
            expect(m.x).toBe(x);
            expect(m.y).toBe(y);
            expect(m.b).toBe(b);
            expect(m.uom).toBe(Unit_1.Unit.KELVIN);
            expect(R.a).toBe(0.7071067811865475);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.b).toBe(-0.7071067811865475);
            expect(R.uom).toBe(Unit_1.Unit.ONE);
        });
        it("static", function () {
            var R = Geometric2_1.Geometric2.rotorFromVectorToVector(e1, e2);
            expect(R.a).toBe(0.7071067811865475);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.b).toBe(-0.7071067811865475);
            expect(R.uom).toBe(Unit_1.Unit.ONE);
        });
        it("scaling", function () {
            var R = Geometric2_1.Geometric2.rotorFromVectorToVector(e1.mulByNumber(0.5), e2.mulByNumber(2));
            expect(R.a).toBe(1.414213562373095);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.b).toBe(-1.414213562373095);
            expect(R.uom).toBe(Unit_1.Unit.ONE);
            var rotated = e1.rotate(R);
            expect(rotated.x).toBe(0);
            expect(rotated.y).toBe(3.999999999999999);
        });
    });
    describe("reflect", function () {
        it("e1 in the plane perpendicular to e1 should be -e1", function () {
            var reflected = e1.reflect(e1);
            expect(reflected.a).toBe(0);
            expect(reflected.x).toBe(-1);
            expect(reflected.y).toBe(0);
            expect(reflected.b).toBe(0);
        });
        it("e2 in the plane perpendicular to e2 should be -e2", function () {
            var reflected = e2.reflect(e2);
            expect(reflected.a).toBe(0);
            expect(reflected.x).toBe(0);
            expect(reflected.y).toBe(-1);
            expect(reflected.b).toBe(0);
        });
        it("v in the plane perpendicular to e1 should reverse x component only", function () {
            var x = Math.random();
            var y = Math.random();
            var v = Geometric2_1.Geometric2.vector(x, y);
            v.lock();
            var reflected = v.reflect(e1);
            expect(reflected.a).toBe(0);
            expect(reflected.x).toBe(-x);
            expect(reflected.y).toBe(y);
            expect(reflected.b).toBe(0);
        });
        it("v in the plane perpendicular to e2 should reverse y component only", function () {
            var x = Math.random();
            var y = Math.random();
            var v = Geometric2_1.Geometric2.vector(x, y);
            v.lock();
            var reflected = v.reflect(e2);
            expect(reflected.a).toBe(0);
            expect(reflected.x).toBe(x);
            expect(reflected.y).toBe(-y);
            expect(reflected.b).toBe(0);
        });
        it("M in the plane perpendicular to e1 should change sign of scalar part.", function () {
            var a = Math.random();
            var x = Math.random();
            var y = Math.random();
            var b = Math.random();
            var v = new Geometric2_1.Geometric2([a, x, y, b]);
            v.lock();
            var reflected = v.reflect(e1);
            expect(reflected.a).toBe(-a);
            expect(reflected.x).toBe(-x);
            expect(reflected.y).toBe(y);
            expect(reflected.b).toBe(b);
        });
    });
});
