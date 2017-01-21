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

export class EnergyInfo {
    constructor(private readonly potential_: number, private readonly translational_: number, public readonly rotational_: number) {
        if (isNaN(potential_)) {
            throw new Error(`potential energy ${potential_} must be a number.`);
        }
        if (isNaN(translational_)) {
            throw new Error(`translational energy ${translational_} must be a number.`);
        }
        if (isNaN(rotational_)) {
            throw new Error(`rotational energy ${rotational_} must be a number.`);
        }
    }
    getPotential(): number {
        return this.potential_;
    }
    getTranslational(): number {
        return this.translational_;
    }
    getRotational(): number {
        return this.rotational_;
    }
    getTotalEnergy(): number {
        return this.potential_ + this.translational_ + this.rotational_;
    }
}

export default EnergyInfo;
