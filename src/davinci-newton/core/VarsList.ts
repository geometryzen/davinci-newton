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
import GraphVarsList from '../graph/GraphVarsList';
import isNumber from '../checks/isNumber';
import isString from '../checks/isString';
import toName from '../util/toName';
import validName from '../util/validName';
import Variable from '../model/Variable';

/**
 * A set of Variables.
 * Variables are numbered from `0` to `n-1` where `n` is the number of Variables.
 * 
 * VarsList is a `Subject` and each Variable is a `Parameter` of the VarsList.
 * 
 * Unlike other Subject classes, VarsList does not broadcast each Variable whenever the
 * Variable changes. And VarsList prohibits adding general Parameters in its
 * `addParameter` method, because it can only contain Variables.
 * 
 * As a Subject, the VarsList will broadcast the `VARS_MODIFIED` event to its
 * Observers whenever Variables are added or removed.
 * 
 * ### Continuous vs. Discontinuous Changes
 * 
 * A change to a variable is either continuous or discontinuous. This affects how a line
 * graph of the variable is drawn: `DisplayGraph` doesn't draw a line at a point of discontinuity.
 * A discontinuity is indicated by incrementing the sequence number.
 * 
 * It is important to note that `setValue` and `setValues` have an optional
 * parameter `continuous` which determines whether the change of variable is continuous or
 * discontinuous.
 * 
 * Here are some guidelines about when a change in a variable should be marked as being
 * discontinuous by incrementing the sequence number:
 * 
 * 1. When a change increments only a few variables, be sure to increment any variables
 * that are **dependent** on those variables. For example, if velocity of an object is
 * discontinuously changed, then the kinetic, potential and total energy should all be
 * marked as discontinuous.
 * 
 * 2. When **dragging** an object, don't increment variables of other objects.
 * 
 * 3. When some **parameter** such as gravity or mass changes, increment any derived
 * variables (like energy) that depend on that parameter.
 * 
 * ## Deleted Variables
 * 
 * When a variable is no longer used it has the reserved name 'DELETED'. Any such variable
 * should be ignored.  This allows variables to be added or removed without affecting the
 * index of other existing variables.
 * 
 * ### Events Broadcast
 * 
 * + GenericEvent name `VARS_MODIFIED`
 */
export class VarsList extends AbstractSubject implements GraphVarsList {
    /**
     * 
     */
    private static readonly DELETED = 'DELETED';
    /**
     * 
     */
    public static readonly TIME = 'TIME';
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
     * @param names  array of language-independent variable names;
     * these will be underscorized so the English names can be passed in here.
     */
    constructor(names: string[]) {
        super();
        const howMany = names.length;
        if (howMany !== 0) {
            this.addVariables(names);
        }
        /*
        for (let i = 0, n = names.length; i < n; i++) {
            let s = names[i];
            if (!isString(s)) {
                throw new Error('variable name ' + s + ' is not a string i=' + i);
            }
            s = validName(toName(s));
            names[i] = s;
            // find index of the time variable.
            if (s === VarsList.TIME) {
                this.timeIdx_ = i;
            }
        }
        for (let i = 0, n = names.length; i < n; i++) {
            this.varList_.push(new ConcreteVariable(this, names[i]));
        }
        */
    }

    /**
     * Returns index to put a contiguous group of variables.  Expands the set of variables
     * if necessary.
     * @param quantity number of contiguous variables to allocate
     * @return index of first variable
     */
    private findOpenSlot_(quantity: number): number {
        let found = 0;
        let startIdx = -1;
        for (var i = 0, n = this.varList_.length; i < n; i++) {
            if (this.varList_[i].name === VarsList.DELETED) {
                if (startIdx === -1) {
                    startIdx = i;
                }
                found++;
                if (found >= quantity) {
                    return startIdx;
                }
            }
            else {
                startIdx = -1;
                found = 0;
            }
        }
        let expand: number;
        if (found > 0) {
            // Found a group of deleted variables at end of VarsList, but need more.
            // Expand to get full quantity.
            expand = quantity - found;
        }
        else {
            // Did not find contiguous group of deleted variables of requested size.
            // Add space at end of current variables.
            startIdx = this.varList_.length;
            expand = quantity;
        }
        const newVars: ConcreteVariable[] = [];
        for (i = 0; i < expand; i++) {
            newVars.push(new ConcreteVariable(this, VarsList.DELETED));
        }
        extendArray(this.varList_, expand, newVars);
        return startIdx;
    }

