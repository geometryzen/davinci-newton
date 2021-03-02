import { GeometricE3 } from '../math/GeometricE3';
import { ForceBody3 } from './ForceBody3';

/**
 * 
 */
export interface Charged3 extends ForceBody3 {
    Q: GeometricE3;
}
