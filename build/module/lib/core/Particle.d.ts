import { Metric } from './Metric';
import { RigidBody } from './RigidBody';
/**
 * An object with no internal structure.
 * @hidden
 */
export declare class Particle<T> extends RigidBody<T> {
    /**
     * @param M The mass of the particle. The mass is copied into the `M` property. Default is 1 (dimensionless).
     * @param Q The electric charge of the particle. The charge is copied into the `Q` property. Default is 1 (dimensionless).
     */
    constructor(M: T | undefined, Q: T | undefined, metric: Metric<T>);
    /**
     *
     */
    updateAngularVelocity(): void;
    /**
     *
     */
    protected updateInertiaTensor(): void;
}
