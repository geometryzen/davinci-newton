/**
 * @hidden
 */
export declare class ClockTask {
    private time_;
    private callBack_;
    /**
     *
     */
    private timeoutID_;
    /**
     *
     */
    constructor(time_: number, callBack_: () => any);
    /**
     * Cancels the scheduled execution of this task.
     */
    cancel(): void;
    /**
     * Returns the clock time in seconds when the task should be executed.
     */
    getTime(): number;
    /**
     * Schedules the task to be executed after given time delay in seconds of system time.
     * @param delay time delay till execution in seconds of system time
     */
    schedule(delay: number): void;
}
