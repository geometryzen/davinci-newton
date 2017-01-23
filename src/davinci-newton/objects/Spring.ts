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

import AbstractSimObject from './AbstractSimObject';
import CoordType from '../model/CoordType';
import Force from '../model/Force';
import ForceLaw from '../model/ForceLaw';
import RigidBody from '../engine3D/RigidBody';
import Vector from '../math/Vector';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class Spring extends AbstractSimObject implements ForceLaw {
    /**
     * 
     */
    // private damping_ = 0;
    // private compressOnly_ = false;
    private restLength_ = 1;
    private stiffness_ = 1;
    private attach1_: VectorE3 = Vector.ORIGIN;
    private attach2_: VectorE3 = Vector.ORIGIN;
    private readonly F12: Force;
    private readonly F21: Force;
    private readonly forces: Force[] = [];
    /**
     * 
     */
    constructor(private body1_: RigidBody, private body2_: RigidBody) {
        super();

        this.F12 = new Force(this.body1_);
        this.F12.locationCoordType = CoordType.WORLD;
        this.F12.vectorCoordType = CoordType.WORLD;

        this.F21 = new Force(this.body2_);
        this.F21.locationCoordType = CoordType.WORLD;
        this.F21.vectorCoordType = CoordType.WORLD;

        this.forces = [this.F12, this.F21];
    }

    private computeBody1AttachPointInWorldCoords(x: VectorE3): void {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.bodyToWorld(this.attach1_, x);
    }

    private computeBody2AttachPointInWorldCoords(x: VectorE3): void {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.bodyToWorld(this.attach2_, x);
    }

    /**
     * 
     */
    calculateForces(): Force[] {

        this.computeBody1AttachPointInWorldCoords(this.F12.location);
        this.computeBody2AttachPointInWorldCoords(this.F21.location);

        const length = this.F12.location.distanceTo(this.F21.location);
        const sf = this.stiffness_ * (length - this.restLength_) / length;

        this.F12.vector.copy(this.F21.location).subtract(this.F12.location).mulByScalar(sf);
        this.F21.vector.copy(this.F12.vector).neg();

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
    getPotentialEnergy(): number {
        // spring potential energy = 0.5 * stiffness * (stretch ^ 2)
        const stretch = this.F21.location.distanceTo(this.F12.location) - this.restLength_;
        return 0.5 * this.stiffness_ * stretch * stretch;
    }
}

export default Spring;
