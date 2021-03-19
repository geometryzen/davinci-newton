import { VarsList } from '../core/VarsList';
import { Unit } from '../math/Unit';
import { Variable } from './Variable';
/**
 * @hidden
 */
export declare class ConcreteVariable implements Variable {
    private varsList_;
    /**
     *
     */
    private $value;
    /**
     *
     */
    private $uom;
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
    getUnit(): Unit;
    nameEquals(name: string): boolean;
    setBroadcast(value: boolean): void;
    setComputed(value: boolean): void;
    get isComputed(): boolean;
    setUnit(uom: Unit): void;
    /**
     *
     */
    setValueJump(value: number): void;
    setValueContinuous(value: number): void;
    /**
     *
     */
    incrSequence(): void;
}
