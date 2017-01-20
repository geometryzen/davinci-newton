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

import AbstractSubject from '../util/AbstractSubject';
import contains from '../util/contains';
import GenericEvent from '../util/GenericEvent';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import SimObject from './SimObject';

/**
 * 
 */
export class SimList extends AbstractSubject {

    /**
     * 
     */
    static OBJECT_ADDED = 'OBJECT_ADDED';

    /**
     * 
     */
    static OBJECT_REMOVED = 'OBJECT_REMOVED';

    /**
     * 
     */
    private elements_: SimObject[] = [];

    /**
     * 
     */
    constructor() {
        super('SIM_LIST');
    }

    /**
     * 
     */
    add(simObject: SimObject): void {
        for (let i = 0; i < arguments.length; i++) {
            const element = <SimObject>arguments[i];
            mustBeNonNullObject('element', element);
            if (!contains(this.elements_, element)) {
                this.elements_.push(element);
                this.broadcast(new GenericEvent(this, SimList.OBJECT_ADDED, element));
            }
        }
    }

    /**
     * 
     */
    forEach(callBack: (simObject: SimObject, index: number) => any): void {
        return this.elements_.forEach(callBack);
    }

    /**
     * 
     */
    remove(simObject: SimObject): void {
        throw new Error("TODO");
    }

    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
     * @param time the current simulation time
     */
    removeTemporary(time: number): void {
        for (let i = this.elements_.length - 1; i >= 0; i--) {
            const simobj = this.elements_[i];
            if (simobj.getExpireTime() < time) {
                this.elements_.splice(i, 1);
                this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simobj));
            }
        }
    }
}

export default SimList;
