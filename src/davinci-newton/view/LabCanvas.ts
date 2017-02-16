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

import AbstractSubject from '../util/AbstractSubject';
import clone from '../util/clone';
import contains from '../util/contains';
import GenericEvent from '../util/GenericEvent';
import isEmpty from '../util/isEmpty';
import isNumber from '../checks/isNumber';
import LabView from './LabView';
import Memorizable from '../util/Memorizable';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import remove from '../util/remove';
import ScreenRect from './ScreenRect';
import veryDifferent from '../util/veryDifferent';

const WIDTH = 'width';
const HEIGHT = 'height';
const ALPHA = 'alpha';
const BACKGROUND = 'background';

/**
 * Manages an HTML canvas and contains a list of LabView(s)
 * which are drawn into the canvas. The LabViews are drawn overlapping so that the last
 * LabView appears on top of the others.
 * 
 * Canvas Size and Shape
 * 
 * The HTML canvas has a specified width and height, which determines its resolution and
 * shape. The size can be changed via setWidth, setHeight, or setSize.
 * When the size of the HTML canvas changes, the LabViews are set to have the
 * same screen rectangle as the canvas.
 * 
 * Each LabView has a simulation rectangle which is placed over its screen rectangle via a
 * CoordMap. The simulation rectangle specifies the simulation coordinates,
 * and the CoordMap translates simulation coordinates to screen
 * coordinates. Pan and zoom can be accomplished by changing the simulation rectangle of a
 * LabView (which changes its CoordMap accordingly).
 * 
 * Focus View
 * 
 * The first LabView that is added becomes the **focus view**. The focus view is treated
 * specially by some classes.
 * 
 * Background Color
 * 
 * Whenever {@link #paint} is called to draw a new frame, the first step is to clear the
 * old frame from the HTML canvas.
 * 
 * + If no background color is specified (an empty string) then we use the
 * JavaScript `canvas.clearRect()` method which clears to transparent black pixels.
 * 
 * + If a background color is specified, then we use JavaScript
 * `canvas.fillRect()` to fill the HTML canvas with that color.
 * 
 * The background color can be set with {@link #setBackground}.
 * 
 * Trails Effect
 * 
 * A visual effect where moving objects leave behind a smeared out trail can be done by
 * setting the background color and the *alpha* transparency, see {@link #setAlpha}.
 * Here are example settings:
 * 
 * simCanvas.setBackground('black');
 * simCanvas.setAlpha(0.05);
 * 
 * When `alpha` is 1.0 then there is no trails effect because the old frame is entirely
 * painted over with an opaque color.
 * 
 * The trails effect happens when `alpha` is less than 1 because we paint a translucent
 * rectangle over the old frame, which gradually makes the old image disappear after
 * several iterations of painting.
 * 
 * ### Parameters Created
 * 
 * + ParameterNumber named `LabCanvas.en.WIDTH`
 * see {@link #setWidth}
 * 
 * + ParameterNumber named `LabCanvas.en.HEIGHT`
 * see {@link #setHeight}
 * 
 * ### Events Broadcast
 * 
 * LabCanvas broadcasts these GenericEvent(s) to its Observers:
 * 
 * + {@link #VIEW_ADDED} the value of the GenericEvent is the LabView being added
 * 
 * + {@link #VIEW_REMOVED} the value of the GenericEvent is the LabView being removed
 * 
 * + {@link #FOCUS_VIEW_CHANGED} the value of the GenericEvent is the LabView which is
 * the focus, or `null` if there is no focus view
 * 
 * + {@link #VIEW_LIST_MODIFIED}
 * 
 * + {@link #SIZE_CHANGED}
 */
export class LabCanvas extends AbstractSubject {

    /**
     * Name of GenericEvent that is broadcast when the focus view changes.
     */
    static FOCUS_VIEW_CHANGED = 'FOCUS_VIEW_CHANGED';

    /**
     * Name of GenericEvent that is broadcast when the size of the HTML canvas changes.
     */
    static SIZE_CHANGED = 'SIZE_CHANGED';

    /**
     * Name of GenericEvent that is broadcast when the list of LabViews is modified.
     */
    static VIEW_LIST_MODIFIED = 'VIEW_LIST_MODIFIED';

    /**
     * Name of GenericEvent that is broadcast when a LabView is added.
     */
    static VIEW_ADDED = 'VIEW_ADDED';

