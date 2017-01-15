import AbstractSubject from '../util/AbstractSubject';
import ConcreteVariable from '../model/ConcreteVariable';
import extendArray from '../util/extendArray';
import GenericEvent from '../util/GenericEvent';
import isString from '../checks/isString';
import toName from '../util/toName';
import validName from '../util/validName';
import Variable from '../model/Variable';

/**
 * 
 */
export class VarsList extends AbstractSubject {
    /**
     * 
     */
    private static readonly DELETED = 'DELETED';
    /**
     * 
     */
    private static readonly TIME = 'TIME';
    /**
     * 
     */
    private static readonly VARS_MODIFIED = 'VARS_MODIFIED';
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
            if (s === VarsList.TIME) {
                this.timeIdx_ = i;
            }
        }
        for (let i = 0, n = varNames.length; i < n; i++) {
            this.varList_.push(new ConcreteVariable(this, varNames[i], localNames[i]));
        }
    }

    private findOpenSlot_(quantity: number): number {
        var found = 0;
        var startIdx = -1;
        for (var i = 0, n = this.varList_.length; i < n; i++) {
            if (this.varList_[i].getName() === VarsList.DELETED) {
                if (startIdx === -1) {
                    startIdx = i;
                }
                found++;
                if (found >= quantity) {
                    return startIdx;
                }
            } else {
                startIdx = -1;
                found = 0;
            }
        }
        var expand;
        if (found > 0) {
            // Found a group of deleted variables at end of VarsList, but need more.
            // Expand to get full quantity.
            expand = quantity - found;
        } else {
            // Did not find contiguous group of deleted variables of requested size.
            // Add space at end of current variables.
            startIdx = this.varList_.length;
            expand = quantity;
        }
        var newVars = [];
        for (i = 0; i < expand; i++) {
            newVars.push(new ConcreteVariable(this, VarsList.DELETED,
                VarsList.DELETED));
        }
        extendArray(this.varList_, expand, newVars);
        return startIdx;
    }

    /**
     * 
     */
    addVariables(names: string[], localNames: string[]): number {
        const howMany = names.length;
        if (howMany === 0) {
            throw new Error();
        }
        if (names.length !== localNames.length) {
            throw new Error('names and localNames are different lengths');
        }
        const position = this.findOpenSlot_(howMany);
        for (let i = 0; i < howMany; i++) {
            const name = validName(toName(names[i]));
            if (name === VarsList.DELETED) {
                throw new Error("variable cannot be named ''+VarsList.DELETED+''");
            }
            const idx = position + i;
            this.varList_[idx] = new ConcreteVariable(this, name, localNames[i]);
            if (name === VarsList.TIME) {
                // auto-detect time variable
                this.timeIdx_ = idx;
            }
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    }

    /**
     * 
     */
    deleteVariables(index: number, howMany: number): void {
        throw new Error("TODO");
    }

    /**
     * Increments the sequence number for the specified variable(s), which indicates a
     * discontinuity has occurred in the value of this variable. This information is used in a
     * graph to prevent drawing a line between points that have a discontinuity.
     */
    incrSequence(...indexes: number[]) {
        if (arguments.length === 0) {
            // increment sequence number on all variables
            for (let i = 0, n = this.varList_.length; i < n; i++) {
                this.varList_[i].incrSequence();
            }
        } else {
            // increment sequence number only on specified variables
            for (let i = 0, n = arguments.length; i < n; i++) {
                const idx = arguments[i];
                this.checkIndex_(idx);
                this.varList_[idx].incrSequence();
            }
        }
    }

    /**
     * Returns the current value of the variable with the given index.
     */
    getValue(index: number) {
        this.checkIndex_(index);
        return this.varList_[index].getValue();
    }

    /**
     * Returns an array with the current value of each variable.
     */
    getValues(): number[] {
        return this.varList_.map(function (v) { return v.getValue(); });
    }

    /**
     * 
     */
    setValues(vars: number[], continuous = false) {
        // NOTE: vars.length can be less than this.varList_.length
        const N = this.varList_.length;
        const n = vars.length;
        if (n > N) {
            throw new Error(`setValues bad length n = ${n} > N = ${N}`);
        }
        for (let i = 0; i < N; i++) {
            if (i < n) {
                this.setValue(i, vars[i], continuous);
            }
        }
    }

    /**
     * Sets the value of each variable from the given list of values.
     * When the length of `vars` is less than length of VarsList then the remaining variables are not modified.
     * Assumes this is a discontinous change, so the sequence number is incremented unless you specify
     * that this is a continuous change in the variable.
     */
    setValue(index: number, value: number, continuous = false) {
        this.checkIndex_(index);
        const variable = this.varList_[index];
        if (isNaN(value)) {
            throw new Error('cannot set variable ' + variable.getName() + ' to NaN');
        }
        if (continuous) {
            variable.setValueSmooth(value);
        }
        else {
            variable.setValue(value);
        }
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

    /**
     * Returns the index of the time variable, or -1 if there is no time variable.
     */
    timeIndex(): number {
        return this.timeIdx_;
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
