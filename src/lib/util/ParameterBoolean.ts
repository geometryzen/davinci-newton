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

import { Parameter } from './Parameter';
import { Subject } from './Subject';
import toName from './toName';
import validName from './validName';

/**
 * @hidden
 */
export class ParameterBoolean implements Parameter {
    private subject_: Subject;
    private name_: string;
    // private getter_: () => boolean;
    // private setter_: (value: boolean) => any;
    // private isComputed_: boolean;
    // private choices_: string[];
    // private values_: boolean[];
    constructor(subject: Subject, name: string, getter: () => boolean, setter: (value: boolean) => any, choices?: string[], values?: boolean[]) {
        this.subject_ = subject;
        this.name_ = validName(toName(name));
        // this.getter_ = getter;
        // this.setter_ = setter;
        // this.isComputed_ = false;
        // this.choices_ = [];
        // this.values_ = [];
    }
    get name(): string {
        return this.name_;
    }
    getSubject(): Subject {
        return this.subject_;
    }
    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }
    setComputed(value: boolean): void {
        // this.isComputed_ = value;
    }
}
