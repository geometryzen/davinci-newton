import { Geometric2 } from "./Geometric2";
import { Unit } from "./Unit";

describe("Geometric2", function () {
    describe("constructor", function () {
        it("empty", function () {
            const M = new Geometric2();
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(false);
        });
        it("coordinates", function () {
            const M = new Geometric2([1, 2, 3, 4]);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(false);
        });
        it("uom", function () {
            const M = new Geometric2([1, 2, 3, 4], Unit.KILOGRAM);
            expect(M.a).toBe(1);
            expect(M.x).toBe(2);
            expect(M.y).toBe(3);
            expect(M.b).toBe(4);
            expect(M.uom).toBe(Unit.KILOGRAM);
            expect(M.isLocked()).toBe(false);
        });
    });
    describe("static", function () {
        it("scalar", function () {
            const a = Math.random();
            const M = Geometric2.scalar(a, Unit.METER);
            expect(M.a).toBe(a);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.METER);
            expect(M.isLocked()).toBe(false);
        });
        it("bivector", function () {
            const b = Math.random();
            const M = Geometric2.bivector(b, Unit.JOULE);
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit.JOULE);
            expect(M.isLocked()).toBe(false);
        });
        it("spinor", function () {
            const a = Math.random();
            const b = Math.random();
            const M = Geometric2.spinor(a, b, Unit.ONE);
            expect(M.a).toBe(a);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit.ONE);
            expect(M.isLocked()).toBe(false);
        });
        it("vector", function () {
            const x = Math.random();
            const y = Math.random();
            const M = Geometric2.vector(x, y, Unit.AMPERE);
            expect(M.a).toBe(0);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("copy", function () {
            const a = Math.random();
            const x = Math.random();
            const y = Math.random();
            const b = Math.random();
            const M = new Geometric2([a, x, y, b], Unit.AMPERE);
            const K = Geometric2.copy(M);
            expect(K.a).toBe(a);
            expect(K.x).toBe(x);
            expect(K.y).toBe(y);
            expect(K.b).toBe(b);
            expect(K.uom).toBe(Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
        it("fromScalar", function () {
            const a = Math.random();
            const x = Math.random();
            const y = Math.random();
            const b = Math.random();
            const M = new Geometric2([a, x, y, b], Unit.AMPERE);
            const K = Geometric2.fromScalar(M);
            expect(K.a).toBe(a);
            expect(K.x).toBe(0);
            expect(K.y).toBe(0);
            expect(K.b).toBe(0);
            expect(K.uom).toBe(Unit.AMPERE);
            expect(K.isLocked()).toBe(false);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.y).toBe(y);
            expect(M.b).toBe(b);
            expect(M.uom).toBe(Unit.AMPERE);
            expect(M.isLocked()).toBe(false);
        });
    });
    describe("constants", function () {
        it("zero", function () {
            const M = Geometric2.zero;
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("one", function () {
            const M = Geometric2.one;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("e1", function () {
            const M = Geometric2.e1;
            expect(M.a).toBe(0);
            expect(M.x).toBe(1);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("e2", function () {
            const M = Geometric2.e2;
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(1);
            expect(M.b).toBe(0);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("I", function () {
            const M = Geometric2.I;
            expect(M.a).toBe(0);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(1);
            expect(M.uom).toBeUndefined();
            expect(M.isLocked()).toBe(true);
        });
        it("meter", function () {
            const M = Geometric2.meter;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.METER);
            expect(M.isLocked()).toBe(true);
        });
        it("kilogram", function () {
            const M = Geometric2.kilogram;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.KILOGRAM);
            expect(M.isLocked()).toBe(true);
        });
        it("second", function () {
            const M = Geometric2.second;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.SECOND);
            expect(M.isLocked()).toBe(true);
        });
        it("ampere", function () {
            const M = Geometric2.ampere;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.AMPERE);
            expect(M.isLocked()).toBe(true);
        });
        it("kelvin", function () {
            const M = Geometric2.kelvin;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.KELVIN);
            expect(M.isLocked()).toBe(true);
        });
        it("mole", function () {
            const M = Geometric2.mole;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.MOLE);
            expect(M.isLocked()).toBe(true);
        });
        it("candela", function () {
            const M = Geometric2.candela;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.CANDELA);
            expect(M.isLocked()).toBe(true);
        });
        it("newton", function () {
            const M = Geometric2.newton;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.NEWTON);
            expect(M.isLocked()).toBe(true);
        });
        it("joule", function () {
            const M = Geometric2.joule;
            expect(M.a).toBe(1);
            expect(M.x).toBe(0);
            expect(M.y).toBe(0);
            expect(M.b).toBe(0);
            expect(M.uom).toBe(Unit.JOULE);
            expect(M.isLocked()).toBe(true);
        });
    });
    describe("locking", function () {
        it("should work.", function () {
            const M = new Geometric2();
            expect(M.isLocked()).toBe(false);
            const token = M.lock();
            expect(M.isLocked()).toBe(true);
            M.unlock(token);
            expect(M.isLocked()).toBe(false);
        });
        it("should not be able to lock if locked.", function () {
            const M = new Geometric2();
            expect(M.isLocked()).toBe(false);
            M.lock();
            expect(function () {
                M.lock();
            }).toThrowError("already locked");
        });
        it("should not be able to unlock if unlocked.", function () {
            const M = new Geometric2();
            expect(M.isLocked()).toBe(false);
            expect(function () {
                M.unlock(42);
            }).toThrowError("not locked");
        });
        it("should not be able to unlock with wrong token.", function () {
            const M = new Geometric2();
            expect(M.isLocked()).toBe(false);
            const token = M.lock();
            expect(M.isLocked()).toBe(true);
            expect(function () {
                M.unlock(42);
            }).toThrowError("unlock denied");
        });
    });
    describe("properties", function () {
        it("a", function () {
            const M = new Geometric2();
            M.a = Math.PI;
            expect(M.a).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.a = Math.random();
            }).toThrowError("Property `a` is readonly.");
        });
        it("x", function () {
            const M = new Geometric2();
            M.x = Math.PI;
            expect(M.x).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.x = Math.random();
            }).toThrowError("Property `x` is readonly.");
        });
        it("y", function () {
            const M = new Geometric2();
            M.y = Math.PI;
            expect(M.y).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.y = Math.random();
            }).toThrowError("Property `y` is readonly.");
        });
        it("b", function () {
            const M = new Geometric2();
            M.b = Math.PI;
            expect(M.b).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.b = Math.random();
            }).toThrowError("Property `b` is readonly.");
        });
        it("xy", function () {
            const M = new Geometric2();
            M.xy = Math.PI;
            expect(M.xy).toBe(Math.PI);
            M.lock();
            expect(function () {
                M.xy = Math.random();
            }).toThrowError("Property `xy` is readonly.");
        });
        it("b and xy are equivalent", function () {
            const M = new Geometric2();
            M.xy = Math.PI;
            expect(M.b).toBe(Math.PI);
            expect(M.xy).toBe(Math.PI);
            M.b = Math.E;
            expect(M.b).toBe(Math.E);
            expect(M.xy).toBe(Math.E);
        });
        it("uom", function () {
            const M = new Geometric2();
            M.uom = Unit.METER;
            expect(M.uom).toBe(Unit.METER);
            M.lock();
            expect(function () {
                M.uom = Unit.SECOND;
            }).toThrowError("Property `uom` is readonly.");
        });
    });
    describe("grades", function () {
        it("scalar", function () {
            expect(Geometric2.zero.grades).toBe(0);
            expect(Geometric2.one.grades).toBe(1);
        });
        it("vector", function () {
            expect(Geometric2.e1.grades).toBe(2);
            expect(Geometric2.e2.grades).toBe(2);
            expect(Geometric2.vector(0, 0).grades).toBe(0);
        });
        it("pseudoscalar", function () {
            expect(Geometric2.I.grades).toBe(4);
            expect(Geometric2.bivector(0).grades).toBe(0);
        });
        it("ALL", function () {
            expect(new Geometric2([1, 2, 3, 4]).grades).toBe(7);
        });
    });
    describe("add", function () {
        it("LHS is zero.", function () {
            const lhs = new Geometric2([0, 0, 0, 0]);
            const rhs = new Geometric2([5, 6, 7, 8]);
            const sum = lhs.add(rhs);
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
            const lhs = new Geometric2([1, 2, 3, 4]);
            const rhs = new Geometric2([0, 0, 0, 0]);
            const sum = lhs.add(rhs);
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
            const lhs = new Geometric2([1, 2, 3, 4]);
            const rhs = new Geometric2([5, 6, 7, 8]);
            const sum = lhs.add(rhs);
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
            const lhs = new Geometric2([1, 2, 3, 4]);
            lhs.lock();
            const rhs = new Geometric2([5, 6, 7, 8]);
            const sum = lhs.add(rhs);
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
    describe("direction", function () {
        it("locked=false, mutate=false", function () {
            const M = Geometric2.vector(5, 0);
            const dir = M.direction(false);
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
            const M = Geometric2.vector(5, 0);
            const dir = M.direction(true);
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
            const M = Geometric2.vector(5, 0);
            M.lock();
            const dir = M.direction(false);
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
            const M = Geometric2.vector(5, 0);
            M.lock();
            expect(function () {
                M.direction(true);
            }).toThrowError("Unable to mutate this locked Geometric2.");
        });
    });
    describe("inv", function () {
        it("scalar(2) should be 0.5", function () {
            const M = Geometric2.scalar(2, Unit.METER);
            const inverse = M.inv();
            expect(inverse.a).toBe(0.5);
            expect(inverse.x).toBe(0);
            expect(inverse.y).toBe(0);
            expect(inverse.b).toBe(0);
            expect(inverse.uom).toBe(Unit.ONE.div(Unit.METER));
        });
        it("2 * e1 should be 0.5 * e1", function () {
            const M = Geometric2.vector(2, 0, Unit.METER);
            const inverse = M.inv();
            expect(inverse.a).toBe(0);
            expect(inverse.x).toBe(0.5);
            expect(inverse.y).toBe(0);
            expect(inverse.b).toBe(0);
            expect(inverse.uom).toBe(Unit.ONE.div(Unit.METER));
        });
        it("2 * e2 should be 0.5 * e2", function () {
            const M = Geometric2.vector(0, 2, Unit.METER);
            const inverse = M.inv();
            expect(inverse.a).toBe(0);
            expect(inverse.x).toBe(0);
            expect(inverse.y).toBe(0.5);
            expect(inverse.b).toBe(0);
            expect(inverse.uom).toBe(Unit.ONE.div(Unit.METER));
        });
        it("2 * I should be -0.5 * I", function () {
            const M = Geometric2.bivector(2, Unit.METER);
            const inverse = M.inv();
            expect(inverse.a).toBe(0);
            expect(inverse.x).toBe(0);
            expect(inverse.y).toBe(0);
            expect(inverse.b).toBe(-0.5);
            expect(inverse.uom).toBe(Unit.ONE.div(Unit.METER));
        });
    });
    describe("magnitude", function () {
        it("zero is scalar(0)", function () {
            const M = Geometric2.zero;
            const mag = M.magnitude(false);
            expect(mag.a).toBe(0);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("one is scalar(1)", function () {
            const M = Geometric2.one;
            const mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("e1 is scalar(1)", function () {
            const M = Geometric2.e1;
            const mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("e2 is scalar(1)", function () {
            const M = Geometric2.e2;
            const mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
        it("I is scalar(1)", function () {
            const M = Geometric2.I;
            const mag = M.magnitude(false);
            expect(mag.a).toBe(1);
            expect(mag.x).toBe(0);
            expect(mag.y).toBe(0);
            expect(mag.b).toBe(0);
        });
    });
    describe("toString", function () {
        it("zero is scalar(0)", function () {
            const M = Geometric2.zero;
            expect(M.toString()).toBe("0");
        });
        it("one", function () {
            const M = Geometric2.one;
            expect(M.toString()).toBe("1");
        });
        it("e1", function () {
            const M = Geometric2.e1;
            expect(M.toString()).toBe("e1");
        });
        it("e2", function () {
            const M = Geometric2.e2;
            expect(M.toString()).toBe("e2");
        });
        it("I is e12", function () {
            const M = Geometric2.I;
            expect(M.toString()).toBe("e12");
        });
        it("10", function () {
            const M = Geometric2.one.mulByNumber(10);
            expect(M.toString()).toBe("10");
            expect(M.toString(10)).toBe("10");
            expect(M.toString(2)).toBe("1010");
            expect(M.toString(16)).toBe("a");
        });
        it("kilogram", function () {
            const M = Geometric2.kilogram;
            expect(M.toString()).toBe("1 kg");
        });
        it("meter", function () {
            const M = Geometric2.meter;
            expect(M.toString()).toBe("1 m");
        });
        it("second", function () {
            const M = Geometric2.second;
            expect(M.toString()).toBe("1 s");
        });
    });
});
