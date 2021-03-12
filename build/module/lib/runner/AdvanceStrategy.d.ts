import { Unit } from '../math/Unit';
/**
 * @hidden
 */
export interface AdvanceStrategy {
    /**
     *
     */
    advance(stepSize: number, uomStep?: Unit): void;
}
