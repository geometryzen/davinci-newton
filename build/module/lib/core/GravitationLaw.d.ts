import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
import { Massive } from './Massive';
/**
 *
 */
export declare class GravitationLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    private body1;
    private body2;
    /**
     * The proportionality constant, Universal gravitational constant or Newton's constant.
     * The default value is one (1).
     */
    private readonly $G;
    private readonly F1;
    private readonly F2;
    private readonly $forces;
    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_;
    private potentialEnergyLock_;
    private readonly metric;
    /**
     *
     */
    constructor(body1: Massive<T>, body2: Massive<T>);
    get G(): T;
    set G(G: T);
    get forces(): Force<T>[];
    /**
     * Computes the forces due to the gravitational interaction.
     * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force<T>[];
    /**
     *
     */
    disconnect(): void;
    /**
     * Computes the potential energy of the gravitational interaction.
     * U = -G m1 m2 / r, where
     * r is the center-of-mass to center-of-mass separation of m1 and m2.
     */
    potentialEnergy(): T;
}
