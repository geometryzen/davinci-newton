import { GraphVarsList } from '../graph/GraphVarsList';
import { Variable } from '../model/Variable';
import { AbstractSubject } from '../util/AbstractSubject';
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
export declare class VarsList extends AbstractSubject implements GraphVarsList {
    /**
     *
     */
    private static readonly DELETED;
    /**
     *
     */
    static readonly TIME = "TIME";
    /**
     *
     */
    private static readonly VARS_MODIFIED;
    /**
     *
     */
    private timeIdx_;
    /**
     *
     */
    private varList_;
    /**
     * Whether to save simulation state history.
     */
    private history_;
    /**
     * Recent history of the simulation state for debugging.
     * An array of copies of the vars array.
     */
    private histArray_;
    /**
     * @param names  array of language-independent variable names;
     * these will be underscorized so the English names can be passed in here.
     */
    constructor(names: string[]);
    /**
     * Returns index to put a contiguous group of variables.  Expands the set of variables
     * if necessary.
     * @param quantity number of contiguous variables to allocate
     * @return index of first variable
     */
    private findOpenSlot_;
    /**
     * Add a contiguous block of variables.
     * @param names language-independent names of variables; these will be
     * underscorized so the English name can be passed in here.
     * @return index index of first Variable that was added
     * @throws if any of the variable names is 'DELETED', or array of names is empty
     */
    addVariables(names: string[]): number;
    /**
     * Deletes a contiguous block of variables.
     * Delete several variables, but leaves those places in the array as empty spots that
     * can be allocated in future with `addVariables`. Until an empty spot is
     * reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
     * should not be used.
     * @param index index of first variable to delete
     * @param howMany number of variables to delete
     */
    deleteVariables(index: number, howMany: number): void;
    /**
     * Increments the sequence number for the specified variable(s), which indicates a
     * discontinuity has occurred in the value of this variable. This information is used in a
     * graph to prevent drawing a line between points that have a discontinuity.
     * @param indexes  the indexes of the variables;
     * if no index given then all variable's sequence numbers are incremented
     */
    incrSequence(...indexes: number[]): void;
    /**
     * Returns the current value of the variable with the given index.
     * @param index the index of the variable of interest
     * @return the current value of the variable of interest
     */
    getValue(index: number): number;
    getName(index: number): string;
    getSequence(index: number): number;
    /**
     * Returns an array with the current value of each variable.
     * The returned array is a copy and will not change.
     */
    getValues(): number[];
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
    setValues(vars: number[], continuous?: boolean): void;
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
    setValue(index: number, value: number, continuous?: boolean): void;
    /**
     *
     */
    private checkIndex_;
    /**
     * Add a Variable to this VarsList.
     * @param variable the Variable to add
     * @return the index number of the variable
     * @throws if name if the Variable is 'DELETED'
     */
    addVariable(variable: Variable): number;
    /**
     * Whether recent history is being stored, see `saveHistory`.
     * @return true if recent history is being stored
     */
    getHistory(): boolean;
    getParameter(name: string): Variable;
    getParameters(): Variable[];
    /**
     * Returns the value of the time variable, or throws an exception if there is no time variable.
     *
     * There are no explicit units for the time, so you can regard a time unit as any length
     * of time, as long as it is consistent with other units.
     * @return the current simulation time
     * @throws if there is no time variable
     */
    getTime(): number;
    /**
     * Returns the Variable object at the given index or with the given name
     * @param id the index or name of the variable; the name can be the
     * English or language independent version of the name
     * @return the Variable object at the given index or with the given name
     */
    getVariable(id: number | string): Variable;
    /**
     * Returns the number of variables available. This includes any deleted
     * variables (which are not being used and should be ignored).
     * @return the number of variables in this VarsList
     */
    numVariables(): number;
    /**
     * Saves the current variables in a 'history' set, for debugging, to be able to
     * reproduce an error condition. See `printHistory`.
     */
    saveHistory(): void;
    /**
     * Indicates the specified Variables are being automatically computed.
     * @param indexes  the indexes of the variables
     */
    setComputed(...indexes: number[]): void;
    /**
     * Sets whether to store recent history, see {@link #saveHistory}.
     * @param value true means recent history should be stored
     */
    setHistory(value: boolean): void;
    /**
     * Sets the current simulation time.
     * @param time the current simulation time.
     * @throws {Error} if there is no time variable
     */
    setTime(time: number): void;
    /**
     * Returns the index of the time variable, or -1 if there is no time variable.
     */
    timeIndex(): number;
    /**
     * Returns the set of Variable objects in this VarsList, in their correct ordering.
     */
    toArray(): Variable[];
}
