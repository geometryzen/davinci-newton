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
    private doesBroadcast_ = false;

    /**
     * 
     */
    constructor(private varsList_: VarsList, name: string, private localName_: string) {
        this.name_ = validName(toName(name));
    }

    /**
     * 
     */
    getName(localized?: boolean) {
        return localized ? this.localName_ : this.name_;
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
