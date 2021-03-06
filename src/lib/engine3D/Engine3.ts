import { Engine, EngineOptions } from "../core/Engine";
import { Geometric3 } from "../math/Geometric3";
import { Dynamics3 } from "./Dynamics3";
import { Euclidean3 } from "./Euclidean3";

/**
 *
 */
export class Engine3 extends Engine<Geometric3> {
    constructor(options?: EngineOptions) {
        super(new Euclidean3(), new Dynamics3(), options);
    }
}
