// Copyright 2017 David Holmes.  All Rights Reserved.
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

import Geometric3 from '../math/Geometric3';
import RigidBody3 from './RigidBody3';

/**
 * An object with no internal structure.
 */
export class Particle3 extends RigidBody3 {

    /**
     * @param M The mass of the particle.
     * @param Q The electric charge of the particle.
     */
    constructor(M = Geometric3.one, Q = Geometric3.zero) {
        super();
        this.M = M;
        this.Q = Q;
    }

    /**
     *
     */
    public updateAngularVelocity(): void {
        // We are extrapolating the classical case!
        this.Ω.copyScalar(0, void 0);
        this.Ω.quaditude(true);
        this.Ω.mulByScalar(this.M.a, this.M.uom);
        this.Ω.mulByNumber(2 / 5);
        this.Ω.inv();
        this.Ω.mulByBivector(this.L);
    }

    /**
     * The inertia tensor should always be zero.
     */
    protected updateInertiaTensor(): void {
        // Do nothing yet.
    }
}

export default Particle3;
