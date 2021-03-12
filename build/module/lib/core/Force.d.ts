import { CoordType } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody } from './ForceBody';
import { Metric } from './Metric';
/**
 * @hidden
 */
export declare class Force<T> extends AbstractSimObject {
    private body_;
    private readonly metric;
    /**
     *
     */
    readonly location: T;
    /**
     *
     */
    locationCoordType: CoordType;
    /**
     * The force vector, may be in local or world coordinates.
     */
    readonly vector: T;
    /**
     *
     */
    vectorCoordType: CoordType;
    /**
     * Scratch variable for computing position (world coordinates).
     */
    private readonly position_;
    /**
     * Scratch variable for computing force (world coordinates).
     */
    private readonly force_;
    /**
     *
     */
    constructor(body_: ForceBody<T>, metric: Metric<T>);
    /**
     *
     */
    getBody(): ForceBody<T>;
    /**
     * Computes the force being applied (vector).
     */
    computeForce(force: T): void;
    get F(): T;
    get x(): T;
    /**
     * Computes the point of application of the force in world coordinates.
     */
    computePosition(position: T): void;
    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     */
    computeTorque(torque: T): void;
}
