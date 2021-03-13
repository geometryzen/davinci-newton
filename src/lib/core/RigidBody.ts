import mustBeFunction from '../checks/mustBeFunction';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { MatrixLike } from '../math/MatrixLike';
import { Unit } from '../math/Unit';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { assertConsistentUnits } from './assertConsistentUnits';
import { Charged } from './Charged';
import { ForceBody } from './ForceBody';
import { LockableMeasure } from './LockableMeasure';
import { Massive } from './Massive';
import { Metric } from './Metric';
import { mustBeDimensionlessOrCorrectUnits } from './mustBeDimensionlessOrCorrectUnits';

/**
 * @hidden
 */
export class RigidBody<T> extends AbstractSimObject implements ForceBody<T>, Massive<T>, Charged<T> {
    /**
     * A uniquie identifier assigned by applications.
     * This is not used internally.
     */
    public uuid: string;

    /**
     * Mass, M. Default is one (1).
     * Changing the mass requires an update to the inertia tensor,
     * so we want to control the mutability. The mass is locked by default
     */
    private readonly $mass: LockableMeasure<T>;

    /**
     * Charge, Q. Default is zero (0).
     */
    private readonly $charge: LockableMeasure<T>;

    /**
     * Inverse of the Inertia tensor in body coordinates.
     */
    private $inertiaTensorInverse: MatrixLike;

    /**
     * the index into the variables array for this rigid body, or -1 if not in vars array.
     */
    private varsIndex_ = -1;

    /**
     * The position (vector).
     */
    private readonly $X: T;
    /**
     * The attitude (spinor).
     */
    private readonly $R: T;
    /**
     * The linear momentum (vector).
     */
    private readonly $P: T;
    /**
     * The angular momentum (bivector).
     */
    private readonly $L: T;
    /**
     * Scratch member variable used only during updateAngularVelocity.
     * The purpose is to avoid temporary object creation. 
     */
    private Ω_scratch: T;
    /**
     * Angular velocity (bivector).
     * The angular velocity is initially created in the unlocked state.
     */
    private $Ω: T;

    /**
     * center of mass in local coordinates.
     */
    protected $centerOfMassLocal: LockableMeasure<T>;

    /**
     * Scratch variable for rotational energy.
     */
    private $rotationalEnergy: LockableMeasure<T>;

    /**
     * Scratch variable for translational energy.
     */
    private $translationalEnergy: LockableMeasure<T>;

    /**
     * Scratch variable for calculation worldPoint.
     */
    private readonly $worldPoint: T;

    /**
     * @param metric 
     */
    constructor(public readonly metric: Metric<T>) {
        super();
        mustBeNonNullObject('metric', metric);
        this.$mass = new LockableMeasure(metric, metric.scalar(1));
        this.$charge = new LockableMeasure(metric, metric.zero());
        this.$X = metric.zero();
        this.$R = metric.scalar(1);
        this.$P = metric.zero();
        this.$L = metric.zero();
        this.$Ω = metric.zero();
        this.$rotationalEnergy = new LockableMeasure(metric, metric.zero());
        this.$translationalEnergy = new LockableMeasure(metric, metric.zero());
        this.$worldPoint = metric.zero();
        this.Ω_scratch = metric.zero();
        this.$centerOfMassLocal = new LockableMeasure(metric, metric.zero());
        this.$inertiaTensorInverse = metric.identityMatrix();
    }

    /**
     * The center of mass position vector in local coordinates.
     */
    get centerOfMassLocal(): T {
        return this.$centerOfMassLocal.get();
    }
    set centerOfMassLocal(centerOfMassLocal: T) {
        mustBeDimensionlessOrCorrectUnits('centerOfMassLocal', centerOfMassLocal, Unit.METER, this.metric);
        this.$centerOfMassLocal.set(centerOfMassLocal);
    }

    /**
     * Mass (scalar). Default is one (1).
     * If dimensioned units are used, they must be compatible with the unit of mass.
     */
    get M(): T {
        return this.$mass.get();
    }
    set M(M: T) {
        mustBeDimensionlessOrCorrectUnits('M', M, Unit.KILOGRAM, this.metric);
        this.$mass.set(M);
        this.updateInertiaTensor();
    }

