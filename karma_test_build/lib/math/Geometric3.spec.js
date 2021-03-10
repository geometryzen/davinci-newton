"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric3_1 = require("./Geometric3");
var Spinor3_1 = require("./Spinor3");
var Unit_1 = require("./Unit");
var Vector3_1 = require("./Vector3");
var one = Geometric3_1.Geometric3.one;
var e1 = Geometric3_1.Geometric3.e1;
var e2 = Geometric3_1.Geometric3.e2;
var e3 = Geometric3_1.Geometric3.e3;
var e23 = e2.mul(e3);
var e31 = e3.mul(e1);
var e12 = e1.mul(e2);
var I = Geometric3_1.Geometric3.I;
var meter = Geometric3_1.Geometric3.meter;
var kilogram = Geometric3_1.Geometric3.kilogram;
var second = Geometric3_1.Geometric3.second;
var ampere = Geometric3_1.Geometric3.ampere;
var kelvin = Geometric3_1.Geometric3.kelvin;
var mole = Geometric3_1.Geometric3.mole;
var candela = Geometric3_1.Geometric3.candela;
function reflectSpec(M, n) {
    var spec = function () {
        /**
         * We want to verify that coefficients are carried through.
         */
        var S = M.clone().mulByNumber(2);
        /**
         * We want the reflect method to work even when n is not a unit vector.
         */
        var N = Geometric3_1.Geometric3.fromVector(n).mulByNumber(3);
        /**
         * The 'Test' result using the specialized method.
         */
        var T = S.clone().reflect(N);
        /**
         * The 'Control' value computed explicitly as C = -n * S * n
         */
        var C = N.clone().mul(S).mul(N).mulByNumber(-1);
        it("should be -n * M * n", function () {
            expect(T.a).toBe(C.a);
            expect(T.x).toBe(C.x);
            expect(T.y).toBe(C.y);
            expect(T.z).toBe(C.z);
            expect(T.yz).toBe(C.yz);
            expect(T.zx).toBe(C.zx);
            expect(T.xy).toBe(C.xy);
            expect(T.b).toBe(C.b);
        });
    };
    return spec;
}
/**
 * The decimal place up to which the numbers should agree.
 * Make this as large as possible while avoiding rounding errors.
 */
