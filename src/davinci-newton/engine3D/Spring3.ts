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

import { assertConsistentUnits } from '../core/assertConsistentUnits';
import { Geometric3 } from '../math/Geometric3';
import { Unit } from '../math/Unit';
import { Vec3 } from '../math/Vec3';
import { VectorE3 } from '../math/VectorE3';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force3 } from './Force3';
import { ForceLaw3 } from './ForceLaw3';
import { RigidBody3 } from './RigidBody3';

/**
 * 
 */
export class Spring3 extends AbstractSimObject implements ForceLaw3 {
    /**
     * 
     */
    public restLength = Geometric3.one;
    /**
     * 
     */
    public stiffness = Geometric3.one;
    /**
     * The attachment point to body1 in the local coordinates frame of body 1.
     */
    private attach1_ = Vec3.zero;
    /**
     * The attachment point to body2 in the local coordinates frame of body 2.
     */
    private attach2_ = Vec3.zero;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1: Force3;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2: Force3;
    /**
     * 
     */
    private readonly forces: Force3[] = [];

    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end1_ = Geometric3.vector(0, 0, 0);
    private end1Lock_ = this.end1_.lock();

    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end2_ = Geometric3.vector(0, 0, 0);
    private end2Lock_ = this.end2_.lock();

    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_ = Geometric3.scalar(0);
    private potentialEnergyLock_ = this.potentialEnergy_.lock();

    /**
     * 
     */
    constructor(private body1_: RigidBody3, private body2_: RigidBody3) {
        super();

        this.F1 = new Force3(this.body1_);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = new Force3(this.body2_);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        this.forces = [this.F1, this.F2];
    }

    private computeBody1AttachPointInWorldCoords(x: VectorE3): void {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.localPointToWorldPoint(this.attach1_, x);
    }

    private computeBody2AttachPointInWorldCoords(x: VectorE3): void {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.localPointToWorldPoint(this.attach2_, x);
    }

    get attach1(): VectorE3 {
        return this.attach1_;
    }
    set attach1(attach1: VectorE3) {
        this.attach1_ = Vec3.fromVector(attach1);
    }

    get attach2(): VectorE3 {
        return this.attach2_;
    }
    set attach2(attach2: VectorE3) {
        this.attach2_ = Vec3.fromVector(attach2);
    }

    get end1(): Geometric3 {
        this.end1.unlock(this.end1Lock_);
        this.computeBody1AttachPointInWorldCoords(this.end1_);
        this.end1Lock_ = this.end1.lock();
        return this.end1_;
    }

    get end2(): Geometric3 {
        this.end2.unlock(this.end2Lock_);
        this.computeBody2AttachPointInWorldCoords(this.end2_);
        this.end2Lock_ = this.end2.lock();
        return this.end2_;
    }

    /**
     * 
     */
    updateForces(): Force3[] {

        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        // Temporarily use the F2 vector property to compute the direction (unit vector).
        this.F2.vector.copyVector(this.F2.location).subVector(this.F1.location).direction(true);

        // Use the the F1 vector property as working storage.
        // 1. Compute the extension.
        this.F1.vector.copyVector(this.F1.location).subVector(this.F2.location).magnitude(true).subScalar(this.restLength);
        // 2. Multiply by the stiffness.
        this.F1.vector.mulByScalar(this.stiffness.a, this.stiffness.uom);
        // 3. Multiply by the direction (temporarily in F2 vector) to complete the F1 vector.
        this.F1.vector.mulByVector(this.F2.vector);
        // 4. The F2 vector property is the reaction to the F1 vector action.
        this.F2.vector.copyVector(this.F1.vector).neg();

        /*
        if (this.damping_ !== 0) {
            // damping does not happen for 'compress only' when uncompressed
            if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                const v1 = this.body1_.worldVelocityOfBodyPoint(this.attach1_);
                const v2 = this.body2_.worldVelocityOfBodyPoint(this.attach2_);
                const df = v1.subtract(v2).multiply(-this.damping_);
                f12 = f12.add(df);
            }
        }
        */
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
        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        this.potentialEnergy_.unlock(this.potentialEnergyLock_);

        // spring potential energy = 0.5 * stiffness * (stretch * stretch)

        // 1. Compute the magnitude of the distance between the endpoints.
        // TODO: assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location);
        this.potentialEnergy_.copyVector(this.F2.location).subVector(this.F1.location).magnitude(true);
        // 2. Compute the stretch.
        // TOOD: assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength);
        this.potentialEnergy_.sub(this.restLength);
        // 3. Square it.
        this.potentialEnergy_.quaditude(true);
        // 4. Multiply by the stiffness.
        this.potentialEnergy_.mulByScalar(this.stiffness.a, this.stiffness.uom);
        // 5. Multiply by the 0.5 factor.
        this.potentialEnergy_.mulByNumber(0.5);

        this.potentialEnergyLock_ = this.potentialEnergy_.lock();
        return this.potentialEnergy_;
    }
}
