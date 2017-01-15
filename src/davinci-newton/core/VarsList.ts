import AbstractSubject from '../util/AbstractSubject';
import ConcreteVariable from '../model/ConcreteVariable';
import isString from '../checks/isString';
import toName from '../util/toName';
import validName from '../util/validName';
import Variable from '../model/Variable';

/**
 * Language-independent name of the time variable.
 */
const TIME = 'TIME';

export class VarsList extends AbstractSubject {
    /**
     * 
     */
    private timeIdx_ = -1;
    /**
     * 
     */
    private varList_: Variable[] = [];
    /**
     * Whether to save simulation state history.
     */
    // private history_ = true;
    /**
     *  Recent history of the simulation state for debugging.
     * An array of copies of the vars array.
     */
    // private histArray_: number[][] = [];
    /**
     * 
     */
    constructor(varNames: string[], localNames: string[], name = 'VARIABLES') {
        super(name);
        if (varNames.length !== localNames.length) {
            throw new Error('varNames and localNames are different lengths');
        }
        for (let i = 0, n = varNames.length; i < n; i++) {
            let s = varNames[i];
            if (!isString(s)) {
                throw new Error('variable name ' + s + ' is not a string i=' + i);
            }
            s = validName(toName(s));
            varNames[i] = s;
            // find index of the time variable.
            if (s === TIME) {
                this.timeIdx_ = i;
            }
        }
        for (let i = 0, n = varNames.length; i < n; i++) {
            this.varList_.push(new ConcreteVariable(this, varNames[i], localNames[i]));
        }
    }
    addVariables(names: string[], localNames: string[]): number {
        throw new Error("TODO");
    }
    deleteVariables(index: number, howMany: number): void {
        throw new Error("TODO");
    }
    incrSequence(...indexes: number[]) {
        throw new Error("TODO");
    }
    getValue(index: number) {
        this.checkIndex_(index);
        return this.varList_[index].getValue();
    }
    getValues(): number[] {
        throw new Error("TODO");
    }
    setValues(values: number[], continuous = false) {
        throw new Error("TODO");
    }
    setValue(index: number, value: number, continuous = false) {
        throw new Error("TODO");
    }
    /**
     * Returns the value of the time variable.
     * Throws an exception if there is no time variable.
     */
    getTime(): number {
        if (this.timeIdx_ < 0) {
            throw new Error('no time variable');
        }
        return this.getValue(this.timeIdx_);
    }
    timeIndex(): number {
        throw new Error("TODO");
    }
    /**
     * 
     */
    private checkIndex_(index: number) {
        if (index < 0 || index >= this.varList_.length) {
            throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
        }
    }
}

export default VarsList;
