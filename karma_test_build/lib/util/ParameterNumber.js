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
exports.ParameterNumber = void 0;
var toName_1 = require("./toName");
var validName_1 = require("./validName");
var ParameterNumber = /** @class */ (function () {
    // private choices_: string[];
    // private values_: number[];
    function ParameterNumber(subject, name, getter, setter, choices, values) {
        this.subject_ = subject;
        this.name_ = validName_1.default(toName_1.default(name));
        this.getter_ = getter;
        // this.setter_ = setter;
        // this.isComputed_ = false;
        // this.signifDigits_ = 3;
        // this.decimalPlaces_ = -1;
        // this.lowerLimit_ = 0;
        // this.upperLimit_ = Number.POSITIVE_INFINITY;
        // this.choices_ = [];
        // this.values_ = [];
    }
    Object.defineProperty(ParameterNumber.prototype, "name", {
        get: function () {
            return this.name_;
        },
        enumerable: false,
        configurable: true
    });
    ParameterNumber.prototype.getSubject = function () {
        return this.subject_;
    };
    ParameterNumber.prototype.getValue = function () {
        return this.getter_();
    };
    ParameterNumber.prototype.nameEquals = function (name) {
        return this.name_ === toName_1.default(name);
    };
    ParameterNumber.prototype.setComputed = function (value) {
        // this.isComputed_ = value;
    };
    /**
     * Sets the lower limit; the Parameter value is not allowed to be less than this,
     * {@link #setValue} will throw an Error in that case.
     * @param lowerLimit the lower limit of the Parameter value
     * @return this Parameter for chaining setters
     * @throws {Error} if the value is currently less than the lower limit, or the lower limit is not a number
     */
    ParameterNumber.prototype.setLowerLimit = function (lowerLimit) {
        if (lowerLimit > this.getValue() || lowerLimit > this.upperLimit_)
            throw new Error('out of range');
        // this.lowerLimit_ = lowerLimit;
        return this;
    };
    /**
     * Sets suggested number of significant digits to show. This affects the number of
     * decimal places that are displayed. Examples: if significant digits is 3, then we would
     * show numbers as: 12345, 1234, 123, 12.3, 1.23, 0.123, 0.0123, 0.00123.
     * @param signifDigits suggested number of significant digits to show
     * @return this Parameter for chaining setters
     */
    ParameterNumber.prototype.setSignifDigits = function (signifDigits) {
        // this.signifDigits_ = signifDigits;
        return this;
    };
    return ParameterNumber;
}());
exports.ParameterNumber = ParameterNumber;
exports.default = ParameterNumber;
