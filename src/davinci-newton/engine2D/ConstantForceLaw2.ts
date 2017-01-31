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
import VectorE2 from '../math/VectorE2';

export class ConstantForceLaw2 extends AbstractSimObject implements ForceLaw2 {
    /**
     * The attachment point to the body in body coordinates.
     */
    private readonly force_: Force2;
    private readonly forces: Force2[] = [];
    constructor(private body_: RigidBody2, vector: VectorE2, vectorCoordType: CoordType = CoordType.WORLD) {
        super();
        this.force_ = new Force2(this.body_);

        this.force_.locationCoordType = CoordType.BODY;
        this.force_.vector.copy(vector);
        this.force_.vectorCoordType = vectorCoordType;

        this.forces = [this.force_];
    }

    get location(): VectorE2 {
        return this.force_.location;
    }
    set location(location: VectorE2) {
        this.force_.location.copy(location);
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
    potentialEnergy(): number {
        return 0;
    }
}

export default ConstantForceLaw2;
