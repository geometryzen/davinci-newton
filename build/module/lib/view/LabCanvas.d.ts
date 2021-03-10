import AbstractSubject from '../util/AbstractSubject';
import Memorizable from '../util/Memorizable';
import LabView from './LabView';
import ScreenRect from './ScreenRect';
/**
 * Manages an HTML canvas and contains a list of LabView(s)
 * which are drawn into the canvas. The LabViews are drawn overlapping so that the last
 * LabView appears on top of the others.
 *
 * Canvas Size and Shape
 *
 * The HTML canvas has a specified width and height, which determines its resolution and
 * shape. The size can be changed via setWidth, setHeight, or setSize.
 * When the size of the HTML canvas changes, the LabViews are set to have the
 * same screen rectangle as the canvas.
 *
 * Each LabView has a simulation rectangle which is placed over its screen rectangle via a
 * CoordMap. The simulation rectangle specifies the simulation coordinates,
 * and the CoordMap translates simulation coordinates to screen
 * coordinates. Pan and zoom can be accomplished by changing the simulation rectangle of a
 * LabView (which changes its CoordMap accordingly).
 *
 * Focus View
 *
 * The first LabView that is added becomes the **focus view**. The focus view is treated
 * specially by some classes.
 *
 * Background Color
 *
 * Whenever {@link #paint} is called to draw a new frame, the first step is to clear the
 * old frame from the HTML canvas.
 *
 * + If no background color is specified (an empty string) then we use the
 * JavaScript `canvas.clearRect()` method which clears to transparent black pixels.
 *
 * + If a background color is specified, then we use JavaScript
 * `canvas.fillRect()` to fill the HTML canvas with that color.
 *
 * The background color can be set with {@link #setBackground}.
 *
 * Trails Effect
 *
 * A visual effect where moving objects leave behind a smeared out trail can be done by
 * setting the background color and the *alpha* transparency, see {@link #setAlpha}.
 * Here are example settings:
 *
 * simCanvas.setBackground('black');
 * simCanvas.setAlpha(0.05);
 *
 * When `alpha` is 1.0 then there is no trails effect because the old frame is entirely
 * painted over with an opaque color.
 *
 * The trails effect happens when `alpha` is less than 1 because we paint a translucent
 * rectangle over the old frame, which gradually makes the old image disappear after
 * several iterations of painting.
 *
 * ### Parameters Created
 *
 * + ParameterNumber named `LabCanvas.en.WIDTH`
 * see {@link #setWidth}
 *
 * + ParameterNumber named `LabCanvas.en.HEIGHT`
 * see {@link #setHeight}
 *
 * ### Events Broadcast
 *
 * LabCanvas broadcasts these GenericEvent(s) to its Observers:
 *
 * + {@link #VIEW_ADDED} the value of the GenericEvent is the LabView being added
 *
 * + {@link #VIEW_REMOVED} the value of the GenericEvent is the LabView being removed
 *
 * + {@link #FOCUS_VIEW_CHANGED} the value of the GenericEvent is the LabView which is
 * the focus, or `null` if there is no focus view
 *
 * + {@link #VIEW_LIST_MODIFIED}
 *
 * + {@link #SIZE_CHANGED}
 */
