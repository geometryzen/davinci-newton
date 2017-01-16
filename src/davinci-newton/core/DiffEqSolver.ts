/**
 * 
 */
export interface DiffEqSolver {
    step(stepSize: number): void;
}

export default DiffEqSolver;