    /**
     * Add a contiguous block of variables.
     * @param names language-independent names of variables; these will be
     * underscorized so the English name can be passed in here.
     * @return index index of first Variable that was added
     * @throws if any of the variable names is 'DELETED', or array of names is empty
     */
    addVariables(names: string[]): number {
        const howMany = names.length;
        if (howMany === 0) {
            throw new Error();
        }
        const position = this.findOpenSlot_(howMany);
        for (let i = 0; i < howMany; i++) {
            const name = validName(toName(names[i]));
            if (name === VarsList.DELETED) {
                throw new Error(`variable cannot be named '${VarsList.DELETED}'`);
            }
            const idx = position + i;
            this.varList_[idx] = new ConcreteVariable(this, name);
            if (name === VarsList.TIME) {
                // auto-detect time variable
                this.timeIdx_ = idx;
            }
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    }

    /**
     * Deletes a contiguous block of variables.
     * Delete several variables, but leaves those places in the array as empty spots that
     * can be allocated in future with `addVariables`. Until an empty spot is
     * reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
     * should not be used.
     * @param index index of first variable to delete
     * @param howMany number of variables to delete
     */
    deleteVariables(index: number, howMany: number): void {
        if (howMany === 0) {
            return;
        }
        if (howMany < 0 || index < 0 || index + howMany > this.varList_.length) {
            throw new Error('deleteVariables');
        }
        for (var i = index; i < index + howMany; i++) {
            this.varList_[i] = new ConcreteVariable(this, VarsList.DELETED);
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
    }

    /**
     * Increments the sequence number for the specified variable(s), which indicates a
     * discontinuity has occurred in the value of this variable. This information is used in a
     * graph to prevent drawing a line between points that have a discontinuity.
     * @param indexes  the indexes of the variables;
     * if no index given then all variable's sequence numbers are incremented
     */
    incrSequence(...indexes: number[]) {
        if (arguments.length === 0) {
            // increment sequence number on all variables
            for (let i = 0, n = this.varList_.length; i < n; i++) {
                this.varList_[i].incrSequence();
            }
        }
        else {
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
     * @param index the index of the variable of interest
     * @return the current value of the variable of interest
     */
    getValue(index: number): number {
        this.checkIndex_(index);
        return this.varList_[index].getValue();
    }

    getName(index: number): string {
        this.checkIndex_(index);
        return this.varList_[index].name;
    }

    getSequence(index: number): number {
        this.checkIndex_(index);
        return this.varList_[index].getSequence();
    }

    /**
     * Returns an array with the current value of each variable.
     * The returned array is a copy and will not change.
     */
    getValues(): number[] {
        return this.varList_.map(function (v) { return v.getValue(); });
    }

    /**
     * Sets the value of each variable from the given list of values. When the length of
     * `vars` is less than length of VarsList then the remaining variables are not modified.
     * Assumes this is a discontinous change, so the sequence number is incremented
     * unless you specify that this is a continuous change in the variable.
     * @param vars array of state variables
     * @param continuous `true` means this new value is continuous with
     * previous values; `false` (the default) means the new value is discontinuous with
     * previous values, so the sequence number for the variable is incremented
     * @throws if length of `vars` exceeds length of VarsList
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
     * @param index  the index of the variable within the array of variables
     * @param value  the value to set the variable to
     * @param continuous `true` means this new value is continuous with
     * previous values; `false` (the default) means the new value is discontinuous with
     * previous values, so the sequence number for the variable is incremented
     * @throws if value is `NaN`
     */
    setValue(index: number, value: number, continuous = false) {
        this.checkIndex_(index);
        const variable = this.varList_[index];
        if (isNaN(value)) {
            throw new Error('cannot set variable ' + variable.name + ' to NaN');
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
     * @throws if name if the Variable is 'DELETED'
     */
    addVariable(variable: Variable): number {
        const name = variable.name;
        if (name === VarsList.DELETED) {
            throw new Error(`variable cannot be named '${VarsList.DELETED}'`);
        }
        // add variable to first open slot
        const position = this.findOpenSlot_(1);
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
        const p = find(this.varList_, function (p) {
            return p.name === name;
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
     * @return the current simulation time
     * @throws if there is no time variable
     */
    getTime(): number {
        if (this.timeIdx_ < 0) {
            throw new Error('no time variable');
        }
        return this.getValue(this.timeIdx_);
    }

    /**
     * Returns the Variable object at the given index or with the given name
     * @param id the index or name of the variable; the name can be the
     * English or language independent version of the name
     * @return the Variable object at the given index or with the given name
     */
    getVariable(id: number | string) {
        let index: number;
        if (isNumber(id)) {
            index = id;
        }
        else if (isString(id)) {
            id = toName(id);
            index = findIndex(this.varList_, v => v.name === id);
            if (index < 0) {
                throw new Error('unknown variable name ' + id);
            }
        }
        else {
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
            const v = this.getValues();
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
     * @param indexes  the indexes of the variables
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
     * Sets the current simulation time.
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
