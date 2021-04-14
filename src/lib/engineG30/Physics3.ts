import { EnergySystem } from "../core/EnergySystem";
import { Physics } from "../core/Physics";
import { Geometric3 } from "../math/Geometric3";
import { MetricG30 } from "./MetricG30";
import { KinematicsG30 } from "./KinematicsG30";

/**
 * @hidden
 */
export class Physics3 extends Physics<Geometric3> implements EnergySystem<Geometric3> {
    constructor() {
        super(new MetricG30(), new KinematicsG30());
    }
}
