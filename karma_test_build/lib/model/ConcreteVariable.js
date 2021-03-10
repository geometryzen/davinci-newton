"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteVariable = void 0;
var toName_1 = require("../util/toName");
var validName_1 = require("../util/validName");
/**
 *
 */
var ConcreteVariable = /** @class */ (function () {
    /**
     *
     */
    function ConcreteVariable(varsList_, name) {
        this.varsList_ = varsList_;
        /**
         *
         */
        this.value_ = 0;
        /**
         * Sequence numbers, to detect discontinuity in a variable.
         */
        this.seq_ = 0;
        /**
         *
         */
        this.isComputed_ = false;
        /**
         *
         */
        this.doesBroadcast_ = false;
        this.name_ = validName_1.default(toName_1.default(name));
    }
    ConcreteVariable.prototype.getBroadcast = function () {
        return this.doesBroadcast_;
    };
    Object.defineProperty(ConcreteVariable.prototype, "name", {
        /**
         *
         */
        get: function () {
            return this.name_;
        },
        enumerable: false,
        configurable: true
    });
    ConcreteVariable.prototype.getSequence = function () {
        return this.seq_;
    };
    /**
     *
     */
    ConcreteVariable.prototype.getSubject = function () {
        return this.varsList_;
    };
    /**
     *
     */
    ConcreteVariable.prototype.getValue = function () {
        return this.value_;
    };
    ConcreteVariable.prototype.nameEquals = function (name) {
        return this.name_ === toName_1.default(name);
    };
    ConcreteVariable.prototype.setBroadcast = function (value) {
        this.doesBroadcast_ = value;
    };
    ConcreteVariable.prototype.setComputed = function (value) {
        this.isComputed_ = value;
    };
    Object.defineProperty(ConcreteVariable.prototype, "isComputed", {
        get: function () {
            return this.isComputed_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    ConcreteVariable.prototype.setValue = function (value) {
        if (this.value_ !== value) {
            this.value_ = value;
            this.seq_++;
            if (this.doesBroadcast_) {
                this.varsList_.broadcast(this);
            }
        }
    };
    ConcreteVariable.prototype.setValueSmooth = function (value) {
        this.value_ = value;
    };
    /**
     *
     */
    ConcreteVariable.prototype.incrSequence = function () {
        this.seq_++;
    };
    return ConcreteVariable;
}());
exports.ConcreteVariable = ConcreteVariable;
