"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyTimeGraph = void 0;
var tslib_1 = require("tslib");
var Dynamics_1 = require("../core/Dynamics");
var AlignH_1 = require("../view/AlignH");
var AlignV_1 = require("../view/AlignV");
var Graph_1 = require("./Graph");
/**
 *
 */
var EnergyTimeGraph = /** @class */ (function (_super) {
    tslib_1.__extends(EnergyTimeGraph, _super);
    /**
     *
     */
    function EnergyTimeGraph(canvasId, varsList) {
        var _this = _super.call(this, canvasId, varsList) || this;
        // TODO: Make the indices independent of the number of dimensions.
        _this.translationalEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, 'red');
        _this.rotationalEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, 'yellow');
        _this.potentialEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_POTENTIAL_ENERGY, 'blue');
        _this.totalEnergyGraphLine = _this.addGraphLine(Dynamics_1.INDEX_TIME, Dynamics_1.INDEX_TOTAL_ENERGY, 'white');
        _this.autoScale.timeWindow = 5;
        _this.autoScale.addGraphLine(_this.translationalEnergyGraphLine);
        _this.autoScale.addGraphLine(_this.rotationalEnergyGraphLine);
        _this.autoScale.addGraphLine(_this.potentialEnergyGraphLine);
        _this.autoScale.addGraphLine(_this.totalEnergyGraphLine);
        _this.axes.hAxisAlign = AlignV_1.AlignV.BOTTOM;
        _this.axes.vAxisAlign = AlignH_1.AlignH.LEFT;
        _this.axes.hAxisLabel = 'time';
        _this.axes.vAxisLabel = 'energy';
        return _this;
    }
    return EnergyTimeGraph;
}(Graph_1.Graph));
exports.EnergyTimeGraph = EnergyTimeGraph;
