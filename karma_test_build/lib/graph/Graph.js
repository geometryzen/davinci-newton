"use strict";
// Copyright 2017-2021 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var tslib_1 = require("tslib");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeString_1 = require("../checks/mustBeString");
var AbstractSubject_1 = require("../util/AbstractSubject");
var GenericObserver_1 = require("../util/GenericObserver");
var AlignH_1 = require("../view/AlignH");
var AlignV_1 = require("../view/AlignV");
var DoubleRect_1 = require("../view/DoubleRect");
var LabCanvas_1 = require("../view/LabCanvas");
var SimView_1 = require("../view/SimView");
var AutoScale_1 = require("./AutoScale");
var DisplayAxes_1 = require("./DisplayAxes");
var DisplayGraph_1 = require("./DisplayGraph");
var GraphLine_1 = require("./GraphLine");
/**
 * Creates a single graph showing several independent GraphLines, and with a horizontal
 * time axis. Because there is a single SimView and DisplayGraph, all the GraphLines are
 * plotted in the same graph coordinates. The horizontal variable can be changed to
 * something other than time. Creates an AutoScale that ensures all of the GraphLines are
 * visible. Creates several controls to modify the graph.
 *
 * This class is a user interface control. It may manipulate the DOM, adding controls.
 */
var Graph = /** @class */ (function (_super) {
    tslib_1.__extends(Graph, _super);
    /**
     *
     */
    function Graph(canvasId, varsList) {
        var _this = _super.call(this) || this;
        _this.varsList = varsList;
        /**
         *
         */
        _this.view = new SimView_1.SimView(new DoubleRect_1.default(0, 0, 1, 1));
        /**
         *
         */
        _this.autoScale = new AutoScale_1.default(_this.view);
        var canvas = document.getElementById(canvasId);
        _this.labCanvas = new LabCanvas_1.LabCanvas(canvas);
        _this.view.hAxisAlign = AlignH_1.AlignH.FULL;
        _this.view.vAxisAlign = AlignV_1.AlignV.FULL;
        _this.labCanvas.addView(_this.view);
        _this.displayGraph = new DisplayGraph_1.DisplayGraph();
        _this.displayGraph.setScreenRect(_this.view.getScreenRect());
        _this.view.getDisplayList().prepend(_this.displayGraph);
        // Find out where the time is stored in the list of variables.
        _this.timeIdx_ = varsList.timeIndex();
        _this.axes = new DisplayAxes_1.default(_this.view.getSimRect());
        _this.subscription = new GenericObserver_1.default(_this.view, function (event) {
            if (event.nameEquals(SimView_1.SimView.COORD_MAP_CHANGED)) {
                var simRect = _this.view.getCoordMap().screenToSimRect(_this.view.getScreenRect());
                _this.axes.setSimRect(simRect);
            }
        });
        _this.view.getDisplayList().add(_this.axes);
        _this.autoScale.extraMargin = 0.05;
        return _this;
    }
    Graph.prototype.destructor = function () {
        if (this.subscription) {
            this.subscription.disconnect();
            this.subscription = void 0;
        }
    };
    /**
     *
     */
    Graph.prototype.addGraphLine = function (hCoordIndex, vCoordIndex, color) {
        if (color === void 0) { color = 'black'; }
        mustBeNumber_1.default('hCoordIndex', hCoordIndex);
        mustBeNumber_1.default('vCoordIndex', vCoordIndex);
        mustBeString_1.default('color', color);
        var graphLine = new GraphLine_1.GraphLine(this.varsList);
        this.view.addMemo(graphLine);
        graphLine.hCoordIndex = hCoordIndex;
        graphLine.vCoordIndex = vCoordIndex;
        graphLine.color = color;
        graphLine.hotspotColor = color;
        this.displayGraph.addGraphLine(graphLine);
        // Don't use off-screen buffer with time variable because the auto-scale causes
        // graph to redraw every frame.
        this.displayGraph.setUseBuffer(graphLine.hCoordIndex !== this.timeIdx_);
        return graphLine;
    };
    Graph.prototype.removeGraphLine = function (graphLine) {
        this.displayGraph.removeGraphLine(graphLine);
    };
    Graph.prototype.memorize = function () {
        this.labCanvas.memorize();
    };
    Graph.prototype.render = function () {
        this.labCanvas.paint();
    };
    Graph.prototype.reset = function () {
        this.autoScale.reset();
        this.displayGraph.reset();
    };
    return Graph;
}(AbstractSubject_1.default));
exports.Graph = Graph;
