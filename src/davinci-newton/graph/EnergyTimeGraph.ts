import { VarsList } from '../core/VarsList';
import { AlignH } from '../view/AlignH';
import { AlignV } from '../view/AlignV';
import { Graph } from './Graph';
import { GraphLine } from './GraphLine';

/**
 * 
 */
export class EnergyTimeGraph extends Graph {

    /**
     * 
     */
    public readonly translationalEnergyGraphLine: GraphLine;

    /**
     * 
     */
    public readonly rotationalEnergyGraphLine: GraphLine;

    /**
     * 
     */
    public readonly potentialEnergyGraphLine: GraphLine;

    /**
     * 
     */
    public readonly totalEnergyGraphLine: GraphLine;

    /**
     * 
     */
    constructor(canvasId: string, varsList: VarsList, timeIndex: number, transKeIndex: number, rotKeIndex: number, peIndex: number, totalEnergyIndex: number) {
        super(canvasId, varsList);
        // TODO: Make the indices independent of the number of dimensions.
        this.translationalEnergyGraphLine = this.addGraphLine(timeIndex, transKeIndex, 'red');
        this.rotationalEnergyGraphLine = this.addGraphLine(timeIndex, rotKeIndex, 'yellow');
        this.potentialEnergyGraphLine = this.addGraphLine(timeIndex, peIndex, 'blue');
        this.totalEnergyGraphLine = this.addGraphLine(timeIndex, totalEnergyIndex, 'white');

        this.autoScale.timeWindow = 5;
        this.autoScale.addGraphLine(this.translationalEnergyGraphLine);
        this.autoScale.addGraphLine(this.rotationalEnergyGraphLine);
        this.autoScale.addGraphLine(this.potentialEnergyGraphLine);
        this.autoScale.addGraphLine(this.totalEnergyGraphLine);

        this.axes.hAxisAlign = AlignV.BOTTOM;
        this.axes.vAxisAlign = AlignH.LEFT;
        this.axes.hAxisLabel = 'time';
        this.axes.vAxisLabel = 'energy';
    }
}
