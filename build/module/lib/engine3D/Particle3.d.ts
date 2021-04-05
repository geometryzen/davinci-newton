import { Particle } from "../core/Particle";
import { Geometric3 } from "../math/Geometric3";
export declare class Particle3 extends Particle<Geometric3> {
    /**
     * Constructs a particle in 2 Euclidean dimensions.
     * @param M The mass of the particle. Default is 1 (dimensionless).
     * @param Q The charge of the particle. Default is 1 (dimensionless).
     */
    constructor(M: Geometric3, Q: Geometric3);
}
