import { Geometric1, lock } from "./Geometric1";
import { Unit } from "./Unit";

/**
 * @hidden
 */
function checkEQ(result: Geometric1, comp: Geometric1): void {
    expect(result.a).toBe(comp.a, `a, result=${result.a}, comp=${comp.a}`);
    expect(result.x).toBe(comp.x, `x, result=${result.x}, comp=${comp.x}`);
    expect(Unit.isCompatible(result.uom, comp.uom)).toBe(true, `uom, result=${result.uom}, comp=${comp.uom}`);
    expect(result.isLocked()).toBe(comp.isLocked(), `isLocked, result=${result.isLocked()}, comp=${comp.isLocked()}`);
    expect(result.isMutable()).toBe(comp.isMutable(), `isMutable, result=${result.isMutable()}, comp=${comp.isMutable()}`);
}

describe("Geometric1", function () {
    describe("constructor", function () {
        it("with no args should be zero.", function () {
            const m = new Geometric1();
            expect(m).toBeDefined();
            expect(m.a).toBe(0);
            expect(Unit.isOne(m.uom)).toBe(true);
        });
        it("with scalar value and unit should work.", function () {
            const a = Math.random();
            const m = new Geometric1([a, 0], Unit.KELVIN);
            expect(m).toBeDefined();
            expect(m.a).toBe(a);
            expect(m.uom).toBe(Unit.KELVIN);
        });
        it("", function () {
            expect(function () {
                const m = new Geometric1([1, 2, 3] as unknown[] as [number, number]);
                // Keep the compiler happy.
                expect(m).toBeDefined();
                fail();
            }).toThrowError("coords.length must be 2.");
        });
    });
    describe("a", function () {
        it("should support getter and setter.", function () {
            const m = new Geometric1();
            const a = Math.random();
            const x = Math.random();
            m.a = a;
            m.x = x;
            expect(m.a).toBe(a);
        });
        it("should prevent mutation when locked", function () {
            expect(function () {
                const m = new Geometric1();
                m.lock();
                const a = Math.random();
                m.a = a;
            }).toThrowError("Property `a` is readonly.");
        });
    });
    describe("add", function () {
        it("lhs.isMutable, alpha=undefined", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const sum = lhs.add(rhs);
            const comp = new Geometric1([La + Ra, Lx + Rx], Unit.CANDELA);
            checkEQ(sum, comp);
        });
        it("lhs.isMutable, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const sum = lhs.add(rhs, 0.5);
            const comp = new Geometric1([La + 0.5 * Ra, Lx + 0.5 * Rx], Unit.CANDELA);
            checkEQ(sum, comp);
        });
        it("lhs.isLocked, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            lhs.lock();
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const sum = lhs.add(rhs, 0.5);
            const comp = new Geometric1([La + 0.5 * Ra, Lx + 0.5 * Rx], Unit.CANDELA);
            comp.lock();
            checkEQ(sum, comp);
        });
        it("lhs.isZero, alpha=0.5", function () {
            const La = 0;
            const Lx = 0;
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.MOLE);
            lhs.lock();
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const sum = lhs.add(rhs, 0.5);
            const comp = new Geometric1([La + 0.5 * Ra, Lx + 0.5 * Rx], Unit.CANDELA);
            comp.lock();
            checkEQ(sum, comp);
        });
        it("lhs.isLocked, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Lu = Unit.MOLE;
            const Ra = 0;
            const Rx = 0;
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Lu);
            lhs.lock();
            const rhs = new Geometric1([Ra, Rx], Ru);
            const sum = lhs.add(rhs, 0.5);
            const comp = new Geometric1([La + 0.5 * Ra, Lx + 0.5 * Rx], Lu);
            comp.lock();
            checkEQ(sum, comp);
        });
    });
    describe("clone", function () {
        it("should copy a", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            const clone = mv.clone();
            expect(clone.a).toBe(a);
        });
        it("should copy x", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            const clone = mv.clone();
            expect(clone.x).toBe(x);
        });
        it("should copy uom", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            const clone = mv.clone();
            expect(clone.uom).toBe(Unit.KELVIN);
        });
        it("should be mutable if original was mutable", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            const clone = mv.clone();
            expect(clone.isMutable()).toBe(true);
        });
        it("should be mutable if original was locked", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            mv.lock();
            const clone = mv.clone();
            expect(clone.isMutable()).toBe(true);
        });
        it("should be mutable if original was mutable", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            const clone = mv.clone();
            expect(clone === mv).toBe(false);
        });
    });
    describe("x", function () {
        it("should support getter and setter.", function () {
            const m = new Geometric1();
            const a = Math.random();
            const x = Math.random();
            m.a = a;
            m.x = x;
            expect(m.x).toBe(x);
        });
        it("should prevent mutation when locked", function () {
            expect(function () {
                const m = new Geometric1();
                m.lock();
                const x = Math.random();
                m.x = x;
            }).toThrowError("Property `x` is readonly.");
        });
    });
    describe("uom", function () {
        it("should support getter and setter.", function () {
            const m = new Geometric1();
            m.uom = Unit.KELVIN;
            expect(m.uom).toBe(Unit.KELVIN);
        });
        it("should prevent mutation when locked", function () {
            expect(function () {
                const m = new Geometric1();
                m.lock();
                m.uom = Unit.MOLE;
            }).toThrowError("Property `uom` is readonly.");
        });
    });
    describe("isLocked", function () {
        it("should be unlocked using constructor.", function () {
            const m = new Geometric1();
            expect(m.isLocked()).toBe(false);
        });
    });
    describe("isMutable", function () {
        it("should be mutable using constructor.", function () {
            const m = new Geometric1();
            expect(m.isMutable()).toBe(true);
        });
    });
    describe("lock/unlock", function () {
        it("should be mutable using constructor.", function () {
            const m = new Geometric1();
            const token = m.lock();
            expect(m.isLocked()).toBe(true);
            expect(m.isMutable()).toBe(false);
            m.unlock(token);
            expect(m.isLocked()).toBe(false);
            expect(m.isMutable()).toBe(true);
        });
    });
    describe("lock() applied to a locked", function () {
        it("should throw an Error.", function () {
            const m = new Geometric1();
            m.lock();
            expect(function () {
                m.lock();
                fail();
            }).toThrowError("already locked");
        });
    });
    describe("unlock() applied to an unlocked", function () {
        it("should throw an Error.", function () {
            const m = new Geometric1();
            expect(function () {
                const token = Math.random();
                m.unlock(token);
                fail();
            }).toThrowError("not locked");
        });
    });
    describe("unlock() with the wrong token", function () {
        it("should throw an Error.", function () {
            const m = new Geometric1();
            m.lock();
            expect(function () {
                const token = Math.random();
                m.unlock(token);
                fail();
            }).toThrowError("unlock denied");
        });
    });
    describe("isOne", function () {
        it("one", function () {
            const one = new Geometric1([1, 0]);
            expect(one.isOne()).toBe(true);
        });
        it("two", function () {
            const two = new Geometric1([2, 0]);
            expect(two.isOne()).toBe(false);
        });
        it("1 + e1", function () {
            const mv = new Geometric1([1, 1]);
            expect(mv.isOne()).toBe(false);
        });
        it("kg", function () {
            const kg = new Geometric1([1, 0], Unit.KILOGRAM);
            expect(kg.isOne()).toBe(false);
        });
    });
    describe("isZero", function () {
        it("zero", function () {
            const zero = new Geometric1([0, 0]);
            expect(zero.isZero()).toBe(true);
        });
        it("one", function () {
            const one = new Geometric1([1, 0]);
            expect(one.isZero()).toBe(false);
        });
        it("e1", function () {
            const mv = new Geometric1([0, 1]);
            expect(mv.isZero()).toBe(false);
        });
        it("0 * kg", function () {
            const kg = new Geometric1([0, 0], Unit.KILOGRAM);
            expect(kg.isZero()).toBe(true);
        });
    });
    describe("norm", function () {
        it("mutable", function () {
            const a = Math.random();
            const x = Math.random();
            const M = new Geometric1([a, x], Unit.METER);
            const norm = M.magnitude();
            const comp = new Geometric1([Math.sqrt(a * a + x * x), 0], Unit.METER);
            checkEQ(norm, comp);
            expect(norm === M).toBe(true);
        });
        it("locked", function () {
            const a = Math.random();
            const x = Math.random();
            const M = new Geometric1([a, x], Unit.METER);
            M.lock();
            const norm = M.magnitude();
            const comp = lock(new Geometric1([Math.sqrt(a * a + x * x), 0], Unit.METER));
            checkEQ(norm, comp);
            expect(norm !== M).toBe(true);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.uom).toBe(Unit.METER);
        });
    });
    describe("quad", function () {
        it("mutable", function () {
            const a = Math.random();
            const x = Math.random();
            const M = new Geometric1([a, x], Unit.METER);
            const norm = M.quaditude();
            const comp = new Geometric1([a * a + x * x, 0], Unit.mul(Unit.METER, Unit.METER));
            checkEQ(norm, comp);
            expect(norm === M).toBe(true);
        });
        it("locked", function () {
            const a = Math.random();
            const x = Math.random();
            const M = new Geometric1([a, x], Unit.METER);
            M.lock();
            const norm = M.quaditude();
            const comp = lock(new Geometric1([a * a + x * x, 0], Unit.mul(Unit.METER, Unit.METER)));
            checkEQ(norm, comp);
            expect(norm !== M).toBe(true);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.uom).toBe(Unit.METER);
        });
    });
    describe("scale", function () {
        it("mutable", function () {
            const a = 3; // Math.random();
            const x = 5; // Math.random();
            const M = new Geometric1([a, x], Unit.METER);
            const norm = M.scale(2);
            const comp = new Geometric1([2 * a, 2 * x], Unit.METER);
            checkEQ(norm, comp);
            expect(norm === M).toBe(true);
        });
        it("locked", function () {
            const a = 7; // Math.random();
            const x = 11; // Math.random();
            const M = new Geometric1([a, x], Unit.METER);
            M.lock();
            const norm = M.scale(2);
            const comp = lock(new Geometric1([2 * a, 2 * x], Unit.METER));
            checkEQ(norm, comp);
            expect(norm !== M).toBe(true);
            expect(M.a).toBe(a);
            expect(M.x).toBe(x);
            expect(M.uom).toBe(Unit.METER);
        });
    });
    describe("sub", function () {
        it("lhs.isMutable, alpha=undefined", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const result = lhs.sub(rhs);
            const comp = new Geometric1([La - Ra, Lx - Rx], Unit.CANDELA);
            checkEQ(result, comp);
        });
        it("lhs.isMutable, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const result = lhs.sub(rhs, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx - 0.5 * Rx], Unit.CANDELA);
            checkEQ(result, comp);
        });
        it("lhs.isLocked, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Rx = Math.random();
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            lhs.lock();
            const rhs = new Geometric1([Ra, Rx], Unit.CANDELA);
            const result = lhs.sub(rhs, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx - 0.5 * Rx], Unit.CANDELA);
            comp.lock();
            checkEQ(result, comp);
        });
        it("lhs.isZero, alpha=0.5", function () {
            const La = 0;
            const Lx = 0;
            const Lu = Unit.MOLE;
            const Ra = Math.random();
            const Rx = Math.random();
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Lu);
            lhs.lock();
            const rhs = new Geometric1([Ra, Rx], Ru);
            const result = lhs.sub(rhs, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx - 0.5 * Rx], Ru);
            comp.lock();
            checkEQ(result, comp);
        });
        it("rhs.isZero, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Lu = Unit.MOLE;
            const Ra = 0;
            const Rx = 0;
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Lu);
            lhs.lock();
            const rhs = new Geometric1([Ra, Rx], Ru);
            const result = lhs.sub(rhs, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx - 0.5 * Rx], Lu);
            comp.lock();
            checkEQ(result, comp);
        });
    });
    describe("subScalar", function () {
        it("lhs.isMutable, alpha=undefined", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            const result = lhs.subScalar(Ra, Ru);
            const comp = new Geometric1([La - Ra, Lx], Unit.CANDELA);
            checkEQ(result, comp);
        });
        it("lhs.isMutable, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            const result = lhs.subScalar(Ra, Ru, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx], Unit.CANDELA);
            checkEQ(result, comp);
        });
        it("lhs.isLocked, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Ra = Math.random();
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Unit.CANDELA);
            lhs.lock();
            const result = lhs.subScalar(Ra, Ru, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx], Unit.CANDELA);
            comp.lock();
            checkEQ(result, comp);
        });
        it("lhs.isZero, alpha=0.5", function () {
            const La = 0;
            const Lx = 0;
            const Lu = Unit.MOLE;
            const Ra = Math.random();
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Lu);
            lhs.lock();
            const result = lhs.subScalar(Ra, Ru, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx], Ru);
            comp.lock();
            checkEQ(result, comp);
        });
        it("rhs.isZero, alpha=0.5", function () {
            const La = Math.random();
            const Lx = Math.random();
            const Lu = Unit.MOLE;
            const Ra = 0;
            const Ru = Unit.CANDELA;
            const lhs = new Geometric1([La, Lx], Lu);
            lhs.lock();
            const result = lhs.subScalar(Ra, Ru, 0.5);
            const comp = new Geometric1([La - 0.5 * Ra, Lx], Lu);
            comp.lock();
            checkEQ(result, comp);
        });
    });
    describe("zero", function () {
        it("(), target isMutable", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x]);
            expect(mv.isMutable()).toBe(true);
            const result = mv.zero();
            expect(result.a).toBe(0);
            expect(result.x).toBe(0);
            expect(result.uom).toBe(Unit.ONE);
            expect(result === mv).toBe(true);
            expect(result.isMutable()).toBe(true);
        });
        it("(), target isLocked", function () {
            const a = Math.random();
            const x = Math.random();
            const mv = new Geometric1([a, x], Unit.KELVIN);
            mv.lock();
            expect(mv.isLocked()).toBe(true);
            const result = mv.zero();
            expect(result.a).toBe(0);
            expect(result.x).toBe(0);
            expect(result.uom).toBe(Unit.ONE);
            expect(result === mv).toBe(false);
            expect(result.isLocked()).toBe(true);
            expect(mv.a).toBe(a);
            expect(mv.x).toBe(x);
            expect(mv.uom).toBe(Unit.KELVIN);
        });
    });
    describe("__add__", function () {
        it("", function () {
            const wA = Geometric1.scalar(1, Unit.METER);
            const wB = Geometric1.scalar(1, Unit.METER);
            expect(wA.a).toBe(1);
            expect(wA.x).toBe(0);
            expect(wA.uom).toBe(Unit.METER);
            expect(wB.a).toBe(1);
            expect(wB.x).toBe(0);
            expect(wB.uom).toBe(Unit.METER);
            const d = wA.__add__(wB);
            checkEQ(d, lock(Geometric1.scalar(2, Unit.METER)));
        });
    });
});
