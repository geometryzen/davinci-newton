import { EnergySystem } from "../core/EnergySystem";
import { Physics } from "../core/Physics";
import { Geometric2 } from "../math/Geometric2";
import { Dynamics2 } from "./Dynamics2";
import { Euclidean2 } from "./Euclidean2";

/**
 *
 */
export class Physics2 extends Physics<Geometric2> implements EnergySystem<Geometric2> {
    constructor() {
        super(new Euclidean2(), new Dynamics2());
    }
}
