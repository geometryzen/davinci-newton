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
import isDefined from '../checks/isDefined';
import { Unit } from '../math/Unit';
import { AlignH } from '../view/AlignH';
import { AlignV } from '../view/AlignV';
import { DoubleRect } from '../view/DoubleRect';
/**
 * @hidden
 * @param label
 * @param scale
 * @returns
 */
function makeLabelScale(label, scale) {
    if (Unit.isOne(scale)) {
        return label;
    }
    else {
        return label + " / (" + scale + ")";
    }
}
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
 * @hidden
 */
var DisplayAxes = /** @class */ (function () {
    /**
     * @param simRect the area to draw axes for in simulation coordinates.
     * @param font the Font to draw numbers and names of axes with
     * @param color the Color to draw the axes with
     */
    function DisplayAxes(simRect, font, color) {
        if (simRect === void 0) { simRect = DoubleRect.EMPTY_RECT; }
        if (font === void 0) { font = '14pt sans-serif'; }
        if (color === void 0) { color = 'gray'; }
        this.simRect_ = simRect;
        this.numFont_ = font;
        this.drawColor_ = color;
        this.fontDescent = 8;
        this.fontAscent = 12;
        this.hAxisAlign_ = AlignV.BOTTOM;
        this.vAxisAlign_ = AlignH.LEFT;
        this.numDecimal_ = 0;
        this.needRedraw_ = true;
        this.hLabel_ = 'x';
        this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
        this.vLabel_ = 'y';
        this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
        this.zIndex_ = 100;
    }
    /*
    contains(point) {
        return false;
    }
    */
    DisplayAxes.prototype.draw = function (context, map) {
        // Draws both horizontal and vertical axes, getting the size of the axes from the
        // simulation rectangle
        context.save();
        context.strokeStyle = this.drawColor_;
        context.fillStyle = this.drawColor_;
        context.font = this.numFont_;
        context.textAlign = 'start';
        context.textBaseline = 'alphabetic';
        // figure where to draw axes
        /**
         * screen x-coord of axes, the point where the axes intersect.
         */
        var x0;
        /**
         * screen y-coord of axes, the point where the axes intersect.
         */
        var y0;
        var r = this.simRect_;
        var sim_x1 = r.getLeft();
        var sim_x2 = r.getRight();
        var sim_y1 = r.getBottom();
        var sim_y2 = r.getTop();
        switch (this.vAxisAlign_) {
            case AlignH.RIGHT:
                x0 = map.simToScreenX(sim_x2 - 0.05 * (sim_x2 - sim_x1));
                break;
            case AlignH.LEFT:
                x0 = map.simToScreenX(sim_x1 + 0.05 * (sim_x2 - sim_x1));
                break;
            default:
                x0 = map.simToScreenX(r.getCenterX());
        }
        // leave room to draw the numbers below the horizontal axis
        switch (this.hAxisAlign_) {
            case AlignV.TOP:
                y0 = map.simToScreenY(sim_y2) + (10 + this.fontDescent + this.fontAscent);
                break;
            case AlignV.BOTTOM:
                y0 = map.simToScreenY(sim_y1) - (10 + this.fontDescent + this.fontAscent);
                break;
            default:
                y0 = map.simToScreenY(r.getCenterY());
        }
        // draw horizontal axis
        context.beginPath();
        context.moveTo(map.simToScreenX(sim_x1), y0);
        context.lineTo(map.simToScreenX(sim_x2), y0);
        context.stroke();
        this.drawHorizTicks(y0, context, map, this.simRect_);
        // draw vertical axis
        context.beginPath();
        context.moveTo(x0, map.simToScreenY(sim_y1));
        context.lineTo(x0, map.simToScreenY(sim_y2));
        context.stroke();
        this.drawVertTicks(x0, context, map, this.simRect_);
        context.restore();
        this.needRedraw_ = false;
    };
    /**
     * Draws the tick marks for the horizontal axis.
     * @param y0 the vertical placement of the horizontal axis, in screen coords
     * @param context the canvas's context to draw into
     * @param map the mapping to use for translating between simulation and screen coordinates
     * @param r the view area in simulation coords
     */
    DisplayAxes.prototype.drawHorizTicks = function (y0, context, map, r) {
        var y1 = y0 - 4; // bottom edge of tick mark
        var y2 = y1 + 8; // top edge of tick mark
        var sim_x1 = r.getLeft();
        var sim_x2 = r.getRight();
        var graphDelta = this.getNiceIncrement(sim_x2 - sim_x1);
        var x_sim = DisplayAxes.getNiceStart(sim_x1, graphDelta);
        while (x_sim < sim_x2) {
            var x_screen = map.simToScreenX(x_sim);
            context.beginPath(); // draw a tick mark
            context.moveTo(x_screen, y1);
            context.lineTo(x_screen, y2);
            context.stroke();
            var next_x_sim = x_sim + graphDelta; // next tick mark location
            if (next_x_sim > x_sim) {
                // draw a number
                var s = x_sim.toFixed(this.numDecimal_);
                var textWidth = context.measureText(s).width;
                context.fillText(s, x_screen - textWidth / 2, y2 + this.fontAscent);
            }
            else {
                // This can happen when the range is tiny compared to the numbers
                // for example:  x_sim = 6.5 and graphDelta = 1E-15.
                context.fillText('scale is too small', x_screen, y2 + this.fontAscent);
                break;
            }
            x_sim = next_x_sim;
        }
        // draw name of the horizontal axis
        var hLabel = this.hLabelScaleCache_;
        var w = context.measureText(hLabel).width;
        context.fillText(hLabel, map.simToScreenX(sim_x2) - w - 5, y0 - 8);
    };
    /**
     * Draws the tick marks for the vertical axis.
     * @param x0 the horizontal placement of the vertical axis, in screen coords
     * @param context the canvas's context to draw into
     * @param map the mapping to use for translating between simulation and screen coordinates
     * @param r the view area in simulation coords
     */
    DisplayAxes.prototype.drawVertTicks = function (x0, context, map, r) {
        var x1 = x0 - 4; // left edge of tick mark
        var x2 = x1 + 8; // right edge of tick mark
        var sim_y1 = r.getBottom();
        var sim_y2 = r.getTop();
        var graphDelta = this.getNiceIncrement(sim_y2 - sim_y1);
        var y_sim = DisplayAxes.getNiceStart(sim_y1, graphDelta);
        while (y_sim < sim_y2) {
            var y_screen = map.simToScreenY(y_sim);
            context.beginPath(); // draw a tick mark
            context.moveTo(x1, y_screen);
            context.lineTo(x2, y_screen);
            context.stroke();
            var next_y_sim = y_sim + graphDelta;
            if (next_y_sim > y_sim) {
                // draw a number
                var s = y_sim.toFixed(this.numDecimal_);
                var textWidth = context.measureText(s).width;
                if (this.vAxisAlign_ === AlignH.RIGHT) {
                    context.fillText(s, x2 - (textWidth + 10), y_screen + (this.fontAscent / 2));
                }
                else { // LEFT is default
                    context.fillText(s, x2 + 5, y_screen + (this.fontAscent / 2));
                }
            }
            else {
                // This can happen when the range is tiny compared to the numbers
                // for example:  y_sim = 6.5 and graphDelta = 1E-15.
                context.fillText('scale is too small', x2, y_screen);
                break;
            }
            y_sim = next_y_sim; // next tick mark
        }
        // draw label for the vertical axis
        var vLabel = this.vLabelScaleCache_;
        var w = context.measureText(vLabel).width;
        if (this.vAxisAlign_ === AlignH.RIGHT) {
            context.fillText(vLabel, x0 - (w + 6), map.simToScreenY(sim_y2) + 13);
        }
        else { // LEFT is default
            context.fillText(vLabel, x0 + 6, map.simToScreenY(sim_y2) + 13);
        }
    };
    Object.defineProperty(DisplayAxes.prototype, "color", {
        /**
         * Returns the color to draw the graph axes with.
         * @return the color to draw the graph axes with
         */
        get: function () {
            return this.drawColor_;
        },
        /**
         * Set the color to draw the graph axes with.
         * @param color the color to draw the graph axes with
         */
        set: function (color) {
            this.drawColor_ = color;
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the font to draw the graph axes with.
     * @return the font to draw the graph axes with
     */
    DisplayAxes.prototype.getFont = function () {
        return this.numFont_;
    };
    Object.defineProperty(DisplayAxes.prototype, "hAxisLabel", {
        /**
         * Returns the label shown next to the horizontal axis.
         */
        get: function () {
            return this.hLabel_;
        },
        /**
         * Sets the label shown next to the horizontal axis.
         */
        set: function (hAxisLabel) {
            this.hLabel_ = hAxisLabel;
            this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DisplayAxes.prototype, "hAxisScale", {
        get: function () {
            return this.hScale_;
        },
        /**
         * Sets the scale used for the horizontal axis.
         */
        set: function (hAxisScale) {
            this.hScale_ = hAxisScale;
            this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
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
    DisplayAxes.prototype.getNiceIncrement = function (range) {
        // First, scale the range to within 1 to 10.
        var power = Math.pow(10, Math.floor(Math.log(range) / Math.LN10));
        var logTot = range / power;
        // logTot should be in the range from 1.0 to 9.999
        var incr;
        if (logTot >= 8)
            incr = 2;
        else if (logTot >= 5)
            incr = 1;
        else if (logTot >= 3)
            incr = 0.5;
        else if (logTot >= 2)
            incr = 0.4;
        else
            incr = 0.2;
        incr *= power; // scale back to original range
        // setup for nice formatting of numbers in this range
        var dlog = Math.log(incr) / Math.LN10;
        this.numDecimal_ = (dlog < 0) ? Math.ceil(-dlog) : 0;
        return incr;
    };
    /**
     * Returns the starting value for the tick marks on an axis.
     * @param start  the lowest value on the axis
     * @param incr  the increment between tick marks on the axis
     * @return the starting value for the tick marks on the axis.
     */
    DisplayAxes.getNiceStart = function (start, incr) {
        // gives the first nice increment just greater than the starting number
        return Math.ceil(start / incr) * incr;
    };
    /**
     * Returns the bounding rectangle for this DisplayAxes in simulation coordinates,
     * which determines the numbering scale shown.
     * @return DoubleRect the bounding rectangle for this DisplayAxes in simulation coordinates.
     */
    DisplayAxes.prototype.getSimRect = function () {
        return this.simRect_;
    };
    Object.defineProperty(DisplayAxes.prototype, "vAxisLabel", {
        /**
         * Returns the name shown next to the vertical axis.
         */
        get: function () {
            return this.vLabel_;
        },
        /**
         * Sets the name shown next to the vertical axis.
         */
        set: function (vAxisLabel) {
            this.vLabel_ = vAxisLabel;
            this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DisplayAxes.prototype, "vAxisScale", {
        get: function () {
            return this.vScale_;
        },
        /**
         * Sets the scale used for the horizontal axis.
         */
        set: function (vAxisScale) {
            this.vScale_ = vAxisScale;
            this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DisplayAxes.prototype, "hAxisAlign", {
        /**
         * Returns the X-axis alignment: whether it should appear at bottom, top or middle of
         * the simulation rectangle.
         */
        get: function () {
            return this.hAxisAlign_;
        },
        /**
         * Sets the horizontal axis alignment: whether it should appear at bottom, top or middle of the
         * simulation rectangle.
         */
        set: function (alignment) {
            this.hAxisAlign_ = alignment;
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DisplayAxes.prototype, "vAxisAlign", {
        /**
         * Returns the Y-axis alignment : whether it should appear at left, right or middle of
         * the simulation rectangle.
         */
        get: function () {
            return this.vAxisAlign_;
        },
        /**
         * Sets the vertical axis alignment: whether it should appear at left, right or middle of the
         * simulation rectangle.
         */
        set: function (alignment) {
            this.vAxisAlign_ = alignment;
            this.needRedraw_ = true;
        },
        enumerable: false,
        configurable: true
    });
    DisplayAxes.prototype.getZIndex = function () {
        return this.zIndex_;
    };
    DisplayAxes.prototype.isDragable = function () {
        return false;
    };
    /**
     * Whether this DisplayAxes has changed since the last time it was drawn.
     * @return true when this DisplayAxes has changed since the last time draw was called.
     */
    DisplayAxes.prototype.needsRedraw = function () {
        return this.needRedraw_;
    };
    DisplayAxes.prototype.setDragable = function (dragable) {
        // Do nothing.
    };
    /**
     * Set the font to draw the graph axes with.
     * @param font the font to draw the graph axes with
     */
    DisplayAxes.prototype.setFont = function (font) {
        this.numFont_ = font;
        this.needRedraw_ = true;
    };
    /**
     * Sets the bounding rectangle for this DisplayAxes in simulation coordinates; this
     * determines the numbering scale shown.
     * @param simRect the bounding rectangle for this DisplayAxes in simulation coordinates.
     */
    DisplayAxes.prototype.setSimRect = function (simRect) {
        this.simRect_ = simRect;
        this.needRedraw_ = true;
    };
    DisplayAxes.prototype.setZIndex = function (zIndex) {
        if (isDefined(zIndex)) {
            this.zIndex_ = zIndex;
        }
    };
    return DisplayAxes;
}());
export { DisplayAxes };
