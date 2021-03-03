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

import { Geometric2 } from '../math/Geometric2';
import { Matrix3 } from '../math/Matrix3';
import { Unit } from '../math/Unit';
import { Euclidean2 } from './Euclidean2';
import { RigidBody } from '../core/RigidBody';

/**
 * A rectangular block of constant surface density.
 */
export class Block2 extends RigidBody<Geometric2> {
    /**
     * The dimension corresponding to the width.
     */
    private readonly width_: Geometric2;
    private widthLock_: number;

    /**
     * The dimension corresponding to the height.
     */
    private readonly height_: Geometric2;
    private heightLock_: number;

    /**
     * 
     */
    constructor(width = Geometric2.one, height = Geometric2.one) {
        super(new Euclidean2());

        this.width_ = Geometric2.copy(width);
        this.widthLock_ = this.width_.lock();

        this.height_ = Geometric2.copy(height);
        this.heightLock_ = this.height_.lock();

        this.updateInertiaTensor();
    }

    get width(): Geometric2 {
        return this.width_;
    }
    set width(width: Geometric2) {
        this.width_.unlock(this.widthLock_);
        this.width_.copy(width);
        this.widthLock_ = this.width_.lock();
        this.updateInertiaTensor();
    }

    get height(): Geometric2 {
        return this.height_;
    }
    set height(height: Geometric2) {
        this.height_.unlock(this.heightLock_);
        this.height_.copy(height);
        this.heightLock_ = this.height_.lock();
        this.updateInertiaTensor();
    }

    /**
     * The angular velocity is updated from the angular momentum.
     */
    public updateAngularVelocity(): void {
        const w = this.width_;
        const h = this.height_;
        const ww = w.a * w.a;
        const hh = h.a * h.a;
        const k = 12 / this.M.a;
        this.Ω.xy = k * this.L.xy / (ww + hh);
        this.Ω.uom = Unit.div(Unit.div(this.L.uom, this.M.uom), Unit.mul(w.uom, w.uom));
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const w = this.width_;
        const h = this.height_;
        const ww = w.a * w.a;
        const hh = h.a * h.a;
        const s = this.M.a / 12;
        const I = Matrix3.zero();
        I.setElement(0, 0, s * hh);
        I.setElement(1, 1, s * ww);
        I.setElement(2, 2, s * (ww + hh));
        I.uom = Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom));
        this.I = I;
    }
}
