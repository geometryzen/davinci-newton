import { DiffEqSolver } from '../core/DiffEqSolver';
import { Simulation } from '../core/Simulation';
import { Unit } from '../math/Unit';
/**
 *
 */
export declare class ModifiedEuler implements DiffEqSolver {
    private sim_;
    private inp_;
    private k1_;
    private k2_;
    /**
     *
     */
    constructor(sim_: Simulation);
    step(stepSize: number, uomStep?: Unit): void;
}
