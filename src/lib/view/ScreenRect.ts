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

import isFunction from '../checks/isFunction';
import { veryDifferent } from '../util/veryDifferent';

/**
 * An immutable rectangle corresponding to screen coordinates where the
 * vertical coordinates increase downwards.
 * @hidden
 */
export class ScreenRect {
    private left_: number;
    private top_: number;
    private width_: number;
    private height_: number;

    /**
     * 
     */
    constructor(left: number, top_: number, width: number, height: number) {
        if (width < 0 || height < 0) {
            throw new Error();
        }
        this.left_ = left;
        this.top_ = top_;
        this.width_ = width;
        this.height_ = height;
    }

    /**
     * An empty ScreenRect located at the origin.
     */
    static EMPTY_RECT = new ScreenRect(0, 0, 0, 0);

    /**
     * Returns a copy of the given ScreenRect.
     * @param rect the ScreenRect to clone
     * @return a copy of `rect`
     */
    static clone(rect: ScreenRect): ScreenRect {
        return new ScreenRect(rect.left_, rect.top_, rect.width_, rect.height_);
    }

    /**
     * Returns true if this ScreenRect is exactly equal to the other ScreenRect.
     * @param otherRect the ScreenRect to compare to
     * @return true if this ScreenRect is exactly equal to the other ScreenRect
     */
    equals(otherRect: ScreenRect): boolean {
        return this.left_ === otherRect.left_ &&
            this.top_ === otherRect.top_ &&
            this.width_ === otherRect.width_ &&
            this.height_ === otherRect.height_;
    }

    /**
     * Returns true if the object is likely a ScreenRect. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a ScreenRect
     */
    static isDuckType(obj: any): obj is ScreenRect {
        if (obj instanceof ScreenRect) {
            return true;
        }
        return obj.getLeft !== undefined
            && obj.getTop !== undefined
            && obj.getWidth !== undefined
            && obj.getHeight !== undefined
            && obj.isEmpty !== undefined
            && obj.equals !== undefined
            && obj.nearEqual !== undefined;
    }

    /**
     * The horizontal coordinate of this ScreenRect center.
     * @return the horizontal coordinate of this ScreenRect center
     */
    getCenterX(): number {
        return this.left_ + this.width_ / 2;
    }

    /**
     * The vertical coordinate of this ScreenRect center
     * @return the vertical coordinate of this ScreenRect center
     */
    getCenterY(): number {
        return this.top_ + this.height_ / 2;
    }

    /**
     * The height of this ScreenRect.
     * @return the height of this ScreenRect.
     */
    getHeight(): number {
        return this.height_;
    }

    /**
     * The left coordinate of this ScreenRect.
     * @return the left coordinate of this ScreenRect.
     */
    getLeft(): number {
        return this.left_;
    }

    /**
     * The top coordinate of this ScreenRect.
     * @return the top coordinate of this ScreenRect
     */
    getTop(): number {
        return this.top_;
    }

    /**
     * The width of this ScreenRect.
     * @return the width of this ScreenRect.
     */
    getWidth(): number {
        return this.width_;
    }

    /**
     * Returns true if this ScreenRect has zero width or height, within the tolerance
     * @param tolerance tolerance for comparison, default is 1E-14;
     */
    isEmpty(tolerance = 1E-14) {
        return this.width_ < tolerance || this.height_ < tolerance;
    }

    /**
     * Creates an oval path in the Canvas context, with the size of this ScreenRect.
     * @param context the Canvas context to draw into
     */
    makeOval(context: CanvasRenderingContext2D) {
        const w = this.width_ / 2;
        const h = this.height_ / 2;
        if (isFunction(context.ellipse)) {
            context.beginPath();
            context.moveTo(this.left_ + this.width_, this.top_ + h);
            // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
            context.ellipse(this.left_ + w, this.top_ + h, w, h, 0, 0, 2 * Math.PI, false);
        }
        else {
            // If ellipse() is not defined, draw a circle instead
            const min = Math.min(w, h);
            context.beginPath();
            context.moveTo(this.left_ + this.width_, this.top_);
            // arc(x, y, radius, startAngle, endAngle, anticlockwise);
            context.arc(this.left_ + w, this.top_ + h, min, 0, 2 * Math.PI, false);
            context.closePath();
        }
    }

    /**
     * Creates a rectangle path in the Canvas context, with the size of this ScreenRect.
     * @param context the Canvas context to draw into
     */
    makeRect(context: CanvasRenderingContext2D) {
        context.rect(this.left_, this.top_, this.width_, this.height_);
    }

    /**
     * Returns true if this ScreenRect is nearly equal to another ScreenRect.
     * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
     * used depends on the magnitude of the numbers being compared.
     * @param otherRect  the ScreenRect to compare to
     * @param opt_tolerance optional tolerance for comparison
     * @return true if this ScreenRect is nearly equal to the other ScreenRect
     */
    nearEqual(otherRect: ScreenRect, opt_tolerance?: number): boolean {
        if (veryDifferent(this.left_, otherRect.left_, opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.top_, otherRect.top_, opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.width_, otherRect.width_, opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.height_, otherRect.height_, opt_tolerance)) {
            return false;
        }
        return true;
    }
}
