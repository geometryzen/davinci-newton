import { Engine, EngineOptions } from "../core/Engine";
import { Geometric1 } from "../math/Geometric1";
import { Dynamics1 } from "./Dynamics1";
import { Euclidean1 } from "./Euclidean1";

/**
 * The Physics Engine specialized to 1 dimension with a Euclidean metric.
 */
export class Engine1 extends Engine<Geometric1> {
    constructor(options?: EngineOptions) {
        super(new Euclidean1(), new Dynamics1(), options);
    }
}
