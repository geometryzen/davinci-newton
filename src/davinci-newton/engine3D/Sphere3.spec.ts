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

import Sphere3 from './Sphere3';

describe("Sphere3", function () {
    describe("updateAngularVelocity", function () {
        it("should accurately update Ω", function () {
            const body = new Sphere3(1 - 0.5 * Math.random());
            body.M = 1 + Math.random();
            body.L.yz = Math.random();
            body.L.zx = Math.random();
            body.L.xy = Math.random();

            const r = body.radius;
            const s = 2 * body.M * r * r / 5;
            body.updateAngularVelocity();
            expect(body.Ω.yz).toBe(body.L.yz / s);
            expect(body.Ω.zx).toBe(body.L.zx / s);
            expect(body.Ω.xy).toBe(body.L.xy / s);
        });
    });
});
