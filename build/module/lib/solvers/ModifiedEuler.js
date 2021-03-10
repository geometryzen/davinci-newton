// Copyright 2017-2021 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
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
import zeroArray from '../util/zeroArray';
/**
 *
 */
var ModifiedEuler = /** @class */ (function () {
    /**
     *
     */
    function ModifiedEuler(sim_) {
        this.sim_ = sim_;
        this.inp_ = [];
        this.k1_ = [];
        this.k2_ = [];
    }
    ModifiedEuler.prototype.step = function (stepSize, uomStep) {
        var vars = this.sim_.getState();
        var N = vars.length;
        if (this.inp_.length !== N) {
            this.inp_ = new Array(N);
            this.k1_ = new Array(N);
            this.k2_ = new Array(N);
        }
        var inp = this.inp_;
        var k1 = this.k1_;
        var k2 = this.k2_;
        // evaluate at time t
        for (var i = 0; i < N; i++) {
            inp[i] = vars[i];
        }
        zeroArray(k1);
        this.sim_.evaluate(inp, k1, 0, uomStep);
        // evaluate at time t+stepSize
        for (var i = 0; i < N; i++) {
            inp[i] = vars[i] + k1[i] * stepSize;
        }
        zeroArray(k2);
        this.sim_.evaluate(inp, k2, stepSize, uomStep);
        for (var i = 0; i < N; i++) {
            vars[i] += (k1[i] + k2[i]) * stepSize / 2;
        }
        this.sim_.setState(vars);
    };
    return ModifiedEuler;
}());
export { ModifiedEuler };
