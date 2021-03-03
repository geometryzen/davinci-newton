import { GeometricE2 } from '../math/GeometricE2';
import { ForceBody2 } from './ForceBody2';
/**
 * 
 */
export interface Massive2 extends ForceBody2 {
    M: GeometricE2;
}