var PRECISION = 13;
describe("Geometric3", function () {
    describe("Properties", function () {
        it("I", function () {
            var m = Geometric3_1.Geometric3.I;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(1);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e1", function () {
            var m = Geometric3_1.Geometric3.e1;
            expect(m.a).toBe(0);
            expect(m.x).toBe(1);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e2", function () {
            var m = Geometric3_1.Geometric3.e2;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(1);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e3", function () {
            var m = Geometric3_1.Geometric3.e3;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(1);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("one", function () {
            var m = Geometric3_1.Geometric3.one;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("zero", function () {
            var m = Geometric3_1.Geometric3.zero;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(0);
        });
        it("e12", function () {
            var m = e12;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(1);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e23", function () {
            var m = e23;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(1);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e31", function () {
            var m = e31;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(1);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("meter", function () {
            var m = meter;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 m");
        });
        it("kilogram", function () {
            var m = kilogram;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 kg");
        });
        it("second", function () {
            var m = second;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 s");
        });
        it("ampere", function () {
            var m = ampere;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 A");
        });
        it("kelvin", function () {
            var m = kelvin;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 K");
        });
        it("mole", function () {
            var m = mole;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 mol");
        });
        it("candela", function () {
            var m = candela;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit_1.Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 cd");
        });
    });
    describe("uom", function () {
        it("KILOGRAM", function () {
            var kg = Geometric3_1.Geometric3.scalar(1, Unit_1.Unit.KILOGRAM);
            expect(kg.uom.dimensions.M.numer).toBe(1);
            expect(kg.uom.dimensions.M.denom).toBe(1);
            expect(kg.uom.dimensions.L.numer).toBe(0);
            expect(kg.uom.dimensions.L.denom).toBe(1);
            expect(kg.uom.dimensions.T.numer).toBe(0);
            expect(kg.uom.dimensions.T.denom).toBe(1);
            expect(kg.uom.dimensions.Q.numer).toBe(0);
            expect(kg.uom.dimensions.Q.denom).toBe(1);
        });
        it("METER", function () {
            var m = Geometric3_1.Geometric3.scalar(1, Unit_1.Unit.METER);
            expect(m.uom.dimensions.M.numer).toBe(0);
            expect(m.uom.dimensions.M.denom).toBe(1);
            expect(m.uom.dimensions.L.numer).toBe(1);
            expect(m.uom.dimensions.L.denom).toBe(1);
            expect(m.uom.dimensions.T.numer).toBe(0);
            expect(m.uom.dimensions.T.denom).toBe(1);
            expect(m.uom.dimensions.Q.numer).toBe(0);
            expect(m.uom.dimensions.Q.denom).toBe(1);
        });
        it("SECOND", function () {
            var s = Geometric3_1.Geometric3.scalar(1, Unit_1.Unit.SECOND);
            expect(s.uom.dimensions.M.numer).toBe(0);
            expect(s.uom.dimensions.M.denom).toBe(1);
            expect(s.uom.dimensions.L.numer).toBe(0);
            expect(s.uom.dimensions.L.denom).toBe(1);
            expect(s.uom.dimensions.T.numer).toBe(1);
            expect(s.uom.dimensions.T.denom).toBe(1);
            expect(s.uom.dimensions.Q.numer).toBe(0);
            expect(s.uom.dimensions.Q.denom).toBe(1);
        });
        it("AMPERE", function () {
            var A = Geometric3_1.Geometric3.scalar(1, Unit_1.Unit.AMPERE);
            expect(A.uom.dimensions.M.numer).toBe(0);
            expect(A.uom.dimensions.M.denom).toBe(1);
            expect(A.uom.dimensions.L.numer).toBe(0);
            expect(A.uom.dimensions.L.denom).toBe(1);
            expect(A.uom.dimensions.T.numer).toBe(-1);
            expect(A.uom.dimensions.T.denom).toBe(1);
            expect(A.uom.dimensions.Q.numer).toBe(1);
            expect(A.uom.dimensions.Q.denom).toBe(1);
        });
        it("COULOMB", function () {
            var C = Geometric3_1.Geometric3.scalar(1, Unit_1.Unit.COULOMB);
            expect(C.uom.dimensions.M.numer).toBe(0);
            expect(C.uom.dimensions.M.denom).toBe(1);
            expect(C.uom.dimensions.L.numer).toBe(0);
            expect(C.uom.dimensions.L.denom).toBe(1);
            expect(C.uom.dimensions.T.numer).toBe(0);
            expect(C.uom.dimensions.T.denom).toBe(1);
            expect(C.uom.dimensions.Q.numer).toBe(1);
            expect(C.uom.dimensions.Q.denom).toBe(1);
        });
    });
    describe("grades", function () {
        it("0 => 0x0", function () {
            expect(Geometric3_1.Geometric3.zero.grades).toBe(0x0);
        });
        it("1 => 0x1", function () {
            expect(Geometric3_1.Geometric3.one.grades).toBe(0x1);
        });
        it("e1 => 0x2", function () {
            expect(e1.grades).toBe(0x2);
        });
        it("e2 => 0x2", function () {
            expect(e2.grades).toBe(0x2);
        });
        it("e3 => 0x2", function () {
            expect(e3.grades).toBe(0x2);
        });
        it("1+e1 => 0x3", function () {
            expect(e1.clone().addScalar(1).grades).toBe(0x3);
        });
        it("e1 ^ e2 => 0x4", function () {
            expect(Geometric3_1.Geometric3.wedge(e1, e2).grades).toBe(0x4);
        });
        it("e2 ^ e3 => 0x4", function () {
            expect(Geometric3_1.Geometric3.wedge(e2, e3).grades).toBe(0x4);
        });
        it("e3 ^ e1 => 0x4", function () {
            expect(Geometric3_1.Geometric3.wedge(e3, e1).grades).toBe(0x4);
        });
        it("rotorFromDirections(e1, e2) => 0x5", function () {
            expect(Geometric3_1.Geometric3.rotorFromDirections(e1, e2).grades).toBe(0x5);
        });
        it("pseudoscalar => 0x8", function () {
            var I = Geometric3_1.Geometric3.I;
            expect(I.grades).toBe(0x8);
        });
    });
    describe("mulByBivector", function () {
        it("(vector, bivector) should be same as vector.mul(bivector)", function () {
            var lhs = Geometric3_1.Geometric3.vector(Math.random(), Math.random(), Math.random());
            var B = Geometric3_1.Geometric3.bivector(Math.random(), Math.random(), Math.random());
            var actualOut = lhs.clone().mulByBivector(B);
            var expectOut = lhs.clone().mul(B);
            expect(actualOut.a).toBe(expectOut.a);
            expect(actualOut.x).toBe(expectOut.x);
            expect(actualOut.y).toBe(expectOut.y);
            expect(actualOut.z).toBe(expectOut.z);
            expect(actualOut.xy).toBe(expectOut.xy);
            expect(actualOut.yz).toBe(expectOut.yz);
            expect(actualOut.zx).toBe(expectOut.zx);
            expect(actualOut.b).toBe(expectOut.b);
        });
        it("(spinor, bivector) should be same as spinor.mul(bivector)", function () {
            var lhs = Geometric3_1.Geometric3.spinor(Math.random(), Math.random(), Math.random(), Math.random());
            var B = Geometric3_1.Geometric3.bivector(Math.random(), Math.random(), Math.random());
            var actualOut = lhs.clone().mulByBivector(B);
            var expectOut = lhs.clone().mul(B);
            expect(actualOut.a).toBe(expectOut.a);
            expect(actualOut.x).toBe(expectOut.x);
            expect(actualOut.y).toBe(expectOut.y);
            expect(actualOut.z).toBe(expectOut.z);
            expect(actualOut.xy).toBe(expectOut.xy);
            expect(actualOut.yz).toBe(expectOut.yz);
            expect(actualOut.zx).toBe(expectOut.zx);
            expect(actualOut.b).toBe(expectOut.b);
        });
        it("(pseudo, bivector) should be same as pseudo.mul(bivector)", function () {
            var lhs = Geometric3_1.Geometric3.pseudo(Math.random());
            var B = Geometric3_1.Geometric3.bivector(Math.random(), Math.random(), Math.random());
            var actualOut = lhs.clone().mulByBivector(B);
            var expectOut = lhs.clone().mul(B);
            expect(actualOut.a).toBe(expectOut.a);
            expect(actualOut.x).toBe(expectOut.x);
            expect(actualOut.y).toBe(expectOut.y);
            expect(actualOut.z).toBe(expectOut.z);
            expect(actualOut.xy).toBe(expectOut.xy);
            expect(actualOut.yz).toBe(expectOut.yz);
            expect(actualOut.zx).toBe(expectOut.zx);
            expect(actualOut.b).toBe(expectOut.b);
        });
    });
    describe("mulByVector", function () {
        it("(vector, vector) should be same as vector.mul(vector)", function () {
            var lhs = Geometric3_1.Geometric3.vector(Math.random(), Math.random(), Math.random());
            var rhs = Geometric3_1.Geometric3.vector(Math.random(), Math.random(), Math.random());
            var actualOut = lhs.clone().mulByVector(rhs);
            var expectOut = lhs.clone().mul(rhs);
            expect(actualOut.a).toBe(expectOut.a);
            expect(actualOut.x).toBe(expectOut.x);
            expect(actualOut.y).toBe(expectOut.y);
            expect(actualOut.z).toBe(expectOut.z);
            expect(actualOut.xy).toBe(expectOut.xy);
            expect(actualOut.yz).toBe(expectOut.yz);
            expect(actualOut.zx).toBe(expectOut.zx);
            expect(actualOut.b).toBe(expectOut.b);
        });
        it("(spinor, vector) should be same as spinor.mul(vector)", function () {
            var lhs = Geometric3_1.Geometric3.spinor(Math.random(), Math.random(), Math.random(), Math.random());
            var rhs = Geometric3_1.Geometric3.vector(Math.random(), Math.random(), Math.random());
            var actualOut = lhs.clone().mulByVector(rhs);
            var expectOut = lhs.clone().mul(rhs);
            expect(actualOut.a).toBe(expectOut.a);
            expect(actualOut.x).toBe(expectOut.x);
            expect(actualOut.y).toBe(expectOut.y);
            expect(actualOut.z).toBe(expectOut.z);
            expect(actualOut.xy).toBe(expectOut.xy);
            expect(actualOut.yz).toBe(expectOut.yz);
            expect(actualOut.zx).toBe(expectOut.zx);
            expect(actualOut.b).toBe(expectOut.b);
        });
        it("(pseudo, vector) should be same as pseudo.mul(vector)", function () {
            var lhs = Geometric3_1.Geometric3.pseudo(Math.random());
            var rhs = Geometric3_1.Geometric3.vector(Math.random(), Math.random(), Math.random());
            var actualOut = lhs.clone().mulByVector(rhs);
            var expectOut = lhs.clone().mul(rhs);
            expect(actualOut.a).toBe(expectOut.a);
            expect(actualOut.x).toBe(expectOut.x);
            expect(actualOut.y).toBe(expectOut.y);
            expect(actualOut.z).toBe(expectOut.z);
            expect(actualOut.xy).toBe(expectOut.xy);
            expect(actualOut.yz).toBe(expectOut.yz);
            expect(actualOut.zx).toBe(expectOut.zx);
            expect(actualOut.b).toBe(expectOut.b);
        });
    });
    describe("div", function () {
        it("1 / 1 should be 1", function () {
            var numer = one.clone();
            var denom = one.clone();
            var ratio = numer.clone().div(denom);
            expect(ratio.isOne()).toBeTruthy();
        });
        it("1 / 2 should be 0.5", function () {
            var numer = one.clone();
            var denom = one.clone().mulByNumber(2);
            var ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(one.clone().divByNumber(2).toString());
        });
        it("e1 / 1 should be e1", function () {
            var numer = e1.clone();
            var denom = one.clone();
            var ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(e1.toString());
        });
        it("e1 / e1 should be 1", function () {
            var numer = e1.clone();
            var denom = e1.clone();
            var ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(one.toString());
        });
        it("e1 / e2 should be e1 * e2", function () {
            var numer = e1.clone();
            var denom = e2.clone();
            var ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(e1.clone().mul(e2).toString());
        });
        it("e1 / I should be e3 * e2", function () {
            var numer = e1.clone();
            var denom = I.clone();
            var ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(e3.clone().mul(e2).toString());
        });
    });
    describe("equals", function () {
        it("(M) should be eqial to M", function () {
            var zero = Geometric3_1.Geometric3.zero;
            var one = Geometric3_1.Geometric3.one;
            expect(zero.equals(zero)).toBe(true);
            expect(one.equals(one)).toBe(true);
            expect(zero.equals(one)).toBe(false);
            expect(one.equals(zero)).toBe(false);
        });
    });
    describe("grade", function () {
        var m = one.add(e1).add(e2).add(e3).add(e12).add(e23).add(e31).add(I);
        it("target should contain all components for testing purposes", function () {
            expect(m.isLocked()).toBe(true);
            expect(m.a).toBe(1);
            expect(m.x).toBe(1);
            expect(m.y).toBe(1);
            expect(m.z).toBe(1);
            expect(m.yz).toBe(1);
            expect(m.zx).toBe(1);
            expect(m.xy).toBe(1);
            expect(m.b).toBe(1);
        });
        it("(0) should extract scalar component", function () {
            expect(m.isLocked()).toBe(true);
            var s = m.grade(0);
            expect(s.isLocked()).toBe(true);
            expect(s.a).toBe(1);
            expect(s.x).toBe(0);
            expect(s.y).toBe(0);
            expect(s.z).toBe(0);
            expect(s.yz).toBe(0);
            expect(s.zx).toBe(0);
            expect(s.xy).toBe(0);
            expect(s.b).toBe(0);
        });
        it("(1) should extract vector components", function () {
            expect(m.isLocked()).toBe(true);
            var s = m.grade(1);
            expect(s.isLocked()).toBe(true);
            expect(s.a).toBe(0);
            expect(s.x).toBe(1);
            expect(s.y).toBe(1);
            expect(s.z).toBe(1);
            expect(s.yz).toBe(0);
            expect(s.zx).toBe(0);
            expect(s.xy).toBe(0);
            expect(s.b).toBe(0);
        });
        it("(2) should extract bivector components", function () {
            expect(m.isLocked()).toBe(true);
            var s = m.grade(2);
            expect(s.isLocked()).toBe(true);
            expect(s.a).toBe(0);
            expect(s.x).toBe(0);
            expect(s.y).toBe(0);
            expect(s.z).toBe(0);
            expect(s.yz).toBe(1);
            expect(s.zx).toBe(1);
            expect(s.xy).toBe(1);
            expect(s.b).toBe(0);
        });
        it("(3) should extract the pseudoscalar component", function () {
            expect(m.isLocked()).toBe(true);
            var s = m.grade(3);
            expect(s.isLocked()).toBe(true);
            expect(s.a).toBe(0);
            expect(s.x).toBe(0);
            expect(s.y).toBe(0);
            expect(s.z).toBe(0);
            expect(s.yz).toBe(0);
            expect(s.zx).toBe(0);
            expect(s.xy).toBe(0);
            expect(s.b).toBe(1);
        });
    });
    describe("inv", function () {
        it("(1) should be 1", function () {
            var one = Geometric3_1.Geometric3.one;
            var inv = one.clone().inv();
            expect(inv.equals(one)).toBe(true);
        });
        it("(2) should be 0.5", function () {
            var two = Geometric3_1.Geometric3.scalar(2);
            var inv = two.clone().inv();
            var half = Geometric3_1.Geometric3.scalar(0.5);
            expect(inv.equals(half)).toBe(true);
        });
        it("(e1) should be e1", function () {
            var e1 = Geometric3_1.Geometric3.e1;
            var inv = e1.clone().inv();
            expect(inv.equals(e1)).toBe(true);
        });
        it("(2 * e1) should be 0.5 * e1", function () {
            var e1 = Geometric3_1.Geometric3.e1;
            var inv = e1.clone().mulByNumber(2).inv();
            var halfE1 = e1.clone().mulByNumber(0.5);
            expect(inv.equals(halfE1)).toBe(true);
        });
        it("(e2) should be e2", function () {
            var e2 = Geometric3_1.Geometric3.e2;
            var inv = e2.clone().inv();
            expect(inv.equals(e2)).toBe(true);
        });
        it("(2 * e2) should be 0.5 * e2", function () {
            var e2 = Geometric3_1.Geometric3.e2;
            var inv = e2.clone().mulByNumber(2).inv();
            var halfE2 = e2.clone().mulByNumber(0.5);
            expect(inv.equals(halfE2)).toBe(true);
        });
        it("(e3) should be e3", function () {
            var e3 = Geometric3_1.Geometric3.e3;
            var inv = e3.clone().inv();
            expect(inv.equals(e3)).toBe(true);
        });
        it("(2 * e3) should be 0.5 * e3", function () {
            var e3 = Geometric3_1.Geometric3.e3;
            var inv = e3.clone().mulByNumber(2).inv();
            var halfE3 = e3.clone().mulByNumber(0.5);
            expect(inv.equals(halfE3)).toBe(true);
        });
        it("(I) should be -I", function () {
            var e1 = Geometric3_1.Geometric3.e1;
            var e2 = Geometric3_1.Geometric3.e2;
            var e3 = Geometric3_1.Geometric3.e3;
            var I = e1.clone().mul(e2).mul(e3);
            var inv = I.clone().inv();
            var minusI = I.clone().neg();
            expect(inv.equals(minusI)).toBe(true);
        });
        it("(2 * I) should be -0.5 * I", function () {
            var e1 = Geometric3_1.Geometric3.e1;
            var e2 = Geometric3_1.Geometric3.e2;
            var e3 = Geometric3_1.Geometric3.e3;
            var I = e1.clone().mul(e2).mul(e3);
            var inv = I.clone().mulByNumber(2).inv();
            var minusHalfI = I.clone().neg().mulByNumber(0.5);
            expect(inv.equals(minusHalfI)).toBe(true);
        });
    });
    describe("rotorFromAxisAngle", function () {
        describe("(e3, PI)", function () {
            var axis = e3;
            var R = Geometric3_1.Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI);
            R.approx(12);
            it("should equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
        describe("(e3, PI/2)", function () {
            var axis = e3;
            var R = Geometric3_1.Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI / 2);
            R.approx(12);
            it("should equal (1-e1e2)/sqrt(2)", function () {
                expect(R.a).toBeCloseTo(1 / Math.sqrt(2), 15);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBeCloseTo(-1 / Math.sqrt(2), 17);
                expect(R.b).toBe(0);
            });
        });
        describe("(2 * e3, PI)", function () {
            var axis = e3.clone().mulByNumber(2);
            var R = Geometric3_1.Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI);
            R.approx(12);
            it("should equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
    });
    describe("rotorFromDirections", function () {
        var cosPIdiv4 = Math.cos(Math.PI / 4);
        var sinPIdiv4 = Math.sin(Math.PI / 4);
        describe("from +e1", function () {
            it("to +e1", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1, e1);
                expect(R.a).toBe(1);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(0);
            });
            it("to +e2", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1, e2);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(-sinPIdiv4);
            });
            it("to +e3", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1, e3);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(sinPIdiv4);
                expect(R.xy).toBe(0);
            });
            it("to -e1", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1, e1.clone().neg());
                var V = e1.clone().rotate(R);
                expect(V.a).toBe(0);
                expect(V.x).toBe(-1);
                expect(V.y).toBe(0);
                expect(V.z).toBe(0);
                expect(V.yz).toBe(0);
                expect(V.zx).toBe(0);
                expect(V.xy).toBe(0);
            });
            it("to -e2", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1, e2.clone().neg());
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(sinPIdiv4);
            });
            it("to -e3", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1, e3.clone().neg());
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(-sinPIdiv4);
                expect(R.xy).toBe(0);
            });
        });
        describe("from -e1", function () {
            it("to +e1", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1.clone().neg(), e1);
                var V = e1.clone().neg().rotate(R);
                expect(V.a).toBe(0);
                expect(V.x).toBe(1);
                expect(V.y).toBe(0);
                expect(V.z).toBe(0);
                expect(V.yz).toBe(0);
                expect(V.zx).toBe(0);
                expect(V.xy).toBe(0);
            });
            it("to +e2", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1.clone().neg(), e2);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(sinPIdiv4);
            });
            it("to +e3", function () {
                var R = Geometric3_1.Geometric3.rotorFromDirections(e1.clone().neg(), e3);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(-sinPIdiv4);
                expect(R.xy).toBe(0);
            });
        });
        it("(+e2, +e1)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2, e1);
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(+sinPIdiv4);
        });
        it("(+e2, -e1)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2, e1.clone().neg());
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(-sinPIdiv4);
        });
        it("(+e2, +e2)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2, e2);
            expect(R.a).toBe(1);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e2, +e3)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2, e3);
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(-sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e2, -e3)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2, e3.clone().neg());
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e3, +e1)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3, e1);
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(-sinPIdiv4);
            expect(R.xy).toBe(0);
        });
        it("(+e3, -e1)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3, e1.clone().neg());
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(sinPIdiv4);
            expect(R.xy).toBe(0);
        });
        it("(+e3, +e2)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3, e2);
            expect(R.a).toBe(cosPIdiv4, 15);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(+sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e3, -e2)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3, e2.clone().neg());
            expect(R.a).toBe(cosPIdiv4, 15);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(-sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e3, +e3)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3, e3);
            expect(R.a).toBe(1);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e2, -e2)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2, e2.clone().neg());
            var V = e2.clone().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(-1);
            expect(V.z).toBe(0);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(-e2, +e2)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e2.clone().neg(), e2);
            var V = e2.clone().neg().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(1);
            expect(V.z).toBe(0);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(+e3, -e3)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3, e3.clone().neg());
            var V = e3.clone().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(0);
            expect(V.z).toBe(-1);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(-e3, +e3)", function () {
            var R = Geometric3_1.Geometric3.rotorFromDirections(e3.clone().neg(), e3);
            var V = e3.clone().neg().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(0);
            expect(V.z).toBe(1);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(random, random) should be rotor that rotates a to b", function () {
            var a = Geometric3_1.Geometric3.random().grade(1).direction(true);
            var b = Geometric3_1.Geometric3.random().grade(1).direction(true);
            var R = Geometric3_1.Geometric3.rotorFromDirections(a, b);
            var V = a.clone().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBeCloseTo(b.x, PRECISION);
            expect(V.y).toBeCloseTo(b.y, PRECISION);
            expect(V.z).toBeCloseTo(b.z, PRECISION);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
    });
    describe("rotorFromFrameToFrame", function () {
        it("[e1, e2, e3] to [e1, e2, e3] should be 1", function () {
            var R = Geometric3_1.Geometric3.rotorFromFrameToFrame([e1, e2, e3], [e1, e2, e3]);
            expect(R.a).toBe(1);
        });
        it("[e2, e3, e1] to [e3, e2, -e1]", function () {
            var R = Geometric3_1.Geometric3.rotorFromFrameToFrame([e2, e3, e1], [e3, e2, e1.__neg__()]);
            var f1 = e2.clone().rotate(R);
            expect(f1.x).toBeCloseTo(e3.x, 14);
            expect(f1.y).toBeCloseTo(e3.y, 14);
            expect(f1.z).toBeCloseTo(e3.z, 14);
            var f2 = e3.clone().rotate(R);
            expect(f2.x).toBeCloseTo(e2.x, 14);
            expect(f2.y).toBeCloseTo(e2.y, 14);
            expect(f2.z).toBeCloseTo(e2.z, 14);
        });
    });
    describe("rotorFrmGeneratorAngle", function () {
        describe("(e1 ^ e2, PI)", function () {
            var B = e1.clone().ext(e2);
            var R = Geometric3_1.Geometric3.random();
            R.rotorFromGeneratorAngle(B, Math.PI);
            R.approx(12);
            it("shoud equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
        describe("(2  e1 ^ e2, PI/2)", function () {
            var B = e1.clone().ext(e2).mulByNumber(2);
            var R = Geometric3_1.Geometric3.one.clone().addVector(e1).addVector(e2).addVector(e3).addPseudo(1).add(B);
            R.rotorFromGeneratorAngle(B, Math.PI / 2);
            R.approx(12);
            it("shoud equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
    });
    describe("reflect", function () {
        var n = Vector3_1.Vector3.vector(1, 0, 0);
        var a = Geometric3_1.Geometric3.vector(2, 3, 0, Unit_1.Unit.METER);
        var chain = a.reflect(n);
        it("should reflect (2,3)", function () {
            expect(a.x).toBe(-2);
            expect(a.y).toBe(+3);
            expect(a.z).toBe(0);
        });
        it("should be chainable", function () {
            expect(chain === a).toBe(true);
        });
        describe("(n)", function () {
            var S = Geometric3_1.Geometric3.random();
            var n = Geometric3_1.Geometric3.random().grade(1).direction(true);
            /**
             * The 'Test' result using the specialized method.
             */
            var T = S.clone().reflect(n);
            /**
             * The 'Control' value computed explicitly as C = -n * S * n
             */
            var C = n.clone().mul(S).mul(n).mulByNumber(-1);
            it("should be -n * M * n", function () {
                expect(T.a).toBeCloseTo(C.a, PRECISION);
                expect(T.x).toBeCloseTo(C.x, PRECISION);
                expect(T.y).toBeCloseTo(C.y, PRECISION);
                expect(T.z).toBeCloseTo(C.z, PRECISION);
                expect(T.yz).toBeCloseTo(C.yz, PRECISION);
                expect(T.zx).toBeCloseTo(C.zx, PRECISION);
                expect(T.xy).toBeCloseTo(C.xy, PRECISION);
                expect(T.b).toBeCloseTo(C.b, PRECISION);
            });
        });
        describe("one reflected in e1", reflectSpec(one, e1));
        describe("one reflected in e2", reflectSpec(one, e2));
        describe("one reflected in e3", reflectSpec(one, e3));
        describe("e1 reflected in e1", reflectSpec(e1, e1));
        describe("e1 reflected in e2", reflectSpec(e1, e2));
        describe("e1 reflected in e3", reflectSpec(e1, e3));
        describe("e2 reflected in e1", reflectSpec(e2, e1));
        describe("e2 reflected in e2", reflectSpec(e2, e2));
        describe("e2 reflected in e3", reflectSpec(e2, e3));
        describe("e3 reflected in e1", reflectSpec(e3, e1));
        describe("e3 reflected in e2", reflectSpec(e3, e2));
        describe("e3 reflected in e3", reflectSpec(e3, e3));
        describe("e12 reflected in e1", reflectSpec(e12, e1));
        describe("e12 reflected in e2", reflectSpec(e12, e2));
        describe("e12 reflected in e3", reflectSpec(e12, e3));
        describe("e23 reflected in e1", reflectSpec(e23, e1));
        describe("e23 reflected in e2", reflectSpec(e23, e2));
        describe("e23 reflected in e3", reflectSpec(e23, e3));
        describe("e31 reflected in e1", reflectSpec(e31, e1));
        describe("e31 reflected in e2", reflectSpec(e31, e2));
        describe("e31 reflected in e3", reflectSpec(e31, e3));
        describe("I reflected in e1", reflectSpec(I, e1));
        describe("I reflected in e2", reflectSpec(I, e2));
        describe("I reflected in e3", reflectSpec(I, e3));
    });
    describe("stress", function () {
        var stress = Vector3_1.Vector3.vector(7, 11, 13);
        var position = Geometric3_1.Geometric3.vector(2, 3, 5, Unit_1.Unit.METER);
        var chain = position.stress(stress);
        it("should piece-wise multiply grde 1 components", function () {
            expect(position.x).toBe(14);
            expect(position.y).toBe(33);
            expect(position.z).toBe(65);
        });
        it("shold be chainable", function () {
            expect(chain === position).toBe(true);
        });
    });
    describe("__add__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Geometric3_1.Geometric3.random();
            var rhG = r.clone();
            var a = l.__add__(r);
            var b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Vector3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Vector3_1.Vector3.random();
            var rhG = Geometric3_1.Geometric3.fromVector(r);
            var a = l.__add__(r);
            var b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Spinor3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Spinor3_1.Spinor3.random();
            var rhG = Geometric3_1.Geometric3.fromSpinor(r);
            var a = l.__add__(r);
            var b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geoetric3, number)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Math.random();
            var rhG = Geometric3_1.Geometric3.scalar(r);
            var a = l.__add__(r);
            var b = lhG.clone().add(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
    });
    describe("__sub__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Geometric3_1.Geometric3.random();
            var rhG = r.clone();
            var a = l.__sub__(r);
            var b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Vector3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Vector3_1.Vector3.random();
            var rhG = Geometric3_1.Geometric3.fromVector(r);
            var a = l.__sub__(r);
            var b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Spinor3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Spinor3_1.Spinor3.random();
            var rhG = Geometric3_1.Geometric3.fromSpinor(r);
            var a = l.__sub__(r);
            var b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geoetric3, number)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Math.random();
            var rhG = Geometric3_1.Geometric3.scalar(r);
            var a = l.__sub__(r);
            var b = lhG.clone().sub(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
    });
    describe("__mul__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Geometric3_1.Geometric3.random();
            var rhG = r.clone();
            var a = l.__mul__(r);
            var b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Vector3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Vector3_1.Vector3.random();
            var rhG = Geometric3_1.Geometric3.fromVector(r);
            var a = l.__mul__(r);
            var b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Spinor3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Spinor3_1.Spinor3.random();
            var rhG = Geometric3_1.Geometric3.fromSpinor(r);
            var a = l.__mul__(r);
            var b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geoetric3, number)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Math.random();
            var rhG = Geometric3_1.Geometric3.scalar(r);
            var a = l.__mul__(r);
            var b = lhG.clone().mul(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
    });
    describe("__div__", function () {
        describe("(Geometrc3, Geometric3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Geometric3_1.Geometric3.random();
            var rhG = r.clone();
            var a = l.__div__(r);
            var b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Vector3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Vector3_1.Vector3.random();
            var rhG = Geometric3_1.Geometric3.fromVector(r);
            var a = l.__div__(r);
            var b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geomtric3, Spinor3)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Spinor3_1.Spinor3.random();
            var rhG = Geometric3_1.Geometric3.fromSpinor(r);
            var a = l.__div__(r);
            var b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
        describe("(Geoetric3, number)", function () {
            var l = Geometric3_1.Geometric3.random();
            var lhG = l.clone();
            var r = Math.random();
            var rhG = Geometric3_1.Geometric3.scalar(r);
            var a = l.__div__(r);
            var b = lhG.clone().div(rhG);
            it("α", function () {
                expect(a.a).toBe(b.a);
            });
            it("x", function () {
                expect(a.x).toBe(b.x);
            });
            it("y", function () {
                expect(a.y).toBe(b.y);
            });
            it("z", function () {
                expect(a.z).toBe(b.z);
            });
            it("yz", function () {
                expect(a.yz).toBe(b.yz);
            });
            it("zx", function () {
                expect(a.zx).toBe(b.zx);
            });
            it("xy", function () {
                expect(a.xy).toBe(b.xy);
            });
            it("β", function () {
                expect(a.b).toBe(b.b);
            });
        });
    });
    describe("copySpinor", function () {
        var target = Geometric3_1.Geometric3.random();
        var a = Math.random();
        var yz = Math.random();
        var zx = Math.random();
        var xy = Math.random();
        var spinor = Geometric3_1.Geometric3.spinor(a, yz, zx, xy);
        target.copySpinor(spinor);
        describe("should copy spinor components and zero out others", function () {
            it("a", function () {
                expect(target.a).toBe(spinor.a);
            });
            it("x", function () {
                expect(target.x).toBe(0);
            });
            it("y", function () {
                expect(target.y).toBe(0);
            });
            it("z", function () {
                expect(target.z).toBe(0);
            });
            it("yz", function () {
                expect(target.yz).toBe(yz);
            });
            it("zx", function () {
                expect(target.zx).toBe(zx);
            });
            it("xy", function () {
                expect(target.xy).toBe(xy);
            });
            it("b", function () {
                expect(target.b).toBe(0);
            });
        });
    });
    describe("copyVector", function () {
        var target = Geometric3_1.Geometric3.random();
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();
        var vector = Geometric3_1.Geometric3.vector(x, y, z, Unit_1.Unit.METER);
        target.copyVector(vector);
        describe("should copy vector components andzero out others", function () {
            it("a", function () {
                expect(target.a).toBe(0);
            });
            it("x", function () {
                expect(target.x).toBe(x);
            });
            it("y", function () {
                expect(target.y).toBe(y);
            });
            it("z", function () {
                expect(target.z).toBe(z);
            });
            it("yz", function () {
                expect(target.yz).toBe(0);
            });
            it("zx", function () {
                expect(target.zx).toBe(0);
            });
            it("xy", function () {
                expect(target.xy).toBe(0);
            });
            it("b", function () {
                expect(target.b).toBe(0);
            });
        });
    });
});
