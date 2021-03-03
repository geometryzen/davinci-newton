// Copyright 2017-2021 David Holmes.  All Rights Reserved.
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

import { Bivector2 } from '../math/Bivector2';
import { BivectorE2 } from '../math/BivectorE2';
import { Geometric2 } from '../math/Geometric2';
import { VectorE2 } from '../math/VectorE2';
import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody2 } from './ForceBody2';

/**
 * 
 */
export class Force2 extends AbstractSimObject {
    /**
     * 
     */
    public readonly location = Geometric2.vector(0, 0);
    /**
     * 
     */
    public locationCoordType: CoordType;
    /**
     * The force vector, may be in local or world coordinates.
     */
    public readonly vector = Geometric2.vector(0, 0);
    /**
     * 
     */
    public vectorCoordType: CoordType;

    /**
     * Scratch variable for computing position (world coordinates).
     */
    private readonly position_ = Geometric2.vector(0, 0);
    // private positionLock_ = this.position_.lock();
    /**
     * Scratch variable for computing force (world coordinates).
     */
    private readonly force_ = Geometric2.vector(0, 0);
    // private forceLock_ = this.force_.lock();
    /**
     * Scratch variable for computing torque (world coordinates).
     */
    private readonly torque_ = new Bivector2(0);

    /**
     * 
     */
    constructor(private body_: ForceBody2) {
        super();
    }

    /**
     * 
     */
    getBody(): ForceBody2 {
        return this.body_;
    }

    /**
     * Computes the force being applied (vector).
     */
    computeForce(force: VectorE2): void {
        switch (this.vectorCoordType) {
            case LOCAL: {
                this.force_.copyVector(this.vector);
                this.force_.rotate(this.body_.R);
                this.force_.writeVector(force);
                break;
            }
            case WORLD: {
                this.force_.copyVector(this.vector);
                this.force_.writeVector(force);
                break;
            }
        }
    }

    get F(): Geometric2 {
        this.computeForce(this.force_);
        return this.force_;
    }

    get x(): Geometric2 {
        this.computePosition(this.position_);
        return this.position_;
    }

    /**
     * Computes the point of application of the force in world coordinates.
     */
    computePosition(position: VectorE2): void {
        switch (this.locationCoordType) {
            case LOCAL: {
                this.position_.copyVector(this.location);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero. 
                this.position_.rotate(this.body_.R);
                this.position_.addVector(this.body_.X);
                this.position_.writeVector(position);
                break;
            }
            case WORLD: {
                this.position_.copyVector(this.location);
                this.position_.writeVector(position);
                break;
            }
        }
    }

    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Γ = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Γ = r ^ F because r = x - X
     */
    computeTorque(torque: BivectorE2): void {
        this.computePosition(this.position_);
        this.computeForce(this.force_);
        this.torque_.wedge(this.position_.subVector(this.body_.X), this.force_);
        this.torque_.write(torque);
    }
}
