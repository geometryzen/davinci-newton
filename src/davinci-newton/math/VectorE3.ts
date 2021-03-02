import { Unit } from './Unit';

export interface VectorE3 {
    x: number;
    y: number;
    z: number;
    /**
     * The unit of measure.
     */
    uom: Unit;
}
