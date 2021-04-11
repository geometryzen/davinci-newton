import { Spacetime1 } from "./Spacetime1";
import { Unit } from "./Unit";

/**
 * @hidden
 */
const zero = Spacetime1.zero;
/**
 * @hidden
 */
const one = Spacetime1.one;
/**
 * @hidden
 */
const two = one.add(one);
/**
 * @hidden
 */
const γ0 = Spacetime1.γ0;
/**
 * @hidden
 */
const γ1 = Spacetime1.γ1;
/**
 * @hidden
 */
const I = Spacetime1.I;
/**
 * @hidden
 */
const meter = Spacetime1.meter;
/**
 * @hidden
 */
const blades = [one, γ0, γ1, I];
/**
 * @hidden
 */
function checkEQ(result: Spacetime1, comp: Spacetime1): void {
    expect(result.a).toBe(comp.a, `000 1: result.a=${result.a}, comp.a=${comp.a}`);
    expect(result.t).toBe(comp.t, `001 γ0: result.t=${result.t}, comp.t=${comp.t}`);
    expect(result.x).toBe(comp.x, `010 γ1: result.x=${result.x}, comp.x=${comp.x}`);
    expect(result.b).toBe(comp.b, `011 I: result.tx=${result.b}, comp.tx=${comp.b}`);
    expect(Unit.isCompatible(result.uom, comp.uom)).toBe(true, `uom, result=${result.uom}, comp=${comp.uom}`);
    expect(result.isLocked()).toBe(comp.isLocked(), `isLocked, result=${result.isLocked()}, comp=${comp.isLocked()}`);
    expect(result.isMutable()).toBe(comp.isMutable(), `isMutable, result=${result.isMutable()}, comp=${comp.isMutable()}`);
}

