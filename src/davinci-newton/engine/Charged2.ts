import { ForceBody2 } from './ForceBody2';

/**
 * 
 */
export interface Charged2<T> extends ForceBody2<T> {
    Q: T;
}
