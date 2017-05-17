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

import AlignH from '../view/AlignH';
import AlignV from '../view/AlignV';
import CoordMap from '../view/CoordMap';
import DisplayObject from '../view/DisplayObject';
import DoubleRect from '../view/DoubleRect';
import { Unit } from '../math/Unit';
import isDefined from '../checks/isDefined';

function makeLabelScale(label: string, scale: Unit): string {
    if (Unit.isOne(scale)) {
        return label;
    }
    else {
        return `${label} / (${scale})`;
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
 */
export default class DisplayAxes implements DisplayObject {
    /**
     * bounds rectangle of area to draw
     */
    private simRect_: DoubleRect;
    /**
     * the font to use for drawing numbers and text on the axis
     */
    private numFont_: string;
    /**
     * the color to draw the axes with
     */
    private drawColor_: string;
    /**
     * Font descent in pixels (guesstimate).
     * @todo find a way to get this for the current font, similar to the TextMetrics object.
     * http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
     * http://pomax.nihongoresources.com/pages/Font.js/
     */
    private fontDescent: number;
    /**
     * Font ascent in pixels (guesstimate).
     */
    private fontAscent: number;
    /**
     * location of the horizontal axis, default value is BOTTOM
     */
    private hAxisAlign_: AlignV;
    /**
     * location of the vertical axis, default value is LEFT
     */
    private vAxisAlign_: AlignH;
    /**
     * Number of fractional decimal places to show.
     */
    private numDecimal_: number;
    /**
     * set when this needs to be redrawn
     */
    private needRedraw_: boolean;
    /**
     * The label for the horizontal axis.
     */
    private hLabel_: string;
    /**
     * The scale factor for the horizontal axis.
     */
    private hScale_: Unit;
    /**
     * 
     */
    private hLabelScaleCache_: string;
    /**
     * The label for the vertical axis.
     */
    private vLabel_: string;
    /**
     * The scale factor for the vertical axis.
     */
    private vScale_: Unit;
    /**
     * 
     */
    private vLabelScaleCache_: string;
    /**
     * 
     */
    private zIndex_: number;
    /**
     * @param simRect the area to draw axes for in simulation coordinates.
     * @param font the Font to draw numbers and names of axes with 
     * @param color the Color to draw the axes with
     */
    constructor(simRect = DoubleRect.EMPTY_RECT, font = '14pt sans-serif', color = 'gray') {
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

    draw(context: CanvasRenderingContext2D, map: CoordMap): void {
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
        let x0: number;
        /**
         * screen y-coord of axes, the point where the axes intersect.
         */
        let y0: number;
        const r = this.simRect_;
        const sim_x1 = r.getLeft();
        const sim_x2 = r.getRight();
        const sim_y1 = r.getBottom();
        const sim_y2 = r.getTop();
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
    }

    /**
     * Draws the tick marks for the horizontal axis.
     * @param y0 the vertical placement of the horizontal axis, in screen coords
     * @param context the canvas's context to draw into
     * @param map the mapping to use for translating between simulation and screen coordinates
     * @param r the view area in simulation coords
     */
    drawHorizTicks(y0: number, context: CanvasRenderingContext2D, map: CoordMap, r: DoubleRect): void {
        const y1 = y0 - 4;  // bottom edge of tick mark
        const y2 = y1 + 8;  // top edge of tick mark
        const sim_x1 = r.getLeft();
        const sim_x2 = r.getRight();
        const graphDelta = this.getNiceIncrement(sim_x2 - sim_x1);
        let x_sim = DisplayAxes.getNiceStart(sim_x1, graphDelta);
        while (x_sim < sim_x2) {
            const x_screen = map.simToScreenX(x_sim);
            context.beginPath(); // draw a tick mark
            context.moveTo(x_screen, y1);
            context.lineTo(x_screen, y2);
            context.stroke();
            const next_x_sim = x_sim + graphDelta;  // next tick mark location
            if (next_x_sim > x_sim) {
                // draw a number
                const s = x_sim.toFixed(this.numDecimal_);
                const textWidth = context.measureText(s).width;
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
        const hLabel = this.hLabelScaleCache_;
        const w = context.measureText(hLabel).width;
        context.fillText(hLabel, map.simToScreenX(sim_x2) - w - 5, y0 - 8);
    }

    /**
     * Draws the tick marks for the vertical axis.
     * @param x0 the horizontal placement of the vertical axis, in screen coords
     * @param context the canvas's context to draw into
     * @param map the mapping to use for translating between simulation and screen coordinates
     * @param r the view area in simulation coords
     */
    drawVertTicks(x0: number, context: CanvasRenderingContext2D, map: CoordMap, r: DoubleRect): void {
        const x1 = x0 - 4;  // left edge of tick mark
        const x2 = x1 + 8;  // right edge of tick mark
        const sim_y1 = r.getBottom();
        const sim_y2 = r.getTop();
        const graphDelta = this.getNiceIncrement(sim_y2 - sim_y1);
        let y_sim = DisplayAxes.getNiceStart(sim_y1, graphDelta);
        while (y_sim < sim_y2) {
            const y_screen = map.simToScreenY(y_sim);
            context.beginPath(); // draw a tick mark
            context.moveTo(x1, y_screen);
            context.lineTo(x2, y_screen);
            context.stroke();
            const next_y_sim = y_sim + graphDelta;
            if (next_y_sim > y_sim) {
                // draw a number
                const s = y_sim.toFixed(this.numDecimal_);
                const textWidth = context.measureText(s).width;
                if (this.vAxisAlign_ === AlignH.RIGHT) {
                    context.fillText(s, x2 - (textWidth + 10), y_screen + (this.fontAscent / 2));
                }
                else {// LEFT is default
                    context.fillText(s, x2 + 5, y_screen + (this.fontAscent / 2));
                }
            }
            else {
                // This can happen when the range is tiny compared to the numbers
                // for example:  y_sim = 6.5 and graphDelta = 1E-15.
                context.fillText('scale is too small', x2, y_screen);
                break;
            }
            y_sim = next_y_sim;  // next tick mark
        }
        // draw label for the vertical axis
        const vLabel = this.vLabelScaleCache_;
        const w = context.measureText(vLabel).width;
        if (this.vAxisAlign_ === AlignH.RIGHT) {
            context.fillText(vLabel, x0 - (w + 6), map.simToScreenY(sim_y2) + 13);
        }
        else { // LEFT is default
            context.fillText(vLabel, x0 + 6, map.simToScreenY(sim_y2) + 13);
        }
    }

    /**
     * Returns the color to draw the graph axes with.
     * @return the color to draw the graph axes with
     */
    get color(): string {
        return this.drawColor_;
    }

    /**
     * Returns the font to draw the graph axes with.
     * @return the font to draw the graph axes with
     */
    getFont(): string {
        return this.numFont_;
    }

    /**
     * Returns the label shown next to the horizontal axis.
     */
    get hAxisLabel(): string {
        return this.hLabel_;
    }

    get hAxisScale(): Unit {
        return this.hScale_;
    }

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
    private getNiceIncrement(range: number): number {
        // First, scale the range to within 1 to 10.
        const power = Math.pow(10, Math.floor(Math.log(range) / Math.LN10));
        const logTot = range / power;
        // logTot should be in the range from 1.0 to 9.999
        let incr;
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
        incr *= power;  // scale back to original range
        // setup for nice formatting of numbers in this range
        const dlog = Math.log(incr) / Math.LN10;
        this.numDecimal_ = (dlog < 0) ? Math.ceil(-dlog) : 0;
        return incr;
    }

    /**
     * Returns the starting value for the tick marks on an axis.
     * @param start  the lowest value on the axis
     * @param incr  the increment between tick marks on the axis
     * @return the starting value for the tick marks on the axis.
     */
    private static getNiceStart(start: number, incr: number): number {
        // gives the first nice increment just greater than the starting number
        return Math.ceil(start / incr) * incr;
    }

    /**
     * Returns the bounding rectangle for this DisplayAxes in simulation coordinates,
     * which determines the numbering scale shown.
     * @return DoubleRect the bounding rectangle for this DisplayAxes in simulation coordinates.
     */
    getSimRect(): DoubleRect {
        return this.simRect_;
    }

    /**
     * Returns the name shown next to the vertical axis.
     */
    get vAxisLabel(): string {
        return this.vLabel_;
    }

    get vAxisScale(): Unit {
        return this.vScale_;
    }

    /**
     * Returns the X-axis alignment: whether it should appear at bottom, top or middle of
     * the simulation rectangle.
     */
    get hAxisAlign(): AlignV {
        return this.hAxisAlign_;
    }

    /**
     * Returns the Y-axis alignment : whether it should appear at left, right or middle of
     * the simulation rectangle.
     */
    get vAxisAlign(): AlignH {
        return this.vAxisAlign_;
    }

    getZIndex(): number {
        return this.zIndex_;
    }

    isDragable(): boolean {
        return false;
    }

    /**
     * Whether this DisplayAxes has changed since the last time it was drawn.
     * @return true when this DisplayAxes has changed since the last time draw was called.
     */
    needsRedraw(): boolean {
        return this.needRedraw_;
    }

    /**
     * Set the color to draw the graph axes with.
     * @param color the color to draw the graph axes with
     */
    set color(color: string) {
        this.drawColor_ = color;
        this.needRedraw_ = true;
    }

    setDragable(dragable: boolean): void {
        // Do nothing.
    }

    /**
     * Set the font to draw the graph axes with.
     * @param font the font to draw the graph axes with
     */
    setFont(font: string): void {
        this.numFont_ = font;
        this.needRedraw_ = true;
    }

    /**
     * Sets the label shown next to the horizontal axis.
     */
    set hAxisLabel(hAxisLabel: string) {
        this.hLabel_ = hAxisLabel;
        this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
        this.needRedraw_ = true;
    }

    /**
     * Sets the scale used for the horizontal axis.
     */
    set hAxisScale(hAxisScale: Unit) {
        this.hScale_ = hAxisScale;
        this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
        this.needRedraw_ = true;
    }

    /**
     * Sets the bounding rectangle for this DisplayAxes in simulation coordinates; this
     * determines the numbering scale shown.
     * @param simRect the bounding rectangle for this DisplayAxes in simulation coordinates.
     */
    setSimRect(simRect: DoubleRect): void {
        this.simRect_ = simRect;
        this.needRedraw_ = true;
    }

    /**
     * Sets the name shown next to the vertical axis.
     */
    set vAxisLabel(vAxisLabel: string) {
        this.vLabel_ = vAxisLabel;
        this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
        this.needRedraw_ = true;
    }

    /**
     * Sets the scale used for the horizontal axis.
     */
    set vAxisScale(vAxisScale: Unit) {
        this.vScale_ = vAxisScale;
        this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
        this.needRedraw_ = true;
    }

    /**
     * Sets the horizontal axis alignment: whether it should appear at bottom, top or middle of the
     * simulation rectangle.
     */
    set hAxisAlign(alignment: AlignV) {
        this.hAxisAlign_ = alignment;
        this.needRedraw_ = true;
    }

    /**
     * Sets the vertical axis alignment: whether it should appear at left, right or middle of the
     * simulation rectangle.
     */
    set vAxisAlign(alignment: AlignH) {
        this.vAxisAlign_ = alignment;
        this.needRedraw_ = true;
    }

    setZIndex(zIndex: number): void {
        if (isDefined(zIndex)) {
            this.zIndex_ = zIndex;
        }
    }
}

