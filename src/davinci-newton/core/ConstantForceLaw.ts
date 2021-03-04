import { CoordType, LOCAL, WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force } from './Force';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';

/**
 * 
 */
export class ConstantForceLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    /**
     * The attachment point to the body in body coordinates.
     */
    private readonly force_: Force<T>;
    private readonly forces: Force<T>[] = [];
    private readonly potentialEnergy_: T;
    private potentialEnergyLock_: number;

    /**
     * 
     */
    constructor(private body_: ForceBody<T>, vector: T, vectorCoordType: CoordType = WORLD) {
        super();
        const metric = this.body_.metric;
        this.force_ = new Force(this.body_, metric);

        this.force_.locationCoordType = LOCAL;
        metric.copyVector(vector, this.force_.vector);
        this.force_.vectorCoordType = vectorCoordType;

        this.forces = [this.force_];

        this.potentialEnergy_ = metric.zero();
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
    }

    get location(): T {
        return this.force_.location;
    }
    set location(location: T) {
        const metric = this.body_.metric;
        metric.copyVector(location, this.force_.location);
    }

    /**
     * 
     */
    updateForces(): Force<T>[] {
        return this.forces;
    }

    /**
     * 
     */
    disconnect(): void {
        // Does nothing
    }

    /**
     * 
     */
    potentialEnergy(): T {
        // TODO: Why do we do this initialization to zero then return a locked object?
        const metric = this.body_.metric;
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
        // this.potentialEnergy_.a = 0;
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    }
}