    /**
     * Charge (scalar). Default is zero (0).
     * If dimensioned units are used, they must be compatible with the unit of electric charge.
     */
    get Q(): T {
        return this.$charge.get();
    }
    set Q(Q: T) {
        mustBeDimensionlessOrCorrectUnits('Q', Q, Unit.COULOMB, this.metric);
        this.$charge.set(Q);
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
        return this.metric.invertMatrix(this.$inertiaTensorInverse);
    }
    /**
     * Sets the Inertia Tensor (in local coordinates) (3x3 matrix), and computes the inverse.
     */
    set I(I: MatrixLike) {
        this.$inertiaTensorInverse = this.metric.invertMatrix(I);
    }

    /**
     * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
     */
    get Iinv(): MatrixLike {
        return this.$inertiaTensorInverse;
    }
    set Iinv(source: MatrixLike) {
        mustBeNonNullObject('Iinv', source);
        mustBeNumber('dimensions', source.dimensions);
        mustBeFunction('getElement', source.getElement);
        this.$inertiaTensorInverse = this.metric.copyMatrix(source);
    }

    /**
     * Position (vector).
     * If dimensioned units are used, they must be compatible with the unit of length.
     */
    get X(): T {
        return this.$X;
    }
    set X(position: T) {
        mustBeDimensionlessOrCorrectUnits('position', position, Unit.METER, this.metric);
        this.metric.copy(position, this.$X);
    }

    /**
     * Attitude (spinor).
     * Effects a rotation from local coordinates to world coordinates.
     */
    get R(): T {
        return this.$R;
    }
    set R(attitude: T) {
        mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit.ONE, this.metric);
        this.metric.copy(attitude, this.$R);
    }

    /**
     * Linear momentum (vector).
     * If dimensioned units are used, they must be compatible with the unit of momentum.
     */
    get P(): T {
        return this.$P;
    }
    set P(momentum: T) {
        mustBeDimensionlessOrCorrectUnits('momentum', momentum, Unit.KILOGRAM_METER_PER_SECOND, this.metric);
        this.metric.copy(momentum, this.$P);
    }

    /**
     * Angular momentum (bivector) in world coordinates.
     * If dimensioned units are used, they must be compatible with the unit of angular momentum.
     */
    get L(): T {
        return this.$L;
    }
    set L(angularMomentum: T) {
        mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit.JOULE_SECOND, this.metric);
        this.metric.copy(angularMomentum, this.$L);
    }

    /**
     * Angular velocity (bivector).
     * If dimensioned units are used, they must be compatible with the unit of angular velocity.
     */
    get Ω(): T {
        // A getter is required in order to support the setter existence.
        return this.$Ω;
    }
    set Ω(angularVelocity: T) {
        mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit.INV_SECOND, this.metric);
        // A setter is used so that assignments do not cause the member variable to become immutable.
        this.metric.copy(angularVelocity, this.$Ω);
    }

    /**
     * 
     */
    get expireTime(): number {
        return Number.POSITIVE_INFINITY;
    }

    /**
     * @hidden
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
        const E = this.$rotationalEnergy.unlock();
        this.metric.copyBivector(this.Ω, E);    // E contains Ω.
        this.metric.rev(E);                     // E contains ~Ω.
        this.metric.scp(E, this.L);             // E contains ~Ω * L, where * means scalar product.
        this.metric.mulByNumber(E, 0.5);        // E contains (1/2) ~Ω * L
        return this.$rotationalEnergy.lock();
    }

    /**
     * (1/2) (P * P) / M
     */
    translationalEnergy(): T {
        assertConsistentUnits('M', this.M, 'P', this.P, this.metric);
        const E = this.$translationalEnergy.unlock();
        this.metric.copyVector(this.P, E);                                          // E contains P.
        this.metric.mulByVector(E, this.P);                                         // E contains P * P.
        this.metric.divByScalar(E, this.metric.a(this.M), this.metric.uom(this.M)); // E contains P * P / M.
        this.metric.mulByNumber(E, 0.5);                                            // E contains (1/2) P * P / M.
        return this.$translationalEnergy.lock();
    }

    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: T, worldPoint: T): void {
        // Note: It appears that we might be able to use the worldPoint argument as a scratch variable.
        // However, it may not have all the features that we need for the intermediate operations.
        this.metric.copyVector(localPoint, this.$worldPoint);
        this.metric.subVector(this.$worldPoint, this.centerOfMassLocal);
        this.metric.rotate(this.$worldPoint, this.R);
        this.metric.addVector(this.$worldPoint, this.X);
        this.metric.writeVector(this.$worldPoint, worldPoint);
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
