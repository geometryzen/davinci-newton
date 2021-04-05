import { Particle } from "../core/Particle";
import { Geometric1 } from "../math/Geometric1";
import { Euclidean1 } from "./Euclidean1";

export class Particle1 extends Particle<Geometric1> {
    /**
     * Constructs a particle in 1 Euclidean dimension.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    constructor(M?: Geometric1, Q?: Geometric1) {
        super(M ? M : Geometric1.one, Q ? Q : Geometric1.one, new Euclidean1());
    }
}
