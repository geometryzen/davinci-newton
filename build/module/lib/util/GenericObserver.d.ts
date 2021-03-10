import Observer from './Observer';
import Subject from './Subject';
import SubjectEvent from './SubjectEvent';
/**
 * Observes a Subject; when the Subject broadcasts a SubjectEvent then this executes a specified function.
 */
export declare class GenericObserver implements Observer {
    private subject_;
    private observeFn_;
    /**
     * @param subject the Subject to observe
     * @param observeFn  function to execute when a SubjectEvent is broadcast by Subject
     */
    constructor(subject: Subject, observeFn: (event: SubjectEvent) => any);
    /**
     * Disconnects this GenericObserver from the Subject.
     */
    disconnect(): void;
    observe(event: SubjectEvent): void;
}
export default GenericObserver;
