/**
 * An adaptive step solver that adjusts the step size in order to
 * ensure that the energy change be less than a tolerance amount.
 * @hidden
 */
var ConstantEnergySolver = /** @class */ (function () {
    /**
     * Constructs an adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     */
    function ConstantEnergySolver(simulation, energySystem, solverMethod) {
        this.simulation = simulation;
        this.stepUpperBound = 1;
        /**
         * The smallest time step that will executed.
         * Setting a reasonable lower bound prevents the solver from taking too long to give up.
         */
        this.stepLowerBound = 1E-5;
        /**
         *
         */
        this.tolerance_ = 1E-6;
        this.energySystem_ = energySystem;
        this.solverMethod_ = solverMethod;
        // this.totSteps_ = 0;
    }
    ConstantEnergySolver.prototype.step = function (Δt, uomTime) {
        // save the vars in case we need to back up and start again
        this.savedState = this.simulation.getState();
        var startTime = this.simulation.time;
        /**
         * The adapted step size.
         */
        var adaptedStepSize = Δt; // adaptedStepSize = our smaller step size
        /**
         * number of diffEqSolver steps taken during this step
         */
        // let steps = 0;
        this.simulation.epilog(); // to ensure getEnergyInfo gives correct value
        var metric = this.energySystem_.metric;
        var startEnergy = metric.a(this.energySystem_.totalEnergy());
        // let lastEnergyDiff = Number.POSITIVE_INFINITY;
        /**
         * the value we are trying to reduce to zero
         */
        var value = Number.POSITIVE_INFINITY;
        var firstTime = true;
        if (Δt < this.stepLowerBound) {
            return;
        }
        do {
            var t = startTime; // t = current time
            if (!firstTime) {
                // restore state and solve again with smaller step size
                this.simulation.setState(this.savedState);
                this.simulation.epilog();
                // goog.asserts.assert(Math.abs(this.simulation_.time - startTime) < 1E-12);
                // const e = this.energySystem_.totalEnergy();
                // goog.asserts.assert(Math.abs(e - startEnergy) < 1E-10);
                adaptedStepSize = adaptedStepSize / 5; // reduce step size
                if (adaptedStepSize < this.stepLowerBound) {
                    throw new Error("Unable to achieve tolerance " + this.tolerance + " with stepLowerBound " + this.stepLowerBound);
                }
            }
            // steps = 0;  // only count steps of the last iteration
            // take multiple steps of size adaptedStepSize to equal the entire requested stepSize
            while (t < startTime + Δt) {
                var h = adaptedStepSize;
                // if this step takes us past the end of the overall step, then shorten it
                if (t + h > startTime + Δt - 1E-10) {
                    h = startTime + Δt - t;
                }
                // steps++;
                this.solverMethod_.step(h, uomTime);
                this.simulation.epilog();
                t += h;
            }
            var finishEnergy = metric.a(this.energySystem_.totalEnergy());
            var energyDiff = Math.abs(startEnergy - finishEnergy);
            // reduce time step until change in energy goes to zero.
            value = energyDiff;
            // lastEnergyDiff = energyDiff;
            firstTime = false;
        } while (value > this.tolerance_);
        // this.totSteps_ += steps;
    };
    Object.defineProperty(ConstantEnergySolver.prototype, "tolerance", {
        /**
         * Returns the tolerance used to decide if sufficient accuracy has been achieved.
         * Default is 1E-6.
         */
        get: function () {
            return this.tolerance_;
        },
        /**
         * Sets the tolerance used to decide if sufficient accuracy has been achieved.
         * Default is 1E-6.
         * @param value the tolerance value for deciding if sufficient accuracy
         * has been achieved
         */
        set: function (value) {
            this.tolerance_ = value;
        },
        enumerable: false,
        configurable: true
    });
    return ConstantEnergySolver;
}());
export { ConstantEnergySolver };
