import AdvanceStrategy from '../runner/AdvanceStrategy';
import DiffEqSolver from '../core/DiffEqSolver';
import MemoList from '../runner/MemoList';
import RigidBodySim from '../engine/RigidBodySim';

export class CollisionAdvance implements AdvanceStrategy {
    constructor(private sim_: RigidBodySim, private odeSolver_: DiffEqSolver) {
        // Do nothing yet.
    }
    advance(timeStep: number, memoList?: MemoList) {
        throw new Error("TODO: advance");
    }
    getTime(): number {
        return 0;
    }
    getTimeStep(): number {
        return 0;
    }
}

export default CollisionAdvance;
