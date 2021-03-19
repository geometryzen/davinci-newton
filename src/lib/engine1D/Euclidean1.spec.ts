import { Geometric1 } from "../math/Geometric1";
import { Unit } from "../math/Unit";
import { Euclidean1 } from "./Euclidean1";
import { Particle1 } from "./Particle1";

xdescribe("Euclidean1", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            expect(metric).toBeDefined();
        });
    });
    describe("zero", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const zero = metric.zero();
            expect(zero).toBeDefined();
        });
    });
    describe("lock", function () {
        it("should be defined.", function () {
            const mv = new Geometric1();
            const metric = new Euclidean1();
            const token = metric.lock(mv);
            expect(typeof token).toBe('number');
        });
    });
    describe("scalar", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const one = metric.scalar(1);
            expect(one).toBeDefined();
        });
        it("should be effective in setting the scalar coordinate of a multivector.", function () {
            const metric = new Euclidean1();
            const a = Math.random();
            const mv = metric.scalar(a);
            expect(metric.a(mv)).toBe(a);
        });
        it("should be effective in setting the unit of measure of a multivector.", function () {
            const metric = new Euclidean1();
            const a = Math.random();
            const mv = metric.scalar(a, Unit.KELVIN);
            expect(metric.uom(mv)).toBe(Unit.KELVIN);
        });
    });
    describe("identityMatrix", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const I = metric.identityMatrix();
            expect(I).toBeDefined();
            expect(I.dimensions).toBe(0);
            expect(Unit.isOne(I.uom)).toBe(true);
            I.getElement(0, 0);
        });
    });
    describe("uom", function () {
        it("should be defined.", function () {
            const mv = new Geometric1();
            const metric = new Euclidean1();
            const uom = metric.uom(mv);
            expect(Unit.isOne(uom)).toBe(true);
        });
    });
    describe("unlock", function () {
        it("should work.", function () {
            const mv = new Geometric1();
            const metric = new Euclidean1();
            const token = metric.lock(mv);
            metric.unlock(mv, token);
            expect(true).toBe(true);
        });
    });
    describe("copy", function () {
        it("should work.", function () {
            const a = Math.random();
            const uom = Unit.CANDELA;
            const source = new Geometric1([a, 0], uom);
            const target = new Geometric1([Math.random(), Math.random()], Unit.MOLE);
            const metric = new Euclidean1();
            const result = metric.copy(source, target);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
            expect(result === target).toBe(true);
            expect(target.a).toBe(source.a);
            expect(target.uom).toBe(source.uom);
            expect(source.a).toBe(a);
            expect(source.uom).toBe(uom);
        });
    });
    describe("a", function () {
        it("should be defined.", function () {
            const mv = new Geometric1();
            const metric = new Euclidean1();
            const a = metric.a(mv);
            expect(typeof a === 'number').toBe(true);
        });
    });
    describe("createForce", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const bead = new Particle1(M, Q);
            const force = metric.createForce(bead);
            expect(force.getBody()).toBe(bead);
        });
    });
    describe("copyVector", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const source = new Geometric1();
            const target = new Geometric1();
            const result = metric.copyVector(source, target);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("writeVector", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const source = new Geometric1();
            const target = new Geometric1();
            metric.writeVector(source, target);
            expect(true).toBe(true);
        });
    });
    describe("isZero", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const source = new Geometric1();
            const result = metric.isZero(source);
            expect(typeof result === 'boolean').toBe(true);
        });
    });
    describe("rotate", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const mv = new Geometric1();
            const spinor = new Geometric1();
            const result = metric.rotate(mv, spinor);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("addVector", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.addVector(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("subVector", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.subVector(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("ext", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.ext(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("write", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const source = new Geometric1();
            const target = new Geometric1();
            metric.write(source, target);
            expect(true).toBe(true);
        });
    });
    describe("mul", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.mul(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("neg", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const mv = new Geometric1();
            const result = metric.neg(mv);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("direction", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const mv = new Geometric1();
            const result = metric.direction(mv);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("mulByVector", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.mulByVector(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("divByScalar", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.divByScalar(lhs, metric.a(rhs), metric.uom(rhs));
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("scp", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.scp(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("magnitude", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const mv = new Geometric1();
            const result = metric.magnitude(mv);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("subScalar", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.subScalar(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("mulByScalar", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.mulByScalar(lhs, metric.a(rhs), metric.uom(rhs));
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("quaditude", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const mv = new Geometric1();
            const result = metric.quaditude(mv);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("add", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.add(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("copyBivector", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const source = new Geometric1();
            const target = new Geometric1();
            const result = metric.copyBivector(source, target);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("rev", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const mv = new Geometric1();
            const result = metric.rev(mv);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("mulByNumber", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.mulByNumber(lhs, metric.a(rhs));
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("sub", function () {
        it("should be defined.", function () {
            const metric = new Euclidean1();
            const lhs = new Geometric1();
            const rhs = new Geometric1();
            const result = metric.sub(lhs, rhs);
            expect(result).toBeDefined();
            expect(result instanceof Geometric1).toBe(true);
        });
    });
    describe("setUom", function () {
        it("should be defined.", function () {
            const mv = new Geometric1();
            const metric = new Euclidean1();
            metric.setUom(mv, Unit.KELVIN);
            expect(true).toBe(true);
        });
    });
    describe("uom followed by setUom", function () {
        it("should return the unit from setUom().", function () {
            const mv = new Geometric1();
            const metric = new Euclidean1();
            metric.setUom(mv, Unit.KELVIN);
            const uom = metric.uom(mv);
            expect(Unit.isOne(uom)).toBe(false);
            expect(uom).toBe(Unit.KELVIN);
        });
    });
    describe("invertMatric", function () {
        it("should ...", function () {
            const metric = new Euclidean1();
            const m = metric.identityMatrix();
            const inv = metric.invertMatrix(m);
            expect(inv).toBeDefined();
            expect(inv.dimensions).toBe(m.dimensions);
        });
    });
});
