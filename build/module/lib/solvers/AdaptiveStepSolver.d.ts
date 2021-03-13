import { DiffEqSolver } from '../core/DiffEqSolver';
import { Metric } from '../core/Metric';
import { Simulation } from '../core/Simulation';
import { Unit } from '../math/Unit';
import { EnergySystem } from '../core/EnergySystem';
/**
 * @hidden
 */
export declare class AdaptiveStepSolver<T> implements DiffEqSolver {
    private readonly metric;
    private diffEq_;
    private energySystem_;
    private odeSolver_;
    private secondDiff_;
    private savedState;
    stepUBound: number;
    /**
     * The smallest time step that will executed.
     * Setting a reasonable lower bound prevents the solver from taking too long to give up.
     */
    stepLBound: number;
    /**
     * enables debug code for particular test
     */
    private tolerance_;
    constructor(diffEq: Simulation, energySystem: EnergySystem<T>, diffEqSolver: DiffEqSolver, metric: Metric<T>);
    step(stepSize: number, uomStep?: Unit): void;
    /**
     * Returns whether to use second order differences for deciding when to reduce the step
     * size. i.e. whether to use change in change in energy as the criteria for accuracy.
     */
    get secondDiff(): boolean;
    /**
     * Returns the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     */
    get tolerance(): number;
    /**
     * Whether to use second order differences for deciding when to reduce the step size.
     * The first difference is the change in energy of the system over a time step.
     * We can only use first differences when the energy of the system is constant.
     * If the energy of the system changes over time, then we need to reduce the step size
     * until the change of energy over the step stabilizes.  Put another way:  we reduce
     * the step size until the change in the change in energy becomes small.
     * @param value  true means use *change in change in energy* (second derivative)
     * as the criteria for accuracy
     */
    set secondDiff(value: boolean);
    /**
     * Sets the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     * @param value the tolerance value for deciding if sufficient accuracy
     * has been achieved
     */
    set tolerance(value: number);
}
