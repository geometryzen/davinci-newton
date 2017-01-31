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
import Force from './Force3';
import ForceLaw from './ForceLaw3';
import Massive from './Massive3';

/**
 * 
 */
export class GravitationLaw3 extends AbstractSimObject implements ForceLaw {
    /**
     * 
     */
    public G: number;
    private readonly F1: Force;
    private readonly F2: Force;
    private readonly forces: Force[] = [];
    /**
     * 
     */
    constructor(private body1_: Massive, private body2_: Massive, G = 1) {
        super();

        this.F1 = new Force(this.body1_);
        this.F1.locationCoordType = CoordType.WORLD;
        this.F1.vectorCoordType = CoordType.WORLD;

        this.F2 = new Force(this.body2_);
        this.F2.locationCoordType = CoordType.WORLD;
        this.F2.vectorCoordType = CoordType.WORLD;

        this.G = G;

        this.forces = [this.F1, this.F2];
    }

    /**
     * 
     */
    updateForces(): Force[] {
        this.F1.location.copy(this.body1_.X);
        this.F2.location.copy(this.body2_.X);

        const m1 = this.body1_.M;
        const m2 = this.body2_.M;

        const r2 = this.F1.location.quadranceTo(this.F2.location);
        const sf = this.G * m1 * m2 / r2;

        this.F1.vector.copy(this.F2.location).subtract(this.F1.location).direction().mulByScalar(sf);
        this.F2.vector.copy(this.F1.vector).neg();

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
        this.F1.location.copy(this.body1_.X);
        this.F2.location.copy(this.body2_.X);

        const m1 = this.body1_.M;
        const m2 = this.body2_.M;
        const r = this.F1.location.distanceTo(this.F2.location);
        return -this.G * m1 * m2 / r;
    }
}

export default GravitationLaw3;
