import Geometric3 from '../math/Geometric3';
import CoulombLaw3 from './CoulombLaw3';
import Sphere3 from './Sphere3';
import Unit from '../math/Unit';

const COULOMB = Unit.COULOMB;
const KILOGRAM = Unit.KILOGRAM;
const METER = Unit.METER;
const SECOND = Unit.SECOND;
const MOTION = KILOGRAM.mul(METER).div(SECOND);
const NEWTON = MOTION.div(SECOND);
const k = Geometric3.scalar(9.0E9, NEWTON.mul(METER).mul(METER).div(COULOMB).div(COULOMB));

describe("CoulombLaw3", function () {
    const body1 = new Sphere3();
    const body2 = new Sphere3();

    body1.Q = Geometric3.scalar(1.5E-9, COULOMB);
    body2.Q = Geometric3.scalar(-2.0E-9, COULOMB);

    body1.X = Geometric3.vector(-0.0075, 0, 0, METER);
    body2.X = Geometric3.vector(+0.0075, 0, 0, METER);

    const interaction = new CoulombLaw3(body1, body2, k);
    const q1 = body1.Q.a;
    const q2 = body2.Q.a;
    const r = Math.abs(body1.X.x - body2.X.x);
    it("potentialEnergy", function () {
        const pe = interaction.potentialEnergy();
        expect(pe.a).toBe(k.a * q1 * q2 / r);
        expect(pe.uom.multiplier).toBe(1);
        expect(pe.uom.multiplier).toBe(1);
        expect(pe.uom.dimensions.M.numer).toBe(1);
        expect(pe.uom.dimensions.L.numer).toBe(2);
        expect(pe.uom.dimensions.T.numer).toBe(-2);
        expect(pe.uom.dimensions.Q.numer).toBe(0);
    });
    it("updateForces", function () {
        const forces = interaction.updateForces();
        const force1 = forces[0];
        const force2 = forces[1];
        expect(force1.F.x).toBe(-k.a * q1 * q2 / (r * r));
        expect(force1.F.y).toBe(0);
        expect(force1.F.z).toBe(0);
        expect(force1.F.uom.multiplier).toBe(1);
        expect(force1.F.uom.dimensions.M.numer).toBe(1);
        expect(force1.F.uom.dimensions.L.numer).toBe(1);
        expect(force1.F.uom.dimensions.T.numer).toBe(-2);
        expect(force1.F.uom.dimensions.Q.numer).toBe(0);
        expect(force1.F.toExponential()).toBe("1.2e-4*e1 N");

        expect(force2.F.x).toBe(+k.a * q1 * q2 / (r * r));
        expect(force2.F.y).toBe(0);
        expect(force2.F.z).toBe(0);
        expect(force2.F.uom.multiplier).toBe(1);
        expect(force2.F.uom.dimensions.M.numer).toBe(1);
        expect(force2.F.uom.dimensions.L.numer).toBe(1);
        expect(force2.F.uom.dimensions.T.numer).toBe(-2);
        expect(force2.F.uom.dimensions.Q.numer).toBe(0);
        expect(force2.F.toExponential()).toBe("-1.2e-4*e1 N");
    });
});
