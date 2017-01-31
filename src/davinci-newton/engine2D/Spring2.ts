// Copyright 2017 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
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

import AbstractSimObject from '../objects/AbstractSimObject';
import CoordType from '../model/CoordType';
import Force2 from './Force2';
import ForceLaw2 from './ForceLaw2';
import RigidBody2 from './RigidBody2';
import Vec2 from '../math/Vec2';
import VectorE2 from '../math/VectorE2';
import Vector2 from '../math/Vector2';

/**
 * 
 */
export class Spring2 extends AbstractSimObject implements ForceLaw2 {
    /**
     * 
     */
    // private damping_ = 0;
    // private compressOnly_ = false;
    private restLength_ = 1;
    private stiffness_ = 1;
    /**
     * The attachment point to body1 in the local coordinates frame of body 1.
     */
    private attach1_ = Vec2.ORIGIN;
    /**
     * The attachment point to body2 in the local coordinates frame of body 2.
     */
    private attach2_ = Vec2.ORIGIN;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1: Force2;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2: Force2;
    /**
     * 
     */
    private readonly forces: Force2[] = [];
    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end1_ = new Vector2();
    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end2_ = new Vector2();
    /**
     * 
     */
    constructor(private body1_: RigidBody2, private body2_: RigidBody2) {
        super();

        this.F1 = new Force2(this.body1_);
        this.F1.locationCoordType = CoordType.WORLD;
        this.F1.vectorCoordType = CoordType.WORLD;

        this.F2 = new Force2(this.body2_);
        this.F2.locationCoordType = CoordType.WORLD;
        this.F2.vectorCoordType = CoordType.WORLD;

        this.forces = [this.F1, this.F2];
    }

    private computeBody1AttachPointInWorldCoords(x: VectorE2): void {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.localPointToWorldPoint(this.attach1_, x);
    }

    private computeBody2AttachPointInWorldCoords(x: VectorE2): void {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.localPointToWorldPoint(this.attach2_, x);
    }

    get attach1(): VectorE2 {
        return this.attach1_;
    }
    set attach1(attach1: VectorE2) {
        this.attach1_ = Vec2.fromVector(attach1);
    }

    get attach2(): VectorE2 {
        return this.attach2_;
    }
    set attach2(attach2: VectorE2) {
        this.attach2_ = Vec2.fromVector(attach2);
    }

    get end1(): Vec2 {
        this.computeBody1AttachPointInWorldCoords(this.end1_);
        return Vec2.fromVector(this.end1_);
    }

    get end2(): Vec2 {
        this.computeBody2AttachPointInWorldCoords(this.end2_);
        return Vec2.fromVector(this.end2_);
    }

    /**
     * 
     */
    updateForces(): Force2[] {

        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        const length = this.F1.location.distanceTo(this.F2.location);
        const sf = this.stiffness_ * (length - this.restLength_) / length;

        this.F1.vector.copy(this.F2.location).subtract(this.F1.location).mulByScalar(sf);
        this.F2.vector.copy(this.F1.vector).neg();

        /*
        if (this.damping_ !== 0) {
            // damping does not happen for 'compress only' when uncompressed
            if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                const v1 = this.body1_.worldVelocityOfBodyPoint(this.attach1_);
                const v2 = this.body2_.worldVelocityOfBodyPoint(this.attach2_);
                const df = v1.subtract(v2).multiply(-this.damping_);
                f12 = f12.add(df);
            }
        }
        */
        return this.forces;
    }

    /**
     * 
     */
    disconnect(): void {
        // Does nothing
    }

    /**
     * 
     */
    potentialEnergy(): number {
        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        // spring potential energy = 0.5 * stiffness * (stretch ^ 2)
        const stretch = this.F2.location.distanceTo(this.F1.location) - this.restLength_;
        return 0.5 * this.stiffness_ * stretch * stretch;
    }
}

export default Spring2;
