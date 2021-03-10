import { ForceBody } from './ForceBody';

/**
 * 
 */
export interface Charged<T> extends ForceBody<T> {
    Q: T;
}
