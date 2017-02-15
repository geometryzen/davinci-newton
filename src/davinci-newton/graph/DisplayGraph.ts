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

import contains from '../util/contains';
import CoordMap from '../view/CoordMap';
import DisplayObject from '../view/DisplayObject';
import DrawingMode from '../view/DrawingMode';
import GraphLine from './GraphLine';
import isDefined from '../checks/isDefined';
import removeAt from '../util/removeAt';
import repeat from '../util/repeat';
import ScreenRect from '../view/ScreenRect';

/**
 * 
 */
export default class DisplayGraph implements DisplayObject {

    /**
     * The GraphLines to draw.
     */
    private readonly graphLines_: GraphLine[] = [];

    /**
     * 
     */
    private memDraw_ = repeat(-1, this.graphLines_.length);

    /**
     * 
     */
    private offScreen_: HTMLCanvasElement = null;

    /**
     * to detect when redraw needed;  when the coordmap changes, we need to redraw.
     */
    private lastMap_: CoordMap = null;

    /**
     * 
     */
    private screenRect_ = ScreenRect.EMPTY_RECT;

    /**
     * set when the entire graph needs to be redrawn.
     */
    private needRedraw_ = false;

    /**
     * set when the entire graph needs to be redrawn.
     */
    private useBuffer_ = false;

    /**
     * 
     */
    private zIndex = 0;

    /**
     * 
     */
    constructor() {
        // Do nothing yet.
    }

    /**
     * 
     */
    draw(context: CanvasRenderingContext2D, map: CoordMap): void {
        if (this.screenRect_.isEmpty()) {
            return;
        }
        const graphLines = this.graphLines_;
        const N = graphLines.length;
        context.save();
        if (this.lastMap_ == null || this.lastMap_ !== map) {
            this.lastMap_ = map;
            this.needRedraw_ = true;
        }
        for (let i = 0; i < N; i++) {
            // Detect when graphLine has been reset.
            if (this.memDraw_[i] > graphLines[i].getGraphPoints().getEndIndex()) {
                this.reset();
                break;
            }
        }
        if (!this.useBuffer_) {
            // without offscreen buffer, always need to redraw
            this.needRedraw_ = true;
            // draw without offscreen buffer.
            if (this.needRedraw_) {
                this.fullDraw(context, map);
                this.needRedraw_ = false;
            }
            else {
                // this is only useful for debugging, to see the incrementalDraw happening.
                this.incrementalDraw(context, map);
            }
        }
        else {
            const w = this.screenRect_.getWidth();
            const h = this.screenRect_.getHeight();
            if (this.offScreen_ == null) {
                // make the offscreen buffer that has an alpha channel.
                this.offScreen_ = document.createElement('canvas');
                this.offScreen_.width = w;
                this.offScreen_.height = h;
                this.needRedraw_ = true;
            }
            // osb = off screen buffer
            const osb = this.offScreen_.getContext('2d');
            if (this.needRedraw_) {
                // Clear image with transparent alpha by drawing a rectangle
                // 'clearRect fills with transparent black'
                osb.clearRect(0, 0, w, h);
                // The offscreen buffer has all transparent pixels at this point.
                // Draw into offscreen buffer, but using opaque ink (alpha = 1.0).
                this.fullDraw(osb, map);
                this.needRedraw_ = false;
            }
            else {
                this.incrementalDraw(osb, map);
            }
            // Copy the entire offscreen buffer onto the screen.
            // Note that the LabCanvas needs to actually clear the screen to white
            // at the start of each paint operation, because this draw() method never clears,
            // it does a sort of 'transparent image copy'.
            context.drawImage(this.offScreen_, 0, 0, w, h);
        }
        for (let i = 0; i < N; i++) {
            this.drawHotSpot(context, map, graphLines[i]);
        }
        context.restore();
    }

    /**
     * 
     */
    drawHotSpot(context: CanvasRenderingContext2D, coordMap: CoordMap, graphLine: GraphLine): void {
        const p = graphLine.getGraphPoints().getEndValue();
        if (p != null) {
            const x = coordMap.simToScreenX(p.x);
            const y = coordMap.simToScreenY(p.y);
            const color = graphLine.hotspotColor;
            if (color) {
                context.fillStyle = color;
                context.fillRect(x - 2, y - 2, 5, 5);
            }
        }
    }

