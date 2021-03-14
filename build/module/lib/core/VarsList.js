import { __extends } from "tslib";
import isNumber from '../checks/isNumber';
import isString from '../checks/isString';
import { ConcreteVariable } from '../model/ConcreteVariable';
import { AbstractSubject } from '../util/AbstractSubject';
import clone from '../util/clone';
import extendArray from '../util/extendArray';
import find from '../util/find';
import findIndex from '../util/findIndex';
import { GenericEvent } from '../util/GenericEvent';
import toName from '../util/toName';
import validName from '../util/validName';
/**
 * @hidden
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
var VarsList = /** @class */ (function (_super) {
    __extends(VarsList, _super);
    /**
     * @param names  array of language-independent variable names;
     * these will be underscorized so the English names can be passed in here.
     */
    function VarsList(names) {
        var _this = _super.call(this) || this;
        /**
         * The zero-based index of the time variable.
         */
        _this.$timeIdx = -1;
        /**
         * The variables that provide the data for this wrapper.
         */
        _this.$variables = [];
        /**
         * A lazy cache of variable values to minimize creation of temporary objects.
         * This is only synchronized when the state is requested.
         */
        _this.$values = [];
        /**
         * Whether to save simulation state history.
         */
        _this.history_ = true;
        /**
         * Recent history of the simulation state for debugging.
         * An array of copies of the vars array.
         */
        _this.histArray_ = [];
        // console.lg(`VarsList.constructor(names=${JSON.stringify(names)})`);
        var howMany = names.length;
        if (howMany !== 0) {
            _this.addVariables(names);
        }
        return _this;
    }
    /**
     * Returns index to put a contiguous group of variables.  Expands the set of variables
     * if necessary.
     * @param quantity number of contiguous variables to allocate
     * @return index of first variable
     */
    VarsList.prototype.findOpenSlot_ = function (quantity) {
        var found = 0;
        var startIdx = -1;
        for (var i = 0, n = this.$variables.length; i < n; i++) {
            if (this.$variables[i].name === VarsList.DELETED) {
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
        var expand;
        if (found > 0) {
            // Found a group of deleted variables at end of VarsList, but need more.
            // Expand to get full quantity.
            expand = quantity - found;
        }
        else {
            // Did not find contiguous group of deleted variables of requested size.
            // Add space at end of current variables.
            startIdx = this.$variables.length;
            expand = quantity;
        }
        var newVars = [];
        for (var i = 0; i < expand; i++) {
            newVars.push(new ConcreteVariable(this, VarsList.DELETED));
        }
        extendArray(this.$variables, expand, newVars);
        return startIdx;
    };
    /**
     * Add a contiguous block of variables.
     * @param names language-independent names of variables; these will be
     * underscorized so the English name can be passed in here.
     * @return index index of first Variable that was added
     * @throws if any of the variable names is 'DELETED', or array of names is empty
     */
    VarsList.prototype.addVariables = function (names) {
        var howMany = names.length;
        if (howMany === 0) {
            throw new Error("names must not be empty.");
        }
        var position = this.findOpenSlot_(howMany);
        for (var i = 0; i < howMany; i++) {
            var name_1 = validName(toName(names[i]));
            if (name_1 === VarsList.DELETED) {
                throw new Error("variable cannot be named '" + VarsList.DELETED + "'.");
            }
            var idx = position + i;
            this.$variables[idx] = new ConcreteVariable(this, name_1);
            if (name_1 === VarsList.TIME) {
                // auto-detect time variable
                this.$timeIdx = idx;
            }
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    };
    /**
     * Deletes a contiguous block of variables.
     * Delete several variables, but leaves those places in the array as empty spots that
     * can be allocated in future with `addVariables`. Until an empty spot is
     * reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
     * should not be used.
     * @param index index of first variable to delete
     * @param howMany number of variables to delete
     */
    VarsList.prototype.deleteVariables = function (index, howMany) {
        if (howMany === 0) {
            return;
        }
        if (howMany < 0 || index < 0 || index + howMany > this.$variables.length) {
            throw new Error('deleteVariables');
        }
        for (var i = index; i < index + howMany; i++) {
            this.$variables[i] = new ConcreteVariable(this, VarsList.DELETED);
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
    };
    /**
     * Increments the sequence number for the specified variable(s), which indicates a
     * discontinuity has occurred in the value of this variable. This information is used in a
     * graph to prevent drawing a line between points that have a discontinuity.
     * @param indexes  the indexes of the variables;
     * if no index given then all variable's sequence numbers are incremented
     */
    VarsList.prototype.incrSequence = function () {
        var indexes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indexes[_i] = arguments[_i];
        }
        if (arguments.length === 0) {
            // increment sequence number on all variables
            for (var i = 0, n = this.$variables.length; i < n; i++) {
                this.$variables[i].incrSequence();
            }
        }
        else {
            // increment sequence number only on specified variables
            for (var i = 0, n = arguments.length; i < n; i++) {
                var idx = arguments[i];
                this.checkIndex_(idx);
                this.$variables[idx].incrSequence();
            }
        }
    };
    /**
     * Returns the current value of the variable with the given index.
     * @param index the index of the variable of interest
     * @return the current value of the variable of interest
     */
    VarsList.prototype.getValue = function (index) {
        this.checkIndex_(index);
        return this.$variables[index].getValue();
    };
    VarsList.prototype.getName = function (index) {
        this.checkIndex_(index);
        return this.$variables[index].name;
    };
    VarsList.prototype.getSequence = function (index) {
        this.checkIndex_(index);
        return this.$variables[index].getSequence();
    };
    /**
     * Returns an array with the current value of each variable.
     * The returned array is a copy of the variable values; changing the array will not change the variable values.
     * However, for performance, the array is maintained between invocations.
     */
    VarsList.prototype.getValues = function () {
        var values = this.$values;
        var variables = this.$variables;
        var N = variables.length;
        if (values.length !== N) {
            values.length = N;
        }
        for (var i = 0; i < N; i++) {
            values[i] = variables[i].getValue();
        }
        return this.$values;
    };
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
    VarsList.prototype.setValues = function (vars, continuous) {
        if (continuous === void 0) { continuous = false; }
        var N = this.$variables.length;
        var n = vars.length;
        if (n > N) {
            throw new Error("setValues bad length n = " + n + " > N = " + N);
        }
        for (var i = 0; i < N; i++) {
            if (i < n) {
                this.setValue(i, vars[i], continuous);
            }
        }
    };
    /**
     * @hidden
     */
    VarsList.prototype.setValuesContinuous = function (vars) {
        var N = this.$variables.length;
        var n = vars.length;
        for (var i = 0; i < N; i++) {
            if (i < n) {
                this.setValueContinuous(i, vars[i]);
            }
        }
    };
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
    VarsList.prototype.setValue = function (index, value, continuous) {
        if (continuous === void 0) { continuous = false; }
        this.checkIndex_(index);
        var variable = this.$variables[index];
        if (isNaN(value)) {
            throw new Error('cannot set variable ' + variable.name + ' to NaN');
        }
        if (continuous) {
            variable.setValueContinuous(value);
        }
        else {
            variable.setValueJump(value);
        }
    };
    /**
     * @hidden
     */
    VarsList.prototype.setValueContinuous = function (index, value) {
        var variable = this.$variables[index];
        variable.setValueContinuous(value);
    };
    /**
     * @hidden
     */
    VarsList.prototype.setValueJump = function (index, value) {
        var variable = this.$variables[index];
        variable.setValueJump(value);
    };
    /**
     *
     */
    VarsList.prototype.checkIndex_ = function (index) {
        if (index < 0 || index >= this.$variables.length) {
            throw new Error('bad variable index=' + index + '; numVars=' + this.$variables.length);
        }
    };
    /**
     * Add a Variable to this VarsList.
     * @param variable the Variable to add
     * @return the index number of the variable
     * @throws if name if the Variable is 'DELETED'
     */
    VarsList.prototype.addVariable = function (variable) {
        var name = variable.name;
        if (name === VarsList.DELETED) {
            throw new Error("variable cannot be named '" + VarsList.DELETED + "'");
        }
        // add variable to first open slot
        var position = this.findOpenSlot_(1);
        this.$variables[position] = variable;
        if (name === VarsList.TIME) {
            // auto-detect time variable
            this.$timeIdx = position;
        }
        this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        return position;
    };
    /**
     * Whether recent history is being stored, see `saveHistory`.
     * @return true if recent history is being stored
     */
    VarsList.prototype.getHistory = function () {
        return this.history_;
    };
    VarsList.prototype.getParameter = function (name) {
        name = toName(name);
        var p = find(this.$variables, function (p) {
            return p.name === name;
        });
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    };
    VarsList.prototype.getParameters = function () {
        return clone(this.$variables);
    };
    /**
     * Returns the value of the time variable, or throws an exception if there is no time variable.
     *
     * There are no explicit units for the time, so you can regard a time unit as any length
     * of time, as long as it is consistent with other units.
     * @return the current simulation time
     * @throws if there is no time variable
     */
    VarsList.prototype.getTime = function () {
        if (this.$timeIdx < 0) {
            throw new Error('no time variable');
        }
        return this.getValue(this.$timeIdx);
    };
    /**
     * Returns the Variable object at the given index or with the given name
     * @param id the index or name of the variable; the name can be the
     * English or language independent version of the name
     * @return the Variable object at the given index or with the given name
     */
    VarsList.prototype.getVariable = function (id) {
        var index;
        if (isNumber(id)) {
            index = id;
        }
        else if (isString(id)) {
            id = toName(id);
            index = findIndex(this.$variables, function (v) { return v.name === id; });
            if (index < 0) {
                throw new Error('unknown variable name ' + id);
            }
        }
        else {
            throw new Error();
        }
        this.checkIndex_(index);
        return this.$variables[index];
    };
    /**
     * Returns the number of variables available. This includes any deleted
     * variables (which are not being used and should be ignored).
     * @return the number of variables in this VarsList
     */
    VarsList.prototype.numVariables = function () {
        return this.$variables.length;
    };
    /**
     * Saves the current variables in a 'history' set, for debugging, to be able to
     * reproduce an error condition. See `printHistory`.
     */
    VarsList.prototype.saveHistory = function () {
        if (this.history_) {
            var v = this.getValues();
            v.push(this.getTime());
            this.histArray_.push(v); // adds element to end of histArray_
            if (this.histArray_.length > 20) {
                // to prevent filling memory, only keep recent history entries
                this.histArray_.shift(); // removes element at histArray_[0]
            }
        }
    };
    /**
     * Indicates the specified Variables are being automatically computed.
     * @param indexes  the indexes of the variables
     */
    VarsList.prototype.setComputed = function () {
        var indexes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indexes[_i] = arguments[_i];
        }
        for (var i = 0, n = arguments.length; i < n; i++) {
            var idx = arguments[i];
            this.checkIndex_(idx);
            this.$variables[idx].setComputed(true);
        }
    };
    /**
     * Sets whether to store recent history, see {@link #saveHistory}.
     * @param value true means recent history should be stored
     */
    VarsList.prototype.setHistory = function (value) {
        this.history_ = value;
    };
    /**
     * Sets the current simulation time.
     * @param time the current simulation time.
     * @throws {Error} if there is no time variable
     */
    VarsList.prototype.setTime = function (time) {
        this.setValueJump(this.$timeIdx, time);
    };
    /**
     * Returns the index of the time variable, or -1 if there is no time variable.
     */
    VarsList.prototype.timeIndex = function () {
        return this.$timeIdx;
    };
    /**
     * Returns the set of Variable objects in this VarsList, in their correct ordering.
     */
    VarsList.prototype.toArray = function () {
        return clone(this.$variables);
    };
    /**
     * This name cannot be used as a variable name.
     */
    VarsList.DELETED = 'DELETED';
    /**
     * This name is the reserved name for the time variable.
     */
    VarsList.TIME = 'TIME';
    /**
     *
     */
    VarsList.VARS_MODIFIED = 'VARS_MODIFIED';
    return VarsList;
}(AbstractSubject));
export { VarsList };