    /**
     * Name of GenericEvent that is broadcast when a LabView is removed.
     */
    static VIEW_REMOVED = 'VIEW_REMOVED';

    /**
     * 
     */
    private readonly canvas_: HTMLCanvasElement;
    /**
     * 
     */
    private readonly labViews_: LabView[] = [];
    /**
     * 
     */
    private readonly memorizables_: Memorizable[] = [];
    /**
     * The view which is the main focus and is drawn normally.
     */
    private focusView_: LabView = null;
    /**
     * The transparency used when painting the background color; a number between
     * 0.0 (fully transparent) and 1.0 (fully opaque).
     */
    private alpha_ = 1;
    /**
     * The background color; either a CSS3 color value or the empty string. Transparent
     * black is used if it is the empty string.
     */
    private background_ = '';
    /**
     * 
     */
    // private readonly debug_ = false;
    /**
     * 
     */
    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas_ = canvas;
        // contentEditable makes the canvas be focusable (can get keyboard focus)
        // and can get control of the cursor.
        // Result is: if you were editting a NumericControl, for example, then
        // clicking on canvas will cause that control to lose focus, which is what we want.
        // Also, this seems to enable setting the cursor according to the CSS values
        // for canvas.cursor and canvas:active.cursor.
        // Oct 2014: set canvas.contentEditable to false. This fixes problems where clicking
        // on canvas would bring up keyboard on iPhone and cause a huge blinking text cursor
        // on side of canvas. However, canvas will no longer get text events.
        // Dec 2014: see places where we set the tabIndex to allow the canvas to get focus.
        canvas.contentEditable = 'false';
        /*
        this.addParameter(new ParameterNumber(this, LabCanvas.en.WIDTH,
            LabCanvas.i18n.WIDTH, this.getWidth, this.setWidth));
        this.addParameter(new ParameterNumber(this, LabCanvas.en.HEIGHT,
            LabCanvas.i18n.HEIGHT, this.getHeight, this.setHeight));
        this.addParameter(new ParameterNumber(this, LabCanvas.en.ALPHA,
            LabCanvas.i18n.ALPHA, this.getAlpha, this.setAlpha));
        this.addParameter(new ParameterString(this, LabCanvas.en.BACKGROUND,
            LabCanvas.i18n.BACKGROUND, this.getBackground, this.setBackground));
            */
    }
    addMemo(memorizable: Memorizable): void {
        if (!contains(this.memorizables_, memorizable)) {
            this.memorizables_.push(memorizable);
        }
    }

    /**
     * Adds the LabView to the end of the list of LabViews displayed and memorized by this
     * LabCanvas. Makes the LabView the focus view if there isn't currently a focus view.
     * Notifies any Observers by broadcasting GenericEvents named {@link #VIEW_ADDED} and
     * {@link #VIEW_LIST_MODIFIED} and possibly also {@link #FOCUS_VIEW_CHANGED}.
     * @param view the LabView to add
     */
    addView(view: LabView) {
        mustBeNonNullObject('view', view);
        if (this.getWidth() > 0 && this.getHeight() > 0) {
            const screenRect = new ScreenRect(0, 0, this.getWidth(), this.getHeight());
            view.setScreenRect(screenRect);
        }
        this.labViews_.push(view);
        this.addMemo(view);
        this.broadcast(new GenericEvent(this, LabCanvas.VIEW_ADDED, view));
        this.broadcast(new GenericEvent(this, LabCanvas.VIEW_LIST_MODIFIED));
        // set the first view added to be the focus.
        if (this.focusView_ == null) {
            this.setFocusView(view);
        }
    }

    /**
     * Moves the keyboard focus to the HTML canvas.
     */
    focus(): void {
        // Move the keyboard focus to the canvas.  This is desirable so that if
        // the user was editting a text field, it ends that editting operation.
        // see http://stackoverflow.com/questions/1829586/
        //     how-do-i-give-an-html-canvas-the-keyboard-focus-using-jquery
        this.canvas_.focus();
    }

    /**
     * Returns the transparency used when painting; a number between 0.0 (fully transparent)
     * and 1.0 (fully opaque). Only has an effect if the background color is non-empty string.
     * @return transparency used when painting, between 0 and 1.
     */
    getAlpha(): number {
        return this.alpha_;
    }

    /**
     * Returns the background color; either a CSS3 color value or the empty string. Empty
     * string means that background is cleared to transparent black.
     * @return the background color; either a CSS3 color value or the empty string.
     */
    getBackground(): string {
        return this.background_;
    }

    /**
     * Returns the HTML canvas being managed by this LabCanvas.
     * @return the HTML canvas being managed by this LabCanvas
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas_;
    }

    /**
     * Returns the CanvasRenderingContext2D used for drawing into the HTML canvas being
     * managed by this LabCanvas.
     * @return the CanvasRenderingContext2D used for drawing into the HTML canvas
     */
    getContext(): CanvasRenderingContext2D {
        return this.canvas_.getContext('2d');
    }

    /**
     * Returns the focus LabView which is the main focus of the LabCanvas.
     * @return the focus LabView, or `null` when there is no focus LabView
     */
    getFocusView(): LabView {
        return this.focusView_;
    }

    /**
     * Returns the height of the HTML canvas, in screen coords (pixels).
     */
    getHeight(): number {
        return this.canvas_.height;
    }

    getMemos(): Memorizable[] {
        return clone(this.memorizables_);
    }

    /**
     * Returns the ScreenRect corresponding to the area of the HTML canvas.
     * The top-left coordinate is always (0,0).  This does not represent the location
     * of the canvas within the document or window.
     */
    getScreenRect(): ScreenRect {
        return new ScreenRect(0, 0, this.canvas_.width, this.canvas_.height);
    }

    /**
     * Returns list of the LabViews in this LabCanvas.
     */
    getViews(): LabView[] {
        return clone(this.labViews_);
    }

    /**
     * Returns the width of the HTML canvas, in screen coords (pixels).
     */
    getWidth(): number {
        return this.canvas_.width;
    }

    memorize(): void {
        for (let i = 0, n = this.memorizables_.length; i < n; i++) {
            this.memorizables_[i].memorize();
        }
    }

    notifySizeChanged(): void {
        const r = this.getScreenRect();
        this.labViews_.forEach(function (view) {
            view.setScreenRect(r);
        });
        this.broadcast(new GenericEvent(this, LabCanvas.SIZE_CHANGED));
    }

    /**
     * Clears the canvas to the background color; then paints each LabView.
     */
    paint() {
        // Avoid painting when the canvas is hidden.
        // http://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
        // According to MDN documentation, an element's offsetParent property will return
        // `null` whenever it, or any of its parents, is hidden via the display style
        // property. Just make sure that the element doesnt have 'position:fixed;'.
        if (this.canvas_.offsetParent != null) {
            const context = this.canvas_.getContext('2d');
            context.save();
            if (this.background_ !== '') {
                // Notes Nov 22, 2016:
                // Setting a fillStyle color with transparency doesn't work here.
                // For example rgb(0,0,0,0.05). Only setting globalAlpha works.
                // Does fillRect() always ignore the alpha value of the color?
                // That does not seem to be according to spec.
                // Note also that globalAlpha has no effect on fill() because in that
                // case the fillStyle's alpha is always used, and if not specified then
                // it seems to assume alpha = 1.
                context.globalAlpha = this.alpha_;
                context.fillStyle = this.background_;
                context.fillRect(0, 0, this.canvas_.width, this.canvas_.height);
                context.globalAlpha = 1;
            }
            else {
                // clearRect sets all pixels in the rectangle to transparent black,
                // erasing any previously drawn content.
                // clearRect is supposed to be faster than fillRect.
                context.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
            }
            const vs = this.labViews_;
            const N = vs.length;
            for (let i = 0; i < N; i++) {
                vs[i].paint(context);
            }
            context.restore();
        }
    }

    removeMemo(memorizable: Memorizable): void {
        remove(this.memorizables_, memorizable);
    }

    /**
     * Removes the LabView from the list of LabViews displayed and memorized by this
     * LabCanvas. Sets the focus view to be the first view in remaining list of LabViews.
     * Notifies any Observers by broadcasting GenericEvents named VIEW_LIST_MODIFIED
     * and IEW_REMOVED and possibly also FOCUS_VIEW_CHANGED.
     * @param view the LabView to remove
     */
    removeView(view: LabView): void {
        mustBeNonNullObject('view', view);
        remove(this.labViews_, view);
        this.removeMemo(view);
        if (this.focusView_ === view) {
            // pick first view to focus on, if possible
            this.setFocusView(isEmpty(this.labViews_) ? null : this.labViews_[0]);
        }
        this.broadcast(new GenericEvent(this, LabCanvas.VIEW_REMOVED, view));
        this.broadcast(new GenericEvent(this, LabCanvas.VIEW_LIST_MODIFIED));
    }

    /**
     * Sets the transparency used when painting; a number between 0.0 (fully transparent)
     * and 1.0 (fully opaque). Only has an effect if the background color is non-empty string.
     * @param value transparency used when painting, between 0 and 1
     */
    setAlpha(value: number): void {
        if (veryDifferent(this.alpha_, value)) {
            this.alpha_ = value;
            // Alpha has no effect when background is empty string which means
            // "clear to transparent black". Set background to white in that case.
            if (veryDifferent(value, 1) && this.background_ === '') {
                this.setBackground('white');
            }
            this.broadcastParameter(ALPHA);
        }
    }

    /**
     * Sets the background color; either a CSS3 color value or the empty string. Empty
     * string means that background is cleared to transparent black.
     * @param value the background color; either a CSS3 color value or the empty string
     */
    setBackground(value: string): void {
        if (this.background_ !== value) {
            this.background_ = value;
            this.broadcastParameter(BACKGROUND);
        }
    }

    /**
     * Sets the focus LabView which is the main focus of the LabCanvas. Notifies any
     * observers that the focus has changed by broadcasting the GenericEvent named FOCUS_VIEW_CHANGED.
     * @param view the view that should be the focus; can be `null` when no LabView has the focus.
     * @throws Error if `view` is not contained by this LabCanvas
     */
    setFocusView(view: LabView): void {
        if (view != null && !contains(this.labViews_, view))
            throw new Error('cannot set focus to unknown view ' + view);
        if (this.focusView_ !== view) {
            if (this.focusView_ != null) {
                this.focusView_.loseFocus();
            }
            this.focusView_ = view;
            if (view != null) {
                view.gainFocus();
            }
            this.broadcast(new GenericEvent(this, LabCanvas.FOCUS_VIEW_CHANGED, view));
        }
    }

    /**
     * Sets the height of the HTML canvas, and sets the screen rectangle of all the
     * LabViews. Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
     * @param value  the height of the canvas, in screen coords (pixels).
     */
    setHeight(value: number): void {
        if (veryDifferent(value, this.canvas_.height)) {
            this.canvas_.height = value;
        }
        this.notifySizeChanged();
        this.broadcastParameter(HEIGHT);
    }

    /**
     * Sets the size of this LabCanvas to the given ScreenRect by calling {@link #setSize}.
     *  @param sr  specifies the width and height; the top-left must be (0,0).
     *  @throws if the top-left of the given ScreenRect is not (0,0).
     */
    setScreenRect(sr: ScreenRect): void {
        if (!ScreenRect.isDuckType(sr)) {
            throw new Error('not a ScreenRect ' + sr);
        }
        if (sr.getTop() !== 0 || sr.getLeft() !== 0) {
            throw new Error('top left must be 0,0, was: ' + sr);
        }
        this.setSize(sr.getWidth(), sr.getHeight());
    }

    /**
     * Sets the size of the HTML canvas. All LabViews are set to have the
     * same screen rectangle as this LabCanvas by calling setScreenRect.
     * Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
     * @param width  the width of the canvas, in screen coords (pixels)
     * @param height  the height of the canvas, in screen coords (pixels)
     */
    setSize(width: number, height: number): void {
        if (!isNumber(width) || width <= 0 || !isNumber(height) || height <= 0) {
            throw new Error('bad size ' + width + ', ' + height);
        }
        this.canvas_.width = width;
        this.canvas_.height = height;
        this.notifySizeChanged();
        this.broadcastParameter(WIDTH);
        this.broadcastParameter(HEIGHT);
    };

    /**
     * Sets the width of the HTML canvas, and sets the screen rectangle of all the
     * LabViews. Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
     * @param value  the width of the canvas, in screen coords (pixels).
     */
    setWidth(value: number): void {
        if (veryDifferent(value, this.canvas_.width)) {
            this.canvas_.width = value;
        }
        this.notifySizeChanged();
        this.broadcastParameter(WIDTH);
    }
}

export default LabCanvas;
