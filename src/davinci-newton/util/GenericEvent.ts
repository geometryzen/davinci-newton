import Subject from './Subject';
import SubjectEvent from './SubjectEvent';
import toName from './toName';
import validName from './validName';

/**
 * 
 */
export class GenericEvent implements SubjectEvent {
    /**
     * 
     */
    private name_: string;
    /**
     * 
     */
    constructor(private subject_: Subject, name: string, private value_?: any) {
        this.name_ = validName(toName(name));
    }

    /**
     * 
     */
    getName(localized?: boolean): string {
        return this.name_;
    }

    /**
     * 
     */
    getSubject(): Subject {
        return this.subject_;
    }
}

export default GenericEvent;
