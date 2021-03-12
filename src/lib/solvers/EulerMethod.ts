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
import { DiffEqSolver } from '../core/DiffEqSolver';
import { DiffEqSolverSystem } from '../core/DiffEqSolverSystem';
import { Unit } from '../math/Unit';
import { zeroArray } from '../util/zeroArray';

/**
 * The Euler algorithm uses the rate of change values at the
 * beginning of the step in order to perform the integration.
 */
export class EulerMethod implements DiffEqSolver {
    private inp_: number[] = [];
    private k1_: number[] = [];
    /**
     * 
     */
    constructor(private readonly system: DiffEqSolverSystem) {
        mustBeNonNullObject('system', system);
    }
    step(stepSize: number, uomStep?: Unit): void {
        const vars = this.system.getState();
        const N = vars.length;
        if (this.inp_.length !== N) {
            this.inp_ = new Array(N);
            this.k1_ = new Array(N);
        }
        const inp = this.inp_;
        const k1 = this.k1_;
        for (let i = 0; i < N; i++) {
            // set up input to diffeqs (note: this protects vars from being changed)
            inp[i] = vars[i];
        }
        zeroArray(k1);
        this.system.evaluate(inp, k1, 0, uomStep);
        for (let i = 0; i < N; i++) {
            vars[i] += k1[i] * stepSize;
        }
        this.system.setState(vars);
    }
}
