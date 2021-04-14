import { EnergySystem } from "../core/EnergySystem";
import { Physics } from "../core/Physics";
import { Geometric1 } from "../math/Geometric1";
import { MetricG10 } from "./MetricG10";
import { KinematicsG10 } from "./KinematicsG10";

/**
 * @hidden
 */
export class Physics1 extends Physics<Geometric1> implements EnergySystem<Geometric1> {
    constructor() {
        super(new MetricG10(), new KinematicsG10());
    }
}
