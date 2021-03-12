import { AffineTransform } from './AffineTransform';
import { AlignH } from './AlignH';
import { AlignV } from './AlignV';
import { DoubleRect } from './DoubleRect';
import Point from './Point';
import { ScreenRect } from './ScreenRect';
/**
 * @hidden
 * Provides the mapping between screen (canvas) coordinates and simulation coordinates;
 * this is an immutable object.
 *
 * + **Screen coordinates** corresponds to pixels on an HTML canvas; the vertical
 * coordinate increases going down, with zero usually being the top of the canvas.
 *
 * + **Simulation coordinates** the vertical coordinate increases going up; units can be any size.
 *
 * To create a CoordMap you specify translation and scaling factors for going between
 * screen and simulation coordinates. The CoordMap constructor maps the bottom-left point
 * on the canvas to the given bottom-left point in simulation space and then uses the given
 * scaling factors.
 *
 * The static method {@link #make} calculates the translation and scaling factors in order
 * to fit a certain rectangle in simulation coords into another rectangle in screen coords.
 *
 * From David Flanagan, *JavaScript: The Definitive Guide, 6th Edition* page 869:
 *
 * > By default, the coordinate space for a canvas has its origin at `(0,0)` in the upper
 * left corner of the canvas, with `x` values increasing to the right and `y` values
 * increasing down. The `width` and `height` attributes of the `<canvas>` tag specify the
 * maximum X and Y coordinates, and a single unit in this coordinate space normally
 * translates to a single on-screen pixel.
 *
 * Note however that a canvas actually has
 * [two coordinate systems](http://www.ckollars.org/canvas-two-coordinate-scales.html):
 *
 * > The `<canvas...>` element is unlike almost all other HTML/HTML5 elements in using two
 * different coordinate system scales simultaneously. The *model* coordinate system scale
 * is used whenever you want to draw anything on the canvas. The *display* coordinate
 * system scale is used to control how much physical screen space is dedicated to the
 * canvas. You should explicitly specify both, the *model* coordinate size as attributes in
 * your HTML, and the *display* coordinate size in your CSS.
 *
 * Essentially the *display* coordinates can be used to stretch a canvas to fit the screen
 * as desired. Here we ignore *display* coordinates and regard *screen coordinates* to be
 * what is called *model coordinates* in the above quote.
 *
 * @param screen_left  the left edge of the canvas in screen coordinates
 * @param screen_bottom the bottom edge of the canvas in screen coordinates
 * @param sim_left  the simulation coordinate corresponding to screen_left
 * @param sim_bottom  the simulation coordinate corresponding to screen_bottom
 * @param pixel_per_unit_x  canvas pixels per simulation space unit along x axis
 * @param pixel_per_unit_y  canvas pixels per simulation space unit along y axis
 */
