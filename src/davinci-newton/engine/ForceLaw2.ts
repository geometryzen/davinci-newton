import { SimObject } from '../core/SimObject';
import { Force2 } from './Force2';

/**
 * 
 */
export interface ForceLaw2<T> extends SimObject {
    updateForces(): Force2<T>[];
    disconnect(): void;
    potentialEnergy(): T;
}

