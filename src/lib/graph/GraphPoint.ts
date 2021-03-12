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

/**
 * @hidden
 */
export class GraphPoint {
    constructor(public x: number, public y: number, public seqX: number, public seqY: number) {

    }

    /**
     * Returns whether this GraphPoint is identical to another GraphPoint
     * @param other the GraphPoint to compare with
     * @return `true` if this GraphPoint is identical to the other GraphPoint
     */
    equals(other: GraphPoint): boolean {
        return this.x === other.x && this.y === other.y && this.seqX === other.seqX && this.seqY === other.seqY;
    }

}
