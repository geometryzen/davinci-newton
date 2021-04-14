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
import clone from '../util/clone';
import { contains } from '../util/contains';
import { GenericEvent } from '../util/GenericEvent';
import { ParameterBoolean } from '../util/ParameterBoolean';
import { ParameterNumber } from '../util/ParameterNumber';
import { remove } from '../util/remove';
import { veryDifferent } from '../util/veryDifferent';
import { AlignH } from './AlignH';
import { AlignV } from './AlignV';
import { CoordMap } from './CoordMap';
import { DisplayList } from './DisplayList';
import { DoubleRect } from './DoubleRect';
import { ScreenRect } from './ScreenRect';
/**
 * @hidden
 */
var SimView = /** @class */ (function (_super) {
    __extends(SimView, _super);
    /**
     *
     */
    function SimView(simRect) {
        var _this = _super.call(this) || this;
        /**
         * when panning horizontally, this is percentage of width to move.
         */
        _this.panX = 0.05;
        /**
         * when panning vertically, this is percentage of height to move.
         */
        _this.panY = 0.05;
        /**
         * when zooming, this is percentage of size to zoom
         */
        _this.zoom = 1.1;
        /**
         * The rectangle in screen coordinates where this SimView exists inside the LabCanvas.
         */
        _this.screenRect_ = new ScreenRect(0, 0, 800, 600);
        _this.horizAlign_ = AlignH.MIDDLE;
        _this.verticalAlign_ = AlignV.MIDDLE;
        _this.aspectRatio_ = 1.0;
        /**
         * This list of DisplayObjects that this SimView displays
         */
        _this.displayList_ = new DisplayList();
        _this.scaleTogether_ = true;
        /**
         * The transparency used when painting the drawables; a number between
         * 0.0 (fully transparent) and 1.0 (fully opaque).
         */
        _this.opaqueness = 1.0;
        _this.memorizables_ = [];
        if (!(simRect instanceof DoubleRect) || simRect.isEmpty()) {
            throw new Error('bad simRect: ' + simRect);
        }
        _this.simRect_ = simRect;
        _this.coordMap_ = CoordMap.make(_this.screenRect_, _this.simRect_, _this.horizAlign_, _this.verticalAlign_, _this.aspectRatio_);
        _this.width_ = simRect.getWidth();
        _this.height_ = simRect.getHeight();
        _this.centerX_ = simRect.getCenterX();
        _this.centerY_ = simRect.getCenterY();
        _this.ratio_ = _this.height_ / _this.width_;
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_WIDTH, function () { return _this.getWidth(); }, function (width) { return _this.setWidth(width); }));
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_HEIGHT, function () { return _this.getHeight(); }, function (height) { return _this.setHeight(height); }));
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_CENTER_X, function () { return _this.getCenterX(); }, function (centerX) { return _this.setCenterX(centerX); }).setLowerLimit(Number.NEGATIVE_INFINITY));
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_CENTER_Y, function () { return _this.getCenterY(); }, function (centerY) { return _this.setCenterY(centerY); }).setLowerLimit(Number.NEGATIVE_INFINITY));
        _this.addParameter(new ParameterBoolean(_this, SimView.PARAM_NAME_SCALE_TOGETHER, function () { return _this.getScaleTogether(); }, function (scaleTogether) { return _this.setScaleTogether(scaleTogether); }));
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_VERTICAL_ALIGN, function () { return _this.vAxisAlign; }, function (vAxisAlign) { return _this.vAxisAlign = vAxisAlign; }));
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_HORIZONTAL_ALIGN, function () { return _this.hAxisAlign; }, function (hAxisAlign) { return _this.hAxisAlign = hAxisAlign; }));
        _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_ASPECT_RATIO, function () { return _this.getAspectRatio(); }, function (aspectRatio) { return _this.setAspectRatio(aspectRatio); }));
        return _this;
    }
    SimView.prototype.addMemo = function (memorizable) {
        if (!contains(this.memorizables_, memorizable)) {
            this.memorizables_.push(memorizable);
        }
    };
    /**
     *
     */
    SimView.prototype.gainFocus = function () {
        // Do nothing.
    };
    /**
     * Returns the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis' used when displaying this LabView.
     */
    SimView.prototype.getAspectRatio = function () {
        return this.aspectRatio_;
    };
    /**
     * Returns the horizontal coordinate of simulation rectangle's center.
     */
    SimView.prototype.getCenterX = function () {
        return this.centerX_;
    };
    /**
     * Returns the vertical coordinate of simulation rectangle's center.
     */
    SimView.prototype.getCenterY = function () {
        return this.centerY_;
    };
    SimView.prototype.getCoordMap = function () {
        return this.coordMap_; // it is immutable, so OK to return it
    };
    SimView.prototype.getDisplayList = function () {
        return this.displayList_;
    };
    /**
     * Returns height of the simulation rectangle.
     */
    SimView.prototype.getHeight = function () {
        return this.height_;
    };
    Object.defineProperty(SimView.prototype, "hAxisAlign", {
        /**
         * Returns the horizontal alignment to use when aligning the SimView's
         * simulation rectangle within its screen rectangle.
         */
        get: function () {
            return this.horizAlign_;
        },
        /**
         * Sets the horizontal alignment to use when aligning the SimView's
         * simulation rectangle within its screen rectangle.
         */
        set: function (alignHoriz) {
            this.horizAlign_ = alignHoriz;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_HORIZONTAL_ALIGN);
        },
        enumerable: false,
        configurable: true
    });
    SimView.prototype.getMemos = function () {
        return clone(this.memorizables_);
    };
    /**
     * Whether the width and height of the simulation rectangle scale together; if
     * true then changing one causes the other to change proportionally.
     */
    SimView.prototype.getScaleTogether = function () {
        return this.scaleTogether_;
    };
    SimView.prototype.getScreenRect = function () {
        return this.screenRect_; // it is immutable, so OK to return it
    };
    SimView.prototype.getSimRect = function () {
        return this.simRect_;
    };
    Object.defineProperty(SimView.prototype, "vAxisAlign", {
        /**
         * Returns the vertical alignment to use when aligning the SimView's
         * simulation rectangle within its screen rectangle.
         */
        get: function () {
            return this.verticalAlign_;
        },
        /**
         * Sets the vertical alignment to use when aligning the SimView's
         * simulation rectangle within its screen rectangle.
         */
        set: function (alignVert) {
            this.verticalAlign_ = alignVert;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_VERTICAL_ALIGN);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the width of the simulation rectangle.
     */
    SimView.prototype.getWidth = function () {
        return this.width_;
    };
    SimView.prototype.loseFocus = function () {
        // Do nothing.
    };
    SimView.prototype.paint = function (context) {
        context.save();
        context.globalAlpha = this.opaqueness;
        this.displayList_.draw(context, this.coordMap_);
        context.restore();
    };
    SimView.prototype.setCoordMap = function (map) {
        if (!CoordMap.isDuckType(map))
            throw new Error('not a CoordMap: ' + map);
        this.coordMap_ = map;
        this.broadcast(new GenericEvent(this, SimView.COORD_MAP_CHANGED));
    };
    SimView.prototype.setScreenRect = function (screenRect) {
        if (!ScreenRect.isDuckType(screenRect))
            throw new Error('not a ScreenRect: ' + screenRect);
        if (screenRect.isEmpty()) {
            throw new Error('empty screenrect');
        }
        if (!this.screenRect_.equals(screenRect)) {
            this.screenRect_ = screenRect;
            this.realign();
            this.broadcast(new GenericEvent(this, SimView.SCREEN_RECT_CHANGED));
        }
    };
    SimView.prototype.setSimRect = function (simRect) {
        if (!DoubleRect.isDuckType(simRect))
            throw new Error('not a DoubleRect: ' + simRect);
        if (!simRect.equals(this.simRect_)) {
            this.simRect_ = simRect;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_WIDTH);
            this.broadcastParameter(SimView.PARAM_NAME_HEIGHT);
            this.broadcastParameter(SimView.PARAM_NAME_CENTER_X);
            this.broadcastParameter(SimView.PARAM_NAME_CENTER_Y);
            this.broadcast(new GenericEvent(this, SimView.SIM_RECT_CHANGED));
        }
    };
    SimView.prototype.memorize = function () {
        for (var i = 0, n = this.memorizables_.length; i < n; i++) {
            this.memorizables_[i].memorize();
        }
    };
    SimView.prototype.realign = function () {
        this.setCoordMap(CoordMap.make(this.screenRect_, this.simRect_, this.horizAlign_, this.verticalAlign_, this.aspectRatio_));
        this.width_ = this.simRect_.getWidth();
        this.height_ = this.simRect_.getHeight();
        this.centerX_ = this.simRect_.getCenterX();
        this.centerY_ = this.simRect_.getCenterY();
        this.ratio_ = this.height_ / this.width_;
    };
    /**
     * Modifies the simulation rectangle of the target SimView according to our
     * current settings for width, height, centerX, centerY.
     */
    SimView.prototype.modifySimRect = function () {
        var left = this.centerX_ - this.width_ / 2.0;
        var bottom = this.centerY_ - this.height_ / 2.0;
        var r = new DoubleRect(left, bottom, left + this.width_, bottom + this.height_);
        this.setSimRect(r);
    };
    /**
     * Moves the center of the simulation rectangle (the 'camera') down by fraction
     * {@link #panY}, which causes the image to move up.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    SimView.prototype.panDown = function () {
        this.setCenterY(this.centerY_ - this.panY * this.height_);
    };
    /**
     * Moves the center of the simulation rectangle (the 'camera') left by fraction
     * {@link #panY}, which causes the image to move right.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    SimView.prototype.panLeft = function () {
        this.setCenterX(this.centerX_ - this.panX * this.width_);
    };
    /**
     * Moves the center of the simulation rectangle (the 'camera') right by fraction
     * {@link #panY}, which causes the image to move left.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    SimView.prototype.panRight = function () {
        this.setCenterX(this.centerX_ + this.panX * this.width_);
    };
    /**
     * Moves the center of the simulation rectangle (the 'camera') up by fraction
     * {@link #panY}, which causes the image to move down.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    SimView.prototype.panUp = function () {
        this.setCenterY(this.centerY_ + this.panY * this.height_);
    };
    /**
     *
     */
    SimView.prototype.removeMemo = function (memorizable) {
        remove(this.memorizables_, memorizable);
    };
    /**
     * Sets the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis' used when displaying this LabView.
     * @param {number} aspectRatio the aspect ratio used when displaying this LabView
     */
    SimView.prototype.setAspectRatio = function (aspectRatio) {
        if (veryDifferent(this.aspectRatio_, aspectRatio)) {
            this.aspectRatio_ = aspectRatio;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_ASPECT_RATIO);
        }
    };
    /**
     * Sets the horizontal coordinate of simulation rectangle's center,
     * and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param centerX the horizontal coordinate of simulation rectangle's center.
     */
    SimView.prototype.setCenterX = function (centerX) {
        if (veryDifferent(this.centerX_, centerX)) {
            this.centerX_ = centerX;
            this.modifySimRect();
        }
    };
    /**
     * Sets the vertical coordinate of simulation rectangle's center,
     * and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param {number} value the vertical coordinate of simulation rectangle's center.
     */
    SimView.prototype.setCenterY = function (value) {
        if (veryDifferent(this.centerY_, value)) {
            this.centerY_ = value;
            this.modifySimRect();
        }
    };
    /**
     * Sets height of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param {number} value height of the simulation rectangle
     */
    SimView.prototype.setHeight = function (value) {
        if (veryDifferent(this.height_, value)) {
            this.height_ = value;
            if (this.scaleTogether_) {
                this.width_ = this.height_ / this.ratio_;
            }
            this.modifySimRect();
        }
    };
    /**
     * Sets whether the width and height of the simulation rectangle scale together; if
     * true then changing one causes the other to change proportionally.
     * @param {boolean} value whether width and height scale together
     */
    SimView.prototype.setScaleTogether = function (value) {
        if (this.scaleTogether_ !== value) {
            this.scaleTogether_ = value;
            if (this.scaleTogether_) {
                this.ratio_ = this.height_ / this.width_;
            }
            this.broadcastParameter(SimView.PARAM_NAME_SCALE_TOGETHER);
        }
    };
    /**
     * Sets width of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param value width of the simulation rectangle
     */
    SimView.prototype.setWidth = function (value) {
        if (veryDifferent(this.width_, value)) {
            this.width_ = value;
            if (this.scaleTogether_) {
                this.height_ = this.width_ * this.ratio_;
            }
            this.modifySimRect();
        }
    };
    /**
     * Makes the height of the simulation rectangle smaller by fraction 1/{@link #zoom},
     * and also the width if {@link #getScaleTogether} is true.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    SimView.prototype.zoomIn = function () {
        this.setHeight(this.height_ / this.zoom);
    };
    /**
     * Makes the height of the simulation rectangle bigger by fraction {@link #zoom},
     * and also the width if {@link #getScaleTogether} is true.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    SimView.prototype.zoomOut = function () {
        this.setHeight(this.height_ * this.zoom);
    };
    SimView.PARAM_NAME_WIDTH = 'width';
    SimView.PARAM_NAME_HEIGHT = 'height';
    SimView.PARAM_NAME_CENTER_X = 'center-x';
    SimView.PARAM_NAME_CENTER_Y = 'center-y';
    SimView.PARAM_NAME_HORIZONTAL_ALIGN = 'horizontal-align';
    SimView.PARAM_NAME_VERTICAL_ALIGN = 'vertical-align';
    SimView.PARAM_NAME_ASPECT_RATIO = 'aspect-ratio';
    SimView.PARAM_NAME_SCALE_TOGETHER = 'scale X-Y together';
    /**
     * Name of event broadcast when the CoordMap changes, see {@link #setCoordMap}.
     */
    SimView.COORD_MAP_CHANGED = 'COORD_MAP_CHANGED';
    /**
     * Name of event broadcast when the screen rectangle size changes, see
     */
    SimView.SCREEN_RECT_CHANGED = 'SCREEN_RECT_CHANGED';
    /**
     * Name of event broadcast when the simulation rectangle size changes, see
     */
    SimView.SIM_RECT_CHANGED = 'SIM_RECT_CHANGED';
    return SimView;
}(AbstractSubject));
export { SimView };
