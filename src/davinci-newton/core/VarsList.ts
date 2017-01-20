// Copyright 2017 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import AbstractSubject from '../util/AbstractSubject';
import clone from '../util/clone';
import ConcreteVariable from '../model/ConcreteVariable';
import extendArray from '../util/extendArray';
import find from '../util/find';
import findIndex from '../util/findIndex';
import GenericEvent from '../util/GenericEvent';
import isNumber from '../checks/isNumber';
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
    private history_ = true;
    /**
     *  Recent history of the simulation state for debugging.
     * An array of copies of the vars array.
     */
    private histArray_: number[][] = [];
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

    /**
     * Returns index to put a contiguous group of variables.  Expands the set of variables
     * if necessary.
     * @param {number} quantity number of contiguous variables to allocate
     * @return {number} index of first variable
     */
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
     * Add a continguous block of ConcreteVariables.
     * @param {!Array<string>} names language-independent names of variables; these will be
     * underscorized so the English name can be passed in here.
     * @param {!Array<string>} localNames localized names of variables
     * @return {number} index index of first Variable that was added
     * @throws {Error} if any of the variable names is 'DELETED', or array of names is empty
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
     * Delete several variables, but leaves those places in the array as empty spots that
     * can be allocated in future with `addVariables`. Until an empty spot is
     * reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
     * should not be used.
     * @param {number} index index of first variable to delete
     * @param {number} howMany number of variables to delete
     */
    deleteVariables(index: number, howMany: number): void {
        if (howMany === 0) {
            return;
        }
        if (howMany < 0 || index < 0 || index + howMany > this.varList_.length) {
            throw new Error('deleteVariables');
        }
        for (var i = index; i < index + howMany; i++) {
            this.varList_[i] = new ConcreteVariable(this, VarsList.DELETED,
                VarsList.DELETED);
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
    }

    /**
     * Increments the sequence number for the specified variable(s), which indicates a
     * discontinuity has occurred in the value of this variable. This information is used in a
     * graph to prevent drawing a line between points that have a discontinuity.
     * @param {...number} indexes  the indexes of the variables;
     * if no index given then all variable's sequence numbers are incremented
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
     * @param {number} index the index of the variable of interest
     * @return {number} the current value of the variable of interest
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
     * Sets the value of each variable from the given list of values. When the length of
     * `vars` is less than length of VarsList then the remaining variables are not modified.
     * Assumes this is a discontinous change, so the sequence number is incremented
     * unless you specify that this is a continuous change in the variable.
     * @param {!Array<number>} vars array of state variables
     * @param {boolean=} continuous `true` means this new value is continuous with
     * previous values; `false` (the default) means the new value is discontinuous with
     * previous values, so the sequence number for the variable is incremented
     * @throws {Error} if length of `vars` exceeds length of VarsList
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
     * Sets the specified variable to the given value. Variables are numbered starting at
     * zero. Assumes this is a discontinous change, so the sequence number is incremented
     * unless you specify that this is a continuous change in the variable.
     * @param {number} index  the index of the variable within the array of variables
     * @param {number} value  the value to set the variable to
     * @param {boolean=} continuous `true` means this new value is continuous with
     * previous values; `false` (the default) means the new value is discontinuous with
     * previous values, so the sequence number for the variable is incremented
     * @throws {Error} if value is `NaN`
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
     * 
     */
    private checkIndex_(index: number) {
        if (index < 0 || index >= this.varList_.length) {
            throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
        }
    }
    /**
     * Add a Variable to this VarsList.
     * @param variable the Variable to add
     * @return the index number of the variable
     * @throws {Error} if name if the Variable is 'DELETED'
     */
    addVariable(variable: Variable): number {
        var name = variable.getName();
        if (name === VarsList.DELETED) {
            throw new Error('variable cannot be named "' + VarsList.DELETED + '"');
        }
        // add variable to first open slot
        var position = this.findOpenSlot_(1);
        this.varList_[position] = variable;
        if (name === VarsList.TIME) {
            // auto-detect time variable
            this.timeIdx_ = position;
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    }

    /**
     * Whether recent history is being stored, see `saveHistory`.
     * @return true if recent history is being stored
     */
    getHistory() {
        return this.history_;
    }

    getParameter(name: string) {
        name = toName(name);
        var p = find(this.varList_, function (p) {
            return p.getName() === name;
        });
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    }

    getParameters(): Variable[] {
        return clone(this.varList_);
    }

    /**
     * Returns the value of the time variable, or throws an exception if there is no time variable.
     * 
     * There are no explicit units for the time, so you can regard a time unit as any length
     * of time, as long as it is consistent with other units.
     * @return {number} the current simulation time
     * @throws {Error} if there is no time variable
     */
    getTime(): number {
        if (this.timeIdx_ < 0) {
            throw new Error('no time variable');
        }
        return this.getValue(this.timeIdx_);
    }

    /**
     * Returns the Variable object at the given index or with the given name
     * @param {number|string} id the index or name of the variable; the name can be the
     * English or language independent version of the name
     * @return the Variable object at the given index or with the given name
     */
    getVariable(id: number | string) {
        var index;
        if (isNumber(id)) {
            index = id;
        } else if (isString(id)) {
            id = toName(id);
            index = findIndex(this.varList_,
                function (v) { return v.getName() === id; });
            if (index < 0) {
                throw new Error('unknown variable name ' + id);
            }
        } else {
            throw new Error();
        }
        this.checkIndex_(index);
        return this.varList_[index];
    }

    /**
     * Returns the number of variables available. This includes any deleted
     * variables (which are not being used and should be ignored).
     * @return the number of variables in this VarsList
     */
    numVariables(): number {
        return this.varList_.length;
    }

    /**
     * Saves the current variables in a 'history' set, for debugging, to be able to
     * reproduce an error condition. See `printHistory`.
     */
    saveHistory(): void {
        if (this.history_) {
            var v = this.getValues();
            v.push(this.getTime());
            this.histArray_.push(v); // adds element to end of histArray_
            if (this.histArray_.length > 20) {
                // to prevent filling memory, only keep recent history entries
                this.histArray_.shift(); // removes element at histArray_[0]
            }
        }
    }

    /**
     * Indicates the specified Variables are being automatically computed.
     * @param {...number} indexes  the indexes of the variables
     */
    setComputed(...indexes: number[]) {
        for (let i = 0, n = arguments.length; i < n; i++) {
            const idx = arguments[i];
            this.checkIndex_(idx);
            this.varList_[idx].setComputed(true);
        }
    }

    /**
     * Sets whether to store recent history, see {@link #saveHistory}.
     * @param value true means recent history should be stored
     */
    setHistory(value: boolean) {
        this.history_ = value;
    }

    /**
     * Sets the current simulation time.  There are no explicit units for the time, so
     * you can regard a time unit as seconds or years as desired. See [About Units Of
     * Measurement](Architecture.html#aboutunitsofmeasurement).
     * @param time the current simulation time.
     * @throws {Error} if there is no time variable
     */
    setTime(time: number) {
        this.setValue(this.timeIdx_, time);
    }

    /**
     * Returns the index of the time variable, or -1 if there is no time variable.
     */
    timeIndex(): number {
        return this.timeIdx_;
    }

    /**
     * Returns the set of Variable objects in this VarsList, in their correct ordering.
     */
    toArray(): Variable[] {
        return clone(this.varList_);
    }
}

export default VarsList;
