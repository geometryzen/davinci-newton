import { LockableMeasure } from "../core/LockableMeasure";
import { Geometric1 } from "../math/Geometric1";
import { Unit } from "../math/Unit";
import { RigidBody1 } from "./RigidBody1";

export class Block1 extends RigidBody1 {
    private readonly $width: LockableMeasure<Geometric1>;
    constructor(width: Geometric1) {
        super();
        const metric = this.metric;

        this.$width = new LockableMeasure(metric, width);

        if (Unit.isOne(metric.uom(width))) {
            // dimensionless
        } else {
            this.M = metric.scalar(metric.a(this.M), Unit.KILOGRAM);
            this.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
            metric.setUom(this.X, Unit.METER);
            metric.setUom(this.R, Unit.ONE);
            metric.setUom(this.P, Unit.KILOGRAM_METER_PER_SECOND);
            metric.setUom(this.L, Unit.JOULE_SECOND);
        }

        this.updateInertiaTensor();
    }
    get width(): Geometric1 {
        return this.$width.get();
    }
    set width(width: Geometric1) {
        this.$width.set(width);
    }
}
