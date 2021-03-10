"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeDefined_1 = require("../checks/mustBeDefined");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var Unit_1 = require("./Unit");
function checkElementsLength(elements, length) {
    if (elements.length !== length) {
        throw new Error("elements must have length " + length);
    }
}
/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 */
var AbstractMatrix = /** @class */ (function () {
    /**
     * @param elements
     * @param dimensions
     */
    function AbstractMatrix(elements, dimensions, uom) {
        this._elements = mustBeDefined_1.default('elements', elements);
        this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
        this._length = dimensions * dimensions;
        checkElementsLength(elements, this._length);
        this.modified = false;
        this.uom = Unit_1.Unit.mustBeUnit('uom', uom);
    }
    Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
        get: function () {
            return this._dimensions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMatrix.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        set: function (elements) {
            checkElementsLength(elements, this._length);
            this._elements = elements;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMatrix.prototype.copy = function (source) {
        var N = this.dimensions;
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                var value = source.getElement(i, j);
                this.setElement(i, j, value);
            }
        }
        this.uom = source.uom;
        return this;
    };
    /**
     * Returns the element at the specified (zero-based) row and column.
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    AbstractMatrix.prototype.getElement = function (row, column) {
        return this.elements[row + column * this._dimensions];
    };
    /**
     * Determines whether this matrix is the identity matrix.
     */
    AbstractMatrix.prototype.isOne = function () {
        for (var i = 0; i < this._dimensions; i++) {
            for (var j = 0; j < this._dimensions; j++) {
                var value = this.getElement(i, j);
                if (i === j) {
                    if (value !== 1) {
                        return false;
                    }
                }
                else {
                    if (value !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    AbstractMatrix.prototype.setElement = function (row, column, value) {
        this.elements[row + column * this._dimensions] = value;
    };
    return AbstractMatrix;
}());
exports.default = AbstractMatrix;
