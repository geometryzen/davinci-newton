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
/**
 * Observes a Subject; when the Subject broadcasts a SubjectEvent then this executes a specified function.
 * @hidden
 */
var GenericObserver = /** @class */ (function () {
    /**
     * @param subject the Subject to observe
     * @param observeFn  function to execute when a SubjectEvent is broadcast by Subject
     */
    function GenericObserver(subject, observeFn) {
        this.subject_ = subject;
        subject.addObserver(this);
        this.observeFn_ = observeFn;
    }
    /**
     * Disconnects this GenericObserver from the Subject.
     */
    GenericObserver.prototype.disconnect = function () {
        this.subject_.removeObserver(this);
    };
    GenericObserver.prototype.observe = function (event) {
        this.observeFn_(event);
    };
    return GenericObserver;
}());
export { GenericObserver };
