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
import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force2 } from './Force2';
import { ForceLaw2 } from './ForceLaw2';
import { Measure } from './Measure';
import { RigidBody } from './RigidBody';

/**
 * 
 */
export class Spring3<T> extends AbstractSimObject implements ForceLaw2<T> {
    /**
     * 
     */
    public restLength: T;
    /**
     * 
     */
    public stiffness: T;
    /**
     * The attachment point to body1 in the local coordinates frame of body 1.
     */
    private attach1_: T;
    private attach1Lock: number;
    /**
     * The attachment point to body2 in the local coordinates frame of body 2.
     */
    private attach2_: T;
    private attach2Lock: number;
    /**
     * The force information on body1 due to body2.
     */
    private readonly F1: Force2<T>;
    /**
     * The force information on body2 due to body1.
     */
    private readonly F2: Force2<T>;
    /**
     * 
     */
    private readonly forces: Force2<T>[] = [];

    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end1_: T;
    private end1Lock_: number;

    /**
     * Scratch variable for computing endpoint in world coordinates.
     */
    private readonly end2_: T;
    private end2Lock_: number;

    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_: T;
    private potentialEnergyLock_: number;

    /**
     * 
     */
    constructor(private body1_: RigidBody<T>, private body2_: RigidBody<T>, private readonly metric: Measure<T>) {
        super();

        this.restLength = metric.scalar(1);
        metric.lock(this.restLength);

        this.stiffness = metric.scalar(1);
        metric.lock(this.stiffness);

        this.attach1_ = metric.zero();
        this.attach1Lock = metric.lock(this.attach1_);

        this.attach2_ = metric.zero();
        this.attach2Lock = metric.lock(this.attach2_);

        this.end1_ = metric.zero();
        this.end1Lock_ = metric.lock(this.end1_);

        this.end2_ = metric.zero();
        this.end2Lock_ = metric.lock(this.end2_);

        this.F1 = new Force2(this.body1_, metric);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = new Force2(this.body2_, metric);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        this.potentialEnergy_ = metric.zero();
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);

        this.forces = [this.F1, this.F2];
    }

    private computeBody1AttachPointInWorldCoords(x: T): void {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        this.body1_.localPointToWorldPoint(this.attach1_, x);
    }

    private computeBody2AttachPointInWorldCoords(x: T): void {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        this.body2_.localPointToWorldPoint(this.attach2_, x);
    }

    get attach1(): T {
        return this.attach1_;
    }
    set attach1(attach1: T) {
        this.metric.unlock(this.attach1_, this.attach1Lock);
        this.metric.copyVector(attach1, this.attach1_);
        this.attach1Lock = this.metric.lock(this.attach1_);
    }

    get attach2(): T {
        return this.attach2_;
    }
    set attach2(attach2: T) {
        this.metric.unlock(this.attach2_, this.attach2Lock);
        this.metric.copyVector(attach2, this.attach2_);
        this.attach2Lock = this.metric.lock(this.attach2_);
    }

    get end1(): T {
        this.metric.unlock(this.end1_, this.end1Lock_);
        this.computeBody1AttachPointInWorldCoords(this.end1_);
        this.end1Lock_ = this.metric.lock(this.end1_);
        return this.end1_;
    }

    get end2(): T {
        this.metric.unlock(this.end2_, this.end2Lock_);
        this.computeBody2AttachPointInWorldCoords(this.end2_);
        this.end2Lock_ = this.metric.lock(this.end2_);
        return this.end2_;
    }

    /**
     * 
     */
    updateForces(): Force2<T>[] {

        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        const metric = this.metric;

        // Temporarily use the F2 vector property to compute the direction (unit vector).
        metric.copyVector(this.F2.location, this.F2.vector);
        metric.subVector(this.F2.vector, this.F1.location);
        metric.direction(this.F2.vector, true);
        // this.F2.vector.copyVector(this.F2.location).subVector(this.F1.location).direction(true);

        // Use the the F1 vector property as working storage.
        // 1. Compute the extension.
        metric.copyVector(this.F1.location, this.F1.vector);    // vector contains F1.location
        metric.subVector(this.F1.vector, this.F2.location);     // vector contains (F1.location - F2.location)
        metric.magnitude(this.F1.vector, true);                 // vector contains |F1.location - F2.location|
        metric.subScalar(this.F1.vector, this.restLength);      // vector contains (|F1.loc - F2.loc| - restLength)
        // 2. Multiply by the stiffness.
        metric.mulByScalar(this.F1.vector, metric.a(this.stiffness), metric.uom(this.stiffness));
        // 3. Multiply by the direction (temporarily in F2 vector) to complete the F1 vector.
        metric.mulByVector(this.F1.vector, this.F2.vector);
        // 4. The F2 vector property is the reaction to the F1 vector action.
        this.metric.copyVector(this.F1.vector, this.F2.vector);
        this.metric.neg(this.F2.vector);

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
    potentialEnergy(): T {
        this.computeBody1AttachPointInWorldCoords(this.F1.location);
        this.computeBody2AttachPointInWorldCoords(this.F2.location);

        const metric = this.metric;

        this.metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
        this.potentialEnergyLock_ = -1;

        // spring potential energy = 0.5 * stiffness * (stretch * stretch)

        // 1. Compute the magnitude of the distance between the endpoints.
        assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location, this.metric);
        metric.copyVector(this.F2.location, this.potentialEnergy_);
        metric.subVector(this.potentialEnergy_, this.F1.location);
        metric.magnitude(this.potentialEnergy_, true);
        // 2. Compute the stretch.
        assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength, this.metric);
        metric.sub(this.potentialEnergy_, this.restLength);
        // 3. Square it.
        metric.quaditude(this.potentialEnergy_, true);
        // 4. Multiply by the stiffness.
        metric.mulByScalar(this.potentialEnergy_, metric.a(this.stiffness), metric.uom(this.stiffness));
        // 5. Multiply by the 0.5 factor.
        metric.mulByNumber(this.potentialEnergy_, 0.5);

        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    }
}
