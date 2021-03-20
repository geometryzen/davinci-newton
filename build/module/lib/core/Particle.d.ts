import { Metric } from './Metric';
import { RigidBody } from './RigidBody';
/**
 * An object with no internal structure.
 * @hidden
 */
export declare class Particle<T> extends RigidBody<T> {
    /**
     * @param mass The mass of the particle.
     * @param charge The electric charge of the particle.
     */
    constructor(mass: T, charge: T, metric: Metric<T>);
    /**
     *
     */
    updateAngularVelocity(): void;
    /**
     *
     */
    protected updateInertiaTensor(): void;
}
