import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { ConstantEnergySolver } from '../solvers/ConstantEnergySolver';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { DiffEqSolver } from './DiffEqSolver';
import { Dynamics } from './Dynamics';
import { Metric } from './Metric';
import { State } from './State';

export class Engine<T> {
    public readonly contents: State<T>;
    public readonly strategy: AdvanceStrategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>) {
        this.contents = new State(metric, dynamics);
        const rk4: DiffEqSolver = new RungeKutta(this.contents);
        const solver: DiffEqSolver = new ConstantEnergySolver(this.contents, this.contents, rk4, metric);
        this.strategy = new DefaultAdvanceStrategy(this.contents, solver);
    }
}
