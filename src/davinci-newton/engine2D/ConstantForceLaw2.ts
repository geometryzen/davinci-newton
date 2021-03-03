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

import { Geometric2 } from '../math/Geometric2';
import { VectorE2 } from '../math/VectorE2';
import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force2 } from './Force2';
import { ForceLaw2 } from './ForceLaw2';
import { RigidBody2 } from './RigidBody2';

/**
 * 
 */
export class ConstantForceLaw2 extends AbstractSimObject implements ForceLaw2 {
    /**
     * The attachment point to the body in body coordinates.
     */
    private readonly force_: Force2;
    private readonly forces: Force2[] = [];
    private readonly potentialEnergy_ = Geometric2.scalar(0);
    private potentialEnergyLock_ = this.potentialEnergy_.lock();

    /**
     * 
     */
    constructor(private body_: RigidBody2, vector: VectorE2, vectorCoordType: CoordType = WORLD) {
        super();
        this.force_ = new Force2(this.body_);

        this.force_.locationCoordType = LOCAL;
        this.force_.vector.copyVector(vector);
        this.force_.vectorCoordType = vectorCoordType;

        this.forces = [this.force_];
    }

    get location(): VectorE2 {
        return this.force_.location;
    }
    set location(location: VectorE2) {
        this.force_.location.copyVector(location);
    }

    /**
     * 
     */
    updateForces(): Force2[] {
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
    potentialEnergy(): Geometric2 {
        this.potentialEnergy_.unlock(this.potentialEnergyLock_);
        this.potentialEnergy_.a = 0;
        this.potentialEnergyLock_ = this.potentialEnergy_.lock();
        return this.potentialEnergy_;
    }
}
