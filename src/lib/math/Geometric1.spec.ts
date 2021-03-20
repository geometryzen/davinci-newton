import { Geometric1 } from "./Geometric1";
import { Unit } from "./Unit";

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
                const m = new Geometric1([1, 2, 3]);
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
});
