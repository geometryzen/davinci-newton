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
import GeometricE3 from '../math/GeometricE3';
import Matrix3 from '../math/Matrix3';
import RigidBody3 from './RigidBody3';
import Unit from '../math/Unit';

/**
 * A solid cylinder of uniform density.
 */
export class Cylinder3 extends RigidBody3 {
    /**
     * The dimension corresponding to the radius.
     */
    private radius_ = Geometric3.one();
    /**
     * The dimension corresponding to the height.
     */
    private height_ = Geometric3.one();
    /**
     * 
     */
    constructor(radius: GeometricE3 = Geometric3.one(), height: GeometricE3 = Geometric3.one()) {
        super();
        this.radius_.copy(radius);
        this.height_.copy(height);
        this.updateInertiaTensor();
    }

    get radius(): Geometric3 {
        return this.radius_;
    }
    set radius(radius: Geometric3) {
        this.radius_ = radius;
        this.updateInertiaTensor();
    }

    get height(): Geometric3 {
        return this.height_;
    }
    set height(height: Geometric3) {
        this.height_ = height;
        this.updateInertiaTensor();
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const h = this.height_;
        const rr = r.a * r.a;
        const hh = h.a * h.a;
        const Irr = this.M.a * (3 * rr + hh) / 12;
        const Ihh = this.M.a * rr / 2;
        const I = Matrix3.zero();
        I.setElement(0, 0, Irr);
        I.setElement(1, 1, Ihh);
        I.setElement(2, 2, Irr);
        I.uom = Unit.mul(this.M.uom, Unit.mul(r.uom, h.uom));
        this.I = I;
    }
}

export default Cylinder3;
