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
 * <p>
 * A differential equation solver that achieves O(h<sup>3</sup>) Local Truncation Error (LTE),
 * where h is the step size.
 * </p>
 */
export class RungeKutta implements DiffEqSolver {
    private inp_: number[] = [];
    private k1_: number[] = [];
    private k2_: number[] = [];
    private k3_: number[] = [];
    private k4_: number[] = [];

    /**
     * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
     * @param system The model that provides the system state and computes rates of change.
     */
    constructor(private readonly system: DiffEqSolverSystem) {
        mustBeNonNullObject('system', system);
    }

    /**
     * 
     */
    step(stepSize: number, uomStep?: Unit): void {
        const vars = this.system.getState();
        const N = vars.length;
        if (this.inp_.length < N) {
            this.inp_ = new Array(N);
            this.k1_ = new Array(N);
            this.k2_ = new Array(N);
            this.k3_ = new Array(N);
            this.k4_ = new Array(N);
        }
        const inp = this.inp_;
        const k1 = this.k1_;
        const k2 = this.k2_;
        const k3 = this.k3_;
        const k4 = this.k4_;

        // evaluate at time t
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i];
        }
        zeroArray(k1);
        this.system.evaluate(inp, k1, 0, uomStep);

        // evaluate at time t + stepSize / 2
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i] + k1[i] * stepSize / 2;
        }
        zeroArray(k2);
        this.system.evaluate(inp, k2, stepSize / 2, uomStep);

        // evaluate at time t + stepSize / 2
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i] + k2[i] * stepSize / 2;
        }
        zeroArray(k3);
        this.system.evaluate(inp, k3, stepSize / 2, uomStep);

        // evaluate at time t + stepSize
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i] + k3[i] * stepSize;
        }
        zeroArray(k4);
        this.system.evaluate(inp, k4, stepSize, uomStep);

        for (let i = 0; i < N; i++) {
            vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
        }
        this.system.setState(vars);
    }
}
