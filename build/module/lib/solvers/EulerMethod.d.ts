import { DiffEqSolver } from '../core/DiffEqSolver';
import { DiffEqSolverSystem } from '../core/DiffEqSolverSystem';
import { Unit } from '../math/Unit';
/**
 * The Euler algorithm uses the rate of change values at the
 * beginning of the step in order to perform the integration.
 * @hidden
 */
export declare class EulerMethod implements DiffEqSolver {
    private readonly system;
    private inp_;
    private k1_;
    /**
     *
     */
    constructor(system: DiffEqSolverSystem);
    step(stepSize: number, uomStep?: Unit): void;
}
