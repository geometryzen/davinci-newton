import { ForceBody } from './ForceBody';
/**
 *
 */
export interface Massive<T> extends ForceBody<T> {
    M: T;
}
