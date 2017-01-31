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

import Matrix3 from '../math/Matrix3';
import RigidBody3 from './RigidBody3';

/**
 * A solid sphere of constant density.
 */
export class Sphere3 extends RigidBody3 {
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

    public updateAngularVelocity(): void {
        const r = this.radius_;
        const s = 2 * this.M * r * r / 5;
        this.Ω.yz = this.L.yz / s;
        this.Ω.zx = this.L.zx / s;
        this.Ω.xy = this.L.xy / s;
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const s = 2 * this.M * r * r / 5;
        const I = Matrix3.zero();
        I.setElement(0, 0, s);
        I.setElement(1, 1, s);
        I.setElement(2, 2, s);
        this.I = I;
    }
}

export default Sphere3;