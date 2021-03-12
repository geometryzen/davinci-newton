import { Parameter } from './Parameter';
import { Subject } from './Subject';
/**
 * @hidden
 */
export declare class ParameterBoolean implements Parameter {
    private subject_;
    private name_;
    constructor(subject: Subject, name: string, getter: () => boolean, setter: (value: boolean) => any, choices?: string[], values?: boolean[]);
    get name(): string;
    getSubject(): Subject;
    nameEquals(name: string): boolean;
    setComputed(value: boolean): void;
}
