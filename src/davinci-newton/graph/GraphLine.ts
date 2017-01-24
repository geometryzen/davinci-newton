// Copyright 2017 David Holmes.  All Rights Reserved.
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

import AbstractSubject from '../util/AbstractSubject';
import CircularList from '../util/CircularList';
import DrawingMode from '../view/DrawingMode';
import GenericEvent from '../util/GenericEvent';
import GraphPoint from './GraphPoint';
import GraphStyle from './GraphStyle';
import isObject from '../checks/isObject';
import Memorizable from '../util/Memorizable';
import mustBeLE from '../checks/mustBeLE';
import mustBeObject from '../checks/mustBeObject';
import Observer from '../util/Observer';
import ParameterNumber from '../util/ParameterNumber';
import ParameterString from '../util/ParameterString';
import SubjectEvent from '../util/SubjectEvent';
import VarsList from '../core/VarsList';
import veryDifferent from '../util/veryDifferent';

// const GRAPH_DRAW_MODE = 'graph draw mode';
// const GRAPH_POINTS = 'graph points';
// const CLEAR_GRAPH = 'clear graph';
// const NONE = '-none-';

export default class GraphLine extends AbstractSubject implements Memorizable, Observer {
    public static readonly PARAM_NAME_X_VARIABLE = 'X variable';
    public static readonly PARAM_NAME_Y_VARIABLE = 'Y variable';

    public static readonly PARAM_NAME_LINE_WIDTH = 'line width';
    public static readonly PARAM_NAME_COLOR = 'color';
    public static readonly PARAM_NAME_DRAWING_MODE = 'drawing mode';
    /**
     * Event broadcasted when reset is called.
     */
    public static readonly RESET = 'RESET';
    /**
     * The VarsList whose data this graph is displaying
     */
    private readonly varsList_: VarsList;
    /**
     * index of horizontal variable in simulation's variables, or -1 to not collect any X variable data
     */
    private xVar_: number;
    /**
     * index of vertical variable in simulation's variables, or -1 to not collect any X variable data
     */
    private yVar_: number;
    /**
     * Parameter that represents which variable is shown on x-axis, and the available choices of variables.
     */
    private xVarParam_: ParameterNumber;
    /**
     * Parameter that represents which variable is shown on y-axis, and the available choices of variables.
     */
    private yVarParam_: ParameterNumber;
    /**
     * Holds the most recent data points drawn, to enable redrawing when needed.
     */
    dataPoints_: CircularList<GraphPoint>;
    /**
     * The color to draw the graph with, a CSS3 color string.
     */
    private drawColor_: string;
    /**
     * whether to draw the graph with lines or dots
     */
    private drawingMode_: DrawingMode;
    /**
     * Thickness to use when drawing the line, in screen coordinates, so a unit is a screen pixel.
     */
    private lineWidth_ = 1.0;
    /**
     * The color to draw the hot spot (most recent point) with, a CSS3 color string.
     */
    private hotSpotColor_ = 'red';

    /**
     * GraphStyle's for display, ordered by index in dataPoints list.
     * There can be multiple GraphStyle entries for the same index, the latest one
     * in the list takes precedence.  We ensure there is always at least one GraphStyle
     * in the list.
     */
    private styles_: GraphStyle[] = [];
    /**
     * Function that gives the transformed the X value.
     */
    xTransform: (x: number, y: number) => number;
    /**
     * Function that gives the transformed the Y value.
     */
    yTransform: (x: number, y: number) => number;

    /**
     * 
     */
    constructor(varsList: VarsList, capacity?: number) {
        super();
        this.varsList_ = varsList;
        varsList.addObserver(this);
        this.xVar_ = -1;
        this.yVar_ = -1;

        this.xVarParam_ = new ParameterNumber(this, GraphLine.PARAM_NAME_X_VARIABLE, () => this.getXVariable(), (index: number) => this.setXVariable(index));
        this.xVarParam_.setLowerLimit(-1);
        this.addParameter(this.xVarParam_);

        this.yVarParam_ = new ParameterNumber(this, GraphLine.PARAM_NAME_Y_VARIABLE, () => this.getYVariable(), (index: number) => this.setYVariable(index));
        this.yVarParam_.setLowerLimit(-1);
        this.addParameter(this.yVarParam_);

        this.dataPoints_ = new CircularList<GraphPoint>(capacity || 100000);
        this.drawColor_ = 'lime';
        this.drawingMode_ = DrawingMode.LINES;
        // ensure there is always at least one GraphStyle
        this.addGraphStyle();
        this.xTransform = function (x, y) { return x; };
        this.yTransform = function (x, y) { return y; };
        this.addParameter(new ParameterNumber(this, GraphLine.PARAM_NAME_LINE_WIDTH, () => this.getLineWidth(), (lineWidth: number) => this.setLineWidth(lineWidth)));
        this.addParameter(new ParameterNumber(this, GraphLine.PARAM_NAME_DRAWING_MODE, () => this.getDrawingMode(), (drawingMode: DrawingMode) => this.setDrawingMode(drawingMode)));
        this.addParameter(new ParameterString(this, GraphLine.PARAM_NAME_COLOR, () => this.getColor(), (color: string) => this.setColor(color)));
    }

