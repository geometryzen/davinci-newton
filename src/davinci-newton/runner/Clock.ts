import AbstractSubject from '../util/AbstractSubject';
import getSystemTime from '../util/getSystemTime';

export class Clock extends AbstractSubject {
    /**
     * When 'zero clock time' occurs, in system time, in seconds.
     */
    private clockStart_sys_secs_ = getSystemTime();
    /**
     * Whether clock time is advancing.
     */
    private isRunning_ = false;
    /**
     * Remembers clock time while clock is stopped, in seconds.
     */
    private saveTime_secs_ = 0;
    /**
     * Rate at which clock time advances compared to system time.
     */
    private timeRate_ = 1;
    /**
     * 
     */
    constructor(name = 'CLOCK') {
        super(name);
    }
    getTime(): number {
        if (this.isRunning_) {
            return (getSystemTime() - this.clockStart_sys_secs_) * this.timeRate_;
        } else {
            return this.saveTime_secs_;
        }
    }
    setTime(time: number): void {
        throw new Error("TODO");
    }
    setRealTime(time: number): void {
        throw new Error("TODO");
    }
}

export default Clock;
