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

import SimObject from '../core/SimObject';
import Vector from '../math/Vector';
import VectorE3 from '../math/VectorE3';

/**
 * An object that has mass, position, velocity and a local coordinate system.
 */
export interface MassObject extends SimObject {
    /**
     * 
     */
    M: number;
    /**
     * Returns the world coordinates of the given body coordinates point,
     * based on current position of this object.
     */
    bodyToWorld(point: VectorE3): Vector;
    /**
     * Rotates a body coordinates vector to its orientation in world coordinates.
     */
    rotateBodyToWorld(body: VectorE3): Vector;
}

export default MassObject;
