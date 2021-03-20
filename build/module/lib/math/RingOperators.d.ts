import { AbelianOperators } from './AbelianOperators';
/**
 * A ring is an abelian group with a second binary operation that is associative,
 * is distributive over the abelian group operation and has an identity element.
 * @hidden
 */
export interface RingOperators<T, UNIT> extends AbelianOperators<T, UNIT> {
    /**
     * Multiplication of the the target from the right.
     */
    __mul__(rhs: T | UNIT | number): T;
    /**
     * Multiplication of the the target from the left.
     */
    __rmul__(lhs: T | UNIT | number): T;
    /**
     * The multiplicative inverse is denoted by inv.
     */
    inv(): T;
    /**
     * Determines whether this element is the multiplicative identity, <b>1</b>.
     */
    isOne(): boolean;
}
