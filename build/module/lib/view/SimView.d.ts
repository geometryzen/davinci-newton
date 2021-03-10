import AbstractSubject from '../util/AbstractSubject';
import Memorizable from '../util/Memorizable';
import { AlignH } from './AlignH';
import { AlignV } from './AlignV';
import CoordMap from './CoordMap';
import DisplayList from './DisplayList';
import DoubleRect from './DoubleRect';
import LabView from './LabView';
import ScreenRect from './ScreenRect';
export declare class SimView extends AbstractSubject implements LabView {
    static readonly PARAM_NAME_WIDTH = "width";
    static readonly PARAM_NAME_HEIGHT = "height";
    static readonly PARAM_NAME_CENTER_X = "center-x";
    static readonly PARAM_NAME_CENTER_Y = "center-y";
    static readonly PARAM_NAME_HORIZONTAL_ALIGN = "horizontal-align";
    static readonly PARAM_NAME_VERTICAL_ALIGN = "vertical-align";
    static readonly PARAM_NAME_ASPECT_RATIO = "aspect-ratio";
    static readonly PARAM_NAME_SCALE_TOGETHER = "scale X-Y together";
    /**
     * Name of event broadcast when the CoordMap changes, see {@link #setCoordMap}.
     */
    static readonly COORD_MAP_CHANGED = "COORD_MAP_CHANGED";
    /**
     * Name of event broadcast when the screen rectangle size changes, see
     */
    static readonly SCREEN_RECT_CHANGED = "SCREEN_RECT_CHANGED";
    /**
     * Name of event broadcast when the simulation rectangle size changes, see
     */
    static readonly SIM_RECT_CHANGED = "SIM_RECT_CHANGED";
    /**
     * when panning horizontally, this is percentage of width to move.
     */
    panX: number;
    /**
     * when panning vertically, this is percentage of height to move.
     */
    panY: number;
    /**
     * when zooming, this is percentage of size to zoom
     */
    zoom: number;
    /**
     * The boundary rectangle in simulation coordinates.
     */
    private simRect_;
    /**
     * The rectangle in screen coordinates where this SimView exists inside the LabCanvas.
     */
    private screenRect_;
    private horizAlign_;
    private verticalAlign_;
    private aspectRatio_;
    /**
     * This list of DisplayObjects that this SimView displays
     */
    private readonly displayList_;
    private scaleTogether_;
    /**
     * The CoordMap that defines the simulation coordinates for this LabView.
     */
    private coordMap_;
    /**
     * The transparency used when painting the drawables; a number between
     * 0.0 (fully transparent) and 1.0 (fully opaque).
     */
    opaqueness: number;
    private width_;
    private height_;
    private centerX_;
    private centerY_;
    /**
     * ratio of height/width, used when scaleTogether_ is true.
     */
    private ratio_;
    private readonly memorizables_;
    /**
     *
     */
    constructor(simRect: DoubleRect);
    addMemo(memorizable: Memorizable): void;
    /**
     *
     */
    gainFocus(): void;
    /**
     * Returns the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis' used when displaying this LabView.
     */
    getAspectRatio(): number;
    /**
     * Returns the horizontal coordinate of simulation rectangle's center.
     */
    getCenterX(): number;
    /**
     * Returns the vertical coordinate of simulation rectangle's center.
     */
    getCenterY(): number;
    getCoordMap(): CoordMap;
    getDisplayList(): DisplayList;
    /**
     * Returns height of the simulation rectangle.
     */
    getHeight(): number;
    /**
     * Returns the horizontal alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    get hAxisAlign(): AlignH;
    getMemos(): Memorizable[];
    /**
     * Whether the width and height of the simulation rectangle scale together; if
     * true then changing one causes the other to change proportionally.
     */
    getScaleTogether(): boolean;
    getScreenRect(): ScreenRect;
    getSimRect(): DoubleRect;
    /**
     * Returns the vertical alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    get vAxisAlign(): AlignV;
    /**
     * Returns the width of the simulation rectangle.
     */
    getWidth(): number;
    loseFocus(): void;
    paint(context: CanvasRenderingContext2D): void;
    setCoordMap(map: CoordMap): void;
    setScreenRect(screenRect: ScreenRect): void;
    setSimRect(simRect: DoubleRect): void;
    memorize(): void;
    private realign;
    /**
     * Modifies the simulation rectangle of the target SimView according to our
     * current settings for width, height, centerX, centerY.
     */
    private modifySimRect;
    /**
     * Moves the center of the simulation rectangle (the 'camera') down by fraction
     * {@link #panY}, which causes the image to move up.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panDown(): void;
    /**
     * Moves the center of the simulation rectangle (the 'camera') left by fraction
     * {@link #panY}, which causes the image to move right.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panLeft(): void;
    /**
     * Moves the center of the simulation rectangle (the 'camera') right by fraction
     * {@link #panY}, which causes the image to move left.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panRight(): void;
    /**
     * Moves the center of the simulation rectangle (the 'camera') up by fraction
     * {@link #panY}, which causes the image to move down.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panUp(): void;
    /**
     *
     */
    removeMemo(memorizable: Memorizable): void;
    /**
     * Sets the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis' used when displaying this LabView.
     * @param {number} aspectRatio the aspect ratio used when displaying this LabView
     */
    setAspectRatio(aspectRatio: number): void;
    /**
     * Sets the horizontal coordinate of simulation rectangle's center,
     * and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param centerX the horizontal coordinate of simulation rectangle's center.
     */
    setCenterX(centerX: number): void;
    /**
     * Sets the vertical coordinate of simulation rectangle's center,
     * and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param {number} value the vertical coordinate of simulation rectangle's center.
     */
    setCenterY(value: number): void;
    /**
     * Sets height of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param {number} value height of the simulation rectangle
     */
    setHeight(value: number): void;
    /**
     * Sets the horizontal alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    set hAxisAlign(alignHoriz: AlignH);
    /**
     * Sets whether the width and height of the simulation rectangle scale together; if
     * true then changing one causes the other to change proportionally.
     * @param {boolean} value whether width and height scale together
     */
    setScaleTogether(value: boolean): void;
    /**
     * Sets the vertical alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    set vAxisAlign(alignVert: AlignV);
    /**
     * Sets width of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param value width of the simulation rectangle
     */
    setWidth(value: number): void;
    /**
     * Makes the height of the simulation rectangle smaller by fraction 1/{@link #zoom},
     * and also the width if {@link #getScaleTogether} is true.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    zoomIn(): void;
    /**
     * Makes the height of the simulation rectangle bigger by fraction {@link #zoom},
     * and also the width if {@link #getScaleTogether} is true.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    zoomOut(): void;
}
