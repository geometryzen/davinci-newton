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

import CoordMap from './CoordMap';
import DisplayList from './DisplayList';
import DoubleRect from './DoubleRect';
import ScreenRect from './ScreenRect';
import Memorizable from '../util/Memorizable';

export interface LabView extends Memorizable {
    /**
     * Called when this LabView becomes the focus view of the LabCanvas.
     */
    gainFocus(): void;

    /**
     * Returns the CoordMap used by this LabView.
     */
    getCoordMap(): CoordMap;

    /**
     * Returns the DisplayList of this LabView.
     */
    getDisplayList(): DisplayList;

    /**
     * Returns the screen rectangle that this LabView is occupying within the
     * LabCanvas, in screen coordinates.
     */
    getScreenRect(): ScreenRect;

    /**
     * Returns the bounding rectangle for this LabView in simulation coordinates.
     */
    getSimRect(): DoubleRect;

    /**
     * Called when this LabView is no longer the focus view of the LabCanvas.
     */
    loseFocus(): void;

    /**
     * Paints this LabView into the given CanvasRenderingContext2D.
     * @param context the canvas's context to draw into
     */
    paint(context: CanvasRenderingContext2D): void;

    /**
     * Sets the CoordMap used by this LabView.
     * @param map the CoordMap to use for this LabView
     */
    setCoordMap(map: CoordMap): void;

    /**
     * Sets the area that this LabView will occupy within the LabCanvas,
     * in screen coordinates.
     * @param sreenRect the screen coordinates of the area this LabView should occupy
     */
    setScreenRect(screenRect: ScreenRect): void;

    /**
     * Sets the bounding rectangle for this LabView, ensures this rectangle
     * is visible, and turns off auto-scaling. The result is to generate a new CoordMap for
     * this SimView so that the simulation rectangle maps to the current screen rectangle.
     * @param simRect the bounding rectangle for this
     * LabView in simulation coordinates.
     */
    setSimRect(simRect: DoubleRect): void;
}

export default LabView;
