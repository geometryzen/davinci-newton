import { Particle } from "../core/Particle";
import { Geometric3 } from "../math/Geometric3";
import { Euclidean3 } from "./Euclidean3";

export class Particle3 extends Particle<Geometric3> {
    constructor(mass: Geometric3, charge: Geometric3) {
        super(mass, charge, new Euclidean3());
    }
}
