import { Particle } from "../core/Particle";
import { Geometric2 } from "../math/Geometric2";
import { Euclidean2 } from "./Euclidean2";

export class Particle2 extends Particle<Geometric2> {
    constructor(mass: Geometric2, charge: Geometric2) {
        super(mass, charge, new Euclidean2());
    }
}
