import { ForceBody } from './ForceBody';
/**
 * @hidden
 */
export interface Massive<T> extends ForceBody<T> {
    M: T;
}
