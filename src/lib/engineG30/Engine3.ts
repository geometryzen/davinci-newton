import { Engine, EngineOptions } from "../core/Engine";
import { Geometric3 } from "../math/Geometric3";
import { KinematicsG30 } from "./KinematicsG30";
import { Euclidean3 } from "./Euclidean3";

/**
 * The Physics Engine specialized to 3 dimensions with a Euclidean metric.
 */
export class Engine3 extends Engine<Geometric3> {
    constructor(options?: EngineOptions) {
        super(new Euclidean3(), new KinematicsG30(), options);
    }
}
