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
import CoordType from './CoordType';
import ForceBody from './ForceBody';
import Vector from '../math/Vector';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class Force extends AbstractSimObject {
    /**
     * 
     */
    public readonly location = new Vector3();
    /**
     * 
     */
    public locationCoordType: CoordType;
    /**
     * 
     */
    public readonly vector = new Vector3();
    /**
     * 
     */
    public vectorCoordType: CoordType;

    /**
     * Scratch variable for computing position.
     */
    private readonly position_ = new Vector3();
    /**
     * Scratch variable for computing force.
     */
    private readonly force_ = new Vector3();
    /**
     * Scratch variable for computing torque.
     */
    private readonly torque_ = new Bivector3();

    /**
     * 
     */
    constructor(private body_: ForceBody) {
        super();
    }

    /**
     * 
     */
    getBody(): ForceBody {
        return this.body_;
    }

    /**
     * Computes the force being applied (vector).
     */
    computeForce(force: VectorE3): void {
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

    get F(): Vector {
        this.computeForce(this.force_);
        return Vector.fromVector(this.force_);
    }

    get x(): Vector {
        this.computePosition(this.position_);
        return Vector.fromVector(this.position_);
    }

    /**
     * Computes the point of application of the force in world coordinates.
     */
    computePosition(position: VectorE3): void {
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
     */
    computeTorque(torque: BivectorE3): void {
        this.computePosition(this.position_);
        this.computeForce(this.force_);
        this.torque_.wedge(this.position_.subtract(this.body_.X), this.force_);
        this.torque_.write(torque);
    }
}

export default Force;
