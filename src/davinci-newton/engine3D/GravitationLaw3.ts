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
import Geometric3 from '../math/Geometric3';
import Massive from './Massive3';

/**
 * 
 */
export class GravitationLaw3 extends AbstractSimObject implements ForceLaw {
    /**
     * 
     */
    public G: Geometric3;
    private readonly F1: Force;
    private readonly F2: Force;
    private readonly forces: Force[] = [];

    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_ = Geometric3.zero();
    private potentialEnergyLock_ = this.potentialEnergy_.lock();

    /**
     * 
     */
    constructor(private body1_: Massive, private body2_: Massive, G = Geometric3.scalar(1)) {
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
     * Computes the forces due to the gravitational interaction.
     * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force[] {
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;

        numer.copyVector(this.body2_.X).subVector(this.body1_.X);
        denom.copyVector(numer).quaditude();
        numer.direction().mul(this.G).mul(this.body1_.M).mul(this.body2_.M);

        this.F1.vector.copyVector(numer).divByScalar(denom.a, denom.uom);
        this.F2.vector.copy(this.F1.vector).neg();

        // Restore the contents of the location variables.
        this.F1.location.copyVector(this.body1_.X);
        this.F2.location.copyVector(this.body2_.X);

        return this.forces;
    }

    /**
     * 
     */
    disconnect(): void {
        // Does nothing
    }

    /**
     * Computes the potential energy of the gravitational interaction.
     * U = -G m1 m2 / r, where
     * r is the center-of-mass to center-of-mass separation of m1 and m2.
     */
    potentialEnergy(): Geometric3 {
        // Unlock the variable that we will use for the result.
        this.potentialEnergy_.unlock(this.potentialEnergyLock_);

        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;
        // The numerator of the potential energy formula is -G * m1 * m2.
        numer.copy(this.G).mul(this.body1_.M).mul(this.body2_.M).neg();
        // The denominator is |r1 - r2|.
        denom.copyVector(this.body1_.X).subVector(this.body2_.X).magnitude();
        // Combine the numerator and denominator.
        this.potentialEnergy_.copy(numer).div(denom);

        // Restore the contents of the location variables.
        this.F1.location.copyVector(this.body1_.X);
        this.F2.location.copyVector(this.body2_.X);

        // We're done. Lock down the result.
        this.potentialEnergyLock_ = this.potentialEnergy_.lock();
        return this.potentialEnergy_;
    }
}

export default GravitationLaw3;
