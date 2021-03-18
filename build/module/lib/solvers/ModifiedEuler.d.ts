import { DiffEqSolver } from '../core/DiffEqSolver';
import { DiffEqSolverSystem } from '../core/DiffEqSolverSystem';
import { Unit } from '../math/Unit';
/**
 * The modified Euler algorithm uses the rate of change values at both
 * the beginning of the step and at the end, taking an average in order
 * to perform the integration.
 * @hidden
 */
export declare class ModifiedEuler implements DiffEqSolver {
    private readonly system;
    private $invals;
    private $inuoms;
    private $k1vals;
    private $k1uoms;
    private $k2vals;
    private $k2uoms;
    /**
     *
     */
    constructor(system: DiffEqSolverSystem);
    step(stepSize: number, uomStep?: Unit): void;
}
