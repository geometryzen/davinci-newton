import { MatrixLike } from '../math/MatrixLike';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Charged } from './Charged';
import { ForceBody } from './ForceBody';
import { Massive } from './Massive';
import { Metric } from './Metric';
/**
 *
 */
export declare class RigidBody<T> extends AbstractSimObject implements ForceBody<T>, Massive<T>, Charged<T> {
    readonly metric: Metric<T>;
    /**
     * A uniquie identifier assigned by applications.
     * This is not used internally.
     */
    uuid: string;
    /**
     * Mass, M. Default is one (1).
     * Changing the mass requires an update to the intertia tensor,
     * so we want to control the mutability.
     */
    private readonly mass_;
    private massLock_;
    /**
     * Charge, Q. Default is zero (0).
     */
    private readonly charge_;
    private chargeLock_;
    /**
     * Inverse of the Inertia tensor in body coordinates.
     */
    private inertiaTensorInverse_;
    /**
     * the index into the variables array for this rigid body, or -1 if not in vars array.
     */
    private varsIndex_;
    /**
     * The position (vector).
     */
    private readonly position_;
    /**
     * The attitude (spinor).
     */
    private readonly attitude_;
    /**
     * The linear momentum (vector).
     */
    private readonly linearMomentum_;
    /**
     * The angular momentum (bivector).
     */
    private readonly angularMomentum_;
    /**
     * Scratch member variable used only during updateAngularVelocity.
     * The purpose is to avoid temporary object creation.
     */
    private Ω_scratch;
    /**
     * Angular velocity (bivector).
     * The angular velocity is initially created in the unlocked state.
     */
    private angularVelocity_;
    /**
     * center of mass in local coordinates.
     */
    protected centerOfMassLocal_: T;
    protected centerOfMassLocalLock_: number;
    /**
     * Scratch variable for rotational energy.
     */
    private rotationalEnergy_;
    private rotationalEnergyLock_;
    /**
     * Scratch variable for translational energy.
     */
    private translationalEnergy_;
    private translationalEnergyLock_;
    /**
     * Scratch variable for calculation worldPoint.
     */
    private readonly worldPoint_;
    /**
     *
     */
    constructor(metric: Metric<T>);
    /**
     * The center of mass position vector in local coordinates.
     */
    get centerOfMassLocal(): T;
    set centerOfMassLocal(centerOfMassLocal: T);
    /**
     * Mass (scalar). Default is one (1).
     * If dimensioned units are used, they must be compatible with the unit of mass.
     */
    get M(): T;
    set M(M: T);
    /**
     * Charge (scalar). Default is zero (0).
     * If dimensioned units are used, they must be compatible with the unit of electric charge.
     */
    get Q(): T;
    set Q(Q: T);
    /**
     * Updates the angular velocity, Ω, bivector based upon the angular momentum.
     * Derived classes may override to provide more efficient implementations based upon symmetry.
     */
    updateAngularVelocity(): void;
    /**
     * Derived classes should override.
     */
    protected updateInertiaTensor(): void;
    /**
     * Inertia Tensor (in body coordinates) (3x3 matrix).
     */
    get I(): MatrixLike;
    /**
     * Sets the Inertia Tensor (in local coordinates) (3x3 matrix), and computes the inverse.
     */
    set I(I: MatrixLike);
    /**
     * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
     */
    get Iinv(): MatrixLike;
    set Iinv(source: MatrixLike);
    /**
     * Position (vector).
     * If dimensioned units are used, they must be compatible with the unit of length.
     */
    get X(): T;
    set X(position: T);
    /**
     * Attitude (spinor).
     * Effects a rotation from local coordinates to world coordinates.
     */
    get R(): T;
    set R(attitude: T);
    /**
     * Linear momentum (vector).
     * If dimensioned units are used, they must be compatible with the unit of momentum.
     */
    get P(): T;
    set P(momentum: T);
    /**
     * Angular momentum (bivector) in world coordinates.
     * If dimensioned units are used, they must be compatible with the unit of angular momentum.
     */
    get L(): T;
    set L(angularMomentum: T);
    /**
     * Angular velocity (bivector).
     * If dimensioned units are used, they must be compatible with the unit of angular velocity.
     */
    get Ω(): T;
    set Ω(angularVelocity: T);
    /**
     *
     */
    get expireTime(): number;
    /**
     *
     */
    get varsIndex(): number;
    set varsIndex(index: number);
    /**
     * In the following formula, notice the reversion on either Ω or L.
     * Geometrically, this means we depend on the cosine of the angle between the bivectors, since
     * A * ~B = |A||B|cos(...).
     * (1/2) Ω * ~L(Ω) = (1/2) ~Ω * L(Ω) = (1/2) ω * J(ω), where * means scalar product (equals dot product for vectors).
     */
    rotationalEnergy(): T;
    /**
     * (1/2) (P * P) / M
     */
    translationalEnergy(): T;
    /**
     * Converts a point in local coordinates to the same point in world coordinates.
     * x = R (localPoint - centerOfMassLocal) * ~R + X
     */
    localPointToWorldPoint(localPoint: T, worldPoint: T): void;
}
