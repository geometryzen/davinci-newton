import toName from '../util/toName';
import validName from '../util/validName';
import Variable from './Variable';
import VarsList from '../core/VarsList';

/**
 * 
 */
export class ConcreteVariable implements Variable {

    /**
     * 
     */
    private value_ = 0;

    /**
     * 
     */
    private name_: string;

    /**
     * Sequence numbers, to detect discontinuity in a variable.
     */
    private seq_ = 0;

    /**
     * 
     */
    private isComputed_ = false;

    /**
     * 
     */
    private doesBroadcast_ = false;

    /**
     * 
     */
    constructor(private varsList_: VarsList, name: string, private localName_: string) {
        this.name_ = validName(toName(name));
    }

    getBroadcast(): boolean {
        return this.doesBroadcast_;
    }

    /**
     * 
     */
    getName(localized?: boolean) {
        return localized ? this.localName_ : this.name_;
    }

    getSequence(): number {
        return this.seq_;
    }

    /**
     * 
     */
    getSubject(): VarsList {
        return this.varsList_;
    }

    /**
     * 
     */
    getValue(): number {
        return this.value_;
    }

    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }

    setBroadcast(value: boolean): void {
        this.doesBroadcast_ = value;
    }

    setComputed(value: boolean) {
        this.isComputed_ = value;
    }

    /**
     * 
     */
    setValue(value: number): void {
        if (this.value_ !== value) {
            this.value_ = value;
            this.seq_++;
            if (this.doesBroadcast_) {
                this.varsList_.broadcast(this);
            }
        }
    }

    setValueSmooth(value: number): void {
        this.value_ = value;
    }

    /**
     * 
     */
    incrSequence(): void {
        this.seq_++;
    }
}

export default ConcreteVariable;
