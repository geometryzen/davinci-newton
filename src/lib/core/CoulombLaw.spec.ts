import { Geometric3 } from '../math/Geometric3';
import { Unit } from '../math/Unit';
import { LOCAL, WORLD } from '../model/CoordType';
import { CoulombLaw } from './CoulombLaw';
import { Sphere3 } from '../engine3D/Sphere3';

/**
 * @hidden
 */
const COULOMB = Unit.COULOMB;
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
const k = Geometric3.scalar(9.0E9, NEWTON.mul(METER).mul(METER).div(COULOMB).div(COULOMB));

describe("CoulombLaw", function () {
    const body1 = new Sphere3();
    const body2 = new Sphere3();

    body1.Q = Geometric3.scalar(1.5E-9, COULOMB);
    body2.Q = Geometric3.scalar(-2.0E-9, COULOMB);

    body1.X = Geometric3.vector(-0.0075, 0, 0, METER);
    body2.X = Geometric3.vector(+0.0075, 0, 0, METER);

    const interaction = new CoulombLaw(body1, body2, k);
    const q1 = body1.Q.a;
    const q2 = body2.Q.a;
    const r = Math.abs(body1.X.x - body2.X.x);
    it("CoordType", function () {
        expect(LOCAL).toBeDefined();
        expect(WORLD).toBeDefined();
    });
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
