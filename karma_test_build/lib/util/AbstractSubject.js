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
exports.AbstractSubject = void 0;
var clone_1 = require("./clone");
var contains_1 = require("./contains");
var find_1 = require("./find");
var ParameterBoolean_1 = require("./ParameterBoolean");
var ParameterNumber_1 = require("./ParameterNumber");
var ParameterString_1 = require("./ParameterString");
var remove_1 = require("./remove");
var toName_1 = require("../util/toName");
/**
 *
 */
var AbstractSubject = /** @class */ (function () {
    function AbstractSubject() {
        /**
         *
         */
        this.doBroadcast_ = true;
        /**
         *
         */
        this.observers_ = [];
        /**
         *
         */
        this.paramList_ = [];
    }
    AbstractSubject.prototype.addObserver = function (observer) {
        if (!contains_1.default(this.observers_, observer)) {
            this.observers_.push(observer);
        }
    };
    AbstractSubject.prototype.removeObserver = function (observer) {
        remove_1.default(this.observers_, observer);
    };
    /**
     * Adds the Parameter to the list of this Subject's available Parameters.
     * @param parameter the Parameter to add
     */
    AbstractSubject.prototype.addParameter = function (parameter) {
        var name = parameter.name;
        var p = this.getParam(name);
        if (p != null) {
            throw new Error('parameter ' + name + ' already exists: ' + p);
        }
        this.paramList_.push(parameter);
    };
    /**
     * Returns the Parameter with the given name, or null if not found
     * @param name name of parameter to search for
     * @return the Parameter with the given name, or null if not found
     */
    AbstractSubject.prototype.getParam = function (name) {
        name = toName_1.default(name);
        return find_1.default(this.paramList_, function (p) {
            return p.name === name;
        });
    };
    AbstractSubject.prototype.getParameter = function (name) {
        var p = this.getParam(name);
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    };
    AbstractSubject.prototype.getParameterBoolean = function (name) {
        var p = this.getParam(name);
        if (p instanceof ParameterBoolean_1.default) {
            return p;
        }
        throw new Error('ParameterBoolean not found ' + name);
    };
    AbstractSubject.prototype.getParameterNumber = function (name) {
        var p = this.getParam(name);
        if (p instanceof ParameterNumber_1.default) {
            return p;
        }
        throw new Error('ParameterNumber not found ' + name);
    };
    AbstractSubject.prototype.getParameterString = function (name) {
        var p = this.getParam(name);
        if (p instanceof ParameterString_1.default) {
            return p;
        }
        throw new Error('ParameterString not found ' + name);
    };
    AbstractSubject.prototype.getParameters = function () {
        return clone_1.default(this.paramList_);
    };
    /**
     *
     */
    AbstractSubject.prototype.broadcast = function (event) {
        if (this.doBroadcast_) {
            var len = this.observers_.length;
            for (var i = 0; i < len; i++) {
                this.observers_[i].observe(event);
            }
        }
    };
    AbstractSubject.prototype.broadcastParameter = function (name) {
        var p = this.getParam(name);
        if (p === null) {
            throw new Error('unknown Parameter ' + name);
        }
        this.broadcast(p);
    };
    /**
     * Returns whether this Subject is broadcasting events.
     * @return {boolean} whether this Subject is broadcasting events
     */
    AbstractSubject.prototype.getBroadcast = function () {
        return this.doBroadcast_;
    };
    /**
     *
     */
    AbstractSubject.prototype.getObservers = function () {
        return clone_1.default(this.observers_);
    };
    return AbstractSubject;
}());
exports.AbstractSubject = AbstractSubject;
exports.default = AbstractSubject;
