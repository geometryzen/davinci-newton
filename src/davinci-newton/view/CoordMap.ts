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

import mustBeFinite from '../checks/mustBeFinite';
import AffineTransform from './AffineTransform';
import { AlignH } from './AlignH';
import { AlignV } from './AlignV';
import DoubleRect from './DoubleRect';
import Point from './Point';
import ScreenRect from './ScreenRect';

const MIN_SIZE = 1E-15;


/**
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
export default class CoordMap {
    private screen_left_: number;
    private screen_bottom_: number;
    private sim_left_: number;
    private sim_bottom_: number;
    private pixel_per_unit_x_: number;
    private pixel_per_unit_y_: number;
    private transform_: AffineTransform;
    constructor(screen_left: number, screen_bottom: number, sim_left: number, sim_bottom: number, pixel_per_unit_x: number, pixel_per_unit_y: number) {
        this.screen_left_ = mustBeFinite(screen_left);
        this.screen_bottom_ = mustBeFinite(screen_bottom);
        this.sim_left_ = mustBeFinite(sim_left);
        this.sim_bottom_ = mustBeFinite(sim_bottom);
        this.pixel_per_unit_x_ = mustBeFinite(pixel_per_unit_x);
        this.pixel_per_unit_y_ = mustBeFinite(pixel_per_unit_y);
        let at = AffineTransform.IDENTITY;
        // do operations in reverse order, because of how matrix multiplication works
        at = at.translate(this.screen_left_, this.screen_bottom_);
        at = at.scale(this.pixel_per_unit_x_, -this.pixel_per_unit_y_);
        at = at.translate(-this.sim_left_, -this.sim_bottom_);
        this.transform_ = at;
    }

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
    static make(screenRect: ScreenRect, simRect: DoubleRect, horizAlign = AlignH.MIDDLE, verticalAlign = AlignV.MIDDLE, aspectRatio = 1) {
        if (aspectRatio < MIN_SIZE || !isFinite(aspectRatio)) {
            throw new Error('bad aspectRatio ' + aspectRatio);
        }
        const simLeft = simRect.getLeft();
        const simBottom = simRect.getBottom();
        const sim_width = simRect.getRight() - simLeft;
        const sim_height = simRect.getTop() - simBottom;
        if (sim_width < MIN_SIZE || sim_height < MIN_SIZE) {
            throw new Error('simRect cannot be empty ' + simRect);
        }
        const screen_top = screenRect.getTop();
        const screen_left = screenRect.getLeft();
        const screen_width = screenRect.getWidth();
        const screen_height = screenRect.getHeight();
        let offset_x = 0;
        let offset_y = 0;
        let pixel_per_unit_x = 0;
        let pixel_per_unit_y = 0;
        // FULL = simRect matches the screenRect
        if (horizAlign === AlignH.FULL) {
            pixel_per_unit_x = screen_width / sim_width;
            offset_x = 0;
        }
        if (verticalAlign === AlignV.FULL) {
            pixel_per_unit_y = screen_height / sim_height;
            offset_y = 0;
        }
        if (horizAlign !== AlignH.FULL || verticalAlign !== AlignV.FULL) {
            // find scale (pixel_per_unit) for both x and y
            // aspectRatio = pixel_per_unit_y/pixel_per_unit_x
            // horizFull = true means: x axis has full-justification
            let horizFull;
            if (horizAlign === AlignH.FULL) {
                pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                horizFull = true;
            }
            else if (verticalAlign === AlignV.FULL) {
                pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                horizFull = false;
            }
            else {
                // figure out which of x or y limits the size
                // first assume x determines the size.
                // definition: pixel_per_unit = screen_distance / sim_distance
                pixel_per_unit_x = screen_width / sim_width;
                pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                horizFull = true;
                const ideal_height = Math.floor(0.5 + pixel_per_unit_y * sim_height);
                if (screen_height < ideal_height) { // height is limiting factor
                    pixel_per_unit_y = screen_height / sim_height;
                    pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                    horizFull = false;
                }
            }
            // use alignment to figure out offset (and therefore origin location)
            if (!horizFull) {
                // y is 'full justified':  simRect matches the screenRect on y axis
                offset_y = 0;
                const ideal_width = Math.floor(0.5 + sim_width * pixel_per_unit_x);
                switch (horizAlign) {
                    case AlignH.LEFT:
                        offset_x = 0; break;
                    case AlignH.MIDDLE:
                        offset_x = (screen_width - ideal_width) / 2; break;
                    case AlignH.RIGHT:
                        offset_x = screen_width - ideal_width; break;
                    default: throw new Error();
                }
            }
            else {
                // x is 'full justified':  simRect matches the screenRect on x axis
                offset_x = 0;
                const ideal_height = Math.floor(0.5 + sim_height * pixel_per_unit_y);
                switch (verticalAlign) {
                    case AlignV.BOTTOM:
                        offset_y = 0; break;
                    case AlignV.MIDDLE:
                        offset_y = (screen_height - ideal_height) / 2; break;
                    case AlignV.TOP:
                        offset_y = screen_height - ideal_height; break;
                    default: {
                        throw new Error();
                    }
                }
            }
        }
        const coordMap = new CoordMap(screen_left,
            screen_top + screen_height,
            simLeft - offset_x / pixel_per_unit_x,
            simBottom - offset_y / pixel_per_unit_y,
            pixel_per_unit_x,
            pixel_per_unit_y);
        return coordMap;
    }

    /**
     * Returns true if the object is likely a CoordMap. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a CoordMap
     */
    static isDuckType(obj: any): obj is CoordMap {
        if (obj instanceof CoordMap) {
            return true;
        }
        return obj.getAffineTransform !== undefined
            && obj.simToScreenX !== undefined
            && obj.simToScreenY !== undefined
            && obj.screenToSimX !== undefined
            && obj.screenToSimY !== undefined
            && obj.getScaleX !== undefined
            && obj.getScaleY !== undefined;
    }

    /**
     * Returns an AffineTransform that maps simulation coordinates to screen coordinates
     * using the mapping defined by this CoordMap.
     * @return the AffineTransform equivalent of this CoordMap
     */
    getAffineTransform(): AffineTransform {
        return this.transform_;
    }

    /**
     * Returns the horizontal scaling factor: the screen pixels per simulation space
     * unit along x axis.
     * @return the horizontal scaling factor: screen pixels per unit of simulation
     * space in x direction
     */
    getScaleX() {
        return this.pixel_per_unit_x_;
    }

    /**
     * Returns the vertical scaling factor: the screen pixels per simulation space
     * unit along y axis.
     * @return the vertical scaling factor: screen pixels per unit of simulation
     * space in y direction
     */
    getScaleY() {
        return this.pixel_per_unit_y_;
    }

    /**
     * Translates a point in screen coordinates to simulation coordinates.
     * @param scr_x horizontal position in screen coordinates.
     * @param scr_y vertical position in screen coordinates
     */
    screenToSim(scr_x: number, scr_y: number): Point {
        return new Point(this.screenToSimX(scr_x), this.screenToSimY(scr_y));
    }

    /**
     * Translates the given screen coordinates rectangle into simulation coordinates.
     * @param rect the rectangle in screen coordinates
     * @return the equivalent rectangle in simulation coordinates
     */
    screenToSimRect(rect: ScreenRect): DoubleRect {
        return new DoubleRect(
            this.screenToSimX(rect.getLeft()),
            this.screenToSimY(rect.getTop() + rect.getHeight()),
            this.screenToSimX(rect.getLeft() + rect.getWidth()),
            this.screenToSimY(rect.getTop())
        );
    }

    /**
     * Returns the equivalent length in simulation coordinates of the given horizontal
     * length in screen coordinates.
     * @param scr_x a horizontal length in screen coordinates
     * @return the equivalent length in simulation coordinates
     */
    screenToSimScaleX(scr_x: number): number {
        return scr_x / this.pixel_per_unit_x_;
    }

    /**
     * Returns the equivalent length in simulation coordinates of the given vertical
     * length in screen coordinates.
     * @param scr_y a vertical length in screen coordinates
     * @return the equivalent length in simulation coordinates
     */
    screenToSimScaleY(scr_y: number): number {
        return scr_y / this.pixel_per_unit_y_;
    }

    /**
     * Translates a horizontal screen coordinate to simulation coordinates.
     * @param scr_x horizontal position in screen coordinates
     * @return the equivalent position in simulation coordinates
     */
    screenToSimX(scr_x: number): number {
        return this.sim_left_ + (scr_x - this.screen_left_) / this.pixel_per_unit_x_;
    }

    /**
     * Translates a vertical screen coordinate to simulation coordinates.
     * @param scr_y vertical position in screen coordinates
     * @return the equivalent position in simulation coordinates
     */
    screenToSimY(scr_y: number): number {
        return this.sim_bottom_ + (this.screen_bottom_ - scr_y) / this.pixel_per_unit_y_;
    }

    /**
     * Translates a point from simulation coordinates to screen coordinates.
     * @param p_sim the point in simulation coordinates to translate
     * @return the point translated to screen coordinates
     */
    simToScreen(p_sim: Point): Point {
        return new Point(this.simToScreenX(p_sim.x), this.simToScreenY(p_sim.y));
    }

    /**
     * Translates the given simulation coordinates rectangle into screen coordinates.
     * @param r the rectangle in simulation coordinates
     * @return the equivalent rectangle in screen coordinates
     */
    simToScreenRect(r: DoubleRect): ScreenRect {
        return new ScreenRect(
            this.simToScreenX(r.getLeft()),
            this.simToScreenY(r.getTop()),
            this.simToScreenScaleX(r.getWidth()),
            this.simToScreenScaleY(r.getHeight())
        );
    }

    /**
     * Returns the equivalent length in screen coordinates of the given horizontal length
     * in simulation coordinates.
     * @param length_x a horizontal length in simulation coordinates
     * @return the equivalent length in screen coordinates
     */
    simToScreenScaleX(length_x: number): number {
        return length_x * this.pixel_per_unit_x_;
    }

    /**
     * Returns the equivalent length in screen coordinates of the given vertical length
     * in simulation coordinates.
     * @param length_y a vertical length in simulation coordinates
     * @return the equivalent length in screen coordinates
     */
    simToScreenScaleY(length_y: number): number {
        return length_y * this.pixel_per_unit_y_;
    }

    /**
     * Translates a horizontal simulation coordinate to screen coordinates.
     * @param sim_x horizontal position in simulation coordinates
     * @return the equivalent position in screen coordinates
     */
    simToScreenX(sim_x: number): number {
        return this.screen_left_ + (sim_x - this.sim_left_) * this.pixel_per_unit_x_;
    }

    /**
     * Translates a vertical simulation coordinate to screen coordinates.
     * @param sim_y vertical position in simulation coordinate
     * @return the equivalent position in screen coordinates
     */
    simToScreenY(sim_y: number): number {
        return this.screen_bottom_ - (sim_y - this.sim_bottom_) * this.pixel_per_unit_y_;
    }
}
