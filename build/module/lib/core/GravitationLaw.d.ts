import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Massive } from './Massive';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
/**
 *
 */
export declare class GravitationLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    private body1_;
    private body2_;
    /**
     * The proportionality constant, Newton's constant.
     * The default value is one (1).
     */
    G: T;
    private readonly F1;
    private readonly F2;
    private readonly forces;
    /**
     * Scratch variable for computing potential energy.
     */
    private readonly potentialEnergy_;
    private potentialEnergyLock_;
    private readonly metric;
    /**
     *
     */
    constructor(body1_: Massive<T>, body2_: Massive<T>, G: T);
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
