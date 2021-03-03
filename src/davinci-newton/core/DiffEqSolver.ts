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

import { Unit } from '../math/Unit';

/**
 * <p>
 * The solver integrates the derivatives of the kinematic variables (usually X, R, P, and J).
 * The solver can ask the simulation for derivatives at one or more system configurations
 * between the current configuration, Y(t), and the configuration Y(t + stepSize * uomStep), where
 * Y(t) is the state "vector" for the system at time t.
 * </p>
 * <p>
 * Different solvers may manage the Local Truncation Error (LTE) in different ways.
 * </p>  
 */
export interface DiffEqSolver {
    step(stepSize: number, uomStep: Unit): void;
}