describe("Spacetime1", function () {
    describe("constructor", function () {
        it("should be defined", function () {
            const m = new Spacetime1();
            expect(m).toBeDefined();
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.b).toBe(0);
        });
        it("a", function () {
            const a = Math.random();
            const m = new Spacetime1(a);
            expect(m.a).toBe(a);
        });
        it("t", function () {
            const t = Math.random();
            const m = new Spacetime1(0, t);
            expect(m.t).toBe(t);
        });
        it("x", function () {
            const x = Math.random();
            const m = new Spacetime1(0, 0, x);
            expect(m.x).toBe(x);
        });
        it("b", function () {
            const b = Math.random();
            const m = new Spacetime1(0, 0, 0, b);
            expect(m.b).toBe(b);
        });
    });
    describe("accessors", function () {
        it("a", function () {
            const a = Math.random();
            const m = new Spacetime1();
            m.a = a;
            expect(m.a).toBe(a);
            m.lock();
            expect(function () {
                m.a = 0;
            }).toThrowError("Property `a` is readonly.");
        });
        it("t", function () {
            const t = Math.random();
            const m = new Spacetime1();
            m.t = t;
            expect(m.t).toBe(t);
            m.lock();
            expect(function () {
                m.t = 0;
            }).toThrowError("Property `t` is readonly.");
        });
        it("x", function () {
            const x = Math.random();
            const m = new Spacetime1();
            m.x = x;
            expect(m.x).toBe(x);
            m.lock();
            expect(function () {
                m.x = 0;
            }).toThrowError("Property `x` is readonly.");
        });
        it("b", function () {
            const b = Math.random();
            const m = new Spacetime1();
            m.b = b;
            expect(m.b).toBe(b);
            m.lock();
            expect(function () {
                m.b = 0;
            }).toThrowError("Property `b` is readonly.");
        });
        it("uom", function () {
            const uom = Unit.JOULE;
            const m = new Spacetime1();
            m.uom = uom;
            expect(m.uom).toBe(uom);
            m.lock();
            expect(function () {
                m.uom = Unit.JOULE;
            }).toThrowError("Property `uom` is readonly.");
        });
    });
    describe("toExponential", function () {
        it("should use scientific notation", function () {
            const m = new Spacetime1(2, 3, 5, 7);
            expect(m.toExponential(1)).toBe("2.0e+0+3.0e+0*γ0+5.0e+0*γ1+7.0e+0*I");
        });
    });
    describe("toFixed", function () {
        it("should use toFixed", function () {
            const m = new Spacetime1(2, 3, 5, 7);
            expect(m.toFixed(1)).toBe("2.0+3.0*γ0+5.0*γ1+7.0*I");
        });
    });
    describe("toPrecision", function () {
        it("should use toPrecision", function () {
            const m = new Spacetime1(2, 3, 5, 7);
            expect(m.toPrecision(2)).toBe("2.0+3.0*γ0+5.0*γ1+7.0*I");
        });
    });
    describe("toString", function () {
        it("should use toString", function () {
            const m = new Spacetime1(2, 3, 5, 7);
            expect(m.toString()).toBe("2+3*γ0+5*γ1+7*I");
        });
    });
    describe("grades", function () {
        it("0", function () {
            const m = new Spacetime1();
            expect(m.grades).toBe(0x0);
        });
        it("a", function () {
            const m = new Spacetime1(1);
            expect(m.grades).toBe(0x1);
        });
        it("t", function () {
            const m = new Spacetime1(0, 1);
            expect(m.grades).toBe(0x2);
        });
        it("x", function () {
            const m = new Spacetime1(0, 0, 1);
            expect(m.grades).toBe(0x2);
        });
        it("b", function () {
            const m = new Spacetime1(0, 0, 0, 1);
            expect(m.grades).toBe(0x4);
        });
        it("ALL", function () {
            const m = new Spacetime1(1, 1, 1, 1);
            expect(m.grades).toBe(7);
        });
    });
    describe("grade", function () {
        const GRADE0 = zero.add(one);
        const GRADE1 = zero.add(γ0).add(γ1);
        const GRADE2 = zero.add(I);
        const ALL = GRADE0.add(GRADE1).add(GRADE2);
        it("sanity check", function () {
            expect(ALL.a).toBe(1);
            expect(ALL.t).toBe(1);
            expect(ALL.x).toBe(1);
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
        it("otherwise", function () {
            checkEQ(ALL.grade(9.5), zero);
        });
    });
    describe("isZero", function () {
        it("0", function () {
            const m = new Spacetime1();
            expect(m.isZero()).toBe(true);
        });
        it("a", function () {
            const m = new Spacetime1(1);
            expect(m.isZero()).toBe(false);
        });
        it("t", function () {
            const m = new Spacetime1(0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("x", function () {
            const m = new Spacetime1(0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("b", function () {
            const m = new Spacetime1(0, 0, 0, 1);
            expect(m.isZero()).toBe(false);
        });
        it("ALL", function () {
            const m = new Spacetime1(1, 1, 1, 1);
            expect(m.isZero()).toBe(false);
        });
    });
    describe("add", function () {
        it("lhs non-zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime1(La, Lt, Lx, Lb);
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime1(Ra, Rt, Rx, Rb);
            const sum = lhs.add(rhs);
            // sum should be correct.
            expect(sum.a).toBe(La + Ra, "a");
            expect(sum.t).toBe(Lt + Rt, "t");
            expect(sum.x).toBe(Lx + Rx, "x");
            expect(sum.b).toBe(Lb + Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("lhs zero", function () {
            const lhs = new Spacetime1();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime1(Ra, Rt, Rx, Rb);
            const sum = lhs.add(rhs);
            expect(sum.a).toBe(Ra, "a");
            expect(sum.t).toBe(Rt, "t");
            expect(sum.x).toBe(Rx, "x");
            expect(sum.b).toBe(Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("rhs zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime1(La, Lt, Lx, Lb);
            const rhs = new Spacetime1();
            const sum = lhs.add(rhs);
            expect(sum.a).toBe(La, "a");
            expect(sum.t).toBe(Lt, "t");
            expect(sum.x).toBe(Lx, "x");
            expect(sum.b).toBe(Lb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(0, "a");
            expect(rhs.t).toBe(0, "t");
            expect(rhs.x).toBe(0, "x");
            expect(rhs.b).toBe(0, "b");
        });
        it("lhs locked", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime1(La, Lt, Lx, Lb).permlock();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime1(Ra, Rt, Rx, Rb);
            const sum = lhs.add(rhs);
            expect(sum.a).toBe(La + Ra, "a");
            expect(sum.t).toBe(Lt + Rt, "t");
            expect(sum.x).toBe(Lx + Rx, "x");
            expect(sum.b).toBe(Lb + Rb, "b");
            expect(sum === lhs).toBeFalse();
            // lhs should not be modified.
            expect(lhs.a).toBe(La, "a");
            expect(lhs.t).toBe(Lt, "t");
            expect(lhs.x).toBe(Lx, "x");
            expect(lhs.b).toBe(Lb, "b");
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.b).toBe(Rb, "b");
        });
    });
    describe("addScalar", function () {
        it("", function () {
            checkEQ(zero.addScalar(one.a, one.uom), zero.add(one));
            for (const blade of blades) {
                checkEQ(blade.addScalar(one.a, one.uom), blade.add(one));
                checkEQ(blade.addScalar(zero.a, zero.uom), blade.add(zero));
                checkEQ(blade.addScalar(one.a, one.uom, 0.5), blade.add(one.mulByNumber(0.5)));
            }
        });
    });
    describe("divByNumber", function () {
        it("", function () {
            for (const blade of blades) {
                checkEQ(blade.mulByNumber(2).divByNumber(2), blade);
            }
        });
    });
    describe("divByScalar", function () {
        it("", function () {
            for (const blade of blades) {
                checkEQ(blade.mul(meter).divByScalar(meter.a, meter.uom), blade);
            }
        });
    });
    describe("divByVector", function () {
        it("", function () {
            for (const blade of blades) {
                checkEQ(blade.mul(γ0).divByVector(γ0), blade);
                checkEQ(blade.mul(γ1).divByVector(γ1), blade);
            }
        });
    });
    describe("dual", function () {
        it("one", function () {
            checkEQ(one.dual(), one.lco(I.inv()));
        });
        it("γ0", function () {
            checkEQ(γ0.dual(), γ0.lco(I.inv()));
        });
        it("γ1", function () {
            checkEQ(γ1.dual(), γ1.lco(I.inv()));
        });
        it("I", function () {
            checkEQ(I.dual(), I.lco(I.inv()));
        });
    });
    describe("conj", function () {
        it("", function () {
            checkEQ(one.conj(), one);
            checkEQ(γ0.conj(), γ0.neg());
            checkEQ(γ1.conj(), γ1.neg());
            checkEQ(I.conj(), I.neg());
            checkEQ(meter.conj(), meter);
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
        it("I", function () {
            expect(I.isZero()).toBeFalse();
            expect(I.isOne()).toBeFalse();
            expect(Unit.isOne(I.uom)).toBeTrue();
            expect(I.toString()).toBe("I");
            expect(I.isScalar()).toBeFalse();
            expect(I.isSpinor()).toBeTrue();
            expect(I.isVector()).toBeFalse();
            expect(I.isBivector()).toBeTrue();
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
                checkEQ(γ0.mul(γ1), I);
            });
            it("I", function () {
                checkEQ(γ0.mul(I), γ1);
            });
        });
        describe("γ1", function () {
            it("one", function () {
                checkEQ(γ1.mul(one), γ1);
            });
            it("γ0", function () {
                checkEQ(γ1.mul(γ0), I.neg());
            });
            it("γ1", function () {
                checkEQ(γ1.mul(γ1), one.neg());
            });
            it("I", function () {
                checkEQ(γ1.mul(I), γ0);
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.mul(one), I);
            });
            it("γ0", function () {
                checkEQ(I.mul(γ0), γ1.neg());
            });
            it("γ1", function () {
                checkEQ(I.mul(γ1), γ0.neg());
            });
            it("I", function () {
                checkEQ(I.mul(I), one);
            });
        });
    });
    describe("mulByScalar", function () {
        it("", function () {
            checkEQ(zero.mulByScalar(two.a, two.uom), zero.mul(one));
            for (const blade of blades) {
                checkEQ(blade.mulByScalar(two.a, two.uom), blade.mul(two));
                checkEQ(blade.mulByScalar(zero.a, zero.uom), blade.mul(zero));
                checkEQ(blade.mulByScalar(meter.a, meter.uom), blade.mul(meter));
            }
        });
    });
    describe("mulByVector", function () {
        it("", function () {
            for (const blade of blades) {
                checkEQ(blade.mulByVector(γ0), blade.mul(γ0));
                checkEQ(blade.mulByVector(γ1), blade.mul(γ1));
            }
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
                checkEQ(γ0.ext(γ1), I);
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
                checkEQ(γ1.ext(γ0), I.neg());
            });
            it("γ1", function () {
                checkEQ(γ1.ext(γ1), zero);
            });
            it("I", function () {
                checkEQ(γ1.ext(I), zero);
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
            it("I", function () {
                checkEQ(I.ext(I), zero);
            });
        });
    });
    describe("inv", function () {
        it("one", function () {
            checkEQ(one.inv(), one);
        });
        it("γ0", function () {
            checkEQ(γ0.inv(), γ0);
        });
        it("γ1", function () {
            checkEQ(γ1.inv(), γ1.neg());
        });
        it("I", function () {
            checkEQ(I.inv(), I);
        });
        it("", function () {
            for (const blade of blades) {
                checkEQ(blade.mul(blade.inv()), one);
            }
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
            it("I", function () {
                checkEQ(γ0.lco(I), γ1);
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
            it("I", function () {
                checkEQ(γ1.lco(I), γ0);
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
            it("I", function () {
                checkEQ(I.lco(I), one);
            });
        });
    });
    describe("quaditude", function () {
        it("should be an alias for squaredNorm", function () {
            for (const blade of blades) {
                checkEQ(blade.mul(two).quaditude(), blade.mul(two).squaredNorm());
            }
        });
    });
    describe("quaditudeNoUnit", function () {
        it("should be an alias for squaredNorm", function () {
            for (const blade of blades) {
                expect(blade.mul(two).quaditudeNoUnits()).toBe(blade.mul(two).squaredNorm().a);
            }
        });
        it("should be an alias for squaredNorm", function () {
            for (const blade of blades) {
                expect(blade.mul(two).quaditudeNoUnits()).toBe(blade.mul(two).squaredNorm().a);
            }
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
            it("I", function () {
                checkEQ(γ1.rco(I), zero);
            });
        });
        describe("I", function () {
            it("one", function () {
                checkEQ(I.rco(one), I);
            });
            it("γ0", function () {
                checkEQ(I.rco(γ0), γ1.neg());
            });
            it("γ1", function () {
                checkEQ(I.rco(γ1), γ0.neg());
            });
            it("I", function () {
                checkEQ(I.rco(I), one);
            });
        });
    });
    describe("reflect", function () {
        it("commutes with exterior product", function () {
            checkEQ(one.reflect(γ0), one.neg());
            checkEQ(one.reflect(γ1), one);

            checkEQ(γ0.reflect(γ0), γ0.neg());
            checkEQ(γ0.reflect(γ1), γ0.neg());

            checkEQ(γ1.reflect(γ0), γ1);
            checkEQ(γ1.reflect(γ1), γ1);

            checkEQ(I.reflect(γ0), γ0.reflect(γ0).ext(γ1.reflect(γ0)));
            checkEQ(I.reflect(γ1), γ0.reflect(γ1).ext(γ1.reflect(γ1)));
        });
        it("summary", function () {
            checkEQ(one.reflect(γ0), one.neg());
            checkEQ(one.reflect(γ1), one);

            checkEQ(γ0.reflect(γ0), γ0.neg());
            checkEQ(γ0.reflect(γ1), γ0.neg());

            checkEQ(γ1.reflect(γ0), γ1);
            checkEQ(γ1.reflect(γ1), γ1);

            checkEQ(I.reflect(γ0), I.neg());
            checkEQ(I.reflect(γ1), I.neg());
        });
        it("scaling", function () {
            for (const blade of blades) {
                checkEQ(blade.mul(two).reflect(γ0), blade.reflect(γ0).mul(two));
            }
        });
    });
    describe("rev", function () {
        it("", function () {
            checkEQ(one.rev(), one);
            checkEQ(γ0.rev(), γ0);
            checkEQ(γ1.rev(), γ1);
            checkEQ(I.rev(), I.neg());
            checkEQ(meter.rev(), meter);
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
            it("I", function () {
                checkEQ(γ1.scp(I), zero);
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
            it("I", function () {
                checkEQ(I.scp(I), one);
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
            expect(m.b).toBe(0);
        });
        it("one", function () {
            const α = Math.random();
            const m = one.scale(α);
            expect(m.a).toBe(α);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ0", function () {
            const α = Math.random();
            const m = γ0.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(α);
            expect(m.x).toBe(0);
            expect(m.b).toBe(0);
        });
        it("γ1", function () {
            const α = Math.random();
            const m = γ1.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(α);
            expect(m.b).toBe(0);
        });
        it("I", function () {
            const α = Math.random();
            const m = I.scale(α);
            expect(m.a).toBe(0);
            expect(m.t).toBe(0);
            expect(m.x).toBe(0);
            expect(m.b).toBe(α);
        });
    });
    describe("squaredNorm", function () {
        it("definition", function () {
            checkEQ(one.squaredNorm(), one.mul(one.rev()));
            checkEQ(γ0.squaredNorm(), γ0.mul(γ0.rev()));
            checkEQ(γ1.squaredNorm(), γ1.mul(γ1.rev()));
            checkEQ(I.squaredNorm(), I.mul(I.rev()));
        });
        it("simplified", function () {
            checkEQ(one.squaredNorm(), one);
            checkEQ(γ0.squaredNorm(), one);
            checkEQ(γ1.squaredNorm(), one.neg());
            checkEQ(I.squaredNorm(), one.neg());
        });
        it("scaling", function () {
            for (const blade of blades) {
                checkEQ(blade.mul(two).squaredNorm(), blade.mul(blade.rev()).mul(two).mul(two));
            }
        });
    });
    describe("sub", function () {
        it("lhs non-zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime1(La, Lt, Lx, Lb);
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime1(Ra, Rt, Rx, Rb);
            const sum = lhs.sub(rhs);
            // sum should be correct.
            expect(sum.a).toBe(La - Ra, "a");
            expect(sum.t).toBe(Lt - Rt, "t");
            expect(sum.x).toBe(Lx - Rx, "x");
            expect(sum.b).toBe(Lb - Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("lhs zero", function () {
            const lhs = new Spacetime1();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime1(Ra, Rt, Rx, Rb);
            const sum = lhs.sub(rhs);
            expect(sum.a).toBe(-Ra, "a");
            expect(sum.t).toBe(-Rt, "t");
            expect(sum.x).toBe(-Rx, "x");
            expect(sum.b).toBe(-Rb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.b).toBe(Rb, "b");
        });
        it("rhs zero", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime1(La, Lt, Lx, Lb);
            const rhs = new Spacetime1();
            const sum = lhs.sub(rhs);
            expect(sum.a).toBe(La, "a");
            expect(sum.t).toBe(Lt, "t");
            expect(sum.x).toBe(Lx, "x");
            expect(sum.b).toBe(Lb, "b");
            // sum should be same as lhs.
            expect(sum === lhs).toBeTrue();
            // rhs should not be modified.
            expect(rhs.a).toBe(0, "a");
            expect(rhs.t).toBe(0, "t");
            expect(rhs.x).toBe(0, "x");
            expect(rhs.b).toBe(0, "b");
        });
        it("lhs locked", function () {
            const La = Math.random();
            const Lt = Math.random();
            const Lx = Math.random();
            const Lb = Math.random();
            const lhs = new Spacetime1(La, Lt, Lx, Lb).permlock();
            const Ra = Math.random();
            const Rt = Math.random();
            const Rx = Math.random();
            const Rb = Math.random();
            const rhs = new Spacetime1(Ra, Rt, Rx, Rb);
            const sum = lhs.sub(rhs);
            expect(sum.a).toBe(La - Ra, "a");
            expect(sum.t).toBe(Lt - Rt, "t");
            expect(sum.x).toBe(Lx - Rx, "x");
            expect(sum.b).toBe(Lb - Rb, "b");
            expect(sum === lhs).toBeFalse();
            // lhs should not be modified.
            expect(lhs.a).toBe(La, "a");
            expect(lhs.t).toBe(Lt, "t");
            expect(lhs.x).toBe(Lx, "x");
            expect(lhs.b).toBe(Lb, "b");
            // rhs should not be modified.
            expect(rhs.a).toBe(Ra, "a");
            expect(rhs.t).toBe(Rt, "t");
            expect(rhs.x).toBe(Rx, "x");
            expect(rhs.b).toBe(Rb, "b");
        });
    });
    describe("subScalar", function () {
        it("", function () {
            checkEQ(zero.subScalar(one.a, one.uom), zero.sub(one));
            for (const blade of blades) {
                checkEQ(blade.subScalar(one.a, one.uom), blade.sub(one));
                checkEQ(blade.subScalar(zero.a, zero.uom), blade.sub(zero));
                checkEQ(blade.subScalar(one.a, one.uom, 0.5), blade.sub(one.mulByNumber(0.5)));
            }
        });
    });
    describe("statics", function () {
        describe("scalar", function () {
            it("should initialize accessors.", function () {
                const a = Math.random();
                const s = Spacetime1.scalar(a, Unit.SECOND);
                expect(s.a).toBe(a);
                expect(s.t).toBe(0);
                expect(s.x).toBe(0);
                expect(s.b).toBe(0);
                expect(s.uom).toBe(Unit.SECOND);
            });
            it("should initialize accessors.", function () {
                const t = Math.random();
                const x = Math.random();
                const s = Spacetime1.vector(t, x, Unit.SECOND);
                expect(s.a).toBe(0);
                expect(s.t).toBe(t);
                expect(s.x).toBe(x);
                expect(s.b).toBe(0);
                expect(s.uom).toBe(Unit.SECOND);
            });
        });
    });
    describe("__add__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__add__(rhs), lhs.add(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__add__(2), lhs.add(two));
            }
        });
        it("(Unit)", function () {
            checkEQ(meter.__add__(Unit.METER), meter.add(meter));
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__add__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__radd__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__radd__(lhs), lhs.add(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__radd__(2), two.add(rhs));
            }
        });
        it("(Unit)", function () {
            checkEQ(meter.__radd__(Unit.METER), meter.add(meter));
        });
        it("otherwise", function () {
            expect(one.__radd__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__sub__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__sub__(rhs), lhs.sub(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__sub__(2), lhs.sub(two));
            }
        });
        it("(Unit)", function () {
            checkEQ(meter.__sub__(Unit.METER), meter.sub(meter));
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__sub__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__rsub__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__rsub__(lhs), lhs.sub(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rsub__(2), two.sub(rhs));
            }
        });
        it("(Unit)", function () {
            checkEQ(meter.__rsub__(Unit.METER), meter.sub(meter));
        });
        it("otherwise", function () {
            expect(one.__rsub__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__mul__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__mul__(rhs), lhs.mul(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__mul__(2), lhs.mul(two));
            }
        });
        it("(Unit)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__mul__(Unit.METER), lhs.mul(meter));
            }
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__mul__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__rmul__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__rmul__(lhs), lhs.mul(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rmul__(2), two.mul(rhs));
            }
        });
        it("(Unit)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rmul__(Unit.METER), meter.mul(rhs));
            }
        });
        it("otherwise", function () {
            expect(one.__rmul__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__vbar__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__vbar__(rhs), lhs.scp(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__vbar__(2), lhs.scp(two));
            }
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__vbar__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__rvbar__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__rvbar__(lhs), lhs.scp(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rvbar__(2), two.scp(rhs));
            }
        });
        it("otherwise", function () {
            expect(one.__rvbar__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__wedge__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__wedge__(rhs), lhs.ext(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__wedge__(2), lhs.ext(two));
            }
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__wedge__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__rwedge__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__rwedge__(lhs), lhs.ext(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rwedge__(2), two.ext(rhs));
            }
        });
        it("otherwise", function () {
            expect(one.__rwedge__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__lshift__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__lshift__(rhs), lhs.lco(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__lshift__(2), lhs.lco(two));
            }
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__lshift__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__rlshift__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__rlshift__(lhs), lhs.lco(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rlshift__(2), two.lco(rhs));
            }
        });
        it("otherwise", function () {
            expect(one.__rlshift__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__rshift__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(lhs.__rshift__(rhs), lhs.rco(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const lhs of blades) {
                checkEQ(lhs.__rshift__(2), lhs.rco(two));
            }
        });
        it("otherwise", function () {
            for (const lhs of blades) {
                expect(lhs.__rshift__("" as unknown as Spacetime1)).toBeUndefined();
            }
        });
    });
    describe("__rrshift__", function () {
        it("(Geometric)", function () {
            for (const lhs of blades) {
                for (const rhs of blades) {
                    checkEQ(rhs.__rrshift__(lhs), lhs.rco(rhs));
                }
            }
        });
        it("(number)", function () {
            for (const rhs of blades) {
                checkEQ(rhs.__rrshift__(2), two.rco(rhs));
            }
        });
        it("otherwise", function () {
            expect(one.__rrshift__("" as unknown as Spacetime1)).toBeUndefined();
        });
    });
    describe("__tilde__", function () {
        it("should be the operator overload of reversion", function () {
            for (const blade of blades) {
                checkEQ(blade.__tilde__(), blade.rev());
            }
        });
    });
    describe("__pos__", function () {
        it("should be the operator overload of identity", function () {
            for (const blade of blades) {
                checkEQ(blade.__pos__(), blade);
            }
        });
    });
    describe("__neg__", function () {
        it("should be the operator overload of negation", function () {
            for (const blade of blades) {
                checkEQ(blade.__neg__(), blade.neg());
            }
        });
    });
    describe("__bang__", function () {
        it("should be the operator overload of inverse", function () {
            for (const blade of blades) {
                checkEQ(blade.__bang__(), blade.inv());
            }
        });
    });
});
