"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Immutable point coordinates in two dimensions.
 */
var Point = /** @class */ (function () {
    function Point(x_, y_) {
        this.x_ = x_;
        this.y_ = y_;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this.x_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this.y_;
        },
        enumerable: false,
        configurable: true
    });
    return Point;
}());
exports.default = Point;
