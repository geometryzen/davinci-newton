import { Engine, EngineOptions } from "../core/Engine";
import { Geometric3 } from "../math/Geometric3";
/**
 * The Physics Engine specialized to 3 dimensions with a Euclidean metric.
 */
export declare class Engine3 extends Engine<Geometric3> {
    constructor(options?: EngineOptions);
}
