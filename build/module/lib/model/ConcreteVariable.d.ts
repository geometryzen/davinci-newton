import { VarsList } from '../core/VarsList';
import Variable from './Variable';
/**
 *
 */
export declare class ConcreteVariable implements Variable {
    private varsList_;
    /**
     *
     */
    private value_;
    /**
     *
     */
    private name_;
    /**
     * Sequence numbers, to detect discontinuity in a variable.
     */
    private seq_;
    /**
     *
     */
    private isComputed_;
    /**
     *
     */
    private doesBroadcast_;
    /**
     *
     */
    constructor(varsList_: VarsList, name: string);
    getBroadcast(): boolean;
    /**
     *
     */
    get name(): string;
    getSequence(): number;
    /**
     *
     */
    getSubject(): VarsList;
    /**
     *
     */
    getValue(): number;
    nameEquals(name: string): boolean;
    setBroadcast(value: boolean): void;
    setComputed(value: boolean): void;
    get isComputed(): boolean;
    /**
     *
     */
    setValue(value: number): void;
    setValueSmooth(value: number): void;
    /**
     *
     */
    incrSequence(): void;
}
