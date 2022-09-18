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

import isObject from '../checks/isObject';
import { AbstractSubject } from '../util/AbstractSubject';
import { CircularList } from '../util/CircularList';
import { GenericEvent } from '../util/GenericEvent';
import { Memorizable } from '../util/Memorizable';
import { Observer } from '../util/Observer';
import { ParameterNumber } from '../util/ParameterNumber';
import { ParameterString } from '../util/ParameterString';
import { SubjectEvent } from '../util/SubjectEvent';
import { veryDifferent } from '../util/veryDifferent';
import { DrawingMode } from '../view/DrawingMode';
import { GraphPoint } from './GraphPoint';
import { GraphStyle } from './GraphStyle';
import { GraphVarsList } from './GraphVarsList';

// const GRAPH_DRAW_MODE = 'graph draw mode';
// const GRAPH_POINTS = 'graph points';
// const CLEAR_GRAPH = 'clear graph';
// const NONE = '-none-';

/**
 * @hidden
 */
export class GraphLine extends AbstractSubject implements Memorizable, Observer {
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
    private readonly varsList_: GraphVarsList;
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
    private hotspotColor_ = 'red';

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
    constructor(varsList: GraphVarsList, capacity?: number) {
        super();
        this.varsList_ = varsList;
        varsList.addObserver(this);
        this.xVar_ = -1;
        this.yVar_ = -1;

        this.xVarParam_ = new ParameterNumber(this, GraphLine.PARAM_NAME_X_VARIABLE, () => this.hCoordIndex, (hCoordIndex: number) => this.hCoordIndex = hCoordIndex);
        this.xVarParam_.setLowerLimit(-1);
        this.addParameter(this.xVarParam_);

        this.yVarParam_ = new ParameterNumber(this, GraphLine.PARAM_NAME_Y_VARIABLE, () => this.vCoordIndex, (vCoordIndex: number) => this.vCoordIndex = vCoordIndex);
        this.yVarParam_.setLowerLimit(-1);
        this.addParameter(this.yVarParam_);

        this.dataPoints_ = new CircularList<GraphPoint>(capacity || 100000);
        this.drawColor_ = 'lime';
        this.drawingMode_ = DrawingMode.LINES;
        // ensure there is always at least one GraphStyle
        this.addGraphStyle();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.xTransform = function (x, y) {
            return x;
        };
        this.yTransform = function (x, y) {
            return y;
        };
        this.addParameter(new ParameterNumber(this, GraphLine.PARAM_NAME_LINE_WIDTH, () => this.lineWidth, (lineWidth: number) => this.lineWidth = lineWidth));
        this.addParameter(new ParameterNumber(this, GraphLine.PARAM_NAME_DRAWING_MODE, () => this.drawingMode, (drawingMode: DrawingMode) => this.drawingMode = drawingMode));
        this.addParameter(new ParameterString(this, GraphLine.PARAM_NAME_COLOR, () => this.color, (color: string) => this.color = color));
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
    static isDuckType(obj: unknown): obj is GraphLine {
        if (obj instanceof GraphLine) {
            return true;
        }
        return isObject(obj)
            && (obj as GraphLine).color !== undefined
            && (obj as GraphLine).lineWidth !== undefined
            && (obj as GraphLine).varsList !== undefined
            && (obj as GraphLine).reset !== undefined
            && (obj as GraphLine).getGraphStyle !== undefined;
    }

    /**
     * Returns the color used when drawing the graph.
     * @return the color used when drawing the graph
     */
    get color(): string {
        return this.drawColor_;
    }

    /**
     * Sets the color to use when drawing the graph. Applies only to portions of graph
     * memorized after this time.
     * @param color the color to use when drawing the graph, a CSS3 color string.
     */
    set color(color: string) {
        if (this.drawColor_ !== color) {
            this.drawColor_ = color;
            this.addGraphStyle();
            this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
        }
    }

    /**
     * Returns the drawing mode of the graph: dots or lines.
     * @return the DrawingMode to draw this graph with
     */
    get drawingMode(): DrawingMode {
        return this.drawingMode_;
    }

    /**
     * Sets whether to draw the graph with dots or lines. Applies only to portions of graph
     * memorized after this time.
     * @param drawingMode the DrawingMode (dots or lines) to
     * draw this graph with.
     * @throws Error if the value does not represent a valid DrawingMode
     */
    set drawingMode(drawingMode: DrawingMode) {
        if (this.drawingMode_ !== drawingMode) {
            this.drawingMode_ = drawingMode;
            this.addGraphStyle();
        }
        this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
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
        const styles = this.styles_;
        if (styles.length === 0) {
            throw new Error('graph styles list is empty');
        }
        // Find the latest style in the styles list with an index less than or
        // equal to the given index.
        let last = styles[0];
        for (let i = 1, len = styles.length; i < len; i++) {
            const s = styles[i];
            if (s.index_ > index) {
                break;
            }
            last = s;
        }
        return last;
    }

    /**
     * Returns the color used when drawing the hot spot (most recent point).
     */
    get hotspotColor(): string {
        return this.hotspotColor_;
    }

    /**
     * Sets the color to use when drawing the hot spot (most recent point).
     * Set this to empty string to not draw the hot spot.
     */
    set hotspotColor(color: string) {
        this.hotspotColor_ = color;
    }

    /**
     * Returns thickness to use when drawing the line, in screen coordinates, so a unit
     * is a screen pixel.
     */
    get lineWidth(): number {
        return this.lineWidth_;
    }

    /**
     * Sets thickness to use when drawing the line, in screen coordinates, so a unit is a
     * screen pixel. Applies only to portions of graph memorized after this time.
     * @param lineWidth thickness of line in screen coordinates
     */
    set lineWidth(lineWidth: number) {
        if (veryDifferent(lineWidth, this.lineWidth_)) {
            this.lineWidth_ = lineWidth;
            this.addGraphStyle();
            this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
        }
    }

    /**
     * Returns the VarsList that this GraphLine is collecting from
     */
    get varsList(): GraphVarsList {
        return this.varsList_;
    }

    /**
     * Returns the index in the VarsList of the X variable being collected.
     * @return the index of X variable in the VarsList, or  -1 if no X variable
     * is being collected.
     */
    get hCoordIndex(): number {
        return this.xVar_;
    }

    /**
     * Sets the variable from which to collect data for the X value of the graph.
     * Starts over with a new HistoryList.
     * Broadcasts the parameter named `X_VARIABLE`.
     */
    set hCoordIndex(xVar: number) {
        this.checkVarIndex(GraphLine.PARAM_NAME_X_VARIABLE, xVar);
        if (xVar !== this.xVar_) {
            this.xVar_ = xVar;
            this.reset();
            this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
        }
    }

    /**
     * Returns localized X variable name.
     * @return variable name or empty string in case index is -1
     */
    getXVarName(): string {
        return this.xVar_ > -1 ? this.varsList_.getName(this.xVar_) : '';
    }

    /**
     * Returns the index in the VarsList of the Y variable being collected.
     * @return the index of Y variable in the VarsList, or  -1 if no Y variable
     * is being collected.
     */
    get vCoordIndex(): number {
        return this.yVar_;
    }

    /**
     * Sets the variable from which to collect data for the Y value of the graph.
     * Starts over with a new HistoryList.
     * Broadcasts the parameter named `Y_VARIABLE`.
     */
    set vCoordIndex(yVar: number) {
        this.checkVarIndex(GraphLine.PARAM_NAME_Y_VARIABLE, yVar);
        if (yVar !== this.yVar_) {
            this.yVar_ = yVar;
            this.reset();
            this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
        }
    }

    /**
     * Returns localized Y variable name.
     * @return variable name or empty string in case index is -1
     */
    getYVarName(): string {
        return this.yVar_ > -1 ? this.varsList_.getName(this.yVar_) : '';
    }

    memorize(): void {
        if (this.xVar_ > -1 && this.yVar_ > -1) {
            const varsList = this.varsList_;
            const x = varsList.getValue(this.xVar_);
            const y = varsList.getValue(this.yVar_);
            const nextX = this.xTransform(x, y);
            const nextY = this.yTransform(x, y);
            const seqX = varsList.getSequence(this.xVar_);
            const seqY = varsList.getSequence(this.xVar_);
            const newPoint = new GraphPoint(nextX, nextY, seqX, seqY);
            // only store if the new point is different from the last point
            const last = this.dataPoints_.getEndValue();
            if (last == null || !last.equals(newPoint)) {
                this.dataPoints_.store(newPoint);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    private checkVarIndex(name: string, index: number): void {
        if (index < -1 || index > this.varsList_.numVariables() - 1) {
            throw new Error(`${name} bad index: ${index}`);
        }
    }
}
