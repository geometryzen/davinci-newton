import { LinearOperators } from './LinearOperators';
import { RingOperators } from './RingOperators';

/**
 * Special methods for operators on elements of geometric spaces.
 * @hidden
 */
export interface GeometricOperators<T, UNIT> extends LinearOperators<T, UNIT>, RingOperators<T, UNIT> {
    __div__(rhs: any): T;
    __rdiv__(lhs: any): T;

    __vbar__(rhs: any): T;
    __rvbar__(lhs: any): T;

    __wedge__(rhs: any): T;
    __rwedge__(lhs: any): T;

    __lshift__(rhs: any): T;
    __rlshift__(lhs: any): T;

    __rshift__(rhs: any): T;
    __rrshift__(lhs: any): T;

    /**
     * !x = x.inv()
     */
    __bang__(): T;

    /**
     * Inverse (may not exist).
     */
    inv(): T;

    __eq__(rhs: T): boolean;
    __ne__(rhs: T): boolean;
    __ge__(rhs: T): boolean;
    __gt__(rhs: T): boolean;
    __le__(rhs: T): boolean;
    __lt__(rhs: T): boolean;
}
