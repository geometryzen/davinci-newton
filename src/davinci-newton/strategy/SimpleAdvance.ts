import AdvanceStrategy from '../runner/AdvanceStrategy';
import DiffEqSolver from '../core/DiffEqSolver';
import MemoList from '../runner/MemoList';
import Simulation from '../core/Simulation';

export class SimpleAdvance implements AdvanceStrategy {
    private timeStep_ = 0.025;
    constructor(private sim_: Simulation, private odeSolver_: DiffEqSolver) {
        // Do nothing yet.
    }
    advance(timeStep: number, memoList?: MemoList) {
        this.sim_.getSimList().removeTemporary(this.sim_.getTime());
        var err = this.odeSolver_.step(timeStep);
        if (err != null) {
            throw new Error('error during advance ' + err);
        }
        this.sim_.modifyObjects();
        if (memoList !== undefined) {
            memoList.memorize();
        }
    }
    getTime(): number {
        return this.sim_.getTime();
    }
    getTimeStep(): number {
        return this.timeStep_;
    }
}

export default SimpleAdvance;
