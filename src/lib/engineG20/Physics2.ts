import { EnergySystem } from "../core/EnergySystem";
import { Physics } from "../core/Physics";
import { Geometric2 } from "../math/Geometric2";
import { KinematicsG20 } from "./KinematicsG20";
import { Euclidean2 } from "./Euclidean2";

/**
 *
 */
export class Physics2 extends Physics<Geometric2> implements EnergySystem<Geometric2> {
    constructor() {
        super(new Euclidean2(), new KinematicsG20());
    }
}
