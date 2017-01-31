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
import Bivector2 from '../math/Bivector2';
import BivectorE2 from '../math/BivectorE2';
import CoordType from '../model/CoordType';
import ForceBody2 from './ForceBody2';
import Vec2 from '../math/Vec2';
import Vector2 from '../math/Vector2';
import VectorE2 from '../math/VectorE2';

/**
 * 
 */
export class Force2 extends AbstractSimObject {
    /**
     * 
     */
    public readonly location = new Vector2();
    /**
     * 
     */
    public locationCoordType: CoordType;
    /**
     * 
     */
    public readonly vector = new Vector2();
    /**
     * 
     */
    public vectorCoordType: CoordType;

    /**
     * Scratch variable for computing position (world coordinates).
     */
    private readonly position_ = new Vector2();
    /**
     * Scratch variable for computing force (world coordinates).
     */
    private readonly force_ = new Vector2();
    /**
     * Scratch variable for computing torque (world coordinates).
     */
    private readonly torque_ = new Bivector2();

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
            case CoordType.BODY: {
                this.force_.copy(this.vector);
                this.force_.rotate(this.body_.R);
                this.force_.write(force);
                break;
            }
            case CoordType.WORLD: {
                this.force_.copy(this.vector);
                this.force_.write(force);
                break;
            }
        }
    }

    get F(): Vec2 {
        this.computeForce(this.force_);
        return Vec2.fromVector(this.force_);
    }

    get x(): Vec2 {
        this.computePosition(this.position_);
        return Vec2.fromVector(this.position_);
    }

    /**
     * Computes the point of application of the force in world coordinates.
     */
    computePosition(position: VectorE2): void {
        switch (this.locationCoordType) {
            case CoordType.BODY: {
                this.position_.copy(this.location);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero. 
                this.position_.rotate(this.body_.R);
                this.position_.add(this.body_.X);
                this.position_.write(position);
                break;
            }
            case CoordType.WORLD: {
                this.position_.copy(this.location);
                this.position_.write(position);
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
        this.torque_.wedge(this.position_.subtract(this.body_.X), this.force_);
        this.torque_.write(torque);
    }
}

export default Force2;
