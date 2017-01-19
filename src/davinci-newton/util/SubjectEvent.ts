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
    /**
     * 
     */
    nameEquals(name: string): boolean;
}

export default SubjectEvent;
