import { Engine, EngineOptions } from "../core/Engine";
import { Geometric2 } from "../math/Geometric2";
import { KinematicsG20 } from "./KinematicsG20";
import { Euclidean2 } from "./Euclidean2";

/**
 * The Physics Engine specialized to 2 dimensions with a Euclidean metric.
 */
export class Engine2 extends Engine<Geometric2> {
    constructor(options?: EngineOptions) {
        super(new Euclidean2(), new KinematicsG20(), options);
    }
}
