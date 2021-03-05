import { EnergySystem } from "../core/EnergySystem";
import { State } from "../core/State";
import { Geometric3 } from "../math/Geometric3";
import { Dynamics3 } from "./Dynamics3";
import { Euclidean3 } from "./Euclidean3";

/**
 *
 */
export class Physics3 extends State<Geometric3> implements EnergySystem<Geometric3> {
    constructor() {
        super(new Euclidean3(), new Dynamics3());
    }
}
