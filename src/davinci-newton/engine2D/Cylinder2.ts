// Copyright 2017-2021 David Holmes.  All Rights Reserved.
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

import { Metric } from '../core/Metric';
import { Geometric2 } from '../math/Geometric2';
import { Matrix3 } from '../math/Matrix3';
import { Unit } from '../math/Unit';
import { RigidBody } from '../core/RigidBody';

/**
 * A solid cylinder of uniform density.
 */
export class Cylinder2 extends RigidBody<Geometric2> {

    /**
     * The dimension corresponding to the radius.
     */
    private readonly radius_: Geometric2;
    private radiusLock_: number;

    /**
     * The dimension corresponding to the height.
     */
    private readonly height_: Geometric2;
    private heightLock_: number;

    /**
     * 
     */
    constructor(radius = Geometric2.one, height = Geometric2.one, measure: Metric<Geometric2>) {
        super(measure);

        this.radius_ = Geometric2.copy(radius);
        this.radiusLock_ = this.radius_.lock();

        this.height_ = Geometric2.copy(height);
        this.heightLock_ = this.height_.lock();

        this.updateInertiaTensor();
    }

    get radius(): Geometric2 {
        return this.radius_;
    }
    set radius(radius: Geometric2) {
        this.radius_.unlock(this.radiusLock_);
        this.radius_.copy(radius);
        this.radiusLock_ = this.radius_.lock();
        this.updateInertiaTensor();
    }

    get height(): Geometric2 {
        return this.height_;
    }
    set height(height: Geometric2) {
        this.height.unlock(this.heightLock_);
        this.height_.copy(height);
        this.heightLock_ = this.height_.lock();
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
