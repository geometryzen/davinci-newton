import { Observer } from './Observer';
import { Parameter } from './Parameter';
import { ParameterBoolean } from './ParameterBoolean';
import { ParameterNumber } from './ParameterNumber';
import { ParameterString } from './ParameterString';
import { Subject } from './Subject';
import { SubjectEvent } from './SubjectEvent';
/**
 * @hidden
 */
export declare class AbstractSubject implements Subject {
    /**
     *
     */
    private doBroadcast_;
    /**
     *
     */
    private observers_;
    /**
     *
     */
    private paramList_;
    /**
     * @hidden
     * @param observer
     */
    addObserver(observer: Observer): void;
    /**
     * @hidden
     * @param observer
     */
    removeObserver(observer: Observer): void;
    /**
     * Adds the Parameter to the list of this Subject's available Parameters.
     * @param parameter the Parameter to add
     * @hidden
     */
    addParameter(parameter: Parameter): void;
    /**
     * Returns the Parameter with the given name, or null if not found
     * @param name name of parameter to search for
     * @return the Parameter with the given name, or null if not found
     */
    private getParam;
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    getParameter(name: string): Parameter;
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    getParameterBoolean(name: string): ParameterBoolean;
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    getParameterNumber(name: string): ParameterNumber;
    /**
     *
     * @param name
     * @returns
     * @hidden
     */
    getParameterString(name: string): ParameterString;
    /**
     *
     * @returns
     * @hidden
     */
    getParameters(): Parameter[];
    /**
     *
     * @param event
     * @hidden
     */
    broadcast(event: SubjectEvent): void;
    /**
     *
     * @param name
     * @hidden
     */
    broadcastParameter(name: string): void;
    /**
     * Returns whether this Subject is broadcasting events.
     * @return {boolean} whether this Subject is broadcasting events
     * @hidden
     */
    protected getBroadcast(): boolean;
    /**
     * @hidden
     */
    getObservers(): Observer[];
}
