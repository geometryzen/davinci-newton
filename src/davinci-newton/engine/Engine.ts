import { DiffEqSolver } from '../core/DiffEqSolver';
import { Dynamics } from '../core/Dynamics';
import AdvanceStrategy from '../runner/AdvanceStrategy';
import { ConstantEnergySolver } from '../solvers/ConstantEnergySolver';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { Measure } from './Measure';
import { State } from './State';

export class Engine<T> {
    public readonly contents: State<T>;
    public readonly strategy: AdvanceStrategy;
    constructor(metric: Measure<T>, dynamics: Dynamics<T>) {
        this.contents = new State(metric, dynamics);
        const rk4: DiffEqSolver = new RungeKutta(this.contents);
        const solver: DiffEqSolver = new ConstantEnergySolver(this.contents, this.contents, rk4, metric);
        this.strategy = new DefaultAdvanceStrategy(this.contents, solver);
    }
}
