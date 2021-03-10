"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarsList = void 0;
var tslib_1 = require("tslib");
var isNumber_1 = require("../checks/isNumber");
var isString_1 = require("../checks/isString");
var ConcreteVariable_1 = require("../model/ConcreteVariable");
var AbstractSubject_1 = require("../util/AbstractSubject");
var clone_1 = require("../util/clone");
var extendArray_1 = require("../util/extendArray");
var find_1 = require("../util/find");
var findIndex_1 = require("../util/findIndex");
var GenericEvent_1 = require("../util/GenericEvent");
var toName_1 = require("../util/toName");
var validName_1 = require("../util/validName");
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
var VarsList = /** @class */ (function (_super) {
    tslib_1.__extends(VarsList, _super);
    /**
     * @param names  array of language-independent variable names;
     * these will be underscorized so the English names can be passed in here.
     */
    function VarsList(names) {
        var _this = _super.call(this) || this;
        /**
         *
         */
        _this.timeIdx_ = -1;
        /**
         *
         */
        _this.varList_ = [];
        /**
         * Whether to save simulation state history.
         */
        _this.history_ = true;
        /**
         * Recent history of the simulation state for debugging.
         * An array of copies of the vars array.
         */
        _this.histArray_ = [];
        var howMany = names.length;
        if (howMany !== 0) {
            _this.addVariables(names);
        }
        return _this;
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
    VarsList.prototype.findOpenSlot_ = function (quantity) {
        var found = 0;
        var startIdx = -1;
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
        var expand;
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
        var newVars = [];
        for (var i = 0; i < expand; i++) {
            newVars.push(new ConcreteVariable_1.ConcreteVariable(this, VarsList.DELETED));
        }
        extendArray_1.default(this.varList_, expand, newVars);
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
            throw new Error();
        }
        var position = this.findOpenSlot_(howMany);
        for (var i = 0; i < howMany; i++) {
            var name_1 = validName_1.default(toName_1.default(names[i]));
            if (name_1 === VarsList.DELETED) {
                throw new Error("variable cannot be named '" + VarsList.DELETED + "'");
            }
            var idx = position + i;
            this.varList_[idx] = new ConcreteVariable_1.ConcreteVariable(this, name_1);
            if (name_1 === VarsList.TIME) {
                // auto-detect time variable
                this.timeIdx_ = idx;
            }
        }
        this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
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
        if (howMany < 0 || index < 0 || index + howMany > this.varList_.length) {
            throw new Error('deleteVariables');
        }
        for (var i = index; i < index + howMany; i++) {
            this.varList_[i] = new ConcreteVariable_1.ConcreteVariable(this, VarsList.DELETED);
        }
        this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
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
            for (var i = 0, n = this.varList_.length; i < n; i++) {
                this.varList_[i].incrSequence();
            }
        }
        else {
            // increment sequence number only on specified variables
            for (var i = 0, n = arguments.length; i < n; i++) {
                var idx = arguments[i];
                this.checkIndex_(idx);
                this.varList_[idx].incrSequence();
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
        return this.varList_[index].getValue();
    };
    VarsList.prototype.getName = function (index) {
        this.checkIndex_(index);
        return this.varList_[index].name;
    };
    VarsList.prototype.getSequence = function (index) {
        this.checkIndex_(index);
        return this.varList_[index].getSequence();
    };
    /**
     * Returns an array with the current value of each variable.
     * The returned array is a copy and will not change.
     */
    VarsList.prototype.getValues = function () {
        return this.varList_.map(function (v) { return v.getValue(); });
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
        // NOTE: vars.length can be less than this.varList_.length
        var N = this.varList_.length;
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
        var variable = this.varList_[index];
        if (isNaN(value)) {
            throw new Error('cannot set variable ' + variable.name + ' to NaN');
        }
        if (continuous) {
            variable.setValueSmooth(value);
        }
        else {
            variable.setValue(value);
        }
    };
    /**
     *
     */
    VarsList.prototype.checkIndex_ = function (index) {
        if (index < 0 || index >= this.varList_.length) {
            throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
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
        this.varList_[position] = variable;
        if (name === VarsList.TIME) {
            // auto-detect time variable
            this.timeIdx_ = position;
        }
        this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
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
        name = toName_1.default(name);
        var p = find_1.default(this.varList_, function (p) {
            return p.name === name;
        });
        if (p != null) {
            return p;
        }
        throw new Error('Parameter not found ' + name);
    };
    VarsList.prototype.getParameters = function () {
        return clone_1.default(this.varList_);
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
        if (this.timeIdx_ < 0) {
            throw new Error('no time variable');
        }
        return this.getValue(this.timeIdx_);
    };
    /**
     * Returns the Variable object at the given index or with the given name
     * @param id the index or name of the variable; the name can be the
     * English or language independent version of the name
     * @return the Variable object at the given index or with the given name
     */
    VarsList.prototype.getVariable = function (id) {
        var index;
        if (isNumber_1.default(id)) {
            index = id;
        }
        else if (isString_1.default(id)) {
            id = toName_1.default(id);
            index = findIndex_1.default(this.varList_, function (v) { return v.name === id; });
            if (index < 0) {
                throw new Error('unknown variable name ' + id);
            }
        }
        else {
            throw new Error();
        }
        this.checkIndex_(index);
        return this.varList_[index];
    };
    /**
     * Returns the number of variables available. This includes any deleted
     * variables (which are not being used and should be ignored).
     * @return the number of variables in this VarsList
     */
    VarsList.prototype.numVariables = function () {
        return this.varList_.length;
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
            this.varList_[idx].setComputed(true);
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
        this.setValue(this.timeIdx_, time);
    };
    /**
     * Returns the index of the time variable, or -1 if there is no time variable.
     */
    VarsList.prototype.timeIndex = function () {
        return this.timeIdx_;
    };
    /**
     * Returns the set of Variable objects in this VarsList, in their correct ordering.
     */
    VarsList.prototype.toArray = function () {
        return clone_1.default(this.varList_);
    };
    /**
     *
     */
    VarsList.DELETED = 'DELETED';
    /**
     *
     */
    VarsList.TIME = 'TIME';
    /**
     *
     */
    VarsList.VARS_MODIFIED = 'VARS_MODIFIED';
    return VarsList;
}(AbstractSubject_1.default));
exports.VarsList = VarsList;
