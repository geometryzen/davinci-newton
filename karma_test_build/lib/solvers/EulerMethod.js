"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EulerMethod = void 0;
var zeroArray_1 = require("../util/zeroArray");
/**
 *
 */
var EulerMethod = /** @class */ (function () {
    /**
     *
     */
    function EulerMethod(sim_) {
        this.sim_ = sim_;
        this.inp_ = [];
        this.k1_ = [];
    }
    EulerMethod.prototype.step = function (stepSize, uomStep) {
        var vars = this.sim_.getState();
        var N = vars.length;
        if (this.inp_.length !== N) {
            this.inp_ = new Array(N);
            this.k1_ = new Array(N);
        }
        var inp = this.inp_;
        var k1 = this.k1_;
        for (var i = 0; i < N; i++) {
            // set up input to diffeqs (note: this protects vars from being changed)
            inp[i] = vars[i];
        }
        zeroArray_1.default(k1);
        this.sim_.evaluate(inp, k1, 0, uomStep);
        for (var i = 0; i < N; i++) {
            vars[i] += k1[i] * stepSize;
        }
        this.sim_.setState(vars);
    };
    return EulerMethod;
}());
exports.EulerMethod = EulerMethod;
