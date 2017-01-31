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

import Matrix2 from '../math/Matrix2';
import RigidBody2 from './RigidBody2';

/**
 * A solid sphere of constant density.
 */
export class Sphere2 extends RigidBody2 {
    /**
     * The dimension corresponding to the width.
     */
    private radius_ = 1;
    /**
     * 
     */
    constructor(radius = 1) {
        super();
        this.radius_ = radius;
        this.updateInertiaTensor();
    }

    get radius(): number {
        return this.radius_;
    }
    set radius(radius: number) {
        if (this.radius !== radius) {
            this.radius_ = radius;
            this.updateInertiaTensor();
        }
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const rr = r * r;
        const s = 2 * this.M * rr / 5;
        const I = Matrix2.zero();
        I.setElement(0, 0, s);
        I.setElement(1, 1, s);
        I.setElement(2, 2, s);
        this.I = I;
    }
}

export default Sphere2;
