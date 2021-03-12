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
import toName from './toName';
import validName from './validName';
/**
 * @hidden
 */
var GenericEvent = /** @class */ (function () {
    /**
     *
     */
    function GenericEvent(subject_, name, _value) {
        this.subject_ = subject_;
        this.name_ = validName(toName(name));
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
        return this.name_ === toName(name);
    };
    return GenericEvent;
}());
export { GenericEvent };
