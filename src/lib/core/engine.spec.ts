import { Block2 } from '../engine2D/Block2';
import { Dynamics2 } from '../engine2D/Dynamics2';
import { Euclidean2 } from '../engine2D/Euclidean2';
import { Particle2 } from '../engine2D/Particle2';
import { SurfaceConstraint2 } from '../engine2D/SurfaceConstraint2';
import { Block3 } from '../engine3D/Block3';
import { Dynamics3 } from '../engine3D/Dynamics3';
import { Euclidean3 } from '../engine3D/Euclidean3';
import { Particle3 } from '../engine3D/Particle3';
import { SurfaceConstraint3 } from '../engine3D/SurfaceConstraint3';
import { Geometric2 } from '../math/Geometric2';
import { Geometric3 } from '../math/Geometric3';
import { Unit } from '../math/Unit';
import { ConstantForceLaw } from './ConstantForceLaw';
import { ConstantTorqueLaw } from './ConstantTorqueLaw';
import { Engine } from './Engine';
import { Spring } from './Spring';

describe("engine", function () {
    describe("static", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.kilogram;
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;
            block.updateAngularVelocity();

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.Ω.a).toBe(0);
            expect(block.Ω.x).toBe(0);
            expect(block.Ω.y).toBe(0);
            expect(block.Ω.b).toBe(0);
            expect(block.Ω.uom).toBe(Unit.INV_SECOND);

            engine.addBody(block);

            engine.advance(1, Unit.SECOND);

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));

            engine.addBody(block);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
        });
    });
    describe("constant velocity", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.kilogram;
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.x = 1;
            block.P.y = 2;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);

            engine.addBody(block);

            engine.advance(1, Unit.SECOND);

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(1);
            expect(block.X.y).toBe(2);
            expect(block.X.b).toBe(0);
        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.kilogram;
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.x = 1;
            block.P.y = 2;
            block.P.z = 3;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            engine.addBody(block);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(1);
            expect(block.X.y).toBe(2);
            expect(block.X.z).toBe(3);
        });
    });
    describe("constant force", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            // The linear momentum uom should bootstrap from the integration of the force over time. 
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric2.vector(1, 0, Unit.NEWTON));

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.x).toBe(0);
            expect(block.R.y).toBe(0);
            expect(block.R.b).toBe(0);
            expect(block.R.uom).toBe(Unit.ONE);

            expect(block.P.a).toBe(0);
            expect(block.P.x).toBe(0);
            expect(block.P.y).toBe(0);
            expect(block.P.b).toBe(0);
            // expect(block.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

            expect(block.L.a).toBe(0);
            expect(block.L.x).toBe(0);
            expect(block.L.y).toBe(0);
            expect(block.L.b).toBe(0);
            expect(block.L.uom).toBe(Unit.JOULE_SECOND);

            engine.addBody(block);
            engine.addForceLaw(F);

            engine.advance(1, Unit.SECOND);

            expect(block.M.a).toBe(1);
            expect(block.M.x).toBe(0);
            expect(block.M.y).toBe(0);
            expect(block.M.b).toBe(0);
            expect(block.M.uom).toBe(Unit.KILOGRAM);

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.x).toBe(0);
            expect(block.R.y).toBe(0);
            expect(block.R.b).toBe(0);
            expect(block.R.uom).toBe(Unit.ONE);

            expect(block.P.a).toBe(0);
            expect(block.P.x).toBe(1);
            expect(block.P.y).toBe(0);
            expect(block.P.b).toBe(0);
            expect(block.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

            expect(block.L.a).toBe(0);
            expect(block.L.x).toBe(0);
            expect(block.L.y).toBe(0);
            expect(block.L.b).toBe(0);
            expect(block.L.uom).toBe(Unit.JOULE_SECOND);

            expect(block.Ω.a).toBe(0);
            expect(block.Ω.x).toBe(0);
            expect(block.Ω.y).toBe(0);
            expect(block.Ω.b).toBe(0);
            expect(block.Ω.uom).toBe(Unit.INV_SECOND);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(2);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(4.5);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(8);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(12.5);
            expect(block.X.y).toBe(0);

        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.scalar(1, Unit.KILOGRAM);
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            // The linear momentum uom should bootstrap from the integration of the force over time. 
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric3.vector(1, 0, 0, Unit.NEWTON));

            engine.addBody(block);
            engine.addForceLaw(F);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(2);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(4.5);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(8);
            expect(block.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(12.5);
            expect(block.X.y).toBe(0);
        });
    });
    describe("constant torque", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block.X.uom = Unit.METER;
            block.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;
            block.updateAngularVelocity();

            const T = new ConstantTorqueLaw(block, Geometric2.bivector(1, Unit.mul(Unit.NEWTON, Unit.METER)), 0);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);

            engine.addBody(block);
            engine.addTorqueLaw(T);

            engine.advance(1, Unit.SECOND);
        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.scalar(1, Unit.KILOGRAM);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric3.vector(1, 0, 0, Unit.NEWTON));

            engine.addBody(block);
            engine.addForceLaw(F);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
            // Unit is undefined while value is zero.
            // expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.xy).toBe(0);
            expect(block.R.yz).toBe(0);
            expect(block.R.zx).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
            expect(block.X.uom).toBe(Unit.METER);

            expect(block.R.a).toBe(1);
            expect(block.R.xy).toBe(0);
            expect(block.R.yz).toBe(0);
            expect(block.R.zx).toBe(0);

            expect(block.P.x).toBe(1);
            expect(block.P.y).toBe(0);
            expect(block.P.z).toBe(0);
            expect(block.P.uom).toBe(Unit.KILOGRAM_METER_PER_SECOND);

            // expect(block.L.a).toBe(1);
            expect(block.L.xy).toBe(0);
            expect(block.L.yz).toBe(0);
            expect(block.L.zx).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(2);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(4.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(8);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(12.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

        });
    });
    describe("spring force", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block1 = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block1.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block1.X = Geometric2.vector(-1, 0, Unit.METER);
            block1.R.uom = Unit.ONE;
            block1.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block1.L.uom = Unit.JOULE_SECOND;

            const block2 = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block2.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block2.X = Geometric2.vector(1, 0, Unit.METER);
            block2.R.uom = Unit.ONE;
            block2.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block2.L.uom = Unit.JOULE_SECOND;

            const spring = new Spring(block1, block2);
            spring.k = Geometric2.scalar(1, Unit.STIFFNESS);
            spring.restLength = Geometric2.scalar(1, Unit.METER);

            expect(block1.X.x).toBe(-1);
            expect(block1.X.y).toBe(0);

            expect(block2.X.x).toBe(1);
            expect(block2.X.y).toBe(0);

            engine.addBody(block1);
            engine.addBody(block2);
            engine.addForceLaw(spring);

            engine.advance(1, Unit.SECOND);

            expect(block1.X.x).toBe(-0.5833333333333333);
            expect(block1.X.y).toBe(0);

            // engine.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(1);
            // expect(block1.X.y).toBe(0);

            // engine.strategy.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(4.5);
            // expect(block1.X.y).toBe(0);

            // engine.strategy.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(8);
            // expect(block1.X.y).toBe(0);

            // engine.strategy.advance(1, Unit.SECOND);

            // expect(block1.X.x).toBe(12.5);
            // expect(block1.X.y).toBe(0);
        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const block = new Block3(Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER), Geometric3.scalar(1, Unit.METER));
            block.M = Geometric3.scalar(1, Unit.KILOGRAM);
            block.X.uom = Unit.METER;
            block.R.uom = Unit.ONE;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            block.L.uom = Unit.JOULE_SECOND;

            const F = new ConstantForceLaw(block, Geometric3.vector(1, 0, 0, Unit.NEWTON));

            engine.addBody(block);
            engine.addForceLaw(F);

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);
            expect(block.X.z).toBe(0);
        });
    });
    describe("constraints", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const dimensionless = true;
            const kg = dimensionless ? Unit.ONE : Unit.KILOGRAM;
            const m = dimensionless ? Unit.ONE : Unit.METER;
            const s = dimensionless ? Unit.ONE : Unit.SECOND;
            const C = dimensionless ? Unit.ONE : Unit.COULOMB;
            const N = dimensionless ? Unit.ONE : Unit.NEWTON;
            const KILOGRAM_METER_PER_SECOND = dimensionless ? Unit.ONE : Unit.KILOGRAM_METER_PER_SECOND;
            const JOULE_SECOND = dimensionless ? Unit.ONE : Unit.JOULE_SECOND;

            const bead = new Particle2(Geometric2.scalar(1, kg), Geometric2.scalar(0, C));
            const F = new ConstantForceLaw(bead, Geometric2.vector(0, -1, N));

            bead.X = Geometric2.vector(1, 1).direction().mulByScalar(1, m);
            bead.R.uom = Unit.ONE;
            bead.P.uom = KILOGRAM_METER_PER_SECOND;
            bead.L.uom = JOULE_SECOND;

            const radiusFn = function (x: Geometric2, radius: Geometric2): void {
                radius.copyScalar(1, m);
            };

            const rotationFn = function (x: Geometric2, plane: Geometric2): void {
                plane.copyVector(Geometric2.e1).mulByVector(Geometric2.e2).direction();
            };

            const tangentFn = function (x: Geometric2, tangent: Geometric2): void {
                tangent.copyVector(x).mulByVector(Geometric2.e1).mulByVector(Geometric2.e2).direction();
            };
            const S = new SurfaceConstraint2(bead, radiusFn, rotationFn, tangentFn);

            engine.addBody(bead);
            engine.addForceLaw(F);
            engine.addConstraint(S);
            // engine.removeConstraint(S);

            for (let i = 0; i < 10; i++) {
                engine.advance(0.001, s);
                // console.lg(`X=>${bead.X}`);
                // console.lg(`|X|=>${bead.X.magnitude(false)}`);
            }
            expect(true).toBe(true);
        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const dimensionless = true;
            const kg = dimensionless ? Unit.ONE : Unit.KILOGRAM;
            const m = dimensionless ? Unit.ONE : Unit.METER;
            const s = dimensionless ? Unit.ONE : Unit.SECOND;
            const C = dimensionless ? Unit.ONE : Unit.COULOMB;
            const N = dimensionless ? Unit.ONE : Unit.NEWTON;
            const KILOGRAM_METER_PER_SECOND = dimensionless ? Unit.ONE : Unit.KILOGRAM_METER_PER_SECOND;
            const JOULE_SECOND = dimensionless ? Unit.ONE : Unit.JOULE_SECOND;

            const bead = new Particle3(Geometric3.scalar(1, kg), Geometric3.scalar(0, C));
            const F = new ConstantForceLaw(bead, Geometric3.vector(0, -1, 0, N));

            bead.X = Geometric3.vector(1, 1, 0).direction(true).mulByScalar(1, m);
            bead.R.uom = Unit.ONE;
            bead.P.uom = KILOGRAM_METER_PER_SECOND;
            bead.L.uom = JOULE_SECOND;

            const radiusFn = function (x: Geometric3, radius: Geometric3): void {
                radius.copyScalar(1, m);
            };

            const rotationFn = function (x: Geometric3, plane: Geometric3): void {
                plane.copyVector(Geometric3.e1).mulByVector(Geometric3.e2).direction(true); // TODO: mutate optional
            };

            const tangentFn = function (x: Geometric3, tangent: Geometric3): void {
                tangent.copyVector(x).mulByVector(Geometric3.e1).mulByVector(Geometric3.e2).direction(true);
            };

            const S = new SurfaceConstraint3(bead, radiusFn, rotationFn, tangentFn);

            engine.addBody(bead);
            engine.addForceLaw(F);
            engine.addConstraint(S);
            // engine.removeConstraint(S);

            for (let i = 0; i < 100; i++) {
                engine.advance(0.01, s);
                // console.lg(`X=>${bead.X}`);
                // console.lg(`|X|=>${bead.X.magnitude(false)}`);
            }
            expect(true).toBe(true);
        });
    });
});
