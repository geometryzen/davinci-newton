import { WORLD } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Charged } from './Charged';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
import { Metric } from './Metric';
/**
 * 
 */
export class CoulombLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    /**
     * The proportionality constant, Coulomb's constant.
     * The approximate value in SI units is 9 x 10<sup>9</sup> N·m<sup>2</sup>/C<sup>2</sup>.
     * The default value is one (1).
     */
    public k: T;

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
    constructor(private body1_: Charged<T>, private body2_: Charged<T>, k: T) {
        super();
        this.metric = body1_.metric;
        const metric = this.metric;
        this.F1 = metric.createForce(this.body1_);
        this.F1.locationCoordType = WORLD;
        this.F1.vectorCoordType = WORLD;

        this.F2 = metric.createForce(this.body2_);
        this.F2.locationCoordType = WORLD;
        this.F2.vectorCoordType = WORLD;

        this.k = k;

        this.$forces = [this.F1, this.F2];
        this.potentialEnergy_ = metric.zero();
        this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
    }

    get forces(): Force<T>[] {
        return this.$forces;
    }

    /**
     * Computes the forces due to the Coulomb interaction.
     * F = k * q1 * q2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force<T>[] {
        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;

        const metric = this.metric;

        // The direction of the force is computed such that like charges repel each other.
        metric.copyVector(this.body1_.X, numer);
        metric.subVector(numer, this.body2_.X);

        metric.copyVector(numer, denom);
        metric.squaredNorm(denom);

        metric.direction(numer);
        metric.mulByScalar(numer, metric.a(this.k), metric.uom(this.k));
        metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
        metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));

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
     * U = k q1 q2 / r, where
     * r is the center to center separation of m1 and m2.
     */
    potentialEnergy(): T {
        const metric = this.metric;
        // Unlock the variable that we will use for the result.
        metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);

        // We can use the F1.location and F2.location as temporary variables
        // as long as we restore their contents.
        const numer = this.F1.location;
        const denom = this.F2.location;
        // The numerator of the potential energy formula is k * Q1 * Q2.
        metric.copyScalar(metric.a(this.k), metric.uom(this.k), numer);
        metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
        metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
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
