import CoordMap from '../view/CoordMap';
import DisplayObject from '../view/DisplayObject';
import ScreenRect from '../view/ScreenRect';
import { GraphLine } from './GraphLine';
/**
 *
 */
export declare class DisplayGraph implements DisplayObject {
    /**
     * The GraphLines to draw.
     */
    private readonly graphLines_;
    /**
     *
     */
    private memDraw_;
    /**
     *
     */
    private offScreen_;
    /**
     * to detect when redraw needed;  when the coordmap changes, we need to redraw.
     */
    private lastMap_;
    /**
     *
     */
    private screenRect_;
    /**
     * set when the entire graph needs to be redrawn.
     */
    private needRedraw_;
    /**
     * set when the entire graph needs to be redrawn.
     */
    private useBuffer_;
    /**
     *
     */
    private zIndex;
    /**
     *
     */
    constructor();
    /**
     *
     */
    draw(context: CanvasRenderingContext2D, map: CoordMap): void;
    /**
     *
     */
    drawHotSpot(context: CanvasRenderingContext2D, coordMap: CoordMap, graphLine: GraphLine): void;
    /**
     * Draws the points starting from the specified point to the most recent point;
     * returns the index of last point drawn.
     * @param context the canvas's context to draw into
     * @param coordMap the CoordMap specifying sim to screen conversion
     * @param from the index of the the point to start from, within the datapoints
     * @param graphLine
     * @return the index of the last point drawn.
     */
    private drawPoints;
    fullDraw(context: CanvasRenderingContext2D, coordMap: CoordMap): void;
    getZIndex(): number;
    setZIndex(zIndex: number): void;
    /**
     *
     */
    incrementalDraw(context: CanvasRenderingContext2D, coordMap: CoordMap): void;
    isDragable(): boolean;
    /**
     * Add a GraphLine to be displayed.
     * @param graphLine the GraphLine to be display
     */
    addGraphLine(graphLine: GraphLine): void;
    /**
     * Remove a GraphLine from set of those to display.
     * @param graphLine the GraphLine to not display
     */
    removeGraphLine(graphLine: GraphLine): void;
    setDragable(dragable: boolean): void;
    /**
     * Sets the screen rectangle that this DisplayGraph should occupy within the
     * @param screenRect the screen coordinates of the
     * area this DisplayGraph should occupy.
     */
    setScreenRect(screenRect: ScreenRect): void;
    /**
     * Whether to draw into an offscreen buffer.  A *time graph* must redraw every
     * frame, so it saves time to *not* use an offscreen buffer in that case.
     * @param value Whether to draw into an offscreen buffer
     */
    setUseBuffer(value: boolean): void;
    /**
     * Causes entire graph to be redrawn, when `draw` is next called.
     */
    reset(): void;
}
