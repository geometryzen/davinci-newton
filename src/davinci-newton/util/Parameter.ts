import SubjectEvent from './SubjectEvent';

export interface Parameter extends SubjectEvent {
    /**
     * Sets whether the value is being automatically computed.
     * @param computed whether the value is being automatically computed.
     */
    setComputed(computed: boolean): void;
}

export default Parameter;
