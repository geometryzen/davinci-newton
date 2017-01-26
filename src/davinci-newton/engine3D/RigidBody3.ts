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
     * center of mass in body coordinates.
     */
    protected cm_body_ = Vec3.ORIGIN;

    /**
     * 
     */
    constructor() {
        super();
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
        const I = Matrix3.zero().copy(this.inertiaTensorInverse_).inv();
        return new Mat3(I);
    }
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
     * Angular momentum (bivector).
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
     * (1/2) Ω * L(Ω) = (1/2) ω * J(ω)
     */
    rotationalEnergy(): number {
        const Ω = this.Ω;
        const L = this.L;
        return 0.5 * (Ω.xy * L.xy + Ω.yz * L.yz + Ω.zx * L.zx);
    }

    /**
     * (1/2) (P * P) / M
     */
    translationalEnergy(): number {
        const PxP = this.linearMomentum_.quadrance();
        const M = this.M_;
        return 0.5 * PxP / M;
    }

    /**
     * 
     */
    bodyToWorld(bodyPoint: VectorE3, out: VectorE3): void {
        // TODO: Avoid object creation.
        const r = Vec3.fromVector(bodyPoint).subtract(this.cm_body_);
        const result = r.rotate(this.R).add(this.X);
        out.x = result.x;
        out.y = result.y;
        out.z = result.z;
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
        // TODO: ω x r => r << Ω
        // dx/dt = r << Ω + dX/dt
        return r.lco(this.Ω).add(this.V);
        // dx/dt = ω x r + dX/dt
        // return Vector.fromVector(this.ω).cross(r).add(this.V);
    }
    */
}

export default RigidBody3;
