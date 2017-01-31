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
import Bivector3 from '../math/Bivector3';
import Mat3 from '../math/Mat3';
import Matrix3 from '../math/Matrix3';
import MatrixLike from '../math/MatrixLike';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import mustBeNumber from '../checks/mustBeNumber';
import { rotateX, rotateY, rotateZ } from '../math/rotate3';
import Spinor3 from '../math/Spinor3';
import Vec3 from '../math/Vec3';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class RigidBody3 extends AbstractSimObject {
    /**
     * Mass, M.
     */
    private M_ = 1;
    /**
     * Inverse of the Inertia tensor in body coordinates.
     */
    private inertiaTensorInverse_ = new Mat3(Matrix3.one());

    /**
     * the index into the variables array for this rigid body, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    private readonly position_ = new Vector3();
    private readonly attitude_ = new Spinor3();
    private readonly linearMomentum_ = new Vector3();
    private readonly angularMomentum_ = new Bivector3();
    /**
     * Angular velocity (bivector).
     */
    public Ω = new Bivector3();

    /**
     * center of mass in local coordinates.
     */
    protected centerOfMassLocal_ = Vec3.zero;

    /**
     * 
     */
    constructor() {
        super();
    }

    /**
     * The center of mass position vector in local coordinates.
     */
    get centerOfMassLocal(): VectorE3 {
        return this.centerOfMassLocal_;
    }
    set centerOfMassLocal(centerOfMassLocal: VectorE3) {
        this.centerOfMassLocal_ = Vec3.fromVector(centerOfMassLocal);
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
     * Updates the angular velocity, Ω, bivector based upon the angular momentum.
     * Derived classes may override to provide more efficient implementations based upon symmetry.
     */
    public updateAngularVelocity(): void {
        // In matrix notation,
        // L = I Ω => Ω = Iinv L.
        // Either the inertia tensor must be converted from local coordinates to world, or
        // we convert L to local coordinates, apply the local inertial tensor and then rotate
        // Ω back to world coordinates.
        // Notice that in the following we avoid creating temporary variables by computing
        // the reversion of the mutable body.R twice.
        this.Ω.copy(this.L);
        this.Ω.rotate(this.R.rev());
        this.Ω.applyMatrix(this.Iinv);
        this.Ω.rotate(this.R.rev());
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
        const I = Matrix3.zero().copy(this.inertiaTensorInverse_).inv();
        return new Mat3(I);
    }
    /**
     * Sets the Inertia Tensor (in local coordinates) (3x3 matrix), and computes the inverse.
     */
    set I(I: MatrixLike) {
        const Iinv = Matrix3.zero().copy(I).inv();
        this.inertiaTensorInverse_ = new Mat3(Iinv);
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
        this.inertiaTensorInverse_ = new Mat3(source);
    }

    /**
     * Position (vector).
     */
    get X(): Vector3 {
        return this.position_;
    }
    set X(position: Vector3) {
        this.position_.copy(position);
    }

    /**
     * Attitude (spinor).
     * Effects a rotation from local coordinates to world coordinates.
     */
    get R(): Spinor3 {
        return this.attitude_;
    }
    set R(attitude: Spinor3) {
        this.attitude_.copy(attitude);
    }

    /**
     * Linear momentum (vector).
     */
    get P(): Vector3 {
        return this.linearMomentum_;
    }
    set P(momentum: Vector3) {
        this.linearMomentum_.copy(momentum);
    }

    /**
     * Angular momentum (bivector) in world coordinates.
     */
    get L(): Bivector3 {
        return this.angularMomentum_;
    }
    set L(angularMomentum: Bivector3) {
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
     * (1/2) (P * P) / M
     */
    translationalEnergy(): number {
        return 0.5 * this.P.quaditude() / this.M;
    }

    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: VectorE3, worldPoint: VectorE3): void {
        // This implementation avoids object creation at the expense of more operations.
        const comLocal = this.centerOfMassLocal_;
        const x = localPoint.x - comLocal.x;
        const y = localPoint.y - comLocal.y;
        const z = localPoint.z - comLocal.z;
        const X = this.position_;
        const R = this.attitude_;
        worldPoint.x = rotateX(x, y, z, R) + X.x;
        worldPoint.y = rotateY(x, y, z, R) + X.y;
        worldPoint.z = rotateZ(x, y, z, R) + X.z;
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
    worldVelocityOfBodyPoint(bodyPoint: VectorE3): Vector {
        // r = R(t) * [bodyPoint relative to body center of mass]
        const s = new Vector3().copy(bodyPoint).subtract(this.cm_body_).rotate(this.R);
        const r = Vector.fromVector(bodyPoint).subtract(this.cm_body_).rotate(this.R);
        // ω x r => r << Ω
        // dx/dt = r << Ω + dX/dt
        return r.lco(this.Ω).add(this.V);
        // dx/dt = ω x r + dX/dt
        // return Vector.fromVector(this.ω).cross(r).add(this.V);
    }
    */
}

export default RigidBody3;
