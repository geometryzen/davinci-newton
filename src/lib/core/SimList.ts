import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { AbstractSubject } from '../util/AbstractSubject';
import { contains } from '../util/contains';
import { GenericEvent } from '../util/GenericEvent';
import remove from '../util/remove';
import { SimObject } from './SimObject';

/**
 * @hidden
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
        super();
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
        if (remove(this.elements_, simObject)) {
            this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simObject));
        }
    }

    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
     * @param time the current simulation time
     */
    removeTemporary(time: number): void {
        for (let i = this.elements_.length - 1; i >= 0; i--) {
            const simobj = this.elements_[i];
            if (simobj.expireTime < time) {
                this.elements_.splice(i, 1);
                this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simobj));
            }
        }
    }
}
