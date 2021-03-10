import { SimObject } from './SimObject';
import { Force } from './Force';
/**
 *
 */
export interface ForceLaw<T> extends SimObject {
    /**
     *
     */
    updateForces(): Force<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}
