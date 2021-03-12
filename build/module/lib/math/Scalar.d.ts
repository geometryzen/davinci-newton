import { Unit } from './Unit';
/**
 * @hidden
 */
export interface Scalar {
    /**
     * The scalar coordinate as a number.
     */
    a: number;
    /**
     * The unit of measure.
     */
    uom?: Unit;
}
