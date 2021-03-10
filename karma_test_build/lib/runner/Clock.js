"use strict";
// Copyright 2017 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
var tslib_1 = require("tslib");
var AbstractSubject_1 = require("../util/AbstractSubject");
var GenericEvent_1 = require("../util/GenericEvent");
var getSystemTime_1 = require("../util/getSystemTime");
var Clock = /** @class */ (function (_super) {
    tslib_1.__extends(Clock, _super);
    /**
     *
     */
    function Clock() {
        var _this = _super.call(this) || this;
        /**
         * When 'zero clock time' occurs, in system time, in seconds.
         */
        _this.clockStart_sys_secs_ = getSystemTime_1.default();
        // private realStart_sys_secs_: number;
        /**
         * Whether clock time is advancing.
         */
        _this.isRunning_ = false;
        /**
         * Remembers clock time while clock is stopped, in seconds.
         */
        _this.saveTime_secs_ = 0;
        /**
         * Remembers the real time while clock is stopped, in seconds.
         */
        _this.saveRealTime_secs_ = 0;
        /**
         * Means we are currently in single-step mode: clock time has advanced even though clock is paused.
         */
        // private stepMode_ = false;
        /**
         *
         */
        _this.tasks_ = [];
        /**
         * Rate at which clock time advances compared to system time.
         */
        _this.timeRate_ = 1;
        return _this;
        // this.realStart_sys_secs_ = this.clockStart_sys_secs_;
    }
    /**
     * Called during *step mode*, this indicates that the client has advanced the Simulation to match the clock time.
     */
    Clock.prototype.clearStepMode = function () {
        // this.stepMode_ = false;
    };
    Clock.prototype.getTime = function () {
        if (this.isRunning_) {
            return (getSystemTime_1.default() - this.clockStart_sys_secs_) * this.timeRate_;
        }
        else {
            return this.saveTime_secs_;
        }
    };
    /**
     * Resumes increasing clock time and real time.
     * Schedules all ClockTasks that should run at or after the current clock time.
     * Broadcasts a {@link #CLOCK_RESUME} event.
     */
    Clock.prototype.resume = function () {
        this.clearStepMode();
        if (!this.isRunning_) {
            this.isRunning_ = true;
            this.setTimePrivate(this.saveTime_secs_);
            this.setRealTime(this.saveRealTime_secs_);
            this.broadcast(new GenericEvent_1.default(this, Clock.CLOCK_RESUME));
        }
    };
    /**
     *
     */
    Clock.prototype.setTime = function (time_secs) {
        this.setTimePrivate(time_secs);
        this.broadcast(new GenericEvent_1.default(this, Clock.CLOCK_SET_TIME));
    };
    /**
     *
     */
    Clock.prototype.setTimePrivate = function (time_secs) {
        if (this.isRunning_) {
            this.clockStart_sys_secs_ = getSystemTime_1.default() - time_secs / this.timeRate_;
            this.scheduleAllClockTasks();
        }
        else {
            this.saveTime_secs_ = time_secs;
        }
    };
    /**
     *
     */
    Clock.prototype.scheduleAllClockTasks = function () {
        var _this = this;
        this.tasks_.forEach(function (task) { _this.scheduleTask(task); });
    };
    /**
     *
     */
    Clock.prototype.scheduleTask = function (task) {
        task.cancel();
        if (this.isRunning_) {
            // convert to system time to handle time rate other than 1.0
            var nowTime = this.clockToSystem(this.getTime());
            var taskTime = this.clockToSystem(task.getTime());
            if (taskTime >= nowTime) {
                task.schedule(taskTime - nowTime);
            }
        }
    };
    /**
     * Sets the real time to the given time in seconds.
     */
    Clock.prototype.setRealTime = function (time_secs) {
        if (this.isRunning_) {
            // this.realStart_sys_secs_ = getSystemTime() - time_secs / this.timeRate_;
        }
        else {
            this.saveRealTime_secs_ = time_secs;
        }
    };
    /**
     * Converts clock time to system time.
     */
    Clock.prototype.clockToSystem = function (clockTime) {
        return clockTime / this.timeRate_ + this.clockStart_sys_secs_;
    };
    /**
     *
     */
    Clock.CLOCK_RESUME = 'CLOCK_RESUME';
    /**
     *
     */
    Clock.CLOCK_SET_TIME = 'CLOCK_SET_TIME';
    return Clock;
}(AbstractSubject_1.default));
exports.Clock = Clock;
exports.default = Clock;