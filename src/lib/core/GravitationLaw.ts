import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Massive } from './Massive';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
import { Metric } from './Metric';

/**
 * @hidden
 */
export class GravitationLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    /**
     * The proportionality constant, Newton's constant.
     * The default value is one (1).
     */
    public G: T;

    private readonly F1: Force<T>;
    private readonly F2: Force<T>;
    private readonly $forces: Force<T>[] = [];

    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_: T;
    private potentialEnergyLock_: number;
    private readonly metric: Metric<T>;

    /**
     * 
     */
    constructor(private body1_: Massive<T>, private body2_: Massive<T>, G: T) {
        super();
        this.metric = body1_.metric;
        const metric = this.metric;
        this.F1 = metric.createForce(this.body1_);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = metric.createForce(this.body2_);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        this.G = G;

        this.$forces = [this.F1, this.F2];
        this.potentialEnergy_ = metric.zero();
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
    }

    get forces(): Force<T>[] {
        return this.$forces;
    }

    /**
     * Computes the forces due to the gravitational interaction.
     * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force<T>[] {
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;

        const metric = this.metric;

        // The direction of the force is computed such that masses always attract each other.
        metric.copyVector(this.body2_.X, numer);
        metric.subVector(numer, this.body1_.X);

        metric.copyVector(numer, denom);
        metric.squaredNorm(denom);

        metric.direction(numer);
        metric.mulByScalar(numer, metric.a(this.G), metric.uom(this.G));
        metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
        metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));

        metric.copyVector(numer, this.F1.vector);
        metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));

        metric.copyVector(this.F1.vector, this.F2.vector);
        metric.neg(this.F2.vector);

        // Restore the contents of the location variables.
        metric.copyVector(this.body1_.X, this.F1.location);
        metric.copyVector(this.body2_.X, this.F2.location);

        return this.$forces;
    }

    /**
     * 
     */
    disconnect(): void {
        // Does nothing
    }

    /**
     * Computes the potential energy of the gravitational interaction.
     * U = -G m1 m2 / r, where
     * r is the center-of-mass to center-of-mass separation of m1 and m2.
     */
    potentialEnergy(): T {
        const metric = this.metric;
        // Unlock the variable that we will use for the result.
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);

        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;
        // The numerator of the potential energy formula is -G * m1 * m2.
        metric.copyScalar(metric.a(this.G), metric.uom(this.G), numer);
        metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
        metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
        metric.neg(numer);
        // The denominator is |r1 - r2|.
        metric.copyVector(this.body1_.X, denom);
        metric.subVector(denom, this.body2_.X);
        metric.norm(denom);
        // Combine the numerator and denominator.
        metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
        metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));

        // Restore the contents of the location variables.
        metric.copyVector(this.body1_.X, this.F1.location);
        metric.copyVector(this.body2_.X, this.F2.location);

        // We're done. Lock down the result.
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
        return this.potentialEnergy_;
    }
}
