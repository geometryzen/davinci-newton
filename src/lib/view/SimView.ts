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

import { AbstractSubject } from '../util/AbstractSubject';
import clone from '../util/clone';
import { contains } from '../util/contains';
import { GenericEvent } from '../util/GenericEvent';
import { Memorizable } from '../util/Memorizable';
import { ParameterBoolean } from '../util/ParameterBoolean';
import { ParameterNumber } from '../util/ParameterNumber';
import { remove } from '../util/remove';
import { veryDifferent } from '../util/veryDifferent';
import { AlignH } from './AlignH';
import { AlignV } from './AlignV';
import { CoordMap } from './CoordMap';
import { DisplayList } from './DisplayList';
import { DoubleRect } from './DoubleRect';
import { LabView } from './LabView';
import { ScreenRect } from './ScreenRect';

/**
 * @hidden
 */
export class SimView extends AbstractSubject implements LabView {
    public static readonly PARAM_NAME_WIDTH = 'width';
    public static readonly PARAM_NAME_HEIGHT = 'height';
    public static readonly PARAM_NAME_CENTER_X = 'center-x';
    public static readonly PARAM_NAME_CENTER_Y = 'center-y';
    public static readonly PARAM_NAME_HORIZONTAL_ALIGN = 'horizontal-align';
    public static readonly PARAM_NAME_VERTICAL_ALIGN = 'vertical-align';
    public static readonly PARAM_NAME_ASPECT_RATIO = 'aspect-ratio';
    public static readonly PARAM_NAME_SCALE_TOGETHER = 'scale X-Y together';
    /**
     * Name of event broadcast when the CoordMap changes, see {@link #setCoordMap}.
     */
    public static readonly COORD_MAP_CHANGED = 'COORD_MAP_CHANGED';
    /**
     * Name of event broadcast when the screen rectangle size changes, see
     */
    public static readonly SCREEN_RECT_CHANGED = 'SCREEN_RECT_CHANGED';
    /**
     * Name of event broadcast when the simulation rectangle size changes, see
     */
    public static readonly SIM_RECT_CHANGED = 'SIM_RECT_CHANGED';
    /**
     * when panning horizontally, this is percentage of width to move.
     */
    panX = 0.05;
    /**
     * when panning vertically, this is percentage of height to move.
     */
    panY = 0.05;
    /**
     * when zooming, this is percentage of size to zoom
     */
    zoom = 1.1;
    /**
     * The boundary rectangle in simulation coordinates.
     */
    private simRect_: DoubleRect;
    /**
     * The rectangle in screen coordinates where this SimView exists inside the LabCanvas.
     */
    private screenRect_ = new ScreenRect(0, 0, 800, 600);
    private horizAlign_ = AlignH.MIDDLE;
    private verticalAlign_ = AlignV.MIDDLE;
    private aspectRatio_ = 1.0;
    /**
     * This list of DisplayObjects that this SimView displays
     */
    private readonly displayList_ = new DisplayList();
    private scaleTogether_ = true;
    /**
     * The CoordMap that defines the simulation coordinates for this LabView.
     */
    private coordMap_: CoordMap;
    /**
     * The transparency used when painting the drawables; a number between
     * 0.0 (fully transparent) and 1.0 (fully opaque).
     */
    opaqueness = 1.0;
    private width_: number;
    private height_: number;
    private centerX_: number;
    private centerY_: number;
    /**
     * ratio of height/width, used when scaleTogether_ is true.
     */
    private ratio_: number;
    private readonly memorizables_: Memorizable[] = [];
    /**
     * 
     */
    constructor(simRect: DoubleRect) {
        super();
        if (!(simRect instanceof DoubleRect) || simRect.isEmpty()) {
            throw new Error('bad simRect: ' + simRect);
        }
        this.simRect_ = simRect;
        this.coordMap_ = CoordMap.make(this.screenRect_, this.simRect_, this.horizAlign_, this.verticalAlign_, this.aspectRatio_);
        this.width_ = simRect.getWidth();
        this.height_ = simRect.getHeight();
        this.centerX_ = simRect.getCenterX();
        this.centerY_ = simRect.getCenterY();
        this.ratio_ = this.height_ / this.width_;
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_WIDTH, () => this.getWidth(), (width: number) => this.setWidth(width)));
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_HEIGHT, () => this.getHeight(), (height: number) => this.setHeight(height)));
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_CENTER_X, () => this.getCenterX(), (centerX: number) => this.setCenterX(centerX)).setLowerLimit(Number.NEGATIVE_INFINITY));
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_CENTER_Y, () => this.getCenterY(), (centerY: number) => this.setCenterY(centerY)).setLowerLimit(Number.NEGATIVE_INFINITY));
        this.addParameter(new ParameterBoolean(this, SimView.PARAM_NAME_SCALE_TOGETHER, () => this.getScaleTogether(), (scaleTogether: boolean) => this.setScaleTogether(scaleTogether)));
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_VERTICAL_ALIGN, () => this.vAxisAlign, (vAxisAlign: AlignV) => this.vAxisAlign = vAxisAlign));
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_HORIZONTAL_ALIGN, () => this.hAxisAlign, (hAxisAlign: AlignH) => this.hAxisAlign = hAxisAlign));
        this.addParameter(new ParameterNumber(this, SimView.PARAM_NAME_ASPECT_RATIO, () => this.getAspectRatio(), (aspectRatio: number) => this.setAspectRatio(aspectRatio)));
    }

    addMemo(memorizable: Memorizable) {
        if (!contains(this.memorizables_, memorizable)) {
            this.memorizables_.push(memorizable);
        }
    }

    /**
     * 
     */
    gainFocus(): void {
        // Do nothing.
    }

    /**
     * Returns the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis' used when displaying this LabView.
     */
    getAspectRatio() {
        return this.aspectRatio_;
    }

    /**
     * Returns the horizontal coordinate of simulation rectangle's center.
     */
    getCenterX() {
        return this.centerX_;
    }

    /**
     * Returns the vertical coordinate of simulation rectangle's center.
     */
    getCenterY() {
        return this.centerY_;
    }

    getCoordMap(): CoordMap {
        return this.coordMap_; // it is immutable, so OK to return it
    }

    getDisplayList(): DisplayList {
        return this.displayList_;
    }

    /**
     * Returns height of the simulation rectangle.
     */
    getHeight() {
        return this.height_;
    }

    /**
     * Returns the horizontal alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    get hAxisAlign(): AlignH {
        return this.horizAlign_;
    }

    getMemos() {
        return clone(this.memorizables_);
    }

    /**
     * Whether the width and height of the simulation rectangle scale together; if
     * true then changing one causes the other to change proportionally.
     */
    getScaleTogether() {
        return this.scaleTogether_;
    }

    getScreenRect(): ScreenRect {
        return this.screenRect_; // it is immutable, so OK to return it
    }
    getSimRect(): DoubleRect {
        return this.simRect_;
    }

    /**
     * Returns the vertical alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    get vAxisAlign(): AlignV {
        return this.verticalAlign_;
    }

    /**
     * Returns the width of the simulation rectangle.
     */
    getWidth() {
        return this.width_;
    }

    loseFocus(): void {
        // Do nothing.
    }

    paint(context: CanvasRenderingContext2D): void {
        context.save();
        context.globalAlpha = this.opaqueness;
        this.displayList_.draw(context, this.coordMap_);
        context.restore();
    }

    setCoordMap(map: CoordMap): void {
        if (!CoordMap.isDuckType(map))
            throw new Error('not a CoordMap: ' + map);
        this.coordMap_ = map;
        this.broadcast(new GenericEvent(this, SimView.COORD_MAP_CHANGED));
    }

    setScreenRect(screenRect: ScreenRect): void {
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
    }

    setSimRect(simRect: DoubleRect): void {
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
    }

    memorize(): void {
        for (let i = 0, n = this.memorizables_.length; i < n; i++) {
            this.memorizables_[i].memorize();
        }
    }

    private realign(): void {
        this.setCoordMap(CoordMap.make(this.screenRect_, this.simRect_, this.horizAlign_, this.verticalAlign_, this.aspectRatio_));
        this.width_ = this.simRect_.getWidth();
        this.height_ = this.simRect_.getHeight();
        this.centerX_ = this.simRect_.getCenterX();
        this.centerY_ = this.simRect_.getCenterY();
        this.ratio_ = this.height_ / this.width_;
    }

    /**
     * Modifies the simulation rectangle of the target SimView according to our
     * current settings for width, height, centerX, centerY.
     */
    private modifySimRect() {
        const left = this.centerX_ - this.width_ / 2.0;
        const bottom = this.centerY_ - this.height_ / 2.0;
        const r = new DoubleRect(left, bottom, left + this.width_, bottom + this.height_);
        this.setSimRect(r);
    }


    /**
     * Moves the center of the simulation rectangle (the 'camera') down by fraction
     * {@link #panY}, which causes the image to move up.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panDown(): void {
        this.setCenterY(this.centerY_ - this.panY * this.height_);
    }

    /**
     * Moves the center of the simulation rectangle (the 'camera') left by fraction
     * {@link #panY}, which causes the image to move right.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panLeft(): void {
        this.setCenterX(this.centerX_ - this.panX * this.width_);
    }

    /**
     * Moves the center of the simulation rectangle (the 'camera') right by fraction
     * {@link #panY}, which causes the image to move left.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panRight(): void {
        this.setCenterX(this.centerX_ + this.panX * this.width_);
    }

    /**
     * Moves the center of the simulation rectangle (the 'camera') up by fraction
     * {@link #panY}, which causes the image to move down.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    panUp(): void {
        this.setCenterY(this.centerY_ + this.panY * this.height_);
    }

    /**
     * 
     */
    removeMemo(memorizable: Memorizable): void {
        remove(this.memorizables_, memorizable);
    }

    /**
     * Sets the ratio of 'pixels per simulation unit along y axis' divided
     * by 'pixels per simulation unit along x axis' used when displaying this LabView.
     * @param {number} aspectRatio the aspect ratio used when displaying this LabView
     */
    setAspectRatio(aspectRatio: number) {
        if (veryDifferent(this.aspectRatio_, aspectRatio)) {
            this.aspectRatio_ = aspectRatio;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_ASPECT_RATIO);
        }
    }

    /**
     * Sets the horizontal coordinate of simulation rectangle's center,
     * and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param centerX the horizontal coordinate of simulation rectangle's center.
     */
    setCenterX(centerX: number) {
        if (veryDifferent(this.centerX_, centerX)) {
            this.centerX_ = centerX;
            this.modifySimRect();
        }
    }

    /**
     * Sets the vertical coordinate of simulation rectangle's center,
     * and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param {number} value the vertical coordinate of simulation rectangle's center.
     */
    setCenterY(value: number): void {
        if (veryDifferent(this.centerY_, value)) {
            this.centerY_ = value;
            this.modifySimRect();
        }
    }


    /**
     * Sets height of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param {number} value height of the simulation rectangle
     */
    setHeight(value: number): void {
        if (veryDifferent(this.height_, value)) {
            this.height_ = value;
            if (this.scaleTogether_) {
                this.width_ = this.height_ / this.ratio_;
            }
            this.modifySimRect();
        }
    }

    /**
     * Sets the horizontal alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    set hAxisAlign(alignHoriz: AlignH) {
        this.horizAlign_ = alignHoriz;
        this.realign();
        this.broadcastParameter(SimView.PARAM_NAME_HORIZONTAL_ALIGN);
    }

    /**
     * Sets whether the width and height of the simulation rectangle scale together; if
     * true then changing one causes the other to change proportionally.
     * @param {boolean} value whether width and height scale together
     */
    setScaleTogether(value: boolean): void {
        if (this.scaleTogether_ !== value) {
            this.scaleTogether_ = value;
            if (this.scaleTogether_) {
                this.ratio_ = this.height_ / this.width_;
            }
            this.broadcastParameter(SimView.PARAM_NAME_SCALE_TOGETHER);
        }
    }

    /**
     * Sets the vertical alignment to use when aligning the SimView's
     * simulation rectangle within its screen rectangle.
     */
    set vAxisAlign(alignVert: AlignV) {
        this.verticalAlign_ = alignVert;
        this.realign();
        this.broadcastParameter(SimView.PARAM_NAME_VERTICAL_ALIGN);
    }

    /**
     * Sets width of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
     * @param value width of the simulation rectangle
     */
    setWidth(value: number): void {
        if (veryDifferent(this.width_, value)) {
            this.width_ = value;
            if (this.scaleTogether_) {
                this.height_ = this.width_ * this.ratio_;
            }
            this.modifySimRect();
        }
    }

    /**
     * Makes the height of the simulation rectangle smaller by fraction 1/{@link #zoom},
     * and also the width if {@link #getScaleTogether} is true.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    zoomIn(): void {
        this.setHeight(this.height_ / this.zoom);
    }

    /**
     * Makes the height of the simulation rectangle bigger by fraction {@link #zoom},
     * and also the width if {@link #getScaleTogether} is true.
     * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
     */
    zoomOut(): void {
        this.setHeight(this.height_ * this.zoom);
    }

}
