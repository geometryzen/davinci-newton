import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
/**
 * @hidden
 */
var DefaultAdvanceStrategy = /** @class */ (function () {
    /**
     *
     */
    function DefaultAdvanceStrategy(simulation, solver) {
        this.simulation = simulation;
        this.solver = solver;
        mustBeNonNullObject('simulation', simulation);
        mustBeNonNullObject('solver', solver);
    }
    /**
     * 1. Update the state vector from bodies.
     * 2. The solver integrates the derivatives from the simulation.
     * 3. Compute system variables such as energies, linear momentum, and angular momentum.
     */
    DefaultAdvanceStrategy.prototype.advance = function (stepSize, uomStep) {
        mustBeNumber("stepSize", stepSize);
        this.simulation.prolog(stepSize, uomStep);
        this.solver.step(stepSize, uomStep);
        this.simulation.epilog(stepSize, uomStep);
    };
    return DefaultAdvanceStrategy;
}());
export { DefaultAdvanceStrategy };
