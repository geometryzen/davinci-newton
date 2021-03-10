import Parameter from './Parameter';
import Subject from './Subject';
export declare class ParameterString implements Parameter {
    private subject_;
    private name_;
    private getter_;
    /**
     * suggested length of string for making a control
     */
    /**
     * maximum length of string
     */
    constructor(subject: Subject, name: string, getter: () => string, setter: (value: string) => any, choices?: string[], values?: string[]);
    get name(): string;
    getSubject(): Subject;
    getValue(): string;
    nameEquals(name: string): boolean;
    setComputed(value: boolean): void;
}
export default ParameterString;
