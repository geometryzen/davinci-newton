import { Engine, EngineOptions } from "../core/Engine";
import { Geometric3 } from "../math/Geometric3";
import { KinematicsG30 } from "./KinematicsG30";
import { MetricG30 } from "./MetricG30";

/**
 * The Physics Engine specialized to 3 dimensions with a Euclidean metric.
 */
export class Engine3 extends Engine<Geometric3> {
    constructor(options?: EngineOptions) {
        super(new MetricG30(), new KinematicsG30(), options);
    }
}
