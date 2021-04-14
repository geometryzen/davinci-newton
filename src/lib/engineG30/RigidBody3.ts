import { RigidBody } from "../core/RigidBody";
import { Geometric3 } from "../math/Geometric3";
import { MetricG30 } from "./MetricG30";

/**
 *
 */
export class RigidBody3 extends RigidBody<Geometric3> {
    constructor() {
        super(new MetricG30());
    }
}