export declare class CoordMap {
    private screen_left_;
    private screen_bottom_;
    private sim_left_;
    private sim_bottom_;
    private pixel_per_unit_x_;
    private pixel_per_unit_y_;
    private transform_;
    constructor(screen_left: number, screen_bottom: number, sim_left: number, sim_bottom: number, pixel_per_unit_x: number, pixel_per_unit_y: number);
    /**
     * Creates a CoordMap that fits a simulation coordinates rectangle inside a
     * screen coordinates rectangle in accordance with alignment options and aspect ratio.
     * Calculates the origin and scale, which define the coordinate mapping.
     *
     * The mapping is calculated so that the given simulation rectangle transforms to be
     * the largest possible rectangle that fits inside the given screen rectangle, subject to
     * various alignment options. The alignment options are similar to typical word processor
     * alignment options such as left, center, right, or full justification. In the following
     * diagrams the simulation rectangle is the smaller bold bordered rectangle, inside the
     * larger screen rectangle.
     *
     *  ┌──────────────────────────────────────────────────┐
     *  │┏━━━━━━━━━━━━━━━━┓                                │
     *  │┃                ┃                                │
     *  │┃                ┃                                │
     *  │┃    x: left     ┃                                │
     *  │┃                ┃                                │
     *  │┃                ┃                                │
     *  │┗━━━━━━━━━━━━━━━━┛                                │
     *  └──────────────────────────────────────────────────┘
     *
     *  ┌──────────────────────────────────────────────────┐
     *  │               ┏━━━━━━━━━━━━━━━━┓                 │
     *  │               ┃                ┃                 │
     *  │               ┃                ┃                 │
     *  │               ┃   x: middle    ┃                 │
     *  │               ┃                ┃                 │
     *  │               ┃                ┃                 │
     *  │               ┗━━━━━━━━━━━━━━━━┛                 │
     *  └──────────────────────────────────────────────────┘
     *
     *  ┌──────────────────────────────────────────────────┐
     *  │                                ┏━━━━━━━━━━━━━━━━┓│
     *  │                                ┃                ┃│
     *  │                                ┃                ┃│
     *  │                                ┃    x: right    ┃│
     *  │                                ┃                ┃│
     *  │                                ┃                ┃│
     *  │                                ┗━━━━━━━━━━━━━━━━┛│
     *  └──────────────────────────────────────────────────┘
     *
     * Both horizontal and vertical dimensions (x and y) have alignments. One of x or y
     * will determine the scale and will fully span the screen rectangle; the alignment
     * option only affects the other axis. In the diagrams above, the alignment of the y axis
     * is ignored; the alignment only matters for the x placement.
     *
     * Suppose the first diagram above had `LEFT` horizontal alignment and
     * `TOP` vertical alignment, but then the screen rectangle changed to be tall
     * and narrow; then we would see the first picture below. Other vertical alignment
     * options are shown as well.
     *
     *  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
     *  │┏━━━━━━━━━━━━━━━━┓│     │                  │     │                  │
     *  │┃                ┃│     │                  │     │                  │
     *  │┃    x: left     ┃│     │                  │     │                  │
     *  │┃    y: top      ┃│     │                  │     │                  │
     *  │┃                ┃│     │┏━━━━━━━━━━━━━━━━┓│     │                  │
     *  │┃                ┃│     │┃                ┃│     │                  │
     *  │┗━━━━━━━━━━━━━━━━┛│     │┃    x: left     ┃│     │                  │
     *  │                  │     │┃    y: middle   ┃│     │                  │
     *  │                  │     │┃                ┃│     │                  │
     *  │                  │     │┃                ┃│     │┏━━━━━━━━━━━━━━━━┓│
     *  │                  │     │┗━━━━━━━━━━━━━━━━┛│     │┃                ┃│
     *  │                  │     │                  │     │┃    x: left     ┃│
     *  │                  │     │                  │     │┃    y: bottom   ┃│
     *  │                  │     │                  │     │┃                ┃│
     *  │                  │     │                  │     │┃                ┃│
     *  │                  │     │                  │     │┗━━━━━━━━━━━━━━━━┛│
     *  └──────────────────┘     └──────────────────┘     └──────────────────┘
     *
     * `FULL` ensures that for the chosen axis the simulation and screen rectangles
     * coincide. When both x and y have `FULL`, then the simulation and screen rectangles
     * will coincide but the aspect ratio is altered, so an image from the simulation may
     * appear squashed or stretched (see definition of aspect ratio below). For example, the
     * square simulation rectangle from our earlier examples is stretched out here:
     *
     *  ┌──────────────────────────────────────────────────┐
     *  │┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓│
     *  │┃                                                ┃│
     *  │┃                                                ┃│
     *  │┃             x:full, y:full                     ┃│
     *  │┃                                                ┃│
     *  │┃                                                ┃│
     *  │┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
     *  └──────────────────────────────────────────────────┘
     *
     * When only one of the axes has `FULL`, the simulation rectangle
     * might not entirely fit into the screen rectangle as the following example shows, but
     * the aspect ratio is preserved.
     *
     *   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┃                                                ┃
     *  ┌┃────────────────────────────────────────────────┃┐
     *  │┃                                                ┃│
     *  │┃                                                ┃│
     *  │┃            x:full, y:middle                    ┃│
     *  │┃                                                ┃│
     *  │┃                                                ┃│
     *  └┃────────────────────────────────────────────────┃┘
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┃                                                ┃
     *   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
     *
     * The aspect ratio is the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis'. The default aspect ratio is 1.0, so x
     * and y are treated identically with distance being measured the same in each direction.
     * An aspect ratio other than 1.0 will squash or stretch the image.  Note that aspect
     * ratio is ignored when both x and y axes have `FULL` specified.
     *
     * The simulation rectangle, screen rectangle, alignment options, and aspect ratio are
     * only used to initially determine the coordinate transformation; they are not stored by
     * the CoordMap.
     *
     * @param screenRect  the screen space rectangle to fit the sim rect into
     * @param simRect  the simulation space rectangle to be fit into the screenRect
     * @param horizAlign  horizontal alignment option; default is `HorizAlign.MIDDLE`
     * @param verticalAlign  vertical alignment option; default is`VerticalAlign.MIDDLE`
     * @param aspectRatio  the ratio of 'pixels per simulation unit along y axis'
     * divided by 'pixels per simulation unit along x axis';  default is 1.0
     * @return the CoordMap corresponding to the given options
     */
    static make(screenRect: ScreenRect, simRect: DoubleRect, horizAlign?: AlignH, verticalAlign?: AlignV, aspectRatio?: number): CoordMap;
    /**
     * Returns true if the object is likely a CoordMap. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a CoordMap
     */
    static isDuckType(obj: any): obj is CoordMap;
    /**
     * Returns an AffineTransform that maps simulation coordinates to screen coordinates
     * using the mapping defined by this CoordMap.
     * @return the AffineTransform equivalent of this CoordMap
     */
    getAffineTransform(): AffineTransform;
    /**
     * Returns the horizontal scaling factor: the screen pixels per simulation space
     * unit along x axis.
     * @return the horizontal scaling factor: screen pixels per unit of simulation
     * space in x direction
     */
    getScaleX(): number;
    /**
     * Returns the vertical scaling factor: the screen pixels per simulation space
     * unit along y axis.
     * @return the vertical scaling factor: screen pixels per unit of simulation
     * space in y direction
     */
    getScaleY(): number;
    /**
     * Translates a point in screen coordinates to simulation coordinates.
     * @param scr_x horizontal position in screen coordinates.
     * @param scr_y vertical position in screen coordinates
     */
    screenToSim(scr_x: number, scr_y: number): Point;
    /**
     * Translates the given screen coordinates rectangle into simulation coordinates.
     * @param rect the rectangle in screen coordinates
     * @return the equivalent rectangle in simulation coordinates
     */
    screenToSimRect(rect: ScreenRect): DoubleRect;
    /**
     * Returns the equivalent length in simulation coordinates of the given horizontal
     * length in screen coordinates.
     * @param scr_x a horizontal length in screen coordinates
     * @return the equivalent length in simulation coordinates
     */
    screenToSimScaleX(scr_x: number): number;
    /**
     * Returns the equivalent length in simulation coordinates of the given vertical
     * length in screen coordinates.
     * @param scr_y a vertical length in screen coordinates
     * @return the equivalent length in simulation coordinates
     */
    screenToSimScaleY(scr_y: number): number;
    /**
     * Translates a horizontal screen coordinate to simulation coordinates.
     * @param scr_x horizontal position in screen coordinates
     * @return the equivalent position in simulation coordinates
     */
    screenToSimX(scr_x: number): number;
    /**
     * Translates a vertical screen coordinate to simulation coordinates.
     * @param scr_y vertical position in screen coordinates
     * @return the equivalent position in simulation coordinates
     */
    screenToSimY(scr_y: number): number;
    /**
     * Translates a point from simulation coordinates to screen coordinates.
     * @param p_sim the point in simulation coordinates to translate
     * @return the point translated to screen coordinates
     */
    simToScreen(p_sim: Point): Point;
    /**
     * Translates the given simulation coordinates rectangle into screen coordinates.
     * @param r the rectangle in simulation coordinates
     * @return the equivalent rectangle in screen coordinates
     */
    simToScreenRect(r: DoubleRect): ScreenRect;
    /**
     * Returns the equivalent length in screen coordinates of the given horizontal length
     * in simulation coordinates.
     * @param length_x a horizontal length in simulation coordinates
     * @return the equivalent length in screen coordinates
     */
    simToScreenScaleX(length_x: number): number;
    /**
     * Returns the equivalent length in screen coordinates of the given vertical length
     * in simulation coordinates.
     * @param length_y a vertical length in simulation coordinates
     * @return the equivalent length in screen coordinates
     */
    simToScreenScaleY(length_y: number): number;
    /**
     * Translates a horizontal simulation coordinate to screen coordinates.
     * @param sim_x horizontal position in simulation coordinates
     * @return the equivalent position in screen coordinates
     */
    simToScreenX(sim_x: number): number;
    /**
     * Translates a vertical simulation coordinate to screen coordinates.
     * @param sim_y vertical position in simulation coordinate
     * @return the equivalent position in screen coordinates
     */
    simToScreenY(sim_y: number): number;
}
