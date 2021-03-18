import { DiffEqSolver } from '../core/DiffEqSolver';
import { DiffEqSolverSystem } from '../core/DiffEqSolverSystem';
import { Unit } from '../math/Unit';
/**
 * A differential equation solver that achieves O(h cubed) Local Truncation Error (LTE),
 * where h is the step size.
 * @hidden
 */
export declare class RungeKutta implements DiffEqSolver {
    private readonly system;
    private invals;
    private inuoms;
    private k1vals;
    private k1uoms;
    private k2vals;
    private k2uoms;
    private k3vals;
    private k3uoms;
    private k4vals;
    private k4uoms;
    /**
     * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
     * @param system The model that provides the system state and computes rates of change.
     */
    constructor(system: DiffEqSolverSystem);
    /**
     *
     */
    step(stepSize: number, uomStep?: Unit): void;
}
