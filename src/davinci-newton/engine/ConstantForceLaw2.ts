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
import { ForceBody2 } from './ForceBody2';
import { ForceLaw2 } from './ForceLaw2';
import { Measure } from './Measure';

/**
 * 
 */
export class ConstantForceLaw2<T> extends AbstractSimObject implements ForceLaw2<T> {
    /**
     * The attachment point to the body in body coordinates.
     */
    private readonly force_: Force2<T>;
    private readonly forces: Force2<T>[] = [];
    private readonly potentialEnergy_: T;
    private potentialEnergyLock_: number;

    /**
     * 
     */
    constructor(private body_: ForceBody2<T>, vector: T, vectorCoordType: CoordType = WORLD) {
        super();
        const metric = this.body_.metric;
        this.force_ = new Force2(this.body_, metric);

        this.force_.locationCoordType = LOCAL;
        metric.copyVector(vector, this.force_.vector);
        this.force_.vectorCoordType = vectorCoordType;

        this.forces = [this.force_];

        this.potentialEnergy_ = metric.zero();
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
    }

    get location(): T {
        return this.force_.location;
    }
    set location(location: T) {
        const metric = this.body_.metric;
        metric.copyVector(location, this.force_.location);
    }

    /**
     * 
     */
    updateForces(): Force2<T>[] {
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
    potentialEnergy(): T {
        // TODO: Why do we do this initialization to zero then return a locked object?
        const metric = this.body_.metric;
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
        // this.potentialEnergy_.a = 0;
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    }
}
