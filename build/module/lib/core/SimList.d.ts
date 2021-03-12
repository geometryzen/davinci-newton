import { AbstractSubject } from '../util/AbstractSubject';
import { SimObject } from './SimObject';
/**
 * @hidden
 */
export declare class SimList extends AbstractSubject {
    /**
     *
     */
    static OBJECT_ADDED: string;
    /**
     *
     */
    static OBJECT_REMOVED: string;
    /**
     *
     */
    private elements_;
    /**
     *
     */
    constructor();
    /**
     *
     */
    add(simObject: SimObject): void;
    /**
     *
     */
    forEach(callBack: (simObject: SimObject, index: number) => any): void;
    /**
     *
     */
    remove(simObject: SimObject): void;
    /**
     * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
     * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
     * @param time the current simulation time
     */
    removeTemporary(time: number): void;
}
