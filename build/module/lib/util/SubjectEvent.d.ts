import { Subject } from './Subject';
/**
 * @hidden
 */
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
