import Parameter from '../util/Parameter';
/**
 * Represents a variable with a numeric value; usually stored in a VarsList.
 */
export interface Variable extends Parameter {
    /**
     * Returns whether the Variable is broadcast when it changes discontinuously.
     * @return whether the Variable is broadcast when it changes discontinuously
     */
    getBroadcast(): boolean;
    /**
     * Returns the sequence number of this Variable. The sequence number is incremented
     * whenever a discontinuity occurs in the value of the variable. For example, when the
     * variables are set back to initial conditions that is a discontinuous change. Then a
     * graph knows to not draw a connecting line between the points with the discontinuity.
     *
     * Another example of a discontinuity: if the value of an angle is kept within `0` to
     * `2*Pi` (by just adding or subtracting `2*pi` to keep it in that range), when the angle
     * crosses that boundary the sequence number should be incremented to indicate a
     * discontinuity occurred.
     * @return {number} the sequence number of this Variable.
     */
    getSequence(): number;
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
     * Sets whether the Variable is broadcast when it changes discontinuously
     * @param {boolean} value whether the Variable is broadcast when it changes discontinuously
     */
    setBroadcast(broadcast: boolean): void;
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
