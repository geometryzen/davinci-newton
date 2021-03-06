import { Block3 } from '../engine3D/Block3';
import { Euclidean3 } from '../engine3D/Euclidean3';
import { Geometric3 } from '../math/Geometric3';
import { Unit } from '../math/Unit';
import { Vec3 } from '../math/Vec3';
import { RigidBody } from './RigidBody';

/**
 * The unit of linear momentum. It's what Newton meant by motion.
 */
const MOTION = Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND);

describe("RigidBody", function () {
    describe("constructor", function () {
        it("should initialize X to zero", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.X.x).toBe(0);
            expect(body.X.y).toBe(0);
            expect(body.X.z).toBe(0);
            expect(body.X.isZero()).toBeTruthy();
        });
        it("should initialize R to one", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.R.a).toBe(1);
            expect(body.R.xy).toBe(0);
            expect(body.R.yz).toBe(0);
            expect(body.R.zx).toBe(0);
            expect(body.R.isOne()).toBeTruthy();
        });
        it("should initialize P to zero", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.P.x).toBe(0);
            expect(body.P.y).toBe(0);
            expect(body.P.z).toBe(0);
            expect(body.P.isZero()).toBeTruthy();
        });
        it("should initialize L to zero", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.L.xy).toBe(0);
            expect(body.L.yz).toBe(0);
            expect(body.L.zx).toBe(0);
            expect(body.L.isZero()).toBeTruthy();
        });
        it("should initialize M to one", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.M.a).toBe(1);
        });
        it("should initialize Ω to zero", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.Ω.xy).toBe(0);
            expect(body.Ω.yz).toBe(0);
            expect(body.Ω.zx).toBe(0);
            expect(body.Ω.isZero()).toBeTruthy();
        });
        it("should initialize I to one", function () {
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            expect(body.I.getElement(0, 0)).toBe(1);
            expect(body.I.getElement(0, 1)).toBe(0);
            expect(body.I.getElement(0, 2)).toBe(0);
            expect(body.I.getElement(1, 0)).toBe(0);
            expect(body.I.getElement(1, 1)).toBe(1);
            expect(body.I.getElement(1, 2)).toBe(0);
            expect(body.I.getElement(2, 0)).toBe(0);
            expect(body.I.getElement(2, 1)).toBe(0);
            expect(body.I.getElement(2, 2)).toBe(1);
        });
    });
    describe("localToWorld", function () {
        it("should depend correctly on X, R, centerOfMassLocal, localPoint", function () {
            // x = rotate((localPoint - centerOfMassLocal), R) + X
            const metric = new Euclidean3();
            const body = new RigidBody(metric);
            body.X.copyVector({ x: Math.random(), y: Math.random(), z: Math.random(), uom: Unit.METER });
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.centerOfMassLocal = Geometric3.vector(Math.random(), Math.random(), Math.random(), Unit.METER);
            const localPoint = Geometric3.vector(0, 0, 0, Unit.METER);
            const xActual = Geometric3.vector(0, 0, 0, Unit.METER);
            const xExpect = Geometric3.vector(0, 0, 0, Unit.METER);
            xExpect.copy(localPoint).sub(body.centerOfMassLocal).rotate(body.R).add(body.X);
            body.localPointToWorldPoint(localPoint, xActual);

            expect(xActual.x).toBe(xExpect.x);
            expect(xActual.y).toBe(xExpect.y);
            expect(xActual.z).toBe(xExpect.z);
        });
    });
    describe("rotationalEnergy", function () {
        describe("calculated using (1/2) Ω * ~L(Ω)", function () {
            const body = new Block3(Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()));
            body.M = Geometric3.scalar(12);
            const ω = new Vec3(Math.random(), Math.random(), Math.random(), Unit.inv(Unit.SECOND));
            body.L.yz = Math.random();
            body.L.zx = Math.random();
            body.L.xy = Math.random();
            body.L.uom = Unit.METER.mul(MOTION);

            body.Ω.yz = ω.x;
            body.Ω.zx = ω.y;
            body.Ω.xy = ω.z;
            body.Ω.uom = ω.uom;

            const J = new Vec3(body.L.yz, body.L.zx, body.L.xy, body.L.uom);
            const expectRotationalEnergy = ω.dot(J).mulByNumber(0.5);
            const actualRotationalEnergy = body.rotationalEnergy();
            const uomExpect = expectRotationalEnergy.uom;
            const uomActual = actualRotationalEnergy.uom;
            it("should get the quantity", function () {
                expect(actualRotationalEnergy.a).toBeCloseTo(expectRotationalEnergy.a, 10);
            });
            it("should have M dimension 1", function () {
                expect(uomExpect.dimensions.M.numer).toBe(1);
                expect(uomExpect.dimensions.M.denom).toBe(1);
                expect(uomActual.dimensions.M.numer).toBe(1);
                expect(uomActual.dimensions.M.denom).toBe(1);
            });
            it("should have L dimension 2", function () {
                expect(uomExpect.dimensions.L.numer).toBe(2);
                expect(uomExpect.dimensions.L.denom).toBe(1);
                expect(uomActual.dimensions.L.numer).toBe(2);
                expect(uomActual.dimensions.L.denom).toBe(1);
            });
            it("should have T dimension -2", function () {
                expect(uomExpect.dimensions.T.numer).toBe(-2);
                expect(uomExpect.dimensions.T.denom).toBe(1);
                expect(uomActual.dimensions.T.numer).toBe(-2);
                expect(uomActual.dimensions.T.denom).toBe(1);
            });
            it("should have Q dimension 0", function () {
                expect(uomExpect.dimensions.Q.numer).toBe(0);
                expect(uomExpect.dimensions.Q.denom).toBe(1);
                expect(uomActual.dimensions.Q.numer).toBe(0);
                expect(uomActual.dimensions.Q.denom).toBe(1);
            });
        });
    });
    describe("translationalEnergy", function () {
        describe("calculated using (1/2) P * P / M", function () {
            const body = new Block3(Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()), Geometric3.scalar(Math.random()));

            body.M = Geometric3.scalar(12, Unit.KILOGRAM);

            body.P.x = Math.random();
            body.P.y = Math.random();
            body.P.z = Math.random();
            body.P.uom = Unit.KILOGRAM.mul(Unit.METER).div(Unit.SECOND);

            const expectTranslationalEnergy = 0.5 * (body.P.x * body.P.x + body.P.y * body.P.y + body.P.z * body.P.z) / body.M.a;
            const actualTranslationalEnergy = body.translationalEnergy();
            const uom = actualTranslationalEnergy.uom;
            it("should get the quantity", function () {
                expect(actualTranslationalEnergy.a).toBe(expectTranslationalEnergy);
            });
            it("M dimension", function () {
                expect(uom.dimensions.M.numer).toBe(1);
                expect(uom.dimensions.M.denom).toBe(1);
            });
            it("L", function () {
                expect(uom.dimensions.L.numer).toBe(2);
                expect(uom.dimensions.L.denom).toBe(1);
            });
            it("T", function () {
                expect(uom.dimensions.T.numer).toBe(-2);
                expect(uom.dimensions.T.denom).toBe(1);
            });
            it("Q", function () {
                expect(uom.dimensions.Q.numer).toBe(0);
                expect(uom.dimensions.Q.denom).toBe(1);
            });
        });
    });
});
