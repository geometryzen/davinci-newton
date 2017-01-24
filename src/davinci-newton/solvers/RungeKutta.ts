// Copyright 2017 David Holmes.  All Rights Reserved.
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

import DiffEqSolver from '../core/DiffEqSolver';
import Simulation from '../core/Simulation';
import zeroArray from '../util/zeroArray';

export class RungeKutta implements DiffEqSolver {
    private inp_: number[] = [];
    private k1_: number[] = [];
    private k2_: number[] = [];
    private k3_: number[] = [];
    private k4_: number[] = [];
    constructor(private ode_: Simulation) {

    }
    step(stepSize: number): void {
        const varsList = this.ode_.varsList;
        const vars = varsList.getValues();
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
        this.ode_.evaluate(inp, k1, 0);
        // evaluate at time t+stepSize/2
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i] + k1[i] * stepSize / 2;
        }
        zeroArray(k2);
        this.ode_.evaluate(inp, k2, stepSize / 2);
        // evaluate at time t+stepSize/2
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i] + k2[i] * stepSize / 2;
        }
        zeroArray(k3);
        this.ode_.evaluate(inp, k3, stepSize / 2);
        // evaluate at time t+stepSize
        for (let i = 0; i < N; i++) {
            inp[i] = vars[i] + k3[i] * stepSize;
        }
        zeroArray(k4);
        this.ode_.evaluate(inp, k4, stepSize);
        for (let i = 0; i < N; i++) {
            vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
        }
        varsList.setValues(vars, true);
    }
}

export default RungeKutta;
