import { BivectorE3 } from './BivectorE3';
import { Geometric3 } from './Geometric3';
import { Spinor3 } from './Spinor3';
import { Unit } from './Unit';
import { Vector3 } from './Vector3';
import { VectorE3 } from './VectorE3';

/**
 * @hidden
 */
const one = Geometric3.one;
/**
 * @hidden
 */
const e1 = Geometric3.e1;
/**
 * @hidden
 */
const e2 = Geometric3.e2;
/**
 * @hidden
 */
const e3 = Geometric3.e3;
/**
 * @hidden
 */
const e23 = e2.mul(e3);
/**
 * @hidden
 */
const e31 = e3.mul(e1);
/**
 * @hidden
 */
const e12 = e1.mul(e2);
/**
 * @hidden
 */
const I = Geometric3.I;
/**
 * @hidden
 */
const meter = Geometric3.meter;
/**
 * @hidden
 */
const kilogram = Geometric3.kilogram;
/**
 * @hidden
 */
const second = Geometric3.second;
/**
 * @hidden
 */
const ampere = Geometric3.ampere;
/**
 * @hidden
 */
const kelvin = Geometric3.kelvin;
/**
 * @hidden
 */
const mole = Geometric3.mole;
/**
 * @hidden
 */
const candela = Geometric3.candela;

/**
 * @hidden
 * @param M 
 * @param n 
 * @returns 
 */
