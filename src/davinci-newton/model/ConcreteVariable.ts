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
     * 
     */
    constructor(private varsList_: VarsList, name: string, private localName_: string) {
        this.name_ = validName(toName(name));
    }

    /**
     * 
     */
    getValue(): number {
        return this.value_;
    }
}

export default ConcreteVariable;
