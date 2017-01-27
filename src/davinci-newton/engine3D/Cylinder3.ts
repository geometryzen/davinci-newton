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
 * A solid cylinder of uniform density.
 */
export class Cylinder3 extends RigidBody3 {
    /**
     * The dimension corresponding to the radius.
     */
    private radius_ = 1;
    /**
     * The dimension corresponding to the height.
     */
    private height_ = 1;
    /**
     * 
     */
    constructor(radius = 1, height = 1) {
        super();
        this.radius_ = radius;
        this.height_ = height;
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

    get height(): number {
        return this.height_;
    }
    set height(height: number) {
        if (this.height !== height) {
            this.height_ = height;
            this.updateInertiaTensor();
        }
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const h = this.height_;
        const rr = r * r;
        const hh = h * h;
        const Irr = this.M * (3 * rr + hh) / 12;
        const Ihh = this.M * rr / 2;
        const I = Matrix3.zero();
        I.setElement(0, 0, Irr);
        I.setElement(1, 1, Ihh);
        I.setElement(2, 2, Irr);
        this.I = I;
    }
}

export default Cylinder3;
