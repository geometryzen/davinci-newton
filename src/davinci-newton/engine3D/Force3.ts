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
import Bivector3 from '../math/Bivector3';
import BivectorE3 from '../math/BivectorE3';
import CoordType from '../model/CoordType';
import ForceBody3 from './ForceBody3';
import Geometric3 from '../math/Geometric3';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class Force3 extends AbstractSimObject {
    /**
     * 
     */
    public readonly location = Geometric3.vector(0, 0, 0);
    /**
     * 
     */
    public locationCoordType: CoordType;
    /**
     * The force vector, may be in local or world coordinates.
     */
    public readonly vector = Geometric3.vector(0, 0, 0);
    /**
     * 
     */
    public vectorCoordType: CoordType;

    /**
     * Scratch variable for computing position (world coordinates).
     */
    private readonly position_ = Geometric3.vector(0, 0, 0);
    // private positionLock_ = this.position_.lock();
    /**
     * Scratch variable for computing force (world coordinates).
     */
    private readonly force_ = Geometric3.vector(0, 0, 0);
    // private forceLock_ = this.force_.lock();
    /**
     * Scratch variable for computing torque (world coordinates).
     */
    private readonly torque_ = new Bivector3(0, 0, 0);

    /**
     * 
     */
    constructor(private body_: ForceBody3) {
        super();
    }

    /**
     * 
     */
    getBody(): ForceBody3 {
        return this.body_;
    }

    /**
     * Computes the force being applied (vector).
     */
    computeForce(force: VectorE3): void {
        switch (this.vectorCoordType) {
            case CoordType.LOCAL: {
                this.force_.copyVector(this.vector);
                this.force_.rotate(this.body_.R);
                this.force_.writeVector(force);
                break;
            }
            case CoordType.WORLD: {
                this.force_.copyVector(this.vector);
                this.force_.writeVector(force);
                break;
            }
        }
    }

    get F(): Geometric3 {
        this.computeForce(this.force_);
        return this.force_;
    }

    get x(): Geometric3 {
        this.computePosition(this.position_);
        return this.position_;
    }

    /**
     * Computes the point of application of the force in world coordinates.
     */
    computePosition(position: VectorE3): void {
        switch (this.locationCoordType) {
            case CoordType.LOCAL: {
                this.position_.copyVector(this.location);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero. 
                this.position_.rotate(this.body_.R);
                this.position_.addVector(this.body_.X);
                this.position_.writeVector(position);
                break;
            }
            case CoordType.WORLD: {
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
    computeTorque(torque: BivectorE3): void {
        this.computePosition(this.position_);
        this.computeForce(this.force_);
        this.torque_.wedge(this.position_.subVector(this.body_.X), this.force_);
        this.torque_.write(torque);
    }
}

export default Force3;
