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

import { veryDifferent } from '../util/veryDifferent';
import Point from './Point';

/**
 * A rectangle whose boundaries are stored with double floating
 * point precision. This is an immutable class: once an instance is created it cannot be
 * changed.
 * 
 * Note that for DoubleRect we regard the vertical coordinate as **increasing upwards**, so
 * the top coordinate is greater than the bottom coordinate. This is in contrast to HTML5
 * canvas where vertical coordinates increase downwards.
 * @hidden
 */
export class DoubleRect {
    private left_: number;
    private right_: number;
    private bottom_: number;
    private top_: number;
    constructor(left: number, bottom: number, right: number, top: number) {
        this.left_ = left;
        this.right_ = right;
        this.bottom_ = bottom;
        this.top_ = top;
        if (left > right) {
            throw new Error('DoubleRect: left > right ' + left + ' > ' + right);
        }
        if (bottom > top) {
            throw new Error('DoubleRect: bottom > top ' + bottom + ' > ' + top);
        }
    }

    /**
     * The empty rectangle (0, 0, 0, 0).
     */
    static EMPTY_RECT = new DoubleRect(0, 0, 0, 0);

    /**
     * Returns a copy of the given DoubleRect.
     * @param rect the DoubleRect to copy
     * @return a copy of the given DoubleRect
     */
    static clone(rect: DoubleRect): DoubleRect {
        return new DoubleRect(rect.getLeft(), rect.getBottom(),
            rect.getRight(), rect.getTop());
    }

    /**
     * Returns true if the object is likely a DoubleRect. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a DoubleRect
     */
    static isDuckType(obj: unknown): obj is DoubleRect {
        if (obj instanceof DoubleRect) {
            return true;
        }
        return (obj as DoubleRect).getLeft !== undefined
            && (obj as DoubleRect).getRight !== undefined
            && (obj as DoubleRect).getTop !== undefined
            && (obj as DoubleRect).getBottom !== undefined
            && (obj as DoubleRect).translate !== undefined
            && (obj as DoubleRect).scale !== undefined;
    }

    /**
     * Returns a DoubleRect spanning the two given points.
     * @param point1
     * @param point2
     * @return a DoubleRect spanning the two given points
     */
    static make(point1: Point, point2: Point): DoubleRect {
        const left = Math.min(point1.x, point2.x);
        const right = Math.max(point1.x, point2.x);
        const bottom = Math.min(point1.y, point2.y);
        const top_ = Math.max(point1.y, point2.y);
        return new DoubleRect(left, bottom, right, top_);
    }

