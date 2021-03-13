import { AbstractSubject } from '../util/AbstractSubject';
import { Memorizable } from '../util/Memorizable';
import { Observer } from '../util/Observer';
import { SubjectEvent } from '../util/SubjectEvent';
import { DoubleRect } from '../view/DoubleRect';
import { SimView } from '../view/SimView';
import { AxisChoice } from './AxisChoice';
import { GraphLine } from './GraphLine';
/**
 * @hidden
 * Watches the VarsList of one or more GraphLines to calculate the range
 * rectangle that encloses the points on the graphs, and sets accordingly the simRect of a
 * SimView. The range rectangle is the smallest rectangle that contains all the points, but
 * possibly expanded by the `extraMargin` factor.
 *
 * Enabled and Active
 *
 * To entirely disable an AutoScale, see `enabled`.
 * Assuming the AutoScale is enabled, it will react to events in the SimView and GraphLines as follows:
 *
 * + AutoScale becomes **inactive** when the SimView's simRect is changed by an entity
 * other than this AutoScale. This happens when AutoScale observes a SimView event called
 * `LabView.SIM_RECT_CHANGED`.
 *
 * + AutoScale becomes **active** when one of its GraphLines broadcasts a `RESET` event.
 * This happens when a graph is cleared, or when the X or Y variable is changed.
 *
 * You can also call `active` directly to make an enabled AutoScale active or
 * inactive.
 *
 * ### Time Graph
 *
 * For a *time graph* where one variable is time, the range rectangle in the time dimension
 * has a fixed size specified by {@link #setTimeWindow}. The default time window is 10
 * seconds.
 *
 * ### Events Broadcast
 *
 * GenericEvent named {@link #AUTO_SCALE} is broadcast when the range rectangle changes.
 *
 * ### Parameters Created
 *
 * + ParameterNumber named `AutoScale.TIME_WINDOW`
 * see {@link #setTimeWindow}.
 *
 * + ParameterNumber named `AutoScale.AXIS`
 * see `axisChoice`.
 */
