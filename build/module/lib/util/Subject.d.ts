import Observer from './Observer';
import Parameter from './Parameter';
import ParameterBoolean from './ParameterBoolean';
import ParameterNumber from './ParameterNumber';
import ParameterString from './ParameterString';
import SubjectEvent from './SubjectEvent';
export interface Subject {
    /**
     * Adds the given Observer to the Subject's list of Observers, so that the
     * Observer will be notified of changes in this Subject. Does nothing if the Observer
     * is already on the list. An Observer may call `Subject.addObserver` during its
     * `observe` method.
     * @param observer the Observer to add to list of Observers
     */
    addObserver(observer: Observer): void;
    /**
     * Notifies all Observers that the Subject has changed by calling `observe` on each Observer.
     * An Observer may call `Subject.addObserver` or `Subject.removeObserver` during its `observe` method.
     * @param event a SubjectEvent with information relating to the change.
     */
    broadcast(event: SubjectEvent): void;
    /**
     * Notifies all Observers that the Parameter with the given `name` has changed by
     * calling {@link myphysicslab.lab.util.Observer#observe} on each Observer.
     * @param name the universal or English name of the Parameter that has changed
     * @throws if there is no Parameter with the given name
     */
    broadcastParameter(name: string): void;
    /**
     * Returns a copy of the list of Observers of this Subject.
     * @return a copy of the list of Observers of this Subject.
     */
    getObservers(): Observer[];
    /**
     * Returns the Parameter with the given name.
     * @param name the language-independent or English name of the Parameter
     * @return the Parameter with the given name
     * @throws {Error} if there is no Parameter with the given name
     */
    getParameter(name: string): Parameter;
    /**
     * Returns a copy of the list of this Subject's available Parameters.
     * @return a copy of the list of available Parameters for this Subject
     */
    getParameters(): Parameter[];
    /**
     * Returns the ParameterBoolean with the given name.
     * @param name the universal or English name of the ParameterBoolean
     * @return the ParameterBoolean with the given name
     * @throws if there is no ParameterBoolean with the given name
     */
    getParameterBoolean(name: string): ParameterBoolean;
    /**
     * Returns the ParameterNumber with the given name.
     * @param name the universal or English name of the ParameterNumber
     * @return the ParameterNumber with the given name
     * @throws if there is no ParameterNumber with the given name
     */
    getParameterNumber(name: string): ParameterNumber;
    /**
     * Returns the ParameterString with the given name.
     * @param name the universal or English name of the ParameterString
     * @return the ParameterString with the given name
     * @throws if there is no ParameterString with the given name
     */
    getParameterString(name: string): ParameterString;
    /**
     * Removes the Observer from the Subject's list of Observers. An Observer may
     * call `Subject.removeObserver` during its `observe` method.
     * @param observer the Observer to detach from list of Observers
     */
    removeObserver(observer: Observer): void;
}
export default Subject;
