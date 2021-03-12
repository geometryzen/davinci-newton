import { SubjectEvent } from './SubjectEvent';
/**
 * @hidden
 */
export interface Parameter extends SubjectEvent {
    /**
     * Sets whether the value is being automatically computed.
     * @param computed whether the value is being automatically computed.
     */
    setComputed(computed: boolean): void;
}
