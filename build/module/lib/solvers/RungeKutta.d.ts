import { DiffEqSolver } from '../core/DiffEqSolver';
import { Simulation } from '../core/Simulation';
import { Unit } from '../math/Unit';
/**
 * <p>
 * A differential equation solver that achieves O(h<sup>3</sup>) Local Truncation Error (LTE),
 * where h is the step size.
 * </p>
 */
export declare class RungeKutta implements DiffEqSolver {
    private readonly sim_;
    private inp_;
    private k1_;
    private k2_;
    private k3_;
    private k4_;
    /**
     * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
     * @param simulation The model that provides the system state and computes rates of change.
     */
    constructor(simulation: Simulation);
    /**
     *
     */
    step(stepSize: number, uomStep?: Unit): void;
}
