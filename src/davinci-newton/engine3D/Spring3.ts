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
import Force3 from './Force3';
import ForceLaw3 from './ForceLaw3';
import RigidBody3 from './RigidBody3';
import Vec3 from '../math/Vec3';
import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';

/**
 * 
 */
export class Spring3 extends AbstractSimObject implements ForceLaw3 {
    // private damping_ = 0;
    // private compressOnly_ = false;
    /**
     * 
     */
    public restLength = 1;
    /**
     * 
     */
    public stiffness = 1;
    /**
     * The attachment point to body1 in the local coordinates frame of body 1.
     */
    private attach1_ = Vec3.zero;
    /**
     * The attachment point to body2 in the local coordinates frame of body 2.
     */
    private attach2_ = Vec3.zero;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1: Force3;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2: Force3;
    /**
     * 
     */
    private readonly forces: Force3[] = [];
    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end1_ = new Vector3();
    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end2_ = new Vector3();
    /**
     * 
     */
    constructor(private body1_: RigidBody3, private body2_: RigidBody3) {
        super();

        this.F1 = new Force3(this.body1_);
        this.F1.locationCoordType = CoordType.WORLD;
        this.F1.vectorCoordType = CoordType.WORLD;

        this.F2 = new Force3(this.body2_);
        this.F2.locationCoordType = CoordType.WORLD;
        this.F2.vectorCoordType = CoordType.WORLD;

        this.forces = [this.F1, this.F2];
    }

    private computeBody1AttachPointInWorldCoords(x: VectorE3): void {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.localPointToWorldPoint(this.attach1_, x);
    }

    private computeBody2AttachPointInWorldCoords(x: VectorE3): void {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.localPointToWorldPoint(this.attach2_, x);
    }

    get attach1(): VectorE3 {
        return this.attach1_;
    }
    set attach1(attach1: VectorE3) {
        this.attach1_ = Vec3.fromVector(attach1);
    }

    get attach2(): VectorE3 {
        return this.attach2_;
    }
    set attach2(attach2: VectorE3) {
        this.attach2_ = Vec3.fromVector(attach2);
    }

    get end1(): Vec3 {
        this.computeBody1AttachPointInWorldCoords(this.end1_);
        return Vec3.fromVector(this.end1_);
    }

    get end2(): Vec3 {
        this.computeBody2AttachPointInWorldCoords(this.end2_);
        return Vec3.fromVector(this.end2_);
    }

    /**
     * 
     */
    updateForces(): Force3[] {

        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        const length = this.F1.location.distanceTo(this.F2.location);
        const sf = this.stiffness * (length - this.restLength) / length;

        this.F1.vector.copy(this.F2.location).sub(this.F1.location).mulByScalar(sf);
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
        const stretch = this.F2.location.distanceTo(this.F1.location) - this.restLength;
        return 0.5 * this.stiffness * stretch * stretch;
    }
}

export default Spring3;
