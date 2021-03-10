import { Unit } from '../math/Unit';
export interface AdvanceStrategy {
    /**
     *
     */
    advance(stepSize: number, uomStep?: Unit): void;
}
