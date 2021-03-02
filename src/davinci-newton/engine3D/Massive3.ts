import { GeometricE3 } from '../math/GeometricE3';
import { ForceBody3 } from './ForceBody3';
/**
 * 
 */
export interface Massive3 extends ForceBody3 {
    M: GeometricE3;
}
