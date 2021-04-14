import { RigidBody } from "../core/RigidBody";
import { Geometric1 } from "../math/Geometric1";
import { MetricG10 } from "./MetricG10";

export class RigidBody1 extends RigidBody<Geometric1> {
    constructor() {
        super(new MetricG10());
    }
}
