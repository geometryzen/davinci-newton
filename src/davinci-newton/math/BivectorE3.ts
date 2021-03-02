import { Unit } from './Unit';

export interface BivectorE3 {
    yz: number;
    zx: number;
    xy: number;
    /**
     * The unit of measure.
     */
    uom: Unit;
}
