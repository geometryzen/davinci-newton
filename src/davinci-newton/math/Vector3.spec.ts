import Matrix3 from './Matrix3';
import Spinor3 from './Spinor3';
import { Unit } from './Unit';
import Vector3 from './Vector3';

describe("Vector3", function () {
    describe("", function () {
        const s = new Spinor3(1 / Math.SQRT1_2, 1 / Math.SQRT1_2, 0, 0).normalize();
        const m = Matrix3.zero().rotation(s);
        const u = new Vector3(1, 0, 0, Unit.METER).applyMatrix(m);
        const v = new Vector3(1, 0, 0, Unit.METER).rotate(s);
        it("", function () {
            expect(s.magnitude()).toBe(1);
            expect(u.x).toBeCloseTo(v.x, 15);
            expect(u.y).toBeCloseTo(v.y, 15);
            expect(u.z).toBeCloseTo(v.z, 15);
        });
    });
});
