import { Subject } from './Subject';
import { SubjectEvent } from './SubjectEvent';
/**
 * @hidden
 */
export declare class GenericEvent implements SubjectEvent {
    private subject_;
    /**
     *
     */
    private name_;
    /**
     *
     */
    constructor(subject_: Subject, name: string, _value?: any);
    /**
     *
     */
    get name(): string;
    /**
     *
     */
    getSubject(): Subject;
    /**
     *
     */
    nameEquals(name: string): boolean;
}
