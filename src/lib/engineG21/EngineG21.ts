import { Engine, EngineOptions } from "../core/Engine";
import { Spacetime2 } from "../math/Spacetime2";
import { KinematicsG21 } from "./KinematicsG21";
import { MetricG21 } from "./MetricG21";

/**
 * The Physics Engine specialized to 2+1 dimensions with a Spacetime metric.
 */
export class EngineG21 extends Engine<Spacetime2> {
    constructor(options?: EngineOptions) {
        super(new MetricG21(), new KinematicsG21(), options);
    }
}
