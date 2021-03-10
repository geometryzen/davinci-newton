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
import { __extends } from "tslib";
import AbstractSubject from '../util/AbstractSubject';
import GenericEvent from '../util/GenericEvent';
import insertAt from '../util/insertAt';
import isObject from '../checks/isObject';
/**
 * Displays a set of DisplayObject(s)}, which show the state of the simulation.
 * A DisplayObject typically represents a SimObject, but not always.
 *
 * zzIndex
 * ------
 * DisplayObjects with a lower `zIndex` appear underneath those with higher `zIndex`.
 * The DisplayList is sorted by `zIndex`.
 */
var DisplayList = /** @class */ (function (_super) {
    __extends(DisplayList, _super);
    /**
     *
     */
    function DisplayList() {
        var _this = _super.call(this) || this;
        /**
         *
         */
        _this.drawables_ = [];
        return _this;
    }
    /**
     * Adds the DisplayObject, inserting it at the end of the group of DisplayObjects
     * with the same zIndex; the item will appear visually over objects that have
     * the same (or lower) `zIndex`.
     * @param dispObj the DisplayObject to add
     */
    DisplayList.prototype.add = function (dispObj) {
        if (!isObject(dispObj)) {
            throw new Error('non-object passed to DisplayList.add');
        }
        var zIndex = dispObj.getZIndex();
        this.sort();
        // Objects in drawables_ array should be sorted by zIndex.
        // Starting at front of drawables_ array, find the object with bigger
        // zIndex, insert dispObj just before that object.
        var iLen = this.drawables_.length;
        var i = 0;
        for (i = 0; i < iLen; i++) {
            var z = this.drawables_[i].getZIndex();
            if (zIndex < z) {
                break;
            }
        }
        insertAt(this.drawables_, dispObj, i);
        this.broadcast(new GenericEvent(this, DisplayList.OBJECT_ADDED, dispObj));
    };
    /**
     * Draws the DisplayObjects in order, which means that DisplayObjects drawn later (at
     * the end of the list) will appear to be on top of those drawn earlier (at start of the list).
     * @param context the canvas's context to draw this object into
     * @param map the mapping to use for translating between simulation and screen coordinates
     */
    DisplayList.prototype.draw = function (context, coordMap) {
        this.sort();
        var ds = this.drawables_;
        var N = ds.length;
        for (var i = 0; i < N; i++) {
            ds[i].draw(context, coordMap);
        }
    };
    /**
     * Adds the DisplayObject, inserting it at the front of the group of DisplayObjects
     * with the same zIndex; the item will appear visually under objects that have
     * the same (or higher) `zIndex`.
     * @param dispObj the DisplayObject to prepend
     */
    DisplayList.prototype.prepend = function (dispObj) {
        if (!isObject(dispObj)) {
            throw new Error('non-object passed to DisplayList.add');
        }
        var zIndex = dispObj.getZIndex();
        this.sort();
        // Objects in drawables_ array should be sorted by zIndex.
        // Starting at back of drawables_ array, find the object with smaller
        // zIndex, insert dispObj just after that object.
        var N = this.drawables_.length;
        var i = N;
        for (i = N; i > 0; i--) {
            var z = this.drawables_[i - 1].getZIndex();
            if (zIndex > z) {
                break;
            }
        }
        insertAt(this.drawables_, dispObj, i);
        this.broadcast(new GenericEvent(this, DisplayList.OBJECT_ADDED, dispObj));
    };
    DisplayList.prototype.sort = function () {
        // TODO: sort display objects
    };
    /**
     * Name of event broadcast when a DisplayObject is added.
     */
    DisplayList.OBJECT_ADDED = 'OBJECT_ADDED';
    /**
     * Name of event broadcast when a DisplayObject is removed.
     */
    DisplayList.OBJECT_REMOVED = 'OBJECT_REMOVED';
    return DisplayList;
}(AbstractSubject));
export { DisplayList };
export default DisplayList;
