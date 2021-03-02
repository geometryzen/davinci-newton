import { VarsList } from '../core/VarsList';
import { Physics3 } from '../engine3D/Physics3';
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
    constructor(canvasId: string, varsList: VarsList) {
        super(canvasId, varsList);
        // TODO: Make the indices independent of the number of dimensions.
        this.translationalEnergyGraphLine = this.addGraphLine(Physics3.INDEX_TIME, Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, 'red');
        this.rotationalEnergyGraphLine = this.addGraphLine(Physics3.INDEX_TIME, Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, 'yellow');
        this.potentialEnergyGraphLine = this.addGraphLine(Physics3.INDEX_TIME, Physics3.INDEX_POTENTIAL_ENERGY, 'blue');
        this.totalEnergyGraphLine = this.addGraphLine(Physics3.INDEX_TIME, Physics3.INDEX_TOTAL_ENERGY, 'white');

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
