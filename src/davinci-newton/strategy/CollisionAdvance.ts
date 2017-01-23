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
import RigidBodySim from '../engine3D/RigidBodySim';

export class CollisionAdvance implements AdvanceStrategy {
    constructor(private sim_: RigidBodySim, private odeSolver_: DiffEqSolver) {
        // Do nothing yet.
    }
    advance(timeStep: number, memoList?: MemoList) {
        throw new Error("TODO: advance");
    }
    getTime(): number {
        return 0;
    }
    getTimeStep(): number {
        return 0;
    }
}

export default CollisionAdvance;
