import { AbstractSubject } from '../util/AbstractSubject';
import { CircularList } from '../util/CircularList';
import { Memorizable } from '../util/Memorizable';
import { Observer } from '../util/Observer';
import { SubjectEvent } from '../util/SubjectEvent';
import { DrawingMode } from '../view/DrawingMode';
import { GraphPoint } from './GraphPoint';
import { GraphStyle } from './GraphStyle';
import { GraphVarsList } from './GraphVarsList';
/**
 * @hidden
 */
export declare class GraphLine extends AbstractSubject implements Memorizable, Observer {
    static readonly PARAM_NAME_X_VARIABLE = "X variable";
    static readonly PARAM_NAME_Y_VARIABLE = "Y variable";
    static readonly PARAM_NAME_LINE_WIDTH = "line width";
    static readonly PARAM_NAME_COLOR = "color";
    static readonly PARAM_NAME_DRAWING_MODE = "drawing mode";
    /**
     * Event broadcasted when reset is called.
     */
    static readonly RESET = "RESET";
    /**
     * The VarsList whose data this graph is displaying
     */
    private readonly varsList_;
    /**
     * index of horizontal variable in simulation's variables, or -1 to not collect any X variable data
     */
    private xVar_;
    /**
     * index of vertical variable in simulation's variables, or -1 to not collect any X variable data
     */
    private yVar_;
    /**
     * Parameter that represents which variable is shown on x-axis, and the available choices of variables.
     */
    private xVarParam_;
    /**
     * Parameter that represents which variable is shown on y-axis, and the available choices of variables.
     */
    private yVarParam_;
    /**
     * Holds the most recent data points drawn, to enable redrawing when needed.
     */
    dataPoints_: CircularList<GraphPoint>;
    /**
     * The color to draw the graph with, a CSS3 color string.
     */
    private drawColor_;
    /**
     * whether to draw the graph with lines or dots
     */
    private drawingMode_;
    /**
     * Thickness to use when drawing the line, in screen coordinates, so a unit is a screen pixel.
     */
    private lineWidth_;
    /**
     * The color to draw the hot spot (most recent point) with, a CSS3 color string.
     */
    private hotspotColor_;
    /**
     * GraphStyle's for display, ordered by index in dataPoints list.
     * There can be multiple GraphStyle entries for the same index, the latest one
     * in the list takes precedence.  We ensure there is always at least one GraphStyle
     * in the list.
     */
    private styles_;
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
    constructor(varsList: GraphVarsList, capacity?: number);
    /**
     * Adds a GraphStyle with the current color, draw mode, and line width, corresponding
     * to the current end point of the HistoryList.
     */
    private addGraphStyle;
    /**
     * Returns true if the object is likely a GraphLine. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a GraphLine
     */
    static isDuckType(obj: any): obj is GraphLine;
    /**
     * Returns the color used when drawing the graph.
     * @return the color used when drawing the graph
     */
    get color(): string;
    /**
     * Returns the drawing mode of the graph: dots or lines.
     * @return the DrawingMode to draw this graph with
     */
    get drawingMode(): DrawingMode;
    /**
     * Returns the HistoryList of GraphPoints.
     */
    getGraphPoints(): CircularList<GraphPoint>;
    /**
     * Returns the GraphStyle corresponding to the position in the list of GraphPoints.
     * @param index  the index number in list of GraphPoints
     */
    getGraphStyle(index: number): GraphStyle;
    /**
     * Returns the color used when drawing the hot spot (most recent point).
     */
    get hotspotColor(): string;
    /**
     * Returns thickness to use when drawing the line, in screen coordinates, so a unit
     * is a screen pixel.
     */
    get lineWidth(): number;
    /**
     * Returns the VarsList that this GraphLine is collecting from
     */
    get varsList(): GraphVarsList;
    /**
     * Returns the index in the VarsList of the X variable being collected.
     * @return the index of X variable in the VarsList, or  -1 if no X variable
     * is being collected.
     */
    get hCoordIndex(): number;
    /**
     * Returns localized X variable name.
     * @return variable name or empty string in case index is -1
     */
    getXVarName(): string;
    /**
     * Returns the index in the VarsList of the Y variable being collected.
     * @return the index of Y variable in the VarsList, or  -1 if no Y variable
     * is being collected.
     */
    get vCoordIndex(): number;
    /**
     * Returns localized Y variable name.
     * @return variable name or empty string in case index is -1
     */
    getYVarName(): string;
    memorize(): void;
    observe(event: SubjectEvent): void;
    /**
     * Forgets any memorized data and styles, starts from scratch.
     */
    reset(): void;
    /**
     * Forgets any memorized styles, records the current color, draw mode, and line width
     * as the single starting style.
     */
    resetStyle(): void;
    /**
     * Sets the color to use when drawing the graph. Applies only to portions of graph
     * memorized after this time.
     * @param color the color to use when drawing the graph, a CSS3 color string.
     */
    set color(color: string);
    /**
     * Sets whether to draw the graph with dots or lines. Applies only to portions of graph
     * memorized after this time.
     * @param drawingMode the DrawingMode (dots or lines) to
     * draw this graph with.
     * @throws Error if the value does not represent a valid DrawingMode
     */
    set drawingMode(drawingMode: DrawingMode);
    /**
     * Sets the color to use when drawing the hot spot (most recent point).
     * Set this to empty string to not draw the hot spot.
     */
    set hotspotColor(color: string);
    /**
     * Sets thickness to use when drawing the line, in screen coordinates, so a unit is a
     * screen pixel. Applies only to portions of graph memorized after this time.
     * @param lineWidth thickness of line in screen coordinates
     */
    set lineWidth(lineWidth: number);
    /**
     * Sets the variable from which to collect data for the X value of the graph.
     * Starts over with a new HistoryList.
     * Broadcasts the parameter named `X_VARIABLE`.
     */
    set hCoordIndex(xVar: number);
    /**
     * Sets the variable from which to collect data for the Y value of the graph.
     * Starts over with a new HistoryList.
     * Broadcasts the parameter named `Y_VARIABLE`.
     */
    set vCoordIndex(yVar: number);
    private checkVarIndex;
}
