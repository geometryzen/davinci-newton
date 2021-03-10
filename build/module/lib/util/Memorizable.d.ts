/**
 * An object that memorizes simulation data or performs some other function that needs
 * to happen regularly. The `memorize` method is meant to be called after each simulation
 * time step.
 * See MemoList for how to add a Memorizable
 * object to the list of those that will be called.
 */
export interface Memorizable {
    /**
     * Memorize the current simulation data or do some other function.
     */
    memorize(): void;
}
export default Memorizable;
