import Parameter from './Parameter';
import Subject from './Subject';
import toName from './toName';
import validName from './validName';

export class ParameterBoolean implements Parameter {
    private subject_: Subject;
    private name_: string;
    private getter_: () => boolean;
    private setter_: (value: boolean) => any;
    private isComputed_: boolean;
    private choices_: string[];
    private values_: boolean[];
    constructor(subject: Subject, name: string, getter: () => boolean, setter: (value: boolean) => any, choices?: string[], values?: boolean[]) {
        this.subject_ = subject;
        this.name_ = validName(toName(name));
        this.getter_ = getter;
        this.setter_ = setter;
        this.isComputed_ = false;
        this.choices_ = [];
        this.values_ = [];
    }
    getName(): string {
        return this.name_;
    }
    getSubject(): Subject {
        return this.subject_;
    }
    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }
    setComputed(value: boolean): void {
        this.isComputed_ = value;
    }
}

export default ParameterBoolean;
