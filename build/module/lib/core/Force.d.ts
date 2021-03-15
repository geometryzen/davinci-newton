import { CoordType } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody } from './ForceBody';
/**
 * @hidden
 */
export declare abstract class Force<T> extends AbstractSimObject {
    private readonly body;
    /**
     *
     */
    readonly location: T;
    /**
     *
     */
    locationCoordType: CoordType;
    /**
     * TODO: Call value or measure?
     * The force vector, may be in local or world coordinates.
     */
    readonly vector: T;
    /**
     *
     */
    vectorCoordType: CoordType;
    private readonly $temp1;
    private readonly $temp2;
    /**
     *
     */
    constructor(body: ForceBody<T>);
    /**
     *
     */
    getBody(): ForceBody<T>;
    /**
     * Computes the force being applied (vector).
     *
     * @param force (output)
     */
    computeForce(force: T): void;
    get F(): T;
    get x(): T;
    /**
     * Computes the point of application of the force in world coordinates.
     *
     * @param position (output)
     */
    computePosition(position: T): void;
    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     */
    computeTorque(torque: T): void;
}
