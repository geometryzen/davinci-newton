import { SimObject } from '../core/SimObject';
import { Geometric2 } from '../math/Geometric2';
import { Force2 } from './Force2';

/**
 * 
 */
export interface ForceLaw2 extends SimObject {
    updateForces(): Force2[];
    disconnect(): void;
    potentialEnergy(): Geometric2;
}

