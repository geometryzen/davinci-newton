"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var isFunction_1 = require("../checks/isFunction");
var veryDifferent_1 = require("../util/veryDifferent");
/**
 * An immutable rectangle corresponding to screen coordinates where the
 * vertical coordinates increase downwards.
 */
var ScreenRect = /** @class */ (function () {
    /**
     *
     */
    function ScreenRect(left, top_, width, height) {
        if (width < 0 || height < 0) {
            throw new Error();
        }
        this.left_ = left;
        this.top_ = top_;
        this.width_ = width;
        this.height_ = height;
    }
    /**
     * Returns a copy of the given ScreenRect.
     * @param rect the ScreenRect to clone
     * @return a copy of `rect`
     */
    ScreenRect.clone = function (rect) {
        return new ScreenRect(rect.left_, rect.top_, rect.width_, rect.height_);
    };
    /**
     * Returns true if this ScreenRect is exactly equal to the other ScreenRect.
     * @param otherRect the ScreenRect to compare to
     * @return true if this ScreenRect is exactly equal to the other ScreenRect
     */
    ScreenRect.prototype.equals = function (otherRect) {
        return this.left_ === otherRect.left_ &&
            this.top_ === otherRect.top_ &&
            this.width_ === otherRect.width_ &&
            this.height_ === otherRect.height_;
    };
    /**
     * Returns true if the object is likely a ScreenRect. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a ScreenRect
     */
    ScreenRect.isDuckType = function (obj) {
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
    };
    /**
     * The horizontal coordinate of this ScreenRect center.
     * @return the horizontal coordinate of this ScreenRect center
     */
    ScreenRect.prototype.getCenterX = function () {
        return this.left_ + this.width_ / 2;
    };
    /**
     * The vertical coordinate of this ScreenRect center
     * @return the vertical coordinate of this ScreenRect center
     */
    ScreenRect.prototype.getCenterY = function () {
        return this.top_ + this.height_ / 2;
    };
    /**
     * The height of this ScreenRect.
     * @return the height of this ScreenRect.
     */
    ScreenRect.prototype.getHeight = function () {
        return this.height_;
    };
    /**
     * The left coordinate of this ScreenRect.
     * @return the left coordinate of this ScreenRect.
     */
    ScreenRect.prototype.getLeft = function () {
        return this.left_;
    };
    /**
     * The top coordinate of this ScreenRect.
     * @return the top coordinate of this ScreenRect
     */
    ScreenRect.prototype.getTop = function () {
        return this.top_;
    };
    /**
     * The width of this ScreenRect.
     * @return the width of this ScreenRect.
     */
    ScreenRect.prototype.getWidth = function () {
        return this.width_;
    };
    /**
     * Returns true if this ScreenRect has zero width or height, within the tolerance
     * @param tolerance tolerance for comparison, default is 1E-14;
     */
    ScreenRect.prototype.isEmpty = function (tolerance) {
        if (tolerance === void 0) { tolerance = 1E-14; }
        return this.width_ < tolerance || this.height_ < tolerance;
    };
    /**
     * Creates an oval path in the Canvas context, with the size of this ScreenRect.
     * @param context the Canvas context to draw into
     */
    ScreenRect.prototype.makeOval = function (context) {
        var w = this.width_ / 2;
        var h = this.height_ / 2;
        if (isFunction_1.default(context.ellipse)) {
            context.beginPath();
            context.moveTo(this.left_ + this.width_, this.top_ + h);
            // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
            context.ellipse(this.left_ + w, this.top_ + h, w, h, 0, 0, 2 * Math.PI, false);
        }
        else {
            // If ellipse() is not defined, draw a circle instead
            var min = Math.min(w, h);
            context.beginPath();
            context.moveTo(this.left_ + this.width_, this.top_);
            // arc(x, y, radius, startAngle, endAngle, anticlockwise);
            context.arc(this.left_ + w, this.top_ + h, min, 0, 2 * Math.PI, false);
            context.closePath();
        }
    };
    /**
     * Creates a rectangle path in the Canvas context, with the size of this ScreenRect.
     * @param context the Canvas context to draw into
     */
    ScreenRect.prototype.makeRect = function (context) {
        context.rect(this.left_, this.top_, this.width_, this.height_);
    };
    /**
     * Returns true if this ScreenRect is nearly equal to another ScreenRect.
     * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
     * used depends on the magnitude of the numbers being compared.
     * @param otherRect  the ScreenRect to compare to
     * @param opt_tolerance optional tolerance for comparison
     * @return true if this ScreenRect is nearly equal to the other ScreenRect
     */
    ScreenRect.prototype.nearEqual = function (otherRect, opt_tolerance) {
        if (veryDifferent_1.default(this.left_, otherRect.left_, opt_tolerance)) {
            return false;
        }
        if (veryDifferent_1.default(this.top_, otherRect.top_, opt_tolerance)) {
            return false;
        }
        if (veryDifferent_1.default(this.width_, otherRect.width_, opt_tolerance)) {
            return false;
        }
        if (veryDifferent_1.default(this.height_, otherRect.height_, opt_tolerance)) {
            return false;
        }
        return true;
    };
    /**
     * An empty ScreenRect located at the origin.
     */
    ScreenRect.EMPTY_RECT = new ScreenRect(0, 0, 0, 0);
    return ScreenRect;
}());
exports.default = ScreenRect;