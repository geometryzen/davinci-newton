import { Geometric2 } from '../math/Geometric2';
import { Mat1 } from '../math/Mat1';
import { Unit } from '../math/Unit';
import { RigidBody2 } from './RigidBody2';

/**
 * A solid disk of uniform surface density.
 */
export class Disc2 extends RigidBody2 {

    /**
     * The dimension corresponding to the width.
     */
    private readonly radius_: Geometric2;
    private radiusLock_: number;

    /**
     * 
     */
    constructor(radius = Geometric2.one) {
        super();
        this.radius_ = Geometric2.fromScalar(radius);
        this.radiusLock_ = this.radius_.lock();

        if (Unit.isOne(radius.uom)) {
            // dimensionless
        } else {
            this.M = Geometric2.scalar(this.M.a, Unit.KILOGRAM);
            this.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            this.X.uom = Unit.METER;
            this.R.uom = Unit.ONE;
            this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
            this.L.uom = Unit.JOULE_SECOND;
        }

        this.updateInertiaTensor();
    }

    get radius(): Geometric2 {
        return this.radius_;
    }
    set radius(radius: Geometric2) {
        this.radius_.unlock(this.radiusLock_);
        this.radius_.copyScalar(radius.a, radius.uom);
        this.radiusLock_ = this.radius_.lock();
        this.updateInertiaTensor();
    }

    /**
     * L = J(Ω) = (1/2) M R^2 Ω => Ω = 2 * L * (1/M) * (1/R)^2 
     */
    public updateAngularVelocity(): void {
        this.Ω.copyScalar(this.radius_.a, this.radius_.uom);    // Ω contains R 
        this.Ω.quaditude(true);                                 // Ω contains R^2
        this.Ω.mulByScalar(this.M.a, this.M.uom);               // Ω contains M * R^2
        this.Ω.mulByNumber(0.5);                                // Ω contains (1/2) * M * R^2
        this.Ω.inv();                                           // Ω contains 2 * (1/M) * (1/R)^2
        this.Ω.mulByBivector(this.L);                           // Ω contains 2 * L * (1/M) * (1/R)^2
    }

    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     * I = (1/2) M * R^2
     */
    protected updateInertiaTensor(): void {
        const r = this.radius_;
        const s = 0.5 * this.M.a * r.a * r.a;
        const I = new Mat1(s);
        I.uom = Unit.mul(this.M.uom, Unit.mul(r.uom, r.uom));
        this.I = I;
    }
}
