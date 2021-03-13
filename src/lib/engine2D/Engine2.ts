import { Engine, EngineOptions } from "../core/Engine";
import { Geometric2 } from "../math/Geometric2";
import { Dynamics2 } from "./Dynamics2";
import { Euclidean2 } from "./Euclidean2";

/**
 *
 */
export class Engine2 extends Engine<Geometric2> {
    constructor(options?: EngineOptions) {
        super(new Euclidean2(), new Dynamics2(), options);
    }
}