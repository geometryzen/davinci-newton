import { Unit } from '../math/Unit';
import { AlignH } from '../view/AlignH';
import { AlignV } from '../view/AlignV';
import CoordMap from '../view/CoordMap';
import DisplayObject from '../view/DisplayObject';
import DoubleRect from '../view/DoubleRect';
/**
 * Draws linear horizontal and vertical axes within a given simulation coordinates
 * rectangle. The simulation rectangle determines where the axes are drawn, and the
 * numbering scale shown.
 *
 * Axes are drawn with numbered tick marks. Axes are labeled with
 * names which can be specified by `hAxisLabel` and `vAxisLabel`. Axes
 * are drawn using specified font and color.
 *
 * Options exist for drawing the vertical axis near the left, center, or right, and for
 * drawing the horizontal axis near the top, center, or bottom of the screen. See
 * `hAxisAlign` and `vAxisAlign`.
 *
 * To keep the DisplayAxes in sync with a LabView, when
 * doing for example pan/zoom of the LabView, you can arrange for {@link #setSimRect} to
 * be called by an Observer.
 */
export default class DisplayAxes implements DisplayObject {
    /**
     * bounds rectangle of area to draw
     */
    private simRect_;
    /**
     * the font to use for drawing numbers and text on the axis
     */
    private numFont_;
    /**
     * the color to draw the axes with
     */
    private drawColor_;
    /**
     * Font descent in pixels (guesstimate).
     * @todo find a way to get this for the current font, similar to the TextMetrics object.
     * http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
     * http://pomax.nihongoresources.com/pages/Font.js/
     */
    private fontDescent;
    /**
     * Font ascent in pixels (guesstimate).
     */
    private fontAscent;
    /**
     * location of the horizontal axis, default value is BOTTOM
     */
    private hAxisAlign_;
    /**
     * location of the vertical axis, default value is LEFT
     */
    private vAxisAlign_;
    /**
     * Number of fractional decimal places to show.
     */
    private numDecimal_;
    /**
     * set when this needs to be redrawn
     */
    private needRedraw_;
    /**
     * The label for the horizontal axis.
     */
    private hLabel_;
    /**
     * The scale factor for the horizontal axis.
     */
    private hScale_;
    /**
     *
     */
    private hLabelScaleCache_;
    /**
     * The label for the vertical axis.
     */
    private vLabel_;
    /**
     * The scale factor for the vertical axis.
     */
    private vScale_;
    /**
     *
     */
    private vLabelScaleCache_;
    /**
     *
     */
    private zIndex_;
    /**
     * @param simRect the area to draw axes for in simulation coordinates.
     * @param font the Font to draw numbers and names of axes with
     * @param color the Color to draw the axes with
     */
    constructor(simRect?: DoubleRect, font?: string, color?: string);
    draw(context: CanvasRenderingContext2D, map: CoordMap): void;
    /**
     * Draws the tick marks for the horizontal axis.
     * @param y0 the vertical placement of the horizontal axis, in screen coords
     * @param context the canvas's context to draw into
     * @param map the mapping to use for translating between simulation and screen coordinates
     * @param r the view area in simulation coords
     */
    drawHorizTicks(y0: number, context: CanvasRenderingContext2D, map: CoordMap, r: DoubleRect): void;
    /**
     * Draws the tick marks for the vertical axis.
     * @param x0 the horizontal placement of the vertical axis, in screen coords
     * @param context the canvas's context to draw into
     * @param map the mapping to use for translating between simulation and screen coordinates
     * @param r the view area in simulation coords
     */
    drawVertTicks(x0: number, context: CanvasRenderingContext2D, map: CoordMap, r: DoubleRect): void;
    /**
     * Returns the color to draw the graph axes with.
     * @return the color to draw the graph axes with
     */
    get color(): string;
    /**
     * Returns the font to draw the graph axes with.
     * @return the font to draw the graph axes with
     */
    getFont(): string;
    /**
     * Returns the label shown next to the horizontal axis.
     */
    get hAxisLabel(): string;
    get hAxisScale(): Unit;
    /**
     * Returns an increment to use for spacing of tick marks on an axis.
     * The increment should be a 'round' number, with few fractional decimal places.
     * It should divide the given range into around 5 to 7 pieces.
     *
     * Side effect: modifies the number of fractional digits to show
     *
     * @param range the span of the axis
     * @return an increment to use for spacing of tick marks on an axis.
     */
    private getNiceIncrement;
    /**
     * Returns the starting value for the tick marks on an axis.
     * @param start  the lowest value on the axis
     * @param incr  the increment between tick marks on the axis
     * @return the starting value for the tick marks on the axis.
     */
    private static getNiceStart;
    /**
     * Returns the bounding rectangle for this DisplayAxes in simulation coordinates,
     * which determines the numbering scale shown.
     * @return DoubleRect the bounding rectangle for this DisplayAxes in simulation coordinates.
     */
    getSimRect(): DoubleRect;
    /**
     * Returns the name shown next to the vertical axis.
     */
    get vAxisLabel(): string;
    get vAxisScale(): Unit;
    /**
     * Returns the X-axis alignment: whether it should appear at bottom, top or middle of
     * the simulation rectangle.
     */
    get hAxisAlign(): AlignV;
    /**
     * Returns the Y-axis alignment : whether it should appear at left, right or middle of
     * the simulation rectangle.
     */
    get vAxisAlign(): AlignH;
    getZIndex(): number;
    isDragable(): boolean;
    /**
     * Whether this DisplayAxes has changed since the last time it was drawn.
     * @return true when this DisplayAxes has changed since the last time draw was called.
     */
    needsRedraw(): boolean;
    /**
     * Set the color to draw the graph axes with.
     * @param color the color to draw the graph axes with
     */
    set color(color: string);
    setDragable(dragable: boolean): void;
    /**
     * Set the font to draw the graph axes with.
     * @param font the font to draw the graph axes with
     */
    setFont(font: string): void;
    /**
     * Sets the label shown next to the horizontal axis.
     */
    set hAxisLabel(hAxisLabel: string);
    /**
     * Sets the scale used for the horizontal axis.
     */
    set hAxisScale(hAxisScale: Unit);
    /**
     * Sets the bounding rectangle for this DisplayAxes in simulation coordinates; this
     * determines the numbering scale shown.
     * @param simRect the bounding rectangle for this DisplayAxes in simulation coordinates.
     */
    setSimRect(simRect: DoubleRect): void;
    /**
     * Sets the name shown next to the vertical axis.
     */
    set vAxisLabel(vAxisLabel: string);
    /**
     * Sets the scale used for the horizontal axis.
     */
    set vAxisScale(vAxisScale: Unit);
    /**
     * Sets the horizontal axis alignment: whether it should appear at bottom, top or middle of the
     * simulation rectangle.
     */
    set hAxisAlign(alignment: AlignV);
    /**
     * Sets the vertical axis alignment: whether it should appear at left, right or middle of the
     * simulation rectangle.
     */
    set vAxisAlign(alignment: AlignH);
    setZIndex(zIndex: number): void;
}
