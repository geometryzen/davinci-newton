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
import Bivector2 from '../math/Bivector2';
import Mat2 from '../math/Mat2';
import Matrix2 from '../math/Matrix2';
import MatrixLike from '../math/MatrixLike';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import mustBeNumber from '../checks/mustBeNumber';
import { rotateX, rotateY } from '../math/rotate2';
import Spinor2 from '../math/Spinor2';
import Vec2 from '../math/Vec2';
import Vector2 from '../math/Vector2';
import VectorE2 from '../math/VectorE2';

/**
 * 
 */
export class RigidBody2 extends AbstractSimObject {
    /**
     * Mass, M.
     */
    private M_ = 1;
    /**
     * Inverse of the Inertia tensor in body coordinates.
     */
    private inertiaTensorInverse_ = new Mat2(Matrix2.one());

    /**
     * the index into the variables array for this rigid body, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    private readonly position_ = new Vector2();
    private readonly attitude_ = new Spinor2();
    private readonly linearMomentum_ = new Vector2();
    private readonly angularMomentum_ = new Bivector2();
    /**
     * Angular velocity (bivector).
     */
    public Ω = new Bivector2();

    /**
     * center of mass in local coordinates.
     */
    protected centerOfMassLocal_ = Vec2.ORIGIN;

    /**
     * 
     */
    constructor() {
        super();
    }

    /**
     * The center of mass position vector in local coordinates.
     */
    get centerOfMassLocal(): VectorE2 {
        return this.centerOfMassLocal_;
    }
    set centerOfMassLocal(centerOfMassLocal: VectorE2) {
        this.centerOfMassLocal_ = Vec2.fromVector(centerOfMassLocal);
    }

    /**
     * Mass (scalar)
     */
    get M(): number {
        return this.M_;
    }
    set M(M: number) {
        if (this.M_ !== M) {
            this.M_ = mustBeNumber('M', M);
            this.updateInertiaTensor();
        }
    }

    /**
     * Derived classes should override.
     */
    protected updateInertiaTensor(): void {
        // Do nothing.
    }

    /**
     * Inertia Tensor (in body coordinates) (3x3 matrix).
     */
    get I(): MatrixLike {
        const I = Matrix2.zero().copy(this.inertiaTensorInverse_).inv();
        return new Mat2(I);
    }
    set I(I: MatrixLike) {
        const Iinv = Matrix2.zero().copy(I).inv();
        this.inertiaTensorInverse_ = new Mat2(Iinv);
    }

    /**
     * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
     */
    get Iinv(): MatrixLike {
        return this.inertiaTensorInverse_;
    }
    set Iinv(source: MatrixLike) {
        mustBeNonNullObject('Iinv', source);
        mustBeNumber('dimensions', source.dimensions);
        mustBeFunction('getElement', source.getElement);
        this.inertiaTensorInverse_ = new Mat2(source);
    }

    /**
     * Position (vector).
     */
    get X(): Vector2 {
        return this.position_;
    }
    set X(position: Vector2) {
        this.position_.copy(position);
    }

    /**
     * Attitude (spinor).
     */
    get R(): Spinor2 {
        return this.attitude_;
    }
    set R(attitude: Spinor2) {
        this.attitude_.copy(attitude);
    }

    /**
     * Linear momentum (vector).
     */
    get P(): Vector2 {
        return this.linearMomentum_;
    }
    set P(momentum: Vector2) {
        this.linearMomentum_.copy(momentum);
    }

    /**
     * Angular momentum (bivector).
     */
    get L(): Bivector2 {
        return this.angularMomentum_;
    }
    set L(angularMomentum: Bivector2) {
        this.angularMomentum_.copy(angularMomentum);
    }

    /**
     * 
     */
    get expireTime(): number {
        return Number.POSITIVE_INFINITY;
    }

    /**
     * 
     */
    get varsIndex(): number {
        return this.varsIndex_;
    }
    set varsIndex(index: number) {
        this.varsIndex_ = index;
    }

    /**
     * (1/2) Ω * L(Ω) = (1/2) ω * J(ω), where * means scalar product (equals dot product for vectors).
     */
    rotationalEnergy(): number {
        return 0.5 * this.Ω.scp(this.L);
    }

    /**
     * (1/2) (P * P) / M = (1/2) V * P
     */
    translationalEnergy(): number {
        return 0.5 * this.P.quaditude() / this.M;
    }

    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: VectorE2, worldPoint: VectorE2): void {
        // This implementation avoids object creation at the expense of more operations.
        const comLocal = this.centerOfMassLocal_;
        const x = localPoint.x - comLocal.x;
        const y = localPoint.y - comLocal.y;
        const X = this.position_;
        const R = this.attitude_;
        worldPoint.x = rotateX(x, y, R) + X.x;
        worldPoint.y = rotateY(x, y, R) + X.y;
    }

    /**
     * Returns dx/dt where
     * 
     * dx/dt = ω x [R bodyPoint] + dX/dt (t argument suppressed)
     * 
     * The implementation uses the angular velocity bivector, Ω = I * ω, where I is the
     * unit pseudoscalar.
     * 
     * Using the identity, ω x r = r << Ω, enables us to calculate directly.
     * 
     * This method is most often used to calculate damping.
     */
    /*
    worldVelocityOfBodyPoint(bodyPoint: VectorE2): Vector {
        // r = R(t) * [bodyPoint relative to body center of mass]
        const s = new Vector2().copy(bodyPoint).subtract(this.cm_body_).rotate(this.R);
        const r = Vector.fromVector(bodyPoint).subtract(this.cm_body_).rotate(this.R);
        // ω x r => r << Ω
        // dx/dt = r << Ω + dX/dt
        return r.lco(this.Ω).add(this.V);
        // dx/dt = ω x r + dX/dt
        // return Vector.fromVector(this.ω).cross(r).add(this.V);
    }
    */
}

export default RigidBody2;