export declare class AutoScale extends AbstractSubject implements Memorizable, Observer {
    /**
     * Event broadcasted when axis is changed.
     */
    static readonly AXIS = "AXIS";
    /**
     * Event broadcasted when time window is changed.
     */
    static readonly TIME_WINDOW = "TIME_WINDOW";
    /**
     * Name of event broadcast when the active state changes, value is whether active.
     */
    static readonly ACTIVE = "ACTIVE";
    /**
     * Name of event broadcast when a new enclosing simulation rectangle has been calculated.
     */
    static readonly AUTO_SCALE = "AUTO_SCALE";
    /**
     * Name of event broadcast when the enabled state changes, value is whether enabled.
     */
    static readonly ENABLED = "ENABLED";
    /**
     * The GraphLines to auto-scale.
     */
    private graphLines_;
    /**
     *
     */
    private simView_;
    private enabled_;
    private isActive_;
    /**
     * Indicates that the SIM_RECT_CHANGED event was generated by this AutoScale.
     */
    private ownEvent_;
    /**
     * `false` indicates that the range has never been set based on graph data
     */
    private rangeSetX_;
    /**
     * `false` indicates that the range has never been set based on graph data
     */
    private rangeSetY_;
    /**
     * the maximum horizontal value of the range, used for calculating the scale
     */
    private rangeXHi_;
    /**
     * the minimum horizontal value of the range, used for calculating the scale
     */
    private rangeXLo_;
    /**
     * the maximum vertical value of the range, used for calculating the scale
     */
    private rangeYHi_;
    /**
     * the minimum vertical value of the range, used for calculating the scale
     */
    private rangeYLo_;
    /**
     * Length of time to include in the range rectangle for a 'time graph'.
     */
    private timeWindow_;
    /**
     * How much extra margin to allocate when expanding the graph range: a fraction
     * typically between 0.0 and 1.0, adds this fraction times the current horizontal or
     * vertical range.
     * This does not guarantee a margin of this amount, it merely reduces the
     * frequency of range expansion.  You could for example expand the range, and then
     * have succeeding points come very close to the new range so that the graph goes
     * very close to the edge but stays within the range.
     */
    extraMargin: number;
    /**
     * Minimum size that range rectangle can be, for width and height.
     */
    private minSize;
    private axisChoice_;
    /**
     * Index of last point seen within GraphPoints list of each GraphLine
     */
    private lastIndex_;
    /**
     * @param simView the SimView whose simRect will be modified to the range rectangle.
     */
    constructor(simView: SimView);
    /**
     * Add a GraphLine which will be observed to calculate the range rectangle of points
     * on the line.
     * @param graphLine the GraphLine to add
     */
    addGraphLine(graphLine: GraphLine): void;
    /**
     * Clears the range rectangle, continues calculating from latest entry in HistoryList.
     */
    clearRange(): void;
    /**
     * Returns whether is AutoScale is active.
     * @return whether is AutoScale is active
     */
    get active(): boolean;
    /**
     * Returns which axis should be auto scaled.
     */
    get axisChoice(): AxisChoice;
    /**
     * Returns whether is AutoScale is enabled.  See `enabled`.
     * @return whether is AutoScale is enabled
     */
    get enabled(): boolean;
    /**
     * Returns the range rectangle that encloses points on the GraphLines, including any
     * extra margin. Note that this rectangle might not correspond to the SimView's simulation
     * rectangle, see `axisChoice`.
     * @return the range rectangle that encloses points on the GraphLines
     */
    getRangeRect(): DoubleRect;
    /**
     * Returns length of time to include in the range rectangle for a *time graph*.
     * @return length of time to include in the range rectangle
     */
    get timeWindow(): number;
    memorize(): void;
    observe(event: SubjectEvent): void;
    /**
     * When the range rectangle changes, this will broadcast a GenericEvent named
     * `AutoScale.AUTO_SCALE`.
     */
    private rangeCheck_;
    /**
     * Remove a GraphLine, it will no longer be observed for calculating the range
     * rectangle of points on the line.
     * @param graphLine the GraphLine to remove
     */
    removeGraphLine(graphLine: GraphLine): void;
    /**
     * Clears the range rectangle, and starts calculating from first entry in HistoryList.
     * Note that you will need to call {@link #memorize} to have the range recalculated.
     */
    reset(): void;
    /**
     * Sets whether this AutoScale is active.  When not active, the range rectangle
     * is not updated and the SimView's simulation rectangle is not modified. When changed
     * to be active, this will also call {@link #reset}.
     *
     * The AutoScale must be enabled in order to become active, see `enabled`.
     * If not enabled, then this method can only make the AutoScale inactive.
     * @param value whether this AutoScale should be active
     */
    set active(value: boolean);
    /**
     * Set which axis to auto scale.
     */
    set axisChoice(value: AxisChoice);
    /**
     * Marks the SimView's Parameters as to whether they are automatically computed
     * depending on whether this AutoScale is active.
     * @param value whether this AutoScale is computing the Parameter values
     */
    private setComputed;
    /**
     * Sets whether this AutoScale is enabled. The AutoScale must be enabled in order
     * to be active.  See `active`.
     * @param value whether this AutoScale should be enabled
     */
    set enabled(enabled: boolean);
    /**
     * Sets length of time to include in the range rectangle for a *time graph*,
     * and sets the AutoScale to be active.
     * @param timeWindow length of time to include in the range rectangle
     */
    set timeWindow(timeWindow: number);
    /**
     * Updates the graph range to include the given point. For time variable, limit the
     * range to the timeWindow. For non-time variable, expand the range an extra amount when
     * the range is exceeded; this helps avoid too many visually distracting updates.
     * @param line
     * @param nowX
     * @param nowY
     */
    private updateRange_;
}