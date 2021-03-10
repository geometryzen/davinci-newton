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
exports.GraphLine = void 0;
var tslib_1 = require("tslib");
var isObject_1 = require("../checks/isObject");
var AbstractSubject_1 = require("../util/AbstractSubject");
var CircularList_1 = require("../util/CircularList");
var GenericEvent_1 = require("../util/GenericEvent");
var ParameterNumber_1 = require("../util/ParameterNumber");
var ParameterString_1 = require("../util/ParameterString");
var veryDifferent_1 = require("../util/veryDifferent");
var DrawingMode_1 = require("../view/DrawingMode");
var GraphPoint_1 = require("./GraphPoint");
var GraphStyle_1 = require("./GraphStyle");
// const GRAPH_DRAW_MODE = 'graph draw mode';
// const GRAPH_POINTS = 'graph points';
// const CLEAR_GRAPH = 'clear graph';
// const NONE = '-none-';
var GraphLine = /** @class */ (function (_super) {
    tslib_1.__extends(GraphLine, _super);
    /**
     *
     */
    function GraphLine(varsList, capacity) {
        var _this = _super.call(this) || this;
        /**
         * Thickness to use when drawing the line, in screen coordinates, so a unit is a screen pixel.
         */
        _this.lineWidth_ = 1.0;
        /**
         * The color to draw the hot spot (most recent point) with, a CSS3 color string.
         */
        _this.hotspotColor_ = 'red';
        /**
         * GraphStyle's for display, ordered by index in dataPoints list.
         * There can be multiple GraphStyle entries for the same index, the latest one
         * in the list takes precedence.  We ensure there is always at least one GraphStyle
         * in the list.
         */
        _this.styles_ = [];
        _this.varsList_ = varsList;
        varsList.addObserver(_this);
        _this.xVar_ = -1;
        _this.yVar_ = -1;
        _this.xVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_X_VARIABLE, function () { return _this.hCoordIndex; }, function (hCoordIndex) { return _this.hCoordIndex = hCoordIndex; });
        _this.xVarParam_.setLowerLimit(-1);
        _this.addParameter(_this.xVarParam_);
        _this.yVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_Y_VARIABLE, function () { return _this.vCoordIndex; }, function (vCoordIndex) { return _this.vCoordIndex = vCoordIndex; });
        _this.yVarParam_.setLowerLimit(-1);
        _this.addParameter(_this.yVarParam_);
        _this.dataPoints_ = new CircularList_1.CircularList(capacity || 100000);
        _this.drawColor_ = 'lime';
        _this.drawingMode_ = DrawingMode_1.DrawingMode.LINES;
        // ensure there is always at least one GraphStyle
        _this.addGraphStyle();
        _this.xTransform = function (x, y) { return x; };
        _this.yTransform = function (x, y) { return y; };
        _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_LINE_WIDTH, function () { return _this.lineWidth; }, function (lineWidth) { return _this.lineWidth = lineWidth; }));
        _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_DRAWING_MODE, function () { return _this.drawingMode; }, function (drawingMode) { return _this.drawingMode = drawingMode; }));
        _this.addParameter(new ParameterString_1.default(_this, GraphLine.PARAM_NAME_COLOR, function () { return _this.color; }, function (color) { return _this.color = color; }));
        return _this;
    }
    /**
     * Adds a GraphStyle with the current color, draw mode, and line width, corresponding
     * to the current end point of the HistoryList.
     */
    GraphLine.prototype.addGraphStyle = function () {
        this.styles_.push(new GraphStyle_1.GraphStyle(this.dataPoints_.getEndIndex() + 1, this.drawingMode_, this.drawColor_, this.lineWidth_));
    };
    /**
     * Returns true if the object is likely a GraphLine. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a GraphLine
     */
    GraphLine.isDuckType = function (obj) {
        if (obj instanceof GraphLine) {
            return true;
        }
        return isObject_1.default(obj) && obj.setXVariable !== undefined
            && obj.setYVariable !== undefined
            && obj.color !== undefined
            && obj.lineWidth !== undefined
            && obj.setAxes !== undefined
            && obj.varsList !== undefined
            && obj.reset !== undefined
            && obj.getGraphStyle !== undefined;
    };
    Object.defineProperty(GraphLine.prototype, "color", {
        /**
         * Returns the color used when drawing the graph.
         * @return the color used when drawing the graph
         */
        get: function () {
            return this.drawColor_;
        },
        /**
         * Sets the color to use when drawing the graph. Applies only to portions of graph
         * memorized after this time.
         * @param color the color to use when drawing the graph, a CSS3 color string.
         */
        set: function (color) {
            if (this.drawColor_ !== color) {
                this.drawColor_ = color;
                this.addGraphStyle();
                this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphLine.prototype, "drawingMode", {
        /**
         * Returns the drawing mode of the graph: dots or lines.
         * @return the DrawingMode to draw this graph with
         */
        get: function () {
            return this.drawingMode_;
        },
        /**
         * Sets whether to draw the graph with dots or lines. Applies only to portions of graph
         * memorized after this time.
         * @param drawingMode the DrawingMode (dots or lines) to
         * draw this graph with.
         * @throws Error if the value does not represent a valid DrawingMode
         */
        set: function (drawingMode) {
            if (this.drawingMode_ !== drawingMode) {
                this.drawingMode_ = drawingMode;
                this.addGraphStyle();
            }
            this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the HistoryList of GraphPoints.
     */
    GraphLine.prototype.getGraphPoints = function () {
        return this.dataPoints_;
    };
    /**
     * Returns the GraphStyle corresponding to the position in the list of GraphPoints.
     * @param index  the index number in list of GraphPoints
     */
    GraphLine.prototype.getGraphStyle = function (index) {
        var styles = this.styles_;
        if (styles.length === 0) {
            throw new Error('graph styles list is empty');
        }
        // Find the latest style in the styles list with an index less than or
        // equal to the given index.
        var last = styles[0];
        for (var i = 1, len = styles.length; i < len; i++) {
            var s = styles[i];
            if (s.index_ > index) {
                break;
            }
            last = s;
        }
        return last;
    };
    Object.defineProperty(GraphLine.prototype, "hotspotColor", {
        /**
         * Returns the color used when drawing the hot spot (most recent point).
         */
        get: function () {
            return this.hotspotColor_;
        },
        /**
         * Sets the color to use when drawing the hot spot (most recent point).
         * Set this to empty string to not draw the hot spot.
         */
        set: function (color) {
            this.hotspotColor_ = color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphLine.prototype, "lineWidth", {
        /**
         * Returns thickness to use when drawing the line, in screen coordinates, so a unit
         * is a screen pixel.
         */
        get: function () {
            return this.lineWidth_;
        },
        /**
         * Sets thickness to use when drawing the line, in screen coordinates, so a unit is a
         * screen pixel. Applies only to portions of graph memorized after this time.
         * @param lineWidth thickness of line in screen coordinates
         */
        set: function (lineWidth) {
            if (veryDifferent_1.default(lineWidth, this.lineWidth_)) {
                this.lineWidth_ = lineWidth;
                this.addGraphStyle();
                this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphLine.prototype, "varsList", {
        /**
         * Returns the VarsList that this GraphLine is collecting from
         */
        get: function () {
            return this.varsList_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphLine.prototype, "hCoordIndex", {
        /**
         * Returns the index in the VarsList of the X variable being collected.
         * @return the index of X variable in the VarsList, or  -1 if no X variable
         * is being collected.
         */
        get: function () {
            return this.xVar_;
        },
        /**
         * Sets the variable from which to collect data for the X value of the graph.
         * Starts over with a new HistoryList.
         * Broadcasts the parameter named `X_VARIABLE`.
         */
        set: function (xVar) {
            this.checkVarIndex(GraphLine.PARAM_NAME_X_VARIABLE, xVar);
            if (xVar !== this.xVar_) {
                this.xVar_ = xVar;
                this.reset();
                this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns localized X variable name.
     * @return variable name or empty string in case index is -1
     */
    GraphLine.prototype.getXVarName = function () {
        return this.xVar_ > -1 ? this.varsList_.getName(this.xVar_) : '';
    };
    Object.defineProperty(GraphLine.prototype, "vCoordIndex", {
        /**
         * Returns the index in the VarsList of the Y variable being collected.
         * @return the index of Y variable in the VarsList, or  -1 if no Y variable
         * is being collected.
         */
        get: function () {
            return this.yVar_;
        },
        /**
         * Sets the variable from which to collect data for the Y value of the graph.
         * Starts over with a new HistoryList.
         * Broadcasts the parameter named `Y_VARIABLE`.
         */
        set: function (yVar) {
            this.checkVarIndex(GraphLine.PARAM_NAME_Y_VARIABLE, yVar);
            if (yVar !== this.yVar_) {
                this.yVar_ = yVar;
                this.reset();
                this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns localized Y variable name.
     * @return variable name or empty string in case index is -1
     */
    GraphLine.prototype.getYVarName = function () {
        return this.yVar_ > -1 ? this.varsList_.getName(this.yVar_) : '';
    };
    GraphLine.prototype.memorize = function () {
        if (this.xVar_ > -1 && this.yVar_ > -1) {
            var varsList = this.varsList_;
            var x = varsList.getValue(this.xVar_);
            var y = varsList.getValue(this.yVar_);
            var nextX = this.xTransform(x, y);
            var nextY = this.yTransform(x, y);
            var seqX = varsList.getSequence(this.xVar_);
            var seqY = varsList.getSequence(this.xVar_);
            var newPoint = new GraphPoint_1.default(nextX, nextY, seqX, seqY);
            // only store if the new point is different from the last point
            var last = this.dataPoints_.getEndValue();
            if (last == null || !last.equals(newPoint)) {
                this.dataPoints_.store(newPoint);
            }
        }
    };
    GraphLine.prototype.observe = function (event) {
        /*
        if (event.getSubject() == this.varsList_) {
            if (event.nameEquals(VarsList.VARS_MODIFIED)) {
                this.buildMenu();
            }
        }
        */
    };
    /**
     * Forgets any memorized data and styles, starts from scratch.
     */
    GraphLine.prototype.reset = function () {
        this.dataPoints_.reset();
        this.resetStyle();
        this.broadcast(new GenericEvent_1.default(this, GraphLine.RESET));
    };
    /**
     * Forgets any memorized styles, records the current color, draw mode, and line width
     * as the single starting style.
     */
    GraphLine.prototype.resetStyle = function () {
        this.styles_ = [];
        // ensure there is always at least one GraphStyle
        this.addGraphStyle();
    };
    GraphLine.prototype.checkVarIndex = function (name, index) {
        if (index < -1 || index > this.varsList_.numVariables() - 1) {
            throw new Error(name + " bad index: " + index);
        }
    };
    GraphLine.PARAM_NAME_X_VARIABLE = 'X variable';
    GraphLine.PARAM_NAME_Y_VARIABLE = 'Y variable';
    GraphLine.PARAM_NAME_LINE_WIDTH = 'line width';
    GraphLine.PARAM_NAME_COLOR = 'color';
    GraphLine.PARAM_NAME_DRAWING_MODE = 'drawing mode';
    /**
     * Event broadcasted when reset is called.
     */
    GraphLine.RESET = 'RESET';
    return GraphLine;
}(AbstractSubject_1.default));
exports.GraphLine = GraphLine;
