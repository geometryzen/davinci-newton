// Copyright 2017 David Holmes.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Bivector2 } from '../math/Bivector2';
import { Geometric2 } from '../math/Geometric2';
import { Unit } from '../math/Unit';
// import { Vector2 } from '../math/Vector2';
import { Block2 } from './Block2';
import { Physics2 } from './Physics2';

describe("Physics2", function () {
    describe("Ω calculation", function () {
        xit("calculated using (1/2) Ω * L(Ω) should be same as (1/2) ω * L(ω)", function () {
            // Not actually using this yet, other than to test construction.
            const sim = new Physics2();
            const body = new Block2(Geometric2.scalar(1), Geometric2.scalar(2));
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
            sim.addBody(body);

            // const Ω = new Bivector2().copy(body.L).applyMatrix(Tmat).applyMatrix(body.Iinv).applyMatrix(Rmat);
            const Ω = new Bivector2(0, Unit.inv(Unit.SECOND)).copy(body.L).rotate(body.R.rev()).applyMatrix(body.Iinv).rotate(body.R.rev());

            expect(body.Ω.xy).toBeCloseTo(Ω.xy, 15);
        });
    });
});
