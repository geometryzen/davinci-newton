import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Charged } from './Charged';
import { Force } from './Force';
import { ForceLaw } from './ForceLaw';
/**
 * The Electric Force (Coulomb's Law)
 */
export declare class CoulombLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    private readonly body1;
    private readonly body2;
    /**
     * The constant of proportionality.
     */
    private readonly $k;
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
    constructor(body1: Charged<T>, body2: Charged<T>, k?: T);
    /**
     * The proportionality constant, Coulomb's constant.
     * The approximate value in SI units is 9 x 10<sup>9</sup> N·m<sup>2</sup>/C<sup>2</sup>.
     * The default value is one (1).
     */
    get k(): T;
    set k(k: T);
    get forces(): Force<T>[];
    /**
     * Computes the forces due to the Coulomb interaction.
     * F = k * q1 * q2 * direction(r2 - r1) / quadrance(r2 - r1)
     */
    updateForces(): Force<T>[];
    /**
     *
     */
    disconnect(): void;
    /**
     * Computes the potential energy of the gravitational interaction.
     * U = k q1 q2 / r, where
     * r is the center to center separation of m1 and m2.
     */
    potentialEnergy(): T;
}
