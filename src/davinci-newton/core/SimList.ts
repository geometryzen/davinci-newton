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
    private tolerance_ = 0.1;

    /**
     * 
     */
    constructor() {
        super('SIM_LIST');
    }
    add(simObj: SimObject): void {
        for (let i = 0; i < arguments.length; i++) {
            const element = <SimObject>arguments[i];
            mustBeNonNullObject('element', element);
            var expire = element.getExpireTime();
            if (isFinite(expire)) {
                var similar;
                while (similar = this.getSimilar(element)) {
                    this.remove(similar);
                }
            }
            if (!contains(this.elements_, element)) {
                this.elements_.push(element);
                this.broadcast(new GenericEvent(this, SimList.OBJECT_ADDED, element));
            }
        }
    }
    remove(simObj: SimObject): void {
        throw new Error("TODO");
    }
    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the {@link #OBJECT_REMOVED} event for each SimObject removed.
     * See {@link myphysicslab.lab.model.SimObject#getExpireTime}
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

    /**
     * Returns a similar SimObject already in this SimList, or `null` if there isn't one.
     */
    getSimilar(simObj: SimObject, tolerance?: number): SimObject {
        const tol = (tolerance === undefined) ? this.tolerance_ : tolerance;
        const len = this.elements_.length;
        for (let i = 0; i < len; i++) {
            const candidate = this.elements_[i];
            if (candidate.similar(simObj, tol)) {
                return candidate;
            }
        }
        return null;
    }
}

export default SimList;
