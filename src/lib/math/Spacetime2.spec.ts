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
    expect(result.a).toBe(comp.a, `a: result.a=${result.a}, comp.a=${comp.a}`);
    expect(result.t).toBe(comp.t, `t: result.t=${result.t}, comp.t=${comp.t}`);
    expect(result.x).toBe(comp.x, `x: result.x=${result.x}, comp.x=${comp.x}`);
    expect(result.tx).toBe(comp.tx, `tx: result.tx=${result.tx}, comp.tx=${comp.tx}`);
    expect(result.y).toBe(comp.y, `y: result.y=${result.y}, comp.y=${comp.y}`);
    expect(result.ty).toBe(comp.ty, `ty: result.ty=${result.ty}, comp.ty=${comp.ty}`);
    expect(result.xy).toBe(comp.xy, `xy: result.xy=${result.xy}, comp.xy=${comp.xy}`);
    expect(result.b).toBe(comp.b, `b: result.b=${result.b}, comp.b=${comp.b}`);
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
        });
        it("one", function () {
            expect(one.isZero()).toBeFalse();
            expect(one.isOne()).toBeTrue();
            expect(Unit.isOne(one.uom)).toBeTrue();
            expect(one.toString()).toBe("1");
        });
        it("γ0", function () {
            expect(γ0.isZero()).toBeFalse();
            expect(γ0.isOne()).toBeFalse();
            expect(Unit.isOne(γ0.uom)).toBeTrue();
            expect(γ0.toString()).toBe("γ0");
        });
        it("γ1", function () {
            expect(γ1.isZero()).toBeFalse();
            expect(γ1.isOne()).toBeFalse();
            expect(Unit.isOne(γ1.uom)).toBeTrue();
            expect(γ1.toString()).toBe("γ1");
        });
        it("γ0γ1", function () {
            expect(γ0γ1.isZero()).toBeFalse();
            expect(γ0γ1.isOne()).toBeFalse();
            expect(Unit.isOne(γ0γ1.uom)).toBeTrue();
            expect(γ0γ1.toString()).toBe("γ0γ1");
        });
        it("γ2", function () {
            expect(γ2.isZero()).toBeFalse();
            expect(γ2.isOne()).toBeFalse();
            expect(Unit.isOne(γ2.uom)).toBeTrue();
            expect(γ2.toString()).toBe("γ2");
        });
        it("γ0γ2", function () {
            expect(γ0γ2.isZero()).toBeFalse();
            expect(γ0γ2.isOne()).toBeFalse();
            expect(Unit.isOne(γ0γ2.uom)).toBeTrue();
            expect(γ0γ2.toString()).toBe("γ0γ2");
        });
        it("γ1γ2", function () {
            expect(γ1γ2.isZero()).toBeFalse();
            expect(γ1γ2.isOne()).toBeFalse();
            expect(Unit.isOne(γ1γ2.uom)).toBeTrue();
            expect(γ1γ2.toString()).toBe("γ1γ2");
        });
        it("I", function () {
            expect(I.isZero()).toBeFalse();
            expect(I.isOne()).toBeFalse();
            expect(Unit.isOne(I.uom)).toBeTrue();
            expect(I.toString()).toBe("I");
        });
    });
    describe("mul", function () {
        describe("one", function () {
            it("one", function () {
                const result = one.mul(one);
                const comp = one;
                checkEQ(result, comp);
            });
            it("γ0", function () {
                const result = one.mul(γ0);
                const comp = γ0;
                checkEQ(result, comp);
            });
            it("γ1", function () {
                const result = one.mul(γ1);
                const comp = γ1;
                checkEQ(result, comp);
            });
            it("γ0γ1", function () {
                const result = one.mul(γ0γ1);
                const comp = γ0γ1;
                checkEQ(result, comp);
            });
            it("γ2", function () {
                const result = one.mul(γ2);
                const comp = γ2;
                checkEQ(result, comp);
            });
            it("γ0γ2", function () {
                const result = one.mul(γ0γ2);
                const comp = γ0γ2;
                checkEQ(result, comp);
            });
            it("γ1γ2", function () {
                const result = one.mul(γ1γ2);
                const comp = γ1γ2;
                checkEQ(result, comp);
            });
            it("I", function () {
                const result = one.mul(I);
                const comp = I;
                checkEQ(result, comp);
            });
        });
        describe("γ0", function () {
            it("one", function () {
                const result = γ0.mul(one);
                const comp = γ0;
                checkEQ(result, comp);
            });
            it("γ0", function () {
                const result = γ0.mul(γ0);
                const comp = one;
                checkEQ(result, comp);
            });
            it("γ1", function () {
                const result = γ0.mul(γ1);
                const comp = γ0γ1;
                checkEQ(result, comp);
            });
            it("γ0γ1", function () {
                const result = γ0.mul(γ0γ1);
                const comp = γ1;
                checkEQ(result, comp);
            });
            it("γ2", function () {
                const result = γ0.mul(γ2);
                const comp = γ0γ2;
                checkEQ(result, comp);
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
});
