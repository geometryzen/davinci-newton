import { Unit } from "../math/Unit";
import { Block1 } from "./Block1";
import { Euclidean1 } from "./Euclidean1";

describe("Block1", function () {
    describe("constructor", function () {
        it("dimensionless", function () {
            const metric = new Euclidean1();
            const width = metric.scalar(1);
            const block = new Block1(width);
            expect(block).toBeDefined();
            expect(Unit.isOne(metric.uom(block.M))).toBe(true);
        });
        it("METER", function () {
            const metric = new Euclidean1();
            const width = metric.scalar(1, Unit.METER);
            expect(width.a).toBe(1);
            expect(width.uom).toBe(Unit.METER);
            const block = new Block1(width);
            expect(block).toBeDefined();
            expect((metric.uom(block.M))).toBe(Unit.KILOGRAM);
        });
    });
    describe("width", function () {
        it("get", function () {
            const metric = new Euclidean1();
            const block = new Block1(metric.scalar(1, Unit.METER));
            const width = block.width;
            expect(width.a).toBe(1);
            expect(width.uom).toBe(Unit.METER);
        });
        it("set", function () {
            const metric = new Euclidean1();
            const block = new Block1(metric.scalar(1, Unit.METER));
            block.width = metric.scalar(2, Unit.ONE);
            const width = block.width;
            expect(width.a).toBe(2);
            expect(width.uom).toBe(Unit.ONE);
        });
    });
});
