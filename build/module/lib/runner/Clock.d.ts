import AbstractSubject from '../util/AbstractSubject';
export declare class Clock extends AbstractSubject {
    /**
     * When 'zero clock time' occurs, in system time, in seconds.
     */
    private clockStart_sys_secs_;
    /**
     * Whether clock time is advancing.
     */
    private isRunning_;
    /**
     * Remembers clock time while clock is stopped, in seconds.
     */
    private saveTime_secs_;
    /**
     * Remembers the real time while clock is stopped, in seconds.
     */
    private saveRealTime_secs_;
    /**
     * Means we are currently in single-step mode: clock time has advanced even though clock is paused.
     */
    /**
     *
     */
    private tasks_;
    /**
     * Rate at which clock time advances compared to system time.
     */
    private timeRate_;
    /**
     *
     */
    static CLOCK_RESUME: string;
    /**
     *
     */
    static CLOCK_SET_TIME: string;
    /**
     *
     */
    constructor();
    /**
     * Called during *step mode*, this indicates that the client has advanced the Simulation to match the clock time.
     */
    clearStepMode(): void;
    getTime(): number;
    /**
     * Resumes increasing clock time and real time.
     * Schedules all ClockTasks that should run at or after the current clock time.
     * Broadcasts a {@link #CLOCK_RESUME} event.
     */
    resume(): void;
    /**
     *
     */
    setTime(time_secs: number): void;
    /**
     *
     */
    private setTimePrivate;
    /**
     *
     */
    private scheduleAllClockTasks;
    /**
     *
     */
    private scheduleTask;
    /**
     * Sets the real time to the given time in seconds.
     */
    setRealTime(time_secs: number): void;
    /**
     * Converts clock time to system time.
     */
    clockToSystem(clockTime: number): number;
}
export default Clock;
