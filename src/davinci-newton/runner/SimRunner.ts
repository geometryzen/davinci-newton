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

import AdvanceStrategy from './AdvanceStrategy';
import Clock from './Clock';

/**
 * 
 */
export class SimRunner {

    /**
     * 
     */
    private timeStep_: number;

    /**
     * 
     */

    private clock_ = new Clock();

    /**
     * 
     */
    constructor(private advanceStrategy_: AdvanceStrategy, name?: string) {
        this.timeStep_ = advanceStrategy_.getTimeStep();
    }

    /**
     * 
     */
    getClock(): Clock {
        return this.clock_;
    }

    private advanceToTargetTime(strategy: AdvanceStrategy, targetTime: number) {
        let simTime = strategy.getTime();
        while (simTime < targetTime) {
            // console.log(`simTime => ${simTime}`);
            // console.log(`targetTime => ${targetTime}`);
            // console.log(`timeStep => ${this.timeStep_}`);
            // the AdvanceStrategy is what actually calls `memorize`
            strategy.advance(this.timeStep_, this);
            // Prevent infinite loop when time doesn't advance.
            const lastSimTime = simTime;
            simTime = strategy.getTime();
            if (simTime - lastSimTime <= 1e-15) {
                throw new Error('SimRunner time did not advance');
            }
        }
    }

    /**
     * 
     */
    update(): void {
        let clockTime = this.clock_.getTime();
        const simTime = this.advanceStrategy_.getTime();
        // If clockTime is VERY far ahead or behind of simTime, assume simTime was
        // intentionally modified. Match clock to simTime, but just a little ahead
        // by a timeStep so that the simulation advances.
        if (clockTime > simTime + 1 || clockTime < simTime - 1) {
            const t = simTime + this.timeStep_;
            this.clock_.setTime(t);
            this.clock_.setRealTime(t);
            clockTime = t;
        }
        const startTime = clockTime;
        // If sim reaches almost current clock time, that is good enough.
        const targetTime = startTime - this.timeStep_ / 10;
        this.advanceToTargetTime(this.advanceStrategy_, targetTime);
    }

    /**
     * 
     */
    memorize(): void {
        // Do nothing yet.
    }
}

export default SimRunner;
