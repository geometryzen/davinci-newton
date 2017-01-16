import Parameter from '../util/Parameter';

export interface Variable extends Parameter {
    /**
     * Returns the value of this variable.
     */
    getValue(): number;

    /**
     * Increments the sequence number of this Variable, which indicates that a
     * discontinuity has occurred in the value of this variable.
     *  This information is used in a graph to prevent drawing a line between points that have a discontinuity.
     */
    incrSequence(): void;

    /**
     * Sets the value of this Variable and increases the sequence number.
     */
    setValue(value: number): void;

    /**
     * Sets the value of this Variable without changing the sequence number which means
     * it is a 'smooth' continuous change to the variable.
     */
    setValueSmooth(value: number): void;
}

export default Variable;
