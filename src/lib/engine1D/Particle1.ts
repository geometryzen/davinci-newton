import { Particle } from "../core/Particle";
import { Geometric1 } from "../math/Geometric1";
import { Euclidean1 } from "./Euclidean1";

export class Particle1 extends Particle<Geometric1> {
    constructor(mass: Geometric1, charge: Geometric1) {
        super(mass, charge, new Euclidean1());
    }
}
