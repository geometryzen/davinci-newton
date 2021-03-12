import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { DiffEqSolver } from './DiffEqSolver';
import { Dynamics } from './Dynamics';
import { Metric } from './Metric';
import { Physics } from './Physics';

/**
 * An example of how to wire together the various components.
 * @hidden
 */
export class Engine<T> {
    public readonly contents: Physics<T>;
    public readonly strategy: AdvanceStrategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>) {
        this.contents = new Physics(metric, dynamics);
        const rk4: DiffEqSolver = new RungeKutta(this.contents);
        this.strategy = new DefaultAdvanceStrategy(this.contents, rk4);
    }
}
