import { GeometricE2 } from '../math/GeometricE2';
import { ForceBody2 } from './ForceBody2';
/**
 * 
 */
export interface Massive2<T> extends ForceBody2<T> {
    M: T;
}
