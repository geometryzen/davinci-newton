import { DiffEqSolver } from '../core/DiffEqSolver';
import { Simulation } from '../core/Simulation';
import { Unit } from '../math/Unit';
import { AdvanceStrategy } from '../runner/AdvanceStrategy';
/**
 *
 */
export declare class DefaultAdvanceStrategy implements AdvanceStrategy {
    private readonly simulation;
    private readonly solver;
    /**
     *
     */
    constructor(simulation: Simulation, solver: DiffEqSolver);
    /**
     * 1.
     * 2. The solver integrates the derivatives from the simulation.
     * 3. Compute system variables such as energies, linear momentum, and angular momentum.
     */
    advance(stepSize: number, uomStep?: Unit): void;
}
