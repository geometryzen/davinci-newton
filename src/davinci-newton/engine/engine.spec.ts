import { Bivector2 } from '../math/Bivector2';
import { Geometric2 } from '../math/Geometric2';
import { Unit } from '../math/Unit';
import { Block } from './Block';
import { Engine } from './Engine';
import { Euclidean2D } from './Euclidean2D';
import { Dynamics2D } from './Dynamics2D';
import { State } from './State';

describe("engine", function () {
    describe("example", function () {
        it("", function () {
            const metric = new Euclidean2D();
            const dynamics = new Dynamics2D();
            const engine = new Engine(metric, dynamics);

            const block = new Block(Geometric2.scalar(1, Unit.METER), Geometric2.scalar(1, Unit.METER), metric);
            block.M = Geometric2.scalar(12);

            engine.contents.addBody(block);

            engine.strategy.advance(0.1, Unit.SECOND);
        });
    });
    describe("Ω calculation", function () {
        xit("calculated using (1/2) Ω * L(Ω) should be same as (1/2) ω * L(ω)", function () {
            const metric = new Euclidean2D();
            const dynamics = new Dynamics2D();
            const state = new State(metric, dynamics);
            const body = new Block(Geometric2.scalar(1), Geometric2.scalar(2), metric);
            body.M = Geometric2.scalar(12);
            body.L.xy = 7;
            body.L.uom = Unit.KILOGRAM.mul(Unit.METER).mul(Unit.METER).div(Unit.SECOND);
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.R.direction(true);

            /**
             * Rotor from world coordinates to local coordinates.
             */
            // TODO: This does not work because we are in 2D.
            /*
            const ω = new Vector2(body.L.yz, body.L.zx, body.L.xy, body.L.uom);
            ω.rotate(body.R.rev());
            ω.applyMatrix(body.Iinv);
            ω.rotate(body.R.rev());
            body.Ω.xy = ω.z;
            */

            // Just to make the sim be used.
            state.addBody(body);

            // const Ω = new Bivector2().copy(body.L).applyMatrix(Tmat).applyMatrix(body.Iinv).applyMatrix(Rmat);
            const Ω = new Bivector2(0, Unit.inv(Unit.SECOND)).copy(body.L).rotate(body.R.rev()).applyMatrix(body.Iinv).rotate(body.R.rev());

            expect(body.Ω.xy).toBeCloseTo(Ω.xy, 15);
        });
    });
});
