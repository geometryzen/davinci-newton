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
exports.GenericEvent = void 0;
var toName_1 = require("./toName");
var validName_1 = require("./validName");
/**
 *
 */
var GenericEvent = /** @class */ (function () {
    /**
     *
     */
    function GenericEvent(subject_, name, _value) {
        this.subject_ = subject_;
        this.name_ = validName_1.default(toName_1.default(name));
    }
    Object.defineProperty(GenericEvent.prototype, "name", {
        /**
         *
         */
        get: function () {
            return this.name_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    GenericEvent.prototype.getSubject = function () {
        return this.subject_;
    };
    /**
     *
     */
    GenericEvent.prototype.nameEquals = function (name) {
        return this.name_ === toName_1.default(name);
    };
    return GenericEvent;
}());
exports.GenericEvent = GenericEvent;
exports.default = GenericEvent;
