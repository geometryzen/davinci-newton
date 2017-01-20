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

import Parameter from './Parameter';
import Subject from './Subject';
import toName from './toName';
import validName from './validName';

export class ParameterNumber implements Parameter {
    /**
     * the Subject which provides notification of changes in this Parameter
     */
    private subject_: Subject;
    private name_: string;
    private getter_: () => number;
    private setter_: (value: number) => any;
    private isComputed_: boolean;
    private signifDigits_: number;
    /**
     * Fixed number of fractional decimal places to show, or -1 if variable.
     */
    private decimalPlaces_: number;
    private lowerLimit_: number;
    private upperLimit_: number;
    private choices_: string[];
    private values_: number[];
    constructor(subject: Subject, name: string, getter: () => number, setter: (value: number) => any, choices?: string[], values?: number[]) {
        this.subject_ = subject;
        this.name_ = validName(toName(name));
        this.getter_ = getter;
        this.setter_ = setter;
        this.isComputed_ = false;
        this.signifDigits_ = 3;
        this.decimalPlaces_ = -1;
        this.lowerLimit_ = 0;
        this.upperLimit_ = Number.POSITIVE_INFINITY;
        this.choices_ = [];
        this.values_ = [];
    }

    getName(): string {
        return this.name_;
    }

    getSubject(): Subject {
        return this.subject_;
    }

    getValue(): number {
        return this.getter_();
    }

    nameEquals(name: string): boolean {
        return this.name_ === toName(name);
    }

    setComputed(value: boolean): void {
        this.isComputed_ = value;
    }

    /**
     * Sets the lower limit; the Parameter value is not allowed to be less than this,
     * {@link #setValue} will throw an Error in that case.
     * @param lowerLimit the lower limit of the Parameter value
     * @return this Parameter for chaining setters
     * @throws {Error} if the value is currently less than the lower limit, or the lower limit is not a number
     */
    setLowerLimit(lowerLimit: number): this {
        if (lowerLimit > this.getValue() || lowerLimit > this.upperLimit_)
            throw new Error('out of range');
        this.lowerLimit_ = lowerLimit;
        return this;
    }
}

export default ParameterNumber;
