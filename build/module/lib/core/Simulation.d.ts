import { Unit } from '../math/Unit';
/**
 *
 */
export interface Simulation {
    /**
     *
     */
    readonly time: number;
    /**
     * Handler for actions to be performed before getState and the evaluate calls.
     * A simulation may remove temporary simulation objects, such as forces, from
     * the list of simulation objects. This method will normally be called by the strategy.
     */
    prolog(): void;
    /**
     * Gets the state vector, Y(t). This method will normally be called by the solver.
     */
    getState(): number[];
    /**
     * Computes the derivatives of the state variables based upon the specified state.
     * This method will normally be called by the solver.
     * @param state (input) The configuration estimated by the solver as a state vector, Y(t + Δt * uomTime).
     * @param rateOfChange (output) The computed derivatives of the state variables.
     * @param Δt (input) The displacement from the start of the step.
     * @param uomTime (input) The unit of measure for Δt.
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void;
    /**
     * Sets the state vector, Y(t). This method will normally be called by the solver.
     */
    setState(state: number[]): void;
    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     * This method will normally be called by the strategy.
     */
    epilog(): void;
}
