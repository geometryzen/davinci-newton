import { __extends } from "tslib";
import { INDEX_POTENTIAL_ENERGY, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_TIME, INDEX_TOTAL_ENERGY, INDEX_TRANSLATIONAL_KINETIC_ENERGY } from '../core/Kinematics';
import { AlignH } from '../view/AlignH';
import { AlignV } from '../view/AlignV';
import { Graph } from './Graph';
/**
 * @hidden
 * This is currently exposed to support the existing 3D example.
 */
var EnergyTimeGraph = /** @class */ (function (_super) {
    __extends(EnergyTimeGraph, _super);
    /**
     *
     */
    function EnergyTimeGraph(canvasId, varsList) {
        var _this = _super.call(this, canvasId, varsList) || this;
        // TODO: Make the indices independent of the number of dimensions.
        _this.translationalEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_TRANSLATIONAL_KINETIC_ENERGY, 'red');
        _this.rotationalEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_ROTATIONAL_KINETIC_ENERGY, 'yellow');
        _this.potentialEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_POTENTIAL_ENERGY, 'blue');
        _this.totalEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_TOTAL_ENERGY, 'white');
        _this.autoScale.timeWindow = 5;
        _this.autoScale.addGraphLine(_this.translationalEnergyGraphLine);
        _this.autoScale.addGraphLine(_this.rotationalEnergyGraphLine);
        _this.autoScale.addGraphLine(_this.potentialEnergyGraphLine);
        _this.autoScale.addGraphLine(_this.totalEnergyGraphLine);
        _this.axes.hAxisAlign = AlignV.BOTTOM;
        _this.axes.vAxisAlign = AlignH.LEFT;
        _this.axes.hAxisLabel = 'time';
        _this.axes.vAxisLabel = 'energy';
        return _this;
    }
    return EnergyTimeGraph;
}(Graph));
export { EnergyTimeGraph };