export declare class LabCanvas extends AbstractSubject {
    /**
     * Name of GenericEvent that is broadcast when the focus view changes.
     */
    static FOCUS_VIEW_CHANGED: string;
    /**
     * Name of GenericEvent that is broadcast when the size of the HTML canvas changes.
     */
    static SIZE_CHANGED: string;
    /**
     * Name of GenericEvent that is broadcast when the list of LabViews is modified.
     */
    static VIEW_LIST_MODIFIED: string;
    /**
     * Name of GenericEvent that is broadcast when a LabView is added.
     */
    static VIEW_ADDED: string;
    /**
     * Name of GenericEvent that is broadcast when a LabView is removed.
     */
    static VIEW_REMOVED: string;
    /**
     *
     */
    private readonly canvas_;
    /**
     *
     */
    private readonly labViews_;
    /**
     *
     */
    private readonly memorizables_;
    /**
     * The view which is the main focus and is drawn normally.
     */
    private focusView_;
    /**
     * The transparency used when painting the background color; a number between
     * 0.0 (fully transparent) and 1.0 (fully opaque).
     */
    private alpha_;
    /**
     * The background color; either a CSS3 color value or the empty string. Transparent
     * black is used if it is the empty string.
     */
    private background_;
    /**
     *
     */
    /**
     *
     */
    constructor(canvas: HTMLCanvasElement);
    addMemo(memorizable: Memorizable): void;
    /**
     * Adds the LabView to the end of the list of LabViews displayed and memorized by this
     * LabCanvas. Makes the LabView the focus view if there isn't currently a focus view.
     * Notifies any Observers by broadcasting GenericEvents named {@link #VIEW_ADDED} and
     * {@link #VIEW_LIST_MODIFIED} and possibly also {@link #FOCUS_VIEW_CHANGED}.
     * @param view the LabView to add
     */
    addView(view: LabView): void;
    /**
     * Moves the keyboard focus to the HTML canvas.
     */
    focus(): void;
    /**
     * Returns the transparency used when painting; a number between 0.0 (fully transparent)
     * and 1.0 (fully opaque). Only has an effect if the background color is non-empty string.
     * @return transparency used when painting, between 0 and 1.
     */
    getAlpha(): number;
    /**
     * Returns the background color; either a CSS3 color value or the empty string. Empty
     * string means that background is cleared to transparent black.
     * @return the background color; either a CSS3 color value or the empty string.
     */
    getBackground(): string;
    /**
     * Returns the HTML canvas being managed by this LabCanvas.
     * @return the HTML canvas being managed by this LabCanvas
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * Returns the CanvasRenderingContext2D used for drawing into the HTML canvas being
     * managed by this LabCanvas.
     * @return the CanvasRenderingContext2D used for drawing into the HTML canvas
     */
    getContext(): CanvasRenderingContext2D;
    /**
     * Returns the focus LabView which is the main focus of the LabCanvas.
     * @return the focus LabView, or `null` when there is no focus LabView
     */
    getFocusView(): LabView;
    /**
     * Returns the height of the HTML canvas, in screen coords (pixels).
     */
    getHeight(): number;
    getMemos(): Memorizable[];
    /**
     * Returns the ScreenRect corresponding to the area of the HTML canvas.
     * The top-left coordinate is always (0,0).  This does not represent the location
     * of the canvas within the document or window.
     */
    getScreenRect(): ScreenRect;
    /**
     * Returns list of the LabViews in this LabCanvas.
     */
    getViews(): LabView[];
    /**
     * Returns the width of the HTML canvas, in screen coords (pixels).
     */
    getWidth(): number;
    memorize(): void;
    notifySizeChanged(): void;
    /**
     * Clears the canvas to the background color; then paints each LabView.
     */
    paint(): void;
    removeMemo(memorizable: Memorizable): void;
    /**
     * Removes the LabView from the list of LabViews displayed and memorized by this
     * LabCanvas. Sets the focus view to be the first view in remaining list of LabViews.
     * Notifies any Observers by broadcasting GenericEvents named VIEW_LIST_MODIFIED
     * and IEW_REMOVED and possibly also FOCUS_VIEW_CHANGED.
     * @param view the LabView to remove
     */
    removeView(view: LabView): void;
    /**
     * Sets the transparency used when painting; a number between 0.0 (fully transparent)
     * and 1.0 (fully opaque). Only has an effect if the background color is non-empty string.
     * @param value transparency used when painting, between 0 and 1
     */
    setAlpha(value: number): void;
    /**
     * Sets the background color; either a CSS3 color value or the empty string. Empty
     * string means that background is cleared to transparent black.
     * @param value the background color; either a CSS3 color value or the empty string
     */
    setBackground(value: string): void;
    /**
     * Sets the focus LabView which is the main focus of the LabCanvas. Notifies any
     * observers that the focus has changed by broadcasting the GenericEvent named FOCUS_VIEW_CHANGED.
     * @param view the view that should be the focus; can be `null` when no LabView has the focus.
     * @throws Error if `view` is not contained by this LabCanvas
     */
    setFocusView(view: LabView): void;
    /**
     * Sets the height of the HTML canvas, and sets the screen rectangle of all the
     * LabViews. Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
     * @param value  the height of the canvas, in screen coords (pixels).
     */
    setHeight(value: number): void;
    /**
     * Sets the size of this LabCanvas to the given ScreenRect by calling {@link #setSize}.
     *  @param sr  specifies the width and height; the top-left must be (0,0).
     *  @throws if the top-left of the given ScreenRect is not (0,0).
     */
    setScreenRect(sr: ScreenRect): void;
    /**
     * Sets the size of the HTML canvas. All LabViews are set to have the
     * same screen rectangle as this LabCanvas by calling setScreenRect.
     * Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
     * @param width  the width of the canvas, in screen coords (pixels)
     * @param height  the height of the canvas, in screen coords (pixels)
     */
    setSize(width: number, height: number): void;
    /**
     * Sets the width of the HTML canvas, and sets the screen rectangle of all the
     * LabViews. Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
     * @param value  the width of the canvas, in screen coords (pixels).
     */
    setWidth(value: number): void;
}
