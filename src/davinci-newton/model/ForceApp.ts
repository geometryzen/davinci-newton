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
import RigidBody from '../engine/RigidBody';
import Vector from '../math/Vector';

/**
 * 
 */
export class ForceApp extends AbstractSimObject {

    /**
     * 
     */
    private torque_ = new Bivector3();

    /**
     * 
     */
    constructor(name: string,
        private body_: RigidBody,
        private location_: Vector,
        private locationCoordType_: CoordType,
        private direction_: Vector,
        private directionCoordType_: CoordType) {
        super(name);
    }

    /**
     * 
     */
    getBody(): RigidBody {
        return this.body_;
    }

    /**
     * The force being applied, F.
     */
    get F(): Vector {
        return this.directionCoordType_ === CoordType.BODY ? this.body_.rotateBodyToWorld(this.direction_) : this.direction_;
    }

    /**
     * The point of application of the force, x.
     */
    get x(): Vector {
        return this.locationCoordType_ === CoordType.BODY ? this.body_.bodyToWorld(this.location_) : this.location_;
    }

    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     */
    getTorqueAboutCenterOfMass(): BivectorE3 {
        const r = this.x.subtract(this.body_.X);
        return this.torque_.wedge(r, this.F);
    }

    /**
     * torque, i.e. moment of the force about the center of mass (bivector).
     */
    get Γ(): BivectorE3 {
        return this.getTorqueAboutCenterOfMass();
    }
}

export default ForceApp;
