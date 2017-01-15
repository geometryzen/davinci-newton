import AbstractSubject from '../util/AbstractSubject';
import ClockTask from './ClockTask';
import GenericEvent from '../util/GenericEvent';
import getSystemTime from '../util/getSystemTime';

export class Clock extends AbstractSubject {
    /**
     * When 'zero clock time' occurs, in system time, in seconds.
     */
    private clockStart_sys_secs_ = getSystemTime();
    private realStart_sys_secs_: number;
    /**
     * Whether clock time is advancing.
     */
    private isRunning_ = false;
    /**
     * Remembers clock time while clock is stopped, in seconds.
     */
    private saveTime_secs_ = 0;
    /**
     * Remembers the real time while clock is stopped, in seconds.
     */
    private saveRealTime_secs_ = 0;
    /**
     * Means we are currently in single-step mode: clock time has advanced even though clock is paused.
     */
    private stepMode_ = false;
    /**
     * 
     */
    private tasks_: ClockTask[] = [];
    /**
     * Rate at which clock time advances compared to system time.
     */
    private timeRate_ = 1;
    /**
     * 
     */
    static CLOCK_RESUME = 'CLOCK_RESUME';
    /**
     * 
     */
    constructor(name = 'CLOCK') {
        super(name);
        this.realStart_sys_secs_ = this.clockStart_sys_secs_;
    }
    /**
     * Called during *step mode*, this indicates that the client has advanced the Simulation to match the clock time.
     */
    clearStepMode() {
        this.stepMode_ = false;
    }

    getTime(): number {
        if (this.isRunning_) {
            return (getSystemTime() - this.clockStart_sys_secs_) * this.timeRate_;
        }
        else {
            return this.saveTime_secs_;
        }
    }
    /**
     * Resumes increasing clock time and real time.
     * Schedules all ClockTasks that should run at or after the current clock time.
     * Broadcasts a {@link #CLOCK_RESUME} event.
     */
    resume(): void {
        this.clearStepMode();
        if (!this.isRunning_) {
            this.isRunning_ = true;
            this.setTimePrivate(this.saveTime_secs_);
            this.setRealTime(this.saveRealTime_secs_);
            this.broadcast(new GenericEvent(this, Clock.CLOCK_RESUME));
        }
    }

    setTime(time: number): void {
        throw new Error("TODO");
    }
    /**
     * 
     */
    private setTimePrivate(time_secs: number) {
        if (this.isRunning_) {
            this.clockStart_sys_secs_ = getSystemTime() - time_secs / this.timeRate_;
            // schedule all ClockTasks
            this.tasks_.forEach((task) => { this.scheduleTask(task); });
        }
        else {
            this.saveTime_secs_ = time_secs;
        }
    }
    /**
     * 
     */
    private scheduleTask(task: ClockTask) {
        task.cancel();
        if (this.isRunning_) {
            // convert to system time to handle time rate other than 1.0
            const nowTime = this.clockToSystem(this.getTime());
            const taskTime = this.clockToSystem(task.getTime());
            if (taskTime >= nowTime) {
                task.schedule(taskTime - nowTime);
            }
        }
    }

    /**
     * Sets the real time to the given time in seconds.
     */
    setRealTime(time_secs: number): void {
        if (this.isRunning_) {
            this.realStart_sys_secs_ = getSystemTime() - time_secs / this.timeRate_;
        }
        else {
            this.saveRealTime_secs_ = time_secs;
        }
    }

    /** 
     * Converts clock time to system time.
     */
    clockToSystem(clockTime: number): number {
        return clockTime / this.timeRate_ + this.clockStart_sys_secs_;
    }
}

export default Clock;