    /**
     * Returns a DoubleRect centered at the given point with given height and width.
     * @param center center of the DoubleRect
     * @param width width of the DoubleRect
     * @param height height of the DoubleRect
     * @return a DoubleRect centered at the given point with given height and width
     */
    static makeCentered(center: Point, width: number, height: number): DoubleRect {
        const x = center.x;
        const y = center.y;
        return new DoubleRect(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
    }

    /**
     * Returns a DoubleRect centered at the given point with given size.
     * @param center center of the DoubleRect
     * @param size width and height as a Vector
     * @return a DoubleRect centered at the given point with given size
     */
    static makeCentered2(center: Point, size: Point): DoubleRect {
        const x = center.x;
        const y = center.y;
        const w = size.x;
        const h = size.y;
        return new DoubleRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
    }

    /**
     * Returns `true` if the given point is within this rectangle.
     * @param point  the point to test
     * @return `true` if the point is within this rectangle, or exactly on an edge
     */
    contains(point: { x: number; y: number }): boolean {
        return point.x >= this.left_ &&
            point.x <= this.right_ &&
            point.y >= this.bottom_ &&
            point.y <= this.top_;
    }

    /**
     * Returns `true` if the object is a DoubleRect with the same coordinates.
     * @param obj the object to compare to
     * @return `true` if the object is a DoubleRect with the same coordinates.
     */
    equals(obj: unknown): boolean {
        if (obj === this) {
            return true;
        }
        if (obj instanceof DoubleRect) {
            // WARNING:  this is different to Double.equals for NaN and +0.0/-0.0.
            return obj.getLeft() === this.left_ && obj.getRight() === this.right_ &&
                obj.getBottom() === this.bottom_ && obj.getTop() === this.top_;
        }
        else {
            return false;
        }
    }

    /**
     * Returns a copy of this DoubleRect expanded by the given margin in x and y dimension.
     * @param marginX the margin to add at left and right
     * @param marginY the margin to add at top and bottom; if undefined then `marginX` is used for both x and y dimension
     * @return a DoubleRect with same center as this DoubleRect, but expanded or contracted
     */
    expand(marginX: number, marginY: number): DoubleRect {
        marginY = (marginY === undefined) ? marginX : marginY;
        return new DoubleRect(this.getLeft() - marginX, this.getBottom() - marginY,
            this.getRight() + marginX, this.getTop() + marginX);
    }

    /**
     * Returns the smallest vertical coordinate of this DoubleRect
     * @return smallest vertical coordinate  of this DoubleRect
     */
    getBottom(): number {
        return this.bottom_;
    }

    /**
     * Returns the center of this DoubleRect.
     */
    getCenter(): Point {
        return new Point(this.getCenterX(), this.getCenterY());
    }

    /**
     * Returns the horizontal coordinate of center of this DoubleRect.
     * @return horizontal coordinate of center of this DoubleRect
     */
    getCenterX(): number {
        return (this.left_ + this.right_) / 2.0;
    }

    /**
     * Returns the vertical coordinate of center of this DoubleRect.
     * @return vertical coordinate of center of this DoubleRect
     */
    getCenterY(): number {
        return (this.bottom_ + this.top_) / 2.0;
    }

    /**
     * Returns the vertical height of this DoubleRect
     * @return vertical height of this DoubleRect
     */
    getHeight(): number {
        return this.top_ - this.bottom_;
    }

    /**
     * Returns the smallest horizontal coordinate of this DoubleRect
     * @return smallest horizontal coordinate of this DoubleRect
     */
    getLeft(): number {
        return this.left_;
    }

    /**
     * Returns the largest horizontal coordinate of this DoubleRect
     * @return largest horizontal coordinate of this DoubleRect
     */
    getRight(): number {
        return this.right_;
    }

    /**
     * Returns the largest vertical coordinate of this DoubleRect
     * @return largest vertical coordinate of this DoubleRect
     */
    getTop(): number {
        return this.top_;
    }

    /**
     * Returns the horizontal width of this DoubleRect
     * @return horizontal width of this DoubleRect
     */
    getWidth(): number {
        return this.right_ - this.left_;
    }

    /**
     * Returns `true` if width or height of this DoubleRect are zero (within given tolerance).
     * @param tolerance optional tolerance for the test; a width or height smaller than this is regarded as zero; default is 1E-16
     * @return `true` if width or height of this DoubleRect are zero (within given tolerance)
     */
    isEmpty(tolerance = 1E-16) {
        return this.getWidth() < tolerance || this.getHeight() < tolerance;
    }

    /**
     * Returns true if the line between the two points might be visible in the rectangle.
     * @param p1 first end point of line
     * @param p2 second end point of line
     * @return true if the line between the two points might be visible in the rectangle
     */
    maybeVisible(p1: { x: number; y: number }, p2: { x: number; y: number }): boolean {
        // if either point is inside the rect, then line is visible
        if (this.contains(p1) || this.contains(p2)) {
            return true;
        }
        // if both points are "outside" one of the rectangle sides, then line is not visible
        const p1x = p1.x;
        const p1y = p1.y;
        const p2x = p2.x;
        const p2y = p2.y;
        let d = this.left_;
        if (p1x < d && p2x < d) {
            return false;
        }
        d = this.right_;
        if (p1x > d && p2x > d) {
            return false;
        }
        d = this.bottom_;
        if (p1y < d && p2y < d) {
            return false;
        }
        d = this.top_;
        if (p1y > d && p2y > d) {
            return false;
        }
        // we could check for intersection of the line with the rectangle here.
        return true;
    }

    /**
     * Returns `true` if this DoubleRect is nearly equal to another DoubleRect.
     * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
     * used depends on the magnitude of the numbers being compared.
     * @param rect  the DoubleRect to compare with
     * @param opt_tolerance optional tolerance for equality test
     * @return `true` if this DoubleRect is nearly equal to another DoubleRect
     */
    nearEqual(rect: DoubleRect, opt_tolerance?: number): boolean {
        if (veryDifferent(this.left_, rect.getLeft(), opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.bottom_, rect.getBottom(), opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.right_, rect.getRight(), opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.top_, rect.getTop(), opt_tolerance)) {
            return false;
        }
        return true;
    }

    /**
     * Returns a copy of this DoubleRect expanded by the given factors in both x and y
     * dimension. Expands (or contracts) about the center of this DoubleRect by the given
     * expansion factor in x and y dimensions.
     * @param factorX the factor to expand width by; 1.1 gives a 10 percent expansion; 0.9 gives a 10 percent contraction
     * @param factorY  factor to expand height by; if undefined then `factorX` is used for both x and y dimension
     * @return a DoubleRect with same center as this DoubleRect, but expanded or contracted
     */
    scale(factorX: number, factorY: number): DoubleRect {
        factorY = (factorY === undefined) ? factorX : factorY;
        const x0 = this.getCenterX();
        const y0 = this.getCenterY();
        const w = this.getWidth();
        const h = this.getHeight();
        return new DoubleRect(x0 - (factorX * w) / 2, y0 - (factorY * h) / 2,
            x0 + (factorX * w) / 2, y0 + (factorY * h) / 2);
    }

    /**
     * Returns a copy of this rectangle translated by the given amount.
     * @param x horizontal amount to translate by.
     * @param y vertical amount to translate by.
     * @return a copy of this rectangle translated by the given amount
     */
    translate(x: number, y: number): DoubleRect {
        return new DoubleRect(this.left_ + x, this.bottom_ + y, this.right_ + x, this.top_ + y);
    }

    /**
     * Returns a rectangle that is the union of this and another rectangle.
     * @param rect the other rectangle to form the union with.
     * @return the union of this and the other rectangle
     */
    union(rect: DoubleRect): DoubleRect {
        return new DoubleRect(
            Math.min(this.left_, rect.getLeft()),
            Math.min(this.bottom_, rect.getBottom()),
            Math.max(this.right_, rect.getRight()),
            Math.max(this.top_, rect.getTop())
        );
    }

    /**
     * Returns a rectangle that is the union of this rectangle and a point
     * @param point the point to form the union with
     * @return the union of this rectangle and the point
     */
    unionPoint(point: Point): DoubleRect {
        return new DoubleRect(
            Math.min(this.left_, point.x),
            Math.min(this.bottom_, point.y),
            Math.max(this.right_, point.x),
            Math.max(this.top_, point.y)
        );
    }
}
