import DiffEqSolver from '../core/DiffEqSolver';
import Simulation from '../core/Simulation';
import { Unit } from '../math/Unit';
import { EnergySystem } from './EnergySystem';

export class AdaptiveStepSolver implements DiffEqSolver {
    private diffEq_: Simulation;
    private energySystem_: EnergySystem;
    private odeSolver_: DiffEqSolver;
    private totSteps_: number;
    private secondDiff_: boolean;
    private savedState: number[];
    public stepUBound = 1;
    /**
     * The smallest time step that will executed.
     * Setting a reasonable lower bound prevents the solver from taking too long to give up.
     */
    public stepLBound = 1E-5;
    /**
     * enables debug code for particular test
     */
    private tolerance_: number;
    constructor(diffEq: Simulation, energySystem: EnergySystem, diffEqSolver: DiffEqSolver) {
        this.diffEq_ = diffEq;
        this.energySystem_ = energySystem;
        this.odeSolver_ = diffEqSolver;
        this.totSteps_ = 0;
        this.secondDiff_ = true;
        this.tolerance_ = 1E-6;
    }
    step(stepSize: number, uomStep?: Unit): void {
        // save the vars in case we need to back up and start again
        this.savedState = this.diffEq_.getState();
        const startTime = this.diffEq_.time;
        /**
         * 
         */
        let d_t = stepSize; // d_t = our smaller step size
        /**
         * number of diffEqSolver steps taken during this step
         */
        let steps = 0;
        this.diffEq_.epilog(); // to ensure getEnergyInfo gives correct value
        const startEnergy: number = this.energySystem_.totalEnergy().a;
        let lastEnergyDiff = Number.POSITIVE_INFINITY;
        /**
         * the value we are trying to reduce to zero
         */
        let value = Number.POSITIVE_INFINITY;
        let firstTime = true;
        if (stepSize < this.stepLBound) {
            return;
        }
        do {
            let t = startTime;  // t = current time
            if (!firstTime) {
                // restore state and solve again with smaller step size
                this.diffEq_.setState(this.savedState);
                this.diffEq_.epilog();
                // goog.asserts.assert(Math.abs(this.diffEq_.time - startTime) < 1E-12);
                // const e = this.energySystem_.totalEnergy();
                // goog.asserts.assert(Math.abs(e - startEnergy) < 1E-10);
                d_t = d_t / 5;  // reduce step size
                if (d_t < this.stepLBound) {
                    throw new Error(`time step ${d_t} too small. startEnergy => ${startEnergy} lastEnergyDiff => ${lastEnergyDiff}`);
                }
            }
            steps = 0;  // only count steps of the last iteration
            // take multiple steps of size d_t to equal the entire requested stepSize
            while (t < startTime + stepSize) {
                let h = d_t;
                // if this step takes us past the end of the overall step, then shorten it
                if (t + h > startTime + stepSize - 1E-10) {
                    h = startTime + stepSize - t;
                }
                steps++;
                this.odeSolver_.step(h, uomStep);
                this.diffEq_.epilog();
                t += h;
            }
            const finishEnergy: number = this.energySystem_.totalEnergy().a;
            const energyDiff = Math.abs(startEnergy - finishEnergy);
            if (this.secondDiff_) {
                // reduce time step until change in energy stabilizes
                // (i.e. change in change in energy goes to zero)
                if (!firstTime) {
                    value = Math.abs(energyDiff - lastEnergyDiff);
                }
            }
            else {
                // reduce time step until change in energy goes to zero
                value = energyDiff;
            }
            lastEnergyDiff = energyDiff;
            firstTime = false;
        } while (value > this.tolerance_);
        this.totSteps_ += steps;
    }

    /**
     * Returns whether to use second order differences for deciding when to reduce the step
     * size. i.e. whether to use change in change in energy as the criteria for accuracy.
     */
    get secondDiff(): boolean {
        return this.secondDiff_;
    }

    /**
     * Returns the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     */
    get tolerance(): number {
        return this.tolerance_;
    }

    /**
     * Whether to use second order differences for deciding when to reduce the step size.
     * The first difference is the change in energy of the system over a time step.
     * We can only use first differences when the energy of the system is constant.
     * If the energy of the system changes over time, then we need to reduce the step size
     * until the change of energy over the step stabilizes.  Put another way:  we reduce
     * the step size until the change in the change in energy becomes small.
     * @param value  true means use *change in change in energy* (second derivative)
     * as the criteria for accuracy
     */
    set secondDiff(value: boolean) {
        this.secondDiff_ = value;
    }

    /**
     * Sets the tolerance used to decide if sufficient accuracy has been achieved.
     * Default is 1E-6.
     * @param value the tolerance value for deciding if sufficient accuracy
     * has been achieved
     */
    set tolerance(value: number) {
        this.tolerance_ = value;
    }
}