    /**
     * Adds a GraphStyle with the current color, draw mode, and line width, corresponding
     * to the current end point of the HistoryList.
     */
    private addGraphStyle(): void {
        this.styles_.push(new GraphStyle(this.dataPoints_.getEndIndex() + 1, this.drawingMode_, this.drawColor_, this.lineWidth_));
    }

    /**
     * Returns true if the object is likely a GraphLine. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a GraphLine
     */
    static isDuckType(obj: any): obj is GraphLine {
        if (obj instanceof GraphLine) {
            return true;
        }
        return isObject(obj) && obj.setXVariable !== undefined
            && obj.setYVariable !== undefined
            && obj.setColor !== undefined
            && obj.setLineWidth !== undefined
            && obj.setAxes !== undefined
            && obj.getVarsList !== undefined
            && obj.reset !== undefined
            && obj.getGraphStyle !== undefined;
    }

    /**
     * Returns the color used when drawing the graph.
     * @return the color used when drawing the graph
     */
    getColor(): string {
        return this.drawColor_;
    }

    /**
     * Returns the drawing mode of the graph: dots or lines.
     * @return the DrawingMode to draw this graph with
     */
    getDrawingMode(): DrawingMode {
        return this.drawingMode_;
    }

    /**
     * Returns the HistoryList of GraphPoints.
     */
    getGraphPoints(): CircularList<GraphPoint> {
        return this.dataPoints_;
    }

    /**
     * Returns the GraphStyle corresponding to the position in the list of GraphPoints.
     * @param index  the index number in list of GraphPoints
     */
    getGraphStyle(index: number): GraphStyle {
        var styles = this.styles_;
        if (styles.length === 0) {
            throw new Error('graph styles list is empty');
        }
        // Find the latest style in the styles list with an index less than or
        // equal to the given index.
        var last = styles[0];
        for (var i = 1, len = styles.length; i < len; i++) {
            var s = styles[i];
            // assert that indices in style list are non-decreasing
            mustBeLE('', last.index_, s.index_);
            if (s.index_ > index)
                break;
            last = s;
        }
        mustBeObject('last', last);
        return last;
    }

    /**
     * Returns the color used when drawing the hot spot (most recent point).
     */
    getHotSpotColor(): string {
        return this.hotSpotColor_;
    }

    /**
     * Returns thickness to use when drawing the line, in screen coordinates, so a unit
     * is a screen pixel.
     */
    getLineWidth(): number {
        return this.lineWidth_;
    }

    /**
     * Returns the VarsList that this GraphLine is collecting from
     */
    getVarsList(): VarsList {
        return this.varsList_;
    }

    /**
     * Returns the index in the VarsList of the X variable being collected.
     * @return the index of X variable in the VarsList, or  -1 if no X variable
     * is being collected.
     */
    getXVariable(): number {
        return this.xVar_;
    }

    /**
     * Returns localized X variable name.
     * @return variable name or empty string in case index is -1
     */
    getXVarName(): string {
        return this.xVar_ > -1 ? this.varsList_.getVariable(this.xVar_).getName() : '';
    }

    /**
     * Returns the index in the VarsList of the Y variable being collected.
     * @return the index of Y variable in the VarsList, or  -1 if no Y variable
     * is being collected.
     */
    getYVariable(): number {
        return this.yVar_;
    }

    /**
     * Returns localized Y variable name.
     * @return variable name or empty string in case index is -1
     */
    getYVarName(): string {
        return this.yVar_ > -1 ? this.varsList_.getVariable(this.yVar_).getName() : '';
    }

