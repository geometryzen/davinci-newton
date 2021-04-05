import { Engine, EngineOptions } from "../core/Engine";
import { Geometric2 } from "../math/Geometric2";
/**
 * The Physics Engine specialized to 2 dimensions with a Euclidean metric.
 */
export declare class Engine2 extends Engine<Geometric2> {
    constructor(options?: EngineOptions);
}
