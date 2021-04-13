import { AbstractSimObject } from "../objects/AbstractSimObject";
import { Force } from "./Force";
import { ForceLaw } from "./ForceLaw";
import { WORLD } from '../model/CoordType';
import { Charged } from "./Charged";

export class FaradayLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    private readonly force: Force<T>;
    private readonly $forces: [Force<T>];

    /**
     * force = Q * (v << F), where Q is the body charge, v is the body velocity, F is the Faraday field at the body location.
     * @param body the body upon which the field acts.
     * @param field the Faraday field. This field that has a bivector value. 
     */
    constructor(private body: Charged<T>, private field: (position: T) => T) {
        super();
        const metric = body.metric;
        this.force = metric.createForce(body);
        this.force.locationCoordType = WORLD;
        this.force.vectorCoordType = WORLD;
        this.$forces = [this.force];
    }
    get forces(): Force<T>[] {
        return this.$forces;
    }
    updateForces(): Force<T>[] {
        const body = this.body;
        const metric = body.metric;
        const X = body.X;
        const Q = body.Q;
        const F = this.field(X);
        metric.copy(body.P, this.force.vector);                             // vector => P
        metric.lco(this.force.vector, F);                                   // vector => P << F
        metric.mulByScalar(this.force.vector, metric.a(Q), metric.uom(Q));  // vector => Q * (P << F)
        return this.$forces;
    }
    disconnect(): void {
        throw new Error("Method not implemented.");
    }
    potentialEnergy(): T {
        throw new Error("Method not implemented.");
    }
}
