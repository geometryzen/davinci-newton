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
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Unit } from '../math/Unit';
import { zeroArray } from '../util/zeroArray';
/**
 * The modified Euler algorithm uses the rate of change values at both
 * the beginning of the step and at the end, taking an average in order
 * to perform the integration.
 * @hidden
 */
var ModifiedEuler = /** @class */ (function () {
    /**
     *
     */
    function ModifiedEuler(system) {
        this.system = system;
        this.$invals = [];
        this.$inuoms = [];
        this.$k1vals = [];
        this.$k1uoms = [];
        this.$k2vals = [];
        this.$k2uoms = [];
        mustBeNonNullObject('system', system);
    }
    ModifiedEuler.prototype.step = function (stepSize, uomStep) {
        var stateVals = this.system.getState();
        var stateUoms = this.system.getUnits();
        var N = stateVals.length;
        if (this.$invals.length !== N) {
            this.$invals = new Array(N);
            this.$inuoms = new Array(N);
            this.$k1vals = new Array(N);
            this.$k1uoms = new Array(N);
            this.$k2vals = new Array(N);
            this.$k2uoms = new Array(N);
        }
        var invals = this.$invals;
        var inuoms = this.$inuoms;
        var k1vals = this.$k1vals;
        var k1uoms = this.$k1uoms;
        var k2vals = this.$k2vals;
        var k2uoms = this.$k2uoms;
        // evaluate at time t
        for (var i = 0; i < N; i++) {
            invals[i] = stateVals[i];
            inuoms[i] = stateUoms[i];
        }
        zeroArray(k1vals);
        this.system.evaluate(invals, inuoms, k1vals, k1uoms, 0, uomStep);
        // evaluate at time t+stepSize
        for (var i = 0; i < N; i++) {
            if (stateVals[i] !== 0) {
                inuoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k1uoms[i], uomStep));
            }
            else {
                inuoms[i] = Unit.mul(k1uoms[i], uomStep);
            }
            invals[i] = stateVals[i] + k1vals[i] * stepSize;
        }
        zeroArray(k2vals);
        this.system.evaluate(invals, inuoms, k2vals, k2uoms, stepSize, uomStep);
        for (var i = 0; i < N; i++) {
            if (stateVals[i] !== 0) {
                if (k2vals[i] !== 0) {
                    stateUoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k2uoms[i], uomStep));
                }
                else {
                    // Do nothing.
                }
            }
            else {
                stateUoms[i] = Unit.mul(k2uoms[i], uomStep);
            }
            stateVals[i] += (k1vals[i] + k2vals[i]) * stepSize / 2;
        }
        this.system.setState(stateVals);
        this.system.setUnits(stateUoms);
    };
    return ModifiedEuler;
}());
export { ModifiedEuler };
