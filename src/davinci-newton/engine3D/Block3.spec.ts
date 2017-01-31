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

import Block3 from './Block3';

describe("Block3", function () {
    describe("updateAngularVelocity", function () {
        it("should accurately update Ω", function () {
            const body = new Block3(2, 3, 5);
            const w = body.width;
            const h = body.height;
            const d = body.depth;
            const ww = w * w;
            const hh = h * h;
            const dd = d * d;
            body.M = Math.random();
            body.L.yz = 0;
            body.L.zx = 0;
            body.L.xy = 1;
            body.updateAngularVelocity();
            expect(body.Ω.yz).toBe((12 / body.M) * body.L.yz / (hh + dd));
            expect(body.Ω.zx).toBe((12 / body.M) * body.L.zx / (ww + dd));
            expect(body.Ω.xy).toBe((12 / body.M) * body.L.xy / (ww + hh));
        });
    });
});
