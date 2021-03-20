import { Unit } from '../math/Unit';
import { Metric } from './Metric';
import { RigidBody } from './RigidBody';

/**
 * An object with no internal structure.
 * @hidden
 */
export class Particle<T> extends RigidBody<T> {

    /**
     * @param mass The mass of the particle.
     * @param charge The electric charge of the particle.
     */
    constructor(mass: T, charge: T, metric: Metric<T>) {
        super(metric);
        this.M = mass;
        this.Q = charge;
    }

    /**
     *
     */
    public updateAngularVelocity(): void {
        const metric = this.metric;
        if (Unit.isOne(metric.uom(this.L))) {
            if (!Unit.isOne(metric.uom(this.Ω))) {
                metric.setUom(this.Ω, Unit.ONE);
            }
        } else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(metric.uom(this.Ω), Unit.INV_SECOND)) {
                metric.setUom(this.Ω, Unit.INV_SECOND);
            }
        } else {
            throw new Error(`updateAngularVelocity() body.L.uom=${metric.uom(this.L)}, body.Ω.uom=${metric.uom(this.Ω)}`);
        }
    }

    /**
     *
     */
    protected updateInertiaTensor(): void {
        const metric = this.metric;
        if (Unit.isOne(metric.uom(this.L))) {
            if (!Unit.isOne(this.I.uom)) {
                this.I.uom = Unit.ONE;
            }
        } else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
            if (!Unit.isCompatible(this.I.uom, Unit.KILOGRAM_METER_SQUARED)) {
                this.I.uom = Unit.KILOGRAM_METER_SQUARED;
            }
        } else {
            throw new Error(`updateInertiaTensor() body.L.uom=${metric.uom(this.L)}, body.Ω.uom=${metric.uom(this.Ω)}`);
        }
    }
}