    memorize(): void {
        if (this.xVar_ > -1 && this.yVar_ > -1) {
            const varsList = this.varsList_;
            const xVar = varsList.getVariable(this.xVar_);
            const yVar = varsList.getVariable(this.yVar_);
            const x = xVar.getValue();
            const y = yVar.getValue();
            const nextX = this.xTransform(x, y);
            const nextY = this.yTransform(x, y);
            const seqX = xVar.getSequence();
            const seqY = yVar.getSequence();
            const newPoint = new GraphPoint(nextX, nextY, seqX, seqY);
            // only store if the new point is different from the last point
            const last = this.dataPoints_.getEndValue();
            if (last == null || !last.equals(newPoint)) {
                this.dataPoints_.store(newPoint);
            }
        }
    }

    observe(event: SubjectEvent) {
        /*
        if (event.getSubject() == this.varsList_) {
            if (event.nameEquals(VarsList.VARS_MODIFIED)) {
                this.buildMenu();
            }
        }
        */
    }

    /**
     * Forgets any memorized data and styles, starts from scratch.
     */
    reset(): void {
        this.dataPoints_.reset();
        this.resetStyle();
        this.broadcast(new GenericEvent(this, GraphLine.RESET));
    }

    /**
     * Forgets any memorized styles, records the current color, draw mode, and line width
     * as the single starting style.
     */
    resetStyle(): void {
        this.styles_ = [];
        // ensure there is always at least one GraphStyle
        this.addGraphStyle();
    }

    /**
     * Sets the color to use when drawing the graph. Applies only to portions of graph
     * memorized after this time.
     * @param color the color to use when drawing the graph, a CSS3 color string.
     */
    setColor(color: string): void {
        if (this.drawColor_ !== color) {
            this.drawColor_ = color;
            this.addGraphStyle();
            this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
        }
    }

    /**
     * Sets whether to draw the graph with dots or lines. Applies only to portions of graph
     * memorized after this time.
     * @param drawingMode the DrawingMode (dots or lines) to
     * draw this graph with.
     * @throws Error if the value does not represent a valid DrawingMode
     */
    setDrawingMode(drawingMode: DrawingMode) {
        if (this.drawingMode_ !== drawingMode) {
            this.drawingMode_ = drawingMode;
            this.addGraphStyle();
        }
        this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
    }

    /**
     * Sets the color to use when drawing the hot spot (most recent point).
     * Set this to empty string to not draw the hot spot.
     * @param color the color to use when drawing the hot spot (most recent point)
     */
    setHotSpotColor(color: string): void {
        this.hotSpotColor_ = color;
    }

    /**
     * Sets thickness to use when drawing the line, in screen coordinates, so a unit is a
     * screen pixel. Applies only to portions of graph memorized after this time.
     * @param lineWidth thickness of line in screen coordinates
     */
    setLineWidth(lineWidth: number): void {
        if (veryDifferent(lineWidth, this.lineWidth_)) {
            this.lineWidth_ = lineWidth;
            this.addGraphStyle();
            this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
        }
    }

    /**
     * Sets the variable from which to collect data for the X value of the graph. Starts
     * over with a new HistoryList. Broadcasts the ParameterNumber named
     * `GraphLine.i18n.X_VARIABLE`.
     * @param {number} xVar the index of X variable in the VarsList, or -1 to not
     * collect any X variable data and have an empty HistoryList.
     */
    setXVariable(xVar: number): void {
        if (xVar < -1 || xVar > this.varsList_.numVariables() - 1) {
            throw new Error('setXVariable bad index ' + xVar);
        }
        if (xVar !== this.xVar_) {
            this.xVar_ = xVar;
            this.reset();
            this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
        }
    }

    /**
     * Sets the variable from which to collect data for the Y value of the graph. Starts
     * over with a new HistoryList. Broadcasts the ParameterNumber named
     * `GraphLine.i18n.Y_VARIABLE`.
     * @param {number} yVar the index of Y variable in the VarsList, or -1 to not
     * collect any Y variable data and have an empty HistoryList.
     */
    setYVariable(yVar: number): void {
        if (yVar < -1 || yVar > this.varsList_.numVariables() - 1) {
            throw new Error('setYVariable bad index ' + yVar);
        }
        if (yVar !== this.yVar_) {
            this.yVar_ = yVar;
            this.reset();
            this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
        }
    }
}
