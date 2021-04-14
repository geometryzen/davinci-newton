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
import { toName } from '../util/toName';
import clone from './clone';
import { contains } from './contains';
import find from './find';
import { ParameterBoolean } from './ParameterBoolean';
import { ParameterNumber } from './ParameterNumber';
import { ParameterString } from './ParameterString';
import { remove } from './remove';
/**
 * @hidden
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
    /**
     * @hidden
     * @param observer
     */
    AbstractSubject.prototype.addObserver = function (observer) {
        if (!contains(this.observers_, observer)) {
            this.observers_.push(observer);
        }
    };
    /**
     * @hidden
     * @param observer
     */
    AbstractSubject.prototype.removeObserver = function (observer) {
        remove(this.observers_, observer);
    };
    /**
     * Adds the Parameter to the list of this Subject's available Parameters.
     * @param parameter the Parameter to add
     * @hidden
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
        name = toName(name);
        return find(this.paramList_, function (p) {
            return p.name === name;
        });
    };
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    AbstractSubject.prototype.getParameter = function (name) {
        var p = this.getParam(name);
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    };
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    AbstractSubject.prototype.getParameterBoolean = function (name) {
        var p = this.getParam(name);
        if (p instanceof ParameterBoolean) {
            return p;
        }
        throw new Error('ParameterBoolean not found ' + name);
    };
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    AbstractSubject.prototype.getParameterNumber = function (name) {
        var p = this.getParam(name);
        if (p instanceof ParameterNumber) {
            return p;
        }
        throw new Error('ParameterNumber not found ' + name);
    };
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    AbstractSubject.prototype.getParameterString = function (name) {
        var p = this.getParam(name);
        if (p instanceof ParameterString) {
            return p;
        }
        throw new Error('ParameterString not found ' + name);
    };
    /**
     *
     * @returns
     * @hidden
     */
    AbstractSubject.prototype.getParameters = function () {
        return clone(this.paramList_);
    };
    /**
     *
     * @param event
     * @hidden
     */
    AbstractSubject.prototype.broadcast = function (event) {
        if (this.doBroadcast_) {
            var len = this.observers_.length;
            for (var i = 0; i < len; i++) {
                this.observers_[i].observe(event);
            }
        }
    };
    /**
     *
     * @param name
     * @hidden
     */
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
     * @hidden
     */
    AbstractSubject.prototype.getBroadcast = function () {
        return this.doBroadcast_;
    };
    /**
     * @hidden
     */
    AbstractSubject.prototype.getObservers = function () {
        return clone(this.observers_);
    };
    return AbstractSubject;
}());
export { AbstractSubject };
