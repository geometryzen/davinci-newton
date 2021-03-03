import mustBeFunction from '../checks/mustBeFunction';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import mustBeNumber from '../checks/mustBeNumber';
import { Massive } from './Massive';
import { Mat3 } from '../math/Mat3';
import { Matrix3 } from '../math/Matrix3';
import MatrixLike from '../math/MatrixLike';
import { Unit } from '../math/Unit';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { assertConsistentUnits } from './assertConsistentUnits';
import { Charged } from './Charged';
import { ForceBody } from './ForceBody';
import { Metric } from './Metric';

function mustBeDimensionlessOrCorrectUnits<T>(name: string, value: T, unit: Unit, metric: Metric<T>): T {
    if (!Unit.isOne(metric.uom(value)) && !Unit.isCompatible(metric.uom(value), unit)) {
        throw new Error(`${name} unit of measure, ${metric.uom(value)}, must be compatible with ${unit}`);
    }
    else {
        return value;
    }
}

/**
 * 
 */
export class RigidBody<T> extends AbstractSimObject implements ForceBody<T>, Massive<T>, Charged<T> {
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
    private readonly mass_: T;
    private massLock_: number;

    /**
     * Charge, Q. Default is zero (0).
     */
    private readonly charge_: T;
    private chargeLock_: number;

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
    private readonly position_: T;
    /**
     * The attitude (spinor).
     */
    private readonly attitude_: T;
    /**
     * The linear momentum (vector).
     */
    private readonly linearMomentum_: T;
    /**
     * The angular momentum (bivector).
     */
    private readonly angularMomentum_: T;
    /**
     * Scratch member variable used only during updateAngularVelocity.
     * The purpose is to avoid temporary object creation. 
     */
    private Ω_scratch: T;
    /**
     * Angular velocity (bivector).
     * The angular velocity is initially created in the unlocked state.
     */
    private angularVelocity_: T;
    // private angularVelocityLock_ = this.angularVelocity_.lock();

    /**
     * center of mass in local coordinates.
     */
    protected centerOfMassLocal_: T;
    protected centerOfMassLocalLock_: number;

    /**
     * Scratch variable for rotational energy.
     */
    private rotationalEnergy_: T;
    private rotationalEnergyLock_: number;

    /**
     * Scratch variable for translational energy.
     */
    private translationalEnergy_: T;
    private translationalEnergyLock_: number;

    /**
     * Scratch variable for calculation worldPoint.
     */
    private readonly worldPoint_: T;

    /**
     * 
     */
    constructor(public readonly metric: Metric<T>) {
        super();
        this.mass_ = metric.scalar(1);
        this.massLock_ = metric.lock(this.mass_);
        this.charge_ = metric.zero();
        this.chargeLock_ = metric.lock(this.charge_);
        this.position_ = metric.zero();
        this.attitude_ = metric.scalar(1);
        this.linearMomentum_ = metric.zero();
        this.angularMomentum_ = metric.zero();
        this.angularVelocity_ = metric.zero();
        this.rotationalEnergy_ = metric.zero();
        this.rotationalEnergyLock_ = metric.lock(this.rotationalEnergy_);
        this.translationalEnergy_ = metric.zero();
        this.translationalEnergyLock_ = metric.lock(this.translationalEnergy_);
        this.worldPoint_ = metric.zero();
        this.Ω_scratch = metric.zero();
        this.centerOfMassLocal_ = metric.zero();
        this.centerOfMassLocalLock_ = metric.lock(this.centerOfMassLocal_);
    }

    /**
     * The center of mass position vector in local coordinates.
     */
    get centerOfMassLocal(): T {
        return this.centerOfMassLocal_;
    }
    set centerOfMassLocal(centerOfMassLocal: T) {
        this.metric.unlock(this.centerOfMassLocal_, this.centerOfMassLocalLock_);
        this.metric.copyVector(centerOfMassLocal, this.centerOfMassLocal_);
        this.centerOfMassLocalLock_ = this.metric.lock(this.centerOfMassLocal_);
    }

    /**
     * Mass (scalar). Default is one (1).
     * If dimensioned units are used, they must be compatible with the unit of mass.
     */
    get M(): T {
        return this.mass_;
    }
    set M(M: T) {
        mustBeDimensionlessOrCorrectUnits('M', M, Unit.KILOGRAM, this.metric);
        this.metric.unlock(this.mass_, this.massLock_);
        this.metric.copy(M, this.mass_);
        this.massLock_ = this.metric.lock(this.mass_);
        this.updateInertiaTensor();
    }

