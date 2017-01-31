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
 * A rectangular block of constant density.
 */
export class Block3 extends RigidBody3 {
    /**
     * The dimension corresponding to the width.
     */
    private width_ = 1;
    /**
     * The dimension corresponding to the height.
     */
    private height_ = 1;
    /**
     * The dimension corresponding to the depth.
     */
    private depth_ = 1;
    /**
     * 
     */
    constructor(width = 1, height = 1, depth = 1) {
        super();
        this.width_ = width;
        this.height_ = height;
        this.depth_ = depth;
        this.updateInertiaTensor();
    }

    get width(): number {
        return this.width_;
    }
    set width(width: number) {
        if (this.width !== width) {
            this.width_ = width;
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

    get depth(): number {
        return this.depth_;
    }
    set depth(depth: number) {
        if (this.depth !== depth) {
            this.depth_ = depth;
            this.updateInertiaTensor();
        }
    }

    public updateAngularVelocity(): void {
        const w = this.width_;
        const h = this.height_;
        const d = this.depth_;
        const ww = w * w;
        const hh = h * h;
        const dd = d * d;
        const k = 12 / this.M;
        this.Ω.yz = k * this.L.yz / (hh + dd);
        this.Ω.zx = k * this.L.zx / (ww + dd);
        this.Ω.xy = k * this.L.xy / (ww + hh);
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const w = this.width_;
        const h = this.height_;
        const d = this.depth_;
        const ww = w * w;
        const hh = h * h;
        const dd = d * d;
        const s = this.M / 12;
        const I = Matrix3.zero();
        I.setElement(0, 0, s * (hh + dd));
        I.setElement(1, 1, s * (dd + ww));
        I.setElement(2, 2, s * (ww + hh));
        this.I = I;
    }
}

export default Block3;
