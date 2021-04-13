import { Geometric3 } from '../math/Geometric3';
import { Unit } from '../math/Unit';
import { GravitationLaw } from './GravitationLaw';
import { Sphere3 } from '../engineG30/Sphere3';

/**
 * @hidden
 */
const KILOGRAM = Unit.KILOGRAM;
/**
 * @hidden
 */
const METER = Unit.METER;
/**
 * @hidden
 */
const SECOND = Unit.SECOND;
/**
 * @hidden
 */
const MOTION = KILOGRAM.mul(METER).div(SECOND);
/**
 * @hidden
 */
const NEWTON = MOTION.div(SECOND);
/**
 * @hidden
 */
const G = Geometric3.scalar(6.7E-11, NEWTON.mul(METER).mul(METER).div(KILOGRAM).div(KILOGRAM));

describe("GravitationLaw", function () {
    const body1 = new Sphere3();
    const body2 = new Sphere3();

    body1.M = Geometric3.scalar(3, KILOGRAM);
    body2.M = Geometric3.scalar(5, KILOGRAM);

    body1.X = Geometric3.vector(-1, 0, 0, METER);
    body2.X = Geometric3.vector(+1, 0, 0, METER);

    const gravity = new GravitationLaw(body1, body2, G);
    const m1 = body1.M.a;
    const m2 = body2.M.a;
    const r = Math.abs(body1.X.x - body2.X.x);
    it("potentialEnergy", function () {
        const pe = gravity.potentialEnergy();
        expect(pe.a).toBe(-G.a * m1 * m2 / r);
        expect(pe.uom.multiplier).toBe(1);
        expect(pe.uom.multiplier).toBe(1);
        expect(pe.uom.dimensions.M.numer).toBe(1);
        expect(pe.uom.dimensions.L.numer).toBe(2);
        expect(pe.uom.dimensions.T.numer).toBe(-2);
        expect(pe.uom.dimensions.Q.numer).toBe(0);
    });
    it("updateForces", function () {
        const forces = gravity.updateForces();
        const force1 = forces[0];
        const force2 = forces[1];
        expect(force1.F.x).toBe(+G.a * m1 * m2 / (r * r));
        expect(force1.F.y).toBe(0);
        expect(force1.F.z).toBe(0);
        expect(force1.F.uom.multiplier).toBe(1);
        expect(force1.F.uom.dimensions.M.numer).toBe(1);
        expect(force1.F.uom.dimensions.L.numer).toBe(1);
        expect(force1.F.uom.dimensions.T.numer).toBe(-2);
        expect(force1.F.uom.dimensions.Q.numer).toBe(0);

        expect(force2.F.x).toBe(-G.a * m1 * m2 / (r * r));
        expect(force2.F.y).toBe(0);
        expect(force2.F.z).toBe(0);
        expect(force2.F.uom.multiplier).toBe(1);
        expect(force2.F.uom.dimensions.M.numer).toBe(1);
        expect(force2.F.uom.dimensions.L.numer).toBe(1);
        expect(force2.F.uom.dimensions.T.numer).toBe(-2);
        expect(force2.F.uom.dimensions.Q.numer).toBe(0);
    });
});
