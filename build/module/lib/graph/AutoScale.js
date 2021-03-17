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
import { __extends } from "tslib";
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import { GenericEvent } from '../util/GenericEvent';
import { ParameterNumber } from '../util/ParameterNumber';
import removeAt from '../util/removeAt';
import { repeat } from '../util/repeat';
import { veryDifferent } from '../util/veryDifferent';
import { DoubleRect } from '../view/DoubleRect';
import { SimView } from '../view/SimView';
import { AxisChoice } from './AxisChoice';
import { GraphLine } from './GraphLine';
/**
 * @hidden
 * Watches the VarsList of one or more GraphLines to calculate the range
 * rectangle that encloses the points on the graphs, and sets accordingly the simRect of a
 * SimView. The range rectangle is the smallest rectangle that contains all the points, but
 * possibly expanded by the `extraMargin` factor.
 *
 * Enabled and Active
 *
 * To entirely disable an AutoScale, see `enabled`.
 * Assuming the AutoScale is enabled, it will react to events in the SimView and GraphLines as follows:
 *
 * + AutoScale becomes **inactive** when the SimView's simRect is changed by an entity
 * other than this AutoScale. This happens when AutoScale observes a SimView event called
 * `LabView.SIM_RECT_CHANGED`.
 *
 * + AutoScale becomes **active** when one of its GraphLines broadcasts a `RESET` event.
 * This happens when a graph is cleared, or when the X or Y variable is changed.
 *
 * You can also call `active` directly to make an enabled AutoScale active or
 * inactive.
 *
 * ### Time Graph
 *
 * For a *time graph* where one variable is time, the range rectangle in the time dimension
 * has a fixed size specified by {@link #setTimeWindow}. The default time window is 10
 * seconds.
 *
 * ### Events Broadcast
 *
 * GenericEvent named {@link #AUTO_SCALE} is broadcast when the range rectangle changes.
 *
 * ### Parameters Created
 *
 * + ParameterNumber named `AutoScale.TIME_WINDOW`
 * see {@link #setTimeWindow}.
 *
 * + ParameterNumber named `AutoScale.AXIS`
 * see `axisChoice`.
 */
