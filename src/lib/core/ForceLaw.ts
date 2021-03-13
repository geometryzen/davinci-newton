import { SimObject } from './SimObject';
import { Force } from './Force';

//
// ForceLaw is the
//

/**
 * @hidden
 */
export interface ForceLaw<T> extends SimObject {
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

