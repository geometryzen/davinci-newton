/**
 * 
 */
export class ClockTask {

    /**
     * 
     */
    private timeoutID_ = NaN;

    /**
     * 
     */
    constructor(private time_: number, private callBack_: () => any) {
        // Do nothing yet.
    }

    /** 
     * Cancels the scheduled execution of this task.
     */
    cancel(): void {
        if (isFinite(this.timeoutID_)) {
            clearTimeout(this.timeoutID_);
            this.timeoutID_ = NaN;
        }
    }

    /**
     * Returns the clock time in seconds when the task should be executed.
     */
    getTime() {
        return this.time_;
    }

    /** 
     * Schedules the task to be executed after given time delay in seconds of system time.
     * @param delay time delay till execution in seconds of system time
     */
    schedule(delay: number) {
        this.cancel();
        const delay_ms = Math.round(delay * 1000);
        this.timeoutID_ = window.setTimeout(this.callBack_, delay_ms);
    }
}

export default ClockTask;
