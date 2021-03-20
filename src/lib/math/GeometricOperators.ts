import { LinearOperators } from './LinearOperators';
import { RingOperators } from './RingOperators';

/**
 * Special methods for operators on elements of geometric spaces.
 * @hidden
 */
export interface GeometricOperators<T, UNIT> extends LinearOperators<T, UNIT>, RingOperators<T, UNIT> {
    __div__(rhs: T | UNIT | number): T;
    __rdiv__(lhs: T | UNIT | number): T;

    __vbar__(rhs: T | UNIT | number): T;
    __rvbar__(lhs: T | UNIT | number): T;

    __wedge__(rhs: T | UNIT | number): T;
    __rwedge__(lhs: T | UNIT | number): T;

    __lshift__(rhs: T | UNIT | number): T;
    __rlshift__(lhs: T | UNIT | number): T;

    __rshift__(rhs: T | UNIT | number): T;
    __rrshift__(lhs: T | UNIT | number): T;

    /**
     * !x = x.inv()
     */
    __bang__(): T;

    /**
     * Inverse (may not exist).
     */
    inv(): T;

    __eq__(rhs: T | UNIT | number): boolean;
    __ne__(rhs: T | UNIT | number): boolean;
    __ge__(rhs: T | UNIT | number): boolean;
    __gt__(rhs: T | UNIT | number): boolean;
    __le__(rhs: T | UNIT | number): boolean;
    __lt__(rhs: T | UNIT | number): boolean;
}
