import { CoordType } from '../model/CoordType';
import { AbstractSimObject } from '../objects/AbstractSimObject';
import { Force } from './Force';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
/**
 *
 */
export declare class ConstantForceLaw<T> extends AbstractSimObject implements ForceLaw<T> {
    private body;
    /**
     * The attachment point to the body in body coordinates.
     */
    private readonly $force;
    private readonly $forces;
    private readonly $potentialEnergy;
    private $potentialEnergyLock;
    /**
     *
     * @param body the body that the force acts upon.
     * @param vector the force vector.
     * @param vectorCoordType 0 => LOCAL, 1 => WORLD.
     */
    constructor(body: ForceBody<T>, vector: T, vectorCoordType?: CoordType);
    get forces(): Force<T>[];
    get location(): T;
    set location(location: T);
    get vector(): T;
    set vector(vector: T);
    /**
     *
     */
    updateForces(): Force<T>[];
    /**
     *
     */
    disconnect(): void;
    /**
     *
     */
    potentialEnergy(): T;
}
