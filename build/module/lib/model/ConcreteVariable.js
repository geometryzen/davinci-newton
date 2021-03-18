// Copyright 2017-2021 David Holmes.  All Rights Reserved.
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
import { Unit } from '../math/Unit';
import toName from '../util/toName';
import validName from '../util/validName';
/**
 * @hidden
 */
var ConcreteVariable = /** @class */ (function () {
    /**
     *
     */
    function ConcreteVariable(varsList_, name) {
        this.varsList_ = varsList_;
        /**
         *
         */
        this.$value = 0;
        /**
         *
         */
        this.$uom = Unit.ONE;
        /**
         * Sequence numbers, to detect discontinuity in a variable.
         */
        this.seq_ = 0;
        /**
         *
         */
        this.isComputed_ = false;
        /**
         *
         */
        this.doesBroadcast_ = false;
        this.name_ = validName(toName(name));
    }
    ConcreteVariable.prototype.getBroadcast = function () {
        return this.doesBroadcast_;
    };
    Object.defineProperty(ConcreteVariable.prototype, "name", {
        /**
         *
         */
        get: function () {
            return this.name_;
        },
        enumerable: false,
        configurable: true
    });
    ConcreteVariable.prototype.getSequence = function () {
        return this.seq_;
    };
    /**
     *
     */
    ConcreteVariable.prototype.getSubject = function () {
        return this.varsList_;
    };
    /**
     *
     */
    ConcreteVariable.prototype.getValue = function () {
        return this.$value;
    };
    ConcreteVariable.prototype.getUnit = function () {
        return this.$uom;
    };
    ConcreteVariable.prototype.nameEquals = function (name) {
        return this.name_ === toName(name);
    };
    ConcreteVariable.prototype.setBroadcast = function (value) {
        this.doesBroadcast_ = value;
    };
    ConcreteVariable.prototype.setComputed = function (value) {
        this.isComputed_ = value;
    };
    Object.defineProperty(ConcreteVariable.prototype, "isComputed", {
        get: function () {
            return this.isComputed_;
        },
        enumerable: false,
        configurable: true
    });
    ConcreteVariable.prototype.setUnit = function (uom) {
        this.$uom = uom;
    };
    /**
     *
     */
    ConcreteVariable.prototype.setValueJump = function (value) {
        if (this.$value !== value) {
            this.$value = value;
            this.seq_++;
            if (this.doesBroadcast_) {
                this.varsList_.broadcast(this);
            }
        }
    };
    ConcreteVariable.prototype.setValueContinuous = function (value) {
        this.$value = value;
    };
    /**
     *
     */
    ConcreteVariable.prototype.incrSequence = function () {
        this.seq_++;
    };
    return ConcreteVariable;
}());
export { ConcreteVariable };
