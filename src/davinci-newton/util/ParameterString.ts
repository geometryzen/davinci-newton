import Parameter from './Parameter';
import Subject from './Subject';
import toName from './toName';
import validName from './validName';

export class ParameterString implements Parameter {
    private subject_: Subject;
    private name_: string;
    private getter_: () => string;
    private setter_: (value: string) => any;
    private isComputed_: boolean;
    /**
     * suggested length of string for making a control
     */
    private suggestedLength_: number;
    /**
     * maximum length of string
     */
    private maxLength_: number;
    private choices_: string[];
    private values_: string[];
    private inputFunction_: (value: string) => string;
    constructor(subject: Subject, name: string, getter: () => string, setter: (value: string) => any, choices?: string[], values?: string[]) {
        this.subject_ = subject;
        this.name_ = validName(toName(name));
        this.getter_ = getter;
        this.setter_ = setter;
        this.isComputed_ = false;
        this.suggestedLength_ = 20;
        this.maxLength_ = Number.POSITIVE_INFINITY;
        this.choices_ = [];
        this.values_ = [];
        this.inputFunction_ = null;
    }

    getName(): string {
        return this.name_;
    }

    getSubject(): Subject {
        return this.subject_;
    }

    getValue(): string {
        return this.getter_();
    }

    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }

    setComputed(value: boolean): void {
        this.isComputed_ = value;
    }
}

export default ParameterString;
