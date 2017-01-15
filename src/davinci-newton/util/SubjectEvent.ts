import Subject from './Subject';

export interface SubjectEvent {
    /**
     * Returns the Subject to which this SubjectEvent refers.
     */
    getSubject(): Subject;
    /**
     * 
     */
    getName(): string;
}

export default SubjectEvent;
