import { DiffEqSolver } from '../core/DiffEqSolver';
import { Simulation } from '../core/Simulation';
import { Unit } from '../math/Unit';
/**
 *
 */
export declare class EulerMethod implements DiffEqSolver {
    private sim_;
    private inp_;
    private k1_;
    /**
     *
     */
    constructor(sim_: Simulation);
    step(stepSize: number, uomStep?: Unit): void;
}
