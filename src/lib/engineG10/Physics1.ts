import { EnergySystem } from "../core/EnergySystem";
import { Physics } from "../core/Physics";
import { Geometric1 } from "../math/Geometric1";
import { KinematicsG10 } from "./KinematicsG10";
import { Euclidean1 } from "./Euclidean1";

/**
 *
 */
export class Physics1 extends Physics<Geometric1> implements EnergySystem<Geometric1> {
    constructor() {
        super(new Euclidean1(), new KinematicsG10());
    }
}
