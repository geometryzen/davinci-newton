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
 * A rectangular block of constant density.
 */
export class Block2 extends RigidBody2 {
    /**
     * The dimension corresponding to the width.
     */
    private width_ = 1;
    /**
     * The dimension corresponding to the height.
     */
    private height_ = 1;
    /**
     * 
     */
    constructor(width = 1, height = 1) {
        super();
        this.width_ = width;
        this.height_ = height;
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

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    protected updateInertiaTensor(): void {
        const x = this.width_;
        const y = this.height_;
        const xx = x * x;
        const yy = y * y;
        const s = this.M / 12;
        const I = Matrix2.zero();
        I.setElement(0, 0, s * (yy));
        I.setElement(1, 1, s * (xx));
        this.I = I;
    }
}

export default Block2;
