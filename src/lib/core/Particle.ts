import { Metric } from './Metric';
import { RigidBody } from './RigidBody';

/**
 * An object with no internal structure.
 * @hidden
 */
export class Particle<T> extends RigidBody<T> {

    /**
     * @param mass The mass of the particle.
     * @param charge The electric charge of the particle.
     */
    constructor(mass: T, charge: T, metric: Metric<T>) {
        super(metric);
        this.M = mass;
        this.Q = charge;
    }

    /**
     *
     */
    public updateAngularVelocity(): void {
        // Do nothing yet.
        // The angular velocity will remain at zero.
    }

    /**
     * The inertia tensor should always be zero.
     */
    protected updateInertiaTensor(): void {
        // Do nothing yet.
        // The inertia tensor will remain as the identity matrix.
    }
}
