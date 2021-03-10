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
exports.DefaultAdvanceStrategy = void 0;
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
/**
 *
 */
var DefaultAdvanceStrategy = /** @class */ (function () {
    /**
     *
     */
    function DefaultAdvanceStrategy(simulation, solver) {
        this.simulation_ = mustBeNonNullObject_1.default('simulation', simulation);
        this.solver_ = mustBeNonNullObject_1.default('solver', solver);
    }
    /**
     * 1.
     * 2. The solver integrates the derivatives from the simulation.
     * 3. Compute system variables such as energies, linear momentum, and angular momentum.
     */
    DefaultAdvanceStrategy.prototype.advance = function (stepSize, uomStep) {
        this.simulation_.prolog();
        this.solver_.step(stepSize, uomStep);
        this.simulation_.epilog();
    };
    return DefaultAdvanceStrategy;
}());
exports.DefaultAdvanceStrategy = DefaultAdvanceStrategy;
