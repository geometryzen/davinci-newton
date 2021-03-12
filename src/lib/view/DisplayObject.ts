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

import { CoordMap } from './CoordMap';

/**
 * @hidden 
 */
export interface DisplayObject {
    /**
     * 
     */
    draw(context: CanvasRenderingContext2D, coordMap: CoordMap): void;

    /**
     * Sets the z-index which specifies front-to-back ordering of objects;
     * objects with a higher zIndex are drawn over (in front of) objects with a lower zIndex.
     * @return the zIndex of this DisplayObject
     */
    getZIndex(): number;

    /**
     * Sets the z-index which specifies front-to-back ordering of objects;
     * objects with a higher zIndex are drawn over objects with a lower zIndex.
     * Default is zero.
     * @param {number|undefined} zIndex the zIndex of this DisplayObject
     */
    setZIndex(zIndex?: number): void;
}
