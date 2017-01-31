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

import AbstractSubject from '../util/AbstractSubject';
import CoordMap from './CoordMap';
import DisplayObject from './DisplayObject';
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
export class DisplayList extends AbstractSubject {

    /**
     * Name of event broadcast when a DisplayObject is added.
     */
    public static readonly OBJECT_ADDED = 'OBJECT_ADDED';

    /**
     * Name of event broadcast when a DisplayObject is removed.
     */
    public static readonly OBJECT_REMOVED = 'OBJECT_REMOVED';

    /**
     * 
     */
    private readonly drawables_: DisplayObject[] = [];
    /**
     * 
     */
    constructor() {
        super();
    }

    /**
     * Adds the DisplayObject, inserting it at the end of the group of DisplayObjects
     * with the same zIndex; the item will appear visually over objects that have
     * the same (or lower) `zIndex`.
     * @param dispObj the DisplayObject to add
     */
    add(dispObj: DisplayObject): void {
        if (!isObject(dispObj)) {
            throw new Error('non-object passed to DisplayList.add');
        }
        const zIndex = dispObj.getZIndex();
        this.sort();
        // Objects in drawables_ array should be sorted by zIndex.
        // Starting at front of drawables_ array, find the object with bigger
        // zIndex, insert dispObj just before that object.
        for (var i = 0, n = this.drawables_.length; i < n; i++) {
            const z = this.drawables_[i].getZIndex();
            if (zIndex < z) {
                break;
            }
        }
        insertAt(this.drawables_, dispObj, i);
        this.broadcast(new GenericEvent(this, DisplayList.OBJECT_ADDED, dispObj));
    }

    /**
     * Draws the DisplayObjects in order, which means that DisplayObjects drawn later (at
     * the end of the list) will appear to be on top of those drawn earlier (at start of the list).
     * @param context the canvas's context to draw this object into
     * @param map the mapping to use for translating between simulation and screen coordinates
     */
    draw(context: CanvasRenderingContext2D, coordMap: CoordMap) {
        this.sort();
        const ds = this.drawables_;
        const N = ds.length;
        for (let i = 0; i < N; i++) {
            ds[i].draw(context, coordMap);
        }
    }

    /**
     * Adds the DisplayObject, inserting it at the front of the group of DisplayObjects
     * with the same zIndex; the item will appear visually under objects that have
     * the same (or higher) `zIndex`.
     * @param dispObj the DisplayObject to prepend
     */
    prepend(dispObj: DisplayObject): void {
        if (!isObject(dispObj)) {
            throw new Error('non-object passed to DisplayList.add');
        }
        const zIndex = dispObj.getZIndex();
        this.sort();
        // Objects in drawables_ array should be sorted by zIndex.
        // Starting at back of drawables_ array, find the object with smaller
        // zIndex, insert dispObj just after that object.
        const N = this.drawables_.length;
        for (var i = N; i > 0; i--) {
            const z = this.drawables_[i - 1].getZIndex();
            if (zIndex > z) {
                break;
            }
        }
        insertAt(this.drawables_, dispObj, i);
        this.broadcast(new GenericEvent(this, DisplayList.OBJECT_ADDED, dispObj));
    }

    private sort(): void {
        // TODO: sort display objects
    }

}

export default DisplayList;
