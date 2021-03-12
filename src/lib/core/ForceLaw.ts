import { SimObject } from './SimObject';
import { Force } from './Force';

/**
 * @hidden
 */
export interface ForceLaw<T> extends SimObject {
    /**
     *
     */
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

