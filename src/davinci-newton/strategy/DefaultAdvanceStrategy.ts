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
import MemoList from '../runner/MemoList';
import Simulation from '../core/Simulation';

export class DefaultAdvanceStrategy implements AdvanceStrategy {
    private timeStep_ = 0.025;
    constructor(private sim_: Simulation, private odeSolver_: DiffEqSolver) {
        // Do nothing yet.
    }
    advance(timeStep: number, memoList?: MemoList) {
        this.sim_.simList.removeTemporary(this.sim_.getTime());
        const err = this.odeSolver_.step(timeStep);
        if (err != null) {
            throw new Error(`error during advance ${err}`);
        }
        this.sim_.modifyObjects();
        if (memoList !== undefined) {
            memoList.memorize();
        }
    }
    getTime(): number {
        return this.sim_.getTime();
    }
    getTimeStep(): number {
        return this.timeStep_;
    }
}

export default DefaultAdvanceStrategy;
