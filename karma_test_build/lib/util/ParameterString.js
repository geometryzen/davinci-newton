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
exports.ParameterString = void 0;
var toName_1 = require("./toName");
var validName_1 = require("./validName");
var ParameterString = /** @class */ (function () {
    // private setter_: (value: string) => any;
    // private isComputed_: boolean;
    /**
     * suggested length of string for making a control
     */
    // private suggestedLength_: number;
    /**
     * maximum length of string
     */
    // private maxLength_: number;
    // private choices_: string[];
    // private values_: string[];
    // private inputFunction_: (value: string) => string;
    function ParameterString(subject, name, getter, setter, choices, values) {
        this.subject_ = subject;
        this.name_ = validName_1.default(toName_1.default(name));
        this.getter_ = getter;
        // this.setter_ = setter;
        // this.isComputed_ = false;
        // this.suggestedLength_ = 20;
        // this.maxLength_ = Number.POSITIVE_INFINITY;
        // this.choices_ = [];
        // this.values_ = [];
        // this.inputFunction_ = null;
    }
    Object.defineProperty(ParameterString.prototype, "name", {
        get: function () {
            return this.name_;
        },
        enumerable: false,
        configurable: true
    });
    ParameterString.prototype.getSubject = function () {
        return this.subject_;
    };
    ParameterString.prototype.getValue = function () {
        return this.getter_();
    };
    ParameterString.prototype.nameEquals = function (name) {
        return this.name_ === toName_1.default(name);
    };
    ParameterString.prototype.setComputed = function (value) {
        // this.isComputed_ = value;
    };
    return ParameterString;
}());
exports.ParameterString = ParameterString;
exports.default = ParameterString;
