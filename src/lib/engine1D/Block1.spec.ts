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
});