var AutoScale = /** @class */ (function (_super) {
    __extends(AutoScale, _super);
    /**
     * @param simView the SimView whose simRect will be modified to the range rectangle.
     */
    function AutoScale(simView) {
        var _this = _super.call(this) || this;
        /**
         * The GraphLines to auto-scale.
         */
        _this.graphLines_ = [];
        _this.enabled_ = true;
        _this.isActive_ = true;
        /**
         * Indicates that the SIM_RECT_CHANGED event was generated by this AutoScale.
         */
        _this.ownEvent_ = false;
        /**
         * `false` indicates that the range has never been set based on graph data
         */
        _this.rangeSetX_ = false;
        /**
         * `false` indicates that the range has never been set based on graph data
         */
        _this.rangeSetY_ = false;
        /**
         * the maximum horizontal value of the range, used for calculating the scale
         */
        _this.rangeXHi_ = 0;
        /**
         * the minimum horizontal value of the range, used for calculating the scale
         */
        _this.rangeXLo_ = 0;
        /**
         * the maximum vertical value of the range, used for calculating the scale
         */
        _this.rangeYHi_ = 0;
        /**
         * the minimum vertical value of the range, used for calculating the scale
         */
        _this.rangeYLo_ = 0;
        /**
         * Length of time to include in the range rectangle for a 'time graph'.
         */
        _this.timeWindow_ = 10;
        /**
         * How much extra margin to allocate when expanding the graph range: a fraction
         * typically between 0.0 and 1.0, adds this fraction times the current horizontal or
         * vertical range.
         * This does not guarantee a margin of this amount, it merely reduces the
         * frequency of range expansion.  You could for example expand the range, and then
         * have succeeding points come very close to the new range so that the graph goes
         * very close to the edge but stays within the range.
         */
        _this.extraMargin = 0.01;
        /**
         * Minimum size that range rectangle can be, for width and height.
         */
        _this.minSize = 1E-14;
        _this.axisChoice_ = AxisChoice.BOTH;
        _this.simView_ = simView;
        simView.addMemo(_this);
        simView.addObserver(_this);
        _this.lastIndex_ = repeat(-1, _this.graphLines_.length);
        _this.addParameter(new ParameterNumber(_this, AutoScale.TIME_WINDOW, function () { return _this.timeWindow; }, function (timeWindow) { return _this.timeWindow = timeWindow; }).setSignifDigits(3));
        var choiceNames = ['VERTICAL', 'HORIZONTAL', 'BOTH'];
        var choices = [AxisChoice.VERTICAL, AxisChoice.HORIZONTAL, AxisChoice.BOTH];
        _this.addParameter(new ParameterNumber(_this, AutoScale.AXIS, function () { return _this.axisChoice; }, function (axisChoice) { return _this.axisChoice = axisChoice; }, choiceNames, choices));
        _this.setComputed(_this.isActive_);
        return _this;
    }
    /**
     * Add a GraphLine which will be observed to calculate the range rectangle of points
     * on the line.
     * @param graphLine the GraphLine to add
     */
    AutoScale.prototype.addGraphLine = function (graphLine) {
        if (GraphLine.isDuckType(graphLine)) {
            if (!contains(this.graphLines_, graphLine)) {
                this.graphLines_.push(graphLine);
                graphLine.addObserver(this);
                this.lastIndex_.push(-1);
            }
        }
        else {
            throw new Error('not a GraphLine ' + graphLine);
        }
    };
    /**
     * Clears the range rectangle, continues calculating from latest entry in HistoryList.
     */
    AutoScale.prototype.clearRange = function () {
        this.rangeXLo_ = 0;
        this.rangeXHi_ = 0;
        this.rangeSetX_ = false;
        this.rangeYLo_ = 0;
        this.rangeYHi_ = 0;
        this.rangeSetY_ = false;
    };
    Object.defineProperty(AutoScale.prototype, "active", {
        /**
         * Returns whether is AutoScale is active.
         * @return whether is AutoScale is active
         */
        get: function () {
            return this.isActive_;
        },
        /**
         * Sets whether this AutoScale is active.  When not active, the range rectangle
         * is not updated and the SimView's simulation rectangle is not modified. When changed
         * to be active, this will also call {@link #reset}.
         *
         * The AutoScale must be enabled in order to become active, see `enabled`.
         * If not enabled, then this method can only make the AutoScale inactive.
         * @param value whether this AutoScale should be active
         */
        set: function (value) {
            if (this.isActive_ !== value) {
                if (value) {
                    if (this.enabled_) {
                        this.reset();
                        this.simView_.addMemo(this);
                        this.setComputed(true);
                        this.isActive_ = true;
                        this.broadcast(new GenericEvent(this, AutoScale.ACTIVE, this.isActive_));
                    }
                }
                else {
                    this.simView_.removeMemo(this);
                    this.setComputed(false);
                    this.isActive_ = false;
                    this.broadcast(new GenericEvent(this, AutoScale.ACTIVE, this.isActive_));
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AutoScale.prototype, "axisChoice", {
        /**
         * Returns which axis should be auto scaled.
         */
        get: function () {
            return this.axisChoice_;
        },
        /**
         * Set which axis to auto scale.
         */
        set: function (value) {
            if (value === AxisChoice.VERTICAL || value === AxisChoice.HORIZONTAL || value === AxisChoice.BOTH) {
                this.axisChoice_ = value;
                this.broadcastParameter(AutoScale.AXIS);
            }
            else {
                throw new Error('unknown ' + value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AutoScale.prototype, "enabled", {
        /**
         * Returns whether is AutoScale is enabled.  See `enabled`.
         * @return whether is AutoScale is enabled
         */
        get: function () {
            return this.enabled_;
        },
        /**
         * Sets whether this AutoScale is enabled. The AutoScale must be enabled in order
         * to be active.  See `active`.
         * @param value whether this AutoScale should be enabled
         */
        set: function (enabled) {
            if (this.enabled_ !== enabled) {
                this.enabled_ = enabled;
                this.active = enabled;
                this.broadcast(new GenericEvent(this, AutoScale.ENABLED, this.enabled_));
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the range rectangle that encloses points on the GraphLines, including any
     * extra margin. Note that this rectangle might not correspond to the SimView's simulation
     * rectangle, see `axisChoice`.
     * @return the range rectangle that encloses points on the GraphLines
     */
    AutoScale.prototype.getRangeRect = function () {
        return new DoubleRect(this.rangeXLo_, this.rangeYLo_, this.rangeXHi_, this.rangeYHi_);
    };
    Object.defineProperty(AutoScale.prototype, "timeWindow", {
        /**
         * Returns length of time to include in the range rectangle for a *time graph*.
         * @return length of time to include in the range rectangle
         */
        get: function () {
            return this.timeWindow_;
        },
        /**
         * Sets length of time to include in the range rectangle for a *time graph*,
         * and sets the AutoScale to be active.
         * @param timeWindow length of time to include in the range rectangle
         */
        set: function (timeWindow) {
            if (veryDifferent(timeWindow, this.timeWindow_)) {
                this.timeWindow_ = timeWindow;
                this.reset();
                // this fixes following bug: click pan-zoom control which makes AutoScale inactive;
                // then change the time window, but nothing happens.
                this.active = true;
                this.broadcastParameter(AutoScale.TIME_WINDOW);
            }
        },
        enumerable: false,
        configurable: true
    });
    AutoScale.prototype.memorize = function () {
        for (var i = 0, n = this.graphLines_.length; i < n; i++) {
            var graphPts = this.graphLines_[i].getGraphPoints();
            // Detect when graphLine has been reset.
            if (this.lastIndex_[i] > graphPts.getEndIndex()) {
                this.reset();
            }
        }
        for (var i = 0, n = this.graphLines_.length; i < n; i++) {
            var graphPts = this.graphLines_[i].getGraphPoints();
            var iter = graphPts.getIterator(this.lastIndex_[i]);
            while (iter.hasNext()) {
                var gp = iter.nextValue();
                this.updateRange_(this.graphLines_[i], gp.x, gp.y);
                this.lastIndex_[i] = iter.getIndex();
            }
        }
        this.rangeCheck_();
    };
    AutoScale.prototype.observe = function (event) {
        if (event.getSubject() === this.simView_) {
            if (event.nameEquals(SimView.SIM_RECT_CHANGED)) {
                if (!this.ownEvent_) {
                    // Become inactive when the SimView's simRect is changed by an entity other
                    // than this AutoScale.
                    this.active = false;
                }
            }
        }
        else if (contains(this.graphLines_, event.getSubject())) {
            if (event.nameEquals(GraphLine.PARAM_NAME_X_VARIABLE) || event.nameEquals(GraphLine.PARAM_NAME_Y_VARIABLE)) {
                // the GraphLine's X or Y variable has changed
                this.reset();
            }
            else if (event.nameEquals(GraphLine.RESET)) {
                // This has the effect of turning AutoScale back on
                // after clicking the 'clear graph' button.
                this.active = true;
            }
        }
    };
    /**
     * When the range rectangle changes, this will broadcast a GenericEvent named
     * `AutoScale.AUTO_SCALE`.
     */
    AutoScale.prototype.rangeCheck_ = function () {
        var e = this.minSize;
        // set range rectangle to minimum size, when range is very tiny
        // (but choose an increment that is big enough to make hi & lo different numbers)
        if (this.rangeXHi_ - this.rangeXLo_ < e) {
            var avg = (this.rangeXHi_ + this.rangeXLo_) / 2;
            var incr = Math.max(avg * e, e);
            this.rangeXHi_ = avg + incr;
            this.rangeXLo_ = avg - incr;
        }
        if (this.rangeYHi_ - this.rangeYLo_ < e) {
            var avg = (this.rangeYHi_ + this.rangeYLo_) / 2;
            var incr = Math.max(avg * e, e);
            this.rangeYHi_ = avg + incr;
            this.rangeYLo_ = avg - incr;
        }
        var nr = this.getRangeRect();
        var sr = this.simView_.getSimRect();
        if (this.axisChoice_ === AxisChoice.VERTICAL) {
            // set vertical range, but retain existing horiz range
            nr = new DoubleRect(sr.getLeft(), nr.getBottom(), sr.getRight(), nr.getTop());
        }
        else if (this.axisChoice_ === AxisChoice.HORIZONTAL) {
            // set horizontal range, but retain existing vertical range
            nr = new DoubleRect(nr.getLeft(), sr.getBottom(), nr.getRight(), sr.getTop());
        }
        if (this.isActive_ && !nr.nearEqual(sr)) {
            this.ownEvent_ = true;
            this.simView_.setSimRect(nr);
            this.ownEvent_ = false;
            this.broadcast(new GenericEvent(this, AutoScale.AUTO_SCALE, nr));
        }
    };
    /**
     * Remove a GraphLine, it will no longer be observed for calculating the range
     * rectangle of points on the line.
     * @param graphLine the GraphLine to remove
     */
    AutoScale.prototype.removeGraphLine = function (graphLine) {
        if (GraphLine.isDuckType(graphLine)) {
            var idx = this.graphLines_.indexOf(graphLine);
            removeAt(this.graphLines_, idx);
            removeAt(this.lastIndex_, idx);
            this.reset();
        }
        else {
            throw new Error('not a GraphLine ' + graphLine);
        }
    };
    /**
     * Clears the range rectangle, and starts calculating from first entry in HistoryList.
     * Note that you will need to call {@link #memorize} to have the range recalculated.
     */
    AutoScale.prototype.reset = function () {
        this.clearRange();
        for (var i = 0, n = this.lastIndex_.length; i < n; i++) {
            this.lastIndex_[i] = -1;
        }
    };
    /**
     * Marks the SimView's Parameters as to whether they are automatically computed
     * depending on whether this AutoScale is active.
     * @param value whether this AutoScale is computing the Parameter values
     */
    AutoScale.prototype.setComputed = function (value) {
        var _this = this;
        var names = [SimView.PARAM_NAME_WIDTH, SimView.PARAM_NAME_HEIGHT, SimView.PARAM_NAME_CENTER_X, SimView.PARAM_NAME_CENTER_Y];
        names.forEach(function (name) {
            var p = _this.simView_.getParameter(name);
            p.setComputed(value);
        });
    };
    /**
     * Updates the graph range to include the given point. For time variable, limit the
     * range to the timeWindow. For non-time variable, expand the range an extra amount when
     * the range is exceeded; this helps avoid too many visually distracting updates.
     * @param line
     * @param nowX
     * @param nowY
     */
    AutoScale.prototype.updateRange_ = function (line, nowX, nowY) {
        // To avoid infinity in the range, store a very large number instead.
        // Largest double precision floating point number is approx 1.8 * 10^308
        if (!isFinite(nowX)) {
            if (nowX === Number.POSITIVE_INFINITY) {
                nowX = 1e308;
            }
            else if (nowX === Number.NEGATIVE_INFINITY) {
                nowX = -1e308;
            }
        }
        if (!isFinite(nowY)) {
            if (nowY === Number.POSITIVE_INFINITY) {
                nowY = 1e308;
            }
            else if (nowY === Number.NEGATIVE_INFINITY) {
                nowY = -1e308;
            }
        }
        var timeIdx = line.varsList.timeIndex();
        var xIsTimeVar = line.hCoordIndex === timeIdx;
        var yIsTimeVar = line.vCoordIndex === timeIdx;
        if (!this.rangeSetX_) {
            this.rangeXLo_ = nowX;
            this.rangeXHi_ = nowX + (xIsTimeVar ? this.timeWindow_ : 0);
            this.rangeSetX_ = true;
        }
        else {
            if (nowX < this.rangeXLo_) {
                if (xIsTimeVar) {
                    this.rangeXLo_ = nowX;
                    this.rangeXHi_ = nowX + this.timeWindow_;
                }
                else {
                    this.rangeXLo_ = nowX - this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                }
            }
            if (xIsTimeVar) {
                // In 'time graph', have extra space on right side so we can see
                // the leading edge hotspots.
                if (nowX > this.rangeXHi_ - this.extraMargin * this.timeWindow_) {
                    this.rangeXHi_ = nowX + this.extraMargin * this.timeWindow_;
                    this.rangeXLo_ = this.rangeXHi_ - this.timeWindow_;
                }
            }
            else {
                if (nowX > this.rangeXHi_) {
                    this.rangeXHi_ = nowX + this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                }
            }
        }
        if (!this.rangeSetY_) {
            this.rangeYLo_ = nowY;
            this.rangeYHi_ = nowY + (yIsTimeVar ? this.timeWindow_ : 0);
            this.rangeSetY_ = true;
        }
        else {
            if (nowY < this.rangeYLo_) {
                if (yIsTimeVar) {
                    this.rangeYLo_ = nowY;
                    this.rangeYHi_ = nowY + this.timeWindow_;
                }
                else {
                    this.rangeYLo_ = nowY - this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                }
            }
            if (yIsTimeVar) {
                // In 'time graph', have extra space on top so we can see
                // the leading edge hotspots.
                if (nowY > this.rangeYHi_ - this.extraMargin * this.timeWindow_) {
                    this.rangeYHi_ = nowY + this.extraMargin * this.timeWindow_;
                    this.rangeYLo_ = this.rangeYHi_ - this.timeWindow_;
                }
            }
            else {
                if (nowY > this.rangeYHi_) {
                    this.rangeYHi_ = nowY + this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                }
            }
        }
    };
    /**
     * Event broadcasted when axis is changed.
     */
    AutoScale.AXIS = 'AXIS';
    /**
     * Event broadcasted when time window is changed.
     */
    AutoScale.TIME_WINDOW = 'TIME_WINDOW';
    /**
     * Name of event broadcast when the active state changes, value is whether active.
     */
    AutoScale.ACTIVE = 'ACTIVE';
    /**
     * Name of event broadcast when a new enclosing simulation rectangle has been calculated.
     */
    AutoScale.AUTO_SCALE = 'AUTO_SCALE';
    /**
     * Name of event broadcast when the enabled state changes, value is whether enabled.
     */
    AutoScale.ENABLED = 'ENABLED';
    return AutoScale;
}(AbstractSubject));
export { AutoScale };
