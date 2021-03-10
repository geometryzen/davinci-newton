import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { State } from './State';
/**
 * An example of how to wire together the various components.
 */
var Engine = /** @class */ (function () {
    function Engine(metric, dynamics) {
        this.contents = new State(metric, dynamics);
        var rk4 = new RungeKutta(this.contents);
        this.strategy = new DefaultAdvanceStrategy(this.contents, rk4);
    }
    return Engine;
}());
export { Engine };
