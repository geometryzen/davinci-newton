import { CoordType } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody } from './ForceBody';
/**
 * @hidden
 */
export declare class Force<T> extends AbstractSimObject {
    private readonly body;
    /**
     * The point of application of the force.
     */
    readonly location: T;
    /**
     *
     */
    private $locationCoordType;
    /**
     * The force vector, may be in local or world coordinates.
     */
    readonly vector: T;
    /**
     *
     */
    private $vectorCoordType;
    private readonly $temp1;
    private readonly $temp2;
    /**
     *
     */
    constructor(body: ForceBody<T>);
    /**
     *
     */
    get locationCoordType(): CoordType;
    set locationCoordType(locationCoordType: CoordType);
    /**
     *
     */
    get vectorCoordType(): CoordType;
    set vectorCoordType(vectorCoordType: CoordType);
    /**
     *
     */
    getBody(): ForceBody<T>;
    /**
     * Computes the point of application of the force in world coordinates.
     *
     * @param position (output)
     */
    computePosition(position: T): void;
    /**
     * Computes the force being applied (vector) in WORLD coordinates.
     *
     * @param force (output)
     */
    computeForce(force: T): void;
    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     *
     * @param torque (output)
     */
    computeTorque(torque: T): void;
    get F(): T;
    get x(): T;
}
