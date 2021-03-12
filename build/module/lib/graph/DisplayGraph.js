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
import contains from '../util/contains';
import removeAt from '../util/removeAt';
import repeat from '../util/repeat';
import { DrawingMode } from '../view/DrawingMode';
import { ScreenRect } from '../view/ScreenRect';
import { GraphLine } from './GraphLine';
/**
 * @hidden
 */
var DisplayGraph = /** @class */ (function () {
    /**
     *
     */
    function DisplayGraph() {
        /**
         * The GraphLines to draw.
         */
        this.graphLines_ = [];
        /**
         *
         */
        this.memDraw_ = repeat(-1, this.graphLines_.length);
        /**
         *
         */
        this.offScreen_ = null;
        /**
         * to detect when redraw needed;  when the coordmap changes, we need to redraw.
         */
        this.lastMap_ = null;
        /**
         *
         */
        this.screenRect_ = ScreenRect.EMPTY_RECT;
        /**
         * set when the entire graph needs to be redrawn.
         */
        this.needRedraw_ = false;
        /**
         * set when the entire graph needs to be redrawn.
         */
        this.useBuffer_ = false;
        /**
         *
         */
        this.zIndex = 0;
        // Do nothing yet.
    }
    /**
     *
     */
    DisplayGraph.prototype.draw = function (context, map) {
        if (this.screenRect_.isEmpty()) {
            return;
        }
        var graphLines = this.graphLines_;
        var N = graphLines.length;
        context.save();
        if (this.lastMap_ == null || this.lastMap_ !== map) {
            this.lastMap_ = map;
            this.needRedraw_ = true;
        }
        for (var i = 0; i < N; i++) {
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
            var w = this.screenRect_.getWidth();
            var h = this.screenRect_.getHeight();
            if (this.offScreen_ == null) {
                // make the offscreen buffer that has an alpha channel.
                this.offScreen_ = document.createElement('canvas');
                this.offScreen_.width = w;
                this.offScreen_.height = h;
                this.needRedraw_ = true;
            }
            // osb = off screen buffer
            var osb = this.offScreen_.getContext('2d');
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
        for (var i = 0; i < N; i++) {
            this.drawHotSpot(context, map, graphLines[i]);
        }
        context.restore();
    };
    /**
     *
     */
    DisplayGraph.prototype.drawHotSpot = function (context, coordMap, graphLine) {
        var p = graphLine.getGraphPoints().getEndValue();
        if (p != null) {
            var x = coordMap.simToScreenX(p.x);
            var y = coordMap.simToScreenY(p.y);
            var color = graphLine.hotspotColor;
            if (color) {
                context.fillStyle = color;
                context.fillRect(x - 2, y - 2, 5, 5);
            }
        }
    };
    /**
     * Draws the points starting from the specified point to the most recent point;
     * returns the index of last point drawn.
     * @param context the canvas's context to draw into
     * @param coordMap the CoordMap specifying sim to screen conversion
     * @param from the index of the the point to start from, within the datapoints
     * @param graphLine
     * @return the index of the last point drawn.
     */
    DisplayGraph.prototype.drawPoints = function (context, coordMap, from, graphLine) {
        var simRect = coordMap.screenToSimRect(this.screenRect_);
        var iter = graphLine.getGraphPoints().getIterator(from);
        if (!iter.hasNext()) {
            return from;
        }
        var next = iter.nextValue(); // move to first point
        // Draw first point.
        // Find the GraphStyle corresponding to this point.
        var style = graphLine.getGraphStyle(iter.getIndex());
        if (style.drawingMode === DrawingMode.DOTS) {
            var x = coordMap.simToScreenX(next.x);
            var y = coordMap.simToScreenY(next.y);
            var w = style.lineWidth;
            context.fillStyle = style.color_;
            context.fillRect(x, y, w, w);
        }
        while (iter.hasNext()) {
            var last = next;
            next = iter.nextValue();
            // if same point then don't draw again
            if (next.x === last.x && next.y === last.y) {
                continue;
            }
            // find the GraphStyle corresponding to this point
            var style_1 = graphLine.getGraphStyle(iter.getIndex());
            // Avoid drawing nonsense lines in a graph, like when the pendulum
            // moves over the 0 to 2Pi boundary.  The sequence number changes
            // when there is a discontinuity, so don't draw a line in this case.
            var continuous = next.seqX === last.seqX && next.seqY === last.seqY;
            if (style_1.drawingMode === DrawingMode.DOTS || !continuous) {
                // Only draw points that are visible.
                if (!simRect.contains(next)) {
                    continue;
                }
                var x = coordMap.simToScreenX(next.x);
                var y = coordMap.simToScreenY(next.y);
                var w = style_1.lineWidth;
                context.fillStyle = style_1.color_;
                context.fillRect(x, y, w, w);
            }
            else {
                // Don't draw lines that are not possibly visible.
                if (!simRect.maybeVisible(last, next)) {
                    continue;
                }
                var x1 = coordMap.simToScreenX(last.x);
                var y1 = coordMap.simToScreenY(last.y);
                var x2 = coordMap.simToScreenX(next.x);
                var y2 = coordMap.simToScreenY(next.y);
                context.strokeStyle = style_1.color_;
                context.lineWidth = style_1.lineWidth;
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
        }
        return iter.getIndex();
    };
    DisplayGraph.prototype.fullDraw = function (context, coordMap) {
        // Redraw entire memory list by drawing from oldest point in list
        this.memDraw_ = repeat(-1, this.graphLines_.length);
        this.incrementalDraw(context, coordMap);
    };
    DisplayGraph.prototype.getZIndex = function () {
        return this.zIndex;
    };
    DisplayGraph.prototype.setZIndex = function (zIndex) {
        this.zIndex = isDefined(zIndex) ? zIndex : 0;
    };
    /**
     *
     */
    DisplayGraph.prototype.incrementalDraw = function (context, coordMap) {
        // draw points from the last drawn (=memDraw) up to the current latest point
        // experiment: fade the graph by drawing a translucent white rectangle
        // var r = this.getScreenRect();
        // context.fillStyle = 'rgba(255,255,255,0.02)';
        // context.fillRect(r.getX(), r.getY(), r.getWidth(), r.getHeight());
        for (var i = 0, n = this.graphLines_.length; i < n; i++) {
            this.memDraw_[i] = this.drawPoints(context, coordMap, this.memDraw_[i], this.graphLines_[i]);
        }
    };
    DisplayGraph.prototype.isDragable = function () {
        return false;
    };
    /**
     * Add a GraphLine to be displayed.
     * @param graphLine the GraphLine to be display
     */
    DisplayGraph.prototype.addGraphLine = function (graphLine) {
        if (GraphLine.isDuckType(graphLine)) {
            if (!contains(this.graphLines_, graphLine)) {
                this.graphLines_.push(graphLine);
                this.memDraw_.push(-1);
            }
        }
        else {
            throw new Error('not a GraphLine ' + graphLine);
        }
    };
    /**
     * Remove a GraphLine from set of those to display.
     * @param graphLine the GraphLine to not display
     */
    DisplayGraph.prototype.removeGraphLine = function (graphLine) {
        if (GraphLine.isDuckType(graphLine)) {
            var idx = this.graphLines_.indexOf(graphLine);
            removeAt(this.graphLines_, idx);
            removeAt(this.memDraw_, idx);
            this.needRedraw_ = true;
        }
        else {
            throw new Error('not a GraphLine ' + graphLine);
        }
    };
    DisplayGraph.prototype.setDragable = function (dragable) {
        // Do nothing.
    };
    /**
     * Sets the screen rectangle that this DisplayGraph should occupy within the
     * @param screenRect the screen coordinates of the
     * area this DisplayGraph should occupy.
     */
    DisplayGraph.prototype.setScreenRect = function (screenRect) {
        this.screenRect_ = screenRect;
        this.offScreen_ = null; // force reallocation of offscreen
    };
    /**
     * Whether to draw into an offscreen buffer.  A *time graph* must redraw every
     * frame, so it saves time to *not* use an offscreen buffer in that case.
     * @param value Whether to draw into an offscreen buffer
     */
    DisplayGraph.prototype.setUseBuffer = function (value) {
        this.useBuffer_ = value;
        if (!this.useBuffer_) {
            this.offScreen_ = null;
        }
    };
    /**
     * Causes entire graph to be redrawn, when `draw` is next called.
     */
    DisplayGraph.prototype.reset = function () {
        var graphLines = this.graphLines_;
        var N = graphLines.length;
        this.memDraw_ = repeat(-1, N);
        for (var i = 0; i < N; i++) {
            graphLines[i].reset();
        }
        this.needRedraw_ = true;
    };
    return DisplayGraph;
}());
export { DisplayGraph };
