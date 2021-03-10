import Observer from '../util/Observer';

/**
 * 
 */
export interface GraphVarsList {
    /**
     * Adds the given Observer to the Subject's list of Observers, so that the
     * Observer will be notified of changes in this Subject. Does nothing if the Observer
     * is already on the list. An Observer may call `Subject.addObserver` during its
     * `observe` method.
     * @param observer the Observer to add to list of Observers
     */
    addObserver(observer: Observer): void;

    /**
     * 
     */
    getName(index: number): string;

    /**
     * 
     */
    getValue(index: number): number;

    /**
     * 
     */
    getSequence(index: number): number;

    /**
     * 
     */
    numVariables(): number;

    /**
     * Removes the Observer from the Subject's list of Observers. An Observer may
     * call `Subject.removeObserver` during its `observe` method.
     * @param observer the Observer to detach from list of Observers
     */
    removeObserver(observer: Observer): void;

    /**
     * 
     */
    timeIndex(): number;
}

export default GraphVarsList;
