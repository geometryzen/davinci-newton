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
import BivectorE3 from '../math/BivectorE3';
import Matrix3 from '../math/Matrix3';
import Spinor3 from '../math/Spinor3';
import SpinorE3 from '../math/SpinorE3';
import Vector from '../math/Vector';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class RigidBody extends AbstractSimObject {
    /**
     * Mass, M.
     * This quantity is considered to be constant.
     */
    private mass_ = 1;
    /**
     * Inertia tensor.
     */
    public Ibody = Matrix3.one();
    public Ibodyinv = Matrix3.one();

    /**
     * the index into the variables array for this Block, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    private readonly position_ = new Vector3();
    private readonly attitude_ = new Spinor3();
    private readonly linearMomentum_ = new Vector3();
    private readonly angularMomentum_ = new Bivector3();
    /**
     * Derived quantity (auxiliary variable).
     */
    public readonly V = new Vector3();
    /**
     * Derived quantity (auxiliary variable).
     */
    public Iinv = Matrix3.one();
    /**
     * 
     */
    public ω = new Vector3();
    public Ω = new Bivector3();

    /**
     * center of mass in body coordinates.
     */
    protected cm_body_ = Vector.ORIGIN;

    /**
     * 
     */
    constructor(name: string) {
        super(name);
    }

    /**
     * Position (vector).
     */
    get X(): VectorE3 {
        return this.position_;
    }
    set X(position: VectorE3) {
        this.position_.copy(position);
    }

    /**
     * Attitude (spinor).
     */
    get R(): SpinorE3 {
        return this.attitude_;
    }
    set R(attitude: SpinorE3) {
        this.attitude_.copy(attitude);
    }

    /**
     * Linear momentum (vector).
     */
    get P(): VectorE3 {
        return this.linearMomentum_;
    }
    set P(momentum: VectorE3) {
        this.linearMomentum_.copy(momentum);
    }

    /**
     * Angular momentum (bivector).
     */
    get L(): BivectorE3 {
        return this.angularMomentum_;
    }
    set L(angularMomentum: BivectorE3) {
        this.angularMomentum_.copy(angularMomentum);
    }

    /**
     * 
     */
    getExpireTime(): number {
        return Number.POSITIVE_INFINITY;
    }

    /**
     * 
     */
    getVarsIndex(): number {
        return this.varsIndex_;
    }

    /**
     * 
     */
    setVarsIndex(index: number) {
        this.varsIndex_ = index;
    }

    /**
     * Mass (scalar)
     */
    get M(): number {
        return this.mass_;
    }
    set M(mass: number) {
        this.mass_ = mass;
    }

    /**
     * 
     */
    momentAboutCM(): number {
        return 1;
    }

    /**
     * 
     */
    rotationalEnergy(): number {
        return 0;
    }

    /**
     * 
     */
    translationalEnergy(): number {
        return 0;
    }

    /**
     * 
     */
    bodyToWorld(bodyPoint: VectorE3): Vector {
        const r = Vector.fromVector(bodyPoint).subtract(this.cm_body_);
        return r.rotate(this.R).add(this.X);
        // const rx = bodyPoint.x - this.cm_body_.x;  // vector from cm to bodyPoint
        // const ry = bodyPoint.y - this.cm_body_.y;
        // const x = this.X.x + (rx * this.cosAngle_ - ry * this.sinAngle_);
        // const y = this.X.y + (rx * this.sinAngle_ + ry * this.cosAngle_);
        // return new Vector(x, y, 0);
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
    worldVelocityOfBodyPoint(bodyPoint: VectorE3): Vector {
        // r = R(t) * [bodyPoint relative to body center of mass]
        const r = this.rotateBodyToWorld(Vector.fromVector(bodyPoint).subtract(this.cm_body_));
        // dx/dt = ω x r + dX/dt
        return Vector.fromVector(this.ω).cross(r).add(this.V);
    }

    /**
     * 
     */
    rotateBodyToWorld(bodyPoint: VectorE3): Vector {
        return Vector.fromVector(bodyPoint).rotate(this.R);
    }
}

export default RigidBody;
