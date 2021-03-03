import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody } from './ForceBody';
import { Metric } from './Metric';

/**
 * 
 */
export class Force<T> extends AbstractSimObject {
    /**
     * 
     */
    public readonly location: T;
    /**
     * 
     */
    public locationCoordType: CoordType;
    /**
     * The force vector, may be in local or world coordinates.
     */
    public readonly vector: T;
    /**
     * 
     */
    public vectorCoordType: CoordType;

    /**
     * Scratch variable for computing position (world coordinates).
     */
    private readonly position_: T;
    // private positionLock_ = this.position_.lock();
    /**
     * Scratch variable for computing force (world coordinates).
     */
    private readonly force_: T;
    // private forceLock_ = this.force_.lock();
    /**
     * Scratch variable for computing torque (world coordinates).
     */
    private readonly torque_: T;

    /**
     * 
     */
    constructor(private body_: ForceBody<T>, private readonly metric: Metric<T>) {
        super();
        this.location = metric.zero();
        this.vector = metric.zero();
        this.position_ = metric.zero();
        this.force_ = metric.zero();
        this.torque_ = metric.zero();
    }

    /**
     * 
     */
    getBody(): ForceBody<T> {
        return this.body_;
    }

    /**
     * Computes the force being applied (vector).
     */
    computeForce(force: T): void {
        switch (this.vectorCoordType) {
            case LOCAL: {
                this.metric.copyVector(this.vector, this.force_);   // force_ contains this.vector.
                this.metric.rotate(this.force_, this.body_.R);
                this.metric.writeVector(this.force_, force);
                break;
            }
            case WORLD: {
                this.metric.copyVector(this.vector, this.force_);
                this.metric.writeVector(this.force_, force);
                break;
            }
        }
    }

    get F(): T {
        this.computeForce(this.force_);
        return this.force_;
    }

    get x(): T {
        this.computePosition(this.position_);
        return this.position_;
    }

    /**
     * Computes the point of application of the force in world coordinates.
     */
    computePosition(position: T): void {
        switch (this.locationCoordType) {
            case LOCAL: {
                this.metric.copyVector(this.location, this.position_);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero.
                this.metric.rotate(this.position_, this.body_.R);
                this.metric.addVector(this.position_, this.body_.X);
                this.metric.writeVector(this.position_, position);
                break;
            }
            case WORLD: {
                this.metric.copyVector(this.location, this.position_);
                this.metric.writeVector(this.position_, position);
                break;
            }
        }
    }

    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
     * Torque = r ^ F because r = x - X
     */
    computeTorque(torque: T): void {
        this.computePosition(this.position_);
        this.computeForce(this.force_);
        this.metric.subVector(this.position_, this.body_.X);    // position contains x - X
        this.metric.wedge(this.position_, this.force_);         // 
        this.metric.write(this.position_, torque);
    }
}
