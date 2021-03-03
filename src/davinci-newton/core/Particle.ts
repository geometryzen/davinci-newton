import { Metric } from './Metric';
import { RigidBody } from './RigidBody';

/**
 * An object with no internal structure.
 */
export class Particle<T> extends RigidBody<T> {

    /**
     * @param M The mass of the particle.
     * @param Q The electric charge of the particle.
     */
    constructor(M: T, Q: T, metric: Metric<T>) {
        super(metric);
        this.M = M;
        this.Q = Q;
    }

    /**
     *
     */
    public updateAngularVelocity(): void {
        throw new Error();
    }

    /**
     * The inertia tensor should always be zero.
     */
    protected updateInertiaTensor(): void {
        // Do nothing yet.
    }
}
