import { Spacetime2 } from "./Spacetime2";
import { Unit } from "./Unit";

/**
 * @hidden
 */
const zero = Spacetime2.zero;
/**
 * @hidden
 */
const one = Spacetime2.one;
/**
 * @hidden
 */
const γ0 = Spacetime2.γ0;
/**
 * @hidden
 */
const γ1 = Spacetime2.γ1;
/**
 * @hidden
 */
const γ0γ1 = Spacetime2.γ0γ1;
/**
 * @hidden
 */
const γ2 = Spacetime2.γ2;
/**
 * @hidden
 */
const γ0γ2 = Spacetime2.γ0γ2;
/**
 * @hidden
 */
const γ1γ2 = Spacetime2.γ1γ2;
/**
 * @hidden
 */
const I = Spacetime2.I;
/**
 * @hidden
 */
function checkEQ(result: Spacetime2, comp: Spacetime2): void {
    expect(result.a).toBe(comp.a, `000 1: result.a=${result.a}, comp.a=${comp.a}`);
    expect(result.t).toBe(comp.t, `001 γ0: result.t=${result.t}, comp.t=${comp.t}`);
    expect(result.x).toBe(comp.x, `010 γ1: result.x=${result.x}, comp.x=${comp.x}`);
    expect(result.tx).toBe(comp.tx, `011 γ0γ1: result.tx=${result.tx}, comp.tx=${comp.tx}`);
    expect(result.y).toBe(comp.y, `100 γ2: result.y=${result.y}, comp.y=${comp.y}`);
    expect(result.ty).toBe(comp.ty, `101 γ0γ2: result.ty=${result.ty}, comp.ty=${comp.ty}`);
    expect(result.xy).toBe(comp.xy, `110 γ1γ2: result.xy=${result.xy}, comp.xy=${comp.xy}`);
    expect(result.b).toBe(comp.b, `111 I: result.b=${result.b}, comp.b=${comp.b}`);
    expect(Unit.isCompatible(result.uom, comp.uom)).toBe(true, `uom, result=${result.uom}, comp=${comp.uom}`);
    expect(result.isLocked()).toBe(comp.isLocked(), `isLocked, result=${result.isLocked()}, comp=${comp.isLocked()}`);
    expect(result.isMutable()).toBe(comp.isMutable(), `isMutable, result=${result.isMutable()}, comp=${comp.isMutable()}`);
}

