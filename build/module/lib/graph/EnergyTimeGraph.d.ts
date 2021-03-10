import { VarsList } from '../core/VarsList';
import { Graph } from './Graph';
import { GraphLine } from './GraphLine';
/**
 *
 */
export declare class EnergyTimeGraph extends Graph {
    /**
     *
     */
    readonly translationalEnergyGraphLine: GraphLine;
    /**
     *
     */
    readonly rotationalEnergyGraphLine: GraphLine;
    /**
     *
     */
    readonly potentialEnergyGraphLine: GraphLine;
    /**
     *
     */
    readonly totalEnergyGraphLine: GraphLine;
    /**
     *
     */
    constructor(canvasId: string, varsList: VarsList);
}
