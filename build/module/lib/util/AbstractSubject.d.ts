import Observer from './Observer';
import Parameter from './Parameter';
import ParameterBoolean from './ParameterBoolean';
import ParameterNumber from './ParameterNumber';
import ParameterString from './ParameterString';
import Subject from './Subject';
import SubjectEvent from './SubjectEvent';
/**
 *
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
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    /**
     * Adds the Parameter to the list of this Subject's available Parameters.
     * @param parameter the Parameter to add
     */
    addParameter(parameter: Parameter): void;
    /**
     * Returns the Parameter with the given name, or null if not found
     * @param name name of parameter to search for
     * @return the Parameter with the given name, or null if not found
     */
    private getParam;
    getParameter(name: string): Parameter;
    getParameterBoolean(name: string): ParameterBoolean;
    getParameterNumber(name: string): ParameterNumber;
    getParameterString(name: string): ParameterString;
    getParameters(): Parameter[];
    /**
     *
     */
    broadcast(event: SubjectEvent): void;
    broadcastParameter(name: string): void;
    /**
     * Returns whether this Subject is broadcasting events.
     * @return {boolean} whether this Subject is broadcasting events
     */
    protected getBroadcast(): boolean;
    /**
     *
     */
    getObservers(): Observer[];
}
export default AbstractSubject;
