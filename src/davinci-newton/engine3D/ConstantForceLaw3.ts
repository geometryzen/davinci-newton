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

import { RigidBody3 } from '../engine3D/RigidBody3';
import { Geometric3 } from '../math/Geometric3';
import { VectorE3 } from '../math/VectorE3';
import { CoordType, COORD_TYPE_LOCAL, COORD_TYPE_WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force3 } from './Force3';
import { ForceLaw3 } from './ForceLaw3';

/**
 * 
 */
export class ConstantForceLaw3 extends AbstractSimObject implements ForceLaw3 {
    /**
     * The attachment point to the body in body coordinates.
     */
    private readonly force_: Force3;
    private readonly forces: Force3[] = [];
    private readonly potentialEnergy_ = Geometric3.scalar(0);
    private potentialEnergyLock_ = this.potentialEnergy_.lock();

    /**
     * 
     */
    constructor(private body_: RigidBody3, vector: VectorE3, vectorCoordType: CoordType = COORD_TYPE_WORLD) {
        super();
        this.force_ = new Force3(this.body_);

        this.force_.locationCoordType = COORD_TYPE_LOCAL;
        this.force_.vector.copyVector(vector);
        this.force_.vectorCoordType = vectorCoordType;

        this.forces = [this.force_];
    }

    get location(): VectorE3 {
        return this.force_.location;
    }
    set location(location: VectorE3) {
        this.force_.location.copyVector(location);
    }

    /**
     * 
     */
    updateForces(): Force3[] {
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
    potentialEnergy(): Geometric3 {
        this.potentialEnergy_.unlock(this.potentialEnergyLock_);
        this.potentialEnergy_.a = 0;
        this.potentialEnergyLock_ = this.potentialEnergy_.lock();
        return this.potentialEnergy_;
    }
}
