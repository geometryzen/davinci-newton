import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { ForceBody } from './ForceBody';

/**
 * @hidden
 */
export abstract class Force<T> extends AbstractSimObject {
    /**
     * 
     */
    public readonly location: T;
    /**
     * 
     */
    public locationCoordType: CoordType;
    /**
     * TODO: Call value or measure?
     * The force vector, may be in local or world coordinates.
     */
    public readonly vector: T;
    /**
     * 
     */
    public vectorCoordType: CoordType;

    private readonly $temp1: T;
    private readonly $temp2: T;

    /**
     * 
     */
    constructor(private readonly body: ForceBody<T>) {
        super();
        const metric = body.metric;
        this.location = metric.zero();
        this.vector = metric.zero();
        this.$temp1 = metric.zero();
        this.$temp2 = metric.zero();
    }

    /**
     * 
     */
    getBody(): ForceBody<T> {
        return this.body;
    }

    /**
     * Computes the force being applied (vector).
     * 
     * @param force (output)
     */
    computeForce(force: T): void {
        const metric = this.body.metric;
        switch (this.vectorCoordType) {
            case LOCAL: {
                metric.copyVector(this.vector, this.$temp2);
                metric.rotate(this.$temp2, this.body.R);
                metric.writeVector(this.$temp2, force);
                break;
            }
            case WORLD: {
                metric.copyVector(this.vector, this.$temp2);
                metric.writeVector(this.$temp2, force);
                break;
            }
        }
    }

    get F(): T {
        this.computeForce(this.$temp2);
        return this.$temp2;
    }

    get x(): T {
        this.computePosition(this.$temp1);
        return this.$temp1;
    }

    /**
     * Computes the point of application of the force in world coordinates.
     * 
     * @param position (output)
     */
    computePosition(position: T): void {
        const metric = this.body.metric;
        switch (this.locationCoordType) {
            case LOCAL: {
                metric.copyVector(this.location, this.$temp1);
                // We could subtract the body center-of-mass in body coordinates here.
                // Instead we assume that it is always zero.
                metric.rotate(this.$temp1, this.body.R);
                metric.addVector(this.$temp1, this.body.X);
                metric.writeVector(this.$temp1, position);
                break;
            }
            case WORLD: {
                metric.copyVector(this.location, this.$temp1);
                metric.writeVector(this.$temp1, position);
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
        this.computePosition(this.$temp1);          // temp1 = x
        this.computeForce(this.$temp2);             // temp2 = F
        const metric = this.body.metric;
        metric.subVector(this.$temp1, this.body.X); // temp1 = x - X
        metric.ext(this.$temp1, this.$temp2);       // temp1 = (x - X) ^ F 
        metric.write(this.$temp1, torque);          // torque = (x - X) ^ F
    }
}
