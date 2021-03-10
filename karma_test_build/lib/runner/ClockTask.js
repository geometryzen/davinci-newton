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
exports.ClockTask = void 0;
/**
 *
 */
var ClockTask = /** @class */ (function () {
    /**
     *
     */
    function ClockTask(time_, callBack_) {
        this.time_ = time_;
        this.callBack_ = callBack_;
        /**
         *
         */
        this.timeoutID_ = NaN;
        // Do nothing yet.
    }
    /**
     * Cancels the scheduled execution of this task.
     */
    ClockTask.prototype.cancel = function () {
        if (isFinite(this.timeoutID_)) {
            clearTimeout(this.timeoutID_);
            this.timeoutID_ = NaN;
        }
    };
    /**
     * Returns the clock time in seconds when the task should be executed.
     */
    ClockTask.prototype.getTime = function () {
        return this.time_;
    };
    /**
     * Schedules the task to be executed after given time delay in seconds of system time.
     * @param delay time delay till execution in seconds of system time
     */
    ClockTask.prototype.schedule = function (delay) {
        this.cancel();
        var delay_ms = Math.round(delay * 1000);
        this.timeoutID_ = window.setTimeout(this.callBack_, delay_ms);
    };
    return ClockTask;
}());
exports.ClockTask = ClockTask;
exports.default = ClockTask;