function reflectSpec(M: Geometric3, n: VectorE3) {
    const spec = function () {
        /**
         * We want to verify that coefficients are carried through.
         */
        const S = M.clone().mulByNumber(2);
        /**
         * We want the reflect method to work even when n is not a unit vector.
         */
        const N = Geometric3.fromVector(n).mulByNumber(3);
        /**
         * The 'Test' result using the specialized method.
         */
        const T = S.clone().reflect(N);
        /**
         * The 'Control' value computed explicitly as C = -n * S * n
         */
        const C = N.clone().mul(S).mul(N).mulByNumber(-1);

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
 * @hidden
 */
const PRECISION = 12;

describe("Geometric3", function () {

    describe("Properties", function () {
        it("I", function () {
            const m = Geometric3.I;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(1);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e1", function () {
            const m = Geometric3.e1;
            expect(m.a).toBe(0);
            expect(m.x).toBe(1);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e2", function () {
            const m = Geometric3.e2;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(1);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e3", function () {
            const m = Geometric3.e3;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(1);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("one", function () {
            const m = Geometric3.one;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("zero", function () {
            const m = Geometric3.zero;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(0);
        });
        it("e12", function () {
            const m = e12;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(1);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e23", function () {
            const m = e23;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(1);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("e31", function () {
            const m = e31;
            expect(m.a).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(1);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
        });
        it("meter", function () {
            const m = meter;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 m");
        });
        it("kilogram", function () {
            const m = kilogram;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 kg");
        });
        it("second", function () {
            const m = second;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 s");
        });
        it("ampere", function () {
            const m = ampere;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 A");
        });
        it("kelvin", function () {
            const m = kelvin;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 K");
        });
        it("mole", function () {
            const m = mole;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 mol");
        });
        it("candela", function () {
            const m = candela;
            expect(m.a).toBe(1);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.z).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.yz).toBe(0);
            expect(m.zx).toBe(0);
            expect(m.b).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(false);
            expect(m.isLocked()).toBe(true);
            expect(m.magnitude(false).a).toBe(1);
            expect(m.toString()).toBe("1 cd");
        });
    });

    describe("uom", function () {
        it("KILOGRAM", function () {
            const kg = Geometric3.scalar(1, Unit.KILOGRAM);
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
            const m = Geometric3.scalar(1, Unit.METER);
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
            const s = Geometric3.scalar(1, Unit.SECOND);
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
            const A = Geometric3.scalar(1, Unit.AMPERE);
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
            const C = Geometric3.scalar(1, Unit.COULOMB);
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
            expect(Geometric3.zero.grades).toBe(0x0);
        });
        it("1 => 0x1", function () {
            expect(Geometric3.one.grades).toBe(0x1);
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
            expect(Geometric3.wedge(e1, e2).grades).toBe(0x4);
        });
        it("e2 ^ e3 => 0x4", function () {
            expect(Geometric3.wedge(e2, e3).grades).toBe(0x4);
        });
        it("e3 ^ e1 => 0x4", function () {
            expect(Geometric3.wedge(e3, e1).grades).toBe(0x4);
        });
        it("rotorFromDirections(e1, e2) => 0x5", function () {
            expect(Geometric3.rotorFromDirections(e1, e2).grades).toBe(0x5);
        });
        it("pseudoscalar => 0x8", function () {
            const I = Geometric3.I;
            expect(I.grades).toBe(0x8);
        });
    });

    describe("mulByBivector", function () {
        it("(vector, bivector) should be same as vector.mul(bivector)", function () {
            const lhs = Geometric3.vector(Math.random(), Math.random(), Math.random());
            const B = Geometric3.bivector(Math.random(), Math.random(), Math.random());
            const actualOut = lhs.clone().mulByBivector(B);
            const expectOut = lhs.clone().mul(B);
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
            const lhs = Geometric3.spinor(Math.random(), Math.random(), Math.random(), Math.random());
            const B = Geometric3.bivector(Math.random(), Math.random(), Math.random());
            const actualOut = lhs.clone().mulByBivector(B);
            const expectOut = lhs.clone().mul(B);
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
            const lhs = Geometric3.pseudo(Math.random());
            const B = Geometric3.bivector(Math.random(), Math.random(), Math.random());
            const actualOut = lhs.clone().mulByBivector(B);
            const expectOut = lhs.clone().mul(B);
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
            const lhs = Geometric3.vector(Math.random(), Math.random(), Math.random());
            const rhs = Geometric3.vector(Math.random(), Math.random(), Math.random());
            const actualOut = lhs.clone().mulByVector(rhs);
            const expectOut = lhs.clone().mul(rhs);
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
            const lhs = Geometric3.spinor(Math.random(), Math.random(), Math.random(), Math.random());
            const rhs = Geometric3.vector(Math.random(), Math.random(), Math.random());
            const actualOut = lhs.clone().mulByVector(rhs);
            const expectOut = lhs.clone().mul(rhs);
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
            const lhs = Geometric3.pseudo(Math.random());
            const rhs = Geometric3.vector(Math.random(), Math.random(), Math.random());
            const actualOut = lhs.clone().mulByVector(rhs);
            const expectOut = lhs.clone().mul(rhs);
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
            const numer: Geometric3 = one.clone();
            const denom: Geometric3 = one.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.isOne()).toBeTruthy();
        });
        it("1 / 2 should be 0.5", function () {
            const numer: Geometric3 = one.clone();
            const denom: Geometric3 = one.clone().mulByNumber(2);
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(one.clone().divByNumber(2).toString());
        });
        it("e1 / 1 should be e1", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = one.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(e1.toString());
        });
        it("e1 / e1 should be 1", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = e1.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(one.toString());
        });
        it("e1 / e2 should be e1 * e2", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = e2.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(e1.clone().mul(e2).toString());
        });
        it("e1 / I should be e3 * e2", function () {
            const numer: Geometric3 = e1.clone();
            const denom: Geometric3 = I.clone();
            const ratio = numer.clone().div(denom);
            expect(ratio.toString()).toBe(e3.clone().mul(e2).toString());
        });
    });

    describe("equals", function () {
        it("(M) should be eqial to M", function () {
            const zero: Geometric3 = Geometric3.zero;
            const one: Geometric3 = Geometric3.one;
            expect(zero.equals(zero)).toBe(true);
            expect(one.equals(one)).toBe(true);
            expect(zero.equals(one)).toBe(false);
            expect(one.equals(zero)).toBe(false);
        });
    });

    describe("grade", function () {
        const m = one.add(e1).add(e2).add(e3).add(e12).add(e23).add(e31).add(I);
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
            const s = m.grade(0);
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
            const s = m.grade(1);
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
            const s = m.grade(2);
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
            const s = m.grade(3);
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
            const one: Geometric3 = Geometric3.one;
            const inv = one.clone().inv();
            expect(inv.equals(one)).toBe(true);
        });
        it("(2) should be 0.5", function () {
            const two: Geometric3 = Geometric3.scalar(2);
            const inv = two.clone().inv();
            const half: Geometric3 = Geometric3.scalar(0.5);
            expect(inv.equals(half)).toBe(true);
        });
        it("(e1) should be e1", function () {
            const e1: Geometric3 = Geometric3.e1;
            const inv = e1.clone().inv();
            expect(inv.equals(e1)).toBe(true);
        });
        it("(2 * e1) should be 0.5 * e1", function () {
            const e1: Geometric3 = Geometric3.e1;
            const inv = e1.clone().mulByNumber(2).inv();
            const halfE1 = e1.clone().mulByNumber(0.5);
            expect(inv.equals(halfE1)).toBe(true);
        });
        it("(e2) should be e2", function () {
            const e2: Geometric3 = Geometric3.e2;
            const inv = e2.clone().inv();
            expect(inv.equals(e2)).toBe(true);
        });
        it("(2 * e2) should be 0.5 * e2", function () {
            const e2: Geometric3 = Geometric3.e2;
            const inv = e2.clone().mulByNumber(2).inv();
            const halfE2 = e2.clone().mulByNumber(0.5);
            expect(inv.equals(halfE2)).toBe(true);
        });
        it("(e3) should be e3", function () {
            const e3: Geometric3 = Geometric3.e3;
            const inv = e3.clone().inv();
            expect(inv.equals(e3)).toBe(true);
        });
        it("(2 * e3) should be 0.5 * e3", function () {
            const e3: Geometric3 = Geometric3.e3;
            const inv = e3.clone().mulByNumber(2).inv();
            const halfE3 = e3.clone().mulByNumber(0.5);
            expect(inv.equals(halfE3)).toBe(true);
        });
        it("(I) should be -I", function () {
            const e1: Geometric3 = Geometric3.e1;
            const e2: Geometric3 = Geometric3.e2;
            const e3: Geometric3 = Geometric3.e3;
            const I = e1.clone().mul(e2).mul(e3);
            const inv = I.clone().inv();
            const minusI = I.clone().neg();
            expect(inv.equals(minusI)).toBe(true);
        });
        it("(2 * I) should be -0.5 * I", function () {
            const e1: Geometric3 = Geometric3.e1;
            const e2: Geometric3 = Geometric3.e2;
            const e3: Geometric3 = Geometric3.e3;
            const I = e1.clone().mul(e2).mul(e3);
            const inv = I.clone().mulByNumber(2).inv();
            const minusHalfI = I.clone().neg().mulByNumber(0.5);
            expect(inv.equals(minusHalfI)).toBe(true);
        });
    });

    describe("rotorFromAxisAngle", function () {
        describe("(e3, PI)", function () {
            const axis: VectorE3 = e3;
            const R = Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI);
            R.approx(12);
            it("should equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
        describe("(e3, PI/2)", function () {
            const axis: VectorE3 = e3;
            const R = Geometric3.random();
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
            const axis: VectorE3 = e3.clone().mulByNumber(2);
            const R = Geometric3.random();
            R.rotorFromAxisAngle(axis, Math.PI);
            R.approx(12);
            it("should equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
    });

    describe("rotorFromDirections", function () {
        const cosPIdiv4 = Math.cos(Math.PI / 4);
        const sinPIdiv4 = Math.sin(Math.PI / 4);
        describe("from +e1", function () {
            it("to +e1", function () {
                const R = Geometric3.rotorFromDirections(e1, e1);
                expect(R.a).toBe(1);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(0);
            });
            it("to +e2", function () {
                const R = Geometric3.rotorFromDirections(e1, e2);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(-sinPIdiv4);
            });
            it("to +e3", function () {
                const R = Geometric3.rotorFromDirections(e1, e3);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(sinPIdiv4);
                expect(R.xy).toBe(0);
            });
            it("to -e1", function () {
                const R = Geometric3.rotorFromDirections(e1, e1.clone().neg());
                const V = e1.clone().rotate(R);
                expect(V.a).toBe(0);
                expect(V.x).toBe(-1);
                expect(V.y).toBe(0);
                expect(V.z).toBe(0);
                expect(V.yz).toBe(0);
                expect(V.zx).toBe(0);
                expect(V.xy).toBe(0);
            });
            it("to -e2", function () {
                const R = Geometric3.rotorFromDirections(e1, e2.clone().neg());
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(sinPIdiv4);
            });
            it("to -e3", function () {
                const R = Geometric3.rotorFromDirections(e1, e3.clone().neg());
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
                const R = Geometric3.rotorFromDirections(e1.clone().neg(), e1);
                const V = e1.clone().neg().rotate(R);
                expect(V.a).toBe(0);
                expect(V.x).toBe(1);
                expect(V.y).toBe(0);
                expect(V.z).toBe(0);
                expect(V.yz).toBe(0);
                expect(V.zx).toBe(0);
                expect(V.xy).toBe(0);
            });
            it("to +e2", function () {
                const R = Geometric3.rotorFromDirections(e1.clone().neg(), e2);
                expect(R.a).toBe(cosPIdiv4);
                expect(R.x).toBe(0);
                expect(R.y).toBe(0);
                expect(R.z).toBe(0);
                expect(R.yz).toBe(0);
                expect(R.zx).toBe(0);
                expect(R.xy).toBe(sinPIdiv4);
            });
            it("to +e3", function () {
                const R = Geometric3.rotorFromDirections(e1.clone().neg(), e3);
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
            const R = Geometric3.rotorFromDirections(e2, e1);
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(+sinPIdiv4);
        });
        it("(+e2, -e1)", function () {
            const R = Geometric3.rotorFromDirections(e2, e1.clone().neg());
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(-sinPIdiv4);
        });
        it("(+e2, +e2)", function () {
            const R = Geometric3.rotorFromDirections(e2, e2);
            expect(R.a).toBe(1);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e2, +e3)", function () {
            const R = Geometric3.rotorFromDirections(e2, e3);
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(-sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e2, -e3)", function () {
            const R = Geometric3.rotorFromDirections(e2, e3.clone().neg());
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e3, +e1)", function () {
            const R = Geometric3.rotorFromDirections(e3, e1);
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(-sinPIdiv4);
            expect(R.xy).toBe(0);
        });
        it("(+e3, -e1)", function () {
            const R = Geometric3.rotorFromDirections(e3, e1.clone().neg());
            expect(R.a).toBe(cosPIdiv4);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(sinPIdiv4);
            expect(R.xy).toBe(0);
        });
        it("(+e3, +e2)", function () {
            const R = Geometric3.rotorFromDirections(e3, e2);
            expect(R.a).toBe(cosPIdiv4, 15);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(+sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e3, -e2)", function () {
            const R = Geometric3.rotorFromDirections(e3, e2.clone().neg());
            expect(R.a).toBe(cosPIdiv4, 15);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(-sinPIdiv4);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e3, +e3)", function () {
            const R = Geometric3.rotorFromDirections(e3, e3);
            expect(R.a).toBe(1);
            expect(R.x).toBe(0);
            expect(R.y).toBe(0);
            expect(R.z).toBe(0);
            expect(R.yz).toBe(0);
            expect(R.zx).toBe(0);
            expect(R.xy).toBe(0);
        });
        it("(+e2, -e2)", function () {
            const R = Geometric3.rotorFromDirections(e2, e2.clone().neg());
            const V = e2.clone().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(-1);
            expect(V.z).toBe(0);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(-e2, +e2)", function () {
            const R = Geometric3.rotorFromDirections(e2.clone().neg(), e2);
            const V = e2.clone().neg().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(1);
            expect(V.z).toBe(0);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(+e3, -e3)", function () {
            const R = Geometric3.rotorFromDirections(e3, e3.clone().neg());
            const V = e3.clone().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(0);
            expect(V.z).toBe(-1);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(-e3, +e3)", function () {
            const R = Geometric3.rotorFromDirections(e3.clone().neg(), e3);
            const V = e3.clone().neg().rotate(R);
            expect(V.a).toBe(0);
            expect(V.x).toBe(0);
            expect(V.y).toBe(0);
            expect(V.z).toBe(1);
            expect(V.yz).toBe(0);
            expect(V.zx).toBe(0);
            expect(V.xy).toBe(0);
        });
        it("(random, random) should be rotor that rotates a to b", function () {
            const a = Geometric3.random().grade(1).direction(true);
            const b = Geometric3.random().grade(1).direction(true);
            const R = Geometric3.rotorFromDirections(a, b);
            const V = a.clone().rotate(R);
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
            const R = Geometric3.rotorFromFrameToFrame([e1, e2, e3], [e1, e2, e3]);
            expect(R.a).toBe(1);
        });
        it("[e2, e3, e1] to [e3, e2, -e1]", function () {
            const R = Geometric3.rotorFromFrameToFrame([e2, e3, e1], [e3, e2, e1.__neg__()]);
            const f1 = e2.clone().rotate(R);
            expect(f1.x).toBeCloseTo(e3.x, 14);
            expect(f1.y).toBeCloseTo(e3.y, 14);
            expect(f1.z).toBeCloseTo(e3.z, 14);
            const f2 = e3.clone().rotate(R);
            expect(f2.x).toBeCloseTo(e2.x, 14);
            expect(f2.y).toBeCloseTo(e2.y, 14);
            expect(f2.z).toBeCloseTo(e2.z, 14);
        });
    });

    describe("rotorFrmGeneratorAngle", function () {
        describe("(e1 ^ e2, PI)", function () {
            const B: BivectorE3 = e1.clone().ext(e2);
            const R = Geometric3.random();
            R.rotorFromGeneratorAngle(B, Math.PI);
            R.approx(12);
            it("shoud equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
        describe("(2  e1 ^ e2, PI/2)", function () {
            const B = e1.clone().ext(e2).mulByNumber(2);
            const R = Geometric3.one.clone().addVector(e1).addVector(e2).addVector(e3).addPseudo(1).add(B);
            R.rotorFromGeneratorAngle(B, Math.PI / 2);
            R.approx(12);
            it("shoud equal e2 ^ e1", function () {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy();
            });
        });
    });

    describe("reflect", function () {
        const n = Vector3.vector(1, 0, 0);
        const a = Geometric3.vector(2, 3, 0, Unit.METER);
        const chain = a.reflect(n);

        it("should reflect (2,3)", function () {
            expect(a.x).toBe(-2);
            expect(a.y).toBe(+3);
            expect(a.z).toBe(0);
        });
        it("should be chainable", function () {
            expect(chain === a).toBe(true);
        });
        describe("(n)", function () {
            const S = Geometric3.random();
            const n = Geometric3.random().grade(1).direction(true);
            /**
             * The 'Test' result using the specialized method.
             */
            const T = S.clone().reflect(n);
            /**
             * The 'Control' value computed explicitly as C = -n * S * n
             */
            const C = n.clone().mul(S).mul(n).mulByNumber(-1);

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
        const stress = Vector3.vector(7, 11, 13);
        const position = Geometric3.vector(2, 3, 5, Unit.METER);
        const chain = position.stress(stress);

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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__add__(r);
            const b = lhG.clone().add(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__sub__(r);
            const b = lhG.clone().sub(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__mul__(r);
            const b = lhG.clone().mul(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Geometric3.random();
            const rhG = r.clone();
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Vector3.random();
            const rhG = Geometric3.fromVector(r);
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Spinor3.random();
            const rhG = Geometric3.fromSpinor(r);
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
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
            const l = Geometric3.random();
            const lhG = l.clone();
            const r = Math.random();
            const rhG = Geometric3.scalar(r);
            const a = l.__div__(r);
            const b = lhG.clone().div(rhG);
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
        const target = Geometric3.random();
        const a = Math.random();
        const yz = Math.random();
        const zx = Math.random();
        const xy = Math.random();
        const spinor = Geometric3.spinor(a, yz, zx, xy);
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
        const target = Geometric3.random();
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        const vector = Geometric3.vector(x, y, z, Unit.METER);
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