    /**
     * Charge (scalar). Default is zero (0).
     * If dimensioned units are used, they must be compatible with the unit of electric charge.
     */
    get Q(): T {
        return this.charge_;
    }
    set Q(Q: T) {
        mustBeDimensionlessOrCorrectUnits('Q', Q, Unit.COULOMB, this.metric);
        this.metric.unlock(this.charge_, this.chargeLock_);
        this.metric.copy(Q, this.charge_);
        this.chargeLock_ = this.metric.lock(this.charge_);
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
        this.metric.copy(this.L, this.Ω); // Ω contains L
        this.metric.rev(this.R);
        this.metric.rotate(this.Ω, this.R); // Ω contains R L ~R
        this.metric.copy(this.Ω, this.Ω_scratch); // scratch contains R L ~R
        this.metric.applyMatrix(this.Ω_scratch, this.Iinv); // scratch contains Iinv (R L ~R)
        this.metric.copyBivector(this.Ω_scratch, this.Ω); // Ω contains Iinv (R L ~R)
        this.metric.rev(this.R);
        this.metric.rotate(this.Ω, this.R); // Ω contains R (Iinv (R L ~R)) ~R
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
    get X(): T {
        return this.position_;
    }
    set X(position: T) {
        mustBeDimensionlessOrCorrectUnits('position', position, Unit.METER, this.metric);
        this.metric.copy(position, this.position_);
    }

    /**
     * Attitude (spinor).
     * Effects a rotation from local coordinates to world coordinates.
     */
    get R(): T {
        return this.attitude_;
    }
    set R(attitude: T) {
        mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit.ONE, this.metric);
        this.metric.copy(attitude, this.attitude_);
    }

    /**
     * Linear momentum (vector).
     * If dimensioned units are used, they must be compatible with the unit of momentum.
     */
    get P(): T {
        return this.linearMomentum_;
    }
    set P(momentum: T) {
        mustBeDimensionlessOrCorrectUnits('momentum', momentum, Unit.KILOGRAM_METER_PER_SECOND, this.metric);
        this.metric.copy(momentum, this.linearMomentum_);
    }

    /**
     * Angular momentum (bivector) in world coordinates.
     * If dimensioned units are used, they must be compatible with the unit of angular momentum.
     */
    get L(): T {
        return this.angularMomentum_;
    }
    set L(angularMomentum: T) {
        mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit.JOULE_SECOND, this.metric);
        this.metric.copy(angularMomentum, this.angularMomentum_);
    }

    /**
     * Angular velocity (bivector).
     * If dimensioned units are used, they must be compatible with the unit of angular velocity.
     */
    get Ω(): T {
        // A getter is required in order to support the setter existence.
        return this.angularVelocity_;
    }
    set Ω(angularVelocity: T) {
        mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit.INV_SECOND, this.metric);
        // A setter is used so that assignments do not cause the member vaiable to become immutable.
        this.metric.copy(angularVelocity, this.angularVelocity_);
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
    rotationalEnergy(): T {
        assertConsistentUnits('Ω', this.Ω, 'L', this.L, this.metric);
        this.metric.unlock(this.rotationalEnergy_, this.rotationalEnergyLock_);
        this.metric.copyBivector(this.Ω, this.rotationalEnergy_); // rotationalEnergy contains Ω.
        this.metric.rev(this.rotationalEnergy_);                  // rotationalEnergy contains ~Ω.
        this.metric.scp(this.rotationalEnergy_, this.L);          // rotationalEnergy contains ~Ω * L, where * means scalar product.
        this.metric.mulByNumber(this.rotationalEnergy_, 0.5);
        this.rotationalEnergyLock_ = this.metric.lock(this.rotationalEnergy_);
        return this.rotationalEnergy_;
    }

    /**
     * (1/2) (P * P) / M
     */
    translationalEnergy(): T {
        assertConsistentUnits('M', this.M, 'P', this.P, this.metric);
        this.metric.unlock(this.translationalEnergy_, this.translationalEnergyLock_);
        this.metric.copyVector(this.P, this.translationalEnergy_);  // translationalEnergy contains P.
        this.metric.mulByVector(this.translationalEnergy_, this.P); // translationalEnergy contains P * P.
        this.metric.divByScalar(this.translationalEnergy_, this.metric.a(this.M), this.metric.uom(this.M)); // translationalEnergy contains P * P / M.
        this.metric.mulByNumber(this.translationalEnergy_, 0.5);
        this.translationalEnergyLock_ = this.metric.lock(this.translationalEnergy_);
        return this.translationalEnergy_;
    }

    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: T, worldPoint: T): void {
        // Note: It appears that we might be able to use the worldPoint argument as a scratch variable.
        // However, it may not have all the features that we need for the intermediate operations.
        this.metric.copyVector(localPoint, this.worldPoint_);
        this.metric.subVector(this.worldPoint_, this.centerOfMassLocal_);
        this.metric.rotate(this.worldPoint_, this.attitude_);
        this.metric.addVector(this.worldPoint_, this.position_);
        this.metric.writeVector(this.worldPoint_, worldPoint);
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
