import { SimObject } from './SimObject';
import { Force } from './Force';

/**
 * @hidden
 */
export interface ForceLaw<T> extends SimObject {
    /**
     *
     */
    readonly forces: Force<T>[];
    /**
     *
     */
    updateForces(): Force<T>[];
    /**
     * TODO: This does not do anything in the existing implementations of ForceLaw.
     */
    disconnect(): void;
    /**
     * 
     */
    potentialEnergy(): T;
}

