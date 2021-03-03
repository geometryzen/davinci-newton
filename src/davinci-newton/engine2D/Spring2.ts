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
import { Unit } from '../math/Unit';
import { Vec2 } from '../math/Vec2';
import { VectorE2 } from '../math/VectorE2';
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force2 } from './Force2';
import { ForceLaw2 } from './ForceLaw2';
import { RigidBody2 } from './RigidBody2';

/**
 * Asserts that the specified quantities are either both dimensionless or neither dimensionless.
 * If either measure is zero, the unit of dimensions are meaningless
 */
function assertConsistentUnits(aName: string, A: Geometric2, bName: string, B: Geometric2): void {
    if (!A.isZero() && !B.isZero()) {
        if (Unit.isOne(A.uom)) {
            if (!Unit.isOne(B.uom)) {
                throw new Error(`${aName} => ${A} must have dimensions if ${bName} => ${B} has dimensions.`);
            }
        }
        else {
            if (Unit.isOne(B.uom)) {
                throw new Error(`${bName} => ${B} must have dimensions if ${aName} => ${A} has dimensions.`);
            }
        }
    }
}

/**
 * 
 */
export class Spring3 extends AbstractSimObject implements ForceLaw2 {
    /**
     * 
     */
    public restLength = Geometric2.one;
    /**
     * 
     */
    public stiffness = Geometric2.one;
    /**
     * The attachment point to body1 in the local coordinates frame of body 1.
     */
    private attach1_ = Vec2.zero;
    /**
     * The attachment point to body2 in the local coordinates frame of body 2.
     */
    private attach2_ = Vec2.zero;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1: Force2;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2: Force2;
    /**
     * 
     */
    private readonly forces: Force2[] = [];

    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end1_ = Geometric2.vector(0, 0);
    private end1Lock_ = this.end1_.lock();

    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end2_ = Geometric2.vector(0, 0);
    private end2Lock_ = this.end2_.lock();

    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_ = Geometric2.scalar(0);
    private potentialEnergyLock_ = this.potentialEnergy_.lock();

    /**
     * 
     */
    constructor(private body1_: RigidBody2, private body2_: RigidBody2) {
        super();

        this.F1 = new Force2(this.body1_);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = new Force2(this.body2_);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        this.forces = [this.F1, this.F2];
    }

    private computeBody1AttachPointInWorldCoords(x: VectorE2): void {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.localPointToWorldPoint(this.attach1_, x);
    }

    private computeBody2AttachPointInWorldCoords(x: VectorE2): void {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.localPointToWorldPoint(this.attach2_, x);
    }

    get attach1(): VectorE2 {
        return this.attach1_;
    }
    set attach1(attach1: VectorE2) {
        this.attach1_ = Vec2.fromVector(attach1);
    }

    get attach2(): VectorE2 {
        return this.attach2_;
    }
    set attach2(attach2: VectorE2) {
        this.attach2_ = Vec2.fromVector(attach2);
    }

    get end1(): Geometric2 {
        this.end1.unlock(this.end1Lock_);
        this.computeBody1AttachPointInWorldCoords(this.end1_);
        this.end1Lock_ = this.end1.lock();
        return this.end1_;
    }

    get end2(): Geometric2 {
        this.end2.unlock(this.end2Lock_);
        this.computeBody2AttachPointInWorldCoords(this.end2_);
        this.end2Lock_ = this.end2.lock();
        return this.end2_;
    }

    /**
     * 
     */
    updateForces(): Force2[] {

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
    potentialEnergy(): Geometric2 {
        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        this.potentialEnergy_.unlock(this.potentialEnergyLock_);

        // spring potential energy = 0.5 * stiffness * (stretch * stretch)

        // 1. Compute the magnitude of the distance between the endpoints.
        assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location);
        this.potentialEnergy_.copyVector(this.F2.location).subVector(this.F1.location).magnitude(true);
        // 2. Compute the stretch.
        assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength);
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