    /**
     * Draws the points starting from the specified point to the most recent point;
     * returns the index of last point drawn.
     * @param context the canvas's context to draw into
     * @param coordMap the CoordMap specifying sim to screen conversion
     * @param from the index of the the point to start from, within the datapoints
     * @param graphLine
     * @return the index of the last point drawn.
     */
    private drawPoints(context: CanvasRenderingContext2D, coordMap: CoordMap, from: number, graphLine: GraphLine): number {
        const simRect = coordMap.screenToSimRect(this.screenRect_);
        const iter = graphLine.getGraphPoints().getIterator(from);
        if (!iter.hasNext()) {
            return from;
        }
        let next = iter.nextValue();  // move to first point
        // Draw first point.
        // Find the GraphStyle corresponding to this point.
        const style = graphLine.getGraphStyle(iter.getIndex());
        if (style.drawingMode === DrawingMode.DOTS) {
            const x = coordMap.simToScreenX(next.x);
            const y = coordMap.simToScreenY(next.y);
            const w = style.lineWidth;
            context.fillStyle = style.color_;
            context.fillRect(x, y, w, w);
        }
        while (iter.hasNext()) {
            const last = next;
            next = iter.nextValue();
            // if same point then don't draw again
            if (next.x === last.x && next.y === last.y) {
                continue;
            }
            // find the GraphStyle corresponding to this point
            const style = graphLine.getGraphStyle(iter.getIndex());
            // Avoid drawing nonsense lines in a graph, like when the pendulum
            // moves over the 0 to 2Pi boundary.  The sequence number changes
            // when there is a discontinuity, so don't draw a line in this case.
            const continuous = next.seqX === last.seqX && next.seqY === last.seqY;
            if (style.drawingMode === DrawingMode.DOTS || !continuous) {
                // Only draw points that are visible.
                if (!simRect.contains(next)) {
                    continue;
                }
                const x = coordMap.simToScreenX(next.x);
                const y = coordMap.simToScreenY(next.y);
                const w = style.lineWidth;
                context.fillStyle = style.color_;
                context.fillRect(x, y, w, w);
            }
            else {
                // Don't draw lines that are not possibly visible.
                if (!simRect.maybeVisible(last, next)) {
                    continue;
                }
                const x1 = coordMap.simToScreenX(last.x);
                const y1 = coordMap.simToScreenY(last.y);
                const x2 = coordMap.simToScreenX(next.x);
                const y2 = coordMap.simToScreenY(next.y);
                context.strokeStyle = style.color_;
                context.lineWidth = style.lineWidth;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
        }
        return iter.getIndex();
    }

    fullDraw(context: CanvasRenderingContext2D, coordMap: CoordMap): void {
        // Redraw entire memory list by drawing from oldest point in list
        this.memDraw_ = repeat(-1, this.graphLines_.length);
        this.incrementalDraw(context, coordMap);
    }

    getZIndex(): number {
        return this.zIndex;
    }

    setZIndex(zIndex: number): void {
        this.zIndex = isDefined(zIndex) ? zIndex : 0;
    }

    /**
     * 
     */
    incrementalDraw(context: CanvasRenderingContext2D, coordMap: CoordMap): void {
        // draw points from the last drawn (=memDraw) up to the current latest point
        // experiment: fade the graph by drawing a translucent white rectangle
        // var r = this.getScreenRect();
        // context.fillStyle = 'rgba(255,255,255,0.02)';
        // context.fillRect(r.getX(), r.getY(), r.getWidth(), r.getHeight());
        for (let i = 0, n = this.graphLines_.length; i < n; i++) {
            this.memDraw_[i] = this.drawPoints(context, coordMap, this.memDraw_[i], this.graphLines_[i]);
        }
    }

    isDragable(): boolean {
        return false;
    }

    /**
     * Add a GraphLine to be displayed.
     * @param graphLine the GraphLine to be display
     */
    addGraphLine(graphLine: GraphLine) {
        if (GraphLine.isDuckType(graphLine)) {
            if (!contains(this.graphLines_, graphLine)) {
                this.graphLines_.push(graphLine);
                this.memDraw_.push(-1);
            }
        }
        else {
            throw new Error('not a GraphLine ' + graphLine);
        }
    }

    /**
     * Remove a GraphLine from set of those to display.
     * @param graphLine the GraphLine to not display
     */
    removeGraphLine(graphLine: GraphLine) {
        if (GraphLine.isDuckType(graphLine)) {
            const idx = this.graphLines_.indexOf(graphLine);
            removeAt(this.graphLines_, idx);
            removeAt(this.memDraw_, idx);
            this.needRedraw_ = true;
        }
        else {
            throw new Error('not a GraphLine ' + graphLine);
        }
    }

    setDragable(dragable: boolean): void {
        // Do nothing.
    }

    /**
     * Sets the screen rectangle that this DisplayGraph should occupy within the
     * @param screenRect the screen coordinates of the
     * area this DisplayGraph should occupy.
     */
    setScreenRect(screenRect: ScreenRect): void {
        this.screenRect_ = screenRect;
        this.offScreen_ = null; // force reallocation of offscreen
    }

    /**
     * Whether to draw into an offscreen buffer.  A *time graph* must redraw every
     * frame, so it saves time to *not* use an offscreen buffer in that case.
     * @param value Whether to draw into an offscreen buffer
     */
    setUseBuffer(value: boolean): void {
        this.useBuffer_ = value;
        if (!this.useBuffer_) {
            this.offScreen_ = null;
        }
    }

    /**
     * Causes entire graph to be redrawn, when `draw` is next called.
     */
    reset(): void {
        const graphLines = this.graphLines_;
        const N = graphLines.length;
        this.memDraw_ = repeat(-1, N);
        for (let i = 0; i < N; i++) {
            graphLines[i].reset();
        }
        this.needRedraw_ = true;
    }
}
