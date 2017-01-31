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

import Bivector3 from '../math/Bivector3';
import Block3 from './Block3';
import Vector3 from '../math/Vector3';

describe("Physics3", function () {
    describe("Ω calculation", function () {
        it("calculated using (1/2) Ω * L(Ω) should be same as (1/2) ω * L(ω)", function () {
            const body = new Block3(1, 2, 3);
            body.M = 12;
            body.L.yz = 3;
            body.L.zx = 5;
            body.L.xy = 7;
            // We'll use a rotation of 90 degrees counter clockwise (from above) in the xy plane.
            body.R.a = 1 / Math.SQRT1_2;
            body.R.xy = -1 / Math.SQRT1_2;
            body.R.normalize();

            /**
             * Rotor from world coordinates to local coordinates.
             */
            const ω = new Vector3(body.L.yz, body.L.zx, body.L.xy);
            ω.rotate(body.R.rev());
            ω.applyMatrix(body.Iinv);
            ω.rotate(body.R.rev());
            body.Ω.yz = ω.x;
            body.Ω.zx = ω.y;
            body.Ω.xy = ω.z;

            // const Ω = new Bivector3().copy(body.L).applyMatrix(Tmat).applyMatrix(body.Iinv).applyMatrix(Rmat);
            const Ω = new Bivector3().copy(body.L).rotate(body.R.rev()).applyMatrix(body.Iinv).rotate(body.R.rev());

            expect(body.Ω.xy).toBeCloseTo(Ω.xy, 15);
            expect(body.Ω.yz).toBeCloseTo(Ω.yz, 15);
            expect(body.Ω.zx).toBeCloseTo(Ω.zx, 15);
        });
    });
});
