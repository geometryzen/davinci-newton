import Subject from './Subject';
export interface SubjectEvent {
    /**
     *
     */
    readonly name: string;
    /**
     * Returns the Subject to which this SubjectEvent refers.
     */
    getSubject(): Subject;
    /**
     *
     */
    nameEquals(name: string): boolean;
}
export default SubjectEvent;
