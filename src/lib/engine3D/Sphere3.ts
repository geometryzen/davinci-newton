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

import { RigidBody } from '../core/RigidBody';
import { Geometric3 } from '../math/Geometric3';
import { Matrix3 } from '../math/Matrix3';
import { Unit } from '../math/Unit';
import { Euclidean3 } from './Euclidean3';

/**
 * A solid sphere of constant density.
 */
export class Sphere3 extends RigidBody<Geometric3> {

    /**
     * The dimension corresponding to the width.
     */
    private readonly radius_: Geometric3;
    private radiusLock_: number;

    /**
     * 
     */
    constructor(radius = Geometric3.one) {
        super(new Euclidean3());
        this.radius_ = Geometric3.fromScalar(radius);
        this.radiusLock_ = this.radius_.lock();
        this.updateInertiaTensor();
    }

    get radius(): Geometric3 {
        return this.radius_;
    }
    set radius(radius: Geometric3) {
        this.radius_.unlock(this.radiusLock_);
        this.radius_.copyScalar(radius.a, radius.uom);
        this.radiusLock_ = this.radius_.lock();
        this.updateInertiaTensor();
    }

    /**
     * L(Ω) = (2 M r r / 5) Ω => Ω = (5 / 2 M r r) L(Ω)
     */
    public updateAngularVelocity(): void {
        this.Ω.copyScalar(this.radius_.a, this.radius_.uom);
        this.Ω.quaditude(true);
        this.Ω.mulByScalar(this.M.a, this.M.uom);
        this.Ω.mulByNumber(2 / 5);
        this.Ω.inv();
        this.Ω.mulByBivector(this.L);
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const s = 2 * this.M.a * r.a * r.a / 5;
        const I = Matrix3.zero();
        I.setElement(0, 0, s);
        I.setElement(1, 1, s);
        I.setElement(2, 2, s);
        I.uom = Unit.mul(this.M.uom, Unit.mul(r.uom, r.uom));
        this.I = I;
    }
}
