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

import AdvanceStrategy from '../runner/AdvanceStrategy';
import DiffEqSolver from '../core/DiffEqSolver';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import Simulation from '../core/Simulation';
import Unit from '../math/Unit';

/**
 * 
 */
export class DefaultAdvanceStrategy implements AdvanceStrategy {
    /**
     * 
     */
    private simulation_: Simulation;
    /**
     * 
     */
    private solver_: DiffEqSolver;
    /**
     * 
     */
    constructor(simulation: Simulation, solver: DiffEqSolver) {
        this.simulation_ = mustBeNonNullObject('simulation', simulation);
        this.solver_ = mustBeNonNullObject('solver', solver);
    }

    /**
     * 
     */
    advance(stepSize: number, uomStep?: Unit): void {
        this.simulation_.prolog();
        this.solver_.step(stepSize, uomStep);
        this.simulation_.epilog();
    }
}

export default DefaultAdvanceStrategy;
