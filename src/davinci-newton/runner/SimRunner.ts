import AdvanceStrategy from './AdvanceStrategy';
import Clock from './Clock';

export class SimRunner {
    private timeStep_: number;
    private clock_ = new Clock();
    constructor(private advanceStrategy_: AdvanceStrategy, name?: string) {
        this.timeStep_ = advanceStrategy_.getTimeStep();
    }
    private advanceToTargetTime(strategy: AdvanceStrategy, targetTime: number) {
        let simTime = strategy.getTime();
        while (simTime < targetTime) {
            // the AdvanceStrategy is what actually calls `memorize`
            strategy.advance(this.timeStep_, this);
            // Prevent infinite loop when time doesn't advance.
            const lastSimTime = simTime;
            simTime = strategy.getTime();
            if (simTime - lastSimTime <= 1e-15) {
                throw new Error('SimRunner time did not advance');
            }
            /*
            if (this.debugTiming_ && goog.DEBUG) {
              var clockTime = this.clock_.getTime();
              console.log(NF(strategy.getTime())
                +' now='+NF(clockTime)
                +' targetTime='+NF(targetTime)
                +' timeStep='+NF(this.timeStep_)
                );
            }
            */
        }
    }

    /**
     * 
     */
    update(): void {
        let clockTime = this.clock_.getTime();
        const simTime = this.advanceStrategy_.getTime();
        // If clockTime is VERY far ahead or behind of simTime, assume simTime was
        // intentionally modified. Match clock to simTime, but just a little ahead
        // by a timeStep so that the simulation advances.
        if (clockTime > simTime + 1 || clockTime < simTime - 1) {
            const t = simTime + this.timeStep_;
            this.clock_.setTime(t);
            this.clock_.setRealTime(t);
            clockTime = t;
        }
        const startTime = clockTime;
        // If sim reaches almost current clock time, that is good enough.
        const targetTime = startTime - this.timeStep_ / 10;
        this.advanceToTargetTime(this.advanceStrategy_, targetTime);
    }
    /**
     * 
     */
    memorize(): void {
        throw new Error("SimRunner.memorize()");
    }
}

export default SimRunner;
