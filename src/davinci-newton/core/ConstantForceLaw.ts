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
    private readonly $force: Force<T>;
    private readonly $forces: Force<T>[] = [];
    private readonly $potentialEnergy: T;
    private $potentialEnergyLock: number;

    /**
     * 
     */
    constructor(private $body: ForceBody<T>, vector: T, vectorCoordType: CoordType = WORLD) {
        super();
        const metric = this.$body.metric;
        this.$force = new Force(this.$body, metric);

        this.$force.locationCoordType = LOCAL;
        metric.copyVector(vector, this.$force.vector);
        this.$force.vectorCoordType = vectorCoordType;

        this.$forces = [this.$force];

        this.$potentialEnergy = metric.zero();
        this.$potentialEnergyLock = metric.lock(this.$potentialEnergy);
    }

    get location(): T {
        return this.$force.location;
    }
    set location(location: T) {
        const metric = this.$body.metric;
        metric.copyVector(location, this.$force.location);
    }

    /**
     * 
     */
    updateForces(): Force<T>[] {
        return this.$forces;
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
        const metric = this.$body.metric;
        metric.unlock(this.$potentialEnergy, this.$potentialEnergyLock);
        // metric.se
        // this.potentialEnergy_.a = 0;
        this.$potentialEnergyLock = metric.lock(this.$potentialEnergy);
        return this.$potentialEnergy;
    }
}
