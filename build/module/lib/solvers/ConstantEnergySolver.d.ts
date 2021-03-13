import { DiffEqSolver } from '../core/DiffEqSolver';
import { EnergySystem } from '../core/EnergySystem';
import { Simulation } from '../core/Simulation';
import { Unit } from '../math/Unit';
/**
 * An adaptive step solver that adjusts the step size in order to
 * ensure that the energy change be less than a tolerance amount.
 * @hidden
 */
export declare class ConstantEnergySolver<T> implements DiffEqSolver {
    private readonly simulation;
    private energySystem_;
    private solverMethod_;
    private savedState;
    stepUpperBound: number;
    /**
     * The smallest time step that will executed.
     * Setting a reasonable lower bound prevents the solver from taking too long to give up.
     */
    stepLowerBound: number;
    /**
     *
     */
    private tolerance_;
    /**
     * Constructs an adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     */
    constructor(simulation: Simulation, energySystem: EnergySystem<T>, solverMethod: DiffEqSolver);
    step(Δt: number, uomTime?: Unit): void;
    /**
     * Returns the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     */
    get tolerance(): number;
    /**
     * Sets the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     * @param value the tolerance value for deciding if sufficient accuracy
     * has been achieved
     */
    set tolerance(value: number);
}
