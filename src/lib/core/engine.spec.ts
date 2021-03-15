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
import { Engine } from './Engine';
import { Spring } from './Spring';

describe("engine", function () {
    describe("static", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));

            expect(block.X.a).toBe(0);
            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);
            expect(block.X.b).toBe(0);

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
            block.P.x = 1;
            block.P.y = 2;

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
            block.P.x = 1;
            block.P.y = 2;
            block.P.z = 3;

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
            block.P.x = 0;
            block.P.y = 0;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

            const F = new ConstantForceLaw(block, Geometric2.vector(1, 0, Unit.NEWTON));

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);

            engine.addBody(block);
            engine.addForceLaw(F);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);

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
            block.P.x = 0;
            block.P.y = 0;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

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
    describe("constant force", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block.P.x = 0;
            block.P.y = 0;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

            const F = new ConstantForceLaw(block, Geometric2.vector(1, 0, Unit.NEWTON));

            expect(block.X.x).toBe(0);
            expect(block.X.y).toBe(0);

            engine.addBody(block);
            engine.addForceLaw(F);

            engine.advance(1, Unit.SECOND);

            expect(block.X.x).toBe(0.5);
            expect(block.X.y).toBe(0);

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
            block.P.x = 0;
            block.P.y = 0;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

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
    describe("spring force", function () {
        it("Euclidean2D", function () {
            const metric = new Euclidean2();
            const dynamics = new Dynamics2();
            const engine = new Engine(metric, dynamics);

            const block1 = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block1.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block1.X = Geometric2.vector(-1, 0, Unit.METER);
            block1.P.x = 0;
            block1.P.y = 0;
            block1.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

            const block2 = new Block2(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER));
            block2.M = Geometric2.scalar(1, Unit.KILOGRAM);
            block1.X = Geometric2.vector(1, 0, Unit.METER);
            block2.P.x = 0;
            block2.P.y = 0;
            block2.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

            const spring = new Spring(block1, block2);
            spring.restLength = Geometric2.scalar(1, Unit.METER);

            expect(block1.X.x).toBe(1);
            expect(block1.X.y).toBe(0);

            engine.addBody(block1);
            engine.addBody(block2);
            engine.addForceLaw(spring);

            engine.advance(1, Unit.SECOND);

            expect(block1.X.x).toBe(1);
            expect(block1.X.y).toBe(0);

            engine.advance(1, Unit.SECOND);

            expect(block1.X.x).toBe(1);
            expect(block1.X.y).toBe(0);

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
            block.P.x = 0;
            block.P.y = 0;
            block.P.uom = Unit.KILOGRAM_METER_PER_SECOND;

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

            const bead = new Particle2(Geometric2.scalar(1, Unit.KILOGRAM), Geometric2.scalar(0, Unit.COULOMB));
            const F = new ConstantForceLaw(bead, Geometric2.vector(0, -1, Unit.NEWTON));

            bead.X = Geometric2.vector(1, 1).direction();

            const unitCircle = function (x: Geometric2, N: Geometric2): void {
                N.copyVector(x).direction();
            };
            const S = new SurfaceConstraint2(bead, unitCircle);

            engine.addBody(bead);
            engine.addForceLaw(F);
            engine.addConstraint(S);
            // engine.removeConstraint(S);

            for (let i = 0; i < 1000; i++) {
                engine.advance(0.001, Unit.SECOND);
                // console.log(`X=>${bead.X}`);
                // console.log(`|X|=>${bead.X.magnitude(false)}`);
            }
            expect(true).toBe(true);
        });
        it("Euclidean3D", function () {
            const metric = new Euclidean3();
            const dynamics = new Dynamics3();
            const engine = new Engine(metric, dynamics);

            const bead = new Particle3(Geometric3.scalar(1, Unit.KILOGRAM), Geometric3.scalar(0, Unit.COULOMB));
            const F = new ConstantForceLaw(bead, Geometric3.vector(0, -1, 0, Unit.NEWTON));

            bead.X = Geometric3.vector(1, 1, 0).direction(true); // TODO

            const unitCircle = function (x: Geometric3, N: Geometric3): void {
                N.copyVector(x).direction(true); // TODO
            };
            const S = new SurfaceConstraint3(bead, unitCircle);

            engine.addBody(bead);
            engine.addForceLaw(F);
            engine.addConstraint(S);
            // engine.removeConstraint(S);

            for (let i = 0; i < 1000; i++) {
                engine.advance(0.001, Unit.SECOND);
                // console.log(`X=>${bead.X}`);
                // console.log(`|X|=>${bead.X.magnitude(false)}`);
            }
            expect(true).toBe(true);
        });
    });
});
