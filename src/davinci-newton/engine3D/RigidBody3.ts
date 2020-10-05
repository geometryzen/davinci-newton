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
import Charged3 from './Charged3';
import ForceBody3 from './ForceBody3';
import Geometric3 from '../math/Geometric3';
import Massive3 from './Massive3';
import Mat3 from '../math/Mat3';
import Matrix3 from '../math/Matrix3';
import MatrixLike from '../math/MatrixLike';
import mustBeFunction from '../checks/mustBeFunction';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import mustBeNumber from '../checks/mustBeNumber';
import { Unit } from '../math/Unit';
import Vec3 from '../math/Vec3';
import VectorE3 from '../math/VectorE3';

/**
 * Asserts that the specified quantities are either both dimensionless or neither dimensionless.
 * If either measure is zero, the unit of dimensions are meaningless
 */
function assertConsistentUnits(aName: string, A: Geometric3, bName: string, B: Geometric3): void {
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

function mustBeDimensionlessOrCorrectUnits(name: string, value: Geometric3, unit: Unit): Geometric3 {
    if (!Unit.isOne(value.uom) && !Unit.isCompatible(value.uom, unit)) {
        throw new Error(`${name} unit of measure, ${value.uom}, must be compatible with ${unit}`);
    }
    else {
        return value;
    }
}

/**
 * 
 */
export class RigidBody3 extends AbstractSimObject implements ForceBody3, Massive3, Charged3 {
    /**
     * A uniquie identifier assigned by applications.
     * This is not used internally.
     */
    public uuid: string;

    /**
     * Mass, M. Default is one (1).
     * Changing the mass requires an update to the intertia tensor,
     * so we want to control the mutability.
     */
    private readonly mass_ = Geometric3.scalar(1);
    private massLock_ = this.mass_.lock();

    /**
     * Charge, Q. Default is zero (0).
     */
    private readonly charge_ = Geometric3.scalar(0);
    private chargeLock_ = this.charge_.lock();

    /**
     * Inverse of the Inertia tensor in body coordinates.
     */
    private inertiaTensorInverse_ = new Mat3(Matrix3.one());

    /**
     * the index into the variables array for this rigid body, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    /**
     * The position (vector).
     */
    private readonly position_ = Geometric3.zero.clone();
    /**
     * The attitude (spinor).
     */
    private readonly attitude_ = Geometric3.one.clone();
    /**
     * The linear momentum (vector).
     */
    private readonly linearMomentum_ = Geometric3.zero.clone();
    /**
     * The angular momentum (bivector).
     */
    private readonly angularMomentum_ = Geometric3.zero.clone();
    /**
     * Scratch member variable used only during updateAngularVelocity.
     * The purpose is to avoid temporary object creation. 
     */
    private Ω_scratch = new Bivector3(0, 0, 0);
    /**
     * Angular velocity (bivector).
     * The angular velocity is initially created in the unlocked state.
     */
    private angularVelocity_ = Geometric3.bivector(0, 0, 0);
    // private angularVelocityLock_ = this.angularVelocity_.lock();

    /**
     * center of mass in local coordinates.
     */
    protected centerOfMassLocal_ = Vec3.zero;

    /**
     * Scratch variable for rotational energy.
     */
    private rotationalEnergy_ = Geometric3.zero.clone();
    private rotationalEnergyLock_ = this.rotationalEnergy_.lock();

    /**
     * Scratch variable for translational energy.
     */
    private translationalEnergy_ = Geometric3.zero.clone();
    private translationalEnergyLock_ = this.translationalEnergy_.lock();

    /**
     * Scratch variable for calculation worldPoint.
     */
    private readonly worldPoint_ = Geometric3.vector(0, 0, 0);

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
     * Mass (scalar). Default is one (1).
     * If dimensioned units are used, they must be compatible with the unit of mass.
     */
    get M(): Geometric3 {
        return this.mass_;
    }
    set M(M: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('M', M, Unit.KILOGRAM);
        this.mass_.unlock(this.massLock_);
        this.mass_.copy(M);
        this.massLock_ = this.mass_.lock();
        this.updateInertiaTensor();
    }

    /**
     * Charge (scalar). Default is zero (0).
     * If dimensioned units are used, they must be compatible with the unit of electric charge.
     */
    get Q(): Geometric3 {
        return this.charge_;
    }
    set Q(Q: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('Q', Q, Unit.COULOMB);
        this.charge_.unlock(this.chargeLock_);
        this.charge_.copy(Q);
        this.chargeLock_ = this.charge_.lock();
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
        this.Ω.copy(this.L); // Ω contains L
        this.Ω.rotate(this.R.rev()); // Ω contains R L ~R
        this.Ω_scratch.copy(this.Ω); // scratch contains R L ~R
        this.Ω_scratch.applyMatrix(this.Iinv); // scratch contains Iinv (R L ~R)
        this.Ω.copyBivector(this.Ω_scratch); // Ω contains Iinv (R L ~R)
        this.Ω.rotate(this.R.rev()); // Ω contains R (Iinv (R L ~R)) ~R
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
     * If dimensioned units are used, they must be compatible with the unit of length.
     */
    get X(): Geometric3 {
        return this.position_;
    }
    set X(position: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('position', position, Unit.METER);
        this.position_.copy(position);
    }

    /**
     * Attitude (spinor).
     * Effects a rotation from local coordinates to world coordinates.
     */
    get R(): Geometric3 {
        return this.attitude_;
    }
    set R(attitude: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit.ONE);
        this.attitude_.copy(attitude);
    }

    /**
     * Linear momentum (vector).
     * If dimensioned units are used, they must be compatible with the unit of momentum.
     */
    get P(): Geometric3 {
        return this.linearMomentum_;
    }
    set P(momentum: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('momentum', momentum, Unit.KILOGRAM_METER_PER_SECOND);
        this.linearMomentum_.copy(momentum);
    }

    /**
     * Angular momentum (bivector) in world coordinates.
     * If dimensioned units are used, they must be compatible with the unit of angular momentum.
     */
    get L(): Geometric3 {
        return this.angularMomentum_;
    }
    set L(angularMomentum: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit.JOULE_SECOND);
        this.angularMomentum_.copy(angularMomentum);
    }

    /**
     * Angular velocity (bivector).
     * If dimensioned units are used, they must be compatible with the unit of angular velocity.
     */
    get Ω(): Geometric3 {
        // A getter is required in order to support the setter existence.
        return this.angularVelocity_;
    }
    set Ω(angularVelocity: Geometric3) {
        mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit.INV_SECOND);
        // A setter is used so that assignments do not cause the member vaiable to become immutable.
        this.angularVelocity_.copy(angularVelocity);
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
     * In the following formula, notice the reversion on either Ω or L.
     * Geometrically, this means we depend on the cosine of the angle between the bivectors, since
     * A * ~B = |A||B|cos(...).
     * (1/2) Ω * ~L(Ω) = (1/2) ~Ω * L(Ω) = (1/2) ω * J(ω), where * means scalar product (equals dot product for vectors).
     */
    rotationalEnergy(): Geometric3 {
        assertConsistentUnits('Ω', this.Ω, 'L', this.L);
        this.rotationalEnergy_.unlock(this.rotationalEnergyLock_);
        this.rotationalEnergy_.copyBivector(this.Ω).rev().scp(this.L).mulByNumber(0.5);
        this.rotationalEnergyLock_ = this.rotationalEnergy_.lock();
        return this.rotationalEnergy_;
    }

    /**
     * (1/2) (P * P) / M
     */
    translationalEnergy(): Geometric3 {
        assertConsistentUnits('M', this.M, 'P', this.P);
        this.translationalEnergy_.unlock(this.translationalEnergyLock_);
        this.translationalEnergy_.copyVector(this.P).mulByVector(this.P).divByScalar(this.M.a, this.M.uom).mulByNumber(0.5);
        this.translationalEnergyLock_ = this.translationalEnergy_.lock();
        return this.translationalEnergy_;
    }

    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: VectorE3, worldPoint: VectorE3): void {
        this.worldPoint_.copyVector(localPoint).subVector(this.centerOfMassLocal_);
        this.worldPoint_.rotate(this.attitude_).addVector(this.position_);
        this.worldPoint_.writeVector(worldPoint);
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