describe("Spacetime2", function () {
    describe("constructor", function () {
        it("should be defined", function () {
            const m = new Spacetime2();
            expect(m).toBeDefined();
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.b).toBe(0);
        });
        it("a", function () {
            const a = Math.random();
            const m = new Spacetime2(a);
            expect(m.a).toBe(a);
        });
        it("t", function () {
            const t = Math.random();
            const m = new Spacetime2(0, t);
            expect(m.t).toBe(t);
        });
        it("x", function () {
            const x = Math.random();
            const m = new Spacetime2(0, 0, x);
            expect(m.x).toBe(x);
        });
        it("tx", function () {
            const tx = Math.random();
            const m = new Spacetime2(0, 0, 0, tx);
            expect(m.tx).toBe(tx);
        });
        it("y", function () {
            const y = Math.random();
            const m = new Spacetime2(0, 0, 0, 0, y);
            expect(m.y).toBe(y);
        });
        it("ty", function () {
            const ty = Math.random();
            const m = new Spacetime2(0, 0, 0, 0, 0, ty);
            expect(m.ty).toBe(ty);
        });
        it("xy", function () {
            const xy = Math.random();
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, xy);
            expect(m.xy).toBe(xy);
        });
        it("b", function () {
            const b = Math.random();
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 0, b);
            expect(m.b).toBe(b);
        });
        it("uom", function () {
            const b = Math.random();
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 0, b);
            expect(m.b).toBe(b);
        });
    });
    describe("accessors", function () {
        it("a", function () {
            const a = Math.random();
            const m = new Spacetime2();
            m.a = a;
            expect(m.a).toBe(a);
            m.lock();
            expect(function () {
                m.a = 0;
            }).toThrowError("Property `a` is readonly.");
        });
        it("t", function () {
            const t = Math.random();
            const m = new Spacetime2();
            m.t = t;
            expect(m.t).toBe(t);
            m.lock();
            expect(function () {
                m.t = 0;
            }).toThrowError("Property `t` is readonly.");
        });
        it("x", function () {
            const x = Math.random();
            const m = new Spacetime2();
            m.x = x;
            expect(m.x).toBe(x);
            m.lock();
            expect(function () {
                m.x = 0;
            }).toThrowError("Property `x` is readonly.");
        });
        it("tx", function () {
            const tx = Math.random();
            const m = new Spacetime2();
            m.tx = tx;
            expect(m.tx).toBe(tx);
            m.lock();
            expect(function () {
                m.tx = 0;
            }).toThrowError("Property `tx` is readonly.");
        });
        it("y", function () {
            const y = Math.random();
            const m = new Spacetime2();
            m.y = y;
            expect(m.y).toBe(y);
            m.lock();
            expect(function () {
                m.y = 0;
            }).toThrowError("Property `y` is readonly.");
        });
        it("ty", function () {
            const ty = Math.random();
            const m = new Spacetime2();
            m.ty = ty;
            expect(m.ty).toBe(ty);
            m.lock();
            expect(function () {
                m.ty = 0;
            }).toThrowError("Property `ty` is readonly.");
        });
        it("xy", function () {
            const xy = Math.random();
            const m = new Spacetime2();
            m.xy = xy;
            expect(m.xy).toBe(xy);
            m.lock();
            expect(function () {
                m.xy = 0;
            }).toThrowError("Property `xy` is readonly.");
        });
        it("b", function () {
            const b = Math.random();
            const m = new Spacetime2();
            m.b = b;
            expect(m.b).toBe(b);
            m.lock();
            expect(function () {
                m.b = 0;
            }).toThrowError("Property `b` is readonly.");
        });
        it("uom", function () {
            const uom = Unit.JOULE;
            const m = new Spacetime2();
            m.uom = uom;
            expect(m.uom).toBe(uom);
            m.lock();
            expect(function () {
                m.uom = Unit.JOULE;
            }).toThrowError("Property `uom` is readonly.");
        });
    });
    describe("toString", function () {
        it("0", function () {
            const m = new Spacetime2();
            expect(m.toString()).toBe("0");
        });
        it("a", function () {
            const m = new Spacetime2(1);
            expect(m.toString()).toBe("1");
        });
        it("t", function () {
            const m = new Spacetime2(0, 1);
            expect(m.toString()).toBe("γ0");
        });
        it("x", function () {
            const m = new Spacetime2(0, 0, 1);
            expect(m.toString()).toBe("γ1");
        });
        it("tx", function () {
            const m = new Spacetime2(0, 0, 0, 1);
            expect(m.toString()).toBe("γ0γ1");
        });
        it("y", function () {
            const m = new Spacetime2(0, 0, 0, 0, 1);
            expect(m.toString()).toBe("γ2");
        });
        it("ty", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 1);
            expect(m.toString()).toBe("γ0γ2");
        });
        it("xy", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 1);
            expect(m.toString()).toBe("γ1γ2");
        });
        it("b", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 0, 1);
            expect(m.toString()).toBe("I");
        });
        it("ALL", function () {
            const m = new Spacetime2(2, 3, 5, 7, 11, 13, 17, 19);
            expect(m.toString()).toBe("2+3*γ0+5*γ1+7*γ0γ1+11*γ2+13*γ0γ2+17*γ1γ2+19*I");
        });
    });
    describe("grades", function () {
        it("0", function () {
            const m = new Spacetime2();
            expect(m.grades).toBe(0x0);
        });
        it("a", function () {
            const m = new Spacetime2(1);
            expect(m.grades).toBe(0x1);
        });
        it("t", function () {
            const m = new Spacetime2(0, 1);
            expect(m.grades).toBe(0x2);
        });
        it("x", function () {
            const m = new Spacetime2(0, 0, 1);
            expect(m.grades).toBe(0x2);
        });
        it("tx", function () {
            const m = new Spacetime2(0, 0, 0, 1);
            expect(m.grades).toBe(0x4);
        });
        it("y", function () {
            const m = new Spacetime2(0, 0, 0, 0, 1);
            expect(m.grades).toBe(0x2);
        });
        it("ty", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 1);
            expect(m.grades).toBe(0x4);
        });
        it("xy", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 1);
            expect(m.grades).toBe(0x4);
        });
        it("b", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 0, 1);
            expect(m.grades).toBe(0x8);
        });
        it("ALL", function () {
            const m = new Spacetime2(1, 1, 1, 1, 1, 1, 1, 1);
            expect(m.grades).toBe(15);
            expect(m.grades).toBe(0xF);
        });
    });
    describe("grade", function () {
        const GRADE0 = zero.add(one);
        const GRADE1 = zero.add(γ0).add(γ1).add(γ2);
        const GRADE2 = zero.add(γ0γ1).add(γ0γ2).add(γ1γ2);
        const GRADE3 = zero.add(I);
        const ALL = GRADE0.add(GRADE1).add(GRADE2).add(GRADE3);
        it("sanity check", function () {
            expect(ALL.a).toBe(1);
            expect(ALL.t).toBe(1);
            expect(ALL.x).toBe(1);
            expect(ALL.tx).toBe(1);
            expect(ALL.y).toBe(1);
            expect(ALL.ty).toBe(1);
            expect(ALL.xy).toBe(1);
            expect(ALL.b).toBe(1);
        });
        it("0", function () {
            checkEQ(ALL.grade(0), GRADE0);
        });
        it("1", function () {
            checkEQ(ALL.grade(1), GRADE1);
        });
        it("2", function () {
            checkEQ(ALL.grade(2), GRADE2);
        });
        it("3", function () {
            checkEQ(ALL.grade(3), GRADE3);
        });
        it("otherwise", function () {
            checkEQ(ALL.grade(9.5), zero);
        });
    });
    describe("isZero", function () {
        it("0", function () {
            const m = new Spacetime2();
            expect(m.isZero()).toBe(true);
        });
        it("a", function () {
            const m = new Spacetime2(1);
            expect(m.isZero()).toBe(false);
        });
        it("t", function () {
            const m = new Spacetime2(0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("x", function () {
            const m = new Spacetime2(0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("tx", function () {
            const m = new Spacetime2(0, 0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("y", function () {
            const m = new Spacetime2(0, 0, 0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("ty", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("xy", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("b", function () {
            const m = new Spacetime2(0, 0, 0, 0, 0, 0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("ALL", function () {
            const m = new Spacetime2(1, 1, 1, 1, 1, 1, 1, 1);
            expect(m.isZero()).toBe(false);
        });
    });
    describe("add", function () {
        it("lhs non-zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Ltx = Math.random();
            const Ly = Math.random();
            const Lty = Math.random();
            const Lxy = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime2(La, Lt, Lx, Ltx, Ly, Lty, Lxy, Lb);
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rtx = Math.random();
            const Ry = Math.random();
            const Rty = Math.random();
            const Rxy = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime2(Ra, Rt, Rx, Rtx, Ry, Rty, Rxy, Rb);
            const sum = lhs.add(rhs);
            // sum should be correct.
            expect(sum.a).toBe(La + Ra, "a");
            expect(sum.t).toBe(Lt + Rt, "t");
            expect(sum.x).toBe(Lx + Rx, "x");
            expect(sum.tx).toBe(Ltx + Rtx, "tx");
            expect(sum.y).toBe(Ly + Ry, "y");
            expect(sum.ty).toBe(Lty + Rty, "ty");
            expect(sum.xy).toBe(Lxy + Rxy, "xy");
            expect(sum.b).toBe(Lb + Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.tx).toBe(Rtx, "tx");
            expect(rhs.y).toBe(Ry, "y");
            expect(rhs.ty).toBe(Rty, "ty");
            expect(rhs.xy).toBe(Rxy, "xy");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("lhs zero", function () {
            const lhs = new Spacetime2();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rtx = Math.random();
            const Ry = Math.random();
            const Rty = Math.random();
            const Rxy = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime2(Ra, Rt, Rx, Rtx, Ry, Rty, Rxy, Rb);
            const sum = lhs.add(rhs);
            expect(sum.a).toBe(Ra, "a");
            expect(sum.t).toBe(Rt, "t");
            expect(sum.x).toBe(Rx, "x");
            expect(sum.tx).toBe(Rtx, "tx");
            expect(sum.y).toBe(Ry, "y");
            expect(sum.ty).toBe(Rty, "ty");
            expect(sum.xy).toBe(Rxy, "xy");
            expect(sum.b).toBe(Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.tx).toBe(Rtx, "tx");
            expect(rhs.y).toBe(Ry, "y");
            expect(rhs.ty).toBe(Rty, "ty");
            expect(rhs.xy).toBe(Rxy, "xy");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("rhs zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Ltx = Math.random();
            const Ly = Math.random();
            const Lty = Math.random();
            const Lxy = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime2(La, Lt, Lx, Ltx, Ly, Lty, Lxy, Lb);
            const rhs = new Spacetime2();
            const sum = lhs.add(rhs);
            expect(sum.a).toBe(La, "a");
            expect(sum.t).toBe(Lt, "t");
            expect(sum.x).toBe(Lx, "x");
            expect(sum.tx).toBe(Ltx, "tx");
            expect(sum.y).toBe(Ly, "y");
            expect(sum.ty).toBe(Lty, "ty");
            expect(sum.xy).toBe(Lxy, "xy");
            expect(sum.b).toBe(Lb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(0, "a");
            expect(rhs.t).toBe(0, "t");
            expect(rhs.x).toBe(0, "x");
            expect(rhs.tx).toBe(0, "tx");
            expect(rhs.y).toBe(0, "y");
            expect(rhs.ty).toBe(0, "ty");
            expect(rhs.xy).toBe(0, "xy");
            expect(rhs.b).toBe(0, "b");
        });
        it("lhs locked", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Ltx = Math.random();
            const Ly = Math.random();
            const Lty = Math.random();
            const Lxy = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime2(La, Lt, Lx, Ltx, Ly, Lty, Lxy, Lb).permlock();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rtx = Math.random();
            const Ry = Math.random();
            const Rty = Math.random();
            const Rxy = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime2(Ra, Rt, Rx, Rtx, Ry, Rty, Rxy, Rb);
            const sum = lhs.add(rhs);
            expect(sum.a).toBe(La + Ra, "a");
            expect(sum.t).toBe(Lt + Rt, "t");
            expect(sum.x).toBe(Lx + Rx, "x");
            expect(sum.tx).toBe(Ltx + Rtx, "tx");
            expect(sum.y).toBe(Ly + Ry, "y");
            expect(sum.ty).toBe(Lty + Rty, "ty");
            expect(sum.xy).toBe(Lxy + Rxy, "xy");
            expect(sum.b).toBe(Lb + Rb, "b");
            expect(sum === lhs).toBeFalse();
            // lhs should not be modified.
            expect(lhs.a).toBe(La, "a");
            expect(lhs.t).toBe(Lt, "t");
            expect(lhs.x).toBe(Lx, "x");
            expect(lhs.tx).toBe(Ltx, "tx");
            expect(lhs.y).toBe(Ly, "y");
            expect(lhs.ty).toBe(Lty, "ty");
            expect(lhs.xy).toBe(Lxy, "xy");
            expect(lhs.b).toBe(Lb, "b");
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.tx).toBe(Rtx, "tx");
            expect(rhs.y).toBe(Ry, "y");
            expect(rhs.ty).toBe(Rty, "ty");
            expect(rhs.xy).toBe(Rxy, "xy");
            expect(rhs.b).toBe(Rb, "b");
        });
    });
    describe("sub", function () {
        it("lhs non-zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Ltx = Math.random();
            const Ly = Math.random();
            const Lty = Math.random();
            const Lxy = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime2(La, Lt, Lx, Ltx, Ly, Lty, Lxy, Lb);
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rtx = Math.random();
            const Ry = Math.random();
            const Rty = Math.random();
            const Rxy = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime2(Ra, Rt, Rx, Rtx, Ry, Rty, Rxy, Rb);
            const sum = lhs.sub(rhs);
            // sum should be correct.
            expect(sum.a).toBe(La - Ra, "a");
            expect(sum.t).toBe(Lt - Rt, "t");
            expect(sum.x).toBe(Lx - Rx, "x");
            expect(sum.tx).toBe(Ltx - Rtx, "tx");
            expect(sum.y).toBe(Ly - Ry, "y");
            expect(sum.ty).toBe(Lty - Rty, "ty");
            expect(sum.xy).toBe(Lxy - Rxy, "xy");
            expect(sum.b).toBe(Lb - Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.tx).toBe(Rtx, "tx");
            expect(rhs.y).toBe(Ry, "y");
            expect(rhs.ty).toBe(Rty, "ty");
            expect(rhs.xy).toBe(Rxy, "xy");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("lhs zero", function () {
            const lhs = new Spacetime2();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rtx = Math.random();
            const Ry = Math.random();
            const Rty = Math.random();
            const Rxy = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime2(Ra, Rt, Rx, Rtx, Ry, Rty, Rxy, Rb);
            const sum = lhs.sub(rhs);
            expect(sum.a).toBe(-Ra, "a");
            expect(sum.t).toBe(-Rt, "t");
            expect(sum.x).toBe(-Rx, "x");
            expect(sum.tx).toBe(-Rtx, "tx");
            expect(sum.y).toBe(-Ry, "y");
            expect(sum.ty).toBe(-Rty, "ty");
            expect(sum.xy).toBe(-Rxy, "xy");
            expect(sum.b).toBe(-Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.tx).toBe(Rtx, "tx");
            expect(rhs.y).toBe(Ry, "y");
            expect(rhs.ty).toBe(Rty, "ty");
            expect(rhs.xy).toBe(Rxy, "xy");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("rhs zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Ltx = Math.random();
            const Ly = Math.random();
            const Lty = Math.random();
            const Lxy = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime2(La, Lt, Lx, Ltx, Ly, Lty, Lxy, Lb);
            const rhs = new Spacetime2();
            const sum = lhs.sub(rhs);
            expect(sum.a).toBe(La, "a");
            expect(sum.t).toBe(Lt, "t");
            expect(sum.x).toBe(Lx, "x");
            expect(sum.tx).toBe(Ltx, "tx");
            expect(sum.y).toBe(Ly, "y");
            expect(sum.ty).toBe(Lty, "ty");
            expect(sum.xy).toBe(Lxy, "xy");
            expect(sum.b).toBe(Lb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(0, "a");
            expect(rhs.t).toBe(0, "t");
            expect(rhs.x).toBe(0, "x");
            expect(rhs.tx).toBe(0, "tx");
            expect(rhs.y).toBe(0, "y");
            expect(rhs.ty).toBe(0, "ty");
            expect(rhs.xy).toBe(0, "xy");
            expect(rhs.b).toBe(0, "b");
        });
        it("lhs locked", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Ltx = Math.random();
            const Ly = Math.random();
            const Lty = Math.random();
            const Lxy = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime2(La, Lt, Lx, Ltx, Ly, Lty, Lxy, Lb).permlock();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rtx = Math.random();
            const Ry = Math.random();
            const Rty = Math.random();
            const Rxy = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime2(Ra, Rt, Rx, Rtx, Ry, Rty, Rxy, Rb);
            const sum = lhs.sub(rhs);
            expect(sum.a).toBe(La - Ra, "a");
            expect(sum.t).toBe(Lt - Rt, "t");
            expect(sum.x).toBe(Lx - Rx, "x");
            expect(sum.tx).toBe(Ltx - Rtx, "tx");
            expect(sum.y).toBe(Ly - Ry, "y");
            expect(sum.ty).toBe(Lty - Rty, "ty");
            expect(sum.xy).toBe(Lxy - Rxy, "xy");
            expect(sum.b).toBe(Lb - Rb, "b");
            expect(sum === lhs).toBeFalse();
            // lhs should not be modified.
            expect(lhs.a).toBe(La, "a");
            expect(lhs.t).toBe(Lt, "t");
            expect(lhs.x).toBe(Lx, "x");
            expect(lhs.tx).toBe(Ltx, "tx");
            expect(lhs.y).toBe(Ly, "y");
            expect(lhs.ty).toBe(Lty, "ty");
            expect(lhs.xy).toBe(Lxy, "xy");
            expect(lhs.b).toBe(Lb, "b");
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.tx).toBe(Rtx, "tx");
            expect(rhs.y).toBe(Ry, "y");
            expect(rhs.ty).toBe(Rty, "ty");
            expect(rhs.xy).toBe(Rxy, "xy");
            expect(rhs.b).toBe(Rb, "b");
        });
    });
    describe("constants", function () {
        it("zero", function () {
            expect(zero.isZero()).toBeTrue();
            expect(zero.isOne()).toBeFalse();
            expect(Unit.isOne(zero.uom)).toBeTrue();
            expect(zero.toString()).toBe("0");
            expect(zero.isScalar()).toBeTrue();
            expect(zero.isSpinor()).toBeTrue();
            expect(zero.isVector()).toBeTrue();
            expect(zero.isBivector()).toBeTrue();
        });
        it("one", function () {
            expect(one.isZero()).toBeFalse();
            expect(one.isOne()).toBeTrue();
            expect(Unit.isOne(one.uom)).toBeTrue();
            expect(one.toString()).toBe("1");
            expect(one.isScalar()).toBeTrue();
            expect(one.isSpinor()).toBeTrue();
            expect(one.isVector()).toBeFalse();
            expect(one.isBivector()).toBeFalse();
        });
        it("γ0", function () {
            expect(γ0.isZero()).toBeFalse();
            expect(γ0.isOne()).toBeFalse();
            expect(Unit.isOne(γ0.uom)).toBeTrue();
            expect(γ0.toString()).toBe("γ0");
            expect(γ0.isScalar()).toBeFalse();
            expect(γ0.isSpinor()).toBeFalse();
            expect(γ0.isVector()).toBeTrue();
            expect(γ0.isBivector()).toBeFalse();
        });
        it("γ1", function () {
            expect(γ1.isZero()).toBeFalse();
            expect(γ1.isOne()).toBeFalse();
            expect(Unit.isOne(γ1.uom)).toBeTrue();
            expect(γ1.toString()).toBe("γ1");
            expect(γ1.isScalar()).toBeFalse();
            expect(γ1.isSpinor()).toBeFalse();
            expect(γ1.isVector()).toBeTrue();
            expect(γ1.isBivector()).toBeFalse();
        });
        it("γ0γ1", function () {
            expect(γ0γ1.isZero()).toBeFalse();
            expect(γ0γ1.isOne()).toBeFalse();
            expect(Unit.isOne(γ0γ1.uom)).toBeTrue();
            expect(γ0γ1.toString()).toBe("γ0γ1");
            expect(γ0γ1.isScalar()).toBeFalse();
            expect(γ0γ1.isSpinor()).toBeTrue();
            expect(γ0γ1.isVector()).toBeFalse();
            expect(γ0γ1.isBivector()).toBeTrue();
        });
        it("γ2", function () {
            expect(γ2.isZero()).toBeFalse();
            expect(γ2.isOne()).toBeFalse();
            expect(Unit.isOne(γ2.uom)).toBeTrue();
            expect(γ2.toString()).toBe("γ2");
            expect(γ2.isScalar()).toBeFalse();
            expect(γ2.isSpinor()).toBeFalse();
            expect(γ2.isVector()).toBeTrue();
            expect(γ2.isBivector()).toBeFalse();
        });
        it("γ0γ2", function () {
            expect(γ0γ2.isZero()).toBeFalse();
            expect(γ0γ2.isOne()).toBeFalse();
            expect(Unit.isOne(γ0γ2.uom)).toBeTrue();
            expect(γ0γ2.toString()).toBe("γ0γ2");
            expect(γ0γ2.isScalar()).toBeFalse();
            expect(γ0γ2.isSpinor()).toBeTrue();
            expect(γ0γ2.isVector()).toBeFalse();
            expect(γ0γ2.isBivector()).toBeTrue();
        });
        it("γ1γ2", function () {
            expect(γ1γ2.isZero()).toBeFalse();
            expect(γ1γ2.isOne()).toBeFalse();
            expect(Unit.isOne(γ1γ2.uom)).toBeTrue();
            expect(γ1γ2.toString()).toBe("γ1γ2");
            expect(γ1γ2.isScalar()).toBeFalse();
            expect(γ1γ2.isSpinor()).toBeTrue();
            expect(γ1γ2.isVector()).toBeFalse();
            expect(γ1γ2.isBivector()).toBeTrue();
        });
        it("I", function () {
            expect(I.isZero()).toBeFalse();
            expect(I.isOne()).toBeFalse();
            expect(Unit.isOne(I.uom)).toBeTrue();
            expect(I.toString()).toBe("I");
            expect(I.isScalar()).toBeFalse();
            expect(I.isSpinor()).toBeFalse();
            expect(I.isVector()).toBeFalse();
            expect(I.isBivector()).toBeFalse();
        });
    });
    describe("mul", function () {
        describe("one", function () {
            it("one", function () {
                checkEQ(one.mul(one), one);
            });
            it("γ0", function () {
                checkEQ(one.mul(γ0), γ0);
            });
            it("γ1", function () {
                checkEQ(one.mul(γ1), γ1);
            });
            it("γ0γ1", function () {
                checkEQ(one.mul(γ0γ1), γ0γ1);
            });
            it("γ2", function () {
                checkEQ(one.mul(γ2), γ2);
            });
            it("γ0γ2", function () {
                checkEQ(one.mul(γ0γ2), γ0γ2);
            });
            it("γ1γ2", function () {
                checkEQ(one.mul(γ1γ2), γ1γ2);
            });
            it("I", function () {
                checkEQ(one.mul(I), I);
            });
        });
        describe("γ0", function () {
            it("one", function () {
                checkEQ(γ0.mul(one), γ0);
            });
            it("γ0", function () {
                checkEQ(γ0.mul(γ0), one);
            });
            it("γ1", function () {
                checkEQ(γ0.mul(γ1), γ0γ1);
            });
            it("γ0γ1", function () {
                checkEQ(γ0.mul(γ0γ1), γ1);
            });
            it("γ2", function () {
                checkEQ(γ0.mul(γ2), γ0γ2);
            });
            it("γ0γ2", function () {
                checkEQ(γ0.mul(γ0γ2), γ2);
            });
            it("γ1γ2", function () {
                checkEQ(γ0.mul(γ1γ2), I);
            });
            it("I", function () {
                checkEQ(γ0.mul(I), γ1γ2);
            });
        });
        describe("γ1", function () {
            it("one", function () {
                checkEQ(γ1.mul(one), γ1);
            });
            it("γ0", function () {
                checkEQ(γ1.mul(γ0), γ0γ1.neg());
            });
            it("γ1", function () {
                checkEQ(γ1.mul(γ1), one.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ1.mul(γ0γ1), γ0);
            });
            it("γ2", function () {
                checkEQ(γ1.mul(γ2), γ1γ2);
            });
            it("γ0γ2", function () {
                checkEQ(γ1.mul(γ0γ2), I.neg());
            });
            it("γ1γ2", function () {
                checkEQ(γ1.mul(γ1γ2), γ2.neg());
            });
            it("I", function () {
                checkEQ(γ1.mul(I), γ0γ2);
            });
        });
        describe("γ0γ1", function () {
            it("one", function () {
                checkEQ(γ0γ1.mul(one), γ0γ1);
            });
            it("γ0", function () {
                checkEQ(γ0γ1.mul(γ0), γ1.neg());
            });
            it("γ1", function () {
                checkEQ(γ0γ1.mul(γ1), γ0.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ1.mul(γ0γ1), one);
            });
            it("γ2", function () {
                checkEQ(γ0γ1.mul(γ2), I);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ1.mul(γ0γ2), γ1γ2.neg());
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ1.mul(γ1γ2), γ0γ2.neg());
            });
            it("I", function () {
                checkEQ(γ0γ1.mul(I), γ2);
            });
        });
        describe("γ2", function () {
            it("one", function () {
                checkEQ(γ2.mul(one), γ2);
            });
            it("γ0", function () {
                checkEQ(γ2.mul(γ0), γ0γ2.neg());
            });
            it("γ1", function () {
                checkEQ(γ2.mul(γ1), γ1γ2.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ2.mul(γ0γ1), I);
            });
            it("γ2", function () {
                checkEQ(γ2.mul(γ2), one.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ2.mul(γ0γ2), γ0);
            });
            it("γ1γ2", function () {
                checkEQ(γ2.mul(γ1γ2), γ1);
            });
            it("I", function () {
                checkEQ(γ2.mul(I), γ0γ1.neg());
            });
        });
        describe("γ0γ2", function () {
            it("one", function () {
                checkEQ(γ0γ2.mul(one), γ0γ2);
            });
            it("γ0", function () {
                checkEQ(γ0γ2.mul(γ0), γ2.neg());
            });
            it("γ1", function () {
                checkEQ(γ0γ2.mul(γ1), I.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ2.mul(γ0γ1), γ1γ2);
            });
            it("γ2", function () {
                checkEQ(γ0γ2.mul(γ2), γ0.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ2.mul(γ0γ2), one);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ2.mul(γ1γ2), γ0γ1);
            });
            it("I", function () {
                checkEQ(γ0γ2.mul(I), γ1.neg());
            });
        });
        describe("γ1γ2", function () {
            it("one", function () {
                checkEQ(γ1γ2.mul(one), γ1γ2);
            });
            it("γ0", function () {
                checkEQ(γ1γ2.mul(γ0), I);
            });
            it("γ1", function () {
                checkEQ(γ1γ2.mul(γ1), γ2);
            });
            it("γ0γ1", function () {
                checkEQ(γ1γ2.mul(γ0γ1), γ0γ2);
            });
            it("γ2", function () {
                checkEQ(γ1γ2.mul(γ2), γ1.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ1γ2.mul(γ0γ2), γ0γ1.neg());
            });
            it("γ1γ2", function () {
                checkEQ(γ1γ2.mul(γ1γ2), one.neg());
            });
            it("I", function () {
                checkEQ(γ1γ2.mul(I), γ0.neg());
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.mul(one), I);
            });
            it("γ0", function () {
                checkEQ(I.mul(γ0), γ1γ2);
            });
            it("γ1", function () {
                checkEQ(I.mul(γ1), γ0γ2);
            });
            it("γ0γ1", function () {
                checkEQ(I.mul(γ0γ1), γ2);
            });
            it("γ2", function () {
                checkEQ(I.mul(γ2), γ0γ1.neg());
            });
            it("γ0γ2", function () {
                checkEQ(I.mul(γ0γ2), γ1.neg());
            });
            it("γ1γ2", function () {
                checkEQ(I.mul(γ1γ2), γ0.neg());
            });
            it("I", function () {
                checkEQ(I.mul(I), one.neg());
            });
        });
    });
    describe("ext", function () {
        describe("one", function () {
            it("one", function () {
                checkEQ(one.ext(one), one);
            });
            it("γ0", function () {
                checkEQ(one.ext(γ0), γ0);
            });
            it("γ1", function () {
                checkEQ(one.ext(γ1), γ1);
            });
            it("γ0γ1", function () {
                checkEQ(one.ext(γ0γ1), γ0γ1);
            });
            it("γ2", function () {
                checkEQ(one.ext(γ2), γ2);
            });
            it("γ0γ2", function () {
                checkEQ(one.ext(γ0γ2), γ0γ2);
            });
            it("γ1γ2", function () {
                checkEQ(one.ext(γ1γ2), γ1γ2);
            });
            it("I", function () {
                checkEQ(one.ext(I), I);
            });
        });
        describe("γ0", function () {
            it("one", function () {
                checkEQ(γ0.ext(one), γ0);
            });
            it("γ0", function () {
                checkEQ(γ0.ext(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0.ext(γ1), γ0γ1);
            });
            it("γ0γ1", function () {
                checkEQ(γ0.ext(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0.ext(γ2), γ0γ2);
            });
            it("γ0γ2", function () {
                checkEQ(γ0.ext(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0.ext(γ1γ2), I);
            });
            it("I", function () {
                checkEQ(γ0.ext(I), zero);
            });
        });
        describe("γ1", function () {
            it("one", function () {
                checkEQ(γ1.ext(one), γ1);
            });
            it("γ0", function () {
                checkEQ(γ1.ext(γ0), γ0γ1.neg());
            });
            it("γ1", function () {
                checkEQ(γ1.ext(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ1.ext(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1.ext(γ2), γ1γ2);
            });
            it("γ0γ2", function () {
                checkEQ(γ1.ext(γ0γ2), I.neg());
            });
            it("γ1γ2", function () {
                checkEQ(γ1.ext(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ1.ext(I), zero);
            });
        });
        describe("γ0γ1", function () {
            it("one", function () {
                checkEQ(γ0γ1.ext(one), γ0γ1);
            });
            it("γ0", function () {
                checkEQ(γ0γ1.ext(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0γ1.ext(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ1.ext(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0γ1.ext(γ2), I);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ1.ext(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ1.ext(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ1.ext(I), zero);
            });
        });
        describe("γ2", function () {
            it("one", function () {
                checkEQ(γ2.ext(one), γ2);
            });
            it("γ0", function () {
                checkEQ(γ2.ext(γ0), γ0γ2.neg());
            });
            it("γ1", function () {
                checkEQ(γ2.ext(γ1), γ1γ2.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ2.ext(γ0γ1), I);
            });
            it("γ2", function () {
                checkEQ(γ2.ext(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ2.ext(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ2.ext(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ2.ext(I), zero);
            });
        });
        describe("γ0γ2", function () {
            it("one", function () {
                checkEQ(γ0γ2.ext(one), γ0γ2);
            });
            it("γ0", function () {
                checkEQ(γ0γ2.ext(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0γ2.ext(γ1), I.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ2.ext(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0γ2.ext(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ2.ext(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ2.ext(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ2.ext(I), zero);
            });
        });
        describe("γ1γ2", function () {
            it("one", function () {
                checkEQ(γ1γ2.ext(one), γ1γ2);
            });
            it("γ0", function () {
                checkEQ(γ1γ2.ext(γ0), I);
            });
            it("γ1", function () {
                checkEQ(γ1γ2.ext(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ1γ2.ext(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1γ2.ext(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ1γ2.ext(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1γ2.ext(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ1γ2.ext(I), zero);
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.ext(one), I);
            });
            it("γ0", function () {
                checkEQ(I.ext(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(I.ext(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(I.ext(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(I.ext(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(I.ext(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(I.ext(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(I.ext(I), zero);
            });
        });
    });
    describe("lco", function () {
        describe("one", function () {
            it("one", function () {
                checkEQ(one.lco(one), one);
            });
            it("γ0", function () {
                checkEQ(one.lco(γ0), γ0);
            });
            it("γ1", function () {
                checkEQ(one.lco(γ1), γ1);
            });
            it("γ0γ1", function () {
                checkEQ(one.lco(γ0γ1), γ0γ1);
            });
            it("γ2", function () {
                checkEQ(one.lco(γ2), γ2);
            });
            it("γ0γ2", function () {
                checkEQ(one.lco(γ0γ2), γ0γ2);
            });
            it("γ1γ2", function () {
                checkEQ(one.lco(γ1γ2), γ1γ2);
            });
            it("I", function () {
                checkEQ(one.lco(I), I);
            });
        });
        describe("γ0", function () {
            it("one", function () {
                checkEQ(γ0.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ0.lco(γ0), one);
            });
            it("γ1", function () {
                checkEQ(γ0.lco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0.lco(γ0γ1), γ1);
            });
            it("γ2", function () {
                checkEQ(γ0.lco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0.lco(γ0γ2), γ2);
            });
            it("γ1γ2", function () {
                checkEQ(γ0.lco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0.lco(I), γ1γ2);
            });
        });
        describe("γ1", function () {
            it("one", function () {
                checkEQ(γ1.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ1.lco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ1.lco(γ1), one.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ1.lco(γ0γ1), γ0);
            });
            it("γ2", function () {
                checkEQ(γ1.lco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ1.lco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1.lco(γ1γ2), γ2.neg());
            });
            it("I", function () {
                checkEQ(γ1.lco(I), γ0γ2);
            });
        });
        describe("γ0γ1", function () {
            it("one", function () {
                checkEQ(γ0γ1.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ0γ1.lco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0γ1.lco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ1.lco(γ0γ1), one);
            });
            it("γ2", function () {
                checkEQ(γ0γ1.lco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ1.lco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ1.lco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ1.lco(I), γ2);
            });
        });
        describe("γ2", function () {
            it("one", function () {
                checkEQ(γ2.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ2.lco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ2.lco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ2.lco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ2.lco(γ2), one.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ2.lco(γ0γ2), γ0);
            });
            it("γ1γ2", function () {
                checkEQ(γ2.lco(γ1γ2), γ1);
            });
            it("I", function () {
                checkEQ(γ2.lco(I), γ0γ1.neg());
            });
        });
        describe("γ0γ2", function () {
            it("one", function () {
                checkEQ(γ0γ2.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ0γ2.lco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0γ2.lco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ2.lco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0γ2.lco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ2.lco(γ0γ2), one);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ2.lco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ2.lco(I), γ1.neg());
            });
        });
        describe("γ1γ2", function () {
            it("one", function () {
                checkEQ(γ1γ2.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ1γ2.lco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ1γ2.lco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ1γ2.lco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1γ2.lco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ1γ2.lco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1γ2.lco(γ1γ2), one.neg());
            });
            it("I", function () {
                checkEQ(γ1γ2.lco(I), γ0.neg());
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.lco(one), zero);
            });
            it("γ0", function () {
                checkEQ(I.lco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(I.lco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(I.lco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(I.lco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(I.lco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(I.lco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(I.lco(I), one.neg());
            });
        });
    });
    describe("rco", function () {
        describe("one", function () {
            it("one", function () {
                checkEQ(one.rco(one), one);
            });
            it("γ0", function () {
                checkEQ(one.rco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(one.rco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(one.rco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(one.rco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(one.rco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(one.rco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(one.rco(I), zero);
            });
        });
        describe("γ0", function () {
            it("one", function () {
                checkEQ(γ0.rco(one), γ0);
            });
            it("γ0", function () {
                checkEQ(γ0.rco(γ0), one);
            });
            it("γ1", function () {
                checkEQ(γ0.rco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0.rco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0.rco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0.rco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0.rco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0.rco(I), zero);
            });
        });
        describe("γ1", function () {
            it("one", function () {
                checkEQ(γ1.rco(one), γ1);
            });
            it("γ0", function () {
                checkEQ(γ1.rco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ1.rco(γ1), one.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ1.rco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1.rco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ1.rco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1.rco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ1.rco(I), zero);
            });
        });
        describe("γ0γ1", function () {
            it("one", function () {
                checkEQ(γ0γ1.rco(one), γ0γ1);
            });
            it("γ0", function () {
                checkEQ(γ0γ1.rco(γ0), γ1.neg());
            });
            it("γ1", function () {
                checkEQ(γ0γ1.rco(γ1), γ0.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ1.rco(γ0γ1), one);
            });
            it("γ2", function () {
                checkEQ(γ0γ1.rco(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ1.rco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ1.rco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ1.rco(I), zero);
            });
        });
        describe("γ2", function () {
            it("one", function () {
                checkEQ(γ2.rco(one), γ2);
            });
            it("γ0", function () {
                checkEQ(γ2.rco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ2.rco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ2.rco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ2.rco(γ2), one.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ2.rco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ2.rco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ2.rco(I), zero);
            });
        });
        describe("γ0γ2", function () {
            it("one", function () {
                checkEQ(γ0γ2.rco(one), γ0γ2);
            });
            it("γ0", function () {
                checkEQ(γ0γ2.rco(γ0), γ2.neg());
            });
            it("γ1", function () {
                checkEQ(γ0γ2.rco(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ2.rco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0γ2.rco(γ2), γ0.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ2.rco(γ0γ2), one);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ2.rco(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ2.rco(I), zero);
            });
        });
        describe("γ1γ2", function () {
            it("one", function () {
                checkEQ(γ1γ2.rco(one), γ1γ2);
            });
            it("γ0", function () {
                checkEQ(γ1γ2.rco(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ1γ2.rco(γ1), γ2);
            });
            it("γ0γ1", function () {
                checkEQ(γ1γ2.rco(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1γ2.rco(γ2), γ1.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ1γ2.rco(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1γ2.rco(γ1γ2), one.neg());
            });
            it("I", function () {
                checkEQ(γ1γ2.rco(I), zero);
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.rco(one), I);
            });
            it("γ0", function () {
                checkEQ(I.rco(γ0), γ1γ2);
            });
            it("γ1", function () {
                checkEQ(I.rco(γ1), γ0γ2);
            });
            it("γ0γ1", function () {
                checkEQ(I.rco(γ0γ1), γ2);
            });
            it("γ2", function () {
                checkEQ(I.rco(γ2), γ0γ1.neg());
            });
            it("γ0γ2", function () {
                checkEQ(I.rco(γ0γ2), γ1.neg());
            });
            it("γ1γ2", function () {
                checkEQ(I.rco(γ1γ2), γ0.neg());
            });
            it("I", function () {
                checkEQ(I.rco(I), one.neg());
            });
        });
    });
    describe("scp", function () {
        describe("one", function () {
            it("one", function () {
                checkEQ(one.scp(one), one);
            });
            it("γ0", function () {
                checkEQ(one.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(one.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(one.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(one.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(one.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(one.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(one.scp(I), zero);
            });
        });
        describe("γ0", function () {
            it("one", function () {
                checkEQ(γ0.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ0.scp(γ0), one);
            });
            it("γ1", function () {
                checkEQ(γ0.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0.scp(I), zero);
            });
        });
        describe("γ1", function () {
            it("one", function () {
                checkEQ(γ1.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ1.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ1.scp(γ1), one.neg());
            });
            it("γ0γ1", function () {
                checkEQ(γ1.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ1.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ1.scp(I), zero);
            });
        });
        describe("γ0γ1", function () {
            it("one", function () {
                checkEQ(γ0γ1.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ0γ1.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0γ1.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ1.scp(γ0γ1), one);
            });
            it("γ2", function () {
                checkEQ(γ0γ1.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ1.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ1.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ1.scp(I), zero);
            });
        });
        describe("γ2", function () {
            it("one", function () {
                checkEQ(γ2.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ2.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ2.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ2.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ2.scp(γ2), one.neg());
            });
            it("γ0γ2", function () {
                checkEQ(γ2.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ2.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ2.scp(I), zero);
            });
        });
        describe("γ0γ2", function () {
            it("one", function () {
                checkEQ(γ0γ2.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ0γ2.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ0γ2.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ0γ2.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ0γ2.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ0γ2.scp(γ0γ2), one);
            });
            it("γ1γ2", function () {
                checkEQ(γ0γ2.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(γ0γ2.scp(I), zero);
            });
        });
        describe("γ1γ2", function () {
            it("one", function () {
                checkEQ(γ1γ2.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(γ1γ2.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(γ1γ2.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(γ1γ2.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(γ1γ2.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(γ1γ2.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(γ1γ2.scp(γ1γ2), one.neg());
            });
            it("I", function () {
                checkEQ(γ1γ2.scp(I), zero);
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.scp(one), zero);
            });
            it("γ0", function () {
                checkEQ(I.scp(γ0), zero);
            });
            it("γ1", function () {
                checkEQ(I.scp(γ1), zero);
            });
            it("γ0γ1", function () {
                checkEQ(I.scp(γ0γ1), zero);
            });
            it("γ2", function () {
                checkEQ(I.scp(γ2), zero);
            });
            it("γ0γ2", function () {
                checkEQ(I.scp(γ0γ2), zero);
            });
            it("γ1γ2", function () {
                checkEQ(I.scp(γ1γ2), zero);
            });
            it("I", function () {
                checkEQ(I.scp(I), one.neg());
            });
        });
    });
    describe("scale", function () {
        it("zero", function () {
            const α = Math.random();
            const m = zero.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("one", function () {
            const α = Math.random();
            const m = one.scale(α);
            expect(m.a).toBe(α);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ0", function () {
            const α = Math.random();
            const m = γ0.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(α);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ1", function () {
            const α = Math.random();
            const m = γ1.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(α);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ2", function () {
            const α = Math.random();
            const m = γ2.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(α);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ0γ1", function () {
            const α = Math.random();
            const m = γ0γ1.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(α);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ0γ2", function () {
            const α = Math.random();
            const m = γ0γ2.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(α);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ1γ2", function () {
            const α = Math.random();
            const m = γ1γ2.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(α);
            expect(m.b).toBe(0);
        });
        it("I", function () {
            const α = Math.random();
            const m = I.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.y).toBe(0);
            expect(m.tx).toBe(0);
            expect(m.ty).toBe(0);
            expect(m.xy).toBe(0);
            expect(m.b).toBe(α);
        });
    });
});
