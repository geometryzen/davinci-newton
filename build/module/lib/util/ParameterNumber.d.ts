import { Parameter } from './Parameter';
import { Subject } from './Subject';
/**
 * @hidden
 */
export declare class ParameterNumber implements Parameter {
    /**
     * the Subject which provides notification of changes in this Parameter
     */
    private subject_;
    private name_;
    private getter_;
    /**
     * Fixed number of fractional decimal places to show, or -1 if variable.
     */
    private upperLimit_;
    constructor(subject: Subject, name: string, getter: () => number, setter: (value: number) => any, choices?: string[], values?: number[]);
    get name(): string;
    getSubject(): Subject;
    getValue(): number;
    nameEquals(name: string): boolean;
    setComputed(value: boolean): void;
    /**
     * Sets the lower limit; the Parameter value is not allowed to be less than this,
     * {@link #setValue} will throw an Error in that case.
     * @param lowerLimit the lower limit of the Parameter value
     * @return this Parameter for chaining setters
     * @throws {Error} if the value is currently less than the lower limit, or the lower limit is not a number
     */
    setLowerLimit(lowerLimit: number): this;
    /**
     * Sets suggested number of significant digits to show. This affects the number of
     * decimal places that are displayed. Examples: if significant digits is 3, then we would
     * show numbers as: 12345, 1234, 123, 12.3, 1.23, 0.123, 0.0123, 0.00123.
     * @param signifDigits suggested number of significant digits to show
     * @return this Parameter for chaining setters
     */
    setSignifDigits(signifDigits: number): this;
}
