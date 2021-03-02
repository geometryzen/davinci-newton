import { SimObject } from '../core/SimObject';
import { Geometric3 } from '../math/Geometric3';
import { Force3 } from './Force3';

/**
 * 
 */
export interface ForceLaw3 extends SimObject {
    updateForces(): Force3[];
    disconnect(): void;
    potentialEnergy(): Geometric3;
}

