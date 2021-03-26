(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.NEWTON = {}));
}(this, (function (exports) { 'use strict';

    /**
     * @hidden
     */
    var Newton = /** @class */ (function () {
        /**
         *
         */
        function Newton() {
            this.GITHUB = 'https://github.com/geometryzen/davinci-newton';
            this.LAST_MODIFIED = '2021-03-25';
            this.NAMESPACE = 'NEWTON';
            this.VERSION = '1.0.77';
        }
        Newton.prototype.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            // This should allow us to unit test and run in environments without a console.
            console.log(message);
        };
        Newton.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            // This should allow us to unit test and run in environments without a console.
            console.log(message);
        };
        Newton.prototype.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            // This should allow us to unit test and run in environments without a console.
            console.warn(message);
        };
        Newton.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            // This should allow us to unit test and run in environments without a console.
            console.error(message);
        };
        return Newton;
    }());
    /**
     * @hidden
     */
    var config = new Newton();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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
    /**
     * The coordinate frame that is fixed in relation to the rigid body.
     * @hidden
     */
    var LOCAL = 0;
    /**
     * The coordinate frame used as the basis for position and attitude of all bodies.
     * @hidden
     */
    var WORLD = 1;

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
    /**
     * @hidden
     */
    var AbstractSimObject = /** @class */ (function () {
        /**
         *
         */
        function AbstractSimObject() {
            /**
             *
             */
            this.expireTime_ = Number.POSITIVE_INFINITY;
            // Do nothing yet.
        }
        Object.defineProperty(AbstractSimObject.prototype, "expireTime", {
            /**
             *
             */
            get: function () {
                return this.expireTime_;
            },
            set: function (expireTime) {
                this.expireTime_ = expireTime;
            },
            enumerable: false,
            configurable: true
        });
        return AbstractSimObject;
    }());

    /**
     * @hidden
     */
    var ConstantForceLaw = /** @class */ (function (_super) {
        __extends(ConstantForceLaw, _super);
        /**
         *
         */
        function ConstantForceLaw($body, value, valueCoordType) {
            if (valueCoordType === void 0) { valueCoordType = WORLD; }
            var _this = _super.call(this) || this;
            _this.$body = $body;
            _this.$forces = [];
            var metric = _this.$body.metric;
            _this.$force = metric.createForce(_this.$body);
            _this.$force.locationCoordType = LOCAL;
            metric.copyVector(value, _this.$force.vector);
            _this.$force.vectorCoordType = valueCoordType;
            _this.$forces = [_this.$force];
            _this.$potentialEnergy = metric.zero();
            _this.$potentialEnergyLock = metric.lock(_this.$potentialEnergy);
            return _this;
        }
        Object.defineProperty(ConstantForceLaw.prototype, "forces", {
            get: function () {
                return this.$forces;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ConstantForceLaw.prototype, "location", {
            get: function () {
                return this.$force.location;
            },
            set: function (location) {
                var metric = this.$body.metric;
                metric.copyVector(location, this.$force.location);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ConstantForceLaw.prototype, "vector", {
            get: function () {
                return this.$force.vector;
            },
            set: function (vector) {
                var metric = this.$body.metric;
                metric.copyVector(vector, this.$force.vector);
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         */
        ConstantForceLaw.prototype.updateForces = function () {
            return this.$forces;
        };
        /**
         *
         */
        ConstantForceLaw.prototype.disconnect = function () {
            // Does nothing yet.
        };
        /**
         *
         */
        ConstantForceLaw.prototype.potentialEnergy = function () {
            // TODO: Why do we do this initialization to zero then return a locked object?
            var metric = this.$body.metric;
            metric.unlock(this.$potentialEnergy, this.$potentialEnergyLock);
            // metric.se
            // this.potentialEnergy_.a = 0;
            this.$potentialEnergyLock = metric.lock(this.$potentialEnergy);
            return this.$potentialEnergy;
        };
        return ConstantForceLaw;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    var ConstantTorqueLaw = /** @class */ (function (_super) {
        __extends(ConstantTorqueLaw, _super);
        function ConstantTorqueLaw($body, value, valueCoordType) {
            var _this = _super.call(this) || this;
            _this.$body = $body;
            var metric = _this.$body.metric;
            _this.$torque = metric.createTorque(_this.$body);
            metric.copyBivector(value, _this.$torque.bivector);
            _this.$torque.bivectorCoordType = valueCoordType;
            _this.$torques = [_this.$torque];
            return _this;
        }
        Object.defineProperty(ConstantTorqueLaw.prototype, "torques", {
            get: function () {
                return this.$torques;
            },
            enumerable: false,
            configurable: true
        });
        ConstantTorqueLaw.prototype.updateTorques = function () {
            return this.$torques;
        };
        ConstantTorqueLaw.prototype.disconnect = function () {
            // Do nothing yet.
        };
        ConstantTorqueLaw.prototype.potentialEnergy = function () {
            var metric = this.$body.metric;
            // We don't really want to return a mutable quantity.
            return metric.zero();
        };
        return ConstantTorqueLaw;
    }(AbstractSimObject));

    /**
     *
     */
    var CoulombLaw = /** @class */ (function (_super) {
        __extends(CoulombLaw, _super);
        /**
         *
         */
        function CoulombLaw(body1_, body2_, k) {
            var _this = _super.call(this) || this;
            _this.body1_ = body1_;
            _this.body2_ = body2_;
            _this.$forces = [];
            _this.metric = body1_.metric;
            var metric = _this.metric;
            _this.F1 = metric.createForce(_this.body1_);
            _this.F1.locationCoordType = WORLD;
            _this.F1.vectorCoordType = WORLD;
            _this.F2 = metric.createForce(_this.body2_);
            _this.F2.locationCoordType = WORLD;
            _this.F2.vectorCoordType = WORLD;
            _this.k = k;
            _this.$forces = [_this.F1, _this.F2];
            _this.potentialEnergy_ = metric.zero();
            _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
            return _this;
        }
        Object.defineProperty(CoulombLaw.prototype, "forces", {
            get: function () {
                return this.$forces;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Computes the forces due to the Coulomb interaction.
         * F = k * q1 * q2 * direction(r2 - r1) / quadrance(r2 - r1)
         */
        CoulombLaw.prototype.updateForces = function () {
            // We can use the F1.location and F2.location as temporary variables
            // as long as we restore their contents.
            var numer = this.F1.location;
            var denom = this.F2.location;
            var metric = this.metric;
            // The direction of the force is computed such that like charges repel each other.
            metric.copyVector(this.body1_.X, numer);
            metric.subVector(numer, this.body2_.X);
            metric.copyVector(numer, denom);
            metric.quad(denom);
            metric.direction(numer);
            metric.mulByScalar(numer, metric.a(this.k), metric.uom(this.k));
            metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
            metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
            metric.copyVector(numer, this.F1.vector);
            metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
            metric.copyVector(this.F1.vector, this.F2.vector);
            metric.neg(this.F2.vector);
            // Restore the contents of the location variables.
            metric.copyVector(this.body1_.X, this.F1.location);
            metric.copyVector(this.body2_.X, this.F2.location);
            return this.$forces;
        };
        /**
         *
         */
        CoulombLaw.prototype.disconnect = function () {
            // Does nothing
        };
        /**
         * Computes the potential energy of the gravitational interaction.
         * U = k q1 q2 / r, where
         * r is the center to center separation of m1 and m2.
         */
        CoulombLaw.prototype.potentialEnergy = function () {
            var metric = this.metric;
            // Unlock the variable that we will use for the result.
            metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
            // We can use the F1.location and F2.location as temporary variables
            // as long as we restore their contents.
            var numer = this.F1.location;
            var denom = this.F2.location;
            // The numerator of the potential energy formula is k * Q1 * Q2.
            metric.copyScalar(metric.a(this.k), metric.uom(this.k), numer);
            metric.mulByScalar(numer, metric.a(this.body1_.Q), metric.uom(this.body1_.Q));
            metric.mulByScalar(numer, metric.a(this.body2_.Q), metric.uom(this.body2_.Q));
            // The denominator is |r1 - r2|.
            metric.copyVector(this.body1_.X, denom);
            metric.subVector(denom, this.body2_.X);
            metric.norm(denom);
            // Combine the numerator and denominator.
            metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
            metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));
            // Restore the contents of the location variables.
            metric.copyVector(this.body1_.X, this.F1.location);
            metric.copyVector(this.body2_.X, this.F2.location);
            // We're done. Lock down the result.
            this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
            return this.potentialEnergy_;
        };
        return CoulombLaw;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            doesNotSatisfy(name, messageBuilder, contextBuilder);
        }
    }
    /**
     * @hidden
     * @param name
     * @param messageBuilder
     * @param contextBuilder
     */
    function doesNotSatisfy(name, messageBuilder, contextBuilder) {
        var message = messageBuilder ? messageBuilder() : "satisfy some condition";
        var context = contextBuilder ? " in " + contextBuilder() : "";
        throw new Error(name + " must " + message + context + ".");
    }

    /**
     * @hidden
     */
    function isNull (x) {
        return x === null;
    }

    /**
     * @hidden
     */
    function isObject(x) {
        return (typeof x === 'object');
    }

    /**
     * @hidden
     */
    function beObject() {
        return "be a non-null `object`";
    }
    /**
     * @hidden
     */
    function mustBeNonNullObject(name, value, contextBuilder) {
        mustSatisfy(name, isObject(value) && !isNull(value), beObject, contextBuilder);
        return value;
    }

    /**
     * @hidden
     */
    function isNumber(x) {
        return (typeof x === 'number');
    }

    /**
     * @hidden
     */
    function beANumber() {
        return "be a `number`";
    }
    /**
     * @hidden
     * @param name
     * @param value
     * @param contextBuilder
     * @returns
     */
    function mustBeNumber(name, value, contextBuilder) {
        mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
        return value;
    }

    /**
     * @hidden
     */
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }

    /**
     * The QQ class represents a rational number, ℚ.
     *
     * The QQ implementation is that of an <em>immutable</em> (value) type.
     *
     * The numerator and denominator are reduced to their lowest form.
     *
     * Construct new instances using the static <code>valueOf</code> method.
     * @hidden
     */
    var QQ = /** @class */ (function () {
        /**
         * @param n The numerator.
         * @param d The denominator.
         */
        function QQ(n, d) {
            var g;
            var gcd = function (a, b) {
                var temp;
                if (a < 0) {
                    a = -a;
                }
                if (b < 0) {
                    b = -b;
                }
                if (b > a) {
                    temp = a;
                    a = b;
                    b = temp;
                }
                while (true) {
                    a %= b;
                    if (a === 0) {
                        return b;
                    }
                    b %= a;
                    if (b === 0) {
                        return a;
                    }
                }
            };
            if (d === 0) {
                throw new Error("denominator must not be zero");
            }
            if (n === 0) {
                g = 1;
            }
            else {
                g = gcd(Math.abs(n), Math.abs(d));
            }
            if (d < 0) {
                n = -n;
                d = -d;
            }
            this.numer_ = n / g;
            this.denom_ = d / g;
        }
        Object.defineProperty(QQ.prototype, "numer", {
            /**
             * The numerator of the rational number.
             */
            get: function () {
                return this.numer_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            /**
             * The denominator of the rational number.
             */
            get: function () {
                return this.denom_;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @returns this + rhs
         */
        QQ.prototype.add = function (rhs) {
            return QQ.valueOf(this.numer_ * rhs.denom_ + this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
        };
        /**
         * @returns this - rhs
         */
        QQ.prototype.sub = function (rhs) {
            return QQ.valueOf(this.numer_ * rhs.denom_ - this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
        };
        /**
         * @returns this * rhs
         */
        QQ.prototype.mul = function (rhs) {
            return QQ.valueOf(this.numer_ * rhs.numer_, this.denom_ * rhs.denom_);
        };
        /**
         * @returns this / rhs
         */
        QQ.prototype.div = function (rhs) {
            var numer = this.numer_ * rhs.denom_;
            var denom = this.denom_ * rhs.numer_;
            if (numer === 0) {
                if (denom === 0) {
                    // How do we handle undefined?
                    return QQ.valueOf(numer, denom);
                }
                else {
                    return QQ.ZERO;
                }
            }
            else {
                if (denom === 0) {
                    // How do we handle division by zero.
                    return QQ.valueOf(numer, denom);
                }
                else {
                    return QQ.valueOf(numer, denom);
                }
            }
        };
        /**
         * @returns `true` if this rational number is one (1), otherwise `false`.
         */
        QQ.prototype.isOne = function () {
            return this.numer_ === 1 && this.denom_ === 1;
        };
        /**
         * @returns `true` if this rational number is zero (0), otherwise `false`.
         */
        QQ.prototype.isZero = function () {
            return this.numer_ === 0 && this.denom_ === 1;
        };
        /**
         * @returns 37 * numerator + 13 * denominator
         */
        QQ.prototype.hashCode = function () {
            return 37 * this.numer_ + 13 * this.denom_;
        };
        /**
         * Computes the multiplicative inverse of this rational number.
         *
         * @returns 1 / this
         */
        QQ.prototype.inv = function () {
            return QQ.valueOf(this.denom_, this.numer_);
        };
        /**
         * Computes the additive inverse of this rational number.
         *
         * @returns -this
         */
        QQ.prototype.neg = function () {
            return QQ.valueOf(-this.numer_, this.denom_);
        };
        /**
         * Determines whether two rational numbers are equal.
         *
         * @returns `true` if `this` rational number equals the `other` rational number.
         */
        QQ.prototype.equals = function (other) {
            if (this === other) {
                return true;
            }
            else if (other instanceof QQ) {
                return this.numer_ * other.denom_ === this.denom_ * other.numer_;
            }
            else {
                return false;
            }
        };
        /**
         * Computes a non-normative string representation of this rational.
         *
         * @returns
         */
        QQ.prototype.toString = function (radix) {
            return "" + this.numer_.toString(radix) + "/" + this.denom_.toString(radix) + "";
        };
        /**
         * @returns this + rhs
         */
        QQ.prototype.__add__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.add(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns lhs + this
         */
        QQ.prototype.__radd__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.add(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns this - rhs
         */
        QQ.prototype.__sub__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.sub(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns lhs - this
         */
        QQ.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.sub(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns this * rhs
         */
        QQ.prototype.__mul__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns lhs * this
         */
        QQ.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns this / rhs
         */
        QQ.prototype.__div__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns lhs / this
         */
        QQ.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns +this
         */
        QQ.prototype.__pos__ = function () {
            return this;
        };
        /**
         * @returns -this
         */
        QQ.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @param numer The numerator of the rational number.
         * @param denom The denominator of the rational number.
         * @returns The rational number numer / denom reduced to its lowest form.
         */
        QQ.valueOf = function (n, d) {
            if (n === 0) {
                if (d !== 0) {
                    return QQ.ZERO;
                }
            }
            else if (d === 0) ;
            else if (n === d) {
                return QQ.ONE;
            }
            else if (n === 1) {
                if (d === 2) {
                    return QQ.POS_01_02;
                }
                else if (d === 3) {
                    return QQ.POS_01_03;
                }
                else if (d === 4) {
                    return QQ.POS_01_04;
                }
                else if (d === 5) {
                    return QQ.POS_01_05;
                }
                else if (d === -3) {
                    return QQ.NEG_01_03;
                }
            }
            else if (n === -1) {
                if (d === 1) {
                    return QQ.NEG_01_01;
                }
                else if (d === 3) {
                    return QQ.NEG_01_03;
                }
            }
            else if (n === 2) {
                if (d === 1) {
                    return QQ.POS_02_01;
                }
                else if (d === 3) {
                    return QQ.POS_02_03;
                }
            }
            else if (n === -2) {
                if (d === 1) {
                    return QQ.NEG_02_01;
                }
            }
            else if (n === 3) {
                if (d === 1) {
                    return QQ.POS_03_01;
                }
            }
            else if (n === -3) {
                if (d === 1) {
                    return QQ.NEG_03_01;
                }
            }
            else if (n === 4) {
                if (d === 1) {
                    return QQ.POS_04_01;
                }
            }
            else if (n === 5) {
                if (d === 1) {
                    return QQ.POS_05_01;
                }
            }
            else if (n === 6) {
                if (d === 1) {
                    return QQ.POS_06_01;
                }
            }
            else if (n === 7) {
                if (d === 1) {
                    return QQ.POS_07_01;
                }
            }
            else if (n === 8) {
                if (d === 1) {
                    return QQ.POS_08_01;
                }
            }
            // console.warn(`QQ.valueOf(${n},${d}) is not cached.`);
            return new QQ(n, d);
        };
        //
        // Immutable constants allow us to avoid creating
        // temporary QQ instances for the common values.
        //
        QQ.POS_08_01 = new QQ(8, 1);
        QQ.POS_07_01 = new QQ(7, 1);
        QQ.POS_06_01 = new QQ(6, 1);
        QQ.POS_05_01 = new QQ(5, 1);
        QQ.POS_04_01 = new QQ(4, 1);
        QQ.POS_03_01 = new QQ(3, 1);
        QQ.POS_02_01 = new QQ(2, 1);
        QQ.ONE = new QQ(1, 1);
        QQ.POS_01_02 = new QQ(1, 2);
        QQ.POS_01_03 = new QQ(1, 3);
        QQ.POS_01_04 = new QQ(1, 4);
        QQ.POS_01_05 = new QQ(1, 5);
        QQ.ZERO = new QQ(0, 1);
        QQ.NEG_01_03 = new QQ(-1, 3);
        QQ.NEG_01_01 = new QQ(-1, 1);
        QQ.NEG_02_01 = new QQ(-2, 1);
        QQ.NEG_03_01 = new QQ(-3, 1);
        QQ.POS_02_03 = new QQ(2, 3);
        return QQ;
    }());

    /**
     * A summary of all the exponents in physical dimensions.
     * @hidden
     */
    var DimensionsSummary;
    (function (DimensionsSummary) {
        /**
         * The `amount of substance` base quantity.
         */
        DimensionsSummary[DimensionsSummary["AMOUNT_OF_SUBSTANCE"] = 0] = "AMOUNT_OF_SUBSTANCE";
        DimensionsSummary[DimensionsSummary["ANGULAR_MOMENTUM"] = 1] = "ANGULAR_MOMENTUM";
        /**
         * The `area` derived quantity.
         */
        DimensionsSummary[DimensionsSummary["AREA"] = 2] = "AREA";
        /**
         * The `electric charge, quantity of electricity` derived quantity.
         */
        DimensionsSummary[DimensionsSummary["ELECTRIC_CHARGE"] = 3] = "ELECTRIC_CHARGE";
        /**
         * The `electric current` base quantity.
         */
        DimensionsSummary[DimensionsSummary["ELECTRIC_CURRENT"] = 4] = "ELECTRIC_CURRENT";
        DimensionsSummary[DimensionsSummary["ELECTRIC_FIELD"] = 5] = "ELECTRIC_FIELD";
        DimensionsSummary[DimensionsSummary["ELECTRIC_PERMITTIVITY_TIMES_AREA"] = 6] = "ELECTRIC_PERMITTIVITY_TIMES_AREA";
        DimensionsSummary[DimensionsSummary["ENERGY_OR_TORQUE"] = 7] = "ENERGY_OR_TORQUE";
        DimensionsSummary[DimensionsSummary["FORCE"] = 8] = "FORCE";
        DimensionsSummary[DimensionsSummary["FRICTION_COEFFICIENT"] = 9] = "FRICTION_COEFFICIENT";
        /**
         * The `liminous intensity` base quantity.
         */
        DimensionsSummary[DimensionsSummary["LUMINOUS_INTENSITY"] = 10] = "LUMINOUS_INTENSITY";
        DimensionsSummary[DimensionsSummary["INV_LENGTH"] = 11] = "INV_LENGTH";
        DimensionsSummary[DimensionsSummary["INV_MOMENT_OF_INERTIA"] = 12] = "INV_MOMENT_OF_INERTIA";
        DimensionsSummary[DimensionsSummary["INV_MASS"] = 13] = "INV_MASS";
        DimensionsSummary[DimensionsSummary["INV_TIME"] = 14] = "INV_TIME";
        /**
         * The `length` base qiantity.
         */
        DimensionsSummary[DimensionsSummary["LENGTH"] = 15] = "LENGTH";
        /**
         * The `mass` base quantity.
         */
        DimensionsSummary[DimensionsSummary["MASS"] = 16] = "MASS";
        DimensionsSummary[DimensionsSummary["MOMENT_OF_INERTIA"] = 17] = "MOMENT_OF_INERTIA";
        DimensionsSummary[DimensionsSummary["MOMENTUM"] = 18] = "MOMENTUM";
        DimensionsSummary[DimensionsSummary["MOMENTUM_SQUARED"] = 19] = "MOMENTUM_SQUARED";
        DimensionsSummary[DimensionsSummary["ONE"] = 20] = "ONE";
        DimensionsSummary[DimensionsSummary["RATE_OF_CHANGE_OF_AREA"] = 21] = "RATE_OF_CHANGE_OF_AREA";
        DimensionsSummary[DimensionsSummary["STIFFNESS"] = 22] = "STIFFNESS";
        /**
         * The `time` base quantity.
         */
        DimensionsSummary[DimensionsSummary["TIME"] = 23] = "TIME";
        DimensionsSummary[DimensionsSummary["TIME_SQUARED"] = 24] = "TIME_SQUARED";
        /**
         * The `thermodynamic temperature` base quantity.
         */
        DimensionsSummary[DimensionsSummary["THERMODYNAMIC_TEMPERATURE"] = 25] = "THERMODYNAMIC_TEMPERATURE";
        DimensionsSummary[DimensionsSummary["VELOCITY"] = 26] = "VELOCITY";
        DimensionsSummary[DimensionsSummary["VELOCITY_SQUARED"] = 27] = "VELOCITY_SQUARED";
        /**
         * The `volume` derived quantity.
         */
        DimensionsSummary[DimensionsSummary["VOLUME"] = 28] = "VOLUME";
    })(DimensionsSummary || (DimensionsSummary = {}));

    /**
     * @hidden
     */
    function detectDimensions(M, L, T, Q, temperature, amount, intensity) {
        if (M.numer === -1) {
            if (M.denom === 1) {
                if (L.numer === -2) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.INV_MOMENT_OF_INERTIA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === -1) {
                    if (L.denom === 1) {
                        if (T.numer === 2) {
                            if (T.denom === 1) {
                                if (Q.numer === 2) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.INV_MASS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (M.numer === 0) {
            if (M.denom === 1) {
                if (L.numer === -1) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.INV_LENGTH;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.INV_TIME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (Q.numer === 1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ELECTRIC_CURRENT;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ONE;
                                                            }
                                                        }
                                                        else if (intensity.numer === 1) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.LUMINOUS_INTENSITY;
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (amount.numer === 1) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.AMOUNT_OF_SUBSTANCE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (temperature.numer === 1) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.THERMODYNAMIC_TEMPERATURE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (Q.numer === 1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ELECTRIC_CHARGE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.TIME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.TIME_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 1) {
                    if (L.denom === 1) {
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.VELOCITY;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.LENGTH;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.VELOCITY_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.RATE_OF_CHANGE_OF_AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 3) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.VOLUME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (M.numer === 1) {
            if (M.denom === 1) {
                if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.STIFFNESS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.MASS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 1) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === -1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ELECTRIC_FIELD;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.FORCE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.MOMENTUM;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ENERGY_OR_TORQUE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.ANGULAR_MOMENTUM;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.MOMENT_OF_INERTIA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (M.numer === 2) {
            if (M.denom === 1) {
                if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary.MOMENTUM_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return void 0;
    }

    /**
     * @hidden
     */
    var R0 = QQ.valueOf(0, 1);
    /**
     * @hidden
     */
    var R1 = QQ.valueOf(1, 1);
    /**
     * @hidden
     */
    var R2 = QQ.valueOf(2, 1);
    /**
     * @hidden
     */
    var R3 = QQ.valueOf(3, 1);
    /**
     * @hidden
     */
    var M1 = QQ.valueOf(-1, 1);
    /**
     * @hidden
     */
    var M2 = QQ.valueOf(-2, 1);
    /**
     * @hidden
     * @param name
     * @param arg
     * @returns
     */
    function assertArgRational(name, arg) {
        if (arg instanceof QQ) {
            return arg;
        }
        else {
            throw new Error("Argument " + name + " => " + arg + " must be a QQ");
        }
    }
    /**
     * @hidden
     */
    var dimsChecking = 'strict';
    /**
     * @param mode
     */
    function setDimensionsChecking(mode) {
        switch (mode) {
            case 'strict':
            case 'none': {
                dimsChecking = mode;
                break;
            }
            default: {
                throw new Error("mode must be 'none' or 'strict'.");
            }
        }
    }
    /**
     * Keeps track of the dimensions of a physical quantity using seven rational exponents.
     * Each of the exponents corresponds to a dimension in the S.I. system of units.
     * @hidden
     */
    var Dimensions = /** @class */ (function () {
        /**
         * The Dimensions class captures the physical dimensions associated with a unit of measure.
         *
         * @param M The mass component of the dimensions object.
         * @param L The length component of the dimensions object.
         * @param T The time component of the dimensions object.
         * @param Q The charge component of the dimensions object.
         * @param temperature The temperature component of the dimensions object.
         * @param amount The amount component of the dimensions object.
         * @param intensity The intensity component of the dimensions object.
         */
        function Dimensions(M, L, T, Q, temperature, amount, intensity, summary) {
            this.M = assertArgRational('M', M);
            this.L = assertArgRational('L', L);
            this.T = assertArgRational('T', T);
            this.Q = assertArgRational('Q', Q);
            this.temperature = assertArgRational('temperature', temperature);
            this.amount = assertArgRational('amount', amount);
            this.intensity = assertArgRational('intensity', intensity);
            this.summary_ = summary;
        }
        Object.defineProperty(Dimensions.prototype, "summary", {
            get: function () {
                return this.summary_;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the dimensions if they are all equal, otherwise throws an <code>Error</code>
         */
        Dimensions.prototype.compatible = function (rhs) {
            if (typeof this.summary_ === 'number' && this.summary_ === rhs.summary_) {
                return this;
            }
            else if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                if (this.isOne()) {
                    if (rhs.isOne()) {
                        throw new Error();
                    }
                    else {
                        var msg = "Dimensions must be equal (dimensionless, " + rhs + ")";
                        switch (dimsChecking) {
                            case 'none': {
                                return rhs;
                            }
                            default: {
                                throw new Error(msg);
                            }
                        }
                    }
                }
                else {
                    if (rhs.isOne()) {
                        var msg = "Dimensions must be equal (" + this + ", dimensionless)";
                        switch (dimsChecking) {
                            case 'none': {
                                return this;
                            }
                            default: {
                                throw new Error(msg);
                            }
                        }
                    }
                    else {
                        var msg = "Dimensions must be equal (" + this + ", " + rhs + ")";
                        switch (dimsChecking) {
                            case 'none': {
                                return this;
                            }
                            default: {
                                throw new Error(msg);
                            }
                        }
                    }
                }
            }
        };
        Dimensions.prototype.equals = function (rhs) {
            if (this === rhs) {
                return true;
            }
            else {
                return this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity);
            }
        };
        /**
         * Multiplies dimensions by adding rational exponents.
         *
         * @param rhs
         * @returns <code>this * rhs</code>
         */
        Dimensions.prototype.mul = function (rhs) {
            return Dimensions.valueOf(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        /**
         * Divides dimensions by subtracting rational exponents.
         *
         * @param rhs
         * @returns <code>this / rhs</code>
         */
        Dimensions.prototype.div = function (rhs) {
            return Dimensions.valueOf(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        /**
         * Computes the power function by multiplying rational exponents.
         *
         * @param rhs
         * @returns <code>pow(this, rhs)</code>
         */
        Dimensions.prototype.pow = function (exponent) {
            return Dimensions.valueOf(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        /**
         * Computes the square root by dividing each rational component by two.
         *
         * @returns
         */
        Dimensions.prototype.sqrt = function () {
            return Dimensions.valueOf(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
        };
        /**
         * Determines whether all the exponents of this dimensions number are zero.
         * This implies a dimensionless quantity.
         *
         * @returns <code>true</code> if all the exponents are zero, otherwise <code>false</code>.
         */
        Dimensions.prototype.isOne = function () {
            if (this === Dimensions.ONE) {
                return true;
            }
            else {
                return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
            }
        };
        /**
         * Computes the multiplicative inverse of this dimensions number.
         * This is achived by changing the signs of all the exponent quantities.
         *
         * @returns The multiplicative inverse of this dimensions number.
         */
        Dimensions.prototype.inv = function () {
            return Dimensions.valueOf(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
        };
        /**
         * Creates a representation of this <code>Dimensions</code> instance.
         *
         * @returns
         */
        Dimensions.prototype.toString = function () {
            var stringify = function (rational, label) {
                if (rational.numer === 0) {
                    return null;
                }
                else if (rational.denom === 1) {
                    if (rational.numer === 1) {
                        return "" + label;
                    }
                    else {
                        return "" + label + " ** " + rational.numer;
                    }
                }
                return "" + label + " ** " + rational;
            };
            return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                return typeof x === 'string';
            }).join(" * ");
        };
        /**
         * @returns this + rhs
         */
        Dimensions.prototype.__add__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns lhs + this
         */
        Dimensions.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        /**
         *
         * @param rhs
         * @returns
         */
        Dimensions.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         *
         * @param lhs
         * @returns
         */
        Dimensions.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        /**
         *
         * @param rhs
         * @returns
         */
        Dimensions.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         *
         * @param lhs
         * @returns
         */
        Dimensions.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        /**
         *
         * @param rhs
         * @returns
         */
        Dimensions.prototype.__div__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        /**
         * @param lhs
         * @returns
         */
        Dimensions.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        /**
         * @returns
         */
        Dimensions.prototype.__pos__ = function () {
            return this;
        };
        /**
         *
         * @returns
         */
        Dimensions.prototype.__neg__ = function () {
            return this;
        };
        /**
         * Constructor function for Dimensions.
         * @param M The mass component of the dimensions object.
         * @param L The length component of the dimensions object.
         * @param T The time component of the dimensions object.
         * @param Q The charge component of the dimensions object.
         * @param temperature The temperature component of the dimensions object.
         * @param amount The amount component of the dimensions object.
         * @param intensity The intensity component of the dimensions object.
         */
        Dimensions.valueOf = function (M, L, T, Q, temperature, amount, intensity) {
            // This function is optimized to minimize the need for object creation.
            var summary = detectDimensions(M, L, T, Q, temperature, amount, intensity);
            switch (summary) {
                case DimensionsSummary.AMOUNT_OF_SUBSTANCE: return Dimensions.AMOUNT_OF_SUBSTANCE;
                case DimensionsSummary.ANGULAR_MOMENTUM: return Dimensions.ANGULAR_MOMENTUM;
                case DimensionsSummary.AREA: return Dimensions.AREA;
                case DimensionsSummary.ELECTRIC_CHARGE: return Dimensions.ELECTRIC_CHARGE;
                case DimensionsSummary.ELECTRIC_CURRENT: return Dimensions.ELECTRIC_CURRENT;
                case DimensionsSummary.ELECTRIC_FIELD: return Dimensions.ELECTRIC_FIELD;
                case DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA: return Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA;
                case DimensionsSummary.ENERGY_OR_TORQUE: return Dimensions.ENERGY_OR_TORQUE;
                case DimensionsSummary.FORCE: return Dimensions.FORCE;
                case DimensionsSummary.LUMINOUS_INTENSITY: return Dimensions.LUMINOUS_INTENSITY;
                case DimensionsSummary.INV_LENGTH: return Dimensions.INV_LENGTH;
                case DimensionsSummary.INV_MASS: return Dimensions.INV_MASS;
                case DimensionsSummary.INV_MOMENT_OF_INERTIA: return Dimensions.INV_MOMENT_OF_INERTIA;
                case DimensionsSummary.INV_TIME: return Dimensions.INV_TIME;
                case DimensionsSummary.LENGTH: return Dimensions.LENGTH;
                case DimensionsSummary.MASS: return Dimensions.MASS;
                case DimensionsSummary.MOMENT_OF_INERTIA: return Dimensions.MOMENT_OF_INERTIA;
                case DimensionsSummary.MOMENTUM: return Dimensions.MOMENTUM;
                case DimensionsSummary.MOMENTUM_SQUARED: return Dimensions.MOMENTUM_SQUARED;
                case DimensionsSummary.ONE: return Dimensions.ONE;
                case DimensionsSummary.RATE_OF_CHANGE_OF_AREA: return Dimensions.RATE_OF_CHANGE_OF_AREA;
                case DimensionsSummary.STIFFNESS: return Dimensions.STIFFNESS;
                case DimensionsSummary.THERMODYNAMIC_TEMPERATURE: return Dimensions.THERMODYNAMIC_TEMPERATURE;
                case DimensionsSummary.TIME: return Dimensions.TIME;
                case DimensionsSummary.TIME_SQUARED: return Dimensions.TIME_SQUARED;
                case DimensionsSummary.VELOCITY: return Dimensions.VELOCITY;
                case DimensionsSummary.VELOCITY_SQUARED: return Dimensions.VELOCITY_SQUARED;
                default: {
                    // console.warn(`Dimensions.valueOf(${M},${L},${T},${Q},${temperature},${amount},${intensity}) is not cached.`);
                    return new Dimensions(M, L, T, Q, temperature, amount, intensity, summary);
                }
            }
        };
        /**
         * All exponents are zero, a dimensionless quantity.
         */
        Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0, DimensionsSummary.ONE);
        /**
         * M<sup>1</sup>
         */
        Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0, DimensionsSummary.MASS);
        /**
         * L<sup>1</sup>
         */
        Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0, DimensionsSummary.LENGTH);
        /**
         * L<sup>2</sup>
         */
        Dimensions.AREA = new Dimensions(R0, R2, R0, R0, R0, R0, R0, DimensionsSummary.AREA);
        /**
         * L<sup>3</sup>
         */
        Dimensions.VOLUME = new Dimensions(R0, R3, R0, R0, R0, R0, R0, DimensionsSummary.VOLUME);
        /**
         * Inverse Length.
         */
        Dimensions.INV_LENGTH = new Dimensions(R0, M1, R0, R0, R0, R0, R0, DimensionsSummary.INV_LENGTH);
        /**
         * T<sup>1</sup>
         */
        Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0, DimensionsSummary.TIME);
        /**
         * Q<sup>1</sup>
         */
        Dimensions.ELECTRIC_CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0, DimensionsSummary.ELECTRIC_CHARGE);
        /**
         * Q<sup>1</sup>T<sup>-1<sup>
         */
        Dimensions.ELECTRIC_CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0, DimensionsSummary.ELECTRIC_CURRENT);
        /**
         *
         */
        Dimensions.THERMODYNAMIC_TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0, DimensionsSummary.THERMODYNAMIC_TEMPERATURE);
        /**
         *
         */
        Dimensions.AMOUNT_OF_SUBSTANCE = new Dimensions(R0, R0, R0, R0, R0, R1, R0, DimensionsSummary.AMOUNT_OF_SUBSTANCE);
        /**
         *
         */
        Dimensions.LUMINOUS_INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1, DimensionsSummary.LUMINOUS_INTENSITY);
        /**
         * Angular Momentum.
         */
        Dimensions.ANGULAR_MOMENTUM = new Dimensions(R1, R2, M1, R0, R0, R0, R0, DimensionsSummary.ANGULAR_MOMENTUM);
        /**
         * Rate of change of Area.
         */
        Dimensions.RATE_OF_CHANGE_OF_AREA = new Dimensions(R0, R2, M1, R0, R0, R0, R0, DimensionsSummary.RATE_OF_CHANGE_OF_AREA);
        /**
         * Electric Field.
         */
        Dimensions.ELECTRIC_FIELD = new Dimensions(R1, R1, M2, M1, R0, R0, R0, DimensionsSummary.ELECTRIC_FIELD);
        /**
         * Electric Permittivity times Area.
         */
        Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA = new Dimensions(M1, M1, R2, R2, R0, R0, R0, DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA);
        /**
         * Energy or Torque.
         */
        Dimensions.ENERGY_OR_TORQUE = new Dimensions(R1, R2, M2, R0, R0, R0, R0, DimensionsSummary.ENERGY_OR_TORQUE);
        /**
         * Force.
         */
        Dimensions.FORCE = new Dimensions(R1, R1, M2, R0, R0, R0, R0, DimensionsSummary.FORCE);
        /**
         * Inverse Mass.
         */
        Dimensions.INV_MASS = new Dimensions(M1, R0, R0, R0, R0, R0, R0, DimensionsSummary.INV_MASS);
        /**
         * Inverse Moment of Inertia.
         */
        Dimensions.INV_MOMENT_OF_INERTIA = new Dimensions(M1, M2, R0, R0, R0, R0, R0, DimensionsSummary.INV_MOMENT_OF_INERTIA);
        /**
         * Inverse Time.
         */
        Dimensions.INV_TIME = new Dimensions(R0, R0, M1, R0, R0, R0, R0, DimensionsSummary.INV_TIME);
        /**
         * Moment of Inertia.
         */
        Dimensions.MOMENT_OF_INERTIA = new Dimensions(R1, R2, R0, R0, R0, R0, R0, DimensionsSummary.MOMENT_OF_INERTIA);
        /**
         * Momentum.
         */
        Dimensions.MOMENTUM = new Dimensions(R1, R1, M1, R0, R0, R0, R0, DimensionsSummary.MOMENTUM);
        /**
         * Momentum squared.
         */
        Dimensions.MOMENTUM_SQUARED = new Dimensions(R2, R2, M2, R0, R0, R0, R0, DimensionsSummary.MOMENTUM_SQUARED);
        /**
         * Stiffness.
         */
        Dimensions.STIFFNESS = new Dimensions(R1, R0, M2, R0, R0, R0, R0, DimensionsSummary.STIFFNESS);
        /**
         * Friction.
         */
        Dimensions.FRICTION_COEFFICIENT = new Dimensions(R1, R0, M1, R0, R0, R0, R0, DimensionsSummary.FRICTION_COEFFICIENT);
        /**
         * Time squared.
         */
        Dimensions.TIME_SQUARED = new Dimensions(R0, R0, R2, R0, R0, R0, R0, DimensionsSummary.TIME_SQUARED);
        /**
         * Velocity
         */
        Dimensions.VELOCITY = new Dimensions(R0, R1, M1, R0, R0, R0, R0, DimensionsSummary.VELOCITY);
        /**
         * Velocity squared
         */
        Dimensions.VELOCITY_SQUARED = new Dimensions(R0, R2, M2, R0, R0, R0, R0, DimensionsSummary.VELOCITY_SQUARED);
        return Dimensions;
    }());

    // const NAMES_SI = ['kilogram', 'meter', 'second', 'coulomb', 'kelvin', 'mole', 'candela'];
    /**
     * @hidden
     */
    var SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];
    /**
     * The numerator, denominator values for each dimension (M, L, T, Q, temperature, amount, intensity).
     * @hidden
     */
    var patterns = [
        [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -1, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, +3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -2, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
        [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 3, 1, -2, 1, -2, 1, 0, 1, 0, 1, 0, 1] // N·m**2/C**2
    ];
    /**
     * The string literals for the patterns.
     * The convention is to write the unit compactly (without whitespace).
     * TODO: Would be nice to separate...
     * Name (same as the variable name)
     * Symbol
     * Expression in terms of other SI units
     * Expression in terms of SI base units.
     * @hidden
     */
    var decodes = [
        ["F/m or C**2/N·m**2"],
        ["S or A/V"],
        ["F or C/V"],
        ["C**2/N"],
        ["C/kg"],
        ["N·m·m/kg·kg"],
        ["C/m**3"],
        ["C/m**2"],
        ["C/m"],
        ["J/kg"],
        ["Hz"],
        ["A"],
        ["m/s**2"],
        ["m/s"],
        ["kg·m/s"],
        ["Pa or N/m**2 or J/m**3"],
        ["Pa·s"],
        ["W/m**2"],
        ["N/m"],
        ["T or Wb/m**2"],
        ["W/(m·K)"],
        ["V/m or N/C"],
        ["N"],
        ["H/m"],
        ["J/K"],
        ["J/(kg·K)"],
        ["J/(mol·K)"],
        ["J/mol"],
        ["J or N·m"],
        ["J·s"],
        ["W or J/s"],
        ["V or W/A"],
        ["Ω or V/A"],
        ["H or Wb/A"],
        ["Wb"],
        ["N·m**2/C**2"]
    ];
    /**
     * @hidden
     * @param multiplier
     * @param formatted
     * @param dimensions
     * @param labels
     * @param compact
     * @returns
     */
    var dumbString = function (multiplier, formatted, dimensions, labels, compact) {
        var stringify = function (rational, label) {
            if (rational.numer === 0) {
                return null;
            }
            else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    if (compact) {
                        return label;
                    }
                    else {
                        return label;
                    }
                }
                else {
                    return label + "**" + rational.numer;
                }
            }
            else {
                return label + "**" + rational;
            }
        };
        var operatorStr = multiplier === 1 || dimensions.isOne() ? (compact ? "" : " ") : " ";
        var scaleString = multiplier === 1 ? (compact ? "" : formatted) : formatted;
        var unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    /**
     * @hidden
     * @param multiplier
     * @param formatted
     * @param dimensions
     * @param labels
     * @param compact
     * @returns
     */
    var unitString = function (multiplier, formatted, dimensions, labels, compact) {
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0, len = patterns.length; i < len; i++) {
            var pattern = patterns[i];
            if (M.numer === pattern[0] && M.denom === pattern[1] &&
                L.numer === pattern[2] && L.denom === pattern[3] &&
                T.numer === pattern[4] && T.denom === pattern[5] &&
                Q.numer === pattern[6] && Q.denom === pattern[7] &&
                temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
                amount.numer === pattern[10] && amount.denom === pattern[11] &&
                intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                if (!compact) {
                    return multiplier + " * " + decodes[i][0];
                }
                else {
                    if (multiplier !== 1) {
                        return multiplier + " * " + decodes[i][0];
                    }
                    else {
                        return decodes[i][0];
                    }
                }
            }
        }
        return dumbString(multiplier, formatted, dimensions, labels, compact);
    };
    /**
     * @hidden
     * @param lhs
     * @param rhs
     * @returns
     */
    function add(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    /**
     * @hidden
     * @param lhs
     * @param rhs
     * @returns
     */
    function sub(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    /**
     * @hidden
     * @param lhs
     * @param rhs
     * @returns
     */
    function mul(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    /**
     * @hidden
     * @param α
     * @param unit
     * @returns
     */
    function scale(α, unit) {
        return Unit.valueOf(α * unit.multiplier, unit.dimensions, unit.labels);
    }
    /**
     * @hidden
     * @param lhs
     * @param rhs
     * @returns
     */
    function div(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    /**
     * <p>
     * The Unit class represents the units for a measure.
     * </p>
     */
    var Unit = /** @class */ (function () {
        /**
         * @param multiplier
         * @param dimensions
         * @param labels The label strings to use for each dimension.
         */
        function Unit(multiplier, dimensions, labels) {
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
            if (labels.length !== 7) {
                throw new Error("Expecting 7 elements in the labels array.");
            }
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
        }
        Unit.prototype.compatible = function (rhs) {
            if (rhs instanceof Unit) {
                try {
                    this.dimensions.compatible(rhs.dimensions);
                }
                catch (e) {
                    var cause = (e instanceof Error) ? e.message : "" + e;
                    throw new Error(this + " is not compatible with " + rhs + ". Cause: " + cause);
                }
                return this;
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        /**
         * @returns true if this and rhs have the same dimensions.
         */
        Unit.prototype.isCompatible = function (rhs) {
            if (rhs instanceof Unit) {
                return this.dimensions.equals(rhs.dimensions);
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        /**
         *
         */
        Unit.prototype.__add__ = function (rhs) {
            if (rhs instanceof Unit) {
                return add(this, rhs);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Unit) {
                return add(lhs, this);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Unit) {
                return sub(this, rhs);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Unit) {
                return sub(lhs, this);
            }
            else {
                return void 0;
            }
        };
        /**
         * Computes the unit equal to `this * rhs`.
         */
        Unit.prototype.mul = function (rhs) {
            return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Unit) {
                return mul(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return scale(rhs, this);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Unit) {
                return mul(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return scale(lhs, this);
            }
            else {
                return void 0;
            }
        };
        /**
         * Computes the unit equal to `this / rhs`.
         */
        Unit.prototype.div = function (rhs) {
            return div(this, rhs);
        };
        Unit.prototype.__div__ = function (rhs) {
            if (rhs instanceof Unit) {
                return div(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return Unit.valueOf(this.multiplier / rhs, this.dimensions, this.labels);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Unit) {
                return div(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return Unit.valueOf(lhs / this.multiplier, this.dimensions.inv(), this.labels);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.pow = function (exponent) {
            return Unit.valueOf(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function () {
            return Unit.valueOf(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function () {
            return Unit.valueOf(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function () {
            return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.sqrt = function () {
            return Unit.valueOf(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
        };
        Unit.prototype.toExponential = function (fractionDigits, compact) {
            return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels, compact);
        };
        Unit.prototype.toFixed = function (fractionDigits, compact) {
            return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels, compact);
        };
        Unit.prototype.toPrecision = function (precision, compact) {
            return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels, compact);
        };
        Unit.prototype.toString = function (radix, compact) {
            return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels, compact);
        };
        Unit.prototype.__pos__ = function () {
            return this;
        };
        Unit.prototype.__neg__ = function () {
            return this.neg();
        };
        /**
         * @param uom The unit of measure.
         * @returns `true` if the uom is one or if it is undefined.
         */
        Unit.isOne = function (uom) {
            if (uom === void 0) {
                return true;
            }
            else if (uom instanceof Unit) {
                return uom.isOne();
            }
            else {
                throw new Error("isOne argument must be a Unit or undefined.");
            }
        };
        /**
         * @param uom The unit of measure that must be dimensionless.
         */
        Unit.assertDimensionless = function (uom) {
            if (!Unit.isOne(uom)) {
                throw new Error("uom " + uom + " must be dimensionless.");
            }
        };
        /**
         * @param lhs
         * @param rhs
         * @returns
         */
        Unit.compatible = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.compatible(rhs);
                }
                else {
                    if (lhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new Error(lhs + " is incompatible with 1");
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new Error("1 is incompatible with " + rhs);
                    }
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.isCompatible = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.isCompatible(rhs);
                }
                else {
                    if (lhs.isOne()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
        };
        /**
         * @param lhs
         * @param rhs
         * @returns
         */
        Unit.mul = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.mul(rhs);
                }
                else if (Unit.isOne(rhs)) {
                    return lhs;
                }
                else {
                    return void 0;
                }
            }
            else if (Unit.isOne(lhs)) {
                return rhs;
            }
            else {
                return void 0;
            }
        };
        /**
         * @param lhs
         * @param rhs
         */
        Unit.div = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.div(rhs);
                }
                else {
                    return lhs;
                }
            }
            else {
                if (rhs) {
                    return rhs.inv();
                }
                else {
                    return Unit.ONE;
                }
            }
        };
        /**
         * Computes the multiplicative inverse of the specified unit of measure.
         */
        Unit.inv = function (uom) {
            if (uom instanceof Unit) {
                if (uom.isOne()) {
                    return Unit.ONE;
                }
                else {
                    return uom.inv();
                }
            }
            else {
                return Unit.ONE;
            }
        };
        /**
         *
         */
        Unit.mustBeUnit = function (name, uom) {
            if (uom instanceof Unit) {
                return uom;
            }
            else if (isUndefined(uom)) {
                return Unit.ONE;
            }
            else {
                throw new Error(name + " must be a Unit or undefined (meaning 1).");
            }
        };
        /**
         * Computes the value of the unit of measure raised to the specified power.
         */
        Unit.pow = function (uom, exponent) {
            if (uom instanceof Unit) {
                if (uom.isOne()) {
                    return void 0;
                }
                else {
                    if (exponent.isZero()) {
                        return void 0;
                    }
                    else {
                        return uom.pow(exponent);
                    }
                }
            }
            else {
                return void 0;
            }
        };
        /**
         * @param uom
         * @returns
         */
        Unit.sqrt = function (uom) {
            if (uom instanceof Unit) {
                if (uom.isOne()) {
                    return void 0;
                }
                else {
                    return uom.sqrt();
                }
            }
            else {
                return void 0;
            }
        };
        /**
         * Constructs a Unit.
         */
        Unit.valueOf = function (multiplier, dimensions, labels) {
            // This method is optimized to minimize object creation.
            // The summary on the dimensions is used to improve lookup time.
            if (multiplier === 1) {
                switch (dimensions.summary) {
                    case DimensionsSummary.AMOUNT_OF_SUBSTANCE: return Unit.MOLE;
                    case DimensionsSummary.ANGULAR_MOMENTUM: return Unit.JOULE_SECOND;
                    case DimensionsSummary.AREA: return Unit.METER_SQUARED;
                    case DimensionsSummary.ELECTRIC_CHARGE: return Unit.COULOMB;
                    case DimensionsSummary.ELECTRIC_CURRENT: return Unit.AMPERE;
                    case DimensionsSummary.ELECTRIC_FIELD: return Unit.ELECTRIC_FIELD;
                    case DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA: return Unit.COULOMB_SQUARED_PER_NEWTON;
                    case DimensionsSummary.ENERGY_OR_TORQUE: return Unit.JOULE;
                    case DimensionsSummary.FORCE: return Unit.NEWTON;
                    case DimensionsSummary.LUMINOUS_INTENSITY: return Unit.CANDELA;
                    case DimensionsSummary.INV_LENGTH: return Unit.INV_METER;
                    case DimensionsSummary.INV_MASS: return Unit.INV_KILOGRAM;
                    case DimensionsSummary.INV_MOMENT_OF_INERTIA: return Unit.INV_KILOGRAM_METER_SQUARED;
                    case DimensionsSummary.INV_TIME: return Unit.INV_SECOND;
                    case DimensionsSummary.LENGTH: return Unit.METER;
                    case DimensionsSummary.MASS: return Unit.KILOGRAM;
                    case DimensionsSummary.MOMENT_OF_INERTIA: return Unit.KILOGRAM_METER_SQUARED;
                    case DimensionsSummary.MOMENTUM: return Unit.KILOGRAM_METER_PER_SECOND;
                    case DimensionsSummary.MOMENTUM_SQUARED: return Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED;
                    case DimensionsSummary.ONE: return Unit.ONE;
                    case DimensionsSummary.RATE_OF_CHANGE_OF_AREA: return Unit.METER_SQUARED_PER_SECOND;
                    case DimensionsSummary.STIFFNESS: return Unit.STIFFNESS;
                    case DimensionsSummary.THERMODYNAMIC_TEMPERATURE: return Unit.KELVIN;
                    case DimensionsSummary.TIME: return Unit.SECOND;
                    case DimensionsSummary.TIME_SQUARED: return Unit.SECOND_SQUARED;
                    case DimensionsSummary.VELOCITY: return Unit.METER_PER_SECOND;
                    case DimensionsSummary.VELOCITY_SQUARED: return Unit.METER_SQUARED_PER_SECOND_SQUARED;
                    case DimensionsSummary.VOLUME: return Unit.METER_CUBED;
                }
            }
            // console.warn(`Unit.valueOf(${multiplier},${dimensions}) is not cached.`);
            return new Unit(multiplier, dimensions, labels);
        };
        /**
         * Internal symbolic constant to improve code readability.
         * May be undefined or an instance of Unit.
         */
        Unit.ONE = new Unit(1, Dimensions.ONE, SYMBOLS_SI);
        /**
         * Unit of mass.
         * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
         */
        Unit.KILOGRAM = new Unit(1, Dimensions.MASS, SYMBOLS_SI);
        /**
         * Unit of length.
         * The meter is the length of the path travelled by light in vacuum during a time interval of 1/299 792 458 of a second.
         */
        Unit.METER = new Unit(1, Dimensions.LENGTH, SYMBOLS_SI);
        /**
         * Unit of time.
         * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
         */
        Unit.SECOND = new Unit(1, Dimensions.TIME, SYMBOLS_SI);
        /**
         * Unit of electric charge.
         *
         */
        Unit.COULOMB = new Unit(1, Dimensions.ELECTRIC_CHARGE, SYMBOLS_SI);
        /**
         * Unit of electric current.
         * The ampere is that constant current which,
         * if maintained in two straight parallel conductors of infinite length,
         * of negligible circular cross-section,
         * and placed 1 meter apart in vacuum,
         * would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
         */
        Unit.AMPERE = new Unit(1, Dimensions.ELECTRIC_CURRENT, SYMBOLS_SI);
        /**
         * Unit of thermodynamic temperature.
         * The kelvin, unit of thermodynamic temperature, is the fraction 1/273.16 of the thermodynamic temperature of the triple point of water.
         */
        Unit.KELVIN = new Unit(1, Dimensions.THERMODYNAMIC_TEMPERATURE, SYMBOLS_SI);
        /**
         * Unit of amount of substance.
         * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
         * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
         */
        Unit.MOLE = new Unit(1, Dimensions.AMOUNT_OF_SUBSTANCE, SYMBOLS_SI);
        /**
         * Unit of luminous intensity.
         * The candela is the luminous intensity, in a given direction,
         * of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1/683 watt per steradian.
         */
        Unit.CANDELA = new Unit(1, Dimensions.LUMINOUS_INTENSITY, SYMBOLS_SI);
        Unit.COULOMB_SQUARED_PER_NEWTON = new Unit(1, Dimensions.ELECTRIC_PERMITTIVITY_TIMES_AREA, SYMBOLS_SI);
        Unit.ELECTRIC_FIELD = new Unit(1, Dimensions.ELECTRIC_FIELD, SYMBOLS_SI);
        /**
         *
         */
        Unit.NEWTON = new Unit(1, Dimensions.FORCE, SYMBOLS_SI);
        /**
         *
         */
        Unit.JOULE = new Unit(1, Dimensions.ENERGY_OR_TORQUE, SYMBOLS_SI);
        /**
         * The unit of angular momentum.
         */
        Unit.JOULE_SECOND = new Unit(1, Dimensions.ANGULAR_MOMENTUM, SYMBOLS_SI);
        Unit.METER_SQUARED = new Unit(1, Dimensions.AREA, SYMBOLS_SI);
        Unit.METER_CUBED = new Unit(1, Dimensions.VOLUME, SYMBOLS_SI);
        Unit.SECOND_SQUARED = new Unit(1, Dimensions.TIME_SQUARED, SYMBOLS_SI);
        Unit.INV_KILOGRAM = new Unit(1, Dimensions.INV_MASS, SYMBOLS_SI);
        Unit.INV_METER = new Unit(1, Dimensions.INV_LENGTH, SYMBOLS_SI);
        /**
         * The unit of angular velocity.
         */
        Unit.INV_SECOND = new Unit(1, Dimensions.INV_TIME, SYMBOLS_SI);
        /**
         * The unit of moment of inertia.
         */
        Unit.KILOGRAM_METER_SQUARED = new Unit(1, Dimensions.MOMENT_OF_INERTIA, SYMBOLS_SI);
        /**
         * The unit of linear momentum.
         */
        Unit.KILOGRAM_METER_PER_SECOND = new Unit(1, Dimensions.MOMENTUM, SYMBOLS_SI);
        Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions.MOMENTUM_SQUARED, SYMBOLS_SI);
        Unit.INV_KILOGRAM_METER_SQUARED = new Unit(1, Dimensions.INV_MOMENT_OF_INERTIA, SYMBOLS_SI);
        /**
         * The unit for a Spring constant, N/m.
         */
        Unit.STIFFNESS = new Unit(1, Dimensions.STIFFNESS, SYMBOLS_SI);
        /**
         * The unit for a Friction Coefficient, Ns/m.
         */
        Unit.FRICTION_COEFFICIENT = new Unit(1, Dimensions.FRICTION_COEFFICIENT, SYMBOLS_SI);
        /**
         *
         */
        Unit.METER_PER_SECOND = new Unit(1, Dimensions.VELOCITY, SYMBOLS_SI);
        Unit.METER_SQUARED_PER_SECOND = new Unit(1, Dimensions.RATE_OF_CHANGE_OF_AREA, SYMBOLS_SI);
        Unit.METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions.VELOCITY_SQUARED, SYMBOLS_SI);
        return Unit;
    }());

    /**
     * @hidden
     */
    function zeroArray(xs) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            xs[i] = 0;
        }
    }

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * A differential equation solver that achieves O(h cubed) Local Truncation Error (LTE),
     * where h is the step size.
     * @hidden
     */
    var RungeKutta = /** @class */ (function () {
        /**
         * Constructs a differential equation solver (integrator) that uses the classical Runge-Kutta method.
         * @param system The model that provides the system state and computes rates of change.
         */
        function RungeKutta(system) {
            this.system = system;
            this.invals = [];
            this.inuoms = [];
            this.k1vals = [];
            this.k1uoms = [];
            this.k2vals = [];
            this.k2uoms = [];
            this.k3vals = [];
            this.k3uoms = [];
            this.k4vals = [];
            this.k4uoms = [];
            mustBeNonNullObject('system', system);
        }
        /**
         *
         */
        RungeKutta.prototype.step = function (stepSize, uomStep) {
            var system = this.system;
            var stateVals = system.getState();
            var stateUoms = system.getUnits();
            var N = stateVals.length;
            if (this.invals.length < N) {
                this.invals = new Array(N);
                this.inuoms = new Array(N);
                this.k1vals = new Array(N);
                this.k1uoms = new Array(N);
                this.k2vals = new Array(N);
                this.k2uoms = new Array(N);
                this.k3vals = new Array(N);
                this.k3uoms = new Array(N);
                this.k4vals = new Array(N);
                this.k4uoms = new Array(N);
            }
            var invals = this.invals;
            var inuoms = this.inuoms;
            var k1vals = this.k1vals;
            var k1uoms = this.k1uoms;
            var k2vals = this.k2vals;
            var k2uoms = this.k2uoms;
            var k3vals = this.k3vals;
            var k3uoms = this.k3uoms;
            var k4vals = this.k4vals;
            var k4uoms = this.k4uoms;
            // evaluate at time t
            for (var i = 0; i < N; i++) {
                invals[i] = stateVals[i];
                inuoms[i] = stateUoms[i];
            }
            zeroArray(k1vals);
            system.evaluate(invals, inuoms, k1vals, k1uoms, 0, uomStep);
            // evaluate at time t + stepSize / 2
            for (var i = 0; i < N; i++) {
                if (i > 10 && !Unit.isOne(uomStep)) {
                    if (Unit.isOne(k1uoms[i]) && k1vals[i] !== 0) {
                        throw new Error("i=" + i + ", stateVals[" + i + "]=" + stateVals[i] + ", stateUoms[" + i + "]=" + stateUoms[i] + ", k1vals[" + i + "]=" + k1vals[i] + ", k1uoms[" + i + "]=" + k1uoms[i] + ", uomStep=" + uomStep);
                    }
                }
                var uom = Unit.mul(k1uoms[i], uomStep);
                if (stateVals[i] !== 0) {
                    try {
                        if (k1vals[i] !== 0) {
                            inuoms[i] = Unit.compatible(stateUoms[i], uom);
                        }
                        else {
                            // console.log(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k1vals[${i}]=${k1vals[i]}, k1uoms[${i}]=${k1uoms[i]}, uomStep=${uomStep}`);
                            // inuoms[i] = stateUoms[i];
                            inuoms[i] = uom;
                        }
                    }
                    catch (e) {
                        var cause = (e instanceof Error) ? e.message : "" + e;
                        throw new Error(system.getVariableName(i) + ". Cause: " + cause);
                        // It would be good to translate the index into a variable name.
                        // system.getVariableName(i);
                        // throw new Error(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k1vals[${i}]=${k1vals[i]}, k1uoms[${i}]=${k1uoms[i]}, uomStep=${uomStep}. Cause: ${e}`);
                    }
                }
                else {
                    inuoms[i] = uom;
                }
                invals[i] = stateVals[i] + k1vals[i] * stepSize / 2;
            }
            zeroArray(k2vals);
            system.evaluate(invals, inuoms, k2vals, k2uoms, stepSize / 2, uomStep);
            // evaluate at time t + stepSize / 2
            for (var i = 0; i < N; i++) {
                var uom = Unit.mul(k2uoms[i], uomStep);
                if (stateVals[i] !== 0) {
                    try {
                        if (k2vals[i] !== 0) {
                            inuoms[i] = Unit.compatible(stateUoms[i], uom);
                        }
                        else {
                            // console.log(`i=${i}, stateVals[${i}]=${stateVals[i]}, stateUoms[${i}]=${stateUoms[i]}, k2vals[${i}]=${k2vals[i]}, k2uoms[${i}]=${k2uoms[i]}, uomStep=${uomStep}`);
                            // inuoms[i] = stateUoms[i];
                            inuoms[i] = uom;
                        }
                    }
                    catch (e) {
                        throw new Error("i=" + i + ", stateVals[" + i + "]=" + stateVals[i] + ", stateUoms[" + i + "]=" + stateUoms[i] + ", k2vals[" + i + "]=" + k2vals[i] + ", k2uoms[" + i + "]=" + k2uoms[i] + ", uomStep=" + uomStep + ". Cause: " + e);
                    }
                }
                else {
                    inuoms[i] = uom;
                }
                invals[i] = stateVals[i] + k2vals[i] * stepSize / 2;
            }
            zeroArray(k3vals);
            system.evaluate(invals, inuoms, k3vals, k3uoms, stepSize / 2, uomStep);
            // evaluate at time t + stepSize
            for (var i = 0; i < N; i++) {
                var uom = Unit.mul(k3uoms[i], uomStep);
                if (stateVals[i] !== 0) {
                    try {
                        if (k3vals[i] !== 0) {
                            inuoms[i] = Unit.compatible(stateUoms[i], uom);
                        }
                        else {
                            // inuoms[i] = stateUoms[i];
                            inuoms[i] = uom;
                        }
                    }
                    catch (e) {
                        throw new Error("i=" + i + ", stateVals[" + i + "]=" + stateVals[i] + ", stateUoms[" + i + "]=" + stateUoms[i] + ", k3vals[" + i + "]=" + k3vals[i] + ", k3uoms[" + i + "]=" + k3uoms[i] + ", uomStep=" + uomStep + ". Cause: " + e);
                    }
                }
                else {
                    inuoms[i] = uom;
                }
                invals[i] = stateVals[i] + k3vals[i] * stepSize;
            }
            zeroArray(k4vals);
            system.evaluate(invals, inuoms, k4vals, k4uoms, stepSize, uomStep);
            for (var i = 0; i < N; i++) {
                var uom = Unit.mul(k4uoms[i], uomStep);
                if (stateVals[i] !== 0) {
                    try {
                        if (k4vals[i] !== 0) {
                            stateUoms[i] = Unit.compatible(stateUoms[i], uom);
                        }
                        else {
                            // Do nothing.
                            stateUoms[i] = uom;
                        }
                    }
                    catch (e) {
                        throw new Error("i=" + i + ", stateVals[" + i + "]=" + stateVals[i] + ", stateUoms[" + i + "]=" + stateUoms[i] + ", k4vals[" + i + "]=" + k4vals[i] + ", k4uoms[" + i + "]=" + k4uoms[i] + ", uomStep=" + uomStep + ". Cause: " + e);
                    }
                }
                else {
                    stateUoms[i] = uom;
                }
                stateVals[i] += (k1vals[i] + 2 * k2vals[i] + 2 * k3vals[i] + k4vals[i]) * stepSize / 6;
            }
            system.setState(stateVals);
            system.setUnits(stateUoms);
        };
        return RungeKutta;
    }());

    /**
     * @hidden
     */
    var DefaultAdvanceStrategy = /** @class */ (function () {
        /**
         *
         */
        function DefaultAdvanceStrategy(simulation, solver) {
            this.simulation = simulation;
            this.solver = solver;
            mustBeNonNullObject('simulation', simulation);
            mustBeNonNullObject('solver', solver);
        }
        /**
         * 1. Update the state vector from bodies.
         * 2. The solver integrates the derivatives from the simulation.
         * 3. Compute system variables such as energies, linear momentum, and angular momentum.
         */
        DefaultAdvanceStrategy.prototype.advance = function (stepSize, uomStep) {
            mustBeNumber("stepSize", stepSize);
            this.simulation.prolog(stepSize, uomStep);
            this.solver.step(stepSize, uomStep);
            this.simulation.epilog(stepSize, uomStep);
        };
        return DefaultAdvanceStrategy;
    }());

    /**
     * @hidden
     */
    function isBoolean(x) {
        return (typeof x === 'boolean');
    }

    /**
     * @hidden
     */
    function beBoolean() {
        return "be `boolean`";
    }
    /**
     * @hidden
     */
    function mustBeBoolean(name, value, contextBuilder) {
        mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
        return value;
    }

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
     * Converts the text to the corresponding name identifier by changing to uppercase
     * and replacing spaces and dashes with underscores.
     * @hidden
     */
    function toName(text) {
        return text.toUpperCase().replace(/[ -]/g, '_');
    }

    /**
     * @hidden
     * @param xs
     * @returns
     */
    function clone(xs) {
        var length = xs.length;
        var rv = new Array(length);
        for (var i = 0; i < length; i++) {
            rv[i] = xs[i];
        }
        return rv;
    }

    /**
     * @hidden
     * @param xs
     * @param x
     * @returns
     */
    function contains(xs, x) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            if (xs[i] === x) {
                return true;
            }
        }
        return false;
    }

    /**
     * Search an array for the first element that satisfies a given condition and
     * return its index. Returns the index of the first array element that passes the test,
     * or -1 if no element is found.
     * @hidden
     */
    function findIndex(xs, test) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            var x = xs[i];
            if (test(x, i)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Search an array for the first element that satisfies a given condition and
     * return that element. Returns the first array element that passes the test,
     * or null if no element is found.
     * @hidden
     */
    function find(xs, test) {
        var i = findIndex(xs, test);
        return i < 0 ? null : xs[i];
    }

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
     * Ensures the given text consists of only uppercase letters, numbers and underscore
     * and first character is a letter or underscore.
     * @hidden
     */
    function validName(text) {
        if (!isValidName(text)) {
            throw new Error("The string '" + text + "' is not a valid name. The name must consist of only uppercase letters, numbers, and underscore. The first character must be a letter or an underscore.");
        }
        return text;
    }
    /**
     * @hidden
     * @param text
     * @returns
     */
    function isValidName(text) {
        if (text.match(/^[A-Z_][A-Z_0-9]*$/)) {
            return true;
        }
        else {
            return false;
        }
    }

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var ParameterBoolean = /** @class */ (function () {
        // private getter_: () => boolean;
        // private setter_: (value: boolean) => any;
        // private isComputed_: boolean;
        // private choices_: string[];
        // private values_: boolean[];
        function ParameterBoolean(subject, name, getter, setter, choices, values) {
            this.subject_ = subject;
            this.name_ = validName(toName(name));
            // this.getter_ = getter;
            // this.setter_ = setter;
            // this.isComputed_ = false;
            // this.choices_ = [];
            // this.values_ = [];
        }
        Object.defineProperty(ParameterBoolean.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: false,
            configurable: true
        });
        ParameterBoolean.prototype.getSubject = function () {
            return this.subject_;
        };
        ParameterBoolean.prototype.nameEquals = function (name) {
            return this.name_ === toName(name);
        };
        ParameterBoolean.prototype.setComputed = function (value) {
            // this.isComputed_ = value;
        };
        return ParameterBoolean;
    }());

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var ParameterNumber = /** @class */ (function () {
        // private choices_: string[];
        // private values_: number[];
        function ParameterNumber(subject, name, getter, setter, choices, values) {
            this.subject_ = subject;
            this.name_ = validName(toName(name));
            this.getter_ = getter;
            // this.setter_ = setter;
            // this.isComputed_ = false;
            // this.signifDigits_ = 3;
            // this.decimalPlaces_ = -1;
            // this.lowerLimit_ = 0;
            // this.upperLimit_ = Number.POSITIVE_INFINITY;
            // this.choices_ = [];
            // this.values_ = [];
        }
        Object.defineProperty(ParameterNumber.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: false,
            configurable: true
        });
        ParameterNumber.prototype.getSubject = function () {
            return this.subject_;
        };
        ParameterNumber.prototype.getValue = function () {
            return this.getter_();
        };
        ParameterNumber.prototype.nameEquals = function (name) {
            return this.name_ === toName(name);
        };
        ParameterNumber.prototype.setComputed = function (value) {
            // this.isComputed_ = value;
        };
        /**
         * Sets the lower limit; the Parameter value is not allowed to be less than this,
         * {@link #setValue} will throw an Error in that case.
         * @param lowerLimit the lower limit of the Parameter value
         * @return this Parameter for chaining setters
         * @throws {Error} if the value is currently less than the lower limit, or the lower limit is not a number
         */
        ParameterNumber.prototype.setLowerLimit = function (lowerLimit) {
            if (lowerLimit > this.getValue() || lowerLimit > this.upperLimit_)
                throw new Error('out of range');
            // this.lowerLimit_ = lowerLimit;
            return this;
        };
        /**
         * Sets suggested number of significant digits to show. This affects the number of
         * decimal places that are displayed. Examples: if significant digits is 3, then we would
         * show numbers as: 12345, 1234, 123, 12.3, 1.23, 0.123, 0.0123, 0.00123.
         * @param signifDigits suggested number of significant digits to show
         * @return this Parameter for chaining setters
         */
        ParameterNumber.prototype.setSignifDigits = function (signifDigits) {
            // this.signifDigits_ = signifDigits;
            return this;
        };
        return ParameterNumber;
    }());

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var ParameterString = /** @class */ (function () {
        // private setter_: (value: string) => any;
        // private isComputed_: boolean;
        /**
         * suggested length of string for making a control
         */
        // private suggestedLength_: number;
        /**
         * maximum length of string
         */
        // private maxLength_: number;
        // private choices_: string[];
        // private values_: string[];
        // private inputFunction_: (value: string) => string;
        function ParameterString(subject, name, getter, setter, choices, values) {
            this.subject_ = subject;
            this.name_ = validName(toName(name));
            this.getter_ = getter;
            // this.setter_ = setter;
            // this.isComputed_ = false;
            // this.suggestedLength_ = 20;
            // this.maxLength_ = Number.POSITIVE_INFINITY;
            // this.choices_ = [];
            // this.values_ = [];
            // this.inputFunction_ = null;
        }
        Object.defineProperty(ParameterString.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: false,
            configurable: true
        });
        ParameterString.prototype.getSubject = function () {
            return this.subject_;
        };
        ParameterString.prototype.getValue = function () {
            return this.getter_();
        };
        ParameterString.prototype.nameEquals = function (name) {
            return this.name_ === toName(name);
        };
        ParameterString.prototype.setComputed = function (value) {
            // this.isComputed_ = value;
        };
        return ParameterString;
    }());

    /**
     * @hidden
     * Removes from an array the element at the specified index.
     * @param xs Array or array like object from which to remove value.
     * @param index The index to remove.
     * @return True if an element was removed.
     */
    function removeAt(xs, index) {
        // use generic form of splice
        // splice returns the removed items and if successful the length of that
        // will be 1
        return Array.prototype.splice.call(xs, index, 1).length === 1;
    }

    /**
     * @hidden
     * Removes the first occurrence of a particular value from an array.
     * @param xs Array from which to remove value.
     * @param x Object to remove.
     * @return True if an element was removed.
     */
    function remove(xs, x) {
        var i = xs.indexOf(x);
        var rv;
        if ((rv = i >= 0)) {
            removeAt(xs, i);
        }
        return rv;
    }

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var AbstractSubject = /** @class */ (function () {
        function AbstractSubject() {
            /**
             *
             */
            this.doBroadcast_ = true;
            /**
             *
             */
            this.observers_ = [];
            /**
             *
             */
            this.paramList_ = [];
        }
        /**
         * @hidden
         * @param observer
         */
        AbstractSubject.prototype.addObserver = function (observer) {
            if (!contains(this.observers_, observer)) {
                this.observers_.push(observer);
            }
        };
        /**
         * @hidden
         * @param observer
         */
        AbstractSubject.prototype.removeObserver = function (observer) {
            remove(this.observers_, observer);
        };
        /**
         * Adds the Parameter to the list of this Subject's available Parameters.
         * @param parameter the Parameter to add
         * @hidden
         */
        AbstractSubject.prototype.addParameter = function (parameter) {
            var name = parameter.name;
            var p = this.getParam(name);
            if (p != null) {
                throw new Error('parameter ' + name + ' already exists: ' + p);
            }
            this.paramList_.push(parameter);
        };
        /**
         * Returns the Parameter with the given name, or null if not found
         * @param name name of parameter to search for
         * @return the Parameter with the given name, or null if not found
         */
        AbstractSubject.prototype.getParam = function (name) {
            name = toName(name);
            return find(this.paramList_, function (p) {
                return p.name === name;
            });
        };
        /**
         *
         * @param name
         * @returns
         * @hidden
         */
        AbstractSubject.prototype.getParameter = function (name) {
            var p = this.getParam(name);
            if (p != null) {
                return p;
            }
            throw new Error('Parameter not found ' + name);
        };
        /**
         *
         * @param name
         * @returns
         * @hidden
         */
        AbstractSubject.prototype.getParameterBoolean = function (name) {
            var p = this.getParam(name);
            if (p instanceof ParameterBoolean) {
                return p;
            }
            throw new Error('ParameterBoolean not found ' + name);
        };
        /**
         *
         * @param name
         * @returns
         * @hidden
         */
        AbstractSubject.prototype.getParameterNumber = function (name) {
            var p = this.getParam(name);
            if (p instanceof ParameterNumber) {
                return p;
            }
            throw new Error('ParameterNumber not found ' + name);
        };
        /**
         *
         * @param name
         * @returns
         * @hidden
         */
        AbstractSubject.prototype.getParameterString = function (name) {
            var p = this.getParam(name);
            if (p instanceof ParameterString) {
                return p;
            }
            throw new Error('ParameterString not found ' + name);
        };
        /**
         *
         * @returns
         * @hidden
         */
        AbstractSubject.prototype.getParameters = function () {
            return clone(this.paramList_);
        };
        /**
         *
         * @param event
         * @hidden
         */
        AbstractSubject.prototype.broadcast = function (event) {
            if (this.doBroadcast_) {
                var len = this.observers_.length;
                for (var i = 0; i < len; i++) {
                    this.observers_[i].observe(event);
                }
            }
        };
        /**
         *
         * @param name
         * @hidden
         */
        AbstractSubject.prototype.broadcastParameter = function (name) {
            var p = this.getParam(name);
            if (p === null) {
                throw new Error('unknown Parameter ' + name);
            }
            this.broadcast(p);
        };
        /**
         * Returns whether this Subject is broadcasting events.
         * @return {boolean} whether this Subject is broadcasting events
         * @hidden
         */
        AbstractSubject.prototype.getBroadcast = function () {
            return this.doBroadcast_;
        };
        /**
         * @hidden
         */
        AbstractSubject.prototype.getObservers = function () {
            return clone(this.observers_);
        };
        return AbstractSubject;
    }());

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var GenericEvent = /** @class */ (function () {
        /**
         *
         */
        function GenericEvent(subject_, name, _value) {
            this.subject_ = subject_;
            this.name_ = validName(toName(name));
        }
        Object.defineProperty(GenericEvent.prototype, "name", {
            /**
             *
             */
            get: function () {
                return this.name_;
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         */
        GenericEvent.prototype.getSubject = function () {
            return this.subject_;
        };
        /**
         *
         */
        GenericEvent.prototype.nameEquals = function (name) {
            return this.name_ === toName(name);
        };
        return GenericEvent;
    }());

    /**
     * @hidden
     */
    var SimList = /** @class */ (function (_super) {
        __extends(SimList, _super);
        /**
         *
         */
        function SimList() {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.elements_ = [];
            return _this;
        }
        /**
         *
         */
        SimList.prototype.add = function (simObject) {
            for (var i = 0; i < arguments.length; i++) {
                var element = arguments[i];
                mustBeNonNullObject('element', element);
                if (!contains(this.elements_, element)) {
                    this.elements_.push(element);
                    this.broadcast(new GenericEvent(this, SimList.OBJECT_ADDED, element));
                }
            }
        };
        /**
         *
         */
        SimList.prototype.forEach = function (callBack) {
            return this.elements_.forEach(callBack);
        };
        /**
         *
         */
        SimList.prototype.remove = function (simObject) {
            if (remove(this.elements_, simObject)) {
                this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simObject));
            }
        };
        /**
         * Removes SimObjects from this SimList whose *expiration time* is less than the given time.
         * Notifies Observers by broadcasting the `OBJECT_REMOVED` event for each SimObject removed.
         * @param time the current simulation time
         */
        SimList.prototype.removeTemporary = function (time) {
            for (var i = this.elements_.length - 1; i >= 0; i--) {
                var simobj = this.elements_[i];
                if (simobj.expireTime < time) {
                    this.elements_.splice(i, 1);
                    this.broadcast(new GenericEvent(this, SimList.OBJECT_REMOVED, simobj));
                }
            }
        };
        /**
         *
         */
        SimList.OBJECT_ADDED = 'OBJECT_ADDED';
        /**
         *
         */
        SimList.OBJECT_REMOVED = 'OBJECT_REMOVED';
        return SimList;
    }(AbstractSubject));

    /**
     * @hidden
     */
    function isString(s) {
        return (typeof s === 'string');
    }

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
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

    /**
     * Returns a new array which is an expanded copy of the given array.
     * Adds `quantity` new entries at `position` location in the array.
     * Negative quantity will delete array entries.
     * @hidden
     */
    function extendArray(array, quantity, value) {
        if (quantity === 0) {
            return;
        }
        if (quantity < 0) {
            throw new Error();
        }
        var startIdx = array.length;
        array.length = startIdx + quantity;
        if (Array.isArray(value)) {
            var vs = value;
            if (vs.length !== quantity) {
                throw new Error();
            }
            for (var i = startIdx, n = array.length; i < n; i++) {
                array[i] = value[i - startIdx];
            }
        }
        else {
            for (var i = startIdx, n = array.length; i < n; i++) {
                array[i] = value;
            }
        }
    }

    /**
     * @hidden
     * A set of Variables.
     * Variables are numbered from `0` to `n-1` where `n` is the number of Variables.
     *
     * VarsList is a `Subject` and each Variable is a `Parameter` of the VarsList.
     *
     * Unlike other Subject classes, VarsList does not broadcast each Variable whenever the
     * Variable changes. And VarsList prohibits adding general Parameters in its
     * `addParameter` method, because it can only contain Variables.
     *
     * As a Subject, the VarsList will broadcast the `VARS_MODIFIED` event to its
     * Observers whenever Variables are added or removed.
     *
     * ### Continuous vs. Discontinuous Changes
     *
     * A change to a variable is either continuous or discontinuous. This affects how a line
     * graph of the variable is drawn: `DisplayGraph` doesn't draw a line at a point of discontinuity.
     * A discontinuity is indicated by incrementing the sequence number.
     *
     * It is important to note that `setValue` and `setValues` have an optional
     * parameter `continuous` which determines whether the change of variable is continuous or
     * discontinuous.
     *
     * Here are some guidelines about when a change in a variable should be marked as being
     * discontinuous by incrementing the sequence number:
     *
     * 1. When a change increments only a few variables, be sure to increment any variables
     * that are **dependent** on those variables. For example, if velocity of an object is
     * discontinuously changed, then the kinetic, potential and total energy should all be
     * marked as discontinuous.
     *
     * 2. When **dragging** an object, don't increment variables of other objects.
     *
     * 3. When some **parameter** such as gravity or mass changes, increment any derived
     * variables (like energy) that depend on that parameter.
     *
     * ## Deleted Variables
     *
     * When a variable is no longer used it has the reserved name 'DELETED'. Any such variable
     * should be ignored.  This allows variables to be added or removed without affecting the
     * index of other existing variables.
     *
     * ### Events Broadcast
     *
     * + GenericEvent name `VARS_MODIFIED`
     */
    var VarsList = /** @class */ (function (_super) {
        __extends(VarsList, _super);
        /**
         * Initializes the list of variables. The names argument must contain the reserved, case-insensitive, 'time' variable.
         * @param names  array of language-independent variable names;
         * these will be underscorized so the English names can be passed in here.
         */
        function VarsList(names) {
            var _this = _super.call(this) || this;
            /**
             * The zero-based index of the time variable.
             */
            _this.$timeIdx = -1;
            /**
             * The variables that provide the data for this wrapper.
             */
            _this.$variables = [];
            /**
             * A lazy cache of variable values to minimize creation of temporary objects.
             * This is only synchronized when the state is requested.
             */
            _this.$values = [];
            _this.$units = [];
            /**
             * Whether to save simulation state history.
             */
            _this.history_ = true;
            /**
             * Recent history of the simulation state for debugging.
             * An array of copies of the vars array.
             */
            _this.histArray_ = [];
            // console.lg(`VarsList.constructor(names=${JSON.stringify(names)})`);
            var howMany = names.length;
            if (howMany !== 0) {
                _this.addVariables(names);
            }
            // This call has the side-effect of throwing an exception if the time variable has not been defined.
            _this.getTime();
            return _this;
        }
        /**
         * Returns index to put a contiguous group of variables.  Expands the set of variables
         * if necessary.
         * @param quantity number of contiguous variables to allocate
         * @return index of first variable
         */
        VarsList.prototype.findOpenSlot_ = function (quantity) {
            var found = 0;
            var startIdx = -1;
            for (var i = 0, n = this.$variables.length; i < n; i++) {
                if (this.$variables[i].name === VarsList.DELETED) {
                    if (startIdx === -1) {
                        startIdx = i;
                    }
                    found++;
                    if (found >= quantity) {
                        return startIdx;
                    }
                }
                else {
                    startIdx = -1;
                    found = 0;
                }
            }
            var expand;
            if (found > 0) {
                // Found a group of deleted variables at end of VarsList, but need more.
                // Expand to get full quantity.
                expand = quantity - found;
            }
            else {
                // Did not find contiguous group of deleted variables of requested size.
                // Add space at end of current variables.
                startIdx = this.$variables.length;
                expand = quantity;
            }
            var newVars = [];
            for (var i = 0; i < expand; i++) {
                newVars.push(new ConcreteVariable(this, VarsList.DELETED));
            }
            extendArray(this.$variables, expand, newVars);
            return startIdx;
        };
        /**
         * Add a contiguous block of variables.
         * @param names language-independent names of variables; these will be
         * underscorized so the English name can be passed in here.
         * @return index index of first Variable that was added
         * @throws if any of the variable names is 'DELETED', or array of names is empty
         */
        VarsList.prototype.addVariables = function (names) {
            // TODO: This is used BOTH when adding a body and when constructing the summary variables.
            // But the check for the time variable only happens for the summary variables (and could be
            // prohibited for adding a body). Additionally, the broadcast does not make sense in the constructor
            // since there would be no listeners.
            var howMany = names.length;
            if (howMany === 0) {
                throw new Error("names must not be empty.");
            }
            var position = this.findOpenSlot_(howMany);
            for (var i = 0; i < howMany; i++) {
                var name_1 = validName(toName(names[i]));
                if (name_1 === VarsList.DELETED) {
                    throw new Error("variable cannot be named '" + VarsList.DELETED + "'.");
                }
                var idx = position + i;
                // DRY: Why aren't we delegating to this.addVariable with the newly created variable?
                this.$variables[idx] = new ConcreteVariable(this, name_1);
                if (name_1 === VarsList.TIME) {
                    // auto-detect time variable
                    this.$timeIdx = idx;
                }
            }
            this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
            return position;
        };
        /**
         * Deletes a contiguous block of variables.
         * Delete several variables, but leaves those places in the array as empty spots that
         * can be allocated in future with `addVariables`. Until an empty spot is
         * reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
         * should not be used.
         * @param index index of first variable to delete
         * @param howMany number of variables to delete
         */
        VarsList.prototype.deleteVariables = function (index, howMany) {
            if (howMany === 0) {
                return;
            }
            if (howMany < 0 || index < 0 || index + howMany > this.$variables.length) {
                throw new Error('deleteVariables');
            }
            for (var i = index; i < index + howMany; i++) {
                this.$variables[i] = new ConcreteVariable(this, VarsList.DELETED);
            }
            this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
        };
        /**
         * Increments the sequence number for the specified variable(s), which indicates a
         * discontinuity has occurred in the value of this variable. This information is used in a
         * graph to prevent drawing a line between points that have a discontinuity.
         * @param indexes  the indexes of the variables;
         * if no index given then all variable's sequence numbers are incremented
         */
        VarsList.prototype.incrSequence = function () {
            var indexes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indexes[_i] = arguments[_i];
            }
            if (arguments.length === 0) {
                // increment sequence number on all variables
                for (var i = 0, n = this.$variables.length; i < n; i++) {
                    this.$variables[i].incrSequence();
                }
            }
            else {
                // increment sequence number only on specified variables
                for (var i = 0, n = arguments.length; i < n; i++) {
                    var idx = arguments[i];
                    this.checkIndex_(idx);
                    this.$variables[idx].incrSequence();
                }
            }
        };
        /**
         * Returns the current value of the variable with the given index.
         * @param index the index of the variable of interest
         * @return the current value of the variable of interest
         */
        VarsList.prototype.getValue = function (index) {
            this.checkIndex_(index);
            return this.$variables[index].getValue();
        };
        VarsList.prototype.getName = function (index) {
            this.checkIndex_(index);
            return this.$variables[index].name;
        };
        VarsList.prototype.getSequence = function (index) {
            this.checkIndex_(index);
            return this.$variables[index].getSequence();
        };
        /**
         * Returns an array with the current value of each variable.
         * The returned array is a copy of the variable values; changing the array will not change the variable values.
         * However, for performance, the array is maintained between invocations.
         */
        VarsList.prototype.getValues = function () {
            var values = this.$values;
            var variables = this.$variables;
            var N = variables.length;
            if (values.length !== N) {
                values.length = N;
            }
            for (var i = 0; i < N; i++) {
                values[i] = variables[i].getValue();
            }
            return this.$values;
        };
        /**
         * Sets the value of each variable from the given list of values. When the length of
         * `vars` is less than length of VarsList then the remaining variables are not modified.
         * Assumes this is a discontinous change, so the sequence number is incremented
         * unless you specify that this is a continuous change in the variable.
         * @param vars array of state variables
         * @param continuous `true` means this new value is continuous with
         * previous values; `false` (the default) means the new value is discontinuous with
         * previous values, so the sequence number for the variable is incremented
         * @throws if length of `vars` exceeds length of VarsList
         */
        VarsList.prototype.setValues = function (vars, continuous) {
            if (continuous === void 0) { continuous = false; }
            var N = this.$variables.length;
            var n = vars.length;
            if (n > N) {
                throw new Error("setValues bad length n = " + n + " > N = " + N);
            }
            for (var i = 0; i < N; i++) {
                if (i < n) {
                    this.setValue(i, vars[i], continuous);
                }
            }
        };
        /**
         * @hidden
         */
        VarsList.prototype.setValuesContinuous = function (vars) {
            var N = this.$variables.length;
            var n = vars.length;
            for (var i = 0; i < N; i++) {
                if (i < n) {
                    this.setValueContinuous(i, vars[i]);
                }
            }
        };
        /**
         * Sets the specified variable to the given value. Variables are numbered starting at
         * zero. Assumes this is a discontinous change, so the sequence number is incremented
         * unless you specify that this is a continuous change in the variable.
         * @param index  the index of the variable within the array of variables
         * @param value  the value to set the variable to
         * @param continuous `true` means this new value is continuous with
         * previous values; `false` (the default) means the new value is discontinuous with
         * previous values, so the sequence number for the variable is incremented
         * @throws if value is `NaN`
         */
        VarsList.prototype.setValue = function (index, value, continuous) {
            if (continuous === void 0) { continuous = false; }
            this.checkIndex_(index);
            var variable = this.$variables[index];
            if (isNaN(value)) {
                throw new Error('cannot set variable ' + variable.name + ' to NaN');
            }
            if (continuous) {
                variable.setValueContinuous(value);
            }
            else {
                variable.setValueJump(value);
            }
        };
        /**
         * @hidden
         */
        VarsList.prototype.setValueContinuous = function (index, value) {
            var variable = this.$variables[index];
            variable.setValueContinuous(value);
        };
        /**
         * @hidden
         */
        VarsList.prototype.setValueJump = function (index, value) {
            var variable = this.$variables[index];
            if (variable) {
                variable.setValueJump(value);
            }
            else {
                throw new Error("index is invalid in setValueJump(index=" + index + ", value=" + value + ").");
            }
        };
        VarsList.prototype.getUnits = function () {
            var units = this.$units;
            var variables = this.$variables;
            var N = variables.length;
            if (units.length !== N) {
                units.length = N;
            }
            for (var i = 0; i < N; i++) {
                units[i] = variables[i].getUnit();
            }
            return this.$units;
        };
        VarsList.prototype.setUnits = function (units) {
            var N = this.$variables.length;
            var n = units.length;
            if (n > N) {
                throw new Error("setUnits bad length n = " + n + " > N = " + N);
            }
            for (var i = 0; i < N; i++) {
                if (i < n) {
                    this.setUnit(i, units[i]);
                }
            }
        };
        VarsList.prototype.setUnit = function (index, unit) {
            this.checkIndex_(index);
            var variable = this.$variables[index];
            variable.setUnit(unit);
        };
        /**
         *
         */
        VarsList.prototype.checkIndex_ = function (index) {
            if (index < 0 || index >= this.$variables.length) {
                throw new Error('bad variable index=' + index + '; numVars=' + this.$variables.length);
            }
        };
        //
        // Add a Variable to this VarsList.
        // @param variable the Variable to add
        // @return the index number of the variable
        // @throws if name if the Variable is 'DELETED'
        //
        /*
        private addVariable(variable: Variable): number {
            const name = variable.name;
            if (name === VarsList.DELETED) {
                throw new Error(`variable cannot be named '${VarsList.DELETED}'`);
            }
            // add variable to first open slot
            const position = this.findOpenSlot_(1);
            this.$variables[position] = variable;
            if (name === VarsList.TIME) {
                // auto-detect time variable
                this.$timeIdx = position;
            }
            this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
            return position;
        }
        */
        /**
         * Whether recent history is being stored, see `saveHistory`.
         * @return true if recent history is being stored
         */
        VarsList.prototype.getHistory = function () {
            return this.history_;
        };
        VarsList.prototype.getParameter = function (name) {
            name = toName(name);
            var p = find(this.$variables, function (p) {
                return p.name === name;
            });
            if (p != null) {
                return p;
            }
            throw new Error('Parameter not found ' + name);
        };
        VarsList.prototype.getParameters = function () {
            return clone(this.$variables);
        };
        /**
         * Returns the value of the time variable, or throws an exception if there is no time variable.
         *
         * There are no explicit units for the time, so you can regard a time unit as any length
         * of time, as long as it is consistent with other units.
         * @return the current simulation time
         * @throws if there is no time variable
         */
        VarsList.prototype.getTime = function () {
            if (this.$timeIdx < 0) {
                throw new Error('No time variable.');
            }
            return this.getValue(this.$timeIdx);
        };
        /**
         * Returns the Variable object at the given index or with the given name
         * @param id the index or name of the variable; the name can be the
         * English or language independent version of the name
         * @return the Variable object at the given index or with the given name
         */
        VarsList.prototype.getVariable = function (id) {
            var index;
            if (isNumber(id)) {
                index = id;
            }
            else if (isString(id)) {
                id = toName(id);
                index = findIndex(this.$variables, function (v) { return v.name === id; });
                if (index < 0) {
                    throw new Error('unknown variable name ' + id);
                }
            }
            else {
                throw new Error();
            }
            this.checkIndex_(index);
            return this.$variables[index];
        };
        /**
         * Returns the number of variables available. This includes any deleted
         * variables (which are not being used and should be ignored).
         * @return the number of variables in this VarsList
         */
        VarsList.prototype.numVariables = function () {
            return this.$variables.length;
        };
        /**
         * Saves the current variables in a 'history' set, for debugging, to be able to
         * reproduce an error condition. See `printHistory`.
         */
        VarsList.prototype.saveHistory = function () {
            if (this.history_) {
                var v = this.getValues();
                v.push(this.getTime());
                this.histArray_.push(v); // adds element to end of histArray_
                if (this.histArray_.length > 20) {
                    // to prevent filling memory, only keep recent history entries
                    this.histArray_.shift(); // removes element at histArray_[0]
                }
            }
        };
        /**
         * Indicates the specified Variables are being automatically computed.
         * @param indexes  the indexes of the variables
         */
        VarsList.prototype.setComputed = function () {
            var indexes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indexes[_i] = arguments[_i];
            }
            for (var i = 0, n = arguments.length; i < n; i++) {
                var idx = arguments[i];
                this.checkIndex_(idx);
                this.$variables[idx].setComputed(true);
            }
        };
        /**
         * Sets whether to store recent history, see {@link #saveHistory}.
         * @param value true means recent history should be stored
         */
        VarsList.prototype.setHistory = function (value) {
            this.history_ = value;
        };
        /**
         * Sets the current simulation time.
         * @param time the current simulation time.
         * @throws {Error} if there is no time variable
         */
        VarsList.prototype.setTime = function (time) {
            this.setValueJump(this.$timeIdx, time);
        };
        /**
         * Returns the index of the time variable, or -1 if there is no time variable.
         */
        VarsList.prototype.timeIndex = function () {
            return this.$timeIdx;
        };
        /**
         * Returns the set of Variable objects in this VarsList, in their correct ordering.
         */
        VarsList.prototype.toArray = function () {
            return clone(this.$variables);
        };
        /**
         * This name cannot be used as a variable name.
         */
        VarsList.DELETED = 'DELETED';
        /**
         * This name is the reserved name for the time variable.
         */
        VarsList.TIME = 'TIME';
        /**
         *
         */
        VarsList.VARS_MODIFIED = 'VARS_MODIFIED';
        return VarsList;
    }(AbstractSubject));

    /**
     * @hidden
     * @param varNames
     * @returns
     */
    function varNamesContainsTime(varNames) {
        if (Array.isArray(varNames)) {
            return (varNames.indexOf('TIME') >= 0);
        }
        else {
            throw new Error("varNames must be an array.");
        }
    }

    /**
     * @hidden
     */
    var ONE$1 = Unit.ONE;
    /**
     * @hidden
     */
    var MASS = Unit.KILOGRAM;
    /**
     * @hidden
     */
    var LENGTH = Unit.METER;
    /**
     * @hidden
     */
    var TIME$1 = Unit.SECOND;
    /**
     * @hidden
     */
    var FREQUENCY$1 = Unit.INV_SECOND;
    /**
     * @hidden
     */
    var LINEAR_MOMENTUM = Unit.KILOGRAM_METER_PER_SECOND;
    /**
     * @hidden
     */
    var ANGULAR_MOMENTUM = Unit.JOULE_SECOND;
    /**
     * @hidden
     * @param measure
     * @param name
     * @param metric
     */
    function checkDimensionless(measure, name, metric) {
        if (!Unit.isOne(metric.uom(measure))) {
            throw new Error(name + ".uom should be " + ONE$1 + ", but was " + metric.uom(measure));
        }
    }
    /**
     * @hidden
     * @param measure
     * @param name
     * @param metric
     */
    function checkUnit(measure, name, metric, expectUom) {
        if (!Unit.isCompatible(metric.uom(measure), expectUom)) {
            throw new Error(name + ".uom should be " + expectUom + ", but was " + metric.uom(measure));
        }
    }
    /**
     * @hidden
     */
    function checkBodyKinematicUnits(body, metric, uomTime) {
        var M = body.M;
        var X = body.X;
        var R = body.R;
        var P = body.P;
        var L = body.L;
        var Ω = body.Ω;
        if (Unit.isOne(uomTime)) {
            checkDimensionless(M, 'M', metric);
            checkDimensionless(X, 'X', metric);
            checkDimensionless(R, 'R', metric);
            checkDimensionless(P, 'P', metric);
            checkDimensionless(L, 'L', metric);
            checkDimensionless(Ω, 'Ω', metric);
        }
        else if (Unit.isCompatible(uomTime, TIME$1)) {
            checkUnit(M, 'M', metric, MASS);
            checkUnit(X, 'X', metric, LENGTH);
            checkUnit(R, 'R', metric, ONE$1);
            checkUnit(P, 'P', metric, LINEAR_MOMENTUM);
            checkUnit(L, 'L', metric, ANGULAR_MOMENTUM);
            checkUnit(Ω, 'Ω', metric, FREQUENCY$1);
        }
    }

    /**
     * @hidden
     */
    var TIME = Unit.SECOND;
    /**
     * @hidden
     */
    var FREQUENCY = Unit.INV_SECOND;
    /**
     * @hidden
     */
    function checkBodyAngularVelocityUnits(body, metric, uomTime) {
        if (Unit.isOne(uomTime)) {
            if (!Unit.isOne(metric.uom(body.Ω))) {
                throw new Error("body.\u03A9.uom=" + metric.uom(body.Ω) + ", but uomTime=" + uomTime + ".");
            }
        }
        else if (Unit.isCompatible(uomTime, TIME)) {
            if (!Unit.isCompatible(metric.uom(body.Ω), FREQUENCY)) {
                throw new Error("body.L.uom=" + metric.uom(body.L) + " but body.\u03A9.uom=" + metric.uom(body.Ω) + ", and uomTime=" + uomTime + ".");
            }
        }
        else {
            throw new Error();
        }
    }

    /**
     * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
     * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
     * @hidden
     */
    var Physics = /** @class */ (function (_super) {
        __extends(Physics, _super);
        /**
         * Constructs a Physics engine for 3D simulations.
         */
        function Physics(metric, dynamics) {
            var _this = _super.call(this) || this;
            _this.metric = metric;
            _this.dynamics = dynamics;
            /**
             *
             */
            _this.$simList = new SimList();
            /**
             * The RigidBody(s) in this simulation.
             */
            _this.$bodies = [];
            /**
             *
             */
            _this.$forceLaws = [];
            /**
             *
             */
            _this.$torqueLaws = [];
            /**
             *
             */
            _this.$constraints = [];
            /**
             *
             */
            _this.$driftLaws = [];
            /**
             *
             */
            _this.$showForces = false;
            /**
             *
             */
            _this.$showTorques = false;
            mustBeNonNullObject('metric', metric);
            mustBeNonNullObject('dynamics', dynamics);
            var varNames = dynamics.getVarNames();
            if (!varNamesContainsTime(varNames)) {
                throw new Error("Dynamics.getVarNames() must contain a time variable.");
            }
            _this.$varsList = new VarsList(varNames);
            _this.$potentialOffset = metric.zero();
            _this.$force = metric.zero();
            _this.$torque = metric.zero();
            _this.$totalEnergy = metric.zero();
            _this.$totalEnergyLock = metric.lock(_this.$totalEnergy);
            _this.$numVariablesPerBody = dynamics.numVarsPerBody();
            if (_this.$numVariablesPerBody <= 0) {
                throw new Error("Dynamics.numVarsPerBody() must define at least one variable per body.");
            }
            return _this;
        }
        Physics.prototype.getVariableName = function (idx) {
            return this.varsList.getVariable(idx).name;
        };
        Object.defineProperty(Physics.prototype, "showForces", {
            /**
             * Determines whether calculated forces will be added to the simulation list.
             */
            get: function () {
                return this.$showForces;
            },
            set: function (showForces) {
                mustBeBoolean('showForces', showForces);
                this.$showForces = showForces;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Physics.prototype, "showTorques", {
            /**
             * Determines whether calculated torques will be added to the simulation list.
             */
            get: function () {
                return this.$showTorques;
            },
            set: function (showTorques) {
                mustBeBoolean('showTorques', showTorques);
                this.$showTorques = showTorques;
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         */
        Physics.prototype.addBody = function (body) {
            mustBeNonNullObject('body', body);
            if (!contains(this.$bodies, body)) {
                // const X = body.X;
                // const R = body.R;
                // const P = body.P;
                // const L = body.L;
                var dynamics = this.dynamics;
                // create variables in vars array for this body
                var names = [];
                for (var k = 0; k < this.$numVariablesPerBody; k++) {
                    var name_1 = dynamics.getOffsetName(k);
                    if (isValidName(toName(name_1))) {
                        names.push(name_1);
                    }
                    else {
                        throw new Error("Body kinematic variable name, '" + name_1 + "', returned by Dynamics.getOffsetName(" + k + ") is not a valid name.");
                    }
                }
                body.varsIndex = this.$varsList.addVariables(names);
                // add body to end of list of bodies
                this.$bodies.push(body);
                this.$simList.add(body);
            }
            this.updateVarsFromBody(body);
            this.discontinuosChangeToEnergy();
        };
        /**
         *
         */
        Physics.prototype.removeBody = function (body) {
            mustBeNonNullObject('body', body);
            if (contains(this.$bodies, body)) {
                this.$varsList.deleteVariables(body.varsIndex, this.$numVariablesPerBody);
                remove(this.$bodies, body);
                body.varsIndex = -1;
            }
            this.$simList.remove(body);
            this.discontinuosChangeToEnergy();
        };
        /**
         *
         */
        Physics.prototype.addForceLaw = function (forceLaw) {
            mustBeNonNullObject('forceLaw', forceLaw);
            if (!contains(this.$forceLaws, forceLaw)) {
                this.$forceLaws.push(forceLaw);
            }
            this.discontinuosChangeToEnergy();
        };
        /**
         *
         */
        Physics.prototype.removeForceLaw = function (forceLaw) {
            mustBeNonNullObject('forceLaw', forceLaw);
            forceLaw.disconnect();
            this.discontinuosChangeToEnergy();
            remove(this.$forceLaws, forceLaw);
        };
        /**
         *
         */
        Physics.prototype.addTorqueLaw = function (torqueLaw) {
            mustBeNonNullObject('torqueLaw', torqueLaw);
            if (!contains(this.$torqueLaws, torqueLaw)) {
                this.$torqueLaws.push(torqueLaw);
            }
            this.discontinuosChangeToEnergy();
        };
        /**
         *
         */
        Physics.prototype.removeTorqueLaw = function (torqueLaw) {
            mustBeNonNullObject('torqueLaw', torqueLaw);
            torqueLaw.disconnect();
            this.discontinuosChangeToEnergy();
            remove(this.$torqueLaws, torqueLaw);
        };
        /**
         *
         * @param geometry
         */
        Physics.prototype.addConstraint = function (geometry) {
            mustBeNonNullObject('geometry', geometry);
            if (!contains(this.$constraints, geometry)) {
                this.$constraints.push(geometry);
            }
        };
        Physics.prototype.removeConstraint = function (geometry) {
            mustBeNonNullObject('geometry', geometry);
            remove(this.$constraints, geometry);
        };
        /**
         *
         */
        Physics.prototype.addDriftLaw = function (driftLaw) {
            mustBeNonNullObject('driftLaw', driftLaw);
            if (!contains(this.$driftLaws, driftLaw)) {
                this.$driftLaws.push(driftLaw);
            }
            this.discontinuosChangeToEnergy();
        };
        /**
         *
         */
        Physics.prototype.removeDriftLaw = function (driftLaw) {
            mustBeNonNullObject('driftLaw', driftLaw);
            driftLaw.disconnect();
            this.discontinuosChangeToEnergy();
            remove(this.$driftLaws, driftLaw);
        };
        Physics.prototype.discontinuosChangeToEnergy = function () {
            var _a;
            var dynamics = this.dynamics;
            (_a = this.$varsList).incrSequence.apply(_a, dynamics.discontinuousEnergyVars());
        };
        /**
         * Transfer state vector back to the rigid bodies.
         * Also takes care of updating auxiliary variables, which are also mutable.
         */
        Physics.prototype.updateBodiesFromStateVariables = function (vars, units, uomTime) {
            var dynamics = this.dynamics;
            var bodies = this.$bodies;
            var N = bodies.length;
            for (var i = 0; i < N; i++) {
                var body = bodies[i];
                var idx = body.varsIndex;
                if (idx < 0) {
                    return;
                }
                // Delegate the updating of the body from the state variables because
                // we do not know how to access the properties of the bodies in the
                // various dimensions.
                dynamics.updateBodyFromVars(vars, units, idx, body, uomTime);
                checkBodyAngularVelocityUnits(body, this.metric, uomTime);
            }
        };
        /**
         * Handler for actions to be performed before the evaluate calls.
         * The physics engine removes objects that were temporarily added to the simulation
         * list but have expired.
         * @hidden
         */
        Physics.prototype.prolog = function () {
            this.simList.removeTemporary(this.varsList.getTime());
        };
        /**
         * Gets the state vector, Y(t).
         * The returned array is a copy of the state vector variable values.
         * However, for performance, the array is maintained between invocations.
         * @hidden
         */
        Physics.prototype.getState = function () {
            return this.$varsList.getValues();
        };
        /**
         * Sets the state vector, Y(t).
         * @hidden
         */
        Physics.prototype.setState = function (state) {
            this.varsList.setValuesContinuous(state);
        };
        Physics.prototype.getUnits = function () {
            return this.$varsList.getUnits();
        };
        Physics.prototype.setUnits = function (units) {
            this.varsList.setUnits(units);
        };
        /**
         * The time value is not being used because the DiffEqSolver has updated the vars?
         * This will move the objects and forces will be recalculated.u
         * @hidden
         */
        Physics.prototype.evaluate = function (state, stateUnits, rateOfChangeVals, rateOfChangeUoms, Δt, uomTime) {
            var metric = this.metric;
            var dynamics = this.dynamics;
            // Move objects so that rigid body objects know their current state.
            this.updateBodiesFromStateVariables(state, stateUnits, uomTime);
            var bodies = this.$bodies;
            var Nb = bodies.length;
            for (var bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
                var body = bodies[bodyIndex];
                var idx = body.varsIndex;
                if (idx < 0) {
                    return;
                }
                var mass = metric.a(body.M);
                if (mass === Number.POSITIVE_INFINITY) {
                    for (var k = 0; k < this.$numVariablesPerBody; k++) {
                        rateOfChangeVals[idx + k] = 0; // infinite mass objects don't move
                    }
                }
                else {
                    checkBodyKinematicUnits(body, metric, uomTime);
                    dynamics.setPositionRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                    dynamics.setAttitudeRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                    dynamics.zeroLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                    dynamics.zeroAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime);
                }
            }
            this.applyForceLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
            this.applyTorqueLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
            this.applyConstraints(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
            this.applyDriftLaws(rateOfChangeVals, rateOfChangeUoms, Δt, uomTime);
            rateOfChangeVals[this.$varsList.timeIndex()] = 1;
        };
        /**
         *
         * @param rateOfChange (output)
         * @param rateOfChangeUnits (output)
         * @param Δt
         * @param uomTime
         */
        Physics.prototype.applyForceLaws = function (rateOfChange, rateOfChangeUnits, Δt, uomTime) {
            var forceLaws = this.$forceLaws;
            var N = forceLaws.length;
            for (var i = 0; i < N; i++) {
                var forceLaw = forceLaws[i];
                var forces = forceLaw.updateForces();
                var Nforces = forces.length;
                for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                    this.applyForce(rateOfChange, rateOfChangeUnits, forces[forceIndex], Δt, uomTime);
                }
            }
        };
        Physics.prototype.applyDriftLaws = function (rateOfChange, rateOfChangeUnits, Δt, uomTime) {
            var driftLaws = this.$driftLaws;
            var N = driftLaws.length;
            for (var i = 0; i < N; i++) {
                var driftLaw = driftLaws[i];
                var forces = driftLaw.updateForces();
                var Nforces = forces.length;
                for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                    this.applyForce(rateOfChange, rateOfChangeUnits, forces[forceIndex], Δt, uomTime);
                }
            }
        };
        /**
         * Applying forces gives rise to linear and angular momentum.
         * @param rateOfChangeVals (output)
         * @param rateOfChangeUoms (output)
         * @param forceApp The force application which results in a rate of change of linear and angular momentum
         */
        Physics.prototype.applyForce = function (rateOfChangeVals, rateOfChangeUoms, forceApp, Δt, uomTime) {
            var body = forceApp.getBody();
            if (!(contains(this.$bodies, body))) {
                return;
            }
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            var metric = this.metric;
            var dynamics = this.dynamics;
            // The rate of change of momentum is force.
            // dP/dt = F
            forceApp.computeForce(this.$force);
            var F = this.$force;
            // TODO: We may not need to bootstrap when units are correctly handled?
            // Bootstrap the linear momentum unit of measure for the body.
            if (Unit.isOne(metric.uom(body.P)) && metric.isZero(body.P)) {
                var uom = Unit.mul(metric.uom(F), uomTime);
                // console.lg(`Bootstrap P.uom to ${uom}`);
                metric.setUom(body.P, uom);
            }
            // TODO: Here we could apply geometric constraints on the forces.
            dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, F, uomTime);
            // The rate of change of angular momentum (bivector) is given by
            // dL/dt = r ^ F = Γ
            forceApp.computeTorque(this.$torque);
            var T = this.$torque;
            // TODO: We may not need to bootstrap when units are correctly handled?
            // Bootstrap the angular momentum unit of measure for the body.
            if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
                var uom = Unit.mul(metric.uom(T), uomTime);
                // console.lg(`Bootstrap L.uom to ${uom}`);
                metric.setUom(body.L, uom);
            }
            // TODO: Could we add geometric constraints for torques here?
            // TODO: we don't know how to handle the indices, so dynamics must check units compatibility.
            dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, T, uomTime);
            if (this.$showForces) {
                forceApp.expireTime = this.$varsList.getTime();
                this.$simList.add(forceApp);
            }
        };
        Physics.prototype.applyTorqueLaws = function (rateOfChange, units, Δt, uomTime) {
            var torqueLaws = this.$torqueLaws;
            var Ni = torqueLaws.length;
            for (var i = 0; i < Ni; i++) {
                var torqueLaw = torqueLaws[i];
                var torques = torqueLaw.updateTorques();
                var Nj = torques.length;
                for (var j = 0; j < Nj; j++) {
                    this.applyTorque(rateOfChange, units, torques[j], Δt, uomTime);
                }
            }
        };
        /**
         *
         * @param rateOfChangeVals (input/output)
         * @param rateOfChangeUoms (input/output)
         * @param torqueApp
         * @param Δt
         * @param uomTime
         * @returns
         */
        Physics.prototype.applyTorque = function (rateOfChangeVals, rateOfChangeUoms, torqueApp, Δt, uomTime) {
            var body = torqueApp.getBody();
            if (!(contains(this.$bodies, body))) {
                return;
            }
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            var metric = this.metric;
            var dynamics = this.dynamics;
            // The rate of change of angular momentum is torque.
            // dL/dt = T
            torqueApp.computeTorque(this.$torque);
            var T = this.$torque;
            // Bootstrap the angular momentum unit of measure.
            if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
                var uom = Unit.mul(metric.uom(T), uomTime);
                // console.lg(`Bootstrap L.uom to ${uom}`);
                metric.setUom(body.L, uom);
            }
            dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, idx, T, uomTime);
            // TODO: When the torque is applied away from the center of mass, do we add linear momentum?
            // The rate of change of angular momentum (bivector) is given by
            // dL/dt = r ^ F = Γ
            /*
            torqueApp.computeTorque(this.$torque);
            const T = this.$torque;
            // Bootstrap the angular momentum unit of measure.
            if (Unit.isOne(metric.uom(body.L)) && metric.isZero(body.L)) {
                metric.setUom(body.L, Unit.mul(metric.uom(T), uomTime));
            }
            // TODO: Could we add geometric constraints for torques here?
            dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChange, idx, T);
            */
            if (this.$showTorques) {
                torqueApp.expireTime = this.$varsList.getTime();
                this.$simList.add(torqueApp);
            }
        };
        Physics.prototype.applyConstraints = function (rateOfChange, rateOfChangeUoms, Δt, uomTime) {
            var constraints = this.$constraints;
            var Nconstraints = constraints.length;
            for (var i = 0; i < Nconstraints; i++) {
                var constraint = constraints[i];
                this.applyConstraint(rateOfChange, rateOfChangeUoms, constraint, Δt, uomTime);
            }
        };
        Physics.prototype.applyConstraint = function (rateOfChangeVals, rateOfChangeUoms, constraint, Δt, uomTime) {
            var body = constraint.getBody();
            if (!(contains(this.$bodies, body))) {
                return;
            }
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            var metric = this.metric;
            var dynamics = this.dynamics;
            // TODO: This could be a scratch variable.
            var F = metric.zero();
            var r = metric.zero();
            var B = metric.zero();
            var eΘ = metric.zero();
            var Fnew = metric.zero();
            var FnewR = metric.zero();
            var FnewΘ = metric.zero();
            var N = metric.zero();
            dynamics.getForce(rateOfChangeVals, rateOfChangeUoms, idx, F);
            var X = body.X;
            var P = body.P;
            var M = body.M;
            constraint.computeRadius(X, r);
            constraint.computeRotation(X, B);
            constraint.computeTangent(X, eΘ);
            metric.copyVector(eΘ, FnewR); // FnewR = eΘ
            metric.mul(FnewR, B); // FnewR = eΘ * B = -er
            metric.neg(FnewR); // FnewR = er (approx)
            metric.direction(FnewR); // FnewR = er 
            metric.mulByVector(FnewR, P); // FnewR = er * P
            metric.mulByVector(FnewR, P); // FnewR = er * P * P = (P * P) er
            metric.divByScalar(FnewR, metric.a(M), metric.uom(M)); // FnewR = ((P * P) / m) er
            metric.divByScalar(FnewR, metric.a(r), metric.uom(r)); // FnewR = ((P * P) / (m * r)) er
            metric.neg(FnewR); // FnewR = - ((P * P) / (m * r)) er
            metric.copyVector(F, FnewΘ); // FnewΘ = F
            metric.scp(FnewΘ, eΘ); // FnewΘ = F | eΘ
            metric.mulByVector(FnewΘ, eΘ); // FnewΘ = (F | eΘ) eΘ
            metric.copyVector(FnewR, Fnew); // Fnew = FnewR
            metric.addVector(Fnew, FnewΘ); // Fnew = FnewR + FnewΘ
            metric.copyVector(Fnew, N); // N = Fnew
            metric.subVector(N, F); // N = Fnew - F or Fnew = F + N 
            // Update the rateOfChange of Linear Momentum (force); 
            dynamics.setForce(rateOfChangeVals, rateOfChangeUoms, idx, Fnew);
            // The constraint holds the computed force so that it can be visualized.
            constraint.setForce(N);
        };
        Object.defineProperty(Physics.prototype, "time", {
            /**
             *
             */
            get: function () {
                return this.$varsList.getTime();
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         */
        Physics.prototype.updateFromBodies = function () {
            var bodies = this.$bodies;
            var N = bodies.length;
            for (var i = 0; i < N; i++) {
                this.updateVarsFromBody(bodies[i]);
            }
            this.discontinuosChangeToEnergy();
        };
        /**
         *
         */
        Physics.prototype.updateVarsFromBody = function (body) {
            var idx = body.varsIndex;
            if (idx > -1) {
                this.dynamics.updateVarsFromBody(body, idx, this.$varsList);
            }
        };
        /**
         * Handler for actions to be performed after the evaluate calls and setState.
         * Computes the system energy, linear momentum and angular momentum.
         * @hidden
         */
        Physics.prototype.epilog = function (stepSize, uomTime) {
            var varsList = this.$varsList;
            var vars = varsList.getValues();
            var units = varsList.getUnits();
            this.updateBodiesFromStateVariables(vars, units, uomTime);
            var dynamics = this.dynamics;
            dynamics.epilog(this.$bodies, this.$forceLaws, this.$potentialOffset, varsList);
        };
        Object.defineProperty(Physics.prototype, "bodies", {
            /**
             * Provides a reference to the bodies in the simulation.
             */
            get: function () {
                return this.$bodies;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Physics.prototype, "simList", {
            /**
             * @hidden
             */
            get: function () {
                return this.$simList;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Physics.prototype, "varsList", {
            /**
             * @hidden
             */
            get: function () {
                return this.$varsList;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Computes the sum of the translational and rotational kinetic energy of all bodies,
         * and the potential energy due to body interactions for the force laws.
         */
        Physics.prototype.totalEnergy = function () {
            var metric = this.metric;
            metric.unlock(this.$totalEnergy, this.$totalEnergyLock);
            // TODO: Could be more efficient...
            metric.write(metric.zero(), this.$totalEnergy);
            metric.add(this.$totalEnergy, this.$potentialOffset);
            var bs = this.$bodies;
            var Nb = bs.length;
            for (var i = 0; i < Nb; i++) {
                var body = bs[i];
                if (isFinite(metric.a(body.M))) {
                    metric.add(this.$totalEnergy, body.rotationalEnergy());
                    metric.add(this.$totalEnergy, body.translationalEnergy());
                }
            }
            var fs = this.$forceLaws;
            var Nf = fs.length;
            for (var i = 0; i < Nf; i++) {
                metric.add(this.$totalEnergy, fs[i].potentialEnergy());
            }
            this.$totalEnergyLock = metric.lock(this.$totalEnergy);
            return this.$totalEnergy;
        };
        return Physics;
    }(AbstractSubject));

    /**
     * @hidden
     */
    var contextBuilderAdvance = function () { return "Engine.advance(Δt: number, uomTime?: Unit): void"; };
    /**
     * An example of how to wire together the various components.
     * @hidden
     */
    var Engine = /** @class */ (function () {
        function Engine(metric, dynamics, options) {
            this.physics = new Physics(metric, dynamics);
            var rk4 = new RungeKutta(this.physics);
            this.strategy = new DefaultAdvanceStrategy(this.physics, rk4);
        }
        Object.defineProperty(Engine.prototype, "varsList", {
            get: function () {
                return this.physics.varsList;
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         * @param body
         */
        Engine.prototype.addBody = function (body) {
            var contextBuilder = function () { return "Engine.addBody(body: ForceBody): void"; };
            mustBeNonNullObject('body', body, contextBuilder);
            this.physics.addBody(body);
        };
        /**
         *
         * @param body
         */
        Engine.prototype.removeBody = function (body) {
            var contextBuilder = function () { return "Engine.removeBody(body: ForceBody): void"; };
            mustBeNonNullObject('body', body, contextBuilder);
            this.physics.removeBody(body);
        };
        Engine.prototype.addForceLaw = function (forceLaw) {
            var contextBuilder = function () { return "Engine.addForceLaw(forceLaw: ForceLaw): void"; };
            mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
            this.physics.addForceLaw(forceLaw);
        };
        Engine.prototype.removeForceLaw = function (forceLaw) {
            var contextBuilder = function () { return "Engine.removeForceLaw(forceLaw: ForceLaw): void"; };
            mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
            this.physics.removeForceLaw(forceLaw);
        };
        /**
         *
         * @param torqueLaw
         */
        Engine.prototype.addTorqueLaw = function (torqueLaw) {
            var contextBuilder = function () { return "Engine.addTorqueLaw(torqueLaw: TorqueLaw): void"; };
            mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
            this.physics.addTorqueLaw(torqueLaw);
        };
        /**
         *
         * @param torqueLaw
         */
        Engine.prototype.removeTorqueLaw = function (torqueLaw) {
            var contextBuilder = function () { return "Engine.removeTorqueLaw(torqueLaw: TorqueLaw): void"; };
            mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
            this.physics.removeTorqueLaw(torqueLaw);
        };
        Engine.prototype.addConstraint = function (geometry) {
            var contextBuilder = function () { return "Engine.addGeometricConstraint(geometry: GeometricConstraint): void"; };
            mustBeNonNullObject('geometry', geometry, contextBuilder);
            this.physics.addConstraint(geometry);
        };
        Engine.prototype.removeConstraint = function (geometry) {
            var contextBuilder = function () { return "Engine.removeGeometricConstraint(geometry: GeometricConstraint): void"; };
            mustBeNonNullObject('geometry', geometry, contextBuilder);
            this.physics.removeConstraint(geometry);
        };
        Engine.prototype.addDriftLaw = function (driftLaw) {
            var contextBuilder = function () { return "Engine.addDriftLaw(driftLaw: ForceLaw): void"; };
            mustBeNonNullObject('driftLaw', driftLaw, contextBuilder);
            this.physics.addDriftLaw(driftLaw);
        };
        Engine.prototype.removeDriftLaw = function (driftLaw) {
            var contextBuilder = function () { return "Engine.removeDriftLaw(driftLaw: ForceLaw): void"; };
            mustBeNonNullObject('driftLaw', driftLaw, contextBuilder);
            this.physics.removeDriftLaw(driftLaw);
        };
        /**
         * Advances the Physics model by the specified time interval, Δt * uomTime.
         * @param Δt The time interval.
         * @param uomTime The optional unit of measure for the time interval.
         */
        Engine.prototype.advance = function (Δt, uomTime) {
            mustBeNumber('Δt', Δt, contextBuilderAdvance);
            this.strategy.advance(Δt, uomTime);
        };
        /**
         *
         */
        Engine.prototype.updateFromBodies = function () {
            this.physics.updateFromBodies();
        };
        Engine.prototype.totalEnergy = function () {
            return this.physics.totalEnergy();
        };
        return Engine;
    }());

    /**
     * @hidden
     */
    var Force = /** @class */ (function (_super) {
        __extends(Force, _super);
        /**
         *
         */
        function Force(body) {
            var _this = _super.call(this) || this;
            _this.body = body;
            var metric = body.metric;
            _this.location = metric.zero();
            _this.$locationCoordType = LOCAL;
            _this.vector = metric.zero();
            _this.$vectorCoordType = WORLD;
            _this.$temp1 = metric.zero();
            _this.$temp2 = metric.zero();
            return _this;
        }
        Object.defineProperty(Force.prototype, "locationCoordType", {
            /**
             *
             */
            get: function () {
                return this.$locationCoordType;
            },
            set: function (locationCoordType) {
                if (locationCoordType !== LOCAL && locationCoordType !== WORLD) {
                    throw new Error("locationCoordType must be LOCAL (0) or WORLD (1).");
                }
                this.$locationCoordType = locationCoordType;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Force.prototype, "vectorCoordType", {
            /**
             *
             */
            get: function () {
                return this.$vectorCoordType;
            },
            set: function (vectorCoordType) {
                if (vectorCoordType !== LOCAL && vectorCoordType !== WORLD) {
                    throw new Error("vectorCoordType must be LOCAL (0) or WORLD (1).");
                }
                this.$vectorCoordType = vectorCoordType;
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         */
        Force.prototype.getBody = function () {
            return this.body;
        };
        /**
         * Computes the point of application of the force in world coordinates.
         *
         * @param position (output)
         */
        Force.prototype.computePosition = function (position) {
            var metric = this.body.metric;
            switch (this.$locationCoordType) {
                case LOCAL: {
                    metric.copyVector(this.location, position);
                    // We could subtract the body center-of-mass in body coordinates here.
                    // Instead we assume that it is always zero.
                    metric.rotate(position, this.body.R);
                    metric.addVector(position, this.body.X);
                    break;
                }
                case WORLD: {
                    metric.copyVector(this.location, position);
                    break;
                }
            }
        };
        /**
         * Computes the force being applied (vector) in WORLD coordinates.
         *
         * @param force (output)
         */
        Force.prototype.computeForce = function (force) {
            var metric = this.body.metric;
            switch (this.$vectorCoordType) {
                case LOCAL: {
                    metric.copyVector(this.vector, force);
                    metric.rotate(force, this.body.R);
                    break;
                }
                case WORLD: {
                    metric.copyVector(this.vector, force);
                    break;
                }
            }
        };
        /**
         * Computes the torque, i.e. moment of the force about the center of mass (bivector).
         * Torque = (x - X) ^ F, so the torque is being computed with center of mass as origin.
         * Torque = r ^ F because r = x - X
         *
         * @param torque (output)
         */
        Force.prototype.computeTorque = function (torque) {
            var metric = this.body.metric;
            this.computePosition(torque); // torque = x
            this.computeForce(this.$temp2); // temp2 = F
            metric.subVector(torque, this.body.X); // torque = x - X
            metric.ext(torque, this.$temp2); // torque = (x - X) ^ F
        };
        Object.defineProperty(Force.prototype, "F", {
            get: function () {
                this.computeForce(this.$temp2);
                return this.$temp2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Force.prototype, "x", {
            get: function () {
                this.computePosition(this.$temp1);
                return this.$temp1;
            },
            enumerable: false,
            configurable: true
        });
        return Force;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    var GravitationLaw = /** @class */ (function (_super) {
        __extends(GravitationLaw, _super);
        /**
         *
         */
        function GravitationLaw(body1_, body2_, G) {
            var _this = _super.call(this) || this;
            _this.body1_ = body1_;
            _this.body2_ = body2_;
            _this.$forces = [];
            _this.metric = body1_.metric;
            var metric = _this.metric;
            _this.F1 = metric.createForce(_this.body1_);
            _this.F1.locationCoordType = WORLD;
            _this.F1.vectorCoordType = WORLD;
            _this.F2 = metric.createForce(_this.body2_);
            _this.F2.locationCoordType = WORLD;
            _this.F2.vectorCoordType = WORLD;
            _this.G = G;
            _this.$forces = [_this.F1, _this.F2];
            _this.potentialEnergy_ = metric.zero();
            _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
            return _this;
        }
        Object.defineProperty(GravitationLaw.prototype, "forces", {
            get: function () {
                return this.$forces;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Computes the forces due to the gravitational interaction.
         * F = G * m1 * m2 * direction(r2 - r1) / quadrance(r2 - r1)
         */
        GravitationLaw.prototype.updateForces = function () {
            // We can use the F1.location and F2.location as temporary variables
            // as long as we restore their contents.
            var numer = this.F1.location;
            var denom = this.F2.location;
            var metric = this.metric;
            // The direction of the force is computed such that masses always attract each other.
            metric.copyVector(this.body2_.X, numer);
            metric.subVector(numer, this.body1_.X);
            metric.copyVector(numer, denom);
            metric.quad(denom);
            metric.direction(numer);
            metric.mulByScalar(numer, metric.a(this.G), metric.uom(this.G));
            metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
            metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
            metric.copyVector(numer, this.F1.vector);
            metric.divByScalar(this.F1.vector, metric.a(denom), metric.uom(denom));
            metric.copyVector(this.F1.vector, this.F2.vector);
            metric.neg(this.F2.vector);
            // Restore the contents of the location variables.
            metric.copyVector(this.body1_.X, this.F1.location);
            metric.copyVector(this.body2_.X, this.F2.location);
            return this.$forces;
        };
        /**
         *
         */
        GravitationLaw.prototype.disconnect = function () {
            // Does nothing
        };
        /**
         * Computes the potential energy of the gravitational interaction.
         * U = -G m1 m2 / r, where
         * r is the center-of-mass to center-of-mass separation of m1 and m2.
         */
        GravitationLaw.prototype.potentialEnergy = function () {
            var metric = this.metric;
            // Unlock the variable that we will use for the result.
            metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
            // We can use the F1.location and F2.location as temporary variables
            // as long as we restore their contents.
            var numer = this.F1.location;
            var denom = this.F2.location;
            // The numerator of the potential energy formula is -G * m1 * m2.
            metric.copyScalar(metric.a(this.G), metric.uom(this.G), numer);
            metric.mulByScalar(numer, metric.a(this.body1_.M), metric.uom(this.body1_.M));
            metric.mulByScalar(numer, metric.a(this.body2_.M), metric.uom(this.body2_.M));
            metric.neg(numer);
            // The denominator is |r1 - r2|.
            metric.copyVector(this.body1_.X, denom);
            metric.subVector(denom, this.body2_.X);
            metric.norm(denom);
            // Combine the numerator and denominator.
            metric.copyScalar(metric.a(numer), metric.uom(numer), this.potentialEnergy_);
            metric.divByScalar(this.potentialEnergy_, metric.a(denom), metric.uom(denom));
            // Restore the contents of the location variables.
            metric.copyVector(this.body1_.X, this.F1.location);
            metric.copyVector(this.body2_.X, this.F2.location);
            // We're done. Lock down the result.
            this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
            return this.potentialEnergy_;
        };
        return GravitationLaw;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    var LockableMeasure = /** @class */ (function () {
        /**
         *
         * @param metric
         * @param initialValue A value that is copied.
         */
        function LockableMeasure(metric, initialValue) {
            this.metric = metric;
            mustBeNonNullObject('metric', metric);
            mustBeNonNullObject('initialValue', initialValue);
            this.$value = metric.zero();
            metric.copy(initialValue, this.$value);
            this.lock();
        }
        LockableMeasure.prototype.get = function () {
            return this.$value;
        };
        /**
         * 1. Asserts that the value is defined and not null.
         * 2. Unlocks the `this` value.
         * 3. Copies the value to the `this` value.
         * 4. Locks the `this` value.
         *
         * @param value The value to be set into `this` value.
         */
        LockableMeasure.prototype.set = function (value) {
            mustBeNonNullObject('value', value);
            this.metric.copy(value, this.unlock());
            this.lock();
        };
        LockableMeasure.prototype.lock = function () {
            var value = this.$value;
            this.$lock = this.metric.lock(value);
            return value;
        };
        LockableMeasure.prototype.unlock = function () {
            var value = this.$value;
            this.metric.unlock(value, this.$lock);
            return value;
        };
        return LockableMeasure;
    }());

    /**
     * @hidden
     * @param name
     * @param value
     * @param unit
     * @param metric
     * @returns
     */
    function mustBeDimensionlessOrCorrectUnits(name, value, unit, metric) {
        if (!Unit.isOne(metric.uom(value)) && !Unit.isCompatible(metric.uom(value), unit)) {
            throw new Error(name + " unit of measure, " + metric.uom(value) + ", must be compatible with " + unit);
        }
        else {
            return value;
        }
    }

    /**
     * @hidden
     */
    var LinearDamper = /** @class */ (function (_super) {
        __extends(LinearDamper, _super);
        /**
         *
         * @param body1
         * @param body2
         */
        function LinearDamper(body1, body2) {
            var _this = _super.call(this) || this;
            _this.body1 = body1;
            _this.body2 = body2;
            /**
             *
             */
            _this.$forces = [];
            var metric = body1.metric;
            _this.$frictionCoefficient = new LockableMeasure(metric, metric.scalar(1));
            _this.F1 = metric.createForce(_this.body1);
            _this.F1.locationCoordType = WORLD;
            _this.F1.vectorCoordType = WORLD;
            _this.F2 = metric.createForce(_this.body2);
            _this.F2.locationCoordType = WORLD;
            _this.F2.vectorCoordType = WORLD;
            _this.$forces = [_this.F1, _this.F2];
            return _this;
        }
        Object.defineProperty(LinearDamper.prototype, "forces", {
            get: function () {
                return this.$forces;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LinearDamper.prototype, "b", {
            get: function () {
                return this.$frictionCoefficient.get();
            },
            set: function (b) {
                mustBeDimensionlessOrCorrectUnits('b', b, Unit.FRICTION_COEFFICIENT, this.body1.metric);
                this.$frictionCoefficient.set(b);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LinearDamper.prototype, "frictionCoefficient", {
            get: function () {
                return this.$frictionCoefficient.get();
            },
            set: function (frictionCoefficient) {
                mustBeDimensionlessOrCorrectUnits('frictionCoefficient', frictionCoefficient, Unit.FRICTION_COEFFICIENT, this.body1.metric);
                this.$frictionCoefficient.set(frictionCoefficient);
            },
            enumerable: false,
            configurable: true
        });
        LinearDamper.prototype.updateForces = function () {
            var metric = this.body1.metric;
            var b = this.$frictionCoefficient.get();
            var x1 = this.body1.X;
            var x2 = this.body2.X;
            var e = metric.zero();
            metric.addVector(e, x1);
            metric.subVector(e, x2);
            metric.direction(e);
            var v1 = metric.zero();
            metric.copyVector(this.body1.P, v1);
            metric.divByScalar(v1, metric.a(this.body1.M), metric.uom(this.body1.M));
            var v2 = metric.zero();
            metric.copyVector(this.body2.P, v2);
            metric.divByScalar(v2, metric.a(this.body2.M), metric.uom(this.body2.M));
            var v = metric.zero();
            metric.copyVector(v1, v);
            metric.subVector(v, v2);
            var f1 = this.F1.vector;
            metric.copyVector(v, f1); // f1 = v
            metric.scp(f1, e); // f1 = v | e
            metric.mulByScalar(f1, metric.a(b), metric.uom(b)); // f1 = b * (v | e)
            metric.neg(f1); // f1 = - b * (v | e)
            metric.mulByVector(f1, e); // f1 = - b * (v | e) e
            var f2 = this.F2.vector;
            metric.copyVector(f1, f2); // f2 = f1
            metric.neg(f2); // f2 = - f1
            metric.copyVector(x1, this.F1.location);
            metric.copyVector(x2, this.F2.location);
            return this.$forces;
        };
        LinearDamper.prototype.disconnect = function () {
            // Do nothing yet.
            // TODO: zero the forces?
        };
        LinearDamper.prototype.potentialEnergy = function () {
            var metric = this.body1.metric;
            return metric.zero();
        };
        return LinearDamper;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    function beFunction() {
        return "be a function";
    }
    /**
     * @hidden
     */
    function mustBeFunction(name, value, contextBuilder) {
        if (typeof value === 'function') {
            return value;
        }
        else {
            doesNotSatisfy(name, beFunction, contextBuilder);
        }
    }

    /**
     * Asserts that the specified quantities are either both dimensionless or neither dimensionless.
     * If either measure is zero, the unit of dimensions are meaningless and can be ignored.
     * @hidden
     */
    function assertConsistentUnits(aName, A, bName, B, metric) {
        if (!metric.isZero(A) && !metric.isZero(B)) {
            if (Unit.isOne(metric.uom(A))) {
                if (!Unit.isOne(metric.uom(B))) {
                    throw new Error(aName + " => " + A + " must have dimensions if " + bName + " => " + B + " has dimensions.");
                }
            }
            else {
                if (Unit.isOne(metric.uom(B))) {
                    throw new Error(bName + " => " + B + " must have dimensions if " + aName + " => " + A + " has dimensions.");
                }
            }
        }
    }

    /**
     * @hidden
     */
    var RigidBody = /** @class */ (function (_super) {
        __extends(RigidBody, _super);
        /**
         * @param metric
         */
        function RigidBody(metric) {
            var _this = _super.call(this) || this;
            _this.metric = metric;
            /**
             * the index into the variables array for this rigid body, or -1 if not in vars array.
             */
            _this.varsIndex_ = -1;
            mustBeNonNullObject('metric', metric);
            _this.$mass = new LockableMeasure(metric, metric.scalar(1));
            _this.$charge = new LockableMeasure(metric, metric.zero());
            _this.$X = metric.zero();
            _this.$R = metric.scalar(1);
            _this.$P = metric.zero();
            _this.$L = metric.zero();
            _this.$Ω = metric.zero();
            _this.$rotationalEnergy = new LockableMeasure(metric, metric.zero());
            _this.$translationalEnergy = new LockableMeasure(metric, metric.zero());
            _this.$worldPoint = metric.zero();
            _this.Ω_scratch = metric.zero();
            _this.$centerOfMassLocal = new LockableMeasure(metric, metric.zero());
            _this.$inertiaTensorInverse = metric.identityMatrix();
            return _this;
        }
        Object.defineProperty(RigidBody.prototype, "centerOfMassLocal", {
            /**
             * The center of mass position vector in local coordinates.
             */
            get: function () {
                return this.$centerOfMassLocal.get();
            },
            set: function (centerOfMassLocal) {
                var metric = this.metric;
                if (!metric.isVector(centerOfMassLocal)) {
                    throw new Error("measure must be a vector in assignment to property centerOfMassLocal, but was " + centerOfMassLocal + ".");
                }
                mustBeDimensionlessOrCorrectUnits('centerOfMassLocal', centerOfMassLocal, Unit.METER, metric);
                this.$centerOfMassLocal.set(centerOfMassLocal);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "M", {
            /**
             * Mass (scalar). Default is one (1).
             * If dimensioned units are used, they must be compatible with the unit of mass.
             * M is immutable but the property may be reassigned.
             */
            get: function () {
                return this.$mass.get();
            },
            set: function (M) {
                var metric = this.metric;
                if (!metric.isScalar(M)) {
                    throw new Error("measure must be a scalar in assignment to property M (mass), but was " + M + ".");
                }
                mustBeDimensionlessOrCorrectUnits('M', M, Unit.KILOGRAM, metric);
                this.$mass.set(M);
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "Q", {
            /**
             * Charge (scalar). Default is zero (0).
             * If dimensioned units are used, they must be compatible with the unit of electric charge.
             * Q is immutable but the property may be reassigned.
             */
            get: function () {
                return this.$charge.get();
            },
            set: function (Q) {
                var metric = this.metric;
                if (!metric.isScalar(Q)) {
                    throw new Error("measure must be a scalar in assignment to property Q (electric charge), but was " + Q + ".");
                }
                mustBeDimensionlessOrCorrectUnits('Q', Q, Unit.COULOMB, metric);
                this.$charge.set(Q);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Updates the angular velocity, Ω, bivector based upon the angular momentum.
         * Derived classes may override to provide more efficient implementations based upon symmetry.
         */
        RigidBody.prototype.updateAngularVelocity = function () {
            // In matrix notation,
            // L = I Ω => Ω = Iinv L.
            // Either the inertia tensor must be converted from local coordinates to world, or
            // we convert L to local coordinates, apply the local inertial tensor and then rotate
            // Ω back to world coordinates.
            // Notice that in the following we avoid creating temporary variables by computing
            // the reversion of the mutable body.R twice.
            this.metric.copy(this.L, this.Ω); // Ω = L
            this.metric.rev(this.R); // R = ~R
            this.metric.rotate(this.Ω, this.R); // Ω contains R L ~R ...  ~R L R ?
            this.metric.copy(this.Ω, this.Ω_scratch); // scratch contains R L ~R ... ~R L R
            this.metric.applyMatrix(this.Ω_scratch, this.Iinv); // scratch contains Iinv (R L ~R) ... Iinv (~R L R)
            this.metric.copyBivector(this.Ω_scratch, this.Ω); // Ω contains Iinv (R L ~R)
            this.metric.rev(this.R);
            this.metric.rotate(this.Ω, this.R); // Ω contains R (Iinv (R L ~R)) ~R
        };
        /**
         * Derived classes should override.
         */
        RigidBody.prototype.updateInertiaTensor = function () {
            // Do nothing.
        };
        Object.defineProperty(RigidBody.prototype, "I", {
            /**
             * Inertia Tensor (in body coordinates) (3x3 matrix).
             * The returned matrix is a copy.
             * TODO: This copy should be locked.
             */
            get: function () {
                return this.metric.invertMatrix(this.$inertiaTensorInverse);
            },
            /**
             * Sets the Inertia Tensor (in local coordinates) (3x3 matrix), and computes the inverse.
             */
            set: function (I) {
                this.$inertiaTensorInverse = this.metric.invertMatrix(I);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "Iinv", {
            /**
             * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
             */
            get: function () {
                return this.$inertiaTensorInverse;
            },
            set: function (source) {
                mustBeNonNullObject('Iinv', source);
                mustBeNumber('dimensions', source.dimensions);
                mustBeFunction('getElement', source.getElement);
                this.$inertiaTensorInverse = this.metric.copyMatrix(source);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "X", {
            /**
             * Position (vector).
             * If dimensioned units are used, they must be compatible with the unit of length.
             * X is mutable with copy-on-set.
             */
            get: function () {
                return this.$X;
            },
            set: function (position) {
                var metric = this.metric;
                if (!metric.isVector(position)) {
                    throw new Error("measure must be a vector in assignment to property X (position), but was " + position + ".");
                }
                mustBeDimensionlessOrCorrectUnits('position', position, Unit.METER, metric);
                metric.copy(position, this.$X);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "R", {
            /**
             * Attitude (spinor).
             * Effects a rotation from local coordinates to world coordinates.
             * R is mutable with copy-on-set.
             */
            get: function () {
                return this.$R;
            },
            set: function (attitude) {
                var metric = this.metric;
                if (!metric.isSpinor(attitude)) {
                    throw new Error("measure must be a spinor in assignment to property R (attitude), but was " + attitude + ".");
                }
                mustBeDimensionlessOrCorrectUnits('attitude', attitude, Unit.ONE, metric);
                metric.copy(attitude, this.$R);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "P", {
            /**
             * Linear momentum (vector).
             * If dimensioned units are used, they must be compatible with the unit of momentum.
             * P is mutable with copy-on-set.
             */
            get: function () {
                return this.$P;
            },
            set: function (linearMomentum) {
                var metric = this.metric;
                if (!metric.isVector(linearMomentum)) {
                    throw new Error("measure must be a vector in assignment to property P (linear momentum), but was " + linearMomentum + ".");
                }
                mustBeDimensionlessOrCorrectUnits('linearMomentum', linearMomentum, Unit.KILOGRAM_METER_PER_SECOND, metric);
                metric.copy(linearMomentum, this.$P);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "L", {
            /**
             * Angular momentum (bivector) in world coordinates.
             * If dimensioned units are used, they must be compatible with the unit of angular momentum.
             * L is mutable with copy-on-set.
             */
            get: function () {
                return this.$L;
            },
            set: function (angularMomentum) {
                var metric = this.metric;
                if (!metric.isBivector(angularMomentum)) {
                    throw new Error("measure must be a bivector in assignment to property L (angular momentum), but was " + angularMomentum + ".");
                }
                mustBeDimensionlessOrCorrectUnits('angularMomentum', angularMomentum, Unit.JOULE_SECOND, metric);
                metric.copy(angularMomentum, this.$L);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "\u03A9", {
            /**
             * Angular velocity (bivector).
             * If dimensioned units are used, they must be compatible with the unit of angular velocity.
             * Ω is mutable with copy-on-set.
             */
            get: function () {
                // A getter is required in order to support the setter existence.
                return this.$Ω;
            },
            set: function (angularVelocity) {
                var metric = this.metric;
                if (!metric.isBivector(angularVelocity)) {
                    throw new Error("measure must be a bivector in assignment to property \u03A9 (angular velocity), but was " + angularVelocity + ".");
                }
                mustBeDimensionlessOrCorrectUnits('angularVelocity', angularVelocity, Unit.INV_SECOND, metric);
                metric.copy(angularVelocity, this.$Ω);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "expireTime", {
            /**
             *
             */
            get: function () {
                return Number.POSITIVE_INFINITY;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "varsIndex", {
            /**
             * @hidden
             */
            get: function () {
                return this.varsIndex_;
            },
            set: function (index) {
                this.varsIndex_ = index;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * In the following formula, notice the reversion on either Ω or L.
         * Geometrically, this means we depend on the cosine of the angle between the bivectors, since
         * A * ~B = |A||B|cos(...).
         * (1/2) Ω * ~L(Ω) = (1/2) ~Ω * L(Ω) = (1/2) ω * J(ω), where * means scalar product (equals dot product for vectors).
         */
        RigidBody.prototype.rotationalEnergy = function () {
            assertConsistentUnits('Ω', this.Ω, 'L', this.L, this.metric);
            var E = this.$rotationalEnergy.unlock();
            this.metric.copyBivector(this.Ω, E); // E contains Ω.
            this.metric.rev(E); // E contains ~Ω.
            this.metric.scp(E, this.L); // E contains ~Ω * L, where * means scalar product.
            this.metric.mulByNumber(E, 0.5); // E contains (1/2) ~Ω * L
            return this.$rotationalEnergy.lock();
        };
        /**
         * (1/2) (P * P) / M
         */
        RigidBody.prototype.translationalEnergy = function () {
            assertConsistentUnits('M', this.M, 'P', this.P, this.metric);
            var E = this.$translationalEnergy.unlock();
            this.metric.copyVector(this.P, E); // E contains P.
            this.metric.mulByVector(E, this.P); // E contains P * P.
            this.metric.divByScalar(E, this.metric.a(this.M), this.metric.uom(this.M)); // E contains P * P / M.
            this.metric.mulByNumber(E, 0.5); // E contains (1/2) P * P / M.
            return this.$translationalEnergy.lock();
        };
        /**
         * Converts a point in local coordinates to the same point in world coordinates.
         * x = R (localPoint - centerOfMassLocal) * ~R + X
         *
         * @param localPoint (input)
         * @param worldPoint (output)
         */
        RigidBody.prototype.localPointToWorldPoint = function (localPoint, worldPoint) {
            // Note: It appears that we might be able to use the worldPoint argument as a scratch variable.
            // However, it may not have all the features that we need for the intermediate operations.
            this.metric.copyVector(localPoint, this.$worldPoint);
            this.metric.subVector(this.$worldPoint, this.centerOfMassLocal);
            this.metric.rotate(this.$worldPoint, this.R);
            try {
                this.metric.addVector(this.$worldPoint, this.X);
            }
            catch (e) {
                var cause = (e instanceof Error) ? e.message : "" + e;
                throw new Error(this.$worldPoint + " + " + this.X + " is not allowed. Cause: " + cause);
            }
            this.metric.writeVector(this.$worldPoint, worldPoint);
        };
        return RigidBody;
    }(AbstractSimObject));

    /**
     * An object with no internal structure.
     * @hidden
     */
    var Particle = /** @class */ (function (_super) {
        __extends(Particle, _super);
        /**
         * @param mass The mass of the particle.
         * @param charge The electric charge of the particle.
         */
        function Particle(mass, charge, metric) {
            var _this = _super.call(this, metric) || this;
            _this.M = mass;
            _this.Q = charge;
            return _this;
        }
        /**
         *
         */
        Particle.prototype.updateAngularVelocity = function () {
            var metric = this.metric;
            if (Unit.isOne(metric.uom(this.L))) {
                if (!Unit.isOne(metric.uom(this.Ω))) {
                    metric.setUom(this.Ω, Unit.ONE);
                }
            }
            else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
                if (!Unit.isCompatible(metric.uom(this.Ω), Unit.INV_SECOND)) {
                    metric.setUom(this.Ω, Unit.INV_SECOND);
                }
            }
            else {
                throw new Error("updateAngularVelocity() body.L.uom=" + metric.uom(this.L) + ", body.\u03A9.uom=" + metric.uom(this.Ω));
            }
        };
        /**
         *
         */
        Particle.prototype.updateInertiaTensor = function () {
            var metric = this.metric;
            if (Unit.isOne(metric.uom(this.L))) {
                if (!Unit.isOne(this.Iinv.uom)) {
                    this.Iinv.uom = Unit.ONE;
                }
            }
            else if (Unit.isCompatible(metric.uom(this.L), Unit.JOULE_SECOND)) {
                if (!Unit.isCompatible(this.Iinv.uom, Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED))) {
                    this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                }
            }
            else {
                throw new Error("updateInertiaTensor() body.L.uom=" + metric.uom(this.L) + ", body.\u03A9.uom=" + metric.uom(this.Ω));
            }
        };
        return Particle;
    }(RigidBody));

    /**
     * @hidden
     */
    var Spring = /** @class */ (function (_super) {
        __extends(Spring, _super);
        /**
         *
         */
        function Spring(body1, body2) {
            var _this = _super.call(this) || this;
            _this.body1 = body1;
            _this.body2 = body2;
            /**
             *
             */
            _this.$forces = [];
            _this.metric = body1.metric;
            var metric = _this.metric;
            _this.$restLength = metric.scalar(1);
            _this.$restLengthLock = metric.lock(_this.$restLength);
            _this.$springConstant = new LockableMeasure(metric, metric.scalar(1));
            _this.attach1_ = metric.zero();
            _this.attach1Lock = metric.lock(_this.attach1_);
            _this.attach2_ = metric.zero();
            _this.attach2Lock = metric.lock(_this.attach2_);
            _this.end1_ = metric.zero();
            _this.end1Lock_ = metric.lock(_this.end1_);
            _this.end2_ = metric.zero();
            _this.end2Lock_ = metric.lock(_this.end2_);
            _this.F1 = metric.createForce(_this.body1);
            _this.F1.locationCoordType = WORLD;
            _this.F1.vectorCoordType = WORLD;
            _this.F2 = metric.createForce(_this.body2);
            _this.F2.locationCoordType = WORLD;
            _this.F2.vectorCoordType = WORLD;
            _this.potentialEnergy_ = metric.zero();
            _this.potentialEnergyLock_ = metric.lock(_this.potentialEnergy_);
            _this.$forces = [_this.F1, _this.F2];
            return _this;
        }
        Object.defineProperty(Spring.prototype, "forces", {
            get: function () {
                return this.$forces;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "restLength", {
            get: function () {
                return this.$restLength;
            },
            set: function (restLength) {
                mustBeDimensionlessOrCorrectUnits('restLength', restLength, Unit.METER, this.metric);
                this.metric.unlock(this.$restLength, this.$restLengthLock);
                this.metric.copy(restLength, this.$restLength);
                this.$restLengthLock = this.metric.lock(this.$restLength);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "k", {
            get: function () {
                return this.$springConstant.get();
            },
            set: function (k) {
                mustBeDimensionlessOrCorrectUnits('k', k, Unit.STIFFNESS, this.metric);
                this.$springConstant.set(k);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "springConstant", {
            get: function () {
                return this.$springConstant.get();
            },
            set: function (springConstant) {
                mustBeDimensionlessOrCorrectUnits('springConstant', springConstant, Unit.STIFFNESS, this.metric);
                this.$springConstant.set(springConstant);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "stiffness", {
            get: function () {
                return this.$springConstant.get();
            },
            set: function (stiffness) {
                mustBeDimensionlessOrCorrectUnits('stiffness', stiffness, Unit.STIFFNESS, this.metric);
                this.$springConstant.set(stiffness);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @param x (output)
         */
        Spring.prototype.computeBody1AttachPointInWorldCoords = function (x) {
            if (this.attach1_ == null || this.body1 == null) {
                throw new Error();
            }
            try {
                this.body1.localPointToWorldPoint(this.attach1_, x);
            }
            catch (e) {
                throw new Error("localPointToWorldPoint(attach1=" + this.attach1_ + "). Cause: " + e);
            }
        };
        Spring.prototype.computeBody2AttachPointInWorldCoords = function (x) {
            if (this.attach2_ == null || this.body2 == null) {
                throw new Error();
            }
            this.body2.localPointToWorldPoint(this.attach2_, x);
        };
        Object.defineProperty(Spring.prototype, "attach1", {
            get: function () {
                return this.attach1_;
            },
            set: function (attach1) {
                this.metric.unlock(this.attach1_, this.attach1Lock);
                this.metric.copyVector(attach1, this.attach1_);
                this.attach1Lock = this.metric.lock(this.attach1_);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "attach2", {
            get: function () {
                return this.attach2_;
            },
            set: function (attach2) {
                this.metric.unlock(this.attach2_, this.attach2Lock);
                this.metric.copyVector(attach2, this.attach2_);
                this.attach2Lock = this.metric.lock(this.attach2_);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "end1", {
            get: function () {
                this.metric.unlock(this.end1_, this.end1Lock_);
                this.computeBody1AttachPointInWorldCoords(this.end1_);
                this.end1Lock_ = this.metric.lock(this.end1_);
                return this.end1_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Spring.prototype, "end2", {
            get: function () {
                this.metric.unlock(this.end2_, this.end2Lock_);
                this.computeBody2AttachPointInWorldCoords(this.end2_);
                this.end2Lock_ = this.metric.lock(this.end2_);
                return this.end2_;
            },
            enumerable: false,
            configurable: true
        });
        /**
         *
         */
        Spring.prototype.updateForces = function () {
            this.computeBody1AttachPointInWorldCoords(this.F1.location);
            this.computeBody2AttachPointInWorldCoords(this.F2.location);
            var metric = this.metric;
            // Temporarily use the F2 vector property to compute the direction (unit vector).
            metric.copyVector(this.F2.location, this.F2.vector);
            metric.subVector(this.F2.vector, this.F1.location);
            metric.direction(this.F2.vector);
            // this.F2.vector.copyVector(this.F2.location).subVector(this.F1.location).direction(true);
            // Use the the F1 vector property as working storage.
            // 1. Compute the extension.
            metric.copyVector(this.F1.location, this.F1.vector); // vector contains F1.location
            metric.subVector(this.F1.vector, this.F2.location); // vector contains (F1.location - F2.location)
            metric.norm(this.F1.vector); // vector contains |F1.location - F2.location|
            metric.subScalar(this.F1.vector, this.restLength); // vector contains (|F1.loc - F2.loc| - restLength)
            // 2. Multiply by the stiffness.
            metric.mulByScalar(this.F1.vector, metric.a(this.stiffness), metric.uom(this.stiffness));
            // 3. Multiply by the direction (temporarily in F2 vector) to complete the F1 vector.
            metric.mulByVector(this.F1.vector, this.F2.vector);
            // 4. The F2 vector property is the reaction to the F1 vector action.
            this.metric.copyVector(this.F1.vector, this.F2.vector);
            this.metric.neg(this.F2.vector);
            return this.$forces;
        };
        /**
         *
         */
        Spring.prototype.disconnect = function () {
            // Does nothing
        };
        /**
         *
         */
        Spring.prototype.potentialEnergy = function () {
            this.computeBody1AttachPointInWorldCoords(this.F1.location);
            this.computeBody2AttachPointInWorldCoords(this.F2.location);
            var metric = this.metric;
            this.metric.unlock(this.potentialEnergy_, this.potentialEnergyLock_);
            this.potentialEnergyLock_ = -1;
            // spring potential energy = 0.5 * stiffness * (stretch * stretch)
            // 1. Compute the magnitude of the distance between the endpoints.
            assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location, this.metric);
            metric.copyVector(this.F2.location, this.potentialEnergy_);
            metric.subVector(this.potentialEnergy_, this.F1.location);
            metric.norm(this.potentialEnergy_);
            // 2. Compute the stretch.
            assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength, this.metric);
            metric.sub(this.potentialEnergy_, this.restLength);
            // 3. Square it.
            metric.quad(this.potentialEnergy_);
            // 4. Multiply by the stiffness.
            metric.mulByScalar(this.potentialEnergy_, metric.a(this.stiffness), metric.uom(this.stiffness));
            // 5. Multiply by the 0.5 factor.
            metric.mulByNumber(this.potentialEnergy_, 0.5);
            this.potentialEnergyLock_ = metric.lock(this.potentialEnergy_);
            return this.potentialEnergy_;
        };
        return Spring;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    var Torque = /** @class */ (function (_super) {
        __extends(Torque, _super);
        function Torque(body) {
            var _this = _super.call(this) || this;
            _this.body = body;
            var metric = body.metric;
            _this.bivector = metric.zero();
            _this.$temp1 = metric.zero();
            return _this;
        }
        /**
         *
         */
        Torque.prototype.getBody = function () {
            return this.body;
        };
        /**
         *
         * @param torque
         */
        Torque.prototype.computeTorque = function (torque) {
            var metric = this.body.metric;
            switch (this.bivectorCoordType) {
                case LOCAL: {
                    metric.copyBivector(this.bivector, this.$temp1);
                    metric.rotate(this.$temp1, this.body.R);
                    metric.writeBivector(this.$temp1, torque);
                    break;
                }
                case WORLD: {
                    metric.copyBivector(this.bivector, this.$temp1);
                    metric.writeBivector(this.$temp1, torque);
                    break;
                }
            }
        };
        return Torque;
    }(AbstractSimObject));

    /**
     * @hidden
     */
    function beAString() {
        return "be a string";
    }
    /**
     * @hidden
     */
    function mustBeString (name, value, contextBuilder) {
        mustSatisfy(name, isString(value), beAString, contextBuilder);
        return value;
    }

    /**
     * @hidden
     * @param name
     * @returns
     */
    function notImplemented(name) {
        mustBeString('name', name);
        var message = {
            get message() {
                return "'" + name + "' method is not yet implemented.";
            }
        };
        return message;
    }

    /**
     * @hidden
     * @param name
     * @returns
     */
    function readOnly(name) {
        mustBeString('name', name);
        var message = {
            get message() {
                return "Property `" + name + "` is readonly.";
            }
        };
        return message;
    }

    /**
     * @hidden
     */
    var abs = Math.abs;
    /**
     * @hidden
     * @param n
     * @param v
     * @returns
     */
    function makeColumnVector(n, v) {
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(v);
        }
        return a;
    }
    /**
     * @hidden
     */
    function rowWithMaximumInColumn(A, column, N) {
        var biggest = abs(A[column][column]);
        var maxRow = column;
        for (var row = column + 1; row < N; row++) {
            if (abs(A[row][column]) > biggest) {
                biggest = abs(A[row][column]);
                maxRow = row;
            }
        }
        return maxRow;
    }
    /**
     * @hidden
     */
    function swapRows(A, i, j, N) {
        var colLength = N + 1;
        for (var column = i; column < colLength; column++) {
            var temp = A[j][column];
            A[j][column] = A[i][column];
            A[i][column] = temp;
        }
    }
    /**
     * @hidden
     * @param A
     * @param i
     * @param N
     */
    function makeZeroBelow(A, i, N) {
        for (var row = i + 1; row < N; row++) {
            var c = -A[row][i] / A[i][i];
            for (var column = i; column < N + 1; column++) {
                if (i === column) {
                    A[row][column] = 0;
                }
                else {
                    A[row][column] += c * A[i][column];
                }
            }
        }
    }
    /**
     * @hidden
     * @param A
     * @param N
     * @returns
     */
    function solve(A, N) {
        var x = makeColumnVector(N, 0);
        for (var i = N - 1; i > -1; i--) {
            x[i] = A[i][N] / A[i][i];
            for (var k = i - 1; k > -1; k--) {
                A[k][N] -= A[k][i] * x[i];
            }
        }
        return x;
    }
    /**
     * Gaussian elimination
     * Ax = b
     * @hidden
     */
    function gauss(A, b) {
        var N = A.length;
        for (var i = 0; i < N; i++) {
            var Ai = A[i];
            var bi = b[i];
            Ai.push(bi);
        }
        for (var j = 0; j < N; j++) {
            swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
            makeZeroBelow(A, j, N);
        }
        return solve(A, N);
    }

    /**
     * @hidden
     */
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }

    /**
     * @hidden
     */
    function beAnArray() {
        return "be an array";
    }
    /**
     * @hidden
     */
    function mustBeArray(name, value, contextBuilder) {
        if (Array.isArray(value)) {
            return value;
        }
        else {
            doesNotSatisfy(name, beAnArray, contextBuilder);
        }
    }

    /**
     * @hidden
     */
    function isLabelOne(label) {
        if (typeof label === 'string') {
            return label === "1";
        }
        else {
            var labels = mustBeArray('label', label);
            if (labels.length === 2) {
                return isLabelOne(labels[0]) && isLabelOne(labels[1]);
            }
            else if (labels.length === 1) {
                return isLabelOne(labels[0]);
            }
            else {
                return false;
            }
        }
    }
    /**
     * @hidden
     */
    function appendLabel(coord, label, sb) {
        if (typeof label === 'string') {
            sb.push(label);
        }
        else {
            var labels = mustBeArray('label', label);
            if (labels.length === 2) {
                sb.push(coord > 0 ? labels[1] : labels[0]);
            }
            else if (labels.length === 1) {
                sb.push(labels[0]);
            }
            else if (labels.length === 0) ;
            else {
                throw new Error("Unexpected basis label array length: " + labels.length);
            }
        }
    }
    /**
     * @hidden
     */
    function appendCoord(coord, numberToString, label, sb) {
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            }
            else {
                // The coordinate is negative.
                if (typeof label === 'string') {
                    // There's only one label, we must use minus signs.
                    sb.push("-");
                }
                else {
                    var labels = mustBeArray('label', label);
                    if (labels.length === 2) {
                        if (labels[0] !== labels[1]) {
                            if (sb.length > 0) {
                                sb.push("+");
                            }
                        }
                        else {
                            sb.push("-");
                        }
                    }
                    else if (labels.length === 1) {
                        sb.push("-");
                    }
                    else {
                        // This could be considered an error, but we'll let appendLabel deal with it!
                        sb.push("-");
                    }
                }
            }
            var n = Math.abs(coord);
            if (n === 1) {
                // 1 times something is just 1, so we only need the label.
                appendLabel(coord, label, sb);
            }
            else {
                sb.push(numberToString(n));
                if (!isLabelOne(label)) {
                    sb.push("*");
                    appendLabel(coord, label, sb);
                }
            }
        }
    }
    /**
     * @hidden
     */
    function stringFromCoordinates(coordinates, numberToString, labels, uom) {
        var sb = [];
        for (var i = 0, iLength = coordinates.length; i < iLength; i++) {
            var coord = coordinates[i];
            if (isDefined(coord)) {
                appendCoord(coord, numberToString, labels[i], sb);
            }
            else {
                // We'll just say that the whole thing is undefined.
                return void 0;
            }
        }
        if (Unit.isOne(uom)) {
            return sb.length > 0 ? sb.join("") : "0";
        }
        else {
            return sb.length > 0 ? sb.join("") + " " + uom.toString(10, true) : "0";
        }
    }

    /**
     * @hidden
     */
    var zero$2 = function () {
        return [0, 0];
    };
    /**
     * @hidden
     */
    var scalar$2 = function scalar(a) {
        var coords = zero$2();
        coords[COORD_A$1] = a;
        return coords;
    };
    /**
     * @hidden
     */
    var vector$2 = function vector(x) {
        var coords = zero$2();
        coords[COORD_X$4] = x;
        return coords;
    };
    /**
     * @hidden
     */
    function copy$1(mv) {
        return new Geometric1([mv.a, mv.x], mv.uom);
    }
    /**
     * @hidden
     */
    function lock$3(mv) {
        mv.lock();
        return mv;
    }
    /**
     * Coordinates corresponding to basis labels.
     * @hidden
     */
    var coordinates$2 = function coordinates(m) {
        var coords = zero$2();
        coords[COORD_A$1] = m.a;
        coords[COORD_X$4] = m.x;
        return coords;
    };
    /**
     * @hidden
     */
    function isScalar$1(m) {
        return m.x === 0;
    }
    /**
     * @hidden
     */
    var COORD_A$1 = 0;
    /**
     * @hidden
     */
    var COORD_X$4 = 1;
    /**
     * @hidden
     */
    var BASIS_LABELS$2 = ["1", "e1"];
    BASIS_LABELS$2[COORD_A$1] = '1';
    BASIS_LABELS$2[COORD_X$4] = 'e1';
    /**
     * Sentinel value to indicate that the Geometric1 is not locked.
     * UNLOCKED is in the range -1 to 0.
     * @hidden
     */
    var UNLOCKED$2 = -1 * Math.random();
    var Geometric1 = /** @class */ (function () {
        /**
         *
         * @param coords
         * @param uom
         */
        function Geometric1(coords, uom) {
            if (coords === void 0) { coords = zero$2(); }
            /**
             *
             */
            this.lock_ = UNLOCKED$2;
            if (coords.length !== 2) {
                throw new Error("coords.length must be 2.");
            }
            this.coords = coords;
            this.unit = uom;
        }
        Geometric1.scalar = function (a, uom) {
            return new Geometric1([a, 0], uom);
        };
        Geometric1.vector = function (x, uom) {
            return new Geometric1([0, x], uom);
        };
        Geometric1.prototype.clone = function () {
            return copy$1(this);
        };
        Geometric1.prototype.addScalar = function (a, uom, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(copy$1(this).addScalar(a, uom, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (α === 0) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.a += a * α;
                return this;
            }
        };
        Geometric1.prototype.adj = function () {
            throw new Error("adj Method not implemented.");
        };
        Geometric1.prototype.angle = function () {
            return this.log().grade(2);
        };
        Geometric1.prototype.conj = function () {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().conj());
            }
            else {
                this.x = -this.x;
                return this;
            }
        };
        Geometric1.prototype.copy = function (rhs) {
            if (this.isMutable()) {
                this.a = rhs.a;
                this.x = rhs.x;
                this.uom = rhs.uom;
                return this;
            }
            else {
                return lock$3(copy$1(this).copy(rhs));
            }
        };
        Geometric1.prototype.copyVector = function (vector) {
            this.a = 0;
            this.x = vector.x;
            this.uom = vector.uom;
            return this;
        };
        Geometric1.prototype.lco = function (rhs) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().lco(rhs));
            }
            else {
                return this.lco2(this, rhs);
            }
        };
        Geometric1.prototype.lco2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var b0 = rhs.a;
            var b1 = rhs.x;
            this.a = a0 * b0 + a1 * b1;
            this.x = a0 * b1;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        Geometric1.prototype.div = function (rhs) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().div(rhs));
            }
            else {
                if (isScalar$1(rhs)) {
                    return this.divByScalar(rhs.a, rhs.uom);
                }
                else {
                    return this.mul(copy$1(rhs).inv());
                }
            }
        };
        Geometric1.prototype.exp = function () {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().exp());
            }
            else {
                Unit.assertDimensionless(this.uom);
                // It's always the case that the scalar commutes with every other
                // grade of the multivector, so we can pull it out the front.
                var expW = Math.exp(this.a);
                // In Geometric1 we have the special case that the pseudoscalar also commutes.
                // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
                // let cosβ = cos(this.b)
                // let sinβ = sin(this.b)
                // We are left with the vector and bivector components.
                // For a bivector (usual case), let B = I * φ, where φ is a vector.
                // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
                // φ is actually the absolute value of one half the rotation angle.
                // The orientation of the rotation gets carried in the bivector components.
                // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
                // The mixture of vector and bivector parts is more complex!
                this.a = 1;
                return this.mulByNumber(expW);
            }
        };
        Geometric1.prototype.ext = function (m) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().ext(m));
            }
            else {
                var a0 = this.a;
                var a1 = this.x;
                var b0 = m.a;
                var b1 = m.x;
                this.a = a0 * b0;
                this.x = a0 * b1 + a1 * b0;
                this.uom = Unit.mul(this.uom, m.uom);
                return this;
            }
        };
        Geometric1.prototype.grade = function (n) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().grade(n));
            }
            else {
                // There is no change to the unit of measure.
                switch (n) {
                    case 0: {
                        this.x = 0;
                        break;
                    }
                    case 1: {
                        this.a = 0;
                        break;
                    }
                    case 2: {
                        this.a = 0;
                        this.x = 0;
                        break;
                    }
                    default: {
                        this.a = 0;
                        this.x = 0;
                    }
                }
                return this;
            }
        };
        Geometric1.prototype.isBivector = function () {
            return this.coords[COORD_A$1] === 0 && this.coords[COORD_X$4] === 0;
        };
        Geometric1.prototype.isOne = function () {
            return this.coords[COORD_A$1] === 1 && this.coords[COORD_X$4] === 0 && Unit.isOne(this.unit);
        };
        Geometric1.prototype.isScalar = function () {
            return this.coords[COORD_X$4] === 0;
        };
        Geometric1.prototype.isSpinor = function () {
            if (Unit.isOne(this.unit)) {
                return this.coords[COORD_X$4] === 0;
            }
            else {
                return false;
            }
        };
        Geometric1.prototype.isVector = function () {
            return this.coords[COORD_A$1] === 0;
        };
        Geometric1.prototype.log = function () {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().log());
            }
            else {
                Unit.assertDimensionless(this.uom);
                if (this.isSpinor()) {
                    var α = this.a;
                    this.a = Math.log(Math.sqrt(α * α));
                    return this;
                }
                else {
                    throw new Error(notImplemented("log(" + this.toString() + ")").message);
                }
            }
        };
        Geometric1.prototype.mul = function (rhs) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().mul(rhs));
            }
            else {
                return this.mul2(this, rhs);
            }
        };
        Geometric1.prototype.mul2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var b0 = rhs.a;
            var b1 = rhs.x;
            this.a = a0 * b0 + a1 * b1;
            this.x = a0 * b1 + a1 * b0;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        Geometric1.prototype.mulByNumber = function (α) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().mulByNumber(α));
            }
            else {
                this.a *= α;
                this.x *= α;
                // There is no change in the unit of measure.
                return this;
            }
        };
        Geometric1.prototype.magnitude = function () {
            if (this.isMutable()) {
                this.a = this.magnitudeNoUnits();
                this.x = 0;
                // There is no change to the unit of measure.
                return this;
            }
            else {
                return lock$3(this.clone().magnitude());
            }
        };
        Geometric1.prototype.magnitudeNoUnits = function () {
            return Math.sqrt(this.quaditudeNoUnits());
        };
        Geometric1.prototype.rco = function (m) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().rco(m));
            }
            else {
                return this.rco2(this, m);
            }
        };
        Geometric1.prototype.rco2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var b0 = rhs.a;
            var b1 = rhs.x;
            this.a = a0 * b0 + a1 * b1;
            this.x = -a1 * b0;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        Geometric1.prototype.rev = function () {
            if (this.isMutable()) {
                // reverse has a ++-- structure on the grades.
                this.a = +this.a;
                this.x = +this.x;
                // The unit of measure is unchanged.
                return this;
            }
            else {
                return lock$3(this.clone().rev());
            }
        };
        Geometric1.prototype.quaditude = function () {
            if (this.isMutable()) {
                this.a = this.quaditudeNoUnits();
                this.x = 0;
                this.uom = Unit.mul(this.uom, this.uom);
                return this;
            }
            else {
                return lock$3(this.clone().quaditude());
            }
        };
        Geometric1.prototype.quaditudeNoUnits = function () {
            var a = this.a;
            var x = this.x;
            return a * a + x * x;
        };
        Geometric1.prototype.subScalar = function (a, uom, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().subScalar(a, uom, α));
            }
            else {
                if (this.isZero()) {
                    this.a = -a * α;
                    this.uom = uom;
                    return this;
                }
                else if (a === 0) {
                    return this;
                }
                else {
                    this.a -= a * α;
                    this.uom = Unit.compatible(this.uom, uom);
                    return this;
                }
            }
        };
        Geometric1.prototype.scp = function (m) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().scp(m));
            }
            else {
                return this.scp2(this, m);
            }
        };
        Geometric1.prototype.scp2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.x;
            var b0 = b.a;
            var b1 = b.x;
            var s = a0 * b0 + a1 * b1;
            this.a = s;
            this.x = 0;
            this.uom = Unit.mul(a.uom, b.uom);
            return this;
        };
        Geometric1.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().add(M, α));
            }
            else {
                if (this.isZero()) {
                    this.a = M.a * α;
                    this.x = M.x * α;
                    this.uom = M.uom;
                    return this;
                }
                else if (M.isZero()) {
                    // α has no effect because M is zero.
                    return this;
                }
                else {
                    this.a += M.a * α;
                    this.x += M.x * α;
                    this.uom = Unit.compatible(this.uom, M.uom);
                    return this;
                }
            }
        };
        Geometric1.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().addVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (v.x === 0) {
                    // α has no effect because v is zero.
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, v.uom);
                }
                this.x += v.x * α;
                return this;
            }
        };
        Geometric1.prototype.subVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().subVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (v.x === 0) {
                    // α has no effect because v is zero.
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, v.uom);
                }
                this.x -= v.x * α;
                return this;
            }
        };
        Geometric1.prototype.divByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().divByScalar(α, uom));
            }
            else {
                this.uom = Unit.div(this.uom, uom);
                this.a /= α;
                this.x /= α;
                return this;
            }
        };
        Geometric1.prototype.lerp = function (target, α) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().lerp(target, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = target.uom;
                }
                else if (target.isZero()) ;
                else {
                    this.uom = Unit.compatible(this.uom, target.uom);
                }
                this.a += (target.a - this.a) * α;
                this.x += (target.x - this.x) * α;
                return this;
            }
        };
        Geometric1.prototype.scale = function (α) {
            if (this.isMutable()) {
                this.a = this.a * α;
                this.x = this.x * α;
                return this;
            }
            else {
                return lock$3(copy$1(this).scale(α));
            }
        };
        Geometric1.prototype.reflect = function (n) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().reflect(n));
            }
            else {
                var nx = n.x;
                var nu = n.uom;
                var a = this.a;
                var x = this.x;
                var u = this.uom;
                var nx2 = nx * nx;
                var μ = nx2;
                var β = nx2;
                // The scalar component picks up a minus sign and the factor |n||n|.
                this.a = -β * a;
                this.x = -μ * x;
                // In most cases, n SHOULD be dimensionless.
                this.uom = Unit.mul(nu, Unit.mul(u, nu));
                return this;
            }
        };
        Geometric1.prototype.rotate = function (spinor) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().rotate(spinor));
            }
            else {
                // We are assuming that R is dimensionless.
                Unit.assertDimensionless(spinor.uom);
                var a = this.a;
                var x = this.x;
                var α = spinor.a;
                var α2 = α * α;
                var p = α2;
                var s = α2;
                this.a = s * a;
                this.x = p * x;
                return this;
            }
        };
        Geometric1.prototype.slerp = function (target, α) {
            throw new Error(notImplemented('slerp').message);
        };
        Geometric1.prototype.stress = function (σ) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().stress(σ));
            }
            else {
                this.x *= σ.x;
                this.uom = Unit.mul(σ.uom, this.uom);
                // TODO: Action on other components TBD.
                return this;
            }
        };
        Geometric1.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().sub(M, α));
            }
            else {
                if (this.isZero()) {
                    this.a = -M.a * α;
                    this.x = -M.x * α;
                    this.uom = M.uom;
                }
                else if (M.isZero()) {
                    return this;
                }
                else {
                    this.a -= M.a * α;
                    this.x -= M.x * α;
                    this.uom = Unit.compatible(this.uom, M.uom);
                }
                return this;
            }
        };
        Geometric1.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates(coordinates$2(this), coordToString, BASIS_LABELS$2, this.uom);
        };
        Geometric1.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates$2(this), coordToString, BASIS_LABELS$2, this.uom);
        };
        Geometric1.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates(coordinates$2(this), coordToString, BASIS_LABELS$2, this.uom);
        };
        Geometric1.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates(coordinates$2(this), coordToString, BASIS_LABELS$2, this.uom);
        };
        Geometric1.prototype.zero = function () {
            if (this.isMutable()) {
                this.a = 0;
                this.x = 0;
                this.uom = Unit.ONE;
                return this;
            }
            else {
                return lock$3(copy$1(this).zero());
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__div__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(this.clone().div(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(this.clone().divByNumber(rhs));
            }
            else if (rhs instanceof Unit) {
                return lock$3(this.clone().divByScalar(1, rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric1.prototype.divByNumber = function (α) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().divByNumber(α));
            }
            else {
                this.a /= α;
                this.x /= α;
                return this;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).div(this));
            }
            else if (typeof lhs === 'number') {
                return lock$3(Geometric1.scalar(lhs, void 0).div(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(copy$1(this).scp(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(copy$1(this).scp(Geometric1.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).scp(this));
            }
            else if (typeof lhs === 'number') {
                return lock$3(Geometric1.scalar(lhs).scp(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(copy$1(this).ext(rhs));
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is scalar multiplication.
                return lock$3(copy$1(this).mulByNumber(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).ext(this));
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is scalar multiplication, and commutes.
                return lock$3(copy$1(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(copy$1(this).lco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(copy$1(this).lco(Geometric1.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).lco(this));
            }
            else if (typeof lhs === 'number') {
                return lock$3(Geometric1.scalar(lhs).lco(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(copy$1(this).rco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(copy$1(this).rco(Geometric1.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).rco(this));
            }
            else if (typeof lhs === 'number') {
                return lock$3(Geometric1.scalar(lhs).rco(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__bang__ = function () {
            return lock$3(copy$1(this).inv());
        };
        Geometric1.prototype.inv = function () {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().inv());
            }
            else {
                var α = this.a;
                var x = this.x;
                var A = [
                    [α, x],
                    [x, α]
                ];
                var b = [1, 0];
                var X = gauss(A, b);
                this.a = X[0];
                this.x = X[1];
                this.uom = Unit.inv(this.uom);
                return this;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__eq__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                var a0 = this.a;
                var a1 = this.x;
                var b0 = rhs.a;
                var b1 = rhs.x;
                // TODO: Should be equals on Unit, but this is close.
                return a0 === b0 && a1 === b1 && Unit.isCompatible(this.uom, rhs.uom);
            }
            else if (typeof rhs === 'number') {
                return false;
            }
            else {
                return false;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__ne__ = function (rhs) {
            throw new Error(notImplemented('__ne_').message);
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__ge__ = function (rhs) {
            throw new Error(notImplemented('__ge_').message);
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__gt__ = function (rhs) {
            throw new Error(notImplemented('__gt_').message);
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__le__ = function (rhs) {
            throw new Error(notImplemented('__le_').message);
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__lt__ = function (rhs) {
            throw new Error(notImplemented('__lt_').message);
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__tilde__ = function () {
            return lock$3(copy$1(this).rev());
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__add__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(this.clone().add(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(this.clone().addScalar(rhs, void 0, 1));
            }
            else if (rhs instanceof Unit) {
                return lock$3(this.clone().addScalar(1, rhs, 1));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).add(this));
            }
            else if (typeof lhs === 'number') {
                return lock$3(Geometric1.scalar(lhs).add(this));
            }
            else if (lhs instanceof Unit) {
                return lock$3(Geometric1.scalar(1, lhs).add(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(this.clone().sub(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(this.clone().subScalar(rhs, void 0, 1));
            }
            else if (rhs instanceof Unit) {
                return lock$3(this.clone().subScalar(1, rhs, 1));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).sub(this));
            }
            else if (typeof lhs === 'number') {
                return lock$3(Geometric1.scalar(lhs).sub(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__pos__ = function () {
            return lock$3(copy$1(this));
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__neg__ = function () {
            return lock$3(copy$1(this).neg());
        };
        Geometric1.prototype.neg = function () {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().neg());
            }
            else {
                this.a = -this.a;
                this.x = -this.x;
                // There is no change in the unit of measure.
                return this;
            }
        };
        Geometric1.prototype.isZero = function () {
            return this.coords[COORD_A$1] === 0 && this.coords[COORD_X$4] === 0;
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Geometric1) {
                return lock$3(this.clone().mul(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$3(this.clone().mulByNumber(rhs));
            }
            else if (rhs instanceof Unit) {
                return lock$3(this.clone().mulByScalar(1, rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * @hidden
         */
        Geometric1.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Geometric1) {
                return lock$3(copy$1(lhs).mul(this));
            }
            else if (typeof lhs === 'number') {
                // The ordering of operands is not important for scalar multiplication.
                return lock$3(copy$1(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        Geometric1.prototype.mulByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED$2) {
                return lock$3(this.clone().mulByScalar(α, uom));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.uom = Unit.mul(this.uom, uom);
                return this;
            }
        };
        Object.defineProperty(Geometric1.prototype, "a", {
            get: function () {
                return this.coords[COORD_A$1];
            },
            set: function (a) {
                if (this.isMutable()) {
                    this.coords[COORD_A$1] = a;
                }
                else {
                    throw new Error(readOnly('a').message);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric1.prototype, "x", {
            get: function () {
                return this.coords[COORD_X$4];
            },
            set: function (x) {
                if (this.isMutable()) {
                    this.coords[COORD_X$4] = x;
                }
                else {
                    throw new Error(readOnly('x').message);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric1.prototype, "uom", {
            get: function () {
                return this.unit;
            },
            set: function (uom) {
                if (this.isMutable()) {
                    this.unit = uom;
                }
                else {
                    throw new Error(readOnly('uom').message);
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Determines whether this multivector is locked.
         * If the multivector is in the unlocked state then it is mutable.
         * If the multivector is in the locked state then it is immutable.
         */
        Geometric1.prototype.isLocked = function () {
            return this.lock_ !== UNLOCKED$2;
        };
        Geometric1.prototype.isMutable = function () {
            return this.lock_ === UNLOCKED$2;
        };
        /**
         * Locks this multivector (preventing any further mutation),
         * and returns a token that may be used to unlock it.
         */
        Geometric1.prototype.lock = function () {
            if (this.lock_ !== UNLOCKED$2) {
                throw new Error("already locked");
            }
            else {
                this.lock_ = Math.random();
                return this.lock_;
            }
        };
        /**
         * Unlocks this multivector (allowing mutation),
         * using a token that was obtained from a preceding lock method call.
         */
        Geometric1.prototype.unlock = function (token) {
            if (this.lock_ === UNLOCKED$2) {
                throw new Error("not locked");
            }
            else if (this.lock_ === token) {
                this.lock_ = UNLOCKED$2;
            }
            else {
                throw new Error("unlock denied");
            }
        };
        /**
         * Constructs a Geometric1 representing the number zero.
         * The identity element for addition, <b>0</b>.
         * The returned multivector is locked.
         */
        Geometric1.zero = lock$3(new Geometric1(zero$2(), void 0));
        /**
         * Constructs a Geometric1 representing the number one.
         * The identity element for multiplication, <b>1</b>.
         * The returned multivector is locked.
         */
        Geometric1.one = lock$3(new Geometric1(scalar$2(1), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>x</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric1.e1 = lock$3(new Geometric1(vector$2(1), void 0));
        /**
         * SI base unit of length.
         * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
         */
        Geometric1.meter = lock$3(new Geometric1(scalar$2(1), Unit.METER));
        /**
         * SI base unit of mass.
         * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
         */
        Geometric1.kilogram = lock$3(new Geometric1(scalar$2(1), Unit.KILOGRAM));
        /**
         * SI base unit of time.
         * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
         */
        Geometric1.second = lock$3(new Geometric1(scalar$2(1), Unit.SECOND));
        /**
         * SI base unit of electric current.
         * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
         */
        Geometric1.ampere = lock$3(new Geometric1(scalar$2(1), Unit.AMPERE));
        /**
         * SI base unit of thermodynamic temperature.
         * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
         */
        Geometric1.kelvin = lock$3(new Geometric1(scalar$2(1), Unit.KELVIN));
        /**
         * SI base unit of amount of substance.
         * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
         *
         * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
         */
        Geometric1.mole = lock$3(new Geometric1(scalar$2(1), Unit.MOLE));
        /**
         * SI base unit of luminous intensity.
         * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
         */
        Geometric1.candela = lock$3(new Geometric1(scalar$2(1), Unit.CANDELA));
        /**
         * SI derived unit of electric charge, quantity of electricity.
         */
        Geometric1.coulomb = lock$3(new Geometric1(scalar$2(1), Unit.COULOMB));
        /**
         * SI derived unit of force.
         */
        Geometric1.newton = lock$3(new Geometric1(scalar$2(1), Unit.NEWTON));
        /**
         * SI derived unit of energy, work, quantity of heat.
         */
        Geometric1.joule = lock$3(new Geometric1(scalar$2(1), Unit.JOULE));
        return Geometric1;
    }());

    /**
     * @hidden
     */
    function beDefined() {
        return "not be 'undefined'";
    }
    /**
     * @hidden
     */
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
        return value;
    }

    /**
     * @hidden
     */
    function isInteger(x) {
        // % coerces its operand to numbers so a typeof test is required.
        // Not ethat ECMAScript 6 provides Number.isInteger().
        return isNumber(x) && x % 1 === 0;
    }

    /**
     * @hidden
     */
    function beAnInteger() {
        return "be an integer";
    }
    /**
     * @hidden
     */
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
        return value;
    }

    /**
     * @hidden
     * @param elements
     * @param length
     */
    function checkElementsLength(elements, length) {
        if (elements.length !== length) {
            throw new Error("elements must have length " + length);
        }
    }
    /**
     * Base class for matrices with the expectation that they will be used with WebGL.
     * The underlying data storage is a <code>Float32Array</code>.
     * @hidden
     */
    var AbstractMatrix = /** @class */ (function () {
        /**
         * @param elements
         * @param dimensions
         */
        function AbstractMatrix(elements, dimensions, uom) {
            this._elements = mustBeDefined('elements', elements);
            this._dimensions = mustBeInteger('dimensions', dimensions);
            this._length = dimensions * dimensions;
            checkElementsLength(elements, this._length);
            this.modified = false;
            this.uom = Unit.mustBeUnit('uom', uom);
        }
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
            get: function () {
                return this._dimensions;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            get: function () {
                return this._elements;
            },
            set: function (elements) {
                checkElementsLength(elements, this._length);
                this._elements = elements;
            },
            enumerable: false,
            configurable: true
        });
        AbstractMatrix.prototype.copy = function (source) {
            var N = this.dimensions;
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    var value = source.getElement(i, j);
                    this.setElement(i, j, value);
                }
            }
            this.uom = source.uom;
            return this;
        };
        /**
         * Returns the element at the specified (zero-based) row and column.
         * @param row The zero-based row.
         * @param column The zero-based column.
         */
        AbstractMatrix.prototype.getElement = function (row, column) {
            return this.elements[row + column * this._dimensions];
        };
        /**
         * Determines whether this matrix is the identity matrix.
         */
        AbstractMatrix.prototype.isOne = function () {
            for (var i = 0; i < this._dimensions; i++) {
                for (var j = 0; j < this._dimensions; j++) {
                    var value = this.getElement(i, j);
                    if (i === j) {
                        if (value !== 1) {
                            return false;
                        }
                    }
                    else {
                        if (value !== 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        /**
         * @param row The zero-based row.
         * @param column The zero-based column.
         * @param value The value of the element.
         */
        AbstractMatrix.prototype.setElement = function (row, column, value) {
            this.elements[row + column * this._dimensions] = value;
        };
        return AbstractMatrix;
    }());

    var Matrix0 = /** @class */ (function (_super) {
        __extends(Matrix0, _super);
        function Matrix0(elements, uom) {
            return _super.call(this, elements, 0, uom) || this;
        }
        return Matrix0;
    }(AbstractMatrix));

    /**
     *
     */
    var Force1 = /** @class */ (function (_super) {
        __extends(Force1, _super);
        function Force1(body) {
            return _super.call(this, body) || this;
        }
        return Force1;
    }(Force));

    /**
     *
     */
    var Torque1 = /** @class */ (function (_super) {
        __extends(Torque1, _super);
        function Torque1(body) {
            return _super.call(this, body) || this;
        }
        return Torque1;
    }(Torque));

    /**
     * @hidden
     */
    function copy(mv) {
        return new Geometric1([mv.a, mv.x], mv.uom);
    }
    /**
     * @hidden
     */
    function lock$2(mv) {
        mv.lock();
        return mv;
    }
    /**
     * @hidden
     */
    var Euclidean1 = /** @class */ (function () {
        function Euclidean1() {
        }
        Euclidean1.prototype.a = function (mv) {
            return mv.a;
        };
        Euclidean1.prototype.add = function (lhs, rhs) {
            if (lhs.isMutable()) {
                lhs.a = lhs.a + rhs.a;
                lhs.x = lhs.x + rhs.x;
                lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                var a = lhs.a + rhs.a;
                var x = lhs.x + rhs.x;
                var uom = Unit.compatible(lhs.uom, rhs.uom);
                return new Geometric1([a, x], uom);
            }
        };
        Euclidean1.prototype.addVector = function (lhs, rhs) {
            if (lhs.isMutable()) {
                lhs.x = lhs.x + rhs.x;
                lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                var a = lhs.a;
                var x = lhs.x + rhs.x;
                var uom = Unit.compatible(lhs.uom, rhs.uom);
                return new Geometric1([a, x], uom);
            }
        };
        Euclidean1.prototype.applyMatrix = function (mv, matrix) {
            if (mv.isMutable()) {
                if (mv.isZero()) {
                    if (Unit.isOne(matrix.uom)) {
                        return mv;
                    }
                    else {
                        mv.uom = Unit.mul(matrix.uom, mv.uom);
                        return mv;
                    }
                }
                else {
                    throw new Error("applyMatrix(mv=Geometric1([" + mv.a + ", " + mv.x + "], mv.uom), matrix=dimensions=" + matrix.dimensions + " Method not implemented.");
                }
            }
            else {
                throw new Error("mv must be defined in Metric.applyMatrix(mv, matrix)");
            }
        };
        Euclidean1.prototype.clone = function (source) {
            return source.clone();
        };
        Euclidean1.prototype.copy = function (source, target) {
            target.a = source.a;
            target.x = source.x;
            target.uom = source.uom;
            return target;
        };
        Euclidean1.prototype.copyBivector = function (source, target) {
            target.a = 0;
            target.x = 0;
            target.uom = source.uom;
            return target;
        };
        Euclidean1.prototype.copyMatrix = function (m) {
            if (m.dimensions !== 0) {
                throw new Error("matrix dimensions must be 0.");
            }
            return new Matrix0(new Float32Array([]), m.uom);
        };
        Euclidean1.prototype.copyScalar = function (a, uom, target) {
            target.a = a;
            target.x = 0;
            target.uom = uom;
            return target;
        };
        Euclidean1.prototype.copyVector = function (source, target) {
            target.a = 0;
            target.x = source.x;
            target.uom = source.uom;
            return target;
        };
        Euclidean1.prototype.createForce = function (body) {
            return new Force1(body);
        };
        Euclidean1.prototype.createTorque = function (body) {
            return new Torque1(body);
        };
        Euclidean1.prototype.direction = function (mv) {
            if (mv.isMutable()) {
                var a = mv.a;
                var x = mv.x;
                var s = mv.magnitudeNoUnits();
                mv.a = a / s;
                mv.x = x / s;
                mv.uom = Unit.ONE;
                return mv;
            }
            else {
                return this.direction(copy(mv));
            }
        };
        Euclidean1.prototype.divByScalar = function (lhs, a, uom) {
            if (lhs.isMutable()) {
                lhs.a = lhs.a / a;
                lhs.x = lhs.x / a;
                lhs.uom = Unit.div(lhs.uom, uom);
                return lhs;
            }
            else {
                return lock$2(this.divByScalar(copy(lhs), a, uom));
            }
        };
        Euclidean1.prototype.ext = function (lhs, rhs) {
            if (lhs.isMutable()) {
                var La = lhs.a;
                var Lx = lhs.x;
                var Ra = rhs.a;
                var Rx = rhs.x;
                lhs.a = La * Ra;
                lhs.x = La * Rx + Lx * Ra;
                lhs.uom = Unit.mul(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.ext(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.identityMatrix = function () {
            return new Matrix0(new Float32Array([]));
        };
        Euclidean1.prototype.invertMatrix = function (m) {
            return new Matrix0(new Float32Array([]), Unit.div(Unit.ONE, m.uom));
        };
        Euclidean1.prototype.isBivector = function (mv) {
            return mv.isBivector();
        };
        Euclidean1.prototype.isScalar = function (mv) {
            return mv.isScalar();
        };
        Euclidean1.prototype.isSpinor = function (mv) {
            return mv.isSpinor();
        };
        Euclidean1.prototype.isVector = function (mv) {
            return mv.isVector();
        };
        Euclidean1.prototype.isZero = function (mv) {
            return mv.isZero();
        };
        Euclidean1.prototype.lock = function (mv) {
            return mv.lock();
        };
        Euclidean1.prototype.norm = function (mv) {
            return mv.magnitude();
        };
        Euclidean1.prototype.mul = function (lhs, rhs) {
            if (lhs.isMutable()) {
                var La = lhs.a;
                var Lx = lhs.x;
                var Ra = rhs.a;
                var Rx = rhs.x;
                var a = La * Ra + Lx * Rx; // scp only does this, ext gives La * Ra.
                var x = La * Rx + Lx * Ra; // ext does this.
                lhs.a = a;
                lhs.x = x;
                lhs.uom = Unit.mul(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.mul(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.mulByNumber = function (lhs, alpha) {
            if (lhs.isMutable()) {
                var La = lhs.a;
                var Lx = lhs.x;
                var a = La * alpha;
                var x = Lx * alpha;
                lhs.a = a;
                lhs.x = x;
                return lhs;
            }
            else {
                return lock$2(this.mulByNumber(copy(lhs), alpha));
            }
        };
        Euclidean1.prototype.mulByScalar = function (lhs, a, uom) {
            if (lhs.isMutable()) {
                lhs.a = lhs.a * a;
                lhs.x = lhs.x * a;
                lhs.uom = Unit.mul(lhs.uom, uom);
                return lhs;
            }
            else {
                return lock$2(this.mulByScalar(copy(lhs), a, uom));
            }
        };
        Euclidean1.prototype.mulByVector = function (lhs, rhs) {
            if (lhs.isMutable()) {
                var a = lhs.x * rhs.x;
                var x = lhs.a * rhs.x;
                lhs.a = a;
                lhs.x = x;
                lhs.uom = Unit.mul(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.mulByVector(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.neg = function (mv) {
            if (mv.isMutable()) {
                mv.a = -mv.a;
                mv.x = -mv.x;
                return mv;
            }
            else {
                throw new Error('Method not implemented.');
            }
        };
        Euclidean1.prototype.quad = function (mv) {
            return mv.quaditude();
        };
        Euclidean1.prototype.rev = function (mv) {
            if (mv.isMutable()) {
                return mv;
            }
            else {
                return lock$2(this.rev(copy(mv)));
            }
        };
        Euclidean1.prototype.rotate = function (mv, spinor) {
            if (mv.isMutable()) {
                // TODO: Assert that the spinor is 1.
                return mv;
            }
            else {
                return lock$2(this.rotate(copy(mv), spinor));
            }
        };
        Euclidean1.prototype.scalar = function (a, uom) {
            return new Geometric1([a, 0], uom);
        };
        Euclidean1.prototype.scp = function (lhs, rhs) {
            if (lhs.isMutable()) {
                var La = lhs.a;
                var Lx = lhs.x;
                var Ra = rhs.a;
                var Rx = rhs.x;
                lhs.a = La * Ra + Lx * Rx;
                lhs.x = 0;
                lhs.uom = Unit.mul(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.scp(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.setUom = function (mv, uom) {
            mv.uom = uom;
        };
        Euclidean1.prototype.sub = function (lhs, rhs) {
            if (lhs.isMutable()) {
                lhs.a = lhs.a - rhs.a;
                lhs.x = lhs.x - rhs.x;
                lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.sub(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.subScalar = function (lhs, rhs) {
            if (lhs.isMutable()) {
                lhs.a = lhs.a - rhs.a;
                lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.subScalar(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.subVector = function (lhs, rhs) {
            if (lhs.isMutable()) {
                lhs.x = lhs.x - rhs.x;
                lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
                return lhs;
            }
            else {
                return lock$2(this.subVector(copy(lhs), rhs));
            }
        };
        Euclidean1.prototype.unlock = function (mv, token) {
            mv.unlock(token);
        };
        Euclidean1.prototype.uom = function (mv) {
            return mv.uom;
        };
        Euclidean1.prototype.write = function (source, target) {
            target.a = source.a;
            target.x = source.x;
            target.uom = source.uom;
        };
        Euclidean1.prototype.writeVector = function (source, target) {
            target.a = 0;
            target.x = source.x;
            target.uom = source.uom;
        };
        /**
         * This doesn't happen in 1D because there are no bivectors.
         */
        Euclidean1.prototype.writeBivector = function (source, target) {
            target.a = 0;
            target.x = 0;
            target.uom = source.uom;
        };
        Euclidean1.prototype.zero = function () {
            return new Geometric1();
        };
        return Euclidean1;
    }());

    var RigidBody1 = /** @class */ (function (_super) {
        __extends(RigidBody1, _super);
        function RigidBody1() {
            return _super.call(this, new Euclidean1()) || this;
        }
        return RigidBody1;
    }(RigidBody));

    var Block1 = /** @class */ (function (_super) {
        __extends(Block1, _super);
        function Block1(width) {
            var _this = _super.call(this) || this;
            if (!(width instanceof Geometric1)) {
                throw new Error("width must be a Geometric1.");
            }
            var metric = _this.metric;
            _this.$width = new LockableMeasure(metric, width);
            if (Unit.isOne(metric.uom(width))) ;
            else {
                _this.M = metric.scalar(metric.a(_this.M), Unit.KILOGRAM);
                _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                metric.setUom(_this.X, Unit.METER);
                metric.setUom(_this.R, Unit.ONE);
                metric.setUom(_this.P, Unit.KILOGRAM_METER_PER_SECOND);
                metric.setUom(_this.L, Unit.JOULE_SECOND);
            }
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Block1.prototype, "width", {
            get: function () {
                return this.$width.get();
            },
            set: function (width) {
                this.$width.set(width);
            },
            enumerable: false,
            configurable: true
        });
        return Block1;
    }(RigidBody1));

    var ConstantForceLaw1 = /** @class */ (function (_super) {
        __extends(ConstantForceLaw1, _super);
        function ConstantForceLaw1(body, vector, vectorCoordType) {
            if (vectorCoordType === void 0) { vectorCoordType = WORLD; }
            return _super.call(this, body, vector, vectorCoordType) || this;
        }
        return ConstantForceLaw1;
    }(ConstantForceLaw));

    var ConstantTorqueLaw1 = /** @class */ (function (_super) {
        __extends(ConstantTorqueLaw1, _super);
        function ConstantTorqueLaw1(body, value) {
            return _super.call(this, body, value, WORLD) || this;
        }
        return ConstantTorqueLaw1;
    }(ConstantTorqueLaw));

    /**
     * Helper function to be called from Dynamics.updateBodyFromVars.
     * Checks the unit of measure for the attitute (R) and suggests resolutions.
     * A prominent feature is to detect a missing uom in a simulation time step and to suggest the resolution.
     * @hidden
     * @param uom The unit of measure of the attitude, R.
     * @param uomTime The optional unit of measure for the time step. This provides context for resolution suggestions.
     */
    function checkBodyAttitudeUnit(uom, uomTime) {
        if (!Unit.isOne(uom)) {
            if (Unit.isOne(uomTime)) {
                // The time unit of measure was not defined or is dimensionless.
                if (Unit.isOne(uom.mul(Unit.SECOND))) {
                    // Providing a time uom would fix the issue.
                    throw new Error("body.R.uom should be one, but was " + uom + ". The unit of measure for the time step appears to be missing. Consider adding a time step unit of measure of " + Unit.SECOND + ".");
                }
                else {
                    throw new Error("body.R.uom should be one, but was " + uom + ".");
                }
            }
            else {
                throw new Error("checkBodyAttitudeUnit(uom=" + uom + ",uomTime=" + uomTime + "): body.R.uom should be one, but was " + uom + ".");
            }
        }
    }

    //
    // Indices which MUST be common to all implementations.
    //
    /**
     * @hidden
     */
    var INDEX_TIME = 0;
    /**
     * @hidden
     */
    var INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
    /**
     * @hidden
     */
    var INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
    /**
     * @hidden
     */
    var INDEX_POTENTIAL_ENERGY = 3;
    /**
     * @hidden
     */
    var INDEX_TOTAL_ENERGY = 4;
    /**
     * @hidden
     */
    var INDEX_RESERVED_LAST = 4;

    /**
     * @hidden
     */
    var INDEX_TOTAL_LINEAR_MOMENTUM_X$2 = INDEX_RESERVED_LAST + 1;
    /**
     * @hidden
     */
    var INDEX_TOTAL_ANGULAR_MOMENTUM = INDEX_RESERVED_LAST + 2;
    /**
     * @hidden
     */
    var OFFSET_POSITION_X$2 = 0;
    /**
     * @hidden
     * The attitude is always one, but we carry through the units.
     */
    var OFFSET_ATTITUDE_A$2 = 1;
    /**
     * @hidden
     */
    var OFFSET_LINEAR_MOMENTUM_X$2 = 2;
    /**
     * @hidden
     * The angular momentum is always zero, but we carry through the units.
     */
    var OFFSET_ANGULAR_MOMENTUM = 3;
    /**
     * @hidden
     */
    var varNames$2 = [
        VarsList.TIME,
        "translational kinetic energy",
        "rotational kinetic energy",
        "potential energy",
        "total energy",
        "total linear momentum - x",
        "total angular momentum"
    ];
    /**
     * @hidden
     */
    var DISCONTINUOUS_ENERGY_VARIABLES$2 = [
        INDEX_TRANSLATIONAL_KINETIC_ENERGY,
        INDEX_ROTATIONAL_KINETIC_ENERGY,
        INDEX_POTENTIAL_ENERGY,
        INDEX_TOTAL_ENERGY,
        INDEX_TOTAL_LINEAR_MOMENTUM_X$2,
        INDEX_TOTAL_ANGULAR_MOMENTUM
    ];
    /**
     * @hidden
     */
    var Dynamics1 = /** @class */ (function () {
        function Dynamics1() {
        }
        Dynamics1.prototype.setPositionRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var P = body.P;
            var M = body.M;
            var m = M.a;
            rateOfChangeVals[idx + OFFSET_POSITION_X$2] = P.x / m;
            var uom = Unit.div(P.uom, M.uom);
            rateOfChangeUoms[idx + OFFSET_POSITION_X$2] = uom;
        };
        Dynamics1.prototype.setAttitudeRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            // Let Ω(t) be the (bivector) angular velocity.
            // Let R(t) be the (spinor) attitude of the rigid body. 
            // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
            // requiring the geometric product of Ω and R.
            // Ω and R are auxiliary and primary variables that have already been computed.
            var R = body.R;
            var Ω = body.Ω;
            var L = body.L;
            rateOfChangeVals[idx + OFFSET_ATTITUDE_A$2] = 0;
            var uom = Unit.mul(Ω.uom, R.uom);
            if (Unit.isOne(uomTime)) {
                if (!Unit.isOne(uom)) {
                    console.log("\u03A9.uom=" + Ω.uom + ", R.uom=" + R.uom + ", uomTime=" + uomTime);
                }
            }
            else {
                if (!Unit.isCompatible(uom, Unit.INV_SECOND)) {
                    console.log("\u03A9 unit of measure should be " + Unit.div(Unit.ONE, uomTime) + ". L.uom=" + L.uom + ", \u03A9.uom=" + Ω.uom + ", R.uom=" + R.uom + ", uomTime=" + uomTime);
                }
            }
            // Fix it up for now...
            if (Unit.isOne(uomTime)) {
                rateOfChangeUoms[idx + OFFSET_ATTITUDE_A$2] = Unit.ONE;
            }
            else if (Unit.isCompatible(uomTime, Unit.SECOND)) {
                rateOfChangeUoms[idx + OFFSET_ATTITUDE_A$2] = Unit.INV_SECOND;
            }
            else {
                rateOfChangeUoms[idx + OFFSET_ATTITUDE_A$2] = Unit.div(Unit.ONE, uomTime);
            }
        };
        Dynamics1.prototype.zeroLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var P = body.P;
            var M = body.M;
            if (!Unit.isOne(P.uom)) {
                if (!Unit.isCompatible(P.uom, Unit.KILOGRAM_METER_PER_SECOND)) {
                    throw new Error("P.uom should be " + Unit.KILOGRAM_METER_PER_SECOND + ", but was " + P.uom);
                }
            }
            if (!Unit.isOne(M.uom)) {
                if (!Unit.isCompatible(M.uom, Unit.KILOGRAM)) {
                    throw new Error("M.uom should be " + Unit.KILOGRAM + ", but was " + M.uom);
                }
            }
            // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
            var uom = Unit.div(P.uom, uomTime);
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$2] = 0;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$2] = uom;
        };
        Dynamics1.prototype.zeroAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var L = body.L;
            var R = body.R;
            var Ω = body.Ω;
            if (!Unit.isOne(R.uom)) {
                throw new Error("R.uom should be one, but was " + R.uom);
            }
            if (!Unit.isOne(Ω.uom)) {
                if (!Unit.isCompatible(Ω.uom, Unit.INV_SECOND)) {
                    throw new Error("\u03A9.uom should be " + Unit.INV_SECOND + ", but was " + Ω.uom);
                }
            }
            var uom = Unit.div(L.uom, uomTime);
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM] = 0;
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM] = uom;
        };
        Dynamics1.prototype.updateBodyFromVars = function (vars, units, idx, body, uomTime) {
            body.X.a = 0;
            body.X.x = vars[idx + OFFSET_POSITION_X$2];
            body.X.uom = units[idx + OFFSET_POSITION_X$2];
            body.R.a = vars[idx + OFFSET_ATTITUDE_A$2];
            body.R.x = 0;
            checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_A$2], uomTime);
            body.R.uom = units[idx + OFFSET_ATTITUDE_A$2];
            // Keep the magnitude of the attitude as close to 1 as possible.
            var R = body.R;
            var magR = Math.sqrt(R.a * R.a);
            body.R.a = body.R.a / magR;
            body.P.a = 0;
            body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X$2];
            body.P.uom = units[idx + OFFSET_LINEAR_MOMENTUM_X$2];
            body.L.a = 0;
            body.L.x = 0;
            if (!Unit.isOne(body.L.uom)) {
                if (Unit.isOne(units[idx + OFFSET_ANGULAR_MOMENTUM])) {
                    throw new Error("Overwriting Angular Momentum Units!");
                }
            }
            body.L.uom = units[idx + OFFSET_ANGULAR_MOMENTUM];
            if (Unit.isOne(uomTime)) {
                body.L.uom = Unit.ONE;
            }
            else if (Unit.isCompatible(uomTime, Unit.SECOND)) {
                body.L.uom = Unit.JOULE_SECOND;
            }
            else {
                throw new Error();
            }
            body.updateAngularVelocity();
        };
        Dynamics1.prototype.updateVarsFromBody = function (body, idx, vars) {
            var X = body.X;
            var R = body.R;
            if (!Unit.isOne(R.uom)) {
                throw new Error("R.uom should be one, but was " + R.uom);
            }
            vars.setValueJump(OFFSET_POSITION_X$2 + idx, X.x);
            vars.setUnit(OFFSET_POSITION_X$2 + idx, X.uom);
            vars.setValueJump(OFFSET_ATTITUDE_A$2 + idx, R.a);
            vars.setUnit(OFFSET_ATTITUDE_A$2 + idx, R.uom);
            vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X$2 + idx, body.P.x);
            vars.setUnit(OFFSET_LINEAR_MOMENTUM_X$2 + idx, body.P.uom);
            vars.setValueJump(OFFSET_ANGULAR_MOMENTUM + idx, 0);
            vars.setUnit(OFFSET_ANGULAR_MOMENTUM + idx, body.L.uom);
        };
        Dynamics1.prototype.addForceToRateOfChangeLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, force, uomTime) {
            var Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$2];
            if (Fx !== 0) {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$2] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$2], force.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$2] = force.uom;
            }
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$2] = Fx + force.x;
        };
        Dynamics1.prototype.getForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
            force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$2];
            force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$2];
        };
        Dynamics1.prototype.setForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$2] = force.x;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$2] = force.uom;
        };
        Dynamics1.prototype.addTorqueToRateOfChangeAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, torque, uomTime) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM] = torque.uom;
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM] = 0;
        };
        Dynamics1.prototype.epilog = function (bodies, forceLaws, potentialOffset, vars) {
            if (potentialOffset instanceof Geometric1) ;
            else {
                throw new Error("potentialOffset must be defined in epilog(bodies, forceLaws, potentialOffset, vars).");
            }
            // update the variables that track energy
            var pe = potentialOffset.a;
            var re = 0;
            var te = 0;
            // update the variable that track linear momentum (vector)
            var Px = 0;
            var bs = bodies;
            var Nb = bs.length;
            for (var i = 0; i < Nb; i++) {
                var b = bs[i];
                if (isFinite(b.M.a)) {
                    re += b.rotationalEnergy().a;
                    te += b.translationalEnergy().a;
                    // linear momentum
                    Px += b.P.x;
                }
            }
            var fs = forceLaws;
            var Nf = fs.length;
            for (var i = 0; i < Nf; i++) {
                pe += fs[i].potentialEnergy().a;
            }
            vars.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
            vars.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
            vars.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
            vars.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
            vars.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X$2, Px);
            vars.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM, 0);
        };
        Dynamics1.prototype.discontinuousEnergyVars = function () {
            return DISCONTINUOUS_ENERGY_VARIABLES$2;
        };
        Dynamics1.prototype.getOffsetName = function (offset) {
            switch (offset) {
                case OFFSET_POSITION_X$2: return "position x";
                case OFFSET_ATTITUDE_A$2: return "attitude a";
                case OFFSET_LINEAR_MOMENTUM_X$2: return "linear momentum x";
                case OFFSET_ANGULAR_MOMENTUM: return "angular momentum";
            }
            throw new Error("getVarName(" + offset + ")");
        };
        Dynamics1.prototype.getVarNames = function () {
            return varNames$2;
        };
        Dynamics1.prototype.numVarsPerBody = function () {
            // Each body is described by 4 kinematic components.
            // 1 position
            // 1 attitude (though normalized should be only 1)
            // 1 linear momentum
            // 1 angular momentum (always zero, but we carry through units).
            return 4;
        };
        return Dynamics1;
    }());

    /**
     *
     */
    var Engine1 = /** @class */ (function (_super) {
        __extends(Engine1, _super);
        function Engine1(options) {
            return _super.call(this, new Euclidean1(), new Dynamics1(), options) || this;
        }
        return Engine1;
    }(Engine));

    /**
     *
     */
    var LinearDamper1 = /** @class */ (function (_super) {
        __extends(LinearDamper1, _super);
        function LinearDamper1(body1, body2) {
            return _super.call(this, body1, body2) || this;
        }
        return LinearDamper1;
    }(LinearDamper));

    var Particle1 = /** @class */ (function (_super) {
        __extends(Particle1, _super);
        function Particle1(mass, charge) {
            return _super.call(this, mass, charge, new Euclidean1()) || this;
        }
        return Particle1;
    }(Particle));

    /**
     *
     */
    var Physics1 = /** @class */ (function (_super) {
        __extends(Physics1, _super);
        function Physics1() {
            return _super.call(this, new Euclidean1(), new Dynamics1()) || this;
        }
        return Physics1;
    }(Physics));

    /**
     *
     */
    var Spring1 = /** @class */ (function (_super) {
        __extends(Spring1, _super);
        function Spring1(body1, body2) {
            return _super.call(this, body1, body2) || this;
        }
        return Spring1;
    }(Spring));

    /**
     * @hidden
     * @param coords
     * @param n
     */
    function approx(coords, n) {
        var max = 0;
        var iLen = coords.length;
        for (var i = 0; i < iLen; i++) {
            max = Math.max(max, Math.abs(coords[i]));
        }
        var threshold = max * Math.pow(10, -n);
        for (var i = 0; i < iLen; i++) {
            if (Math.abs(coords[i]) < threshold) {
                coords[i] = 0;
            }
        }
    }

    /**
     * @hidden
     * @param a
     * @param b
     * @returns
     */
    function arraysEQ(a, b) {
        if (isDefined(a)) {
            if (isDefined(b)) {
                if (!isNull(a)) {
                    if (!isNull(b)) {
                        var aLen = a.length;
                        var bLen = b.length;
                        if (aLen === bLen) {
                            for (var i = 0; i < aLen; i++) {
                                if (a[i] !== b[i]) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return isNull(b);
                }
            }
            else {
                return false;
            }
        }
        else {
            return isUndefined(b);
        }
    }

    /**
     * Returns true if all coordinates of the bivector are exactly zero.
     * @hidden
     */
    function isZeroBivectorE2(m) {
        return m.xy === 0;
    }

    /**
     * Returns true if all coordinates of the vector are exactly zero.
     * @hidden
     */
    function isZeroVectorE2(v) {
        return v.x === 0 && v.y === 0;
    }

    /**
     * Returns true if all coordinates of the vector are exactly zero.
     * @hidden
     */
    function isZeroGeometricE2(m) {
        return isZeroVectorE2(m) && isZeroBivectorE2(m) && m.a === 0 && m.b === 0;
    }

    /**
     * Computes the dot product of the Cartesian components in a Euclidean metric.
     * @hidden
     */
    function dotVectorE2(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * @hidden
     * @param vector
     * @returns
     */
    function quadVectorE2(vector) {
        if (isDefined(vector)) {
            var x = vector.x;
            var y = vector.y;
            if (isNumber(x) && isNumber(y)) {
                return dotVectorE2(vector, vector);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }

    /**
     * @hidden
     */
    var sqrt$1 = Math.sqrt;
    /**
     * @hidden
     * Sets this multivector to a rotor representing a rotation from a to b.
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * Returns undefined (void 0) if the vectors are anti-parallel.
     *
     * @param a The 'from' vector.
     * @param b The 'to' vector.
     * @param m The output multivector.
     * @returns
     */
    function rotorFromDirectionsE2(a, b, m) {
        var quadA = quadVectorE2(a);
        var absA = sqrt$1(quadA);
        var quadB = quadVectorE2(b);
        var absB = sqrt$1(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE2(b, a);
        var denom = sqrt$1(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA, void 0, 1);
            m = m.divByScalar(denom);
        }
        else {
            // The denominator is zero when |a||b| + a << b = 0.
            // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
            // Then a and b are anti-parallel.
            // The plane of the rotation is ambiguous.
            return void 0;
        }
    }

    // Symbolic constants for the coordinate indices into the data array.
    /**
     * @hidden
     */
    var COORD_A = 0;
    /**
     * @hidden
     */
    var COORD_X$3 = 1;
    /**
     * @hidden
     */
    var COORD_Y$3 = 2;
    /**
     * @hidden
     */
    var COORD_B = 3;
    /**
     * @hidden
     */
    var BASIS_LABELS$1 = ["1", "e1", "e2", "e12"];
    BASIS_LABELS$1[COORD_A] = '1';
    BASIS_LABELS$1[COORD_X$3] = 'e1';
    BASIS_LABELS$1[COORD_Y$3] = 'e2';
    BASIS_LABELS$1[COORD_B] = 'e12';
    /**
     * @hidden
     */
    var zero$1 = function zero() {
        return [0, 0, 0, 0];
    };
    /**
     * @hidden
     */
    var scalar$1 = function scalar(a) {
        var coords = zero$1();
        coords[COORD_A] = a;
        return coords;
    };
    /**
     * @hidden
     */
    var vector$1 = function vector(x, y) {
        var coords = zero$1();
        coords[COORD_X$3] = x;
        coords[COORD_Y$3] = y;
        return coords;
    };
    /**
     * @hidden
     */
    var bivector$1 = function bivector(b) {
        var coords = zero$1();
        coords[COORD_B] = b;
        return coords;
    };
    /**
     * @hidden
     */
    var pseudo$1 = function pseudo(b) {
        var coords = zero$1();
        coords[COORD_B] = b;
        return coords;
    };
    /**
     * @hidden
     */
    var spinor$1 = function spinor(a, b) {
        var coords = zero$1();
        coords[COORD_A] = a;
        coords[COORD_B] = b;
        return coords;
    };
    /**
     * Coordinates corresponding to basis labels.
     * @hidden
     */
    var coordinates$1 = function coordinates(m) {
        var coords = zero$1();
        coords[COORD_A] = m.a;
        coords[COORD_X$3] = m.x;
        coords[COORD_Y$3] = m.y;
        coords[COORD_B] = m.b;
        return coords;
    };
    /**
     * @hidden
     */
    function isScalar(m) {
        return m.x === 0 && m.y === 0 && m.b === 0;
    }
    /**
     * Sets the lock on the multivector argument and returns the same argument.
     * This is a convenience function for the dunder (double underscore) methods.
     * All dunder methods should return locked values.
     * @hidden
     */
    function lock$1(m) {
        m.lock();
        return m;
    }
    /**
     * Sentinel value to indicate that the Geometric2 is not locked.
     * UNLOCKED is in the range -1 to 0.
     * @hidden
     */
    var UNLOCKED$1 = -1 * Math.random();
    var Geometric2 = /** @class */ (function () {
        /**
         * Do not call this constructor. Use the static construction methods instead.
         * The multivector is constructed in the unlocked (mutable) state.
         */
        function Geometric2(coords, uom) {
            if (coords === void 0) { coords = zero$1(); }
            /**
             *
             */
            this.lock_ = UNLOCKED$1;
            if (coords.length !== 4) {
                throw new Error("coords.length must be 4");
            }
            this.coords_ = coords;
            this.uom_ = uom;
        }
        /**
         * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
         * The scalar returned is in the unlocked (mutable) state.
         * @param a The scaling factor for the unit of measure.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric2.scalar = function (a, uom) {
            return new Geometric2(scalar$1(a), uom);
        };
        /**
         * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
         * The bivector returned is in the unlocked (mutable) state.
         * @param b The coordinate corresponding to the e1e2 basis bivector.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric2.bivector = function (b, uom) {
            return Geometric2.spinor(0, b, uom);
        };
        /**
         * Creates a spinor valued multivector from the specified cartesian coordinates.
         * The spinor returned is in the unlocked (mutable) state.
         * @param a The scalar coordinate.
         * @param b The pseudoscalar coordinate.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric2.spinor = function (a, b, uom) {
            return new Geometric2(spinor$1(a, b), uom);
        };
        /**
         * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
         * @param x The coordinate corresponding to the e1 basis vector.
         * @param y The coordinate corresponding to the e2 basis vector.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric2.vector = function (x, y, uom) {
            var contextBuilder = function () { return "Geometric2.vector(x: number, y: number, uom?: Unit): Geometric2"; };
            mustBeNumber('x', x, contextBuilder);
            mustBeNumber('y', y, contextBuilder);
            return new Geometric2(vector$1(x, y), uom);
        };
        Geometric2.copy = function (mv) {
            return new Geometric2(coordinates$1(mv), mv.uom);
        };
        Geometric2.fromBivector = function (B) {
            return new Geometric2(bivector$1(B.xy), B.uom);
        };
        Geometric2.fromScalar = function (alpha) {
            return new Geometric2(scalar$1(alpha.a), alpha.uom);
        };
        Geometric2.fromSpinor = function (R) {
            return new Geometric2(spinor$1(R.a, R.xy), R.uom);
        };
        Geometric2.fromVector = function (v) {
            return new Geometric2(vector$1(v.x, v.y), v.uom);
        };
        Geometric2.rotorFromDirections = function (a, b) {
            return new Geometric2([0, 0, 0, 0]).rotorFromDirections(a, b);
        };
        Geometric2.rotorFromVectorToVector = function (a, b) {
            return new Geometric2([0, 0, 0, 0]).rotorFromVectorToVector(a, b);
        };
        Geometric2.prototype.adj = function () {
            throw new Error(notImplemented('adj').message);
        };
        Geometric2.prototype.scale = function (α) {
            return new Geometric2([this.a * α, this.x * α, this.y * α, this.b * α], this.uom);
        };
        Geometric2.prototype.slerp = function (target, α) {
            throw new Error(notImplemented('slerp').message);
        };
        Geometric2.prototype.stress = function (σ) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().stress(σ));
            }
            else {
                this.x *= σ.x;
                this.y *= σ.y;
                this.uom = Unit.mul(σ.uom, this.uom);
                // TODO: Action on other components TBD.
                return this;
            }
        };
        Geometric2.prototype.__div__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(this.clone().div(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(this.clone().divByNumber(rhs));
            }
            else if (rhs instanceof Unit) {
                return lock$1(this.clone().divByScalar(1, rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).div(this));
            }
            else if (typeof lhs === 'number') {
                return lock$1(Geometric2.scalar(lhs, void 0).div(this));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(this).scp(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(Geometric2.copy(this).scp(Geometric2.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).scp(this));
            }
            else if (typeof lhs === 'number') {
                return lock$1(Geometric2.scalar(lhs).scp(this));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(this).ext(rhs));
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is scalar multiplication.
                return lock$1(Geometric2.copy(this).mulByNumber(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).ext(this));
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is scalar multiplication, and commutes.
                return lock$1(Geometric2.copy(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(this).lco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(Geometric2.copy(this).lco(Geometric2.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).lco(this));
            }
            else if (typeof lhs === 'number') {
                return lock$1(Geometric2.scalar(lhs).lco(this));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(this).rco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(Geometric2.copy(this).rco(Geometric2.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).rco(this));
            }
            else if (typeof lhs === 'number') {
                return lock$1(Geometric2.scalar(lhs).rco(this));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__bang__ = function () {
            return lock$1(Geometric2.copy(this).inv());
        };
        Geometric2.prototype.__eq__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.b;
                var b0 = rhs.a;
                var b1 = rhs.x;
                var b2 = rhs.y;
                var b3 = rhs.b;
                // TODO: Should be equals on Unit, but this is close.
                return a0 === b0 && a1 === b1 && a2 === b2 && a3 === b3 && Unit.isCompatible(this.uom, rhs.uom);
            }
            else if (typeof rhs === 'number') {
                return false;
            }
            else {
                return false;
            }
        };
        Geometric2.prototype.__ne__ = function (rhs) {
            throw new Error(notImplemented('__ne_').message);
        };
        Geometric2.prototype.__ge__ = function (rhs) {
            throw new Error(notImplemented('__ge_').message);
        };
        Geometric2.prototype.__gt__ = function (rhs) {
            throw new Error(notImplemented('__gt_').message);
        };
        Geometric2.prototype.__le__ = function (rhs) {
            throw new Error(notImplemented('__le_').message);
        };
        Geometric2.prototype.__lt__ = function (rhs) {
            throw new Error(notImplemented('__lt_').message);
        };
        Geometric2.prototype.__tilde__ = function () {
            return lock$1(Geometric2.copy(this).rev());
        };
        Geometric2.prototype.__add__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(this.clone().add(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(this.clone().addScalar(rhs, void 0, 1));
            }
            else if (rhs instanceof Unit) {
                return lock$1(this.clone().addScalar(1, rhs, 1));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).add(this));
            }
            else if (typeof lhs === 'number') {
                return lock$1(Geometric2.scalar(lhs).add(this));
            }
            else if (lhs instanceof Unit) {
                return lock$1(Geometric2.scalar(1, lhs).add(this));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(this.clone().sub(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(this.clone().subScalar(rhs, void 0, 1));
            }
            else if (rhs instanceof Unit) {
                return lock$1(this.clone().subScalar(1, rhs, 1));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).sub(this));
            }
            else if (typeof lhs === 'number') {
                return lock$1(Geometric2.scalar(lhs).sub(this));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__pos__ = function () {
            return lock$1(Geometric2.copy(this));
        };
        Geometric2.prototype.__neg__ = function () {
            return lock$1(Geometric2.copy(this).neg());
        };
        Geometric2.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Geometric2) {
                return lock$1(this.clone().mul(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock$1(this.clone().mulByNumber(rhs));
            }
            else if (rhs instanceof Unit) {
                return lock$1(this.clone().mulByScalar(1, rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Geometric2) {
                return lock$1(Geometric2.copy(lhs).mul(this));
            }
            else if (typeof lhs === 'number') {
                // The ordering of operands is not important for scalar multiplication.
                return lock$1(Geometric2.copy(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        Geometric2.prototype.add2 = function (a, b) {
            if (isZeroGeometricE2(a)) {
                this.uom = b.uom;
            }
            else if (isZeroGeometricE2(b)) {
                this.uom = a.uom;
            }
            else {
                this.uom = Unit.compatible(a.uom, b.uom);
            }
            this.a = a.a + b.a;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.b = a.b + b.b;
            return this;
        };
        Geometric2.prototype.addPseudo = function (β, uom) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().addPseudo(β, uom));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (β === 0) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.b += β;
                return this;
            }
        };
        Geometric2.prototype.addScalar = function (a, uom, α) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().addScalar(a, uom, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (α === 0) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.a += a * α;
                return this;
            }
        };
        Geometric2.prototype.angle = function () {
            return this.log().grade(2);
        };
        Geometric2.prototype.approx = function (n) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().approx(n));
            }
            else {
                approx(this.coords_, n);
                return this;
            }
        };
        Geometric2.prototype.conj = function () {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().conj());
            }
            else {
                this.x = -this.x;
                this.y = -this.y;
                this.b = -this.b;
                return this;
            }
        };
        Geometric2.prototype.copySpinor = function (spinor) {
            var a = spinor.a;
            var b = spinor.xy;
            this.setCoordinate(COORD_A, a, 'a');
            this.setCoordinate(COORD_X$3, 0, 'x');
            this.setCoordinate(COORD_Y$3, 0, 'y');
            this.setCoordinate(COORD_B, b, 'b');
            this.uom = spinor.uom;
            return this;
        };
        /**
         * @param m The multivector dividend.
         * @returns this / m;
         */
        Geometric2.prototype.div = function (rhs) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().div(rhs));
            }
            else {
                if (isScalar(rhs)) {
                    return this.divByScalar(rhs.a, rhs.uom);
                }
                else {
                    return this.mul(Geometric2.copy(rhs).inv());
                }
            }
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         *
         * @param a The numerator.
         * @param b The denominator.
         */
        Geometric2.prototype.div2 = function (a, b) {
            throw new Error(notImplemented('div2').message);
        };
        Geometric2.prototype.divByNumber = function (α) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().divByNumber(α));
            }
            else {
                this.a /= α;
                this.x /= α;
                this.y /= α;
                this.b /= α;
                return this;
            }
        };
        Geometric2.prototype.divByVector = function (v) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().divByVector(v));
            }
            else {
                var x = v.x;
                var y = v.y;
                var uom2 = Unit.pow(v.uom, QQ.valueOf(2, 1));
                var squaredNorm = x * x + y * y;
                return this.mulByVector(v).divByScalar(squaredNorm, uom2);
            }
        };
        /**
         * dual(m) = I<sub>n</sub> * m = m / I<sub>n</sub>
         *
         * @returns dual(m) or dual(this) if m is undefined.
         */
        Geometric2.prototype.dual = function (m) {
            throw new Error(notImplemented('dual').message);
        };
        Geometric2.prototype.equals = function (other) {
            if (other instanceof Geometric2) {
                // TODO: Check units of measure.
                return arraysEQ(this.coords_, other.coords_);
            }
            else {
                return false;
            }
        };
        Geometric2.prototype.exp = function () {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().exp());
            }
            else {
                Unit.assertDimensionless(this.uom);
                // It's always the case that the scalar commutes with every other
                // grade of the multivector, so we can pull it out the front.
                var expW = Math.exp(this.a);
                // In Geometric2 we have the special case that the pseudoscalar also commutes.
                // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
                // let cosβ = cos(this.b)
                // let sinβ = sin(this.b)
                // We are left with the vector and bivector components.
                // For a bivector (usual case), let B = I * φ, where φ is a vector.
                // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
                var xy = this.xy;
                // φ is actually the absolute value of one half the rotation angle.
                // The orientation of the rotation gets carried in the bivector components.
                var φ = Math.sqrt(xy * xy);
                var s = φ !== 0 ? Math.sin(φ) / φ : 1;
                var cosφ = Math.cos(φ);
                // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
                // The mixture of vector and bivector parts is more complex!
                this.a = cosφ;
                this.xy = xy * s;
                return this.mulByNumber(expW);
            }
        };
        /**
         * <p>
         * <code>this ⟼ lhs ^ rhs</code>
         * </p>
         */
        Geometric2.prototype.ext2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var a2 = lhs.y;
            var a3 = lhs.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            this.a = a0 * b0;
            this.x = a0 * b1 + a1 * b0;
            this.y = a0 * b2 + a2 * b0;
            this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        Geometric2.prototype.grade = function (n) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().grade(n));
            }
            else {
                // There is no change to the unit of measure.
                switch (n) {
                    case 0: {
                        this.x = 0;
                        this.y = 0;
                        this.b = 0;
                        break;
                    }
                    case 1: {
                        this.a = 0;
                        this.b = 0;
                        break;
                    }
                    case 2: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        break;
                    }
                    default: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.b = 0;
                    }
                }
                return this;
            }
        };
        Geometric2.prototype.I = function () {
            this.a = 0;
            this.x = 0;
            this.y = 0;
            this.b = 1;
            this.uom = void 0;
            return this;
        };
        Geometric2.prototype.lco = function (rhs) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().lco(rhs));
            }
            else {
                return this.lco2(this, rhs);
            }
        };
        /**
         * <p>
         * <code>this ⟼ lhs << rhs</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric2.prototype.lco2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var a2 = lhs.y;
            var a3 = lhs.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            this.x = a0 * b1 - a2 * b3;
            this.y = a0 * b2 + a1 * b3;
            this.b = a0 * b3;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        Geometric2.prototype.lerp = function (target, α) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().lerp(target, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = target.uom;
                }
                else if (isZeroGeometricE2(target)) ;
                else {
                    this.uom = Unit.compatible(this.uom, target.uom);
                }
                this.a += (target.a - this.a) * α;
                this.x += (target.x - this.x) * α;
                this.y += (target.y - this.y) * α;
                this.b += (target.b - this.b) * α;
                return this;
            }
        };
        Geometric2.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        Geometric2.prototype.log = function () {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().log());
            }
            else {
                Unit.assertDimensionless(this.uom);
                if (this.isSpinor()) {
                    var α = this.a;
                    var β = this.b;
                    this.a = Math.log(Math.sqrt(α * α + β * β));
                    this.b = Math.atan2(β, α);
                    return this;
                }
                else {
                    throw new Error(notImplemented("log(" + this.toString() + ")").message);
                }
            }
        };
        Geometric2.prototype.one = function () {
            this.a = 1;
            this.x = 0;
            this.y = 0;
            this.b = 0;
            this.uom = void 0;
            return this;
        };
        Geometric2.prototype.rco = function (m) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().rco(m));
            }
            else {
                return this.rco2(this, m);
            }
        };
        /**
         * <p>
         * <code>this ⟼ lhs >> rhs</code>
         * </p>
         */
        Geometric2.prototype.rco2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var a2 = lhs.y;
            var a3 = lhs.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            this.x = -a1 * b0 - a3 * b2;
            this.y = -a2 * b0 + a3 * b1;
            this.b = a3 * b0;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        /**
         * If `this` is mutable, then sets `this` multivector to its reflection in the plane orthogonal to vector n. The result is mutable.
         * If `this` is immutable (locked), a copy of `this` is made, which is then reflected. The result is immutable (locked).
         *
         * i.e. The result is mutable (unlocked) iff `this` is mutable (unlocked).
         *
         * Mathematically,
         *
         * this ⟼ - n * this * n
         *
         * Geometrically,
         *
         * Reflects this multivector in the plane orthogonal to the unit vector, n.
         * This implementation does assume that n is a vector, but does not assume that it is normalized to unity.
         *
         * If n is not a unit vector then the result is scaled by n squared.
         * The scalar component gets an extra minus sign. The pseudoscalar component does not change sign.
         * The units of measure are carried through but in most cases n SHOULD be dimensionless.
         *
         * @param n The unit vector that defines the reflection plane.
         */
        Geometric2.prototype.reflect = function (n) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().reflect(n));
            }
            else {
                var nx = n.x;
                var ny = n.y;
                var nu = n.uom;
                var a = this.a;
                var x = this.x;
                var y = this.y;
                var b = this.b;
                var u = this.uom;
                var nx2 = nx * nx;
                var ny2 = ny * ny;
                var μ = nx2 - ny2;
                var λ = -2 * nx * ny;
                var β = nx2 + ny2;
                // The scalar component picks up a minus sign and the factor |n||n|.
                this.a = -β * a;
                this.x = λ * y - μ * x;
                this.y = λ * x + μ * y;
                // The pseudoscalar component does not change sign but still picks up the |n||n| factor.
                this.b = β * b;
                // In most cases, n SHOULD be dimensionless.
                this.uom = Unit.mul(nu, Unit.mul(u, nu));
                return this;
            }
        };
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         *
         * The result is independent of the magnitudes of a and b.
         *
         * @param a The starting vector
         * @param b The ending vector
         * @returns The rotor representing a rotation from a to b.
         */
        Geometric2.prototype.rotorFromDirections = function (a, b) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().rotorFromDirections(a, b));
            }
            else {
                rotorFromDirectionsE2(a, b, this);
                return this;
            }
        };
        Geometric2.prototype.rotorFromFrameToFrame = function (es, fs) {
            throw new Error(notImplemented('rotorFromFrameToFrame').message);
        };
        /**
         * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
         *
         * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
         *
         * @param B The (unit) bivector generating the rotation.
         * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
         */
        Geometric2.prototype.rotorFromGeneratorAngle = function (B, θ) {
            throw new Error(notImplemented('rotorFromGeneratorAngle').message);
        };
        /**
         * R = sqrt(|b|/|a|) * (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         *
         * The result is depends  on the magnitudes of a and b.
         */
        Geometric2.prototype.rotorFromVectorToVector = function (a, b) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().rotorFromVectorToVector(a, b));
            }
            else {
                var ax = a.x;
                var ay = a.y;
                var bx = b.x;
                var by = b.y;
                var mb = Math.sqrt(bx * bx + by * by);
                var ma = Math.sqrt(ax * ax + ay * ay);
                /**
                 * s = |b||a|
                 */
                var s = mb * ma;
                /**
                 * p = b.a or b << a
                 */
                var p = bx * ax + by * ay;
                /**
                 * q = b ^ a
                 */
                var q = bx * ay - by * ax;
                var d = Math.sqrt(2 * s * (s + p));
                var f = Math.sqrt(mb) / (Math.sqrt(ma) * d);
                this.a = f * (s + p);
                this.x = 0;
                this.y = 0;
                this.b = f * q;
                this.uom = Unit.sqrt(Unit.div(b.uom, a.uom));
                return this;
            }
        };
        Geometric2.prototype.sqrt = function () {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().sqrt());
            }
            else {
                this.a = Math.sqrt(this.a);
                this.x = 0;
                this.y = 0;
                this.b = 0;
                this.uom = Unit.sqrt(this.uom);
                return this;
            }
        };
        Geometric2.prototype.squaredNorm = function () {
            return this.quaditude();
        };
        Geometric2.prototype.sub2 = function (a, b) {
            if (isZeroGeometricE2(a)) {
                this.a = -b.a;
                this.x = -b.x;
                this.y = -b.y;
                this.b = -b.b;
                this.uom = b.uom;
            }
            else if (isZeroGeometricE2(b)) {
                this.a = a.a;
                this.x = a.x;
                this.y = a.y;
                this.b = a.b;
                this.uom = a.uom;
            }
            else {
                this.a = a.a - b.a;
                this.x = a.x - b.x;
                this.y = a.y - b.y;
                this.b = a.b - b.b;
                this.uom = Unit.compatible(a.uom, b.uom);
            }
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this Geometric2 to the geometric product a * b of the vector arguments.
         */
        Geometric2.prototype.versor = function (a, b) {
            this.a = a.x * b.x + a.y * b.y;
            this.x = 0;
            this.y = 0;
            this.b = a.x * b.y - a.y * b.x;
            this.uom = Unit.mul(a.uom, b.uom);
            return this;
        };
        /**
         * Determines whether this multivector is locked.
         * If the multivector is in the unlocked state then it is mutable.
         * If the multivector is in the locked state then it is immutable.
         */
        Geometric2.prototype.isLocked = function () {
            return this.lock_ !== UNLOCKED$1;
        };
        Geometric2.prototype.isMutable = function () {
            return this.lock_ === UNLOCKED$1;
        };
        /**
         * Locks this multivector (preventing any further mutation),
         * and returns a token that may be used to unlock it.
         */
        Geometric2.prototype.lock = function () {
            if (this.lock_ !== UNLOCKED$1) {
                throw new Error("already locked");
            }
            else {
                this.lock_ = Math.random();
                return this.lock_;
            }
        };
        /**
         * Unlocks this multivector (allowing mutation),
         * using a token that was obtained from a preceding lock method call.
         */
        Geometric2.prototype.unlock = function (token) {
            if (this.lock_ === UNLOCKED$1) {
                throw new Error("not locked");
            }
            else if (this.lock_ === token) {
                this.lock_ = UNLOCKED$1;
            }
            else {
                throw new Error("unlock denied");
            }
        };
        /**
         * Consistently set a coordinate value in the most optimized way.
         * Permits mutation only when the lock status is UNLOCKED.
         * It is safe to use this as an alternative to the named property accessors.
         */
        Geometric2.prototype.setCoordinate = function (index, newValue, name) {
            if (this.lock_ === UNLOCKED$1) {
                var coords = this.coords_;
                var previous = coords[index];
                if (newValue !== previous) {
                    coords[index] = newValue;
                }
            }
            else {
                throw new Error(readOnly(name).message);
            }
        };
        Object.defineProperty(Geometric2.prototype, "a", {
            /**
             * The scalar part of this multivector.
             */
            get: function () {
                return this.coords_[COORD_A];
            },
            set: function (a) {
                this.setCoordinate(COORD_A, a, 'a');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "b", {
            /**
             * The pseudoscalar part of this multivector.
             */
            get: function () {
                return this.coords_[COORD_B];
            },
            set: function (b) {
                this.setCoordinate(COORD_B, b, 'b');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "xy", {
            get: function () {
                return this.coords_[COORD_B];
            },
            set: function (xy) {
                this.setCoordinate(COORD_B, xy, 'xy');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "grades", {
            /**
             * A bitmask describing the grades.
             *
             * 0x0 = zero
             * 0x1 = scalar
             * 0x2 = vector
             * 0x4 = bivector
             * 0x8 = pseudoscalar
             */
            get: function () {
                var coords = this.coords_;
                var α = coords[COORD_A];
                var x = coords[COORD_X$3];
                var y = coords[COORD_Y$3];
                var β = coords[COORD_B];
                var mask = 0x0;
                if (α !== 0) {
                    mask += 0x1;
                }
                if (x !== 0 || y !== 0) {
                    mask += 0x2;
                }
                if (β !== 0) {
                    mask += 0x4;
                }
                return mask;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "uom", {
            /**
             * The optional unit of measure.
             */
            get: function () {
                return this.uom_;
            },
            set: function (uom) {
                if (this.lock_ === UNLOCKED$1) {
                    // This is the only place where we should check the unit of measure.
                    // It also should be the only place where we access the private member.
                    this.uom_ = Unit.mustBeUnit('uom', uom);
                }
                else {
                    throw new Error(readOnly('uom').message);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "x", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
             */
            get: function () {
                return this.coords_[COORD_X$3];
            },
            set: function (x) {
                this.setCoordinate(COORD_X$3, x, 'x');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric2.prototype, "y", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
             */
            get: function () {
                return this.coords_[COORD_Y$3];
            },
            set: function (y) {
                this.setCoordinate(COORD_Y$3, y, 'y');
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Adds a multivector value to this multivector with optional scaling.
         *
         * @param M The multivector to be added to this multivector.
         * @param α An optional scale factor that multiplies the multivector argument.
         * @returns this + M * α
         */
        Geometric2.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().add(M, α));
            }
            else {
                if (this.isZero()) {
                    this.a = M.a * α;
                    this.x = M.x * α;
                    this.y = M.y * α;
                    this.b = M.b * α;
                    this.uom = M.uom;
                    return this;
                }
                else if (isZeroGeometricE2(M)) {
                    // α has no effect because M is zero.
                    return this;
                }
                else {
                    this.a += M.a * α;
                    this.x += M.x * α;
                    this.y += M.y * α;
                    this.b += M.b * α;
                    this.uom = Unit.compatible(this.uom, M.uom);
                    return this;
                }
            }
        };
        /**
         * @param v The vector to be added to this multivector.
         * @param α An optional scale factor that multiplies the vector argument.
         * @returns this + v * α
         */
        Geometric2.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().addVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (isZeroVectorE2(v)) {
                    // α has no effect because v is zero.
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, v.uom);
                }
                this.x += v.x * α;
                this.y += v.y * α;
                return this;
            }
        };
        /**
         * @returns copy(this)
         */
        Geometric2.prototype.clone = function () {
            return Geometric2.copy(this);
        };
        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         *
         * @param M The multivector to be copied.
         */
        Geometric2.prototype.copy = function (M) {
            this.a = M.a;
            this.x = M.x;
            this.y = M.y;
            this.b = M.b;
            this.uom = M.uom;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(B)</code>
         * </p>
         *
         * @param B The bivector to be copied.
         */
        Geometric2.prototype.copyBivector = function (B) {
            var b = B.xy;
            this.setCoordinate(COORD_A, 0, 'a');
            this.setCoordinate(COORD_X$3, 0, 'x');
            this.setCoordinate(COORD_Y$3, 0, 'y');
            this.setCoordinate(COORD_B, b, 'b');
            this.uom = B.uom;
            return this;
        };
        /**
         * Sets this multivector to the value of the scalar, α.
         * The non-scalar components are set to zero.
         *
         * @param α The scalar to be copied.
         * @param uom The unit of measure.
         */
        Geometric2.prototype.copyScalar = function (α, uom) {
            this.setCoordinate(COORD_A, α, 'a');
            this.setCoordinate(COORD_X$3, 0, 'x');
            this.setCoordinate(COORD_Y$3, 0, 'y');
            this.setCoordinate(COORD_B, 0, 'b');
            this.uom = uom;
            return this;
        };
        /**
         * Copies the vector argument value into this multivector.
         * The non-vector components are set to zero.
         *
         * @param vector The vector to be copied.
         */
        Geometric2.prototype.copyVector = function (vector) {
            var x = vector.x;
            var y = vector.y;
            this.setCoordinate(COORD_A, 0, 'a');
            this.setCoordinate(COORD_X$3, x, 'x');
            this.setCoordinate(COORD_Y$3, y, 'y');
            this.setCoordinate(COORD_B, 0, 'b');
            this.uom = vector.uom;
            return this;
        };
        /**
         * @returns this / magnitude(this)
         */
        Geometric2.prototype.direction = function () {
            if (this.isMutable()) {
                var norm = this.magnitudeNoUnits();
                if (norm !== 0) {
                    this.a = this.a / norm;
                    this.x = this.x / norm;
                    this.y = this.y / norm;
                    this.b = this.b / norm;
                }
                this.uom = void 0;
                return this;
            }
            else {
                return lock$1(this.clone().direction());
            }
        };
        Geometric2.prototype.divByPseudo = function (β, uom) {
            if (this.isMutable()) {
                var a = this.a;
                var x = this.x;
                var y = this.y;
                var b = this.b;
                this.a = b / β;
                this.x = y / β;
                this.y = -x / β;
                this.b = -a / β;
                this.uom = Unit.div(this.uom, uom);
                return this;
            }
            else {
                return lock$1(this.clone().divByPseudo(β, uom));
            }
        };
        /**
         * <p>
         * <code>this ⟼ this / (α * uom)</code>
         * </p>
         *
         * @param α The scalar dividend.
         * @param uom The unit of measure.
         */
        Geometric2.prototype.divByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().divByScalar(α, uom));
            }
            else {
                this.uom = Unit.div(this.uom, uom);
                this.a /= α;
                this.x /= α;
                this.y /= α;
                this.b /= α;
                return this;
            }
        };
        /**
         * @param m
         * @returns this ^ m
         */
        Geometric2.prototype.ext = function (m) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().ext(m));
            }
            else {
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.b;
                var b0 = m.a;
                var b1 = m.x;
                var b2 = m.y;
                var b3 = m.b;
                this.a = a0 * b0;
                this.x = a0 * b1 + a1 * b0;
                this.y = a0 * b2 + a2 * b0;
                this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
                this.uom = Unit.mul(this.uom, m.uom);
                return this;
            }
        };
        /**
         * Computes the inverse of this multivector.
         * TODO: Define what inverse means.
         * @returns inverse(this)
         */
        Geometric2.prototype.inv = function () {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().inv());
            }
            else {
                var α = this.a;
                var x = this.x;
                var y = this.y;
                var β = this.b;
                var A = [
                    [α, x, y, -β],
                    [x, α, β, -y],
                    [y, -β, α, x],
                    [β, -y, x, α]
                ];
                var b = [1, 0, 0, 0];
                var X = gauss(A, b);
                this.a = X[0];
                this.x = X[1];
                this.y = X[2];
                this.b = X[3];
                this.uom = Unit.inv(this.uom);
                return this;
            }
        };
        Geometric2.prototype.isBivector = function () {
            return this.a === 0 && this.x === 0 && this.y === 0;
        };
        Geometric2.prototype.isOne = function () {
            if (Unit.isOne(this.uom)) {
                return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0;
            }
            else {
                return false;
            }
        };
        Geometric2.prototype.isScalar = function () {
            return isScalar(this);
        };
        Geometric2.prototype.isSpinor = function () {
            if (Unit.isOne(this.uom)) {
                return this.x === 0 && this.y === 0;
            }
            else {
                return false;
            }
        };
        Geometric2.prototype.isVector = function () {
            return this.a === 0 && this.b === 0;
        };
        /**
         * Determines whether this multivector is exactly 0 (zero).
         */
        Geometric2.prototype.isZero = function () {
            // It does not matter what the unit of measure is if all the coordinates are zero.
            return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0;
        };
        /**
         * <p>
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * </p>
         */
        Geometric2.prototype.magnitude = function () {
            if (this.isMutable()) {
                this.a = this.magnitudeNoUnits();
                this.x = 0;
                this.y = 0;
                this.b = 0;
                // The unit of measure is unchanged.
                return this;
            }
            else {
                return lock$1(this.clone().magnitude());
            }
        };
        Geometric2.prototype.magnitudeNoUnits = function () {
            return Math.sqrt(this.quaditudeNoUnits());
        };
        /**
         * @param rhs
         * @returns this * m
         */
        Geometric2.prototype.mul = function (rhs) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().mul(rhs));
            }
            else {
                return this.mul2(this, rhs);
            }
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric2.prototype.mul2 = function (lhs, rhs) {
            var a0 = lhs.a;
            var a1 = lhs.x;
            var a2 = lhs.y;
            var a3 = lhs.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            this.a = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            this.x = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.y = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.b = a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0;
            this.uom = Unit.mul(this.uom, rhs.uom);
            return this;
        };
        Geometric2.prototype.mulByBivector = function (B) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().mulByBivector(B));
            }
            else {
                this.uom = Unit.mul(this.uom, B.uom);
                var a = this.a;
                var x = this.x;
                var y = this.y;
                var b = this.b;
                var β = B.xy;
                this.a = -b * β;
                this.x = -y * β;
                this.y = +x * β;
                this.b = a * β;
                return this;
            }
        };
        /**
         * @param α
         * @returns this * α
         */
        Geometric2.prototype.mulByNumber = function (α) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().mulByNumber(α));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.y *= α;
                this.b *= α;
                // There is no change in the unit of measure.
                return this;
            }
        };
        /**
         * @param α
         * @param uom
         * @returns this * (α * uom)
         */
        Geometric2.prototype.mulByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().mulByScalar(α, uom));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.y *= α;
                this.b *= α;
                this.uom = Unit.mul(this.uom, uom);
                return this;
            }
        };
        Geometric2.prototype.mulByVector = function (v) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().mulByVector(v));
            }
            else {
                this.uom = Unit.mul(this.uom, v.uom);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a4 = this.xy;
                var b1 = v.x;
                var b2 = v.y;
                this.a = a1 * b1 + a2 * b2;
                this.x = a0 * b1 + a4 * b2;
                this.y = a0 * b2 - a4 * b1;
                this.b = a1 * b2 - a2 * b1;
                return this;
            }
        };
        /**
         * @returns this * -1
         */
        Geometric2.prototype.neg = function () {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().neg());
            }
            else {
                this.a = -this.a;
                this.x = -this.x;
                this.y = -this.y;
                this.b = -this.b;
                // There is no change in the unit of measure.
                return this;
            }
        };
        /**
         * The quad of a multivector is defined in terms of the scalar products
         * of its blades.
         * this ⟼ scp(this, rev(this)) = this | ~this
         */
        Geometric2.prototype.quaditude = function () {
            if (this.isMutable()) {
                this.a = this.quaditudeNoUnits();
                this.x = 0;
                this.y = 0;
                this.b = 0;
                this.uom = Unit.mul(this.uom, this.uom);
                return this;
            }
            else {
                return lock$1(this.clone().quaditude());
            }
        };
        /**
         * reverse has a ++-- structure on the grades.
         * The scalar component, a, will not change.
         * The vector components, x and y, will not change.
         * The bivector component, b, will change sign.
         */
        Geometric2.prototype.rev = function () {
            if (this.isMutable()) {
                // reverse has a ++-- structure on the grades.
                this.a = +this.a;
                this.x = +this.x;
                this.y = +this.y;
                this.b = -this.b;
                // The unit of measure is unchanged.
                return this;
            }
            else {
                return lock$1(this.clone().rev());
            }
        };
        /**
         * (α + βI)(a + x.e1 + y.e2 + b.I)(α - β.I)
         *
         * @param spinor the spinor that rotates this multivector.
         * @returns R * this * reverse(R)
         */
        Geometric2.prototype.rotate = function (spinor) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().rotate(spinor));
            }
            else {
                // We are assuming that R is dimensionless.
                Unit.assertDimensionless(spinor.uom);
                var a = this.a;
                var x = this.x;
                var y = this.y;
                var b = this.b;
                var α = spinor.a;
                var β = spinor.xy;
                var α2 = α * α;
                var β2 = β * β;
                var p = α2 - β2;
                var q = 2 * α * β;
                var s = α2 + β2;
                this.a = s * a;
                this.x = p * x + q * y;
                this.y = p * y - q * x;
                this.b = s * b;
                return this;
            }
        };
        /**
         * @param m
         * @returns this | m
         */
        Geometric2.prototype.scp = function (m) {
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().scp(m));
            }
            else {
                return this.scp2(this, m);
            }
        };
        /**
         * <p>
         * <code>this ⟼ scp(a, b) = a | b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric2.prototype.scp2 = function (a, b) {
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.b;
            var s = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
            this.a = s;
            this.x = 0;
            this.y = 0;
            this.b = 0;
            this.uom = Unit.mul(a.uom, b.uom);
            return this;
        };
        Geometric2.prototype.quaditudeNoUnits = function () {
            var a = this.a;
            var x = this.x;
            var y = this.y;
            var b = this.b;
            return a * a + x * x + y * y + b * b;
        };
        /**
         * @param M
         * @param α
         * @returns this - M * α
         */
        Geometric2.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().sub(M, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = M.uom;
                }
                else if (isZeroGeometricE2(M)) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, M.uom);
                }
                this.a -= M.a * α;
                this.x -= M.x * α;
                this.y -= M.y * α;
                this.b -= M.b * α;
                return this;
            }
        };
        Geometric2.prototype.subScalar = function (a, uom, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().subScalar(a, uom, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.a -= a * α;
                return this;
            }
        };
        /**
         * @param v The vector to subtract from this multivector.
         * @param α The multiplier for the amount of the vector to subtract.
         * @returns this - v * α
         */
        Geometric2.prototype.subVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED$1) {
                return lock$1(this.clone().subVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (isZeroVectorE2(v)) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, v.uom);
                }
                this.x -= v.x * α;
                this.y -= v.y * α;
                return this;
            }
        };
        /**
         * Returns a string representing the number in exponential notation.
         *
         * @param fractionDigits
         * @returns
         */
        Geometric2.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates(coordinates$1(this), coordToString, BASIS_LABELS$1, this.uom);
        };
        /**
         * Returns a string representing the number in fixed-point notation.
         *
         * @param fractionDigits
         * @returns
         */
        Geometric2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates$1(this), coordToString, BASIS_LABELS$1, this.uom);
        };
        /**
         * @param precision
         * @returns
         */
        Geometric2.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates(coordinates$1(this), coordToString, BASIS_LABELS$1, this.uom);
        };
        /**
         * Returns a string representation of the number.
         *
         * @param radix
         * @returns
         */
        Geometric2.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates(coordinates$1(this), coordToString, BASIS_LABELS$1, this.uom);
        };
        Geometric2.prototype.write = function (mv) {
            mv.a = this.a;
            mv.x = this.x;
            mv.y = this.y;
            mv.b = this.b;
            mv.uom = this.uom;
        };
        /**
         * Sets this Geometric2 to have the specified cartesian coordinates and unit of measure.
         *
         * this.a   ⟼ 0,
         * this.x   ⟼ x,
         * this.y   ⟼ y,
         * this.b   ⟼ 0,
         * this.uom ⟼ uom
         *
         * @param x The cartesian x coordinate corresponding to the e1 basis vector.
         * @param y The cartesian y coordinate corresponding to the e2 basis vector.
         * @param uom The optional unit of measure.
         * @returns this Geometric2.
         * @throws An Error if this Geometric2 is not mutable.
         */
        Geometric2.prototype.vectorFromCoords = function (x, y, uom) {
            var contextBuilder = function () { return "vectorFromCoords(x: number, y: number, uom?: Unit): this"; };
            mustBeNumber('x', x, contextBuilder);
            mustBeNumber('y', y, contextBuilder);
            if (this.isMutable()) {
                this.a = 0;
                this.x = x;
                this.y = y;
                this.b = 0;
                this.uom = uom;
                return this;
            }
            else {
                throw new Error("Unable to mutate this locked Geometric2.");
            }
        };
        Geometric2.prototype.writeVector = function (v) {
            v.x = this.x;
            v.y = this.y;
            v.uom = this.uom;
        };
        Geometric2.prototype.writeBivector = function (B) {
            B.xy = this.xy;
            B.uom = this.uom;
        };
        /**
         * Sets this multivector to the identity element for addition, 0.
         */
        Geometric2.prototype.zero = function () {
            this.a = 0;
            this.x = 0;
            this.y = 0;
            this.b = 0;
            this.uom = void 0;
            return this;
        };
        /**
         * Constructs a Geometric2 representing the number zero.
         * The identity element for addition, <b>0</b>.
         * The returned multivector is locked.
         */
        Geometric2.zero = lock$1(new Geometric2(zero$1(), void 0));
        /**
         * Constructs a Geometric2 representing the number one.
         * The identity element for multiplication, <b>1</b>.
         * The returned multivector is locked.
         */
        Geometric2.one = lock$1(new Geometric2(scalar$1(1), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>x</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric2.e1 = lock$1(new Geometric2(vector$1(1, 0), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>y</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric2.e2 = lock$1(new Geometric2(vector$1(0, 1), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>β</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric2.I = lock$1(new Geometric2(pseudo$1(1), void 0));
        /**
         * SI base unit of length.
         * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
         */
        Geometric2.meter = lock$1(new Geometric2(scalar$1(1), Unit.METER));
        /**
         * SI base unit of mass.
         * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
         */
        Geometric2.kilogram = lock$1(new Geometric2(scalar$1(1), Unit.KILOGRAM));
        /**
         * SI base unit of time.
         * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
         */
        Geometric2.second = lock$1(new Geometric2(scalar$1(1), Unit.SECOND));
        /**
         * SI base unit of electric current.
         * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
         */
        Geometric2.ampere = lock$1(new Geometric2(scalar$1(1), Unit.AMPERE));
        /**
         * SI base unit of thermodynamic temperature.
         * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
         */
        Geometric2.kelvin = lock$1(new Geometric2(scalar$1(1), Unit.KELVIN));
        /**
         * SI base unit of amount of substance.
         * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
         *
         * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
         */
        Geometric2.mole = lock$1(new Geometric2(scalar$1(1), Unit.MOLE));
        /**
         * SI base unit of luminous intensity.
         * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
         */
        Geometric2.candela = lock$1(new Geometric2(scalar$1(1), Unit.CANDELA));
        /**
         * SI derived unit of electric charge, quantity of electricity.
         */
        Geometric2.coulomb = lock$1(new Geometric2(scalar$1(1), Unit.COULOMB));
        /**
         * SI derived unit of force.
         */
        Geometric2.newton = lock$1(new Geometric2(scalar$1(1), Unit.NEWTON));
        /**
         * SI derived unit of energy, work, quantity of heat.
         */
        Geometric2.joule = lock$1(new Geometric2(scalar$1(1), Unit.JOULE));
        return Geometric2;
    }());

    var Matrix1 = /** @class */ (function (_super) {
        __extends(Matrix1, _super);
        /**
         *
         * @param elements
         * @param uom The optional unit of measure.
         */
        function Matrix1(elements, uom) {
            return _super.call(this, elements, 1, uom) || this;
        }
        Matrix1.one = function () {
            return new Matrix1(new Float32Array([1]));
        };
        Matrix1.zero = function () {
            return new Matrix1(new Float32Array([0]));
        };
        return Matrix1;
    }(AbstractMatrix));

    /**
     * @hidden
     */
    var Mat1 = /** @class */ (function () {
        function Mat1(value) {
            this.value = value;
        }
        Object.defineProperty(Mat1.prototype, "dimensions", {
            get: function () {
                return 1;
            },
            enumerable: false,
            configurable: true
        });
        Mat1.prototype.getElement = function (row, column) {
            if (row === 0 && column === 0) {
                return this.value;
            }
            else {
                throw new Error('row and column must both b zero.');
            }
        };
        return Mat1;
    }());

    /**
     *
     */
    var Force2 = /** @class */ (function (_super) {
        __extends(Force2, _super);
        function Force2(body) {
            return _super.call(this, body) || this;
        }
        return Force2;
    }(Force));

    /**
     *
     */
    var Torque2 = /** @class */ (function (_super) {
        __extends(Torque2, _super);
        function Torque2(body) {
            return _super.call(this, body) || this;
        }
        return Torque2;
    }(Torque));

    /**
     * @hidden
     */
    var Euclidean2 = /** @class */ (function () {
        function Euclidean2() {
        }
        Euclidean2.prototype.a = function (mv) {
            return mv.a;
        };
        Euclidean2.prototype.add = function (lhs, rhs) {
            return lhs.add(rhs);
        };
        Euclidean2.prototype.addVector = function (lhs, rhs) {
            return lhs.addVector(rhs);
        };
        Euclidean2.prototype.applyMatrix = function (mv, matrix) {
            throw new Error("applyMatrix(mv, matrix) method not implemented.");
        };
        Euclidean2.prototype.clone = function (source) {
            return source.clone();
        };
        Euclidean2.prototype.copy = function (source, target) {
            return target.copy(source);
        };
        Euclidean2.prototype.copyBivector = function (source, target) {
            return target.copyBivector(source);
        };
        Euclidean2.prototype.copyMatrix = function (m) {
            if (m.dimensions !== 1) {
                throw new Error("matrix dimensions must be 1.");
            }
            var value = m.getElement(0, 0);
            return new Matrix1(new Float32Array([value]), m.uom);
        };
        Euclidean2.prototype.copyVector = function (source, target) {
            return target.copyVector(source);
        };
        Euclidean2.prototype.copyScalar = function (a, uom, target) {
            return target.copyScalar(a, uom);
        };
        Euclidean2.prototype.createForce = function (body) {
            return new Force2(body);
        };
        Euclidean2.prototype.createTorque = function (body) {
            return new Torque2(body);
        };
        Euclidean2.prototype.direction = function (mv) {
            return mv.direction();
        };
        Euclidean2.prototype.divByScalar = function (lhs, a, uom) {
            return lhs.divByScalar(a, uom);
        };
        Euclidean2.prototype.identityMatrix = function () {
            return new Mat1(1);
        };
        Euclidean2.prototype.invertMatrix = function (m) {
            if (m.dimensions !== 1) {
                throw new Error("matrix dimensions must be 1.");
            }
            return new Matrix1(new Float32Array([1 / m.getElement(0, 0)]), Unit.div(Unit.ONE, m.uom));
        };
        Euclidean2.prototype.isBivector = function (mv) {
            return mv.isBivector();
        };
        Euclidean2.prototype.isScalar = function (mv) {
            return mv.isScalar();
        };
        Euclidean2.prototype.isSpinor = function (mv) {
            return mv.isSpinor();
        };
        Euclidean2.prototype.isVector = function (mv) {
            return mv.isVector();
        };
        Euclidean2.prototype.isZero = function (mv) {
            return mv.isZero();
        };
        Euclidean2.prototype.lock = function (mv) {
            return mv.lock();
        };
        Euclidean2.prototype.norm = function (mv) {
            return mv.magnitude();
        };
        Euclidean2.prototype.mul = function (lhs, rhs) {
            return lhs.mul(rhs);
        };
        Euclidean2.prototype.mulByNumber = function (lhs, alpha) {
            return lhs.mulByNumber(alpha);
        };
        Euclidean2.prototype.mulByScalar = function (lhs, a, uom) {
            return lhs.mulByScalar(a, uom);
        };
        Euclidean2.prototype.mulByVector = function (lhs, rhs) {
            return lhs.mulByVector(rhs);
        };
        Euclidean2.prototype.neg = function (mv) {
            return mv.neg();
        };
        Euclidean2.prototype.quad = function (mv) {
            return mv.quaditude();
        };
        Euclidean2.prototype.rev = function (mv) {
            return mv.rev();
        };
        Euclidean2.prototype.rotate = function (mv, spinor) {
            return mv.rotate(spinor);
        };
        Euclidean2.prototype.scalar = function (a, uom) {
            return Geometric2.scalar(a, uom);
        };
        Euclidean2.prototype.scp = function (lhs, rhs) {
            return lhs.scp(rhs);
        };
        Euclidean2.prototype.setUom = function (mv, uom) {
            mv.uom = uom;
        };
        Euclidean2.prototype.sub = function (lhs, rhs) {
            // TODO: Could generalize to subtracting a fraction...
            return lhs.sub(rhs, 1);
        };
        Euclidean2.prototype.subScalar = function (lhs, rhs) {
            return lhs.subScalar(rhs.a, rhs.uom, 1);
        };
        Euclidean2.prototype.subVector = function (lhs, rhs) {
            // TODO: Could generalize to subtracting a fraction...
            return lhs.subVector(rhs);
        };
        Euclidean2.prototype.unlock = function (mv, token) {
            mv.unlock(token);
        };
        Euclidean2.prototype.uom = function (mv) {
            return mv.uom;
        };
        Euclidean2.prototype.ext = function (lhs, rhs) {
            return lhs.ext(rhs);
        };
        Euclidean2.prototype.write = function (source, target) {
            source.write(target);
        };
        Euclidean2.prototype.writeVector = function (source, target) {
            source.writeVector(target);
        };
        Euclidean2.prototype.writeBivector = function (source, target) {
            source.writeBivector(target);
        };
        Euclidean2.prototype.zero = function () {
            return Geometric2.zero.clone();
        };
        return Euclidean2;
    }());

    /**
     * @hidden
     */
    var L = new Geometric2();
    /**
     *
     */
    var RigidBody2 = /** @class */ (function (_super) {
        __extends(RigidBody2, _super);
        function RigidBody2() {
            return _super.call(this, new Euclidean2()) || this;
        }
        /**
         *
         */
        RigidBody2.prototype.updateAngularVelocity = function () {
            // If the angular momentum is mutable then we don't want to accidentally change it.
            // If the angular momentum is immutable then we will need a scratch variable to avoid creating temporary objects. 
            L.copyBivector(this.L);
            // We know that (in 2D) the moment of inertia is a scalar.
            // The angular velocity property performs copy on assignment.
            this.Ω = L.mulByScalar(this.Iinv.getElement(0, 0), this.Iinv.uom);
        };
        return RigidBody2;
    }(RigidBody));

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * A rectangular block of constant surface density.
     */
    var Block2 = /** @class */ (function (_super) {
        __extends(Block2, _super);
        /**
         *
         */
        function Block2(width, height) {
            if (width === void 0) { width = Geometric2.one; }
            if (height === void 0) { height = Geometric2.one; }
            var _this = _super.call(this) || this;
            if (!(width instanceof Geometric2)) {
                throw new Error("width must be a Geometric2.");
            }
            if (!(height instanceof Geometric2)) {
                throw new Error("height must be a Geometric2.");
            }
            _this.width_ = Geometric2.copy(width);
            _this.widthLock_ = _this.width_.lock();
            _this.height_ = Geometric2.copy(height);
            _this.heightLock_ = _this.height_.lock();
            if (Unit.isOne(width.uom) && Unit.isOne(height.uom)) ;
            else {
                _this.M = Geometric2.scalar(_this.M.a, Unit.KILOGRAM);
                _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                _this.X.uom = Unit.METER;
                _this.R.uom = Unit.ONE;
                _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
                _this.L.uom = Unit.JOULE_SECOND;
            }
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Block2.prototype, "width", {
            get: function () {
                return this.width_;
            },
            set: function (width) {
                this.width_.unlock(this.widthLock_);
                this.width_.copy(width);
                this.widthLock_ = this.width_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Block2.prototype, "height", {
            get: function () {
                return this.height_;
            },
            set: function (height) {
                this.height_.unlock(this.heightLock_);
                this.height_.copy(height);
                this.heightLock_ = this.height_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * The angular velocity is updated from the angular momentum.
         * Ω = 12 * L * (1/M) * 1 / (h^2+w^2)
         */
        Block2.prototype.updateAngularVelocity = function () {
            // TODO: If we have already computer the inertia tensor, why do we compute it again?
            // RigidBody2 provides an optimized implementation.
            var w = this.width_;
            var h = this.height_;
            var ww = w.a * w.a;
            var hh = h.a * h.a;
            var k = 12 / this.M.a;
            this.Ω.xy = k * this.L.xy / (ww + hh); // Ω = 12 * L * (1/M) * 1/(h^2+w^2)
            this.Ω.uom = Unit.div(Unit.div(this.L.uom, this.M.uom), Unit.mul(w.uom, w.uom)); // (L / M) * (1/w^2)
        };
        /**
         * Whenever the mass or the dimensions change, we must update the inertia tensor.
         * L = J(Ω) = (1/12) * M * (h^2 + w^2) * Ω
         */
        Block2.prototype.updateInertiaTensor = function () {
            var w = this.width_;
            var h = this.height_;
            var ww = w.a * w.a;
            var hh = h.a * h.a;
            var I = this.M.a * (hh + ww) / 12;
            var Iuom = Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom));
            this.Iinv = new Matrix1(new Float32Array([1 / I]), Unit.div(Unit.ONE, Iuom));
        };
        return Block2;
    }(RigidBody2));

    var ConstantForceLaw2 = /** @class */ (function (_super) {
        __extends(ConstantForceLaw2, _super);
        function ConstantForceLaw2(body, vector, vectorCoordType) {
            if (vectorCoordType === void 0) { vectorCoordType = WORLD; }
            return _super.call(this, body, vector, vectorCoordType) || this;
        }
        return ConstantForceLaw2;
    }(ConstantForceLaw));

    var ConstantTorqueLaw2 = /** @class */ (function (_super) {
        __extends(ConstantTorqueLaw2, _super);
        function ConstantTorqueLaw2(body, value) {
            return _super.call(this, body, value, WORLD) || this;
        }
        return ConstantTorqueLaw2;
    }(ConstantTorqueLaw));

    /**
     * A solid disk of uniform surface density.
     */
    var Disc2 = /** @class */ (function (_super) {
        __extends(Disc2, _super);
        /**
         *
         */
        function Disc2(radius) {
            if (radius === void 0) { radius = Geometric2.one; }
            var _this = _super.call(this) || this;
            _this.radius_ = Geometric2.fromScalar(radius);
            _this.radiusLock_ = _this.radius_.lock();
            if (Unit.isOne(radius.uom)) ;
            else {
                _this.M = Geometric2.scalar(_this.M.a, Unit.KILOGRAM);
                _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                _this.X.uom = Unit.METER;
                _this.R.uom = Unit.ONE;
                _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
                _this.L.uom = Unit.JOULE_SECOND;
            }
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Disc2.prototype, "radius", {
            get: function () {
                return this.radius_;
            },
            set: function (radius) {
                this.radius_.unlock(this.radiusLock_);
                this.radius_.copyScalar(radius.a, radius.uom);
                this.radiusLock_ = this.radius_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * L = J(Ω) = (1/2) M R^2 Ω => Ω = 2 * L * (1/M) * (1/R)^2
         */
        Disc2.prototype.updateAngularVelocity = function () {
            this.Ω.copyScalar(this.radius_.a, this.radius_.uom); // Ω contains R 
            this.Ω.quaditude(); // Ω contains R^2
            this.Ω.mulByScalar(this.M.a, this.M.uom); // Ω contains M * R^2
            this.Ω.mulByNumber(0.5); // Ω contains (1/2) * M * R^2
            this.Ω.inv(); // Ω contains 2 * (1/M) * (1/R)^2
            this.Ω.mulByBivector(this.L); // Ω contains 2 * L * (1/M) * (1/R)^2
        };
        /**
         * Whenever the mass or the dimensions change, we must update the inertia tensor.
         * I = (1/2) M * R^2
         */
        Disc2.prototype.updateInertiaTensor = function () {
            var r = this.radius_;
            var s = 0.5 * this.M.a * r.a * r.a;
            var Iuom = Unit.mul(this.M.uom, Unit.mul(r.uom, r.uom));
            var matrixInv = Matrix1.one();
            matrixInv.setElement(0, 0, 1 / s);
            matrixInv.uom = Unit.div(Unit.ONE, Iuom);
            this.Iinv = matrixInv;
        };
        return Disc2;
    }(RigidBody2));

    /**
     * @hidden
     */
    var INDEX_TOTAL_LINEAR_MOMENTUM_X$1 = INDEX_RESERVED_LAST + 1;
    /**
     * @hidden
     */
    var INDEX_TOTAL_LINEAR_MOMENTUM_Y$1 = INDEX_RESERVED_LAST + 2;
    /**
     * @hidden
     */
    var INDEX_TOTAL_ANGULAR_MOMENTUM_XY$1 = INDEX_RESERVED_LAST + 3;
    /**
     * @hidden
     */
    var OFFSET_POSITION_X$1 = 0;
    /**
     * @hidden
     */
    var OFFSET_POSITION_Y$1 = 1;
    /**
     * @hidden
     */
    var OFFSET_ATTITUDE_A$1 = 2;
    /**
     * @hidden
     */
    var OFFSET_ATTITUDE_XY$1 = 3;
    /**
     * @hidden
     */
    var OFFSET_LINEAR_MOMENTUM_X$1 = 4;
    /**
     * @hidden
     */
    var OFFSET_LINEAR_MOMENTUM_Y$1 = 5;
    /**
     * @hidden
     */
    var OFFSET_ANGULAR_MOMENTUM_XY$1 = 6;
    /**
     * @hidden
     */
    var varNames$1 = [
        VarsList.TIME,
        "translational kinetic energy",
        "rotational kinetic energy",
        "potential energy",
        "total energy",
        "total linear momentum - x",
        "total linear momentum - y",
        "total angular momentum - xy"
    ];
    /**
     * @hidden
     */
    var DISCONTINUOUS_ENERGY_VARIABLES$1 = [
        INDEX_TRANSLATIONAL_KINETIC_ENERGY,
        INDEX_ROTATIONAL_KINETIC_ENERGY,
        INDEX_POTENTIAL_ENERGY,
        INDEX_TOTAL_ENERGY,
        INDEX_TOTAL_LINEAR_MOMENTUM_X$1,
        INDEX_TOTAL_LINEAR_MOMENTUM_Y$1,
        INDEX_TOTAL_ANGULAR_MOMENTUM_XY$1
    ];
    /**
     * @hidden
     */
    var Dynamics2 = /** @class */ (function () {
        function Dynamics2() {
        }
        Dynamics2.prototype.numVarsPerBody = function () {
            // Each body is described by 7 kinematic components.
            // 2 position
            // 2 attitude (though normalized should be only 1)
            // 2 linear momentum
            // 1 angular momentum
            return 7;
        };
        Dynamics2.prototype.getVarNames = function () {
            return varNames$1;
        };
        Dynamics2.prototype.getOffsetName = function (offset) {
            switch (offset) {
                case OFFSET_POSITION_X$1: return "position x";
                case OFFSET_POSITION_Y$1: return "position y";
                case OFFSET_ATTITUDE_A$1: return "attitude a";
                case OFFSET_ATTITUDE_XY$1: return "attitude xy";
                case OFFSET_LINEAR_MOMENTUM_X$1: return "linear momentum x";
                case OFFSET_LINEAR_MOMENTUM_Y$1: return "linear momentum y";
                case OFFSET_ANGULAR_MOMENTUM_XY$1: return "angular momentum xy";
            }
            throw new Error("getVarName(" + offset + ")");
        };
        Dynamics2.prototype.discontinuousEnergyVars = function () {
            return DISCONTINUOUS_ENERGY_VARIABLES$1;
        };
        Dynamics2.prototype.epilog = function (bodies, forceLaws, potentialOffset, varsList) {
            // update the variables that track energy
            var pe = potentialOffset.a;
            var re = 0;
            var te = 0;
            // update the variable that track linear momentum (vector)
            var Px = 0;
            var Py = 0;
            // update the variable that track angular momentum (bivector)
            var Lxy = 0;
            var bs = bodies;
            var Nb = bs.length;
            for (var i = 0; i < Nb; i++) {
                var b = bs[i];
                if (isFinite(b.M.a)) {
                    re += b.rotationalEnergy().a;
                    te += b.translationalEnergy().a;
                    // linear momentum
                    Px += b.P.x;
                    Py += b.P.y;
                    // orbital angular momentum
                    Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                    // intrinsic angular momentum
                    Lxy += b.L.xy;
                }
            }
            var fs = forceLaws;
            var Nf = fs.length;
            for (var i = 0; i < Nf; i++) {
                pe += fs[i].potentialEnergy().a;
            }
            varsList.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
            varsList.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
            varsList.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
            varsList.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
            varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X$1, Px);
            varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Y$1, Py);
            varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_XY$1, Lxy);
        };
        Dynamics2.prototype.updateVarsFromBody = function (body, idx, vars) {
            var X = body.X;
            var R = body.R;
            if (!Unit.isOne(R.uom)) {
                throw new Error("R.uom should be one, but was " + R.uom);
            }
            vars.setValueJump(OFFSET_POSITION_X$1 + idx, X.x);
            vars.setUnit(OFFSET_POSITION_Y$1 + idx, X.uom);
            vars.setValueJump(OFFSET_POSITION_Y$1 + idx, X.y);
            vars.setUnit(OFFSET_POSITION_X$1 + idx, X.uom);
            vars.setValueJump(OFFSET_ATTITUDE_A$1 + idx, R.a);
            vars.setUnit(OFFSET_ATTITUDE_A$1 + idx, R.uom);
            vars.setValueJump(OFFSET_ATTITUDE_XY$1 + idx, R.b);
            vars.setUnit(OFFSET_ATTITUDE_XY$1 + idx, R.uom);
            vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X$1 + idx, body.P.x);
            vars.setUnit(OFFSET_LINEAR_MOMENTUM_X$1 + idx, body.P.uom);
            vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Y$1 + idx, body.P.y);
            vars.setUnit(OFFSET_LINEAR_MOMENTUM_Y$1 + idx, body.P.uom);
            vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_XY$1 + idx, body.L.b);
            vars.setUnit(OFFSET_ANGULAR_MOMENTUM_XY$1 + idx, body.L.uom);
        };
        Dynamics2.prototype.addForceToRateOfChangeLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, force, uomTime) {
            var Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$1];
            var Fy = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y$1];
            if (Fx !== 0 || Fy !== 0) {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$1] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$1], force.uom);
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y$1], force.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$1] = force.uom;
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = force.uom;
            }
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$1] = Fx + force.x;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = Fy + force.y;
        };
        Dynamics2.prototype.getForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
            force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$1];
            force.y = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y$1];
            force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$1];
        };
        Dynamics2.prototype.setForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$1] = force.x;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$1] = force.uom;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = force.y;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = force.uom;
        };
        Dynamics2.prototype.addTorqueToRateOfChangeAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, torque, uomTime) {
            var Tb = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY$1];
            if (Tb !== 0) {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY$1] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY$1], torque.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY$1] = torque.uom;
            }
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY$1] = Tb + torque.b;
        };
        Dynamics2.prototype.updateBodyFromVars = function (vars, units, idx, body, uomTime) {
            body.X.a = 0;
            body.X.x = vars[idx + OFFSET_POSITION_X$1];
            body.X.y = vars[idx + OFFSET_POSITION_Y$1];
            body.X.b = 0;
            body.X.uom = units[idx + OFFSET_POSITION_X$1];
            body.R.a = vars[idx + OFFSET_ATTITUDE_A$1];
            body.R.x = 0;
            body.R.y = 0;
            body.R.b = vars[idx + OFFSET_ATTITUDE_XY$1];
            checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_XY$1], uomTime);
            body.R.uom = units[idx + OFFSET_ATTITUDE_XY$1];
            // Keep the magnitude of the attitude as close to 1 as possible.
            var R = body.R;
            var magR = Math.sqrt(R.a * R.a + R.b * R.b);
            body.R.a = body.R.a / magR;
            body.R.b = body.R.b / magR;
            body.P.a = 0;
            body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X$1];
            body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y$1];
            body.P.b = 0;
            body.P.uom = units[idx + OFFSET_LINEAR_MOMENTUM_X$1];
            body.L.a = 0;
            body.L.x = 0;
            body.L.y = 0;
            body.L.b = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY$1];
            if (!Unit.isOne(body.L.uom)) {
                if (Unit.isOne(units[idx + OFFSET_ANGULAR_MOMENTUM_XY$1])) {
                    throw new Error("Overwriting Angular Momentum Units!");
                }
            }
            body.L.uom = units[idx + OFFSET_ANGULAR_MOMENTUM_XY$1];
            body.updateAngularVelocity();
        };
        Dynamics2.prototype.setPositionRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
            var P = body.P;
            var M = body.M;
            var m = M.a;
            rateOfChangeVals[idx + OFFSET_POSITION_X$1] = P.x / m;
            rateOfChangeVals[idx + OFFSET_POSITION_Y$1] = P.y / m;
            var uom = Unit.div(P.uom, M.uom);
            rateOfChangeUoms[idx + OFFSET_POSITION_X$1] = uom;
            rateOfChangeUoms[idx + OFFSET_POSITION_Y$1] = uom;
        };
        Dynamics2.prototype.setAttitudeRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
            // Let Ω(t) be the (bivector) angular velocity.
            // Let R(t) be the (spinor) attitude of the rigid body. 
            // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
            // requiring the geometric product of Ω and R.
            // Ω and R are auxiliary and primary variables that have already been computed.
            var R = body.R;
            var Ω = body.Ω;
            // dR/dt = +(1/2)(Ω.b)(R.b) - (1/2)(Ω.b)(R.a) I, where I = e1e2. 
            rateOfChangeVals[idx + OFFSET_ATTITUDE_A$1] = +0.5 * (Ω.xy * R.xy);
            rateOfChangeVals[idx + OFFSET_ATTITUDE_XY$1] = -0.5 * (Ω.xy * R.a);
            var uom = Unit.mul(Ω.uom, R.uom);
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_A$1] = uom;
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_XY$1] = uom;
        };
        Dynamics2.prototype.zeroLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var P = body.P;
            var M = body.M;
            if (!Unit.isOne(P.uom)) {
                if (!Unit.isCompatible(P.uom, Unit.KILOGRAM_METER_PER_SECOND)) {
                    throw new Error("P.uom should be " + Unit.KILOGRAM_METER_PER_SECOND + ", but was " + P.uom);
                }
            }
            if (!Unit.isOne(M.uom)) {
                if (!Unit.isCompatible(M.uom, Unit.KILOGRAM)) {
                    throw new Error("M.uom should be " + Unit.KILOGRAM + ", but was " + M.uom);
                }
            }
            // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
            var uom = Unit.div(P.uom, uomTime);
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X$1] = 0;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X$1] = uom;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = 0;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y$1] = uom;
        };
        Dynamics2.prototype.zeroAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var L = body.L;
            var R = body.R;
            var Ω = body.Ω;
            if (!Unit.isOne(R.uom)) {
                throw new Error("R.uom should be one, but was " + R.uom);
            }
            if (!Unit.isOne(Ω.uom)) {
                if (!Unit.isCompatible(Ω.uom, Unit.INV_SECOND)) {
                    throw new Error("\u03A9.uom should be " + Unit.INV_SECOND + ", but was " + Ω.uom);
                }
            }
            var uom = Unit.div(L.uom, uomTime);
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY$1] = 0;
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY$1] = uom;
        };
        return Dynamics2;
    }());

    /**
     *
     */
    var Engine2 = /** @class */ (function (_super) {
        __extends(Engine2, _super);
        function Engine2(options) {
            return _super.call(this, new Euclidean2(), new Dynamics2(), options) || this;
        }
        return Engine2;
    }(Engine));

    var GravitationForceLaw2 = /** @class */ (function (_super) {
        __extends(GravitationForceLaw2, _super);
        function GravitationForceLaw2(body1, body2) {
            return _super.call(this, body1, body2, Geometric2.one) || this;
        }
        return GravitationForceLaw2;
    }(GravitationLaw));

    /**
     *
     */
    var LinearDamper2 = /** @class */ (function (_super) {
        __extends(LinearDamper2, _super);
        function LinearDamper2(body1, body2) {
            return _super.call(this, body1, body2) || this;
        }
        return LinearDamper2;
    }(LinearDamper));

    var Particle2 = /** @class */ (function (_super) {
        __extends(Particle2, _super);
        function Particle2(mass, charge) {
            return _super.call(this, mass, charge, new Euclidean2()) || this;
        }
        return Particle2;
    }(Particle));

    /**
     *
     */
    var Physics2 = /** @class */ (function (_super) {
        __extends(Physics2, _super);
        function Physics2() {
            return _super.call(this, new Euclidean2(), new Dynamics2()) || this;
        }
        return Physics2;
    }(Physics));

    /**
     * @hidden
     */
    var fromVector = Geometric2.fromVector;
    var Polygon2 = /** @class */ (function (_super) {
        __extends(Polygon2, _super);
        function Polygon2(points) {
            var _this = _super.call(this) || this;
            /**
             * The position of the polygon point relative to the center of mass.
             *
             * r = x - X, where x is the world position, X is the center of mass.
             */
            _this.rs = [];
            mustBeAtLeastThreePoints(points);
            var X = centerOfMass(points);
            for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                var point = points_1[_i];
                var r = fromVector(point).sub(X);
                r.lock();
                _this.rs.push(r);
            }
            _this.X = X;
            if (points.every(function (point) { return Unit.isOne(point.uom); })) {
                // dimensionless
                _this.updateInertiaTensor();
            }
            else {
                // Changing the mass will trigger an update of the inertia tensor.
                _this.M = Geometric2.scalar(_this.M.a, Unit.KILOGRAM);
                _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                _this.X.uom = Unit.METER;
                _this.R.uom = Unit.ONE;
                _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
                _this.L.uom = Unit.JOULE_SECOND;
            }
            return _this;
        }
        /**
         * The inertia tensor matrix must be updated any time the geometry changes.
         * The geometry is defined by the total mass, M, and the positions of the vertices.
         */
        Polygon2.prototype.updateInertiaTensor = function () {
            var rs = this.rs;
            var N = rs.length;
            var numer = new Geometric2();
            var denom = new Geometric2();
            for (var i = 0; i < N; i++) {
                var ith = rs[i];
                var nxt = rs[(i + 1) % N];
                var A = nxt.ext(ith);
                var s = ith.scp(ith).add(ith.scp(nxt)).add(nxt.scp(nxt));
                numer.add(A.mul(s));
                denom.add(A);
            }
            var I = this.M.mul(numer).divByNumber(6).divByPseudo(denom.b, denom.uom);
            var matrixInv = Matrix1.one();
            matrixInv.setElement(0, 0, 1 / I.a);
            matrixInv.uom = Unit.div(Unit.ONE, I.uom);
            this.Iinv = matrixInv;
        };
        return Polygon2;
    }(RigidBody2));
    /**
     * @hidden
     * @param xs
     * @returns
     */
    function polygonArea(xs) {
        var N = xs.length;
        var A = new Geometric2();
        var ΔA = new Geometric2();
        for (var i = 0; i < N; i++) {
            ΔA.copy(xs[i]).ext(xs[(i + 1) % N]).mulByNumber(0.5);
            A.add(ΔA);
        }
        return A;
    }
    /**
     * @hidden
     * @param xs
     * @returns
     */
    function centerOfMass(xs) {
        var N = xs.length;
        var X = new Geometric2();
        for (var i = 0; i < N; i++) {
            var a = xs[i];
            var b = xs[(i + 1) % N];
            var w = fromVector(a).ext(b);
            var v = fromVector(a).add(b);
            var vw = fromVector(v).mul(w);
            X.add(vw);
        }
        var A = polygonArea(xs);
        X.divByPseudo(A.b, A.uom);
        X.divByNumber(6);
        return X;
    }
    /**
     * @hidden
     * @param xs
     */
    function mustBeAtLeastThreePoints(xs) {
        var N = xs.length;
        if (N >= 3) ;
        else {
            throw new Error("must be at least 3 points.");
        }
    }

    var Rod2 = /** @class */ (function (_super) {
        __extends(Rod2, _super);
        function Rod2(a) {
            var _this = _super.call(this) || this;
            var contextBuilder = function () { return "Rod2.constructor(a: Geometric2): Rod2"; };
            mustBeNonNullObject('a', a, contextBuilder);
            _this.a = a;
            _this.updateInertiaTensor();
            return _this;
        }
        Rod2.prototype.updateInertiaTensor = function () {
            // L(Ω) = (m / 3) a ^ (a << Ω)
            // In 2D, this simplifies to...
            // L(Ω) = (m / 3) |a||a| Ω
            var I = this.M.divByNumber(3).mulByVector(this.a).mulByVector(this.a);
            this.Iinv = new Matrix1(new Float32Array([1 / I.a]), Unit.div(Unit.ONE, I.uom));
        };
        return Rod2;
    }(RigidBody2));

    /**
     *
     */
    var Spring2 = /** @class */ (function (_super) {
        __extends(Spring2, _super);
        function Spring2(body1, body2) {
            return _super.call(this, body1, body2) || this;
        }
        return Spring2;
    }(Spring));

    /**
     * @hidden
     */
    var SurfaceConstraint = /** @class */ (function () {
        function SurfaceConstraint(body, radiusFn, rotationFn, tangentFn) {
            this.body = body;
            this.radiusFn = radiusFn;
            this.rotationFn = rotationFn;
            this.tangentFn = tangentFn;
            mustBeNonNullObject('body', body);
            var metric = body.metric;
            this.N = metric.zero();
        }
        SurfaceConstraint.prototype.getBody = function () {
            return this.body;
        };
        SurfaceConstraint.prototype.computeRadius = function (x, radius) {
            this.radiusFn(x, radius);
        };
        SurfaceConstraint.prototype.computeRotation = function (x, plane) {
            this.rotationFn(x, plane);
        };
        SurfaceConstraint.prototype.computeTangent = function (x, tangent) {
            this.tangentFn(x, tangent);
        };
        SurfaceConstraint.prototype.setForce = function (N) {
            var metric = this.body.metric;
            metric.copyVector(N, this.N);
        };
        return SurfaceConstraint;
    }());

    var SurfaceConstraint2 = /** @class */ (function (_super) {
        __extends(SurfaceConstraint2, _super);
        function SurfaceConstraint2(body, radiusFn, rotationFn, tangentFn) {
            return _super.call(this, body, radiusFn, rotationFn, tangentFn) || this;
        }
        return SurfaceConstraint2;
    }(SurfaceConstraint));

    /**
     * @hidden
     * @param a
     * @param b
     * @returns
     */
    function dotVectorE3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    // Symbolic constants for the coordinate indices into the data array.
    // These are chosen to match those used by G3.
    // TODO: The goal should be to protect the user from changes in ordering.
    /**
     * @hidden
     */
    var COORD_W$1 = 0;
    /**
     * @hidden
     */
    var COORD_X$2 = 1;
    /**
     * @hidden
     */
    var COORD_Y$2 = 2;
    /**
     * @hidden
     */
    var COORD_Z$2 = 3;
    /**
     * @hidden
     */
    var COORD_XY$2 = 4;
    /**
     * @hidden
     */
    var COORD_YZ$2 = 5;
    /**
     * @hidden
     */
    var COORD_ZX$2 = 6;
    /**
     * @hidden
     */
    var COORD_XYZ$1 = 7;
    /**
     * @hidden
     * @param index
     * 0: scalar
     * 1: x
     * 2: y
     * 3: z
     * 4: xy
     * 5: yz
     * 6: zx
     * 7: xyz
     */
    function compG3Get(m, index) {
        switch (index) {
            case COORD_W$1: {
                return m.a;
            }
            case COORD_X$2: {
                return m.x;
            }
            case COORD_Y$2: {
                return m.y;
            }
            case COORD_Z$2: {
                return m.z;
            }
            case COORD_XY$2: {
                return m.xy;
            }
            case COORD_YZ$2: {
                return m.yz;
            }
            case COORD_ZX$2: {
                return m.zx;
            }
            case COORD_XYZ$1: {
                return m.b;
            }
            default: {
                throw new Error("index => " + index);
            }
        }
    }

    /**
     * @hidden
     */
    var COORD_W = 0;
    /**
     * @hidden
     */
    var COORD_X$1 = 1;
    /**
     * @hidden
     */
    var COORD_Y$1 = 2;
    /**
     * @hidden
     */
    var COORD_Z$1 = 3;
    /**
     * @hidden
     */
    var COORD_XY$1 = 4;
    /**
     * @hidden
     */
    var COORD_YZ$1 = 5;
    /**
     * @hidden
     */
    var COORD_ZX$1 = 6;
    /**
     * @hidden
     */
    var COORD_XYZ = 7;
    /**
     * @hidden
     */
    function compG3Set(m, index, value) {
        switch (index) {
            case COORD_W: {
                m.a = value;
                break;
            }
            case COORD_X$1: {
                m.x = value;
                break;
            }
            case COORD_Y$1: {
                m.y = value;
                break;
            }
            case COORD_Z$1: {
                m.z = value;
                break;
            }
            case COORD_XY$1: {
                m.xy = value;
                break;
            }
            case COORD_YZ$1: {
                m.yz = value;
                break;
            }
            case COORD_ZX$1: {
                m.zx = value;
                break;
            }
            case COORD_XYZ: {
                m.b = value;
                break;
            }
            default:
                throw new Error("index => " + index);
        }
    }

    /**
     * @hidden
     * @param a0
     * @param a1
     * @param a2
     * @param a3
     * @param a4
     * @param a5
     * @param a6
     * @param a7
     * @param b0
     * @param b1
     * @param b2
     * @param b3
     * @param b4
     * @param b5
     * @param b6
     * @param b7
     * @param index
     * @returns
     */
    function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a2 * b0);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a3 * b0);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }

    /**
     * @hidden
     * @param a
     * @param b
     * @param out
     * @returns
     */
    function extG3(a, b, out) {
        out.uom = Unit.mul(a.uom, b.uom);
        var a0 = compG3Get(a, 0);
        var a1 = compG3Get(a, 1);
        var a2 = compG3Get(a, 2);
        var a3 = compG3Get(a, 3);
        var a4 = compG3Get(a, 4);
        var a5 = compG3Get(a, 5);
        var a6 = compG3Get(a, 6);
        var a7 = compG3Get(a, 7);
        var b0 = compG3Get(b, 0);
        var b1 = compG3Get(b, 1);
        var b2 = compG3Get(b, 2);
        var b3 = compG3Get(b, 3);
        var b4 = compG3Get(b, 4);
        var b5 = compG3Get(b, 5);
        var b6 = compG3Get(b, 6);
        var b7 = compG3Get(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set(out, i, extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }

    /**
     * @hidden
     * @param m
     * @returns
     */
    function isScalarG3(m) {
        return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }

    /**
     * Determines whether the argument supports the VectorE3 interface.
     * The argument must be a non-null object and must support the x, y, and z numeric properties.
     * @hidden
     */
    function isVectorE3(v) {
        if (isObject(v) && !isNull(v)) {
            return isNumber(v.x) && isNumber(v.y) && isNumber(v.z);
        }
        else {
            return false;
        }
    }

    /**
     * @hidden
     * @param m
     * @returns
     */
    function isVectorG3(m) {
        return m.a === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }

    /**
     * Returns true if all coordinates of the bivector are exactly zero.
     * @hidden
     */
    function isZeroBivectorE3(m) {
        return m.yz === 0 && m.zx === 0 && m.xy === 0;
    }

    /**
     * Returns true if all coordinates of the vector are exactly zero.
     * @hidden
     */
    function isZeroVectorE3(v) {
        return v.x === 0 && v.y === 0 && v.z === 0;
    }

    /**
     * Returns true if all coordinates of the vector are exactly zero.
     * @hidden
     */
    function isZeroGeometricE3(m) {
        return isZeroVectorE3(m) && isZeroBivectorE3(m) && m.a === 0 && m.b === 0;
    }

    /**
     * @hidden
     * @param a0
     * @param a1
     * @param a2
     * @param a3
     * @param a4
     * @param a5
     * @param a6
     * @param a7
     * @param b0
     * @param b1
     * @param b2
     * @param b3
     * @param b4
     * @param b5
     * @param b6
     * @param b7
     * @param index
     * @returns
     */
    function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b4 + a3 * b6 - a5 * b7);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b4 - a3 * b5 - a6 * b7);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 - a1 * b6 + a2 * b5 - a4 * b7);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a3 * b7);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a1 * b7);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 + a2 * b7);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }

    /**
     * @hidden
     * @param a
     * @param b
     * @param out
     * @returns
     */
    function lcoG3(a, b, out) {
        out.uom = Unit.mul(a.uom, b.uom);
        var a0 = compG3Get(a, 0);
        var a1 = compG3Get(a, 1);
        var a2 = compG3Get(a, 2);
        var a3 = compG3Get(a, 3);
        var a4 = compG3Get(a, 4);
        var a5 = compG3Get(a, 5);
        var a6 = compG3Get(a, 6);
        var a7 = compG3Get(a, 7);
        var b0 = compG3Get(b, 0);
        var b1 = compG3Get(b, 1);
        var b2 = compG3Get(b, 2);
        var b3 = compG3Get(b, 3);
        var b4 = compG3Get(b, 4);
        var b5 = compG3Get(b, 5);
        var b6 = compG3Get(b, 6);
        var b7 = compG3Get(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set(out, i, lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }

    /**
     * @hidden
     */
    var ONE = void 0; // Unit.ONE;
    /**
     * @hidden
     */
    var scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0, uom: ONE };
    /**
     * @hidden
     */
    function maskG3(arg) {
        var duck = arg;
        if (isObject(arg) && 'grades' in arg) {
            var g = arg;
            if (duck.grades & 0x1) {
                scratch.a = g.a;
            }
            else {
                scratch.a = 0;
            }
            if (duck.grades & 0x2) {
                scratch.x = g.x;
                scratch.y = g.y;
                scratch.z = g.z;
            }
            else {
                scratch.x = 0;
                scratch.y = 0;
                scratch.z = 0;
            }
            if (duck.grades & 0x4) {
                scratch.yz = g.yz;
                scratch.zx = g.zx;
                scratch.xy = g.xy;
            }
            else {
                scratch.yz = 0;
                scratch.zx = 0;
                scratch.xy = 0;
            }
            if (duck.grades & 0x8) {
                scratch.b = g.b;
            }
            else {
                scratch.b = 0;
            }
            scratch.uom = Unit.mustBeUnit('g.uom', g.uom);
            return scratch;
        }
        else if (isNumber(arg)) {
            scratch.a = arg;
            scratch.x = 0;
            scratch.y = 0;
            scratch.z = 0;
            scratch.yz = 0;
            scratch.zx = 0;
            scratch.xy = 0;
            scratch.b = 0;
            scratch.uom = ONE;
            return scratch;
        }
        else {
            return void 0;
        }
    }

    /**
     * Multiplication of Geometric3.
     * This was originally written for asm.
     * @hidden
     */
    function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        switch (index) {
            case 0: {
                return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7;
            }
            case 1: {
                return a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5;
            }
            case 2: {
                return a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6;
            }
            case 3: {
                return a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4;
            }
            case 4: {
                return a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3;
            }
            case 5: {
                return a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1;
            }
            case 6: {
                return a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2;
            }
            case 7: {
                return a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0;
            }
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
    }

    /**
     * Computes a random number within the specified range.
     */
    function randomRange (a, b) {
        return (b - a) * Math.random() + a;
    }

    /**
     * @hidden
     * @param a0
     * @param a1
     * @param a2
     * @param a3
     * @param a4
     * @param a5
     * @param a6
     * @param a7
     * @param b0
     * @param b1
     * @param b2
     * @param b3
     * @param b4
     * @param b5
     * @param b6
     * @param b7
     * @param index
     * @returns
     */
    function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
                }
                break;
            case 2:
                {
                    x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
                }
                break;
            case 3:
                {
                    x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
                }
                break;
            case 4:
                {
                    x = +(+a4 * b0 + a7 * b3);
                }
                break;
            case 5:
                {
                    x = +(+a5 * b0 + a7 * b1);
                }
                break;
            case 6:
                {
                    x = +(+a6 * b0 + a7 * b2);
                }
                break;
            case 7:
                {
                    x = +(+a7 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }

    /**
     * @hidden
     * @param a
     * @param b
     * @param out
     * @returns
     */
    function rcoG3(a, b, out) {
        out.uom = Unit.mul(a.uom, b.uom);
        var a0 = compG3Get(a, 0);
        var a1 = compG3Get(a, 1);
        var a2 = compG3Get(a, 2);
        var a3 = compG3Get(a, 3);
        var a4 = compG3Get(a, 4);
        var a5 = compG3Get(a, 5);
        var a6 = compG3Get(a, 6);
        var a7 = compG3Get(a, 7);
        var b0 = compG3Get(b, 0);
        var b1 = compG3Get(b, 1);
        var b2 = compG3Get(b, 2);
        var b3 = compG3Get(b, 3);
        var b4 = compG3Get(b, 4);
        var b5 = compG3Get(b, 5);
        var b6 = compG3Get(b, 6);
        var b7 = compG3Get(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set(out, i, rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }

    /**
     * @hidden
     * @param vector
     * @returns
     */
    function quadVectorE3(vector) {
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        return x * x + y * y + z * z;
    }

    /**
     * Computes the z component of the cross-product of Cartesian vector components.
     * @hidden
     */
    function wedgeXY$1(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }

    /**
     * Computes the x component of the cross-product of Cartesian vector components.
     * @hidden
     */
    function wedgeYZ$1(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }

    /**
     * Computes the y component of the cross-product of Cartesian vector components.
     * @hidden
     */
    function wedgeZX$1(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }

    /**
     * @hidden
     */
    var sqrt = Math.sqrt;
    /**
     * @hidden
     */
    var cosPIdiv4 = Math.cos(Math.PI / 4);
    /**
     * @hidden
     */
    var sinPIdiv4 = Math.sin(Math.PI / 4);
    /**
     * @hidden
     * Sets the output spinor to a rotor representing a rotation from a to b.
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     * If the vectors are anti-parallel, making the plane of rotation ambiguous,
     * the bivector B will be used if specified.
     * Otherwise, sets the output spinor to a random bivector if the vectors are anti-parallel.
     * The result is independent of the magnitudes of a and b.
     */
    function rotorFromDirectionsE3(a, b, B, m) {
        // Optimization for equal vectors.
        if (a.x === b.x && a.y === b.y && a.z === b.z) {
            // An easy optimization is simply to compare the vectors for equality.
            m.one();
            return;
        }
        // Optimizations for cardinal directions.
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
            // e1 to e2
            m.zero();
            m.a = cosPIdiv4;
            m.xy = -sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            // e1 to e3
            m.zero();
            m.a = cosPIdiv4;
            m.zx = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
            // e2 to e1
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            // e2 to e3
            m.zero();
            m.a = cosPIdiv4;
            m.yz = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 1 && b.y === 0 && b.z === 0) {
            // e3 to e1
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 1 && b.z === 0) {
            // e3 to e2
            m.zero();
            m.a = cosPIdiv4;
            m.yz = sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
            // e1 to -e2
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
            // e1 to -e3
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
            // e2 to -e1
            m.zero();
            m.a = cosPIdiv4;
            m.xy = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
            // e2 to -e3
            m.zero();
            m.a = cosPIdiv4;
            m.yz = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === -1 && b.y === 0 && b.z === 0) {
            // e3 to -e1
            m.zero();
            m.a = cosPIdiv4;
            m.zx = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === -1 && b.z === 0) {
            // e3 to -e2
            m.zero();
            m.a = cosPIdiv4;
            m.yz = -sinPIdiv4;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
            // -e1 to +e2
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            // -e1 to +e3
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        // Optimizations when the plane of rotation is ambiguous and a default bivector is not defined.
        if (typeof B === 'undefined') {
            if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
                // +e1 to -e1.
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
                // -e1 to +e1.
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
                // +e2 to -e2.
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === -1 && a.z === 0 && b.x === 0 && b.y === +1 && b.z === 0) {
                // -e2 to +e2.
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 0 && b.z === -1) {
                // +e3 to -e3.
                m.zero();
                m.zx = -1;
                return;
            }
            if (a.x === 0 && a.y === 0 && a.z === -1 && b.x === 0 && b.y === 0 && b.z === +1) {
                // -e3 to +e3.
                m.zero();
                m.zx = -1;
                return;
            }
        }
        var quadA = quadVectorE3(a);
        var absA = sqrt(quadA);
        var quadB = quadVectorE3(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE3(b, a);
        var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
        }
        else {
            // The denominator is zero when |a||b| + a << b = 0.
            // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
            // Then a and b are anti-parallel.
            // The plane of the rotation is ambiguous.
            // Compute a random bivector containing the start vector, then turn
            // it into a rotor that achieves the 180-degree rotation.
            if (B) {
                m.rotorFromGeneratorAngle(B, Math.PI);
            }
            else {
                var rx = Math.random();
                var ry = Math.random();
                var rz = Math.random();
                m.zero();
                m.yz = wedgeYZ$1(rx, ry, rz, a.x, a.y, a.z);
                m.zx = wedgeZX$1(rx, ry, rz, a.x, a.y, a.z);
                m.xy = wedgeXY$1(rx, ry, rz, a.x, a.y, a.z);
                m.direction(true);
                m.rotorFromGeneratorAngle(m, Math.PI);
            }
        }
    }

    /**
     * @hidden
     * @param a
     * @param b
     * @param out
     * @returns
     */
    function scpG3(a, b, out) {
        var a0 = compG3Get(a, 0);
        var a1 = compG3Get(a, 1);
        var a2 = compG3Get(a, 2);
        var a3 = compG3Get(a, 3);
        var a4 = compG3Get(a, 4);
        var a5 = compG3Get(a, 5);
        var a6 = compG3Get(a, 6);
        var a7 = compG3Get(a, 7);
        var b0 = compG3Get(b, 0);
        var b1 = compG3Get(b, 1);
        var b2 = compG3Get(b, 2);
        var b3 = compG3Get(b, 3);
        var b4 = compG3Get(b, 4);
        var b5 = compG3Get(b, 5);
        var b6 = compG3Get(b, 6);
        var b7 = compG3Get(b, 7);
        compG3Set(out, 0, mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
        compG3Set(out, 1, 0);
        compG3Set(out, 2, 0);
        compG3Set(out, 3, 0);
        compG3Set(out, 4, 0);
        compG3Set(out, 5, 0);
        compG3Set(out, 6, 0);
        compG3Set(out, 7, 0);
        out.uom = Unit.mul(a.uom, b.uom);
        return out;
    }

    /**
     * @hidden
     */
    function squaredNormG3(m) {
        var a = m.a;
        var x = m.x;
        var y = m.y;
        var z = m.z;
        var yz = m.yz;
        var zx = m.zx;
        var xy = m.xy;
        var b = m.b;
        return a * a + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + b * b;
    }

    // Symbolic constants for the coordinate indices into the data array.
    /**
     * @hidden
     */
    var COORD_SCALAR = 0;
    /**
     * @hidden
     */
    var COORD_X = 1;
    /**
     * @hidden
     */
    var COORD_Y = 2;
    /**
     * @hidden
     */
    var COORD_Z = 3;
    /**
     * @hidden
     */
    var COORD_XY = 4;
    /**
     * @hidden
     */
    var COORD_YZ = 5;
    /**
     * @hidden
     */
    var COORD_ZX = 6;
    /**
     * @hidden
     */
    var COORD_PSEUDO = 7;
    // FIXME: Change to Canonical ordering.
    /**
     * @hidden
     */
    var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
    BASIS_LABELS[COORD_SCALAR] = '1';
    BASIS_LABELS[COORD_X] = 'e1';
    BASIS_LABELS[COORD_Y] = 'e2';
    BASIS_LABELS[COORD_Z] = 'e3';
    /**
     * @hidden
     */
    var zero = function zero() {
        return [0, 0, 0, 0, 0, 0, 0, 0];
    };
    /**
     * @hidden
     */
    var scalar = function scalar(a) {
        var coords = zero();
        coords[COORD_SCALAR] = a;
        return coords;
    };
    /**
     * @hidden
     */
    var vector = function vector(x, y, z) {
        var coords = zero();
        coords[COORD_X] = x;
        coords[COORD_Y] = y;
        coords[COORD_Z] = z;
        return coords;
    };
    /**
     * @hidden
     */
    var bivector = function bivector(yz, zx, xy) {
        var coords = zero();
        coords[COORD_YZ] = yz;
        coords[COORD_ZX] = zx;
        coords[COORD_XY] = xy;
        return coords;
    };
    /**
     * @hidden
     */
    var spinor = function spinor(a, yz, zx, xy) {
        var coords = zero();
        coords[COORD_SCALAR] = a;
        coords[COORD_YZ] = yz;
        coords[COORD_ZX] = zx;
        coords[COORD_XY] = xy;
        return coords;
    };
    /**
     * @hidden
     */
    var multivector = function multivector(a, x, y, z, yz, zx, xy, b) {
        var coords = zero();
        coords[COORD_SCALAR] = a;
        coords[COORD_X] = x;
        coords[COORD_Y] = y;
        coords[COORD_Z] = z;
        coords[COORD_YZ] = yz;
        coords[COORD_ZX] = zx;
        coords[COORD_XY] = xy;
        coords[COORD_PSEUDO] = b;
        return coords;
    };
    /**
     * @hidden
     */
    var pseudo = function pseudo(b) {
        var coords = zero();
        coords[COORD_PSEUDO] = b;
        return coords;
    };
    /**
     * Coordinates corresponding to basis labels.
     * @hidden
     */
    var coordinates = function coordinates(m) {
        var coords = zero();
        coords[COORD_SCALAR] = m.a;
        coords[COORD_X] = m.x;
        coords[COORD_Y] = m.y;
        coords[COORD_Z] = m.z;
        coords[COORD_YZ] = m.yz;
        coords[COORD_ZX] = m.zx;
        coords[COORD_XY] = m.xy;
        coords[COORD_PSEUDO] = m.b;
        return coords;
    };
    /**
     * Computes the cosine of the angle between two vectors.
     * cos(a, b) = (a | b) / |a||b|
     * This is dimensionless, so we are justified in simply returning a number.
     * @hidden
     */
    function cosVectorVector(a, b) {
        function scp(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        function norm(v) {
            return Math.sqrt(scp(v, v));
        }
        return scp(a, b) / (norm(a) * norm(b));
    }
    /**
     * Sets the lock on the multivector argument and returns the same argument.
     * This is a convenience function for the dunder (double underscore) methods.
     * All dunder methods should return locked values.
     * @hidden
     */
    function lock(m) {
        m.lock();
        return m;
    }
    /**
     * Scratch variable for holding cosines.
     * @hidden
     */
    var cosines = [];
    /**
     * Sentinel value to indicate that the Geometric3 is not locked.
     * UNLOCKED is in the range -1 to 0.
     * @hidden
     */
    var UNLOCKED = -1 * Math.random();
    /**
     * A multivector with a Euclidean metric and Cartesian coordinates.
     */
    var Geometric3 = /** @class */ (function () {
        /**
         * Do not call this constructor. Use the static construction methods instead.
         * The multivector is constructed in the unlocked (mutable) state.
         */
        function Geometric3(coords, uom) {
            if (coords === void 0) { coords = zero(); }
            /**
             *
             */
            this.lock_ = UNLOCKED;
            if (coords.length !== 8) {
                throw new Error("coords.length must be 8");
            }
            this.coords_ = coords;
            this.uom_ = uom;
        }
        Geometric3.prototype.__eq__ = function (rhs) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.__ne__ = function (rhs) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.__ge__ = function (rhs) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.__gt__ = function (rhs) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.__le__ = function (rhs) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.__lt__ = function (rhs) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.adj = function () {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.scale = function (α) {
            throw new Error('Method not implemented.');
        };
        Geometric3.prototype.slerp = function (target, α) {
            throw new Error('Method not implemented.');
        };
        /**
         * Determines whether this multivector is locked.
         * If the multivector is in the unlocked state then it is mutable.
         * If the multivector is in the locked state then it is immutable.
         */
        Geometric3.prototype.isLocked = function () {
            return this.lock_ !== UNLOCKED;
        };
        Geometric3.prototype.isMutable = function () {
            return this.lock_ === UNLOCKED;
        };
        /**
         * Locks this multivector (preventing any further mutation),
         * and returns a token that may be used to unlock it.
         */
        Geometric3.prototype.lock = function () {
            if (this.lock_ !== UNLOCKED) {
                throw new Error("already locked");
            }
            else {
                this.lock_ = Math.random();
                return this.lock_;
            }
        };
        /**
         * Unlocks this multivector (allowing mutation),
         * using a token that was obtained from a preceding lock method call.
         */
        Geometric3.prototype.unlock = function (token) {
            if (this.lock_ === UNLOCKED) {
                throw new Error("not locked");
            }
            else if (this.lock_ === token) {
                this.lock_ = UNLOCKED;
            }
            else {
                throw new Error("unlock denied");
            }
        };
        /**
         * Consistently set a coordinate value in the most optimized way.
         * Permits mutation only when the lock status is UNLOCKED.
         * It is safe to use this as an alternative to the named property accessors.
         */
        Geometric3.prototype.setCoordinate = function (index, newValue, name) {
            if (this.lock_ === UNLOCKED) {
                var coords = this.coords_;
                var previous = coords[index];
                if (newValue !== previous) {
                    coords[index] = newValue;
                }
            }
            else {
                throw new Error(readOnly(name).message);
            }
        };
        Object.defineProperty(Geometric3.prototype, "a", {
            /**
             * The scalar part of this multivector.
             */
            get: function () {
                return this.coords_[COORD_SCALAR];
            },
            set: function (a) {
                this.setCoordinate(COORD_SCALAR, a, 'a');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "b", {
            /**
             * The pseudoscalar part of this multivector.
             */
            get: function () {
                return this.coords_[COORD_PSEUDO];
            },
            set: function (b) {
                this.setCoordinate(COORD_PSEUDO, b, 'b');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "grades", {
            /**
             * A bitmask describing the grades.
             *
             * 0x0 = zero
             * 0x1 = scalar
             * 0x2 = vector
             * 0x4 = bivector
             * 0x8 = pseudoscalar
             */
            get: function () {
                var coords = this.coords_;
                var α = coords[COORD_SCALAR];
                var x = coords[COORD_X];
                var y = coords[COORD_Y];
                var z = coords[COORD_Z];
                var yz = coords[COORD_YZ];
                var zx = coords[COORD_ZX];
                var xy = coords[COORD_XY];
                var β = coords[COORD_PSEUDO];
                var mask = 0x0;
                if (α !== 0) {
                    mask += 0x1;
                }
                if (x !== 0 || y !== 0 || z !== 0) {
                    mask += 0x2;
                }
                if (yz !== 0 || zx !== 0 || xy !== 0) {
                    mask += 0x4;
                }
                if (β !== 0) {
                    mask += 0x8;
                }
                return mask;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "uom", {
            /**
             * The optional unit of measure.
             */
            get: function () {
                return this.uom_;
            },
            set: function (uom) {
                if (this.lock_ === UNLOCKED) {
                    // This is the only place where we should check the unit of measure.
                    // It also should be the only place where we access the private member.
                    this.uom_ = Unit.mustBeUnit('uom', uom);
                }
                else {
                    throw new Error(readOnly('uom').message);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "x", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
             */
            get: function () {
                return this.coords_[COORD_X];
            },
            set: function (x) {
                this.setCoordinate(COORD_X, x, 'x');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "y", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
             */
            get: function () {
                return this.coords_[COORD_Y];
            },
            set: function (y) {
                this.setCoordinate(COORD_Y, y, 'y');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "z", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
             */
            get: function () {
                return this.coords_[COORD_Z];
            },
            set: function (z) {
                this.setCoordinate(COORD_Z, z, 'z');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "yz", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
             */
            get: function () {
                return this.coords_[COORD_YZ];
            },
            set: function (yz) {
                this.setCoordinate(COORD_YZ, yz, 'yz');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "zx", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
             */
            get: function () {
                return this.coords_[COORD_ZX];
            },
            set: function (zx) {
                this.setCoordinate(COORD_ZX, zx, 'zx');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "xy", {
            /**
             * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
             */
            get: function () {
                return this.coords_[COORD_XY];
            },
            set: function (xy) {
                this.setCoordinate(COORD_XY, xy, 'xy');
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Adds a multivector value to this multivector with optional scaling.
         *
         * @param M The multivector to be added to this multivector.
         * @param α An optional scale factor that multiplies the multivector argument.
         * @returns this + M * α
         */
        Geometric3.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().add(M, α));
            }
            else {
                if (this.isZero()) {
                    this.a = M.a * α;
                    this.x = M.x * α;
                    this.y = M.y * α;
                    this.z = M.z * α;
                    this.yz = M.yz * α;
                    this.zx = M.zx * α;
                    this.xy = M.xy * α;
                    this.b = M.b * α;
                    this.uom = M.uom;
                    return this;
                }
                else if (isZeroGeometricE3(M)) {
                    return this;
                }
                else {
                    this.a += M.a * α;
                    this.x += M.x * α;
                    this.y += M.y * α;
                    this.z += M.z * α;
                    this.yz += M.yz * α;
                    this.zx += M.zx * α;
                    this.xy += M.xy * α;
                    this.b += M.b * α;
                    this.uom = Unit.compatible(this.uom, M.uom);
                    return this;
                }
            }
        };
        /**
         * this ⟼ a + b
         *
         * @param a
         * @param b
         * @returns this multivector
         */
        Geometric3.prototype.add2 = function (a, b) {
            if (isZeroGeometricE3(a)) {
                this.uom = b.uom;
            }
            else if (isZeroGeometricE3(b)) {
                this.uom = a.uom;
            }
            else {
                this.uom = Unit.compatible(a.uom, b.uom);
            }
            this.a = a.a + b.a;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.b = a.b + b.b;
            return this;
        };
        /**
         * Adds a pseudoscalar value to this multivector.
         *
         * @param β The pseudoscalar value to be added to this multivector.
         * @param uom The optional unit of measure.
         * @returns this + (Iβ * uom)
         */
        Geometric3.prototype.addPseudo = function (β, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().addPseudo(β, uom));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (β === 0) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.b += β;
                return this;
            }
        };
        /**
         * Adds a scalar value to this multivector.
         *
         * @param α The scalar value to be added to this multivector.
         * @param uom The optional unit of measure.
         * @returns this + (α * uom)
         */
        Geometric3.prototype.addScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().addScalar(α, uom));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (α === 0) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.a += α;
                return this;
            }
        };
        /**
         * @param v The vector to be added to this multivector.
         * @param α An optional scale factor that multiplies the vector argument.
         * @returns this + v * α
         */
        Geometric3.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().addVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (isZeroVectorE3(v)) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, v.uom);
                }
                this.x += v.x * α;
                this.y += v.y * α;
                this.z += v.z * α;
                return this;
            }
        };
        /**
         * Sets this multivector to the angle, defined as the bivector part of the logarithm.
         * @returns grade(log(this), 2)
         */
        Geometric3.prototype.angle = function () {
            return this.log().grade(2);
        };
        /**
         * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
         * @param n
         * @returns approx(this, n)
         */
        Geometric3.prototype.approx = function (n) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().approx(n));
            }
            else {
                approx(this.coords_, n);
                return this;
            }
        };
        /**
         * @returns copy(this)
         */
        Geometric3.prototype.clone = function () {
            return Geometric3.copy(this);
        };
        /**
         * Clifford conjugation
         */
        Geometric3.prototype.conj = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().conj());
            }
            else {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                this.yz = -this.yz;
                this.zx = -this.zx;
                this.xy = -this.xy;
                return this;
            }
        };
        /**
         * Copies the coordinate values into this <code>Geometric3</code>.
         *
         * @param coordinates The coordinates in order a, x, y, z, yz, zx, xy, b.
         */
        Geometric3.prototype.copyCoordinates = function (coordinates) {
            // Copy using the setters so that the modified flag is updated.
            this.a = coordinates[COORD_SCALAR];
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            this.yz = coordinates[COORD_YZ];
            this.zx = coordinates[COORD_ZX];
            this.xy = coordinates[COORD_XY];
            this.b = coordinates[COORD_PSEUDO];
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         *
         * @param M The multivector to be copied.
         */
        Geometric3.prototype.copy = function (M) {
            this.a = M.a;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.b = M.b;
            this.uom = M.uom;
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ copy(B)</code>
         * </p>
         *
         * @param B The bivector to be copied.
         */
        Geometric3.prototype.copyBivector = function (B) {
            this.setCoordinate(COORD_SCALAR, 0, 'a');
            this.setCoordinate(COORD_X, 0, 'x');
            this.setCoordinate(COORD_Y, 0, 'y');
            this.setCoordinate(COORD_Z, 0, 'z');
            this.setCoordinate(COORD_YZ, B.yz, 'yz');
            this.setCoordinate(COORD_ZX, B.zx, 'zx');
            this.setCoordinate(COORD_XY, B.xy, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = B.uom;
            return this;
        };
        /**
         * Sets this multivector to the value of the scalar, α.
         * The non-scalar components are set to zero.
         *
         * @param α The scalar to be copied.
         * @param uom The unit of measure.
         */
        Geometric3.prototype.copyScalar = function (α, uom) {
            this.setCoordinate(COORD_SCALAR, α, 'a');
            this.setCoordinate(COORD_X, 0, 'x');
            this.setCoordinate(COORD_Y, 0, 'y');
            this.setCoordinate(COORD_Z, 0, 'z');
            this.setCoordinate(COORD_YZ, 0, 'yz');
            this.setCoordinate(COORD_ZX, 0, 'zx');
            this.setCoordinate(COORD_XY, 0, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = uom;
            return this;
        };
        /**
         * Copies the spinor argument value into this multivector.
         * The non-spinor components are set to zero.
         *
         * @param spinor The spinor to be copied.
         */
        Geometric3.prototype.copySpinor = function (spinor) {
            this.setCoordinate(COORD_SCALAR, spinor.a, 'a');
            this.setCoordinate(COORD_X, 0, 'x');
            this.setCoordinate(COORD_Y, 0, 'y');
            this.setCoordinate(COORD_Z, 0, 'z');
            this.setCoordinate(COORD_YZ, spinor.yz, 'yz');
            this.setCoordinate(COORD_ZX, spinor.zx, 'zx');
            this.setCoordinate(COORD_XY, spinor.xy, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = spinor.uom;
            return this;
        };
        /**
         * Copies the vector argument value into this multivector.
         * The non-vector components are set to zero.
         *
         * @param vector The vector to be copied.
         */
        Geometric3.prototype.copyVector = function (vector) {
            this.setCoordinate(COORD_SCALAR, 0, 'a');
            this.setCoordinate(COORD_X, vector.x, 'x');
            this.setCoordinate(COORD_Y, vector.y, 'y');
            this.setCoordinate(COORD_Z, vector.z, 'z');
            this.setCoordinate(COORD_YZ, 0, 'yz');
            this.setCoordinate(COORD_ZX, 0, 'zx');
            this.setCoordinate(COORD_XY, 0, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = vector.uom;
            return this;
        };
        /**
         * Sets this multivector to the generalized vector cross product with another multivector.
         *
         * @returns -I * (this ^ m)
         */
        Geometric3.prototype.cross = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().cross(m));
            }
            else {
                this.ext(m);
                this.dual(this).neg();
                return this;
            }
        };
        /**
         * @returns this / magnitude(this)
         */
        Geometric3.prototype.direction = function () {
            if (this.isMutable()) {
                var norm = this.magnitudeNoUnits();
                if (norm !== 0) {
                    this.a = this.a / norm;
                    this.x = this.x / norm;
                    this.y = this.y / norm;
                    this.z = this.z / norm;
                    this.yz = this.yz / norm;
                    this.zx = this.zx / norm;
                    this.xy = this.xy / norm;
                    this.b = this.b / norm;
                }
                this.uom = void 0;
                return this;
            }
            else {
                return lock(this.clone().direction());
            }
        };
        /**
         * @param m The multivector dividend.
         * @returns this / m;
         */
        Geometric3.prototype.div = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().div(m));
            }
            else {
                if (isScalarG3(m)) {
                    this.divByScalar(m.a, m.uom);
                    return this;
                }
                else if (isVectorG3(m)) {
                    return this.divByVector(m);
                }
                else {
                    this.uom = Unit.div(this.uom, m.uom);
                    var α = m.a;
                    var x = m.x;
                    var y = m.y;
                    var z = m.z;
                    var xy = m.xy;
                    var yz = m.yz;
                    var zx = m.zx;
                    var β = m.b;
                    var A = [
                        [α, x, y, z, -xy, -yz, -zx, -β],
                        [x, α, xy, -zx, -y, -β, z, -yz],
                        [y, -xy, α, yz, x, -z, -β, -zx],
                        [z, zx, -yz, α, -β, y, -x, -xy],
                        [xy, -y, x, β, α, zx, -yz, z],
                        [yz, β, -z, y, -zx, α, xy, x],
                        [zx, z, β, -x, yz, -xy, α, y],
                        [β, yz, zx, xy, z, x, y, α]
                    ];
                    var b = [1, 0, 0, 0, 0, 0, 0, 0];
                    var X = gauss(A, b);
                    var a0 = this.a;
                    var a1 = this.x;
                    var a2 = this.y;
                    var a3 = this.z;
                    var a4 = this.xy;
                    var a5 = this.yz;
                    var a6 = this.zx;
                    var a7 = this.b;
                    var b0 = X[0];
                    var b1 = X[1];
                    var b2 = X[2];
                    var b3 = X[3];
                    var b4 = X[4];
                    var b5 = X[5];
                    var b6 = X[6];
                    var b7 = X[7];
                    var c0 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                    var c1 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                    var c2 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                    var c3 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                    var c4 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                    var c5 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                    var c6 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                    var c7 = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                    this.a = c0;
                    this.x = c1;
                    this.y = c2;
                    this.z = c3;
                    this.xy = c4;
                    this.yz = c5;
                    this.zx = c6;
                    this.b = c7;
                }
                return this;
            }
        };
        Geometric3.prototype.divByNumber = function (α) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().divByNumber(α));
            }
            else {
                this.a /= α;
                this.x /= α;
                this.y /= α;
                this.z /= α;
                this.yz /= α;
                this.zx /= α;
                this.xy /= α;
                this.b /= α;
                return this;
            }
        };
        /**
         * <p>
         * <code>this ⟼ this / (α * uom)</code>
         * </p>
         *
         * @param α The scalar dividend.
         * @param uom The unit of measure.
         */
        Geometric3.prototype.divByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().divByScalar(α, uom));
            }
            else {
                this.uom = Unit.div(this.uom, uom);
                this.a /= α;
                this.x /= α;
                this.y /= α;
                this.z /= α;
                this.yz /= α;
                this.zx /= α;
                this.xy /= α;
                this.b /= α;
                return this;
            }
        };
        Geometric3.prototype.divByVector = function (v) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().divByVector(v));
            }
            else {
                var x = v.x;
                var y = v.y;
                var z = v.z;
                var uom2 = Unit.pow(v.uom, QQ.valueOf(2, 1));
                var squaredNorm = x * x + y * y + z * z;
                return this.mulByVector(v).divByScalar(squaredNorm, uom2);
            }
        };
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         *
         * @param a The numerator.
         * @param b The denominator.
         */
        Geometric3.prototype.div2 = function (a, b) {
            this.uom = Unit.div(a.uom, b.uom);
            // FIXME: Generalize
            var a0 = a.a;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.a;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.a = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        /**
         * dual(m) = I<sub>n</sub> * m = m / I<sub>n</sub>
         *
         * @returns dual(m) or dual(this) if m is undefined.
         */
        Geometric3.prototype.dual = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().dual(m));
            }
            else {
                if (isDefined(m)) {
                    var w = -m.b;
                    var x = -m.yz;
                    var y = -m.zx;
                    var z = -m.xy;
                    var yz = m.x;
                    var zx = m.y;
                    var xy = m.z;
                    var β = m.a;
                    this.a = w;
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.yz = yz;
                    this.zx = zx;
                    this.xy = xy;
                    this.b = β;
                    this.uom = m.uom;
                    return this;
                }
                else {
                    return this.dual(this);
                }
            }
        };
        /**
         * @param other
         * @returns
         */
        Geometric3.prototype.equals = function (other) {
            if (other instanceof Geometric3) {
                // TODO: Check units of measure.
                return arraysEQ(this.coords_, other.coords_);
            }
            else {
                return false;
            }
        };
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         */
        Geometric3.prototype.exp = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().exp());
            }
            else {
                Unit.assertDimensionless(this.uom);
                // It's always the case that the scalar commutes with every other
                // grade of the multivector, so we can pull it out the front.
                var expW = Math.exp(this.a);
                // In Geometric3 we have the special case that the pseudoscalar also commutes.
                // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
                // let cosβ = cos(this.b)
                // let sinβ = sin(this.b)
                // We are left with the vector and bivector components.
                // For a bivector (usual case), let B = I * φ, where φ is a vector.
                // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
                var yz = this.yz;
                var zx = this.zx;
                var xy = this.xy;
                // φ is actually the absolute value of one half the rotation angle.
                // The orientation of the rotation gets carried in the bivector components.
                var φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
                var s = φ !== 0 ? Math.sin(φ) / φ : 1;
                var cosφ = Math.cos(φ);
                // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
                // The mixture of vector and bivector parts is more complex!
                this.a = cosφ;
                this.yz = yz * s;
                this.zx = zx * s;
                this.xy = xy * s;
                return this.mulByNumber(expW);
            }
        };
        /**
         * Computes the inverse of this multivector.
         * @returns inverse(this)
         */
        Geometric3.prototype.inv = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().inv());
            }
            else {
                var α = this.a;
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var xy = this.xy;
                var yz = this.yz;
                var zx = this.zx;
                var β = this.b;
                var A = [
                    [α, x, y, z, -xy, -yz, -zx, -β],
                    [x, α, xy, -zx, -y, -β, z, -yz],
                    [y, -xy, α, yz, x, -z, -β, -zx],
                    [z, zx, -yz, α, -β, y, -x, -xy],
                    [xy, -y, x, β, α, zx, -yz, z],
                    [yz, β, -z, y, -zx, α, xy, x],
                    [zx, z, β, -x, yz, -xy, α, y],
                    [β, yz, zx, xy, z, x, y, α]
                ];
                var b = [1, 0, 0, 0, 0, 0, 0, 0];
                var X = gauss(A, b);
                this.a = X[0];
                this.x = X[1];
                this.y = X[2];
                this.z = X[3];
                this.xy = X[4];
                this.yz = X[5];
                this.zx = X[6];
                this.b = X[7];
                this.uom = Unit.inv(this.uom);
                return this;
            }
        };
        Geometric3.prototype.isBivector = function () {
            return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.b === 0;
        };
        /**
         * Determines whether this multivector is exactly 1 (one).
         */
        Geometric3.prototype.isOne = function () {
            if (Unit.isOne(this.uom)) {
                return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
            }
            else {
                return false;
            }
        };
        Geometric3.prototype.isScalar = function () {
            return this.x === 0 && this.y === 0 && this.z === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0 && this.b === 0;
        };
        Geometric3.prototype.isSpinor = function () {
            if (Unit.isOne(this.uom)) {
                return this.x === 0 && this.y === 0 && this.z === 0 && this.b === 0;
            }
            else {
                return false;
            }
        };
        Geometric3.prototype.isVector = function () {
            return this.a === 0 && this.xy === 0 && this.yz === 0 && this.zx === 0 && this.b === 0;
        };
        /**
         * Determines whether this multivector is exactly 0 (zero).
         */
        Geometric3.prototype.isZero = function () {
            // It does not matter what the unit of measure is if all the coordinates are zero.
            return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
        };
        /**
         * @param m
         * @returns this << m
         */
        Geometric3.prototype.lco = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().lco(m));
            }
            else {
                return this.lco2(this, m);
            }
        };
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.lco2 = function (a, b) {
            return lcoG3(a, b, this);
        };
        /**
         * @param target
         * @param α
         * @returns this + α * (target - this)
         */
        Geometric3.prototype.lerp = function (target, α) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().lerp(target, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = target.uom;
                }
                else if (isZeroGeometricE3(target)) ;
                else {
                    this.uom = Unit.compatible(this.uom, target.uom);
                }
                this.a += (target.a - this.a) * α;
                this.x += (target.x - this.x) * α;
                this.y += (target.y - this.y) * α;
                this.z += (target.z - this.z) * α;
                this.yz += (target.yz - this.yz) * α;
                this.zx += (target.zx - this.zx) * α;
                this.xy += (target.xy - this.xy) * α;
                this.b += (target.b - this.b) * α;
                return this;
            }
        };
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         *
         * @param a
         * @param b
         * @param α
         */
        Geometric3.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        Geometric3.prototype.log = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().log());
            }
            else {
                Unit.assertDimensionless(this.uom);
                var α = this.a;
                var x = this.yz;
                var y = this.zx;
                var z = this.xy;
                var BB = x * x + y * y + z * z;
                var B = Math.sqrt(BB);
                var f = Math.atan2(B, α) / B;
                this.a = Math.log(Math.sqrt(α * α + BB));
                this.yz = x * f;
                this.zx = y * f;
                this.xy = z * f;
                return this;
            }
        };
        /**
         * <p>
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         * </p>
         */
        Geometric3.prototype.magnitude = function () {
            if (this.isMutable()) {
                this.a = Math.sqrt(this.quaditudeNoUnits());
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.xy = 0;
                this.yz = 0;
                this.zx = 0;
                this.b = 0;
                // The unit of measure is unchanged.
                return this;
            }
            else {
                return lock(this.clone().magnitude());
            }
        };
        Geometric3.prototype.magnitudeNoUnits = function () {
            return Math.sqrt(this.quaditudeNoUnits());
        };
        /**
         * Returns the geometric product of this multivector with the rhs multivector.
         * @param rhs The operand on the right hand side of the * operator.
         * @return this * rhs
         */
        Geometric3.prototype.mul = function (rhs) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mul(rhs));
            }
            else {
                return this.mul2(this, rhs);
            }
        };
        Geometric3.prototype.mulByBivector = function (B) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByBivector(B));
            }
            else {
                this.uom = Unit.mul(this.uom, B.uom);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
                var b4 = B.xy;
                var b5 = B.yz;
                var b6 = B.zx;
                this.a = -a4 * b4 - a5 * b5 - a6 * b6;
                this.x = -a2 * b4 + a3 * b6 - a7 * b5;
                this.y = +a1 * b4 - a3 * b5 - a7 * b6;
                this.z = -a1 * b6 + a2 * b5 - a7 * b4;
                this.xy = a0 * b4 - a5 * b6 + a6 * b5;
                this.yz = a0 * b5 + a4 * b6 - a6 * b4;
                this.zx = a0 * b6 - a4 * b5 + a5 * b4;
                this.b = +a1 * b5 + a2 * b6 + a3 * b4;
                return this;
            }
        };
        Geometric3.prototype.mulByVector = function (v) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByVector(v));
            }
            else {
                this.uom = Unit.mul(this.uom, v.uom);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
                var b1 = v.x;
                var b2 = v.y;
                var b3 = v.z;
                this.a = a1 * b1 + a2 * b2 + a3 * b3;
                this.x = a0 * b1 + a4 * b2 - a6 * b3;
                this.y = a0 * b2 - a4 * b1 + a5 * b3;
                this.z = a0 * b3 - a5 * b2 + a6 * b1;
                this.xy = a1 * b2 - a2 * b1 + a7 * b3;
                this.yz = a2 * b3 - a3 * b2 + a7 * b1;
                this.zx = -a1 * b3 + a3 * b1 + a7 * b2;
                this.b = a4 * b3 + a5 * b1 + a6 * b2;
                return this;
            }
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.mul2 = function (a, b) {
            if (this.lock_ !== UNLOCKED) {
                throw new Error("TODO");
            }
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.z;
            var a4 = a.xy;
            var a5 = a.yz;
            var a6 = a.zx;
            var a7 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.z;
            var b4 = b.xy;
            var b5 = b.yz;
            var b6 = b.zx;
            var b7 = b.b;
            this.a = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
            this.x = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
            this.y = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
            this.z = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
            this.xy = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
            this.yz = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
            this.zx = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
            this.b = mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
            this.uom = Unit.mul(a.uom, b.uom);
            return this;
        };
        /**
         * @returns this * -1
         */
        Geometric3.prototype.neg = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().neg());
            }
            else {
                this.a = -this.a;
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                this.yz = -this.yz;
                this.zx = -this.zx;
                this.xy = -this.xy;
                this.b = -this.b;
                // There is no change in the unit of measure.
                return this;
            }
        };
        /**
         * Sets this multivector to the identity element for multiplication, <b>1</b>.
         */
        Geometric3.prototype.one = function () {
            this.a = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            this.uom = void 0;
            return this;
        };
        /**
         * The quaditude of a multivector is defined in terms of the scalar products
         * of its blades.
         * this ⟼ scp(this, rev(this)) = this | ~this
         */
        Geometric3.prototype.quaditude = function () {
            if (this.isMutable()) {
                this.a = this.quaditudeNoUnits();
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                this.uom = Unit.mul(this.uom, this.uom);
                return this;
            }
            else {
                return lock(this.clone().quaditude());
            }
        };
        /**
         * @param m
         * @returns this >> m
         */
        Geometric3.prototype.rco = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().rco(m));
            }
            else {
                return this.rco2(this, m);
            }
        };
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.rco2 = function (a, b) {
            return rcoG3(a, b, this);
        };
        /**
         * Computes the <em>squared norm</em> of this multivector.
         *
         * This is an alias for the `quaditude` method.
         */
        Geometric3.prototype.squaredNorm = function () {
            return this.quaditude();
        };
        Geometric3.prototype.quaditudeNoUnits = function () {
            return squaredNormG3(this);
        };
        /**
         * Sets this multivector to its reflection in the plane orthogonal to vector n.
         *
         * Mathematically,
         *
         * this ⟼ - n * this * n
         *
         * Geometrically,
         *
         * Reflects this multivector in the plane orthogonal to the unit vector, n.
         *
         * If n is not a unit vector then the result is scaled by n squared.
         *
         * @param n The unit vector that defines the reflection plane.
         */
        Geometric3.prototype.reflect = function (n) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().reflect(n));
            }
            else {
                // We are assuming that n is dimensionless, so that our unit of measure does not change.
                Unit.assertDimensionless(n.uom);
                var n1 = n.x;
                var n2 = n.y;
                var n3 = n.z;
                var n11 = n1 * n1;
                var n22 = n2 * n2;
                var n33 = n3 * n3;
                var nn = n11 + n22 + n33;
                var f1 = 2 * n2 * n3;
                var f2 = 2 * n3 * n1;
                var f3 = 2 * n1 * n2;
                var t1 = n22 + n33 - n11;
                var t2 = n33 + n11 - n22;
                var t3 = n11 + n22 - n33;
                var cs = this.coords_;
                var a = cs[COORD_SCALAR];
                var x1 = cs[COORD_X];
                var x2 = cs[COORD_Y];
                var x3 = cs[COORD_Z];
                var B3 = cs[COORD_XY];
                var B1 = cs[COORD_YZ];
                var B2 = cs[COORD_ZX];
                var b = cs[COORD_PSEUDO];
                this.setCoordinate(COORD_SCALAR, -nn * a, 'a');
                this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, 'x');
                this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, 'y');
                this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, 'z');
                this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, 'xy');
                this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, 'yz');
                this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, 'zx');
                this.setCoordinate(COORD_PSEUDO, -nn * b, 'b');
                return this;
            }
        };
        /**
         * @returns reverse(this)
         */
        Geometric3.prototype.rev = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().rev());
            }
            else {
                // reverse has a ++-- structure on the grades.
                this.a = +this.a;
                this.x = +this.x;
                this.y = +this.y;
                this.z = +this.z;
                this.yz = -this.yz;
                this.zx = -this.zx;
                this.xy = -this.xy;
                this.b = -this.b;
                // The unit of measure is unchanged.
                return this;
            }
        };
        /**
         * @param R the spinor that rotates this multivector.
         * @returns R * this * reverse(R)
         */
        Geometric3.prototype.rotate = function (R) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().rotate(R));
            }
            else {
                // We are assuming that R is dimensionless.
                Unit.assertDimensionless(R.uom);
                // FIXME: This only rotates the vector components.
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var a = R.xy;
                var b = R.yz;
                var c = R.zx;
                var α = R.a;
                var ix = α * x - c * z + a * y;
                var iy = α * y - a * x + b * z;
                var iz = α * z - b * y + c * x;
                var iα = b * x + c * y + a * z;
                this.x = ix * α + iα * b + iy * a - iz * c;
                this.y = iy * α + iα * c + iz * b - ix * a;
                this.z = iz * α + iα * a + ix * c - iy * b;
                return this;
            }
        };
        /**
         * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
         *
         * @param axis The (unit) vector defining the rotation aspect and orientation.
         * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
         */
        Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
            Unit.assertDimensionless(axis.uom);
            // Compute the dual of the axis to obtain the corresponding bivector.
            var x = axis.x;
            var y = axis.y;
            var z = axis.z;
            var squaredNorm = x * x + y * y + z * z;
            if (squaredNorm === 1) {
                return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z, uom: void 0 }, θ);
            }
            else {
                var norm = Math.sqrt(squaredNorm);
                var yz = x / norm;
                var zx = y / norm;
                var xy = z / norm;
                return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy, uom: void 0 }, θ);
            }
        };
        /**
         * <p>
         * Computes a rotor, R, from two unit vectors, where
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         *
         * The result is independent of the magnitudes of a and b.
         *
         * @param a The starting vector
         * @param b The ending vector
         * @returns The rotor representing a rotation from a to b.
         */
        Geometric3.prototype.rotorFromDirections = function (a, b) {
            var B = void 0;
            return this.rotorFromVectorToVector(a, b, B);
        };
        /**
         * Helper function for rotorFromFrameToFrame.
         */
        Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
            // FIXME: This creates a lot of temporary objects.
            // Compute the rotor that takes e1 to f1.
            // There is no concern that the two vectors are anti-parallel.
            var R1 = Geometric3.rotorFromDirections(e1, f1);
            // Compute the image of e2 under the first rotation in order to calculate R2.
            var f = Geometric3.fromVector(e2).rotate(R1);
            // In case of rotation for antipodal vectors, define the fallback rotation bivector.
            var B = Geometric3.dualOfVector(f1);
            // Compute R2
            var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
            // The total rotor, R, is the composition of R1 followed by R2.
            return this.mul2(R2, R1);
        };
        /**
         *
         */
        Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
            // There is instability when the rotation angle is near 180 degrees.
            // So we don't use the lovely formula based upon reciprocal frames.
            // Our algorithm is to first pick the vector that stays most aligned with itself.
            // This allows for the possibility that the other two vectors may become anti-aligned.
            // Observe that all three vectors can't be anti-aligned because that would be a reflection!
            // We then compute the rotor R1 that maps this first vector to its image.
            // Allowing then for the possibility that the remaining vectors may have ambiguous rotors,
            // we compute the dual of this image vector as the default rotation plane for one of the
            // other vectors. We only need to calculate the rotor R2 for one more vector because our
            // frames are orthogonal and so R1 and R2 determine R.
            //
            var biggestValue = -1;
            var firstVector;
            for (var i = 0; i < 3; i++) {
                cosines[i] = cosVectorVector(es[i], fs[i]);
                if (cosines[i] > biggestValue) {
                    firstVector = i;
                    biggestValue = cosines[i];
                }
            }
            var secondVector = (firstVector + 1) % 3;
            return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
        };
        /**
         * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
         *
         * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
         *
         * @param B The (unit) bivector generating the rotation.
         * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
         */
        Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            Unit.assertDimensionless(B.uom);
            var φ = θ / 2;
            var yz = B.yz;
            var zx = B.zx;
            var xy = B.xy;
            var absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
            var mφ = absB * φ;
            var sinDivAbsB = Math.sin(mφ) / absB;
            this.a = Math.cos(mφ);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = -yz * sinDivAbsB;
            this.zx = -zx * sinDivAbsB;
            this.xy = -xy * sinDivAbsB;
            this.b = 0;
            return this;
        };
        /**
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         *
         * The result is independent of the magnitudes of a and b.
         */
        Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
            rotorFromDirectionsE3(a, b, B, this);
            return this;
        };
        /**
         * @param m
         * @returns this | m
         */
        Geometric3.prototype.scp = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().scp(m));
            }
            else {
                return this.scp2(this, m);
            }
        };
        /**
         * <p>
         * <code>this ⟼ scp(a, b) = a | b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.scp2 = function (a, b) {
            return scpG3(a, b, this);
        };
        /**
         * Currently limited to taking the square root of a positive scalar quantity.
         */
        Geometric3.prototype.sqrt = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().sqrt());
            }
            else {
                this.a = Math.sqrt(this.a);
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                this.uom = Unit.sqrt(this.uom);
                return this;
            }
        };
        /**
         * @param α
         * @returns this * α
         */
        Geometric3.prototype.mulByNumber = function (α) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByNumber(α));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.y *= α;
                this.z *= α;
                this.yz *= α;
                this.zx *= α;
                this.xy *= α;
                this.b *= α;
                // There is no change in the unit of measure.
                return this;
            }
        };
        /**
         * @param α
         * @param uom
         * @returns this * (α * uom)
         */
        Geometric3.prototype.mulByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByScalar(α, uom));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.y *= α;
                this.z *= α;
                this.yz *= α;
                this.zx *= α;
                this.xy *= α;
                this.b *= α;
                this.uom = Unit.mul(this.uom, uom);
                return this;
            }
        };
        /**
         * Applies the diagonal elements of a scaling matrix to this multivector.
         *
         * @param σ
         */
        Geometric3.prototype.stress = function (σ) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().stress(σ));
            }
            else {
                this.x *= σ.x;
                this.y *= σ.y;
                this.z *= σ.z;
                this.uom = Unit.mul(σ.uom, this.uom);
                // TODO: Action on other components TBD.
                return this;
            }
        };
        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this Geometric3 to the geometric product a * b of the vector arguments.
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.versor = function (a, b) {
            this.uom = Unit.mul(a.uom, b.uom);
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.zero();
            this.a = dotVectorE3(a, b);
            this.yz = wedgeYZ$1(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX$1(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY$1(ax, ay, az, bx, by);
            return this;
        };
        Geometric3.prototype.write = function (mv) {
            mv.a = this.a;
            mv.x = this.x;
            mv.y = this.y;
            mv.z = this.z;
            mv.xy = this.xy;
            mv.yz = this.yz;
            mv.zx = this.zx;
            mv.b = this.b;
            mv.uom = this.uom;
        };
        Geometric3.prototype.writeVector = function (v) {
            v.x = this.x;
            v.y = this.y;
            v.z = this.z;
            v.uom = this.uom;
        };
        Geometric3.prototype.writeBivector = function (B) {
            B.xy = this.xy;
            B.yz = this.yz;
            B.zx = this.zx;
            B.uom = this.uom;
        };
        /**
         * @param M
         * @param α
         * @returns this - M * α
         */
        Geometric3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().sub(M, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = M.uom;
                }
                else if (isZeroGeometricE3(M)) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, M.uom);
                }
                this.a -= M.a * α;
                this.x -= M.x * α;
                this.y -= M.y * α;
                this.z -= M.z * α;
                this.yz -= M.yz * α;
                this.zx -= M.zx * α;
                this.xy -= M.xy * α;
                this.b -= M.b * α;
                return this;
            }
        };
        Geometric3.prototype.subScalar = function (a, uom, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().subScalar(a, uom, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else {
                    this.uom = Unit.compatible(this.uom, uom);
                }
                this.a -= a * α;
                return this;
            }
        };
        /**
         * @param v The vector to subtract from this multivector.
         * @param α The multiplier for the amount of the vector to subtract.
         * @returns this - v * α
         */
        Geometric3.prototype.subVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().subVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (isZeroVectorE3(v)) {
                    return this;
                }
                else {
                    this.uom = Unit.compatible(this.uom, v.uom);
                }
                this.x -= v.x * α;
                this.y -= v.y * α;
                this.z -= v.z * α;
                return this;
            }
        };
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.sub2 = function (a, b) {
            if (isZeroGeometricE3(a)) {
                this.a = -b.a;
                this.x = -b.x;
                this.y = -b.y;
                this.z = -b.z;
                this.yz = -b.yz;
                this.zx = -b.zx;
                this.xy = -b.xy;
                this.b = -b.b;
                this.uom = b.uom;
            }
            else if (isZeroGeometricE3(b)) {
                this.a = a.a;
                this.x = a.x;
                this.y = a.y;
                this.z = a.z;
                this.yz = a.yz;
                this.zx = a.zx;
                this.xy = a.xy;
                this.b = a.b;
                this.uom = a.uom;
            }
            else {
                this.a = a.a - b.a;
                this.x = a.x - b.x;
                this.y = a.y - b.y;
                this.z = a.z - b.z;
                this.yz = a.yz - b.yz;
                this.zx = a.zx - b.zx;
                this.xy = a.xy - b.xy;
                this.b = a.b - b.b;
                this.uom = Unit.compatible(a.uom, b.uom);
            }
            return this;
        };
        /**
         * Returns a string representing the number in exponential notation.
         *
         * @param fractionDigits
         * @returns
         */
        Geometric3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        /**
         * Returns a string representing the number in fixed-point notation.
         *
         * @param fractionDigits
         * @returns
         */
        Geometric3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        /**
         * @param precision
         * @returns
         */
        Geometric3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        /**
         * Returns a string representation of the number.
         *
         * @param radix
         * @returns
         */
        Geometric3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        /**
         * Sets this multivector to the result of keeping only the specified grade.
         * This is the grade extraction operation.
         *
         * @param n the grade to be retained.
         * @returns grade(this, n)
         */
        Geometric3.prototype.grade = function (n) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().grade(n));
            }
            else {
                // There is no change to the unit of measure.
                switch (n) {
                    case 0: {
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                        break;
                    }
                    case 1: {
                        this.a = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                        break;
                    }
                    case 2: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.b = 0;
                        break;
                    }
                    case 3: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        break;
                    }
                    default: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                    }
                }
                return this;
            }
        };
        /**
         * @param m
         * @return this ^ m
         */
        Geometric3.prototype.ext = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().ext(m));
            }
            else {
                return this.ext2(this, m);
            }
        };
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         *
         * @param a
         * @param b
         */
        Geometric3.prototype.ext2 = function (a, b) {
            return extG3(a, b, this);
        };
        /**
         * Sets this multivector to the identity element for addition, 0.
         */
        Geometric3.prototype.zero = function () {
            this.a = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            // The unit of measure does not matter if all the coordinates are zero.
            return this;
        };
        /**
         * Implements `this + rhs`.
         */
        Geometric3.prototype.__add__ = function (rhs) {
            var duckR = maskG3(rhs);
            if (duckR) {
                return lock(this.clone().add(duckR));
            }
            else if (isVectorE3(rhs)) {
                return lock(this.clone().addVector(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `this / rhs`.
         */
        Geometric3.prototype.__div__ = function (rhs) {
            var duckR = maskG3(rhs);
            if (duckR) {
                return lock(this.clone().div(duckR));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs / this`.
         */
        Geometric3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).div(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs, void 0).div(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `this * rhs`.
         */
        Geometric3.prototype.__mul__ = function (rhs) {
            var duckR = maskG3(rhs);
            if (duckR) {
                return lock(this.clone().mul(duckR));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs * this`.
         */
        Geometric3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).mul(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.copy(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs + this`.
         */
        Geometric3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).add(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).add(this));
            }
            else if (isVectorE3(lhs)) {
                return lock(Geometric3.fromVector(lhs).add(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `this - rhs`.
         */
        Geometric3.prototype.__sub__ = function (rhs) {
            var duckR = maskG3(rhs);
            if (duckR) {
                return lock(this.clone().sub(duckR));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs - rhs`.
         */
        Geometric3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).sub(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).sub(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `~this`.
         */
        Geometric3.prototype.__tilde__ = function () {
            return lock(Geometric3.copy(this).rev());
        };
        /**
         * Implements `this ^ rhs`.
         */
        Geometric3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).ext(rhs));
            }
            else if (typeof rhs === 'number') {
                // The outer product with a scalar is scalar multiplication.
                return lock(Geometric3.copy(this).mulByNumber(rhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs ^ this`.
         */
        Geometric3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).ext(this));
            }
            else if (typeof lhs === 'number') {
                // The outer product with a scalar is scalar multiplication, and commutes.
                return lock(Geometric3.copy(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `this << rhs`.
         */
        Geometric3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).lco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs << this`.
         */
        Geometric3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).lco(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).lco(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `this >> rhs`.
         */
        Geometric3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).rco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs >> rhs`.
         */
        Geometric3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).rco(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).rco(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `this | rhs`.
         */
        Geometric3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).scp(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `lhs | this`.
         */
        Geometric3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).scp(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).scp(this));
            }
            else {
                return void 0;
            }
        };
        /**
         * Implements `!this`.
         */
        Geometric3.prototype.__bang__ = function () {
            return lock(Geometric3.copy(this).inv());
        };
        /**
         * Implements `+this`.
         */
        Geometric3.prototype.__pos__ = function () {
            return lock(Geometric3.copy(this));
        };
        /**
         * Implements `-this`.
         */
        Geometric3.prototype.__neg__ = function () {
            return lock(Geometric3.copy(this).neg());
        };
        /**
         * Creates a grade 2 (bivector) multivector from the specified cartesian coordinates.
         * The bivector returned is in the unlocked (mutable) state.
         * @param yz The coordinate corresponding to the e2e3 basis bivector.
         * @param zx The coordinate corresponding to the e3e1 basis bivector.
         * @param xy The coordinate corresponding to the e1e2 basis bivector.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric3.bivector = function (yz, zx, xy, uom) {
            return Geometric3.spinor(0, yz, zx, xy, uom);
        };
        /**
         * @param mv The multivector to be copied.
         */
        Geometric3.copy = function (mv) {
            return new Geometric3(coordinates(mv), mv.uom);
        };
        Geometric3.dual = function (m) {
            return new Geometric3(zero(), m.uom).dual(m);
        };
        Geometric3.dualOfBivector = function (B) {
            return new Geometric3(vector(-B.yz, -B.zx, -B.xy), B.uom);
        };
        Geometric3.dualOfVector = function (v) {
            return new Geometric3(bivector(v.x, v.y, v.z), v.uom);
        };
        Geometric3.fromBivector = function (B) {
            return new Geometric3(bivector(B.yz, B.zx, B.xy), B.uom);
        };
        /**
         * @param alpha
         */
        Geometric3.fromScalar = function (alpha) {
            return new Geometric3(scalar(alpha.a), alpha.uom);
        };
        /**
         * @param s
         */
        Geometric3.fromSpinor = function (R) {
            return new Geometric3(spinor(R.a, R.yz, R.zx, R.xy), R.uom);
        };
        /**
         * @param v
         * @returns
         */
        Geometric3.fromVector = function (v) {
            return new Geometric3(vector(v.x, v.y, v.z), v.uom);
        };
        /**
         * @param A
         * @param B
         * @param α
         * @returns <code>A + α * (B - A)</code>
         */
        Geometric3.lerp = function (A, B, α) {
            return Geometric3.copy(A).lerp(B, α);
        };
        Geometric3.pseudo = function (b, uom) {
            return new Geometric3(pseudo(b), uom);
        };
        /**
         * <p>
         * Computes a multivector with random components.
         * </p>
         */
        Geometric3.random = function () {
            var lowerBound = -1;
            var upperBound = +1;
            var a = randomRange(lowerBound, upperBound);
            var x = randomRange(lowerBound, upperBound);
            var y = randomRange(lowerBound, upperBound);
            var z = randomRange(lowerBound, upperBound);
            var yz = randomRange(lowerBound, upperBound);
            var zx = randomRange(lowerBound, upperBound);
            var xy = randomRange(lowerBound, upperBound);
            var b = randomRange(lowerBound, upperBound);
            return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b), void 0);
        };
        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         *
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        Geometric3.rotorFromDirections = function (a, b) {
            return new Geometric3(zero(), void 0).rotorFromDirections(a, b);
        };
        Geometric3.rotorFromFrameToFrame = function (es, fs) {
            return new Geometric3(zero(), void 0).rotorFromFrameToFrame(es, fs);
        };
        Geometric3.rotorFromVectorToVector = function (a, b, B) {
            return new Geometric3(zero(), void 0).rotorFromVectorToVector(a, b, B);
        };
        /**
         * Creates a grade 0 (scalar) multivector with value `alpha * uom`.
         * The scalar returned is in the unlocked (mutable) state.
         * @param a The scaling factor for the unit of measure.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric3.scalar = function (a, uom) {
            return new Geometric3(scalar(a), uom);
        };
        /**
         * Creates a spinor valued multivector from the specified cartesian coordinates.
         * The spinor returned is in the unlocked (mutable) state.
         * @param a The scalar coordinate.
         * @param yz The coordinate corresponding to the e2e3 basis bivector.
         * @param zx The coordinate corresponding to the e3e1 basis bivector.
         * @param xy The coordinate corresponding to the e1e2 basis bivector.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric3.spinor = function (a, yz, zx, xy, uom) {
            return new Geometric3(spinor(a, yz, zx, xy), uom);
        };
        /**
         * Creates a grade 1 (vector) multivector from the specified cartesian coordinates.
         * @param x The coordinate corresponding to the e1 basis vector.
         * @param y The coordinate corresponding to the e2 basis vector.
         * @param z The coordinate corresponding to the e3 basis vector.
         * @param uom The optional unit of measure. Equivalent to 1 if omitted.
         */
        Geometric3.vector = function (x, y, z, uom) {
            return new Geometric3(vector(x, y, z), uom);
        };
        /**
         * @param a
         * @param b
         */
        Geometric3.wedge = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            var yz = wedgeYZ$1(ax, ay, az, bx, by, bz);
            var zx = wedgeZX$1(ax, ay, az, bx, by, bz);
            var xy = wedgeXY$1(ax, ay, az, bx, by);
            return Geometric3.spinor(0, yz, zx, xy, Unit.mul(a.uom, b.uom));
        };
        /**
         * Constructs a Geometric3 representing the number zero.
         * The identity element for addition, <b>0</b>.
         * The returned multivector is locked.
         */
        Geometric3.zero = lock(new Geometric3(zero(), void 0));
        /**
         * Constructs a Geometric3 representing the number one.
         * The identity element for multiplication, <b>1</b>.
         * The returned multivector is locked.
         */
        Geometric3.one = lock(new Geometric3(scalar(1), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>x</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric3.e1 = lock(new Geometric3(vector(1, 0, 0), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>y</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric3.e2 = lock(new Geometric3(vector(0, 1, 0), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>z</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric3.e3 = lock(new Geometric3(vector(0, 0, 1), void 0));
        /**
         * Constructs a basis vector corresponding to the <code>β</code> coordinate.
         * The returned multivector is locked.
         */
        Geometric3.I = lock(new Geometric3(pseudo(1), void 0));
        /**
         * SI base unit of length.
         * The meter is the length of the path travelled by light in vacuum during a time interval of 1 / 299 792 458 of a second.
         */
        Geometric3.meter = lock(new Geometric3(scalar(1), Unit.METER));
        /**
         * SI base unit of mass.
         * The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.
         */
        Geometric3.kilogram = lock(new Geometric3(scalar(1), Unit.KILOGRAM));
        /**
         * SI base unit of time.
         * The second is the duration of 9 192 631 770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.
         */
        Geometric3.second = lock(new Geometric3(scalar(1), Unit.SECOND));
        /**
         * SI base unit of electric current.
         * The ampere is that constant current which, if maintained in two straight parallel conductors of infinite length, of negligible circular cross-section, and placed 1 meter apart in vacuum, would produce between these conductors a force equal to 2 x 10<sup>-7</sup> newton per meter of length.
         */
        Geometric3.ampere = lock(new Geometric3(scalar(1), Unit.AMPERE));
        /**
         * SI base unit of thermodynamic temperature.
         * The kelvin, unit of thermodynamic temperature, is the fraction 1 / 273.16 of the thermodynamic temperature of the triple point of water.
         */
        Geometric3.kelvin = lock(new Geometric3(scalar(1), Unit.KELVIN));
        /**
         * SI base unit of amount of substance.
         * 1. The mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12; its symbol is "mol."
         *
         * 2. When the mole is used, the elementary entities must be specified and may be atoms, molecules, ions, electrons, other particles, or specified groups of such particles.
         */
        Geometric3.mole = lock(new Geometric3(scalar(1), Unit.MOLE));
        /**
         * SI base unit of luminous intensity.
         * The candela is the luminous intensity, in a given direction, of a source that emits monochromatic radiation of frequency 540 x 10<sup>12</sup> hertz and that has a radiant intensity in that direction of 1 / 683 watt per steradian.
         */
        Geometric3.candela = lock(new Geometric3(scalar(1), Unit.CANDELA));
        /**
         * SI derived unit of electric charge, quantity of electricity.
         */
        Geometric3.coulomb = lock(new Geometric3(scalar(1), Unit.COULOMB));
        /**
         * SI derived unit of force.
         */
        Geometric3.newton = lock(new Geometric3(scalar(1), Unit.NEWTON));
        /**
         * SI derived unit of energy, work, quantity of heat.
         */
        Geometric3.joule = lock(new Geometric3(scalar(1), Unit.JOULE));
        return Geometric3;
    }());

    /**
     * Computes the determinant of a 3x3 (square) matrix where the elements are assumed to be in column-major order.
     * @hidden
     */
    function det3x3(m) {
        var m00 = m[0x0], m01 = m[0x3], m02 = m[0x6];
        var m10 = m[0x1], m11 = m[0x4], m12 = m[0x7];
        var m20 = m[0x2], m21 = m[0x5], m22 = m[0x8];
        return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
    }

    /**
     * Computes the inverse of a 3x3 (square) matrix where the elements are assumed to be in column-major order.
     * @hidden
     */
    function inv3x3(m, te) {
        var det = det3x3(m);
        var m11 = m[0x0], m12 = m[0x3], m13 = m[0x6];
        var m21 = m[0x1], m22 = m[0x4], m23 = m[0x7];
        var m31 = m[0x2], m32 = m[0x5], m33 = m[0x8];
        // Row 1
        var o11 = m22 * m33 - m23 * m32;
        var o12 = m13 * m32 - m12 * m33;
        var o13 = m12 * m23 - m13 * m22;
        // Row 2
        var o21 = m23 * m31 - m21 * m33;
        var o22 = m11 * m33 - m13 * m31;
        var o23 = m13 * m21 - m11 * m23;
        // Row 3
        var o31 = m21 * m32 - m22 * m31;
        var o32 = m12 * m31 - m11 * m32;
        var o33 = m11 * m22 - m12 * m21;
        var α = 1 / det;
        te[0x0] = o11 * α;
        te[0x3] = o12 * α;
        te[0x6] = o13 * α;
        te[0x1] = o21 * α;
        te[0x4] = o22 * α;
        te[0x7] = o23 * α;
        te[0x2] = o31 * α;
        te[0x5] = o32 * α;
        te[0x8] = o33 * α;
    }

    /**
     * @hidden
     * @param a
     * @param b
     * @param c
     * @returns
     */
    function mul3x3(a, b, c) {
        var a11 = a[0x0], a12 = a[0x3], a13 = a[0x6];
        var a21 = a[0x1], a22 = a[0x4], a23 = a[0x7];
        var a31 = a[0x2], a32 = a[0x5], a33 = a[0x8];
        var b11 = b[0x0], b12 = b[0x3], b13 = b[0x6];
        var b21 = b[0x1], b22 = b[0x4], b23 = b[0x7];
        var b31 = b[0x2], b32 = b[0x5], b33 = b[0x8];
        c[0x0] = a11 * b11 + a12 * b21 + a13 * b31;
        c[0x3] = a11 * b12 + a12 * b22 + a13 * b32;
        c[0x6] = a11 * b13 + a12 * b23 + a13 * b33;
        c[0x1] = a21 * b11 + a22 * b21 + a23 * b31;
        c[0x4] = a21 * b12 + a22 * b22 + a23 * b32;
        c[0x7] = a21 * b13 + a22 * b23 + a23 * b33;
        c[0x2] = a31 * b11 + a32 * b21 + a33 * b31;
        c[0x5] = a31 * b12 + a32 * b22 + a33 * b32;
        c[0x8] = a31 * b13 + a32 * b23 + a33 * b33;
        return c;
    }

    /**
     *
     */
    var Matrix3 = /** @class */ (function (_super) {
        __extends(Matrix3, _super);
        /**
         * @param elements
         * @param uom The optional unit of measure.
         */
        function Matrix3(elements /* = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])*/, uom) {
            return _super.call(this, elements, 3, uom) || this;
        }
        /**
         *
         */
        Matrix3.prototype.inv = function () {
            inv3x3(this.elements, this.elements);
            this.uom = Unit.div(Unit.ONE, this.uom);
            return this;
        };
        /**
         * @param rhs
         */
        Matrix3.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        /**
         * @param lhs
         */
        Matrix3.prototype.rmul = function (lhs) {
            mul3x3(lhs.elements, this.elements, this.elements);
            return this;
        };
        /**
         * @param a
         * @param b
         */
        Matrix3.prototype.mul2 = function (a, b) {
            mul3x3(a.elements, b.elements, this.elements);
            return this;
        };
        /**
         * Sets this matrix to be equivalent to the spinor.
         *
         * this ⟼ rotation(spinor)
         *
         * @param attitude  The spinor from which the rotation will be computed.
         */
        Matrix3.prototype.rotation = function (spinor) {
            // The correspondence between quaternions and spinors is
            // i <=> -e2^e3, j <=> -e3^e1, k <=> -e1^e2.
            var x = -spinor.yz;
            var y = -spinor.zx;
            var z = -spinor.xy;
            var α = spinor.a;
            var x2 = x + x;
            var y2 = y + y;
            var z2 = z + z;
            var xx = x * x2;
            var xy = x * y2;
            var xz = x * z2;
            var yy = y * y2;
            var yz = y * z2;
            var zz = z * z2;
            var wx = α * x2;
            var wy = α * y2;
            var wz = α * z2;
            this.set(1 - yy - zz, xy - wz, xz + wy, xy + wz, 1 - xx - zz, yz - wx, xz - wy, yz + wx, 1 - xx - yy);
            return this;
        };
        /**
         * @param i the zero-based index of the row.
         */
        Matrix3.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[3 + i], te[6 + i]];
        };
        /**
         * <p>
         * Sets all elements of this matrix to the supplied values (provided in <em>row-major</em> order).
         * </p>
         * <p>
         * An advantage of this method is that the function call resembles the matrix written out.
         * </p>
         * <p>
         * The parameters are named according to the 1-based row and column.
         * </p>
         *
         * @param n11
         * @param n12
         * @param n13
         * @param n21
         * @param n22
         * @param n23
         * @param n31
         * @param n32
         * @param n33
         */
        Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            var te = this.elements;
            te[0] = n11;
            te[3] = n12;
            te[6] = n13;
            te[1] = n21;
            te[4] = n22;
            te[7] = n23;
            te[2] = n31;
            te[5] = n32;
            te[8] = n33;
            return this;
        };
        /**
         * @param radix
         */
        Matrix3.prototype.toString = function (radix) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
            }
            return text.join('\n');
        };
        /**
         *
         */
        Matrix3.prototype.transpose = function () {
            var tmp;
            var m = this.elements;
            tmp = m[1];
            m[1] = m[3];
            m[3] = tmp;
            tmp = m[2];
            m[2] = m[6];
            m[6] = tmp;
            tmp = m[5];
            m[5] = m[7];
            m[7] = tmp;
            return this;
        };
        /**
         * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
         */
        Matrix3.one = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Matrix3.zero = function () {
            return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Matrix3;
    }(AbstractMatrix));

    /**
     * @hidden
     */
    var Mat3 = /** @class */ (function () {
        /**
         *
         */
        function Mat3(source) {
            /**
             *
             */
            this.data = Matrix3.one();
            var n11 = source.getElement(0, 0);
            var n12 = source.getElement(0, 1);
            var n13 = source.getElement(0, 2);
            var n21 = source.getElement(1, 0);
            var n22 = source.getElement(1, 1);
            var n23 = source.getElement(1, 2);
            var n31 = source.getElement(2, 0);
            var n32 = source.getElement(2, 1);
            var n33 = source.getElement(2, 2);
            this.data.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
            this.uom = Unit.mustBeUnit('uom', source.uom);
        }
        Object.defineProperty(Mat3.prototype, "dimensions", {
            /**
             *
             */
            get: function () {
                return 3;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the element at the specified (zero-based) row and column.
         * @param row The zero-based row.
         * @param column The zero-based column.
         */
        Mat3.prototype.getElement = function (row, column) {
            return this.data.getElement(row, column);
        };
        /**
         * @param i the zero-based index of the row.
         */
        Mat3.prototype.row = function (i) {
            return this.data.row(i);
        };
        /**
         * @param radix
         */
        Mat3.prototype.toString = function (radix) {
            return this.data.toString(radix);
        };
        return Mat3;
    }());

    /**
     *
     */
    var Force3 = /** @class */ (function (_super) {
        __extends(Force3, _super);
        function Force3(body) {
            return _super.call(this, body) || this;
        }
        return Force3;
    }(Force));

    /**
     *
     */
    var Torque3 = /** @class */ (function (_super) {
        __extends(Torque3, _super);
        function Torque3(body) {
            return _super.call(this, body) || this;
        }
        return Torque3;
    }(Torque));

    /**
     * @hidden
     */
    var Euclidean3 = /** @class */ (function () {
        function Euclidean3() {
        }
        Euclidean3.prototype.a = function (mv) {
            return mv.a;
        };
        Euclidean3.prototype.add = function (lhs, rhs) {
            return lhs.add(rhs);
        };
        Euclidean3.prototype.addVector = function (lhs, rhs) {
            return lhs.addVector(rhs);
        };
        Euclidean3.prototype.applyMatrix = function (mv, matrix) {
            throw new Error("applyMatrix(mv, matrix) method not implemented.");
        };
        Euclidean3.prototype.clone = function (source) {
            return source.clone();
        };
        Euclidean3.prototype.copy = function (source, target) {
            return target.copy(source);
        };
        Euclidean3.prototype.copyBivector = function (source, target) {
            return target.copyBivector(source);
        };
        Euclidean3.prototype.copyMatrix = function (m) {
            if (m.dimensions !== 3) {
                throw new Error("matrix dimensions must be 3.");
            }
            return new Mat3(m);
        };
        Euclidean3.prototype.copyVector = function (source, target) {
            return target.copyVector(source);
        };
        Euclidean3.prototype.copyScalar = function (a, uom, target) {
            return target.copyScalar(a, uom);
        };
        Euclidean3.prototype.createForce = function (body) {
            return new Force3(body);
        };
        Euclidean3.prototype.createTorque = function (body) {
            return new Torque3(body);
        };
        Euclidean3.prototype.direction = function (mv) {
            return mv.direction();
        };
        Euclidean3.prototype.divByScalar = function (lhs, a, uom) {
            return lhs.divByScalar(a, uom);
        };
        Euclidean3.prototype.identityMatrix = function () {
            return new Mat3(Matrix3.one());
        };
        Euclidean3.prototype.invertMatrix = function (m) {
            var I = Matrix3.zero().copy(m).inv();
            return new Mat3(I);
        };
        Euclidean3.prototype.isBivector = function (mv) {
            return mv.isBivector();
        };
        Euclidean3.prototype.isScalar = function (mv) {
            return mv.isScalar();
        };
        Euclidean3.prototype.isSpinor = function (mv) {
            return mv.isSpinor();
        };
        Euclidean3.prototype.isVector = function (mv) {
            return mv.isVector();
        };
        Euclidean3.prototype.isZero = function (mv) {
            return mv.isZero();
        };
        Euclidean3.prototype.lock = function (mv) {
            return mv.lock();
        };
        Euclidean3.prototype.norm = function (mv) {
            return mv.magnitude();
        };
        Euclidean3.prototype.mul = function (lhs, rhs) {
            return lhs.mul(rhs);
        };
        Euclidean3.prototype.mulByNumber = function (lhs, alpha) {
            return lhs.mulByNumber(alpha);
        };
        Euclidean3.prototype.mulByScalar = function (lhs, a, uom) {
            return lhs.mulByScalar(a, uom);
        };
        Euclidean3.prototype.mulByVector = function (lhs, rhs) {
            return lhs.mulByVector(rhs);
        };
        Euclidean3.prototype.neg = function (mv) {
            return mv.neg();
        };
        Euclidean3.prototype.quad = function (mv) {
            return mv.quaditude();
        };
        Euclidean3.prototype.rev = function (mv) {
            return mv.rev();
        };
        Euclidean3.prototype.rotate = function (mv, spinor) {
            return mv.rotate(spinor);
        };
        Euclidean3.prototype.scalar = function (a, uom) {
            return Geometric3.scalar(a, uom);
        };
        Euclidean3.prototype.scp = function (lhs, rhs) {
            return lhs.scp(rhs);
        };
        Euclidean3.prototype.setUom = function (mv, uom) {
            mv.uom = uom;
        };
        Euclidean3.prototype.sub = function (lhs, rhs) {
            // TODO: Could generalize to subtracting a fraction...
            return lhs.sub(rhs);
        };
        Euclidean3.prototype.subScalar = function (lhs, rhs) {
            // TODO: Could generalize to subtracting a fraction...
            return lhs.subScalar(rhs.a, rhs.uom);
        };
        Euclidean3.prototype.subVector = function (lhs, rhs) {
            // TODO: Could generalize to subtracting a fraction...
            return lhs.subVector(rhs);
        };
        Euclidean3.prototype.unlock = function (mv, token) {
            mv.unlock(token);
        };
        Euclidean3.prototype.uom = function (mv) {
            return mv.uom;
        };
        Euclidean3.prototype.ext = function (lhs, rhs) {
            return lhs.ext(rhs);
        };
        Euclidean3.prototype.write = function (source, target) {
            source.write(target);
        };
        Euclidean3.prototype.writeVector = function (source, target) {
            source.writeVector(target);
        };
        Euclidean3.prototype.writeBivector = function (source, target) {
            source.writeBivector(target);
        };
        Euclidean3.prototype.zero = function () {
            return Geometric3.zero.clone();
        };
        return Euclidean3;
    }());

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * A rectangular block of constant density.
     */
    var Block3 = /** @class */ (function (_super) {
        __extends(Block3, _super);
        /**
         *
         */
        function Block3(width, height, depth) {
            if (width === void 0) { width = Geometric3.one; }
            if (height === void 0) { height = Geometric3.one; }
            if (depth === void 0) { depth = Geometric3.one; }
            var _this = _super.call(this, new Euclidean3()) || this;
            if (!(width instanceof Geometric3)) {
                throw new Error("width must be a Geometric3.");
            }
            if (!(height instanceof Geometric3)) {
                throw new Error("height must be a Geometric3.");
            }
            if (!(depth instanceof Geometric3)) {
                throw new Error("depth must be a Geometric3.");
            }
            _this.width_ = Geometric3.copy(width);
            _this.widthLock_ = _this.width_.lock();
            _this.height_ = Geometric3.copy(height);
            _this.heightLock_ = _this.height_.lock();
            _this.depth_ = Geometric3.copy(depth);
            _this.depthLock_ = _this.depth_.lock();
            if (Unit.isOne(width.uom) && Unit.isOne(height.uom) && Unit.isOne(depth.uom)) ;
            else {
                _this.M = Geometric3.scalar(_this.M.a, Unit.KILOGRAM);
                // this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                _this.X.uom = Unit.METER;
                _this.R.uom = Unit.ONE;
                _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
                _this.L.uom = Unit.JOULE_SECOND;
            }
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Block3.prototype, "width", {
            get: function () {
                return this.width_;
            },
            set: function (width) {
                this.width_.unlock(this.widthLock_);
                this.width_.copy(width);
                this.widthLock_ = this.width_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Block3.prototype, "height", {
            get: function () {
                return this.height_;
            },
            set: function (height) {
                this.height_.unlock(this.heightLock_);
                this.height_.copy(height);
                this.heightLock_ = this.height_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Block3.prototype, "depth", {
            get: function () {
                return this.depth_;
            },
            set: function (depth) {
                this.depth_.unlock(this.depthLock_);
                this.depth_.copy(depth);
                this.depthLock_ = this.depth_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * The angular velocity is updated from the angular momentum.
         */
        Block3.prototype.updateAngularVelocity = function () {
            var w = this.width_;
            var h = this.height_;
            var d = this.depth_;
            var ww = w.a * w.a;
            var hh = h.a * h.a;
            var dd = d.a * d.a;
            var k = 12 / this.M.a;
            this.Ω.yz = k * this.L.yz / (hh + dd);
            this.Ω.zx = k * this.L.zx / (ww + dd);
            this.Ω.xy = k * this.L.xy / (ww + hh);
            this.Ω.uom = Unit.div(Unit.div(this.L.uom, this.M.uom), Unit.mul(w.uom, w.uom));
        };
        /**
         * Whenever the mass or the dimensions change, we must update the inertia tensor.
         */
        Block3.prototype.updateInertiaTensor = function () {
            var w = this.width_;
            var h = this.height_;
            var d = this.depth_;
            var ww = w.a * w.a;
            var hh = h.a * h.a;
            var dd = d.a * d.a;
            var s = this.M.a / 12;
            var Iinv = Matrix3.zero();
            Iinv.setElement(0, 0, 1 / (s * (hh + dd)));
            Iinv.setElement(1, 1, 1 / (s * (dd + ww)));
            Iinv.setElement(2, 2, 1 / (s * (ww + hh)));
            Iinv.uom = Unit.div(Unit.ONE, Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom)));
            this.Iinv = Iinv;
        };
        return Block3;
    }(RigidBody));

    var ConstantForceLaw3 = /** @class */ (function (_super) {
        __extends(ConstantForceLaw3, _super);
        function ConstantForceLaw3(body, vector, vectorCoordType) {
            if (vectorCoordType === void 0) { vectorCoordType = WORLD; }
            return _super.call(this, body, vector, vectorCoordType) || this;
        }
        return ConstantForceLaw3;
    }(ConstantForceLaw));

    var ConstantTorqueLaw3 = /** @class */ (function (_super) {
        __extends(ConstantTorqueLaw3, _super);
        function ConstantTorqueLaw3(body, value, valueCoordType) {
            return _super.call(this, body, value, valueCoordType) || this;
        }
        return ConstantTorqueLaw3;
    }(ConstantTorqueLaw));

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * A solid cylinder of uniform density.
     */
    var Cylinder3 = /** @class */ (function (_super) {
        __extends(Cylinder3, _super);
        /**
         *
         */
        function Cylinder3(radius, height) {
            if (radius === void 0) { radius = Geometric3.one; }
            if (height === void 0) { height = Geometric3.one; }
            var _this = _super.call(this, new Euclidean3()) || this;
            _this.radius_ = Geometric3.copy(radius);
            _this.radiusLock_ = _this.radius_.lock();
            _this.height_ = Geometric3.copy(height);
            _this.heightLock_ = _this.height_.lock();
            if (Unit.isOne(radius.uom) && Unit.isOne(height.uom)) ;
            else {
                _this.M = Geometric3.scalar(_this.M.a, Unit.KILOGRAM);
                _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                _this.X.uom = Unit.METER;
                _this.R.uom = Unit.ONE;
                _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
                _this.L.uom = Unit.JOULE_SECOND;
            }
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Cylinder3.prototype, "radius", {
            get: function () {
                return this.radius_;
            },
            set: function (radius) {
                this.radius_.unlock(this.radiusLock_);
                this.radius_.copy(radius);
                this.radiusLock_ = this.radius_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Cylinder3.prototype, "height", {
            get: function () {
                return this.height_;
            },
            set: function (height) {
                this.height.unlock(this.heightLock_);
                this.height_.copy(height);
                this.heightLock_ = this.height_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Whenever the mass or the dimensions change, we must update the inertia tensor.
         */
        Cylinder3.prototype.updateInertiaTensor = function () {
            var r = this.radius_;
            var h = this.height_;
            var rr = r.a * r.a;
            var hh = h.a * h.a;
            var Irr = this.M.a * (3 * rr + hh) / 12;
            var Ihh = this.M.a * rr / 2;
            var Iinv = Matrix3.zero();
            Iinv.setElement(0, 0, 1 / Irr);
            Iinv.setElement(1, 1, 1 / Ihh);
            Iinv.setElement(2, 2, 1 / Irr);
            Iinv.uom = Unit.div(Unit.ONE, Unit.mul(this.M.uom, Unit.mul(r.uom, h.uom)));
            this.Iinv = Iinv;
        };
        return Cylinder3;
    }(RigidBody));

    function wedgeYZ(a, b) {
        return a.y * b.z - a.z * b.y;
    }
    function wedgeZX(a, b) {
        return a.z * b.x - a.x * b.z;
    }
    function wedgeXY(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    /**
     * @hidden
     */
    var INDEX_TOTAL_LINEAR_MOMENTUM_X = INDEX_RESERVED_LAST + 1;
    /**
     * @hidden
     */
    var INDEX_TOTAL_LINEAR_MOMENTUM_Y = INDEX_RESERVED_LAST + 2;
    /**
     * @hidden
     */
    var INDEX_TOTAL_LINEAR_MOMENTUM_Z = INDEX_RESERVED_LAST + 3;
    /**
     * @hidden
     */
    var INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = INDEX_RESERVED_LAST + 4;
    /**
     * @hidden
     */
    var INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = INDEX_RESERVED_LAST + 5;
    /**
     * @hidden
     */
    var INDEX_TOTAL_ANGULAR_MOMENTUM_XY = INDEX_RESERVED_LAST + 6;
    /**
     * @hidden
     */
    var OFFSET_POSITION_X = 0;
    /**
     * @hidden
     */
    var OFFSET_POSITION_Y = 1;
    /**
     * @hidden
     */
    var OFFSET_POSITION_Z = 2;
    /**
     * @hidden
     */
    var OFFSET_ATTITUDE_A = 3;
    /**
     * @hidden
     */
    var OFFSET_ATTITUDE_YZ = 4;
    /**
     * @hidden
     */
    var OFFSET_ATTITUDE_ZX = 5;
    /**
     * @hidden
     */
    var OFFSET_ATTITUDE_XY = 6;
    /**
     * @hidden
     */
    var OFFSET_LINEAR_MOMENTUM_X = 7;
    /**
     * @hidden
     */
    var OFFSET_LINEAR_MOMENTUM_Y = 8;
    /**
     * @hidden
     */
    var OFFSET_LINEAR_MOMENTUM_Z = 9;
    /**
     * @hidden
     */
    var OFFSET_ANGULAR_MOMENTUM_YZ = 10;
    /**
     * @hidden
     */
    var OFFSET_ANGULAR_MOMENTUM_ZX = 11;
    /**
     * @hidden
     */
    var OFFSET_ANGULAR_MOMENTUM_XY = 12;
    /**
     * @hidden
     */
    var varNames = [
        VarsList.TIME,
        "translational kinetic energy",
        "rotational kinetic energy",
        "potential energy",
        "total energy",
        "total linear momentum - x",
        "total linear momentum - y",
        "total linear momentum - z",
        "total angular momentum - yz",
        "total angular momentum - zx",
        "total angular momentum - xy"
    ];
    /**
     * @hidden
     */
    var DISCONTINUOUS_ENERGY_VARIABLES = [
        INDEX_TRANSLATIONAL_KINETIC_ENERGY,
        INDEX_ROTATIONAL_KINETIC_ENERGY,
        INDEX_POTENTIAL_ENERGY,
        INDEX_TOTAL_ENERGY,
        INDEX_TOTAL_LINEAR_MOMENTUM_X,
        INDEX_TOTAL_LINEAR_MOMENTUM_Y,
        INDEX_TOTAL_LINEAR_MOMENTUM_Z,
        INDEX_TOTAL_ANGULAR_MOMENTUM_YZ,
        INDEX_TOTAL_ANGULAR_MOMENTUM_ZX,
        INDEX_TOTAL_ANGULAR_MOMENTUM_XY
    ];
    /**
     * @hidden
     */
    var Dynamics3 = /** @class */ (function () {
        function Dynamics3() {
        }
        Dynamics3.prototype.numVarsPerBody = function () {
            return 13;
        };
        Dynamics3.prototype.getVarNames = function () {
            return varNames;
        };
        Dynamics3.prototype.getOffsetName = function (offset) {
            switch (offset) {
                case OFFSET_POSITION_X: return "position x";
                case OFFSET_POSITION_Y: return "position y";
                case OFFSET_POSITION_Z: return "position z";
                case OFFSET_ATTITUDE_A: return "attitude a";
                case OFFSET_ATTITUDE_YZ: return "attitude yz";
                case OFFSET_ATTITUDE_ZX: return "attitude zx";
                case OFFSET_ATTITUDE_XY: return "attitude xy";
                case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
                case OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
                case OFFSET_LINEAR_MOMENTUM_Z: return "linear momentum z";
                case OFFSET_ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
                case OFFSET_ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
                case OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
            }
            throw new Error("getVarName(" + offset + ")");
        };
        Dynamics3.prototype.discontinuousEnergyVars = function () {
            return DISCONTINUOUS_ENERGY_VARIABLES;
        };
        Dynamics3.prototype.epilog = function (bodies, forceLaws, potentialOffset, varsList) {
            // update the variables that track energy
            var pe = potentialOffset.a;
            var re = 0;
            var te = 0;
            // update the variable that track linear momentum (vector)
            var Px = 0;
            var Py = 0;
            var Pz = 0;
            // update the variable that track angular momentum (bivector)
            var Lyz = 0;
            var Lzx = 0;
            var Lxy = 0;
            var bs = bodies;
            var Nb = bs.length;
            for (var i = 0; i < Nb; i++) {
                var b = bs[i];
                if (isFinite(b.M.a)) {
                    re += b.rotationalEnergy().a;
                    te += b.translationalEnergy().a;
                    // linear momentum
                    Px += b.P.x;
                    Py += b.P.y;
                    Pz += b.P.z;
                    // orbital angular momentum
                    Lyz += wedgeYZ(b.X, b.P);
                    Lzx += wedgeZX(b.X, b.P);
                    Lxy += wedgeXY(b.X, b.P);
                    // spin angular momentum
                    Lyz += b.L.yz;
                    Lzx += b.L.zx;
                    Lxy += b.L.xy;
                }
            }
            var fs = forceLaws;
            var Nf = fs.length;
            for (var i = 0; i < Nf; i++) {
                pe += fs[i].potentialEnergy().a;
            }
            varsList.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
            // TODO: varsList.setUnit(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te); etc
            varsList.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
            varsList.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
            varsList.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
            varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px);
            varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py);
            varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz);
            varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz);
            varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx);
            varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy);
        };
        Dynamics3.prototype.updateVarsFromBody = function (body, idx, vars) {
            vars.setValueJump(OFFSET_POSITION_X + idx, body.X.x);
            vars.setValueJump(OFFSET_POSITION_Y + idx, body.X.y);
            vars.setValueJump(OFFSET_POSITION_Z + idx, body.X.z);
            vars.setUnit(OFFSET_POSITION_X + idx, body.X.uom);
            vars.setUnit(OFFSET_POSITION_Y + idx, body.X.uom);
            vars.setUnit(OFFSET_POSITION_Z + idx, body.X.uom);
            vars.setValueJump(OFFSET_ATTITUDE_A + idx, body.R.a);
            vars.setValueJump(OFFSET_ATTITUDE_XY + idx, body.R.xy);
            vars.setValueJump(OFFSET_ATTITUDE_YZ + idx, body.R.yz);
            vars.setValueJump(OFFSET_ATTITUDE_ZX + idx, body.R.zx);
            vars.setUnit(OFFSET_ATTITUDE_A + idx, body.R.uom);
            vars.setUnit(OFFSET_ATTITUDE_XY + idx, body.R.uom);
            vars.setUnit(OFFSET_ATTITUDE_YZ + idx, body.R.uom);
            vars.setUnit(OFFSET_ATTITUDE_ZX + idx, body.R.uom);
            vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
            vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
            vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);
            vars.setUnit(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.uom);
            vars.setUnit(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.uom);
            vars.setUnit(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.uom);
            vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
            vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
            vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
            vars.setUnit(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.uom);
            vars.setUnit(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.uom);
            vars.setUnit(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.uom);
        };
        Dynamics3.prototype.addForceToRateOfChangeLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, force, uomTime) {
            var Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
            if (Fx !== 0) {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X], force.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
            }
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = Fx + force.x;
            var Fy = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
            if (Fy !== 0) {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y], force.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
            }
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = Fy + force.y;
            var Fz = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z];
            if (Fz !== 0) {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z], force.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.uom;
            }
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z] = Fz + force.z;
        };
        Dynamics3.prototype.getForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
            force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
            force.y = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
            force.z = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z];
            force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X];
        };
        Dynamics3.prototype.setForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = force.x;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.y;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.z;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.uom;
        };
        Dynamics3.prototype.addTorqueToRateOfChangeAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, torque, uomTime) {
            var Tyz = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_YZ];
            if (Tyz !== 0) {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ], torque.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = torque.uom;
            }
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = Tyz + torque.yz;
            var Tzx = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_ZX];
            if (Tzx !== 0) {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX], torque.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = torque.uom;
            }
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = Tzx + torque.zx;
            var Txy = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY];
            if (Txy !== 0) {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY], torque.uom);
            }
            else {
                rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = torque.uom;
            }
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Txy + torque.xy;
        };
        Dynamics3.prototype.updateBodyFromVars = function (vars, units, idx, body, uomTime) {
            body.X.x = vars[idx + OFFSET_POSITION_X];
            body.X.y = vars[idx + OFFSET_POSITION_Y];
            body.X.z = vars[idx + OFFSET_POSITION_Z];
            body.X.uom = units[idx + OFFSET_POSITION_X];
            body.R.a = vars[idx + OFFSET_ATTITUDE_A];
            body.R.xy = vars[idx + OFFSET_ATTITUDE_XY];
            body.R.yz = vars[idx + OFFSET_ATTITUDE_YZ];
            body.R.zx = vars[idx + OFFSET_ATTITUDE_ZX];
            // We will only use one of the following units. Check them all for integrity.
            checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_A], uomTime);
            checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_XY], uomTime);
            checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_YZ], uomTime);
            checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_ZX], uomTime);
            body.R.uom = units[idx + OFFSET_ATTITUDE_A];
            // Keep the magnitude of the attitude as close to 1 as possible.
            var R = body.R;
            var magR = Math.sqrt(R.a * R.a + R.xy * R.xy + R.yz * R.yz + R.zx * R.zx);
            body.R.a = body.R.a / magR;
            body.R.xy = body.R.xy / magR;
            body.R.yz = body.R.yz / magR;
            body.R.zx = body.R.zx / magR;
            body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
            body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
            body.P.z = vars[idx + OFFSET_LINEAR_MOMENTUM_Z];
            body.P.uom = units[idx + OFFSET_LINEAR_MOMENTUM_X];
            body.L.xy = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
            body.L.yz = vars[idx + OFFSET_ANGULAR_MOMENTUM_YZ];
            body.L.zx = vars[idx + OFFSET_ANGULAR_MOMENTUM_ZX];
            body.L.uom = units[idx + OFFSET_ANGULAR_MOMENTUM_XY];
            body.updateAngularVelocity();
        };
        Dynamics3.prototype.setPositionRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
            // The rate of change of position is the velocity.
            // dX/dt = V = P / M
            var P = body.P;
            var M = body.M;
            var m = M.a;
            rateOfChangeVals[idx + OFFSET_POSITION_X] = P.x / m;
            rateOfChangeVals[idx + OFFSET_POSITION_Y] = P.y / m;
            rateOfChangeVals[idx + OFFSET_POSITION_Z] = P.z / m;
            var uom = Unit.div(P.uom, M.uom);
            rateOfChangeUoms[idx + OFFSET_POSITION_X] = uom;
            rateOfChangeUoms[idx + OFFSET_POSITION_Y] = uom;
            rateOfChangeUoms[idx + OFFSET_POSITION_Z] = uom;
        };
        Dynamics3.prototype.setAttitudeRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
            // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
            // requiring the geometric product of Ω and R.
            // Ω and R are auxiliary and primary variables that have already been computed.
            var R = body.R;
            var Ω = body.Ω;
            rateOfChangeVals[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
            rateOfChangeVals[idx + OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
            rateOfChangeVals[idx + OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
            rateOfChangeVals[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
            var uom = Unit.mul(Ω.uom, R.uom);
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = uom;
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_YZ] = uom;
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_ZX] = uom;
            rateOfChangeUoms[idx + OFFSET_ATTITUDE_XY] = uom;
        };
        Dynamics3.prototype.zeroLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var P = body.P;
            var uom = Unit.div(P.uom, uomTime);
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = uom;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = uom;
            rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z] = 0;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = uom;
        };
        Dynamics3.prototype.zeroAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
            var L = body.L;
            var uom = Unit.div(L.uom, uomTime);
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = uom;
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = uom;
            rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = uom;
        };
        return Dynamics3;
    }());

    /**
     *
     */
    var Engine3 = /** @class */ (function (_super) {
        __extends(Engine3, _super);
        function Engine3(options) {
            return _super.call(this, new Euclidean3(), new Dynamics3(), options) || this;
        }
        return Engine3;
    }(Engine));

    var GravitationForceLaw3 = /** @class */ (function (_super) {
        __extends(GravitationForceLaw3, _super);
        function GravitationForceLaw3(body1, body2) {
            return _super.call(this, body1, body2, Geometric3.one) || this;
        }
        return GravitationForceLaw3;
    }(GravitationLaw));

    /**
     *
     */
    var LinearDamper3 = /** @class */ (function (_super) {
        __extends(LinearDamper3, _super);
        function LinearDamper3(body1, body2) {
            return _super.call(this, body1, body2) || this;
        }
        return LinearDamper3;
    }(LinearDamper));

    var Particle3 = /** @class */ (function (_super) {
        __extends(Particle3, _super);
        function Particle3(mass, charge) {
            return _super.call(this, mass, charge, new Euclidean3()) || this;
        }
        return Particle3;
    }(Particle));

    /**
     *
     */
    var Physics3 = /** @class */ (function (_super) {
        __extends(Physics3, _super);
        function Physics3() {
            return _super.call(this, new Euclidean3(), new Dynamics3()) || this;
        }
        return Physics3;
    }(Physics));

    /**
     *
     */
    var RigidBody3 = /** @class */ (function (_super) {
        __extends(RigidBody3, _super);
        function RigidBody3() {
            return _super.call(this, new Euclidean3()) || this;
        }
        return RigidBody3;
    }(RigidBody));

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * A solid sphere of constant density.
     */
    var Sphere3 = /** @class */ (function (_super) {
        __extends(Sphere3, _super);
        /**
         *
         */
        function Sphere3(radius) {
            if (radius === void 0) { radius = Geometric3.one; }
            var _this = _super.call(this, new Euclidean3()) || this;
            _this.radius_ = Geometric3.fromScalar(radius);
            _this.radiusLock_ = _this.radius_.lock();
            if (Unit.isOne(radius.uom)) ;
            else {
                _this.M = Geometric3.scalar(_this.M.a, Unit.KILOGRAM);
                _this.Iinv.uom = Unit.div(Unit.ONE, Unit.KILOGRAM_METER_SQUARED);
                _this.X.uom = Unit.METER;
                _this.R.uom = Unit.ONE;
                _this.P.uom = Unit.KILOGRAM_METER_PER_SECOND;
                _this.L.uom = Unit.JOULE_SECOND;
            }
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Sphere3.prototype, "radius", {
            get: function () {
                return this.radius_;
            },
            set: function (radius) {
                this.radius_.unlock(this.radiusLock_);
                this.radius_.copyScalar(radius.a, radius.uom);
                this.radiusLock_ = this.radius_.lock();
                this.updateInertiaTensor();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * L(Ω) = (2 M r r / 5) Ω => Ω = (5 / 2 M r r) L(Ω)
         */
        Sphere3.prototype.updateAngularVelocity = function () {
            this.Ω.copyScalar(this.radius_.a, this.radius_.uom); // Ω = r (scalar)    
            this.Ω.quaditude(); // Ω = r * r (scalar)
            this.Ω.mulByScalar(this.M.a, this.M.uom); // Ω = r * r * M = M * r * r (scalar)
            this.Ω.mulByNumber(2 / 5); // Ω = 2 * M * r * r / 5 (scalar)
            this.Ω.inv(); // Ω = 5 / (2 * M * r * r) (scalar)
            this.Ω.mulByBivector(this.L); // Ω = 5 * L / (2 * M * r * r) (bivector)
        };
        /**
         * Whenever the mass or the dimensions change, we must update the inertia tensor.
         */
        Sphere3.prototype.updateInertiaTensor = function () {
            var r = this.radius_;
            var s = 2 * this.M.a * r.a * r.a / 5;
            var Iinv = Matrix3.zero();
            Iinv.setElement(0, 0, 1 / s);
            Iinv.setElement(1, 1, 1 / s);
            Iinv.setElement(2, 2, 1 / s);
            Iinv.uom = Unit.div(Unit.ONE, Unit.mul(this.M.uom, Unit.mul(r.uom, r.uom)));
            this.Iinv = Iinv;
        };
        return Sphere3;
    }(RigidBody));

    /**
     *
     */
    var Spring3 = /** @class */ (function (_super) {
        __extends(Spring3, _super);
        function Spring3(body1, body2) {
            return _super.call(this, body1, body2) || this;
        }
        return Spring3;
    }(Spring));

    var SurfaceConstraint3 = /** @class */ (function (_super) {
        __extends(SurfaceConstraint3, _super);
        function SurfaceConstraint3(body, radiusFn, rotationFn, tangentFn) {
            return _super.call(this, body, radiusFn, rotationFn, tangentFn) || this;
        }
        return SurfaceConstraint3;
    }(SurfaceConstraint));

    /**
     * @hidden
     */
    exports.AxisChoice = void 0;
    (function (AxisChoice) {
        AxisChoice[AxisChoice["HORIZONTAL"] = 1] = "HORIZONTAL";
        AxisChoice[AxisChoice["VERTICAL"] = 2] = "VERTICAL";
        AxisChoice[AxisChoice["BOTH"] = 3] = "BOTH";
    })(exports.AxisChoice || (exports.AxisChoice = {}));

    /**
     * Returns an array consisting of the given `value` repeated `N` times.
     * @hidden
     */
    function repeat(value, N) {
        var xs = [];
        for (var i = 0; i < N; i++) {
            xs[i] = value;
        }
        return xs;
    }

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
    exports.DrawingMode = void 0;
    (function (DrawingMode) {
        DrawingMode[DrawingMode["DOTS"] = 0] = "DOTS";
        DrawingMode[DrawingMode["LINES"] = 1] = "LINES";
    })(exports.DrawingMode || (exports.DrawingMode = {}));

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
     * @param arg1
     * @param arg2
     * @param epsilon
     * @param magnitude
     * @returns
     */
    function veryDifferent(arg1, arg2, epsilon, magnitude) {
        if (epsilon === void 0) { epsilon = 1E-14; }
        if (magnitude === void 0) { magnitude = 1; }
        if (epsilon <= 0) {
            throw new Error("epsilon (" + epsilon + ") must be positive.");
        }
        if (magnitude <= 0) {
            throw new Error("magnitude (" + magnitude + ") must be positive.");
        }
        var maxArg = Math.max(Math.abs(arg1), Math.abs(arg2));
        var max = maxArg > magnitude ? maxArg : magnitude;
        return Math.abs(arg1 - arg2) > max * epsilon;
    }

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * An immutable rectangle corresponding to screen coordinates where the
     * vertical coordinates increase downwards.
     * @hidden
     */
    var ScreenRect = /** @class */ (function () {
        /**
         *
         */
        function ScreenRect(left, top_, width, height) {
            if (width < 0 || height < 0) {
                throw new Error();
            }
            this.left_ = left;
            this.top_ = top_;
            this.width_ = width;
            this.height_ = height;
        }
        /**
         * Returns a copy of the given ScreenRect.
         * @param rect the ScreenRect to clone
         * @return a copy of `rect`
         */
        ScreenRect.clone = function (rect) {
            return new ScreenRect(rect.left_, rect.top_, rect.width_, rect.height_);
        };
        /**
         * Returns true if this ScreenRect is exactly equal to the other ScreenRect.
         * @param otherRect the ScreenRect to compare to
         * @return true if this ScreenRect is exactly equal to the other ScreenRect
         */
        ScreenRect.prototype.equals = function (otherRect) {
            return this.left_ === otherRect.left_ &&
                this.top_ === otherRect.top_ &&
                this.width_ === otherRect.width_ &&
                this.height_ === otherRect.height_;
        };
        /**
         * Returns true if the object is likely a ScreenRect. Only works under simple
         * compilation, intended for interactive non-compiled code.
         * @param obj the object of interest
         * @return true if the object is likely a ScreenRect
         */
        ScreenRect.isDuckType = function (obj) {
            if (obj instanceof ScreenRect) {
                return true;
            }
            return obj.getLeft !== undefined
                && obj.getTop !== undefined
                && obj.getWidth !== undefined
                && obj.getHeight !== undefined
                && obj.isEmpty !== undefined
                && obj.equals !== undefined
                && obj.nearEqual !== undefined;
        };
        /**
         * The horizontal coordinate of this ScreenRect center.
         * @return the horizontal coordinate of this ScreenRect center
         */
        ScreenRect.prototype.getCenterX = function () {
            return this.left_ + this.width_ / 2;
        };
        /**
         * The vertical coordinate of this ScreenRect center
         * @return the vertical coordinate of this ScreenRect center
         */
        ScreenRect.prototype.getCenterY = function () {
            return this.top_ + this.height_ / 2;
        };
        /**
         * The height of this ScreenRect.
         * @return the height of this ScreenRect.
         */
        ScreenRect.prototype.getHeight = function () {
            return this.height_;
        };
        /**
         * The left coordinate of this ScreenRect.
         * @return the left coordinate of this ScreenRect.
         */
        ScreenRect.prototype.getLeft = function () {
            return this.left_;
        };
        /**
         * The top coordinate of this ScreenRect.
         * @return the top coordinate of this ScreenRect
         */
        ScreenRect.prototype.getTop = function () {
            return this.top_;
        };
        /**
         * The width of this ScreenRect.
         * @return the width of this ScreenRect.
         */
        ScreenRect.prototype.getWidth = function () {
            return this.width_;
        };
        /**
         * Returns true if this ScreenRect has zero width or height, within the tolerance
         * @param tolerance tolerance for comparison, default is 1E-14;
         */
        ScreenRect.prototype.isEmpty = function (tolerance) {
            if (tolerance === void 0) { tolerance = 1E-14; }
            return this.width_ < tolerance || this.height_ < tolerance;
        };
        /**
         * Creates an oval path in the Canvas context, with the size of this ScreenRect.
         * @param context the Canvas context to draw into
         */
        ScreenRect.prototype.makeOval = function (context) {
            var w = this.width_ / 2;
            var h = this.height_ / 2;
            if (typeof context.ellipse === 'function') {
                context.beginPath();
                context.moveTo(this.left_ + this.width_, this.top_ + h);
                // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
                context.ellipse(this.left_ + w, this.top_ + h, w, h, 0, 0, 2 * Math.PI, false);
            }
            else {
                // If ellipse() is not defined, draw a circle instead
                var min = Math.min(w, h);
                context.beginPath();
                context.moveTo(this.left_ + this.width_, this.top_);
                // arc(x, y, radius, startAngle, endAngle, anticlockwise);
                context.arc(this.left_ + w, this.top_ + h, min, 0, 2 * Math.PI, false);
                context.closePath();
            }
        };
        /**
         * Creates a rectangle path in the Canvas context, with the size of this ScreenRect.
         * @param context the Canvas context to draw into
         */
        ScreenRect.prototype.makeRect = function (context) {
            context.rect(this.left_, this.top_, this.width_, this.height_);
        };
        /**
         * Returns true if this ScreenRect is nearly equal to another ScreenRect.
         * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
         * used depends on the magnitude of the numbers being compared.
         * @param otherRect  the ScreenRect to compare to
         * @param opt_tolerance optional tolerance for comparison
         * @return true if this ScreenRect is nearly equal to the other ScreenRect
         */
        ScreenRect.prototype.nearEqual = function (otherRect, opt_tolerance) {
            if (veryDifferent(this.left_, otherRect.left_, opt_tolerance)) {
                return false;
            }
            if (veryDifferent(this.top_, otherRect.top_, opt_tolerance)) {
                return false;
            }
            if (veryDifferent(this.width_, otherRect.width_, opt_tolerance)) {
                return false;
            }
            if (veryDifferent(this.height_, otherRect.height_, opt_tolerance)) {
                return false;
            }
            return true;
        };
        /**
         * An empty ScreenRect located at the origin.
         */
        ScreenRect.EMPTY_RECT = new ScreenRect(0, 0, 0, 0);
        return ScreenRect;
    }());

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
    var UtilityCore = /** @class */ (function () {
        function UtilityCore() {
        }
        /**
         * Maximum representable integer.
         * Need to avoid having an index ever reach this value because we can then
         * no longer increment by 1.
         * That is:  2^53 + 1 == 2^53 because of how floating point works.
         */
        UtilityCore.MAX_INTEGER = Math.pow(2, 53);
        return UtilityCore;
    }());

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var MAX_INDEX_ERROR = 'exceeded max int';
    /**
     * @hidden
     */
    var CircularList = /** @class */ (function () {
        /**
         * last value written to memory list
         */
        // private lastValue_: T;
        /**
         *
         */
        function CircularList(capacity) {
            if (capacity === void 0) { capacity = 3000; }
            /**
             * number of items now in memory list <= capacity
             */
            this.size_ = 0;
            /**
             * number of times the list has been overwritten
             */
            this.cycles_ = 0;
            /**
             * pointer to next entry in list;  oldest entry if list has wrapped around.
             */
            this.nextPtr_ = 0;
            /**
             * pointer to newest entry: index of last entry written to list or -1 if never written.
             */
            this.lastPtr_ = -1;
            this.capacity_ = capacity || 3000;
            if (this.capacity_ < 2) {
                throw new Error();
            }
            this.size_ = 0;
            this.cycles_ = 0;
            this.nextPtr_ = 0;
            this.lastPtr_ = -1;
            this.values_ = new Array(this.capacity_);
            // this.lastValue_ = null;
        }
        /**
         * Causes the MAX_INDEX_ERROR exception to occur in near future by setting
         * the number of cycles to be near the maximum allowed, for testing.
         */
        CircularList.prototype.causeMaxIntError = function () {
            this.size_ = this.capacity_;
            this.cycles_ = Math.floor(UtilityCore.MAX_INTEGER / this.capacity_) - 1;
        };
        /**
         *
         */
        CircularList.prototype.getEndIndex = function () {
            if (this.size_ === 0) {
                return -1;
            }
            var idx;
            if (this.nextPtr_ === 0)
                idx = this.pointerToIndex(this.size_ - 1);
            else
                idx = this.pointerToIndex(this.nextPtr_ - 1);
            return idx;
        };
        /**
         *
         */
        CircularList.prototype.getEndValue = function () {
            var idx = this.getEndIndex();
            return idx === -1 ? null : this.values_[this.indexToPointer_(idx)];
        };
        /**
         *
         */
        CircularList.prototype.getIterator = function (index) {
            return new CircularListIterator(this, index);
        };
        CircularList.prototype.getSize = function () {
            return this.size_;
        };
        CircularList.prototype.getStartIndex = function () {
            var idx = (this.size_ < this.capacity_) ? 0 : this.pointerToIndex(this.nextPtr_);
            return idx;
        };
        CircularList.prototype.getValue = function (index) {
            var i = this.indexToPointer_(index);
            return this.values_[i];
        };
        /**
         * Converts an index (which includes cycles) into a pointer.
         * Pointer and index are the same until the list fills and 'wraps around'.
         * @param index the index number, which can be larger than the size of the list
         * @return the pointer to the corresponding point in the list
         */
        CircularList.prototype.indexToPointer_ = function (index) {
            if (this.size_ < this.capacity_)
                return index;
            var p = index % this.capacity_;
            var idx = index - (this.cycles_ - (p < this.nextPtr_ ? 0 : 1)) * this.capacity_;
            return idx;
        };
        /**
         * Converts a pointer into the list to an index number that includes cycles.
         * Pointer and index are the same until the list fills and 'wraps around'.
         * @throws when the index number exceeds the maximum representable integer
         * @param pointer an index from 0 to size
         * @return the index number of this point including cycles
         */
        CircularList.prototype.pointerToIndex = function (pointer) {
            if (this.size_ < this.capacity_)
                return pointer;
            var idx = pointer +
                (this.cycles_ - (pointer < this.nextPtr_ ? 0 : 1)) * this.capacity_;
            if (idx >= UtilityCore.MAX_INTEGER)
                throw new Error(MAX_INDEX_ERROR);
            return idx;
        };
        CircularList.prototype.reset = function () {
            this.nextPtr_ = this.size_ = 0; // clear out the memory
            this.cycles_ = 0;
            this.lastPtr_ = -1;
        };
        CircularList.prototype.store = function (value) {
            this.lastPtr_ = this.nextPtr_;
            this.values_[this.nextPtr_] = value;
            this.nextPtr_++;
            if (this.size_ < this.capacity_)
                this.size_++;
            if (this.nextPtr_ >= this.capacity_) { // wrap around at end
                this.cycles_++;
                this.nextPtr_ = 0;
            }
            return this.pointerToIndex(this.lastPtr_);
        };
        return CircularList;
    }());
    /**
     * @hidden
     */
    var CircularListIterator = /** @class */ (function () {
        /**
         * @param cList the CircularList to iterate over
         * @param startIndex  the index to start the iteration at; undefined or -1 will start at oldest entry
         */
        function CircularListIterator(cList, startIndex) {
            this.first_ = cList.size_ > 0;
            this.cList_ = cList;
            if (startIndex === undefined || startIndex < 0) {
                startIndex = cList.getStartIndex();
            }
            // Allow making iterator on empty CircularList, but if non-empty require the starting
            // index to be in range.
            if (cList.size_ > 0 &&
                (startIndex < cList.getStartIndex() || startIndex > cList.getEndIndex())) {
                throw new Error('out of range startIndex=' + startIndex);
            }
            this.index_ = startIndex;
            this.pointer_ = cList.indexToPointer_(startIndex);
        }
        CircularListIterator.prototype.getIndex = function () {
            if (this.cList_.size_ === 0) {
                throw new Error('no data');
            }
            return this.index_;
        };
        CircularListIterator.prototype.getValue = function () {
            if (this.cList_.size_ === 0) {
                throw new Error('no data');
            }
            return this.cList_.values_[this.pointer_];
        };
        CircularListIterator.prototype.hasNext = function () {
            return this.first_ || this.index_ < this.cList_.getEndIndex();
        };
        CircularListIterator.prototype.hasPrevious = function () {
            return this.first_ || this.index_ > this.cList_.getStartIndex();
        };
        CircularListIterator.prototype.nextValue = function () {
            if (this.cList_.size_ === 0)
                throw new Error('no data');
            if (this.first_) {
                // first 'nextPoint' does nothing except clear this flag
                this.first_ = false;
            }
            else {
                if (this.index_ + 1 > this.cList_.getEndIndex()) {
                    throw new Error('cannot iterate past end of list');
                }
                this.index_++;
                this.pointer_ = this.cList_.indexToPointer_(this.index_);
            }
            return this.cList_.values_[this.pointer_];
        };
        CircularListIterator.prototype.previousValue = function () {
            if (this.cList_.size_ === 0)
                throw new Error('no data');
            if (this.first_) {
                // first 'previousPoint' does nothing except clear this flag
                this.first_ = false;
            }
            else {
                if (this.index_ - 1 < this.cList_.getStartIndex()) {
                    throw new Error('cannot iterate prior to start of list');
                }
                this.index_--;
                this.pointer_ = this.cList_.indexToPointer_(this.index_);
            }
            return this.cList_.values_[this.pointer_];
        };
        return CircularListIterator;
    }());

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
    var GraphPoint = /** @class */ (function () {
        function GraphPoint(x, y, seqX, seqY) {
            this.x = x;
            this.y = y;
            this.seqX = seqX;
            this.seqY = seqY;
        }
        /**
         * Returns whether this GraphPoint is identical to another GraphPoint
         * @param other the GraphPoint to compare with
         * @return `true` if this GraphPoint is identical to the other GraphPoint
         */
        GraphPoint.prototype.equals = function (other) {
            return this.x === other.x && this.y === other.y && this.seqX === other.seqX && this.seqY === other.seqY;
        };
        return GraphPoint;
    }());

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
    /**
     * @hidden
     */
    var GraphStyle = /** @class */ (function () {
        /**
         *
         */
        function GraphStyle(index_, drawingMode, color_, lineWidth) {
            this.index_ = index_;
            this.drawingMode = drawingMode;
            this.color_ = color_;
            this.lineWidth = lineWidth;
            // Do nothing yet.
        }
        return GraphStyle;
    }());

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    // const GRAPH_DRAW_MODE = 'graph draw mode';
    // const GRAPH_POINTS = 'graph points';
    // const CLEAR_GRAPH = 'clear graph';
    // const NONE = '-none-';
    /**
     * @hidden
     */
    var GraphLine = /** @class */ (function (_super) {
        __extends(GraphLine, _super);
        /**
         *
         */
        function GraphLine(varsList, capacity) {
            var _this = _super.call(this) || this;
            /**
             * Thickness to use when drawing the line, in screen coordinates, so a unit is a screen pixel.
             */
            _this.lineWidth_ = 1.0;
            /**
             * The color to draw the hot spot (most recent point) with, a CSS3 color string.
             */
            _this.hotspotColor_ = 'red';
            /**
             * GraphStyle's for display, ordered by index in dataPoints list.
             * There can be multiple GraphStyle entries for the same index, the latest one
             * in the list takes precedence.  We ensure there is always at least one GraphStyle
             * in the list.
             */
            _this.styles_ = [];
            _this.varsList_ = varsList;
            varsList.addObserver(_this);
            _this.xVar_ = -1;
            _this.yVar_ = -1;
            _this.xVarParam_ = new ParameterNumber(_this, GraphLine.PARAM_NAME_X_VARIABLE, function () { return _this.hCoordIndex; }, function (hCoordIndex) { return _this.hCoordIndex = hCoordIndex; });
            _this.xVarParam_.setLowerLimit(-1);
            _this.addParameter(_this.xVarParam_);
            _this.yVarParam_ = new ParameterNumber(_this, GraphLine.PARAM_NAME_Y_VARIABLE, function () { return _this.vCoordIndex; }, function (vCoordIndex) { return _this.vCoordIndex = vCoordIndex; });
            _this.yVarParam_.setLowerLimit(-1);
            _this.addParameter(_this.yVarParam_);
            _this.dataPoints_ = new CircularList(capacity || 100000);
            _this.drawColor_ = 'lime';
            _this.drawingMode_ = exports.DrawingMode.LINES;
            // ensure there is always at least one GraphStyle
            _this.addGraphStyle();
            _this.xTransform = function (x, y) { return x; };
            _this.yTransform = function (x, y) { return y; };
            _this.addParameter(new ParameterNumber(_this, GraphLine.PARAM_NAME_LINE_WIDTH, function () { return _this.lineWidth; }, function (lineWidth) { return _this.lineWidth = lineWidth; }));
            _this.addParameter(new ParameterNumber(_this, GraphLine.PARAM_NAME_DRAWING_MODE, function () { return _this.drawingMode; }, function (drawingMode) { return _this.drawingMode = drawingMode; }));
            _this.addParameter(new ParameterString(_this, GraphLine.PARAM_NAME_COLOR, function () { return _this.color; }, function (color) { return _this.color = color; }));
            return _this;
        }
        /**
         * Adds a GraphStyle with the current color, draw mode, and line width, corresponding
         * to the current end point of the HistoryList.
         */
        GraphLine.prototype.addGraphStyle = function () {
            this.styles_.push(new GraphStyle(this.dataPoints_.getEndIndex() + 1, this.drawingMode_, this.drawColor_, this.lineWidth_));
        };
        /**
         * Returns true if the object is likely a GraphLine. Only works under simple
         * compilation, intended for interactive non-compiled code.
         * @param obj the object of interest
         * @return true if the object is likely a GraphLine
         */
        GraphLine.isDuckType = function (obj) {
            if (obj instanceof GraphLine) {
                return true;
            }
            return isObject(obj) && obj.setXVariable !== undefined
                && obj.setYVariable !== undefined
                && obj.color !== undefined
                && obj.lineWidth !== undefined
                && obj.setAxes !== undefined
                && obj.varsList !== undefined
                && obj.reset !== undefined
                && obj.getGraphStyle !== undefined;
        };
        Object.defineProperty(GraphLine.prototype, "color", {
            /**
             * Returns the color used when drawing the graph.
             * @return the color used when drawing the graph
             */
            get: function () {
                return this.drawColor_;
            },
            /**
             * Sets the color to use when drawing the graph. Applies only to portions of graph
             * memorized after this time.
             * @param color the color to use when drawing the graph, a CSS3 color string.
             */
            set: function (color) {
                if (this.drawColor_ !== color) {
                    this.drawColor_ = color;
                    this.addGraphStyle();
                    this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "drawingMode", {
            /**
             * Returns the drawing mode of the graph: dots or lines.
             * @return the DrawingMode to draw this graph with
             */
            get: function () {
                return this.drawingMode_;
            },
            /**
             * Sets whether to draw the graph with dots or lines. Applies only to portions of graph
             * memorized after this time.
             * @param drawingMode the DrawingMode (dots or lines) to
             * draw this graph with.
             * @throws Error if the value does not represent a valid DrawingMode
             */
            set: function (drawingMode) {
                if (this.drawingMode_ !== drawingMode) {
                    this.drawingMode_ = drawingMode;
                    this.addGraphStyle();
                }
                this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the HistoryList of GraphPoints.
         */
        GraphLine.prototype.getGraphPoints = function () {
            return this.dataPoints_;
        };
        /**
         * Returns the GraphStyle corresponding to the position in the list of GraphPoints.
         * @param index  the index number in list of GraphPoints
         */
        GraphLine.prototype.getGraphStyle = function (index) {
            var styles = this.styles_;
            if (styles.length === 0) {
                throw new Error('graph styles list is empty');
            }
            // Find the latest style in the styles list with an index less than or
            // equal to the given index.
            var last = styles[0];
            for (var i = 1, len = styles.length; i < len; i++) {
                var s = styles[i];
                if (s.index_ > index) {
                    break;
                }
                last = s;
            }
            return last;
        };
        Object.defineProperty(GraphLine.prototype, "hotspotColor", {
            /**
             * Returns the color used when drawing the hot spot (most recent point).
             */
            get: function () {
                return this.hotspotColor_;
            },
            /**
             * Sets the color to use when drawing the hot spot (most recent point).
             * Set this to empty string to not draw the hot spot.
             */
            set: function (color) {
                this.hotspotColor_ = color;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "lineWidth", {
            /**
             * Returns thickness to use when drawing the line, in screen coordinates, so a unit
             * is a screen pixel.
             */
            get: function () {
                return this.lineWidth_;
            },
            /**
             * Sets thickness to use when drawing the line, in screen coordinates, so a unit is a
             * screen pixel. Applies only to portions of graph memorized after this time.
             * @param lineWidth thickness of line in screen coordinates
             */
            set: function (lineWidth) {
                if (veryDifferent(lineWidth, this.lineWidth_)) {
                    this.lineWidth_ = lineWidth;
                    this.addGraphStyle();
                    this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "varsList", {
            /**
             * Returns the VarsList that this GraphLine is collecting from
             */
            get: function () {
                return this.varsList_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "hCoordIndex", {
            /**
             * Returns the index in the VarsList of the X variable being collected.
             * @return the index of X variable in the VarsList, or  -1 if no X variable
             * is being collected.
             */
            get: function () {
                return this.xVar_;
            },
            /**
             * Sets the variable from which to collect data for the X value of the graph.
             * Starts over with a new HistoryList.
             * Broadcasts the parameter named `X_VARIABLE`.
             */
            set: function (xVar) {
                this.checkVarIndex(GraphLine.PARAM_NAME_X_VARIABLE, xVar);
                if (xVar !== this.xVar_) {
                    this.xVar_ = xVar;
                    this.reset();
                    this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns localized X variable name.
         * @return variable name or empty string in case index is -1
         */
        GraphLine.prototype.getXVarName = function () {
            return this.xVar_ > -1 ? this.varsList_.getName(this.xVar_) : '';
        };
        Object.defineProperty(GraphLine.prototype, "vCoordIndex", {
            /**
             * Returns the index in the VarsList of the Y variable being collected.
             * @return the index of Y variable in the VarsList, or  -1 if no Y variable
             * is being collected.
             */
            get: function () {
                return this.yVar_;
            },
            /**
             * Sets the variable from which to collect data for the Y value of the graph.
             * Starts over with a new HistoryList.
             * Broadcasts the parameter named `Y_VARIABLE`.
             */
            set: function (yVar) {
                this.checkVarIndex(GraphLine.PARAM_NAME_Y_VARIABLE, yVar);
                if (yVar !== this.yVar_) {
                    this.yVar_ = yVar;
                    this.reset();
                    this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns localized Y variable name.
         * @return variable name or empty string in case index is -1
         */
        GraphLine.prototype.getYVarName = function () {
            return this.yVar_ > -1 ? this.varsList_.getName(this.yVar_) : '';
        };
        GraphLine.prototype.memorize = function () {
            if (this.xVar_ > -1 && this.yVar_ > -1) {
                var varsList = this.varsList_;
                var x = varsList.getValue(this.xVar_);
                var y = varsList.getValue(this.yVar_);
                var nextX = this.xTransform(x, y);
                var nextY = this.yTransform(x, y);
                var seqX = varsList.getSequence(this.xVar_);
                var seqY = varsList.getSequence(this.xVar_);
                var newPoint = new GraphPoint(nextX, nextY, seqX, seqY);
                // only store if the new point is different from the last point
                var last = this.dataPoints_.getEndValue();
                if (last == null || !last.equals(newPoint)) {
                    this.dataPoints_.store(newPoint);
                }
            }
        };
        GraphLine.prototype.observe = function (event) {
            /*
            if (event.getSubject() == this.varsList_) {
                if (event.nameEquals(VarsList.VARS_MODIFIED)) {
                    this.buildMenu();
                }
            }
            */
        };
        /**
         * Forgets any memorized data and styles, starts from scratch.
         */
        GraphLine.prototype.reset = function () {
            this.dataPoints_.reset();
            this.resetStyle();
            this.broadcast(new GenericEvent(this, GraphLine.RESET));
        };
        /**
         * Forgets any memorized styles, records the current color, draw mode, and line width
         * as the single starting style.
         */
        GraphLine.prototype.resetStyle = function () {
            this.styles_ = [];
            // ensure there is always at least one GraphStyle
            this.addGraphStyle();
        };
        GraphLine.prototype.checkVarIndex = function (name, index) {
            if (index < -1 || index > this.varsList_.numVariables() - 1) {
                throw new Error(name + " bad index: " + index);
            }
        };
        GraphLine.PARAM_NAME_X_VARIABLE = 'X variable';
        GraphLine.PARAM_NAME_Y_VARIABLE = 'Y variable';
        GraphLine.PARAM_NAME_LINE_WIDTH = 'line width';
        GraphLine.PARAM_NAME_COLOR = 'color';
        GraphLine.PARAM_NAME_DRAWING_MODE = 'drawing mode';
        /**
         * Event broadcasted when reset is called.
         */
        GraphLine.RESET = 'RESET';
        return GraphLine;
    }(AbstractSubject));

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var DisplayGraph = /** @class */ (function () {
        /**
         *
         */
        function DisplayGraph() {
            /**
             * The GraphLines to draw.
             */
            this.graphLines_ = [];
            /**
             *
             */
            this.memDraw_ = repeat(-1, this.graphLines_.length);
            /**
             *
             */
            this.offScreen_ = null;
            /**
             * to detect when redraw needed;  when the coordmap changes, we need to redraw.
             */
            this.lastMap_ = null;
            /**
             *
             */
            this.screenRect_ = ScreenRect.EMPTY_RECT;
            /**
             * set when the entire graph needs to be redrawn.
             */
            this.needRedraw_ = false;
            /**
             * set when the entire graph needs to be redrawn.
             */
            this.useBuffer_ = false;
            /**
             *
             */
            this.zIndex = 0;
            // Do nothing yet.
        }
        /**
         *
         */
        DisplayGraph.prototype.draw = function (context, map) {
            if (this.screenRect_.isEmpty()) {
                return;
            }
            var graphLines = this.graphLines_;
            var N = graphLines.length;
            context.save();
            if (this.lastMap_ == null || this.lastMap_ !== map) {
                this.lastMap_ = map;
                this.needRedraw_ = true;
            }
            for (var i = 0; i < N; i++) {
                // Detect when graphLine has been reset.
                if (this.memDraw_[i] > graphLines[i].getGraphPoints().getEndIndex()) {
                    this.reset();
                    break;
                }
            }
            if (!this.useBuffer_) {
                // without offscreen buffer, always need to redraw
                this.needRedraw_ = true;
                // draw without offscreen buffer.
                if (this.needRedraw_) {
                    this.fullDraw(context, map);
                    this.needRedraw_ = false;
                }
                else {
                    // this is only useful for debugging, to see the incrementalDraw happening.
                    this.incrementalDraw(context, map);
                }
            }
            else {
                var w = this.screenRect_.getWidth();
                var h = this.screenRect_.getHeight();
                if (this.offScreen_ == null) {
                    // make the offscreen buffer that has an alpha channel.
                    this.offScreen_ = document.createElement('canvas');
                    this.offScreen_.width = w;
                    this.offScreen_.height = h;
                    this.needRedraw_ = true;
                }
                // osb = off screen buffer
                var osb = this.offScreen_.getContext('2d');
                if (this.needRedraw_) {
                    // Clear image with transparent alpha by drawing a rectangle
                    // 'clearRect fills with transparent black'
                    osb.clearRect(0, 0, w, h);
                    // The offscreen buffer has all transparent pixels at this point.
                    // Draw into offscreen buffer, but using opaque ink (alpha = 1.0).
                    this.fullDraw(osb, map);
                    this.needRedraw_ = false;
                }
                else {
                    this.incrementalDraw(osb, map);
                }
                // Copy the entire offscreen buffer onto the screen.
                // Note that the LabCanvas needs to actually clear the screen to white
                // at the start of each paint operation, because this draw() method never clears,
                // it does a sort of 'transparent image copy'.
                context.drawImage(this.offScreen_, 0, 0, w, h);
            }
            for (var i = 0; i < N; i++) {
                this.drawHotSpot(context, map, graphLines[i]);
            }
            context.restore();
        };
        /**
         *
         */
        DisplayGraph.prototype.drawHotSpot = function (context, coordMap, graphLine) {
            var p = graphLine.getGraphPoints().getEndValue();
            if (p != null) {
                var x = coordMap.simToScreenX(p.x);
                var y = coordMap.simToScreenY(p.y);
                var color = graphLine.hotspotColor;
                if (color) {
                    context.fillStyle = color;
                    context.fillRect(x - 2, y - 2, 5, 5);
                }
            }
        };
        /**
         * Draws the points starting from the specified point to the most recent point;
         * returns the index of last point drawn.
         * @param context the canvas's context to draw into
         * @param coordMap the CoordMap specifying sim to screen conversion
         * @param from the index of the the point to start from, within the datapoints
         * @param graphLine
         * @return the index of the last point drawn.
         */
        DisplayGraph.prototype.drawPoints = function (context, coordMap, from, graphLine) {
            var simRect = coordMap.screenToSimRect(this.screenRect_);
            var iter = graphLine.getGraphPoints().getIterator(from);
            if (!iter.hasNext()) {
                return from;
            }
            var next = iter.nextValue(); // move to first point
            // Draw first point.
            // Find the GraphStyle corresponding to this point.
            var style = graphLine.getGraphStyle(iter.getIndex());
            if (style.drawingMode === exports.DrawingMode.DOTS) {
                var x = coordMap.simToScreenX(next.x);
                var y = coordMap.simToScreenY(next.y);
                var w = style.lineWidth;
                context.fillStyle = style.color_;
                context.fillRect(x, y, w, w);
            }
            while (iter.hasNext()) {
                var last = next;
                next = iter.nextValue();
                // if same point then don't draw again
                if (next.x === last.x && next.y === last.y) {
                    continue;
                }
                // find the GraphStyle corresponding to this point
                var style_1 = graphLine.getGraphStyle(iter.getIndex());
                // Avoid drawing nonsense lines in a graph, like when the pendulum
                // moves over the 0 to 2Pi boundary.  The sequence number changes
                // when there is a discontinuity, so don't draw a line in this case.
                var continuous = next.seqX === last.seqX && next.seqY === last.seqY;
                if (style_1.drawingMode === exports.DrawingMode.DOTS || !continuous) {
                    // Only draw points that are visible.
                    if (!simRect.contains(next)) {
                        continue;
                    }
                    var x = coordMap.simToScreenX(next.x);
                    var y = coordMap.simToScreenY(next.y);
                    var w = style_1.lineWidth;
                    context.fillStyle = style_1.color_;
                    context.fillRect(x, y, w, w);
                }
                else {
                    // Don't draw lines that are not possibly visible.
                    if (!simRect.maybeVisible(last, next)) {
                        continue;
                    }
                    var x1 = coordMap.simToScreenX(last.x);
                    var y1 = coordMap.simToScreenY(last.y);
                    var x2 = coordMap.simToScreenX(next.x);
                    var y2 = coordMap.simToScreenY(next.y);
                    context.strokeStyle = style_1.color_;
                    context.lineWidth = style_1.lineWidth;
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.stroke();
                }
            }
            return iter.getIndex();
        };
        DisplayGraph.prototype.fullDraw = function (context, coordMap) {
            // Redraw entire memory list by drawing from oldest point in list
            this.memDraw_ = repeat(-1, this.graphLines_.length);
            this.incrementalDraw(context, coordMap);
        };
        DisplayGraph.prototype.getZIndex = function () {
            return this.zIndex;
        };
        DisplayGraph.prototype.setZIndex = function (zIndex) {
            this.zIndex = isDefined(zIndex) ? zIndex : 0;
        };
        /**
         *
         */
        DisplayGraph.prototype.incrementalDraw = function (context, coordMap) {
            // draw points from the last drawn (=memDraw) up to the current latest point
            // experiment: fade the graph by drawing a translucent white rectangle
            // var r = this.getScreenRect();
            // context.fillStyle = 'rgba(255,255,255,0.02)';
            // context.fillRect(r.getX(), r.getY(), r.getWidth(), r.getHeight());
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                this.memDraw_[i] = this.drawPoints(context, coordMap, this.memDraw_[i], this.graphLines_[i]);
            }
        };
        DisplayGraph.prototype.isDragable = function () {
            return false;
        };
        /**
         * Add a GraphLine to be displayed.
         * @param graphLine the GraphLine to be display
         */
        DisplayGraph.prototype.addGraphLine = function (graphLine) {
            if (GraphLine.isDuckType(graphLine)) {
                if (!contains(this.graphLines_, graphLine)) {
                    this.graphLines_.push(graphLine);
                    this.memDraw_.push(-1);
                }
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        /**
         * Remove a GraphLine from set of those to display.
         * @param graphLine the GraphLine to not display
         */
        DisplayGraph.prototype.removeGraphLine = function (graphLine) {
            if (GraphLine.isDuckType(graphLine)) {
                var idx = this.graphLines_.indexOf(graphLine);
                removeAt(this.graphLines_, idx);
                removeAt(this.memDraw_, idx);
                this.needRedraw_ = true;
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        DisplayGraph.prototype.setDragable = function (dragable) {
            // Do nothing.
        };
        /**
         * Sets the screen rectangle that this DisplayGraph should occupy within the
         * @param screenRect the screen coordinates of the
         * area this DisplayGraph should occupy.
         */
        DisplayGraph.prototype.setScreenRect = function (screenRect) {
            this.screenRect_ = screenRect;
            this.offScreen_ = null; // force reallocation of offscreen
        };
        /**
         * Whether to draw into an offscreen buffer.  A *time graph* must redraw every
         * frame, so it saves time to *not* use an offscreen buffer in that case.
         * @param value Whether to draw into an offscreen buffer
         */
        DisplayGraph.prototype.setUseBuffer = function (value) {
            this.useBuffer_ = value;
            if (!this.useBuffer_) {
                this.offScreen_ = null;
            }
        };
        /**
         * Causes entire graph to be redrawn, when `draw` is next called.
         */
        DisplayGraph.prototype.reset = function () {
            var graphLines = this.graphLines_;
            var N = graphLines.length;
            this.memDraw_ = repeat(-1, N);
            for (var i = 0; i < N; i++) {
                graphLines[i].reset();
            }
            this.needRedraw_ = true;
        };
        return DisplayGraph;
    }());

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
    exports.AlignH = void 0;
    (function (AlignH) {
        AlignH[AlignH["LEFT"] = 0] = "LEFT";
        AlignH[AlignH["MIDDLE"] = 1] = "MIDDLE";
        AlignH[AlignH["RIGHT"] = 2] = "RIGHT";
        AlignH[AlignH["FULL"] = 3] = "FULL";
    })(exports.AlignH || (exports.AlignH = {}));

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
    exports.AlignV = void 0;
    (function (AlignV) {
        AlignV[AlignV["TOP"] = 0] = "TOP";
        AlignV[AlignV["MIDDLE"] = 1] = "MIDDLE";
        AlignV[AlignV["BOTTOM"] = 2] = "BOTTOM";
        AlignV[AlignV["FULL"] = 3] = "FULL";
    })(exports.AlignV || (exports.AlignV = {}));

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
     * Observes a Subject; when the Subject broadcasts a SubjectEvent then this executes a specified function.
     * @hidden
     */
    var GenericObserver = /** @class */ (function () {
        /**
         * @param subject the Subject to observe
         * @param observeFn  function to execute when a SubjectEvent is broadcast by Subject
         */
        function GenericObserver(subject, observeFn) {
            this.subject_ = subject;
            subject.addObserver(this);
            this.observeFn_ = observeFn;
        }
        /**
         * Disconnects this GenericObserver from the Subject.
         */
        GenericObserver.prototype.disconnect = function () {
            this.subject_.removeObserver(this);
        };
        GenericObserver.prototype.observe = function (event) {
            this.observeFn_(event);
        };
        return GenericObserver;
    }());

    /**
     * Immutable point coordinates in two dimensions.
     * @hidden
     */
    var Point = /** @class */ (function () {
        function Point(x_, y_) {
            this.x_ = x_;
            this.y_ = y_;
        }
        Object.defineProperty(Point.prototype, "x", {
            get: function () {
                return this.x_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "y", {
            get: function () {
                return this.y_;
            },
            enumerable: false,
            configurable: true
        });
        return Point;
    }());

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * A rectangle whose boundaries are stored with double floating
     * point precision. This is an immutable class: once an instance is created it cannot be
     * changed.
     *
     * Note that for DoubleRect we regard the vertical coordinate as **increasing upwards**, so
     * the top coordinate is greater than the bottom coordinate. This is in contrast to HTML5
     * canvas where vertical coordinates increase downwards.
     * @hidden
     */
    var DoubleRect = /** @class */ (function () {
        function DoubleRect(left, bottom, right, top) {
            this.left_ = left;
            this.right_ = right;
            this.bottom_ = bottom;
            this.top_ = top;
            if (left > right) {
                throw new Error('DoubleRect: left > right ' + left + ' > ' + right);
            }
            if (bottom > top) {
                throw new Error('DoubleRect: bottom > top ' + bottom + ' > ' + top);
            }
        }
        /**
         * Returns a copy of the given DoubleRect.
         * @param rect the DoubleRect to copy
         * @return a copy of the given DoubleRect
         */
        DoubleRect.clone = function (rect) {
            return new DoubleRect(rect.getLeft(), rect.getBottom(), rect.getRight(), rect.getTop());
        };
        /**
         * Returns true if the object is likely a DoubleRect. Only works under simple
         * compilation, intended for interactive non-compiled code.
         * @param obj the object of interest
         * @return true if the object is likely a DoubleRect
         */
        DoubleRect.isDuckType = function (obj) {
            if (obj instanceof DoubleRect) {
                return true;
            }
            return obj.getLeft !== undefined
                && obj.getRight !== undefined
                && obj.getTop !== undefined
                && obj.getBottom !== undefined
                && obj.translate !== undefined
                && obj.scale !== undefined;
        };
        /**
         * Returns a DoubleRect spanning the two given points.
         * @param point1
         * @param point2
         * @return a DoubleRect spanning the two given points
         */
        DoubleRect.make = function (point1, point2) {
            var left = Math.min(point1.x, point2.x);
            var right = Math.max(point1.x, point2.x);
            var bottom = Math.min(point1.y, point2.y);
            var top_ = Math.max(point1.y, point2.y);
            return new DoubleRect(left, bottom, right, top_);
        };
        /**
         * Returns a DoubleRect centered at the given point with given height and width.
         * @param center center of the DoubleRect
         * @param width width of the DoubleRect
         * @param height height of the DoubleRect
         * @return a DoubleRect centered at the given point with given height and width
         */
        DoubleRect.makeCentered = function (center, width, height) {
            var x = center.x;
            var y = center.y;
            return new DoubleRect(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
        };
        /**
         * Returns a DoubleRect centered at the given point with given size.
         * @param center center of the DoubleRect
         * @param size width and height as a Vector
         * @return a DoubleRect centered at the given point with given size
         */
        DoubleRect.makeCentered2 = function (center, size) {
            var x = center.x;
            var y = center.y;
            var w = size.x;
            var h = size.y;
            return new DoubleRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
        };
        /**
         * Returns `true` if the given point is within this rectangle.
         * @param point  the point to test
         * @return `true` if the point is within this rectangle, or exactly on an edge
         */
        DoubleRect.prototype.contains = function (point) {
            return point.x >= this.left_ &&
                point.x <= this.right_ &&
                point.y >= this.bottom_ &&
                point.y <= this.top_;
        };
        /**
         * Returns `true` if the object is a DoubleRect with the same coordinates.
         * @param obj the object to compare to
         * @return `true` if the object is a DoubleRect with the same coordinates.
         */
        DoubleRect.prototype.equals = function (obj) {
            if (obj === this)
                return true;
            if (obj instanceof DoubleRect) {
                // WARNING:  this is different to Double.equals for NaN and +0.0/-0.0.
                return obj.getLeft() === this.left_ && obj.getRight() === this.right_ &&
                    obj.getBottom() === this.bottom_ && obj.getTop() === this.top_;
            }
            else {
                return false;
            }
        };
        /**
         * Returns a copy of this DoubleRect expanded by the given margin in x and y dimension.
         * @param marginX the margin to add at left and right
         * @param marginY the margin to add at top and bottom; if undefined then `marginX` is used for both x and y dimension
         * @return a DoubleRect with same center as this DoubleRect, but expanded or contracted
         */
        DoubleRect.prototype.expand = function (marginX, marginY) {
            marginY = (marginY === undefined) ? marginX : marginY;
            return new DoubleRect(this.getLeft() - marginX, this.getBottom() - marginY, this.getRight() + marginX, this.getTop() + marginX);
        };
        /**
         * Returns the smallest vertical coordinate of this DoubleRect
         * @return smallest vertical coordinate  of this DoubleRect
         */
        DoubleRect.prototype.getBottom = function () {
            return this.bottom_;
        };
        /**
         * Returns the center of this DoubleRect.
         */
        DoubleRect.prototype.getCenter = function () {
            return new Point(this.getCenterX(), this.getCenterY());
        };
        /**
         * Returns the horizontal coordinate of center of this DoubleRect.
         * @return horizontal coordinate of center of this DoubleRect
         */
        DoubleRect.prototype.getCenterX = function () {
            return (this.left_ + this.right_) / 2.0;
        };
        /**
         * Returns the vertical coordinate of center of this DoubleRect.
         * @return vertical coordinate of center of this DoubleRect
         */
        DoubleRect.prototype.getCenterY = function () {
            return (this.bottom_ + this.top_) / 2.0;
        };
        /**
         * Returns the vertical height of this DoubleRect
         * @return vertical height of this DoubleRect
         */
        DoubleRect.prototype.getHeight = function () {
            return this.top_ - this.bottom_;
        };
        /**
         * Returns the smallest horizontal coordinate of this DoubleRect
         * @return smallest horizontal coordinate of this DoubleRect
         */
        DoubleRect.prototype.getLeft = function () {
            return this.left_;
        };
        /**
         * Returns the largest horizontal coordinate of this DoubleRect
         * @return largest horizontal coordinate of this DoubleRect
         */
        DoubleRect.prototype.getRight = function () {
            return this.right_;
        };
        /**
         * Returns the largest vertical coordinate of this DoubleRect
         * @return largest vertical coordinate of this DoubleRect
         */
        DoubleRect.prototype.getTop = function () {
            return this.top_;
        };
        /**
         * Returns the horizontal width of this DoubleRect
         * @return horizontal width of this DoubleRect
         */
        DoubleRect.prototype.getWidth = function () {
            return this.right_ - this.left_;
        };
        /**
         * Returns `true` if width or height of this DoubleRect are zero (within given tolerance).
         * @param tolerance optional tolerance for the test; a width or height smaller than this is regarded as zero; default is 1E-16
         * @return `true` if width or height of this DoubleRect are zero (within given tolerance)
         */
        DoubleRect.prototype.isEmpty = function (tolerance) {
            if (tolerance === void 0) { tolerance = 1E-16; }
            return this.getWidth() < tolerance || this.getHeight() < tolerance;
        };
        /**
         * Returns true if the line between the two points might be visible in the rectangle.
         * @param p1 first end point of line
         * @param p2 second end point of line
         * @return true if the line between the two points might be visible in the rectangle
         */
        DoubleRect.prototype.maybeVisible = function (p1, p2) {
            // if either point is inside the rect, then line is visible
            if (this.contains(p1) || this.contains(p2)) {
                return true;
            }
            // if both points are "outside" one of the rectangle sides, then line is not visible
            var p1x = p1.x;
            var p1y = p1.y;
            var p2x = p2.x;
            var p2y = p2.y;
            var d = this.left_;
            if (p1x < d && p2x < d) {
                return false;
            }
            d = this.right_;
            if (p1x > d && p2x > d) {
                return false;
            }
            d = this.bottom_;
            if (p1y < d && p2y < d) {
                return false;
            }
            d = this.top_;
            if (p1y > d && p2y > d) {
                return false;
            }
            // we could check for intersection of the line with the rectangle here.
            return true;
        };
        /**
         * Returns `true` if this DoubleRect is nearly equal to another DoubleRect.
         * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
         * used depends on the magnitude of the numbers being compared.
         * @param rect  the DoubleRect to compare with
         * @param opt_tolerance optional tolerance for equality test
         * @return `true` if this DoubleRect is nearly equal to another DoubleRect
         */
        DoubleRect.prototype.nearEqual = function (rect, opt_tolerance) {
            if (veryDifferent(this.left_, rect.getLeft(), opt_tolerance)) {
                return false;
            }
            if (veryDifferent(this.bottom_, rect.getBottom(), opt_tolerance)) {
                return false;
            }
            if (veryDifferent(this.right_, rect.getRight(), opt_tolerance)) {
                return false;
            }
            if (veryDifferent(this.top_, rect.getTop(), opt_tolerance)) {
                return false;
            }
            return true;
        };
        /**
         * Returns a copy of this DoubleRect expanded by the given factors in both x and y
         * dimension. Expands (or contracts) about the center of this DoubleRect by the given
         * expansion factor in x and y dimensions.
         * @param factorX the factor to expand width by; 1.1 gives a 10 percent expansion; 0.9 gives a 10 percent contraction
         * @param factorY  factor to expand height by; if undefined then `factorX` is used for both x and y dimension
         * @return a DoubleRect with same center as this DoubleRect, but expanded or contracted
         */
        DoubleRect.prototype.scale = function (factorX, factorY) {
            factorY = (factorY === undefined) ? factorX : factorY;
            var x0 = this.getCenterX();
            var y0 = this.getCenterY();
            var w = this.getWidth();
            var h = this.getHeight();
            return new DoubleRect(x0 - (factorX * w) / 2, y0 - (factorY * h) / 2, x0 + (factorX * w) / 2, y0 + (factorY * h) / 2);
        };
        /**
         * Returns a copy of this rectangle translated by the given amount.
         * @param x horizontal amount to translate by.
         * @param y vertical amount to translate by.
         * @return a copy of this rectangle translated by the given amount
         */
        DoubleRect.prototype.translate = function (x, y) {
            return new DoubleRect(this.left_ + x, this.bottom_ + y, this.right_ + x, this.top_ + y);
        };
        /**
         * Returns a rectangle that is the union of this and another rectangle.
         * @param rect the other rectangle to form the union with.
         * @return the union of this and the other rectangle
         */
        DoubleRect.prototype.union = function (rect) {
            return new DoubleRect(Math.min(this.left_, rect.getLeft()), Math.min(this.bottom_, rect.getBottom()), Math.max(this.right_, rect.getRight()), Math.max(this.top_, rect.getTop()));
        };
        /**
         * Returns a rectangle that is the union of this rectangle and a point
         * @param point the point to form the union with
         * @return the union of this rectangle and the point
         */
        DoubleRect.prototype.unionPoint = function (point) {
            return new DoubleRect(Math.min(this.left_, point.x), Math.min(this.bottom_, point.y), Math.max(this.right_, point.x), Math.max(this.top_, point.y));
        };
        /**
         * The empty rectangle (0, 0, 0, 0).
         */
        DoubleRect.EMPTY_RECT = new DoubleRect(0, 0, 0, 0);
        return DoubleRect;
    }());

    /**
     * @hidden
     */
    function isEmpty(xs) {
        return xs.length === 0;
    }

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var WIDTH = 'width';
    /**
     * @hidden
     */
    var HEIGHT = 'height';
    /**
     * @hidden
     */
    var ALPHA = 'alpha';
    /**
     * @hidden
     */
    var BACKGROUND = 'background';
    /**
     * @hidden
     * Manages an HTML canvas and contains a list of LabView(s)
     * which are drawn into the canvas. The LabViews are drawn overlapping so that the last
     * LabView appears on top of the others.
     *
     * Canvas Size and Shape
     *
     * The HTML canvas has a specified width and height, which determines its resolution and
     * shape. The size can be changed via setWidth, setHeight, or setSize.
     * When the size of the HTML canvas changes, the LabViews are set to have the
     * same screen rectangle as the canvas.
     *
     * Each LabView has a simulation rectangle which is placed over its screen rectangle via a
     * CoordMap. The simulation rectangle specifies the simulation coordinates,
     * and the CoordMap translates simulation coordinates to screen
     * coordinates. Pan and zoom can be accomplished by changing the simulation rectangle of a
     * LabView (which changes its CoordMap accordingly).
     *
     * Focus View
     *
     * The first LabView that is added becomes the **focus view**. The focus view is treated
     * specially by some classes.
     *
     * Background Color
     *
     * Whenever {@link #paint} is called to draw a new frame, the first step is to clear the
     * old frame from the HTML canvas.
     *
     * + If no background color is specified (an empty string) then we use the
     * JavaScript `canvas.clearRect()` method which clears to transparent black pixels.
     *
     * + If a background color is specified, then we use JavaScript
     * `canvas.fillRect()` to fill the HTML canvas with that color.
     *
     * The background color can be set with {@link #setBackground}.
     *
     * Trails Effect
     *
     * A visual effect where moving objects leave behind a smeared out trail can be done by
     * setting the background color and the *alpha* transparency, see {@link #setAlpha}.
     * Here are example settings:
     *
     * simCanvas.setBackground('black');
     * simCanvas.setAlpha(0.05);
     *
     * When `alpha` is 1.0 then there is no trails effect because the old frame is entirely
     * painted over with an opaque color.
     *
     * The trails effect happens when `alpha` is less than 1 because we paint a translucent
     * rectangle over the old frame, which gradually makes the old image disappear after
     * several iterations of painting.
     *
     * ### Parameters Created
     *
     * + ParameterNumber named `LabCanvas.en.WIDTH`
     * see {@link #setWidth}
     *
     * + ParameterNumber named `LabCanvas.en.HEIGHT`
     * see {@link #setHeight}
     *
     * ### Events Broadcast
     *
     * LabCanvas broadcasts these GenericEvent(s) to its Observers:
     *
     * + {@link #VIEW_ADDED} the value of the GenericEvent is the LabView being added
     *
     * + {@link #VIEW_REMOVED} the value of the GenericEvent is the LabView being removed
     *
     * + {@link #FOCUS_VIEW_CHANGED} the value of the GenericEvent is the LabView which is
     * the focus, or `null` if there is no focus view
     *
     * + {@link #VIEW_LIST_MODIFIED}
     *
     * + {@link #SIZE_CHANGED}
     */
    var LabCanvas = /** @class */ (function (_super) {
        __extends(LabCanvas, _super);
        /**
         *
         */
        // private readonly debug_ = false;
        /**
         *
         */
        function LabCanvas(canvas) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.labViews_ = [];
            /**
             *
             */
            _this.memorizables_ = [];
            /**
             * The view which is the main focus and is drawn normally.
             */
            _this.focusView_ = null;
            /**
             * The transparency used when painting the background color; a number between
             * 0.0 (fully transparent) and 1.0 (fully opaque).
             */
            _this.alpha_ = 1;
            /**
             * The background color; either a CSS3 color value or the empty string. Transparent
             * black is used if it is the empty string.
             */
            _this.background_ = '';
            _this.canvas_ = canvas;
            // contentEditable makes the canvas be focusable (can get keyboard focus)
            // and can get control of the cursor.
            // Result is: if you were editting a NumericControl, for example, then
            // clicking on canvas will cause that control to lose focus, which is what we want.
            // Also, this seems to enable setting the cursor according to the CSS values
            // for canvas.cursor and canvas:active.cursor.
            // Oct 2014: set canvas.contentEditable to false. This fixes problems where clicking
            // on canvas would bring up keyboard on iPhone and cause a huge blinking text cursor
            // on side of canvas. However, canvas will no longer get text events.
            // Dec 2014: see places where we set the tabIndex to allow the canvas to get focus.
            canvas.contentEditable = 'false';
            return _this;
            /*
            this.addParameter(new ParameterNumber(this, LabCanvas.en.WIDTH,
                LabCanvas.i18n.WIDTH, this.getWidth, this.setWidth));
            this.addParameter(new ParameterNumber(this, LabCanvas.en.HEIGHT,
                LabCanvas.i18n.HEIGHT, this.getHeight, this.setHeight));
            this.addParameter(new ParameterNumber(this, LabCanvas.en.ALPHA,
                LabCanvas.i18n.ALPHA, this.getAlpha, this.setAlpha));
            this.addParameter(new ParameterString(this, LabCanvas.en.BACKGROUND,
                LabCanvas.i18n.BACKGROUND, this.getBackground, this.setBackground));
                */
        }
        LabCanvas.prototype.addMemo = function (memorizable) {
            if (!contains(this.memorizables_, memorizable)) {
                this.memorizables_.push(memorizable);
            }
        };
        /**
         * Adds the LabView to the end of the list of LabViews displayed and memorized by this
         * LabCanvas. Makes the LabView the focus view if there isn't currently a focus view.
         * Notifies any Observers by broadcasting GenericEvents named {@link #VIEW_ADDED} and
         * {@link #VIEW_LIST_MODIFIED} and possibly also {@link #FOCUS_VIEW_CHANGED}.
         * @param view the LabView to add
         */
        LabCanvas.prototype.addView = function (view) {
            mustBeNonNullObject('view', view);
            if (this.getWidth() > 0 && this.getHeight() > 0) {
                var screenRect = new ScreenRect(0, 0, this.getWidth(), this.getHeight());
                view.setScreenRect(screenRect);
            }
            this.labViews_.push(view);
            this.addMemo(view);
            this.broadcast(new GenericEvent(this, LabCanvas.VIEW_ADDED, view));
            this.broadcast(new GenericEvent(this, LabCanvas.VIEW_LIST_MODIFIED));
            // set the first view added to be the focus.
            if (this.focusView_ == null) {
                this.setFocusView(view);
            }
        };
        /**
         * Moves the keyboard focus to the HTML canvas.
         */
        LabCanvas.prototype.focus = function () {
            // Move the keyboard focus to the canvas.  This is desirable so that if
            // the user was editting a text field, it ends that editting operation.
            // see http://stackoverflow.com/questions/1829586/
            //     how-do-i-give-an-html-canvas-the-keyboard-focus-using-jquery
            this.canvas_.focus();
        };
        /**
         * Returns the transparency used when painting; a number between 0.0 (fully transparent)
         * and 1.0 (fully opaque). Only has an effect if the background color is non-empty string.
         * @return transparency used when painting, between 0 and 1.
         */
        LabCanvas.prototype.getAlpha = function () {
            return this.alpha_;
        };
        /**
         * Returns the background color; either a CSS3 color value or the empty string. Empty
         * string means that background is cleared to transparent black.
         * @return the background color; either a CSS3 color value or the empty string.
         */
        LabCanvas.prototype.getBackground = function () {
            return this.background_;
        };
        /**
         * Returns the HTML canvas being managed by this LabCanvas.
         * @return the HTML canvas being managed by this LabCanvas
         */
        LabCanvas.prototype.getCanvas = function () {
            return this.canvas_;
        };
        /**
         * Returns the CanvasRenderingContext2D used for drawing into the HTML canvas being
         * managed by this LabCanvas.
         * @return the CanvasRenderingContext2D used for drawing into the HTML canvas
         */
        LabCanvas.prototype.getContext = function () {
            return this.canvas_.getContext('2d');
        };
        /**
         * Returns the focus LabView which is the main focus of the LabCanvas.
         * @return the focus LabView, or `null` when there is no focus LabView
         */
        LabCanvas.prototype.getFocusView = function () {
            return this.focusView_;
        };
        /**
         * Returns the height of the HTML canvas, in screen coords (pixels).
         */
        LabCanvas.prototype.getHeight = function () {
            return this.canvas_.height;
        };
        LabCanvas.prototype.getMemos = function () {
            return clone(this.memorizables_);
        };
        /**
         * Returns the ScreenRect corresponding to the area of the HTML canvas.
         * The top-left coordinate is always (0,0).  This does not represent the location
         * of the canvas within the document or window.
         */
        LabCanvas.prototype.getScreenRect = function () {
            return new ScreenRect(0, 0, this.canvas_.width, this.canvas_.height);
        };
        /**
         * Returns list of the LabViews in this LabCanvas.
         */
        LabCanvas.prototype.getViews = function () {
            return clone(this.labViews_);
        };
        /**
         * Returns the width of the HTML canvas, in screen coords (pixels).
         */
        LabCanvas.prototype.getWidth = function () {
            return this.canvas_.width;
        };
        LabCanvas.prototype.memorize = function () {
            for (var i = 0, n = this.memorizables_.length; i < n; i++) {
                this.memorizables_[i].memorize();
            }
        };
        LabCanvas.prototype.notifySizeChanged = function () {
            var r = this.getScreenRect();
            this.labViews_.forEach(function (view) {
                view.setScreenRect(r);
            });
            this.broadcast(new GenericEvent(this, LabCanvas.SIZE_CHANGED));
        };
        /**
         * Clears the canvas to the background color; then paints each LabView.
         */
        LabCanvas.prototype.paint = function () {
            // Avoid painting when the canvas is hidden.
            // http://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
            // According to MDN documentation, an element's offsetParent property will return
            // `null` whenever it, or any of its parents, is hidden via the display style
            // property. Just make sure that the element doesnt have 'position:fixed;'.
            if (this.canvas_.offsetParent != null) {
                var context = this.canvas_.getContext('2d');
                context.save();
                if (this.background_ !== '') {
                    // Notes Nov 22, 2016:
                    // Setting a fillStyle color with transparency doesn't work here.
                    // For example rgb(0,0,0,0.05). Only setting globalAlpha works.
                    // Does fillRect() always ignore the alpha value of the color?
                    // That does not seem to be according to spec.
                    // Note also that globalAlpha has no effect on fill() because in that
                    // case the fillStyle's alpha is always used, and if not specified then
                    // it seems to assume alpha = 1.
                    context.globalAlpha = this.alpha_;
                    context.fillStyle = this.background_;
                    context.fillRect(0, 0, this.canvas_.width, this.canvas_.height);
                    context.globalAlpha = 1;
                }
                else {
                    // clearRect sets all pixels in the rectangle to transparent black,
                    // erasing any previously drawn content.
                    // clearRect is supposed to be faster than fillRect.
                    context.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
                }
                var vs = this.labViews_;
                var N = vs.length;
                for (var i = 0; i < N; i++) {
                    vs[i].paint(context);
                }
                context.restore();
            }
        };
        LabCanvas.prototype.removeMemo = function (memorizable) {
            remove(this.memorizables_, memorizable);
        };
        /**
         * Removes the LabView from the list of LabViews displayed and memorized by this
         * LabCanvas. Sets the focus view to be the first view in remaining list of LabViews.
         * Notifies any Observers by broadcasting GenericEvents named VIEW_LIST_MODIFIED
         * and IEW_REMOVED and possibly also FOCUS_VIEW_CHANGED.
         * @param view the LabView to remove
         */
        LabCanvas.prototype.removeView = function (view) {
            mustBeNonNullObject('view', view);
            remove(this.labViews_, view);
            this.removeMemo(view);
            if (this.focusView_ === view) {
                // pick first view to focus on, if possible
                this.setFocusView(isEmpty(this.labViews_) ? null : this.labViews_[0]);
            }
            this.broadcast(new GenericEvent(this, LabCanvas.VIEW_REMOVED, view));
            this.broadcast(new GenericEvent(this, LabCanvas.VIEW_LIST_MODIFIED));
        };
        /**
         * Sets the transparency used when painting; a number between 0.0 (fully transparent)
         * and 1.0 (fully opaque). Only has an effect if the background color is non-empty string.
         * @param value transparency used when painting, between 0 and 1
         */
        LabCanvas.prototype.setAlpha = function (value) {
            if (veryDifferent(this.alpha_, value)) {
                this.alpha_ = value;
                // Alpha has no effect when background is empty string which means
                // "clear to transparent black". Set background to white in that case.
                if (veryDifferent(value, 1) && this.background_ === '') {
                    this.setBackground('white');
                }
                this.broadcastParameter(ALPHA);
            }
        };
        /**
         * Sets the background color; either a CSS3 color value or the empty string. Empty
         * string means that background is cleared to transparent black.
         * @param value the background color; either a CSS3 color value or the empty string
         */
        LabCanvas.prototype.setBackground = function (value) {
            if (this.background_ !== value) {
                this.background_ = value;
                this.broadcastParameter(BACKGROUND);
            }
        };
        /**
         * Sets the focus LabView which is the main focus of the LabCanvas. Notifies any
         * observers that the focus has changed by broadcasting the GenericEvent named FOCUS_VIEW_CHANGED.
         * @param view the view that should be the focus; can be `null` when no LabView has the focus.
         * @throws Error if `view` is not contained by this LabCanvas
         */
        LabCanvas.prototype.setFocusView = function (view) {
            if (view != null && !contains(this.labViews_, view))
                throw new Error('cannot set focus to unknown view ' + view);
            if (this.focusView_ !== view) {
                if (this.focusView_ != null) {
                    this.focusView_.loseFocus();
                }
                this.focusView_ = view;
                if (view != null) {
                    view.gainFocus();
                }
                this.broadcast(new GenericEvent(this, LabCanvas.FOCUS_VIEW_CHANGED, view));
            }
        };
        /**
         * Sets the height of the HTML canvas, and sets the screen rectangle of all the
         * LabViews. Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
         * @param value  the height of the canvas, in screen coords (pixels).
         */
        LabCanvas.prototype.setHeight = function (value) {
            if (veryDifferent(value, this.canvas_.height)) {
                this.canvas_.height = value;
            }
            this.notifySizeChanged();
            this.broadcastParameter(HEIGHT);
        };
        /**
         * Sets the size of this LabCanvas to the given ScreenRect by calling {@link #setSize}.
         *  @param sr  specifies the width and height; the top-left must be (0,0).
         *  @throws if the top-left of the given ScreenRect is not (0,0).
         */
        LabCanvas.prototype.setScreenRect = function (sr) {
            if (!ScreenRect.isDuckType(sr)) {
                throw new Error('not a ScreenRect ' + sr);
            }
            if (sr.getTop() !== 0 || sr.getLeft() !== 0) {
                throw new Error('top left must be 0,0, was: ' + sr);
            }
            this.setSize(sr.getWidth(), sr.getHeight());
        };
        /**
         * Sets the size of the HTML canvas. All LabViews are set to have the
         * same screen rectangle as this LabCanvas by calling setScreenRect.
         * Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
         * @param width  the width of the canvas, in screen coords (pixels)
         * @param height  the height of the canvas, in screen coords (pixels)
         */
        LabCanvas.prototype.setSize = function (width, height) {
            if (!isNumber(width) || width <= 0 || !isNumber(height) || height <= 0) {
                throw new Error('bad size ' + width + ', ' + height);
            }
            this.canvas_.width = width;
            this.canvas_.height = height;
            this.notifySizeChanged();
            this.broadcastParameter(WIDTH);
            this.broadcastParameter(HEIGHT);
        };
        /**
         * Sets the width of the HTML canvas, and sets the screen rectangle of all the
         * LabViews. Notifies any Observers by broadcasting a GenericEvent named SIZE_CHANGED.
         * @param value  the width of the canvas, in screen coords (pixels).
         */
        LabCanvas.prototype.setWidth = function (value) {
            if (veryDifferent(value, this.canvas_.width)) {
                this.canvas_.width = value;
            }
            this.notifySizeChanged();
            this.broadcastParameter(WIDTH);
        };
        /**
         * Name of GenericEvent that is broadcast when the focus view changes.
         */
        LabCanvas.FOCUS_VIEW_CHANGED = 'FOCUS_VIEW_CHANGED';
        /**
         * Name of GenericEvent that is broadcast when the size of the HTML canvas changes.
         */
        LabCanvas.SIZE_CHANGED = 'SIZE_CHANGED';
        /**
         * Name of GenericEvent that is broadcast when the list of LabViews is modified.
         */
        LabCanvas.VIEW_LIST_MODIFIED = 'VIEW_LIST_MODIFIED';
        /**
         * Name of GenericEvent that is broadcast when a LabView is added.
         */
        LabCanvas.VIEW_ADDED = 'VIEW_ADDED';
        /**
         * Name of GenericEvent that is broadcast when a LabView is removed.
         */
        LabCanvas.VIEW_REMOVED = 'VIEW_REMOVED';
        return LabCanvas;
    }(AbstractSubject));

    /**
     * Throws an error if the argument is not a finite number.
     * @param value the number to test
     * @return the value that passed the test
     * @throws if the argument is not a finite number
     * @hidden
     */
    function mustBeFinite(value) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error('not a finite number ' + value);
        }
        return value;
    }

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     * Specifies an immutable 2D affine transform.
     *
     * The affine transform of a point `(x, y)` is given by:
     *
     *  [  m11  m21  dx  ] [ x ]   [ m11 x + m21 y + dx ]
     *  [  m12  m22  dy  ] [ y ] = [ m12 x + m22 y + dy ]
     *  [   0    0    1  ] [ 1 ]   [          1         ]
     *
     * Rotation clockwise by theta radians:
     *
     *  [ cos(theta)  -sin(theta)   0 ]
     *  [ sin(theta)   cos(theta)   0 ]
     *  [     0            0        1 ]
     *
     * Scale:
     *
     *  [  sx   0    0  ]
     *  [  0   sy    0  ]
     *  [  0    0    1  ]
     *
     * Translate:
     *
     *  [  1    0   dx  ]
     *  [  0    1   dy  ]
     *  [  0    0    1  ]
     */
    var AffineTransform = /** @class */ (function () {
        /**
         *
         */
        function AffineTransform(m11, m12, m21, m22, dx, dy) {
            this.m11_ = m11;
            this.m12_ = m12;
            this.m21_ = m21;
            this.m22_ = m22;
            this.dx_ = dx;
            this.dy_ = dy;
        }
        /**
         * Multiplies the affine transform of the given context with this AffineTransform.
         * @param context the canvas context to modify
         */
        AffineTransform.prototype.applyTransform = function (context) {
            context.transform(this.m11_, this.m12_, this.m21_, this.m22_, this.dx_, this.dy_);
            return this;
        };
        /**
         * Right-multiply this AffineTransform by the given AffineTransform. This has the
         * effect that the given AffineTransform will be applied to the input vector before the
         * current AffineTransform.
         *
         * Concatenating a transform A to transform B is equivalent to matrix multiplication of
         * the two transforms. Note that order matters: matrices are applied in right to left order
         * when transforming a vector
         *
         * A B vector = A * (B * vector)
         *
         * We can think of the B matrix being applied first, then the A matrix.  This method
         * returns the product with the input `at` matrix on the right
         *
         * this * at
         *
         * The mathematics is as follows: this matrix is on the left, the other `at` matrix is on
         * the right:
         *
         *  [  m11  m21  dx  ]  [  a11  a21  ax  ]
         *  [  m12  m22  dy  ]  [  a12  a22  ay  ]
         *  [   0    0    1  ]  [   0    0   1   ]
         *
         * Result is:
         *
         *  [ (m11*a11 + m21*a12)  (m11*a21 + m21*a22)  (m11*ax + m21*ay + dx) ]
         *  [ (m12*a11 + m22*a12)  (m12*a21 + m22*a22)  (m12*ax + m22*ay + dy) ]
         *  [          0                    0                   1              ]
         *
         * @param at the AffineTransform matrix to right-multiply this AffineTransform matrix by
         * @return the product of this AffineTransform matrix right-multiplied by the `at` AffineTransform matrix
         */
        AffineTransform.prototype.concatenate = function (at) {
            var m11 = this.m11_ * at.m11_ + this.m21_ * at.m12_;
            var m12 = this.m12_ * at.m11_ + this.m22_ * at.m12_;
            var m21 = this.m11_ * at.m21_ + this.m21_ * at.m22_;
            var m22 = this.m12_ * at.m21_ + this.m22_ * at.m22_;
            var dx = this.m11_ * at.dx_ + this.m21_ * at.dy_ + this.dx_;
            var dy = this.m12_ * at.dx_ + this.m22_ * at.dy_ + this.dy_;
            return new AffineTransform(m11, m12, m21, m22, dx, dy);
        };
        /**
         * Draw a line to the transformed point.
         * @param x horizontal coordinate
         * @param y vertical coordinate
         * @param context the canvas context to modify
         */
        AffineTransform.prototype.lineTo = function (x, y, context) {
            var p = this.transform(x, y);
            context.lineTo(p.x, p.y);
            return this;
        };
        /**
         * Sets current position in context to the transformed point.
         * @param x horizontal coordinate
         * @param y vertical coordinate
         * @param context the canvas context to modify
         */
        AffineTransform.prototype.moveTo = function (x, y, context) {
            var p = this.transform(x, y);
            context.moveTo(p.x, p.y);
            return this;
        };
        /**
         * Concatenates a rotation transformation to this AffineTransform.
         *
         * The mathematics is as follows: this matrix is on the left, the rotation matrix is on
         * the right, and the angle is represented by `t`
         *
         *  [  m11  m21  dx  ]  [ cos(t)  -sin(t)   0 ]
         *  [  m12  m22  dy  ]  [ sin(t)   cos(t)   0 ]
         *  [   0    0    1  ]  [  0        0       1 ]
         *
         * Result is:
         *
         *  [  (m11*cos(t) + m21*sin(t))  (-m11*sin(t) + m21*cos(t))  0  ]
         *  [  (m12*cos(t) + m22*sin(t))  (-m12*sin(t) + m22*cos(t))  0  ]
         *  [              0                          0               1  ]
         *
         * @param angle angle in radians to; positive angle rotates clockwise.
         * @return a new AffineTransform equal to this AffineTransform rotated by the given angle
         */
        AffineTransform.prototype.rotate = function (angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var m11 = c * this.m11_ + s * this.m21_;
            var m12 = c * this.m12_ + s * this.m22_;
            var m21 = -s * this.m11_ + c * this.m21_;
            var m22 = -s * this.m12_ + c * this.m22_;
            return new AffineTransform(m11, m12, m21, m22, this.dx_, this.dy_);
        };
        /**
         * Concatenates a scaling transformation to this AffineTransform.
         *
         * The mathematics is as follows: this matrix is on the left, the scaling matrix is on
         * the right:
         *
         *  [  m11  m21  dx  ]  [  x   0   0  ]
         *  [  m12  m22  dy  ]  [  0   y   0  ]
         *  [   0    0    1  ]  [  0   0   1  ]
         *
         * Result is:
         *
         *  [  m11*x  m21*y  dx  ]
         *  [  m12*x  m22*y  dy  ]
         *  [   0      0      1  ]
         *
         * @param x factor to scale by in horizontal direction
         * @param y factor to scale by in vertical direction
         * @return a new AffineTransform equal to this AffineTransform scaled by the given x and y factors
         */
        AffineTransform.prototype.scale = function (x, y) {
            var m11 = this.m11_ * x;
            var m12 = this.m12_ * x;
            var m21 = this.m21_ * y;
            var m22 = this.m22_ * y;
            return new AffineTransform(m11, m12, m21, m22, this.dx_, this.dy_);
        };
        /**
         * Set the affine transform of the given context to match this AffineTransform.
         * @param context the canvas context to modify
         */
        AffineTransform.prototype.setTransform = function (context) {
            context.setTransform(this.m11_, this.m12_, this.m21_, this.m22_, this.dx_, this.dy_);
            return this;
        };
        /**
         * Apply this transform to the given point, returning the transformation
         * of the given point.
         *
         * The mathematics is as follows:
         *
         *  [  m11  m21  dx  ]  [ x ]
         *  [  m12  m22  dy  ]  [ y ]
         *  [   0    0    1  ]  [ 1 ]
         *
         * Result is:
         *
         *  [ m11 x + m21 y + dx ]
         *  [ m12 x + m22 y + dy ]
         *  [          1         ]
         *
         * @param x the x coordinate
         * @param y the y coordinate
         * @return the transformation of the given point.
         */
        AffineTransform.prototype.transform = function (x, y) {
            var x2 = this.m11_ * x + this.m21_ * y + this.dx_;
            var y2 = this.m12_ * x + this.m22_ * y + this.dy_;
            return new Point(x2, y2);
        };
        /**
         * Concatenates a translation to this AffineTransform.
         *
         * The mathematics is as follows: this matrix is on the left, the scaling matrix is on
         * the right:
         *
         *  [  m11  m21  dx  ]  [  1    0   x  ]
         *  [  m12  m22  dy  ]  [  0    1   y  ]
         *  [   0    0    1  ]  [  0    0   1  ]
         *
         * Result is:
         *
         *  [ m11  m21  (m11*x + m21*y + dx) ]
         *  [ m12  m22  (m12*x + m22*y + dy) ]
         *  [ 0    0            1            ]
         *
         * @param the x coordinate
         * @param the y coordinate
         * @return a new AffineTransform equal to this AffineTransform  translated by the given amount
         */
        AffineTransform.prototype.translate = function (x, y) {
            var dx = this.dx_ + this.m11_ * x + this.m21_ * y;
            var dy = this.dy_ + this.m12_ * x + this.m22_ * y;
            return new AffineTransform(this.m11_, this.m12_, this.m21_, this.m22_, dx, dy);
        };
        /**
         * The identity AffineTransform, which leaves a point unchanged when it is applied.
         */
        AffineTransform.IDENTITY = new AffineTransform(1, 0, 0, 1, 0, 0);
        return AffineTransform;
    }());

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var MIN_SIZE = 1E-15;
    /**
     * @hidden
     * Provides the mapping between screen (canvas) coordinates and simulation coordinates;
     * this is an immutable object.
     *
     * + **Screen coordinates** corresponds to pixels on an HTML canvas; the vertical
     * coordinate increases going down, with zero usually being the top of the canvas.
     *
     * + **Simulation coordinates** the vertical coordinate increases going up; units can be any size.
     *
     * To create a CoordMap you specify translation and scaling factors for going between
     * screen and simulation coordinates. The CoordMap constructor maps the bottom-left point
     * on the canvas to the given bottom-left point in simulation space and then uses the given
     * scaling factors.
     *
     * The static method {@link #make} calculates the translation and scaling factors in order
     * to fit a certain rectangle in simulation coords into another rectangle in screen coords.
     *
     * From David Flanagan, *JavaScript: The Definitive Guide, 6th Edition* page 869:
     *
     * > By default, the coordinate space for a canvas has its origin at `(0,0)` in the upper
     * left corner of the canvas, with `x` values increasing to the right and `y` values
     * increasing down. The `width` and `height` attributes of the `<canvas>` tag specify the
     * maximum X and Y coordinates, and a single unit in this coordinate space normally
     * translates to a single on-screen pixel.
     *
     * Note however that a canvas actually has
     * [two coordinate systems](http://www.ckollars.org/canvas-two-coordinate-scales.html):
     *
     * > The `<canvas...>` element is unlike almost all other HTML/HTML5 elements in using two
     * different coordinate system scales simultaneously. The *model* coordinate system scale
     * is used whenever you want to draw anything on the canvas. The *display* coordinate
     * system scale is used to control how much physical screen space is dedicated to the
     * canvas. You should explicitly specify both, the *model* coordinate size as attributes in
     * your HTML, and the *display* coordinate size in your CSS.
     *
     * Essentially the *display* coordinates can be used to stretch a canvas to fit the screen
     * as desired. Here we ignore *display* coordinates and regard *screen coordinates* to be
     * what is called *model coordinates* in the above quote.
     *
     * @param screen_left  the left edge of the canvas in screen coordinates
     * @param screen_bottom the bottom edge of the canvas in screen coordinates
     * @param sim_left  the simulation coordinate corresponding to screen_left
     * @param sim_bottom  the simulation coordinate corresponding to screen_bottom
     * @param pixel_per_unit_x  canvas pixels per simulation space unit along x axis
     * @param pixel_per_unit_y  canvas pixels per simulation space unit along y axis
     */
    var CoordMap = /** @class */ (function () {
        function CoordMap(screen_left, screen_bottom, sim_left, sim_bottom, pixel_per_unit_x, pixel_per_unit_y) {
            this.screen_left_ = mustBeFinite(screen_left);
            this.screen_bottom_ = mustBeFinite(screen_bottom);
            this.sim_left_ = mustBeFinite(sim_left);
            this.sim_bottom_ = mustBeFinite(sim_bottom);
            this.pixel_per_unit_x_ = mustBeFinite(pixel_per_unit_x);
            this.pixel_per_unit_y_ = mustBeFinite(pixel_per_unit_y);
            var at = AffineTransform.IDENTITY;
            // do operations in reverse order, because of how matrix multiplication works
            at = at.translate(this.screen_left_, this.screen_bottom_);
            at = at.scale(this.pixel_per_unit_x_, -this.pixel_per_unit_y_);
            at = at.translate(-this.sim_left_, -this.sim_bottom_);
            this.transform_ = at;
        }
        /**
         * Creates a CoordMap that fits a simulation coordinates rectangle inside a
         * screen coordinates rectangle in accordance with alignment options and aspect ratio.
         * Calculates the origin and scale, which define the coordinate mapping.
         *
         * The mapping is calculated so that the given simulation rectangle transforms to be
         * the largest possible rectangle that fits inside the given screen rectangle, subject to
         * various alignment options. The alignment options are similar to typical word processor
         * alignment options such as left, center, right, or full justification. In the following
         * diagrams the simulation rectangle is the smaller bold bordered rectangle, inside the
         * larger screen rectangle.
         *
         *  ┌──────────────────────────────────────────────────┐
         *  │┏━━━━━━━━━━━━━━━━┓                                │
         *  │┃                ┃                                │
         *  │┃                ┃                                │
         *  │┃    x: left     ┃                                │
         *  │┃                ┃                                │
         *  │┃                ┃                                │
         *  │┗━━━━━━━━━━━━━━━━┛                                │
         *  └──────────────────────────────────────────────────┘
         *
         *  ┌──────────────────────────────────────────────────┐
         *  │               ┏━━━━━━━━━━━━━━━━┓                 │
         *  │               ┃                ┃                 │
         *  │               ┃                ┃                 │
         *  │               ┃   x: middle    ┃                 │
         *  │               ┃                ┃                 │
         *  │               ┃                ┃                 │
         *  │               ┗━━━━━━━━━━━━━━━━┛                 │
         *  └──────────────────────────────────────────────────┘
         *
         *  ┌──────────────────────────────────────────────────┐
         *  │                                ┏━━━━━━━━━━━━━━━━┓│
         *  │                                ┃                ┃│
         *  │                                ┃                ┃│
         *  │                                ┃    x: right    ┃│
         *  │                                ┃                ┃│
         *  │                                ┃                ┃│
         *  │                                ┗━━━━━━━━━━━━━━━━┛│
         *  └──────────────────────────────────────────────────┘
         *
         * Both horizontal and vertical dimensions (x and y) have alignments. One of x or y
         * will determine the scale and will fully span the screen rectangle; the alignment
         * option only affects the other axis. In the diagrams above, the alignment of the y axis
         * is ignored; the alignment only matters for the x placement.
         *
         * Suppose the first diagram above had `LEFT` horizontal alignment and
         * `TOP` vertical alignment, but then the screen rectangle changed to be tall
         * and narrow; then we would see the first picture below. Other vertical alignment
         * options are shown as well.
         *
         *  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
         *  │┏━━━━━━━━━━━━━━━━┓│     │                  │     │                  │
         *  │┃                ┃│     │                  │     │                  │
         *  │┃    x: left     ┃│     │                  │     │                  │
         *  │┃    y: top      ┃│     │                  │     │                  │
         *  │┃                ┃│     │┏━━━━━━━━━━━━━━━━┓│     │                  │
         *  │┃                ┃│     │┃                ┃│     │                  │
         *  │┗━━━━━━━━━━━━━━━━┛│     │┃    x: left     ┃│     │                  │
         *  │                  │     │┃    y: middle   ┃│     │                  │
         *  │                  │     │┃                ┃│     │                  │
         *  │                  │     │┃                ┃│     │┏━━━━━━━━━━━━━━━━┓│
         *  │                  │     │┗━━━━━━━━━━━━━━━━┛│     │┃                ┃│
         *  │                  │     │                  │     │┃    x: left     ┃│
         *  │                  │     │                  │     │┃    y: bottom   ┃│
         *  │                  │     │                  │     │┃                ┃│
         *  │                  │     │                  │     │┃                ┃│
         *  │                  │     │                  │     │┗━━━━━━━━━━━━━━━━┛│
         *  └──────────────────┘     └──────────────────┘     └──────────────────┘
         *
         * `FULL` ensures that for the chosen axis the simulation and screen rectangles
         * coincide. When both x and y have `FULL`, then the simulation and screen rectangles
         * will coincide but the aspect ratio is altered, so an image from the simulation may
         * appear squashed or stretched (see definition of aspect ratio below). For example, the
         * square simulation rectangle from our earlier examples is stretched out here:
         *
         *  ┌──────────────────────────────────────────────────┐
         *  │┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓│
         *  │┃                                                ┃│
         *  │┃                                                ┃│
         *  │┃             x:full, y:full                     ┃│
         *  │┃                                                ┃│
         *  │┃                                                ┃│
         *  │┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
         *  └──────────────────────────────────────────────────┘
         *
         * When only one of the axes has `FULL`, the simulation rectangle
         * might not entirely fit into the screen rectangle as the following example shows, but
         * the aspect ratio is preserved.
         *
         *   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┃                                                ┃
         *  ┌┃────────────────────────────────────────────────┃┐
         *  │┃                                                ┃│
         *  │┃                                                ┃│
         *  │┃            x:full, y:middle                    ┃│
         *  │┃                                                ┃│
         *  │┃                                                ┃│
         *  └┃────────────────────────────────────────────────┃┘
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┃                                                ┃
         *   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
         *
         * The aspect ratio is the ratio of 'pixels per simulation unit along y axis' divided
         * by 'pixels per simulation unit along x axis'. The default aspect ratio is 1.0, so x
         * and y are treated identically with distance being measured the same in each direction.
         * An aspect ratio other than 1.0 will squash or stretch the image.  Note that aspect
         * ratio is ignored when both x and y axes have `FULL` specified.
         *
         * The simulation rectangle, screen rectangle, alignment options, and aspect ratio are
         * only used to initially determine the coordinate transformation; they are not stored by
         * the CoordMap.
         *
         * @param screenRect  the screen space rectangle to fit the sim rect into
         * @param simRect  the simulation space rectangle to be fit into the screenRect
         * @param horizAlign  horizontal alignment option; default is `HorizAlign.MIDDLE`
         * @param verticalAlign  vertical alignment option; default is`VerticalAlign.MIDDLE`
         * @param aspectRatio  the ratio of 'pixels per simulation unit along y axis'
         * divided by 'pixels per simulation unit along x axis';  default is 1.0
         * @return the CoordMap corresponding to the given options
         */
        CoordMap.make = function (screenRect, simRect, horizAlign, verticalAlign, aspectRatio) {
            if (horizAlign === void 0) { horizAlign = exports.AlignH.MIDDLE; }
            if (verticalAlign === void 0) { verticalAlign = exports.AlignV.MIDDLE; }
            if (aspectRatio === void 0) { aspectRatio = 1; }
            if (aspectRatio < MIN_SIZE || !isFinite(aspectRatio)) {
                throw new Error('bad aspectRatio ' + aspectRatio);
            }
            var simLeft = simRect.getLeft();
            var simBottom = simRect.getBottom();
            var sim_width = simRect.getRight() - simLeft;
            var sim_height = simRect.getTop() - simBottom;
            if (sim_width < MIN_SIZE || sim_height < MIN_SIZE) {
                throw new Error('simRect cannot be empty ' + simRect);
            }
            var screen_top = screenRect.getTop();
            var screen_left = screenRect.getLeft();
            var screen_width = screenRect.getWidth();
            var screen_height = screenRect.getHeight();
            var offset_x = 0;
            var offset_y = 0;
            var pixel_per_unit_x = 0;
            var pixel_per_unit_y = 0;
            // FULL = simRect matches the screenRect
            if (horizAlign === exports.AlignH.FULL) {
                pixel_per_unit_x = screen_width / sim_width;
                offset_x = 0;
            }
            if (verticalAlign === exports.AlignV.FULL) {
                pixel_per_unit_y = screen_height / sim_height;
                offset_y = 0;
            }
            if (horizAlign !== exports.AlignH.FULL || verticalAlign !== exports.AlignV.FULL) {
                // find scale (pixel_per_unit) for both x and y
                // aspectRatio = pixel_per_unit_y/pixel_per_unit_x
                // horizFull = true means: x axis has full-justification
                var horizFull = void 0;
                if (horizAlign === exports.AlignH.FULL) {
                    pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                    horizFull = true;
                }
                else if (verticalAlign === exports.AlignV.FULL) {
                    pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                    horizFull = false;
                }
                else {
                    // figure out which of x or y limits the size
                    // first assume x determines the size.
                    // definition: pixel_per_unit = screen_distance / sim_distance
                    pixel_per_unit_x = screen_width / sim_width;
                    pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                    horizFull = true;
                    var ideal_height = Math.floor(0.5 + pixel_per_unit_y * sim_height);
                    if (screen_height < ideal_height) { // height is limiting factor
                        pixel_per_unit_y = screen_height / sim_height;
                        pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                        horizFull = false;
                    }
                }
                // use alignment to figure out offset (and therefore origin location)
                if (!horizFull) {
                    // y is 'full justified':  simRect matches the screenRect on y axis
                    offset_y = 0;
                    var ideal_width = Math.floor(0.5 + sim_width * pixel_per_unit_x);
                    switch (horizAlign) {
                        case exports.AlignH.LEFT:
                            offset_x = 0;
                            break;
                        case exports.AlignH.MIDDLE:
                            offset_x = (screen_width - ideal_width) / 2;
                            break;
                        case exports.AlignH.RIGHT:
                            offset_x = screen_width - ideal_width;
                            break;
                        default: throw new Error();
                    }
                }
                else {
                    // x is 'full justified':  simRect matches the screenRect on x axis
                    offset_x = 0;
                    var ideal_height = Math.floor(0.5 + sim_height * pixel_per_unit_y);
                    switch (verticalAlign) {
                        case exports.AlignV.BOTTOM:
                            offset_y = 0;
                            break;
                        case exports.AlignV.MIDDLE:
                            offset_y = (screen_height - ideal_height) / 2;
                            break;
                        case exports.AlignV.TOP:
                            offset_y = screen_height - ideal_height;
                            break;
                        default: {
                            throw new Error();
                        }
                    }
                }
            }
            var coordMap = new CoordMap(screen_left, screen_top + screen_height, simLeft - offset_x / pixel_per_unit_x, simBottom - offset_y / pixel_per_unit_y, pixel_per_unit_x, pixel_per_unit_y);
            return coordMap;
        };
        /**
         * Returns true if the object is likely a CoordMap. Only works under simple
         * compilation, intended for interactive non-compiled code.
         * @param obj the object of interest
         * @return true if the object is likely a CoordMap
         */
        CoordMap.isDuckType = function (obj) {
            if (obj instanceof CoordMap) {
                return true;
            }
            return obj.getAffineTransform !== undefined
                && obj.simToScreenX !== undefined
                && obj.simToScreenY !== undefined
                && obj.screenToSimX !== undefined
                && obj.screenToSimY !== undefined
                && obj.getScaleX !== undefined
                && obj.getScaleY !== undefined;
        };
        /**
         * Returns an AffineTransform that maps simulation coordinates to screen coordinates
         * using the mapping defined by this CoordMap.
         * @return the AffineTransform equivalent of this CoordMap
         */
        CoordMap.prototype.getAffineTransform = function () {
            return this.transform_;
        };
        /**
         * Returns the horizontal scaling factor: the screen pixels per simulation space
         * unit along x axis.
         * @return the horizontal scaling factor: screen pixels per unit of simulation
         * space in x direction
         */
        CoordMap.prototype.getScaleX = function () {
            return this.pixel_per_unit_x_;
        };
        /**
         * Returns the vertical scaling factor: the screen pixels per simulation space
         * unit along y axis.
         * @return the vertical scaling factor: screen pixels per unit of simulation
         * space in y direction
         */
        CoordMap.prototype.getScaleY = function () {
            return this.pixel_per_unit_y_;
        };
        /**
         * Translates a point in screen coordinates to simulation coordinates.
         * @param scr_x horizontal position in screen coordinates.
         * @param scr_y vertical position in screen coordinates
         */
        CoordMap.prototype.screenToSim = function (scr_x, scr_y) {
            return new Point(this.screenToSimX(scr_x), this.screenToSimY(scr_y));
        };
        /**
         * Translates the given screen coordinates rectangle into simulation coordinates.
         * @param rect the rectangle in screen coordinates
         * @return the equivalent rectangle in simulation coordinates
         */
        CoordMap.prototype.screenToSimRect = function (rect) {
            return new DoubleRect(this.screenToSimX(rect.getLeft()), this.screenToSimY(rect.getTop() + rect.getHeight()), this.screenToSimX(rect.getLeft() + rect.getWidth()), this.screenToSimY(rect.getTop()));
        };
        /**
         * Returns the equivalent length in simulation coordinates of the given horizontal
         * length in screen coordinates.
         * @param scr_x a horizontal length in screen coordinates
         * @return the equivalent length in simulation coordinates
         */
        CoordMap.prototype.screenToSimScaleX = function (scr_x) {
            return scr_x / this.pixel_per_unit_x_;
        };
        /**
         * Returns the equivalent length in simulation coordinates of the given vertical
         * length in screen coordinates.
         * @param scr_y a vertical length in screen coordinates
         * @return the equivalent length in simulation coordinates
         */
        CoordMap.prototype.screenToSimScaleY = function (scr_y) {
            return scr_y / this.pixel_per_unit_y_;
        };
        /**
         * Translates a horizontal screen coordinate to simulation coordinates.
         * @param scr_x horizontal position in screen coordinates
         * @return the equivalent position in simulation coordinates
         */
        CoordMap.prototype.screenToSimX = function (scr_x) {
            return this.sim_left_ + (scr_x - this.screen_left_) / this.pixel_per_unit_x_;
        };
        /**
         * Translates a vertical screen coordinate to simulation coordinates.
         * @param scr_y vertical position in screen coordinates
         * @return the equivalent position in simulation coordinates
         */
        CoordMap.prototype.screenToSimY = function (scr_y) {
            return this.sim_bottom_ + (this.screen_bottom_ - scr_y) / this.pixel_per_unit_y_;
        };
        /**
         * Translates a point from simulation coordinates to screen coordinates.
         * @param p_sim the point in simulation coordinates to translate
         * @return the point translated to screen coordinates
         */
        CoordMap.prototype.simToScreen = function (p_sim) {
            return new Point(this.simToScreenX(p_sim.x), this.simToScreenY(p_sim.y));
        };
        /**
         * Translates the given simulation coordinates rectangle into screen coordinates.
         * @param r the rectangle in simulation coordinates
         * @return the equivalent rectangle in screen coordinates
         */
        CoordMap.prototype.simToScreenRect = function (r) {
            return new ScreenRect(this.simToScreenX(r.getLeft()), this.simToScreenY(r.getTop()), this.simToScreenScaleX(r.getWidth()), this.simToScreenScaleY(r.getHeight()));
        };
        /**
         * Returns the equivalent length in screen coordinates of the given horizontal length
         * in simulation coordinates.
         * @param length_x a horizontal length in simulation coordinates
         * @return the equivalent length in screen coordinates
         */
        CoordMap.prototype.simToScreenScaleX = function (length_x) {
            return length_x * this.pixel_per_unit_x_;
        };
        /**
         * Returns the equivalent length in screen coordinates of the given vertical length
         * in simulation coordinates.
         * @param length_y a vertical length in simulation coordinates
         * @return the equivalent length in screen coordinates
         */
        CoordMap.prototype.simToScreenScaleY = function (length_y) {
            return length_y * this.pixel_per_unit_y_;
        };
        /**
         * Translates a horizontal simulation coordinate to screen coordinates.
         * @param sim_x horizontal position in simulation coordinates
         * @return the equivalent position in screen coordinates
         */
        CoordMap.prototype.simToScreenX = function (sim_x) {
            return this.screen_left_ + (sim_x - this.sim_left_) * this.pixel_per_unit_x_;
        };
        /**
         * Translates a vertical simulation coordinate to screen coordinates.
         * @param sim_y vertical position in simulation coordinate
         * @return the equivalent position in screen coordinates
         */
        CoordMap.prototype.simToScreenY = function (sim_y) {
            return this.screen_bottom_ - (sim_y - this.sim_bottom_) * this.pixel_per_unit_y_;
        };
        return CoordMap;
    }());

    /**
     * @hidden
     * @param xs
     * @param start
     * @param opt_end
     * @returns
     */
    function slice(xs, start, opt_end) {
        // passing 1 arg to slice is not the same as passing 2 where the second is
        // null or undefined (in that case the second argument is treated as 0).
        // we could use slice on the arguments object and then use apply instead of
        // testing the length
        if (arguments.length <= 2) {
            return Array.prototype.slice.call(xs, start);
        }
        else {
            return Array.prototype.slice.call(xs, start, opt_end);
        }
    }
    /**
     * @hidden
     * @param xs
     * @param index
     * @param howMany
     * @param var_args
     * @returns
     */
    function splice(xs, index, howMany, var_args) {
        return Array.prototype.splice.apply(xs, slice(arguments, 1));
    }
    /**
     * @hidden
     * Inserts an object at the given index of the array.
     * @param xs The array to modify.
     * @param x The object to insert.
     * @param index The index at which to insert the object. If omitted,
     *      treated as 0. A negative index is counted from the end of the array.
     */
    function insertAt(xs, x, index) {
        if (index === void 0) { index = 0; }
        splice(xs, index, 0, x);
    }

    // Copyright 2017 David Holmes.  All Rights Reserved.
    /**
     * Displays a set of DisplayObject(s)}, which show the state of the simulation.
     * A DisplayObject typically represents a SimObject, but not always.
     *
     * zzIndex
     * ------
     * DisplayObjects with a lower `zIndex` appear underneath those with higher `zIndex`.
     * The DisplayList is sorted by `zIndex`.
     * @hidden
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

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     */
    var SimView = /** @class */ (function (_super) {
        __extends(SimView, _super);
        /**
         *
         */
        function SimView(simRect) {
            var _this = _super.call(this) || this;
            /**
             * when panning horizontally, this is percentage of width to move.
             */
            _this.panX = 0.05;
            /**
             * when panning vertically, this is percentage of height to move.
             */
            _this.panY = 0.05;
            /**
             * when zooming, this is percentage of size to zoom
             */
            _this.zoom = 1.1;
            /**
             * The rectangle in screen coordinates where this SimView exists inside the LabCanvas.
             */
            _this.screenRect_ = new ScreenRect(0, 0, 800, 600);
            _this.horizAlign_ = exports.AlignH.MIDDLE;
            _this.verticalAlign_ = exports.AlignV.MIDDLE;
            _this.aspectRatio_ = 1.0;
            /**
             * This list of DisplayObjects that this SimView displays
             */
            _this.displayList_ = new DisplayList();
            _this.scaleTogether_ = true;
            /**
             * The transparency used when painting the drawables; a number between
             * 0.0 (fully transparent) and 1.0 (fully opaque).
             */
            _this.opaqueness = 1.0;
            _this.memorizables_ = [];
            if (!(simRect instanceof DoubleRect) || simRect.isEmpty()) {
                throw new Error('bad simRect: ' + simRect);
            }
            _this.simRect_ = simRect;
            _this.coordMap_ = CoordMap.make(_this.screenRect_, _this.simRect_, _this.horizAlign_, _this.verticalAlign_, _this.aspectRatio_);
            _this.width_ = simRect.getWidth();
            _this.height_ = simRect.getHeight();
            _this.centerX_ = simRect.getCenterX();
            _this.centerY_ = simRect.getCenterY();
            _this.ratio_ = _this.height_ / _this.width_;
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_WIDTH, function () { return _this.getWidth(); }, function (width) { return _this.setWidth(width); }));
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_HEIGHT, function () { return _this.getHeight(); }, function (height) { return _this.setHeight(height); }));
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_CENTER_X, function () { return _this.getCenterX(); }, function (centerX) { return _this.setCenterX(centerX); }).setLowerLimit(Number.NEGATIVE_INFINITY));
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_CENTER_Y, function () { return _this.getCenterY(); }, function (centerY) { return _this.setCenterY(centerY); }).setLowerLimit(Number.NEGATIVE_INFINITY));
            _this.addParameter(new ParameterBoolean(_this, SimView.PARAM_NAME_SCALE_TOGETHER, function () { return _this.getScaleTogether(); }, function (scaleTogether) { return _this.setScaleTogether(scaleTogether); }));
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_VERTICAL_ALIGN, function () { return _this.vAxisAlign; }, function (vAxisAlign) { return _this.vAxisAlign = vAxisAlign; }));
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_HORIZONTAL_ALIGN, function () { return _this.hAxisAlign; }, function (hAxisAlign) { return _this.hAxisAlign = hAxisAlign; }));
            _this.addParameter(new ParameterNumber(_this, SimView.PARAM_NAME_ASPECT_RATIO, function () { return _this.getAspectRatio(); }, function (aspectRatio) { return _this.setAspectRatio(aspectRatio); }));
            return _this;
        }
        SimView.prototype.addMemo = function (memorizable) {
            if (!contains(this.memorizables_, memorizable)) {
                this.memorizables_.push(memorizable);
            }
        };
        /**
         *
         */
        SimView.prototype.gainFocus = function () {
            // Do nothing.
        };
        /**
         * Returns the ratio of 'pixels per simulation unit along y axis' divided
         * by 'pixels per simulation unit along x axis' used when displaying this LabView.
         */
        SimView.prototype.getAspectRatio = function () {
            return this.aspectRatio_;
        };
        /**
         * Returns the horizontal coordinate of simulation rectangle's center.
         */
        SimView.prototype.getCenterX = function () {
            return this.centerX_;
        };
        /**
         * Returns the vertical coordinate of simulation rectangle's center.
         */
        SimView.prototype.getCenterY = function () {
            return this.centerY_;
        };
        SimView.prototype.getCoordMap = function () {
            return this.coordMap_; // it is immutable, so OK to return it
        };
        SimView.prototype.getDisplayList = function () {
            return this.displayList_;
        };
        /**
         * Returns height of the simulation rectangle.
         */
        SimView.prototype.getHeight = function () {
            return this.height_;
        };
        Object.defineProperty(SimView.prototype, "hAxisAlign", {
            /**
             * Returns the horizontal alignment to use when aligning the SimView's
             * simulation rectangle within its screen rectangle.
             */
            get: function () {
                return this.horizAlign_;
            },
            /**
             * Sets the horizontal alignment to use when aligning the SimView's
             * simulation rectangle within its screen rectangle.
             */
            set: function (alignHoriz) {
                this.horizAlign_ = alignHoriz;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_HORIZONTAL_ALIGN);
            },
            enumerable: false,
            configurable: true
        });
        SimView.prototype.getMemos = function () {
            return clone(this.memorizables_);
        };
        /**
         * Whether the width and height of the simulation rectangle scale together; if
         * true then changing one causes the other to change proportionally.
         */
        SimView.prototype.getScaleTogether = function () {
            return this.scaleTogether_;
        };
        SimView.prototype.getScreenRect = function () {
            return this.screenRect_; // it is immutable, so OK to return it
        };
        SimView.prototype.getSimRect = function () {
            return this.simRect_;
        };
        Object.defineProperty(SimView.prototype, "vAxisAlign", {
            /**
             * Returns the vertical alignment to use when aligning the SimView's
             * simulation rectangle within its screen rectangle.
             */
            get: function () {
                return this.verticalAlign_;
            },
            /**
             * Sets the vertical alignment to use when aligning the SimView's
             * simulation rectangle within its screen rectangle.
             */
            set: function (alignVert) {
                this.verticalAlign_ = alignVert;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_VERTICAL_ALIGN);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the width of the simulation rectangle.
         */
        SimView.prototype.getWidth = function () {
            return this.width_;
        };
        SimView.prototype.loseFocus = function () {
            // Do nothing.
        };
        SimView.prototype.paint = function (context) {
            context.save();
            context.globalAlpha = this.opaqueness;
            this.displayList_.draw(context, this.coordMap_);
            context.restore();
        };
        SimView.prototype.setCoordMap = function (map) {
            if (!CoordMap.isDuckType(map))
                throw new Error('not a CoordMap: ' + map);
            this.coordMap_ = map;
            this.broadcast(new GenericEvent(this, SimView.COORD_MAP_CHANGED));
        };
        SimView.prototype.setScreenRect = function (screenRect) {
            if (!ScreenRect.isDuckType(screenRect))
                throw new Error('not a ScreenRect: ' + screenRect);
            if (screenRect.isEmpty()) {
                throw new Error('empty screenrect');
            }
            if (!this.screenRect_.equals(screenRect)) {
                this.screenRect_ = screenRect;
                this.realign();
                this.broadcast(new GenericEvent(this, SimView.SCREEN_RECT_CHANGED));
            }
        };
        SimView.prototype.setSimRect = function (simRect) {
            if (!DoubleRect.isDuckType(simRect))
                throw new Error('not a DoubleRect: ' + simRect);
            if (!simRect.equals(this.simRect_)) {
                this.simRect_ = simRect;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_WIDTH);
                this.broadcastParameter(SimView.PARAM_NAME_HEIGHT);
                this.broadcastParameter(SimView.PARAM_NAME_CENTER_X);
                this.broadcastParameter(SimView.PARAM_NAME_CENTER_Y);
                this.broadcast(new GenericEvent(this, SimView.SIM_RECT_CHANGED));
            }
        };
        SimView.prototype.memorize = function () {
            for (var i = 0, n = this.memorizables_.length; i < n; i++) {
                this.memorizables_[i].memorize();
            }
        };
        SimView.prototype.realign = function () {
            this.setCoordMap(CoordMap.make(this.screenRect_, this.simRect_, this.horizAlign_, this.verticalAlign_, this.aspectRatio_));
            this.width_ = this.simRect_.getWidth();
            this.height_ = this.simRect_.getHeight();
            this.centerX_ = this.simRect_.getCenterX();
            this.centerY_ = this.simRect_.getCenterY();
            this.ratio_ = this.height_ / this.width_;
        };
        /**
         * Modifies the simulation rectangle of the target SimView according to our
         * current settings for width, height, centerX, centerY.
         */
        SimView.prototype.modifySimRect = function () {
            var left = this.centerX_ - this.width_ / 2.0;
            var bottom = this.centerY_ - this.height_ / 2.0;
            var r = new DoubleRect(left, bottom, left + this.width_, bottom + this.height_);
            this.setSimRect(r);
        };
        /**
         * Moves the center of the simulation rectangle (the 'camera') down by fraction
         * {@link #panY}, which causes the image to move up.
         * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
         */
        SimView.prototype.panDown = function () {
            this.setCenterY(this.centerY_ - this.panY * this.height_);
        };
        /**
         * Moves the center of the simulation rectangle (the 'camera') left by fraction
         * {@link #panY}, which causes the image to move right.
         * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
         */
        SimView.prototype.panLeft = function () {
            this.setCenterX(this.centerX_ - this.panX * this.width_);
        };
        /**
         * Moves the center of the simulation rectangle (the 'camera') right by fraction
         * {@link #panY}, which causes the image to move left.
         * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
         */
        SimView.prototype.panRight = function () {
            this.setCenterX(this.centerX_ + this.panX * this.width_);
        };
        /**
         * Moves the center of the simulation rectangle (the 'camera') up by fraction
         * {@link #panY}, which causes the image to move down.
         * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
         */
        SimView.prototype.panUp = function () {
            this.setCenterY(this.centerY_ + this.panY * this.height_);
        };
        /**
         *
         */
        SimView.prototype.removeMemo = function (memorizable) {
            remove(this.memorizables_, memorizable);
        };
        /**
         * Sets the ratio of 'pixels per simulation unit along y axis' divided
         * by 'pixels per simulation unit along x axis' used when displaying this LabView.
         * @param {number} aspectRatio the aspect ratio used when displaying this LabView
         */
        SimView.prototype.setAspectRatio = function (aspectRatio) {
            if (veryDifferent(this.aspectRatio_, aspectRatio)) {
                this.aspectRatio_ = aspectRatio;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_ASPECT_RATIO);
            }
        };
        /**
         * Sets the horizontal coordinate of simulation rectangle's center,
         * and broadcasts a {@link #SIM_RECT_CHANGED} event.
         * @param centerX the horizontal coordinate of simulation rectangle's center.
         */
        SimView.prototype.setCenterX = function (centerX) {
            if (veryDifferent(this.centerX_, centerX)) {
                this.centerX_ = centerX;
                this.modifySimRect();
            }
        };
        /**
         * Sets the vertical coordinate of simulation rectangle's center,
         * and broadcasts a {@link #SIM_RECT_CHANGED} event.
         * @param {number} value the vertical coordinate of simulation rectangle's center.
         */
        SimView.prototype.setCenterY = function (value) {
            if (veryDifferent(this.centerY_, value)) {
                this.centerY_ = value;
                this.modifySimRect();
            }
        };
        /**
         * Sets height of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
         * @param {number} value height of the simulation rectangle
         */
        SimView.prototype.setHeight = function (value) {
            if (veryDifferent(this.height_, value)) {
                this.height_ = value;
                if (this.scaleTogether_) {
                    this.width_ = this.height_ / this.ratio_;
                }
                this.modifySimRect();
            }
        };
        /**
         * Sets whether the width and height of the simulation rectangle scale together; if
         * true then changing one causes the other to change proportionally.
         * @param {boolean} value whether width and height scale together
         */
        SimView.prototype.setScaleTogether = function (value) {
            if (this.scaleTogether_ !== value) {
                this.scaleTogether_ = value;
                if (this.scaleTogether_) {
                    this.ratio_ = this.height_ / this.width_;
                }
                this.broadcastParameter(SimView.PARAM_NAME_SCALE_TOGETHER);
            }
        };
        /**
         * Sets width of the simulation rectangle, and broadcasts a {@link #SIM_RECT_CHANGED} event.
         * @param value width of the simulation rectangle
         */
        SimView.prototype.setWidth = function (value) {
            if (veryDifferent(this.width_, value)) {
                this.width_ = value;
                if (this.scaleTogether_) {
                    this.height_ = this.width_ * this.ratio_;
                }
                this.modifySimRect();
            }
        };
        /**
         * Makes the height of the simulation rectangle smaller by fraction 1/{@link #zoom},
         * and also the width if {@link #getScaleTogether} is true.
         * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
         */
        SimView.prototype.zoomIn = function () {
            this.setHeight(this.height_ / this.zoom);
        };
        /**
         * Makes the height of the simulation rectangle bigger by fraction {@link #zoom},
         * and also the width if {@link #getScaleTogether} is true.
         * Also broadcasts a {@link #SIM_RECT_CHANGED} event.
         */
        SimView.prototype.zoomOut = function () {
            this.setHeight(this.height_ * this.zoom);
        };
        SimView.PARAM_NAME_WIDTH = 'width';
        SimView.PARAM_NAME_HEIGHT = 'height';
        SimView.PARAM_NAME_CENTER_X = 'center-x';
        SimView.PARAM_NAME_CENTER_Y = 'center-y';
        SimView.PARAM_NAME_HORIZONTAL_ALIGN = 'horizontal-align';
        SimView.PARAM_NAME_VERTICAL_ALIGN = 'vertical-align';
        SimView.PARAM_NAME_ASPECT_RATIO = 'aspect-ratio';
        SimView.PARAM_NAME_SCALE_TOGETHER = 'scale X-Y together';
        /**
         * Name of event broadcast when the CoordMap changes, see {@link #setCoordMap}.
         */
        SimView.COORD_MAP_CHANGED = 'COORD_MAP_CHANGED';
        /**
         * Name of event broadcast when the screen rectangle size changes, see
         */
        SimView.SCREEN_RECT_CHANGED = 'SCREEN_RECT_CHANGED';
        /**
         * Name of event broadcast when the simulation rectangle size changes, see
         */
        SimView.SIM_RECT_CHANGED = 'SIM_RECT_CHANGED';
        return SimView;
    }(AbstractSubject));

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     * Watches the VarsList of one or more GraphLines to calculate the range
     * rectangle that encloses the points on the graphs, and sets accordingly the simRect of a
     * SimView. The range rectangle is the smallest rectangle that contains all the points, but
     * possibly expanded by the `extraMargin` factor.
     *
     * Enabled and Active
     *
     * To entirely disable an AutoScale, see `enabled`.
     * Assuming the AutoScale is enabled, it will react to events in the SimView and GraphLines as follows:
     *
     * + AutoScale becomes **inactive** when the SimView's simRect is changed by an entity
     * other than this AutoScale. This happens when AutoScale observes a SimView event called
     * `LabView.SIM_RECT_CHANGED`.
     *
     * + AutoScale becomes **active** when one of its GraphLines broadcasts a `RESET` event.
     * This happens when a graph is cleared, or when the X or Y variable is changed.
     *
     * You can also call `active` directly to make an enabled AutoScale active or
     * inactive.
     *
     * ### Time Graph
     *
     * For a *time graph* where one variable is time, the range rectangle in the time dimension
     * has a fixed size specified by {@link #setTimeWindow}. The default time window is 10
     * seconds.
     *
     * ### Events Broadcast
     *
     * GenericEvent named {@link #AUTO_SCALE} is broadcast when the range rectangle changes.
     *
     * ### Parameters Created
     *
     * + ParameterNumber named `AutoScale.TIME_WINDOW`
     * see {@link #setTimeWindow}.
     *
     * + ParameterNumber named `AutoScale.AXIS`
     * see `axisChoice`.
     */
    var AutoScale = /** @class */ (function (_super) {
        __extends(AutoScale, _super);
        /**
         * @param simView the SimView whose simRect will be modified to the range rectangle.
         */
        function AutoScale(simView) {
            var _this = _super.call(this) || this;
            /**
             * The GraphLines to auto-scale.
             */
            _this.graphLines_ = [];
            _this.enabled_ = true;
            _this.isActive_ = true;
            /**
             * Indicates that the SIM_RECT_CHANGED event was generated by this AutoScale.
             */
            _this.ownEvent_ = false;
            /**
             * `false` indicates that the range has never been set based on graph data
             */
            _this.rangeSetX_ = false;
            /**
             * `false` indicates that the range has never been set based on graph data
             */
            _this.rangeSetY_ = false;
            /**
             * the maximum horizontal value of the range, used for calculating the scale
             */
            _this.rangeXHi_ = 0;
            /**
             * the minimum horizontal value of the range, used for calculating the scale
             */
            _this.rangeXLo_ = 0;
            /**
             * the maximum vertical value of the range, used for calculating the scale
             */
            _this.rangeYHi_ = 0;
            /**
             * the minimum vertical value of the range, used for calculating the scale
             */
            _this.rangeYLo_ = 0;
            /**
             * Length of time to include in the range rectangle for a 'time graph'.
             */
            _this.timeWindow_ = 10;
            /**
             * How much extra margin to allocate when expanding the graph range: a fraction
             * typically between 0.0 and 1.0, adds this fraction times the current horizontal or
             * vertical range.
             * This does not guarantee a margin of this amount, it merely reduces the
             * frequency of range expansion.  You could for example expand the range, and then
             * have succeeding points come very close to the new range so that the graph goes
             * very close to the edge but stays within the range.
             */
            _this.extraMargin = 0.01;
            /**
             * Minimum size that range rectangle can be, for width and height.
             */
            _this.minSize = 1E-14;
            _this.axisChoice_ = exports.AxisChoice.BOTH;
            _this.simView_ = simView;
            simView.addMemo(_this);
            simView.addObserver(_this);
            _this.lastIndex_ = repeat(-1, _this.graphLines_.length);
            _this.addParameter(new ParameterNumber(_this, AutoScale.TIME_WINDOW, function () { return _this.timeWindow; }, function (timeWindow) { return _this.timeWindow = timeWindow; }).setSignifDigits(3));
            var choiceNames = ['VERTICAL', 'HORIZONTAL', 'BOTH'];
            var choices = [exports.AxisChoice.VERTICAL, exports.AxisChoice.HORIZONTAL, exports.AxisChoice.BOTH];
            _this.addParameter(new ParameterNumber(_this, AutoScale.AXIS, function () { return _this.axisChoice; }, function (axisChoice) { return _this.axisChoice = axisChoice; }, choiceNames, choices));
            _this.setComputed(_this.isActive_);
            return _this;
        }
        /**
         * Add a GraphLine which will be observed to calculate the range rectangle of points
         * on the line.
         * @param graphLine the GraphLine to add
         */
        AutoScale.prototype.addGraphLine = function (graphLine) {
            if (GraphLine.isDuckType(graphLine)) {
                if (!contains(this.graphLines_, graphLine)) {
                    this.graphLines_.push(graphLine);
                    graphLine.addObserver(this);
                    this.lastIndex_.push(-1);
                }
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        /**
         * Clears the range rectangle, continues calculating from latest entry in HistoryList.
         */
        AutoScale.prototype.clearRange = function () {
            this.rangeXLo_ = 0;
            this.rangeXHi_ = 0;
            this.rangeSetX_ = false;
            this.rangeYLo_ = 0;
            this.rangeYHi_ = 0;
            this.rangeSetY_ = false;
        };
        Object.defineProperty(AutoScale.prototype, "active", {
            /**
             * Returns whether is AutoScale is active.
             * @return whether is AutoScale is active
             */
            get: function () {
                return this.isActive_;
            },
            /**
             * Sets whether this AutoScale is active.  When not active, the range rectangle
             * is not updated and the SimView's simulation rectangle is not modified. When changed
             * to be active, this will also call {@link #reset}.
             *
             * The AutoScale must be enabled in order to become active, see `enabled`.
             * If not enabled, then this method can only make the AutoScale inactive.
             * @param value whether this AutoScale should be active
             */
            set: function (value) {
                if (this.isActive_ !== value) {
                    if (value) {
                        if (this.enabled_) {
                            this.reset();
                            this.simView_.addMemo(this);
                            this.setComputed(true);
                            this.isActive_ = true;
                            this.broadcast(new GenericEvent(this, AutoScale.ACTIVE, this.isActive_));
                        }
                    }
                    else {
                        this.simView_.removeMemo(this);
                        this.setComputed(false);
                        this.isActive_ = false;
                        this.broadcast(new GenericEvent(this, AutoScale.ACTIVE, this.isActive_));
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AutoScale.prototype, "axisChoice", {
            /**
             * Returns which axis should be auto scaled.
             */
            get: function () {
                return this.axisChoice_;
            },
            /**
             * Set which axis to auto scale.
             */
            set: function (value) {
                if (value === exports.AxisChoice.VERTICAL || value === exports.AxisChoice.HORIZONTAL || value === exports.AxisChoice.BOTH) {
                    this.axisChoice_ = value;
                    this.broadcastParameter(AutoScale.AXIS);
                }
                else {
                    throw new Error('unknown ' + value);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AutoScale.prototype, "enabled", {
            /**
             * Returns whether is AutoScale is enabled.  See `enabled`.
             * @return whether is AutoScale is enabled
             */
            get: function () {
                return this.enabled_;
            },
            /**
             * Sets whether this AutoScale is enabled. The AutoScale must be enabled in order
             * to be active.  See `active`.
             * @param value whether this AutoScale should be enabled
             */
            set: function (enabled) {
                if (this.enabled_ !== enabled) {
                    this.enabled_ = enabled;
                    this.active = enabled;
                    this.broadcast(new GenericEvent(this, AutoScale.ENABLED, this.enabled_));
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the range rectangle that encloses points on the GraphLines, including any
         * extra margin. Note that this rectangle might not correspond to the SimView's simulation
         * rectangle, see `axisChoice`.
         * @return the range rectangle that encloses points on the GraphLines
         */
        AutoScale.prototype.getRangeRect = function () {
            return new DoubleRect(this.rangeXLo_, this.rangeYLo_, this.rangeXHi_, this.rangeYHi_);
        };
        Object.defineProperty(AutoScale.prototype, "timeWindow", {
            /**
             * Returns length of time to include in the range rectangle for a *time graph*.
             * @return length of time to include in the range rectangle
             */
            get: function () {
                return this.timeWindow_;
            },
            /**
             * Sets length of time to include in the range rectangle for a *time graph*,
             * and sets the AutoScale to be active.
             * @param timeWindow length of time to include in the range rectangle
             */
            set: function (timeWindow) {
                if (veryDifferent(timeWindow, this.timeWindow_)) {
                    this.timeWindow_ = timeWindow;
                    this.reset();
                    // this fixes following bug: click pan-zoom control which makes AutoScale inactive;
                    // then change the time window, but nothing happens.
                    this.active = true;
                    this.broadcastParameter(AutoScale.TIME_WINDOW);
                }
            },
            enumerable: false,
            configurable: true
        });
        AutoScale.prototype.memorize = function () {
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                var graphPts = this.graphLines_[i].getGraphPoints();
                // Detect when graphLine has been reset.
                if (this.lastIndex_[i] > graphPts.getEndIndex()) {
                    this.reset();
                }
            }
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                var graphPts = this.graphLines_[i].getGraphPoints();
                var iter = graphPts.getIterator(this.lastIndex_[i]);
                while (iter.hasNext()) {
                    var gp = iter.nextValue();
                    this.updateRange_(this.graphLines_[i], gp.x, gp.y);
                    this.lastIndex_[i] = iter.getIndex();
                }
            }
            this.rangeCheck_();
        };
        AutoScale.prototype.observe = function (event) {
            if (event.getSubject() === this.simView_) {
                if (event.nameEquals(SimView.SIM_RECT_CHANGED)) {
                    if (!this.ownEvent_) {
                        // Become inactive when the SimView's simRect is changed by an entity other
                        // than this AutoScale.
                        this.active = false;
                    }
                }
            }
            else if (contains(this.graphLines_, event.getSubject())) {
                if (event.nameEquals(GraphLine.PARAM_NAME_X_VARIABLE) || event.nameEquals(GraphLine.PARAM_NAME_Y_VARIABLE)) {
                    // the GraphLine's X or Y variable has changed
                    this.reset();
                }
                else if (event.nameEquals(GraphLine.RESET)) {
                    // This has the effect of turning AutoScale back on
                    // after clicking the 'clear graph' button.
                    this.active = true;
                }
            }
        };
        /**
         * When the range rectangle changes, this will broadcast a GenericEvent named
         * `AutoScale.AUTO_SCALE`.
         */
        AutoScale.prototype.rangeCheck_ = function () {
            var e = this.minSize;
            // set range rectangle to minimum size, when range is very tiny
            // (but choose an increment that is big enough to make hi & lo different numbers)
            if (this.rangeXHi_ - this.rangeXLo_ < e) {
                var avg = (this.rangeXHi_ + this.rangeXLo_) / 2;
                var incr = Math.max(avg * e, e);
                this.rangeXHi_ = avg + incr;
                this.rangeXLo_ = avg - incr;
            }
            if (this.rangeYHi_ - this.rangeYLo_ < e) {
                var avg = (this.rangeYHi_ + this.rangeYLo_) / 2;
                var incr = Math.max(avg * e, e);
                this.rangeYHi_ = avg + incr;
                this.rangeYLo_ = avg - incr;
            }
            var nr = this.getRangeRect();
            var sr = this.simView_.getSimRect();
            if (this.axisChoice_ === exports.AxisChoice.VERTICAL) {
                // set vertical range, but retain existing horiz range
                nr = new DoubleRect(sr.getLeft(), nr.getBottom(), sr.getRight(), nr.getTop());
            }
            else if (this.axisChoice_ === exports.AxisChoice.HORIZONTAL) {
                // set horizontal range, but retain existing vertical range
                nr = new DoubleRect(nr.getLeft(), sr.getBottom(), nr.getRight(), sr.getTop());
            }
            if (this.isActive_ && !nr.nearEqual(sr)) {
                this.ownEvent_ = true;
                this.simView_.setSimRect(nr);
                this.ownEvent_ = false;
                this.broadcast(new GenericEvent(this, AutoScale.AUTO_SCALE, nr));
            }
        };
        /**
         * Remove a GraphLine, it will no longer be observed for calculating the range
         * rectangle of points on the line.
         * @param graphLine the GraphLine to remove
         */
        AutoScale.prototype.removeGraphLine = function (graphLine) {
            if (GraphLine.isDuckType(graphLine)) {
                var idx = this.graphLines_.indexOf(graphLine);
                removeAt(this.graphLines_, idx);
                removeAt(this.lastIndex_, idx);
                this.reset();
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        /**
         * Clears the range rectangle, and starts calculating from first entry in HistoryList.
         * Note that you will need to call {@link #memorize} to have the range recalculated.
         */
        AutoScale.prototype.reset = function () {
            this.clearRange();
            for (var i = 0, n = this.lastIndex_.length; i < n; i++) {
                this.lastIndex_[i] = -1;
            }
        };
        /**
         * Marks the SimView's Parameters as to whether they are automatically computed
         * depending on whether this AutoScale is active.
         * @param value whether this AutoScale is computing the Parameter values
         */
        AutoScale.prototype.setComputed = function (value) {
            var _this = this;
            var names = [SimView.PARAM_NAME_WIDTH, SimView.PARAM_NAME_HEIGHT, SimView.PARAM_NAME_CENTER_X, SimView.PARAM_NAME_CENTER_Y];
            names.forEach(function (name) {
                var p = _this.simView_.getParameter(name);
                p.setComputed(value);
            });
        };
        /**
         * Updates the graph range to include the given point. For time variable, limit the
         * range to the timeWindow. For non-time variable, expand the range an extra amount when
         * the range is exceeded; this helps avoid too many visually distracting updates.
         * @param line
         * @param nowX
         * @param nowY
         */
        AutoScale.prototype.updateRange_ = function (line, nowX, nowY) {
            // To avoid infinity in the range, store a very large number instead.
            // Largest double precision floating point number is approx 1.8 * 10^308
            if (!isFinite(nowX)) {
                if (nowX === Number.POSITIVE_INFINITY) {
                    nowX = 1e308;
                }
                else if (nowX === Number.NEGATIVE_INFINITY) {
                    nowX = -1e308;
                }
            }
            if (!isFinite(nowY)) {
                if (nowY === Number.POSITIVE_INFINITY) {
                    nowY = 1e308;
                }
                else if (nowY === Number.NEGATIVE_INFINITY) {
                    nowY = -1e308;
                }
            }
            var timeIdx = line.varsList.timeIndex();
            var xIsTimeVar = line.hCoordIndex === timeIdx;
            var yIsTimeVar = line.vCoordIndex === timeIdx;
            if (!this.rangeSetX_) {
                this.rangeXLo_ = nowX;
                this.rangeXHi_ = nowX + (xIsTimeVar ? this.timeWindow_ : 0);
                this.rangeSetX_ = true;
            }
            else {
                if (nowX < this.rangeXLo_) {
                    if (xIsTimeVar) {
                        this.rangeXLo_ = nowX;
                        this.rangeXHi_ = nowX + this.timeWindow_;
                    }
                    else {
                        this.rangeXLo_ = nowX - this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                    }
                }
                if (xIsTimeVar) {
                    // In 'time graph', have extra space on right side so we can see
                    // the leading edge hotspots.
                    if (nowX > this.rangeXHi_ - this.extraMargin * this.timeWindow_) {
                        this.rangeXHi_ = nowX + this.extraMargin * this.timeWindow_;
                        this.rangeXLo_ = this.rangeXHi_ - this.timeWindow_;
                    }
                }
                else {
                    if (nowX > this.rangeXHi_) {
                        this.rangeXHi_ = nowX + this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                    }
                }
            }
            if (!this.rangeSetY_) {
                this.rangeYLo_ = nowY;
                this.rangeYHi_ = nowY + (yIsTimeVar ? this.timeWindow_ : 0);
                this.rangeSetY_ = true;
            }
            else {
                if (nowY < this.rangeYLo_) {
                    if (yIsTimeVar) {
                        this.rangeYLo_ = nowY;
                        this.rangeYHi_ = nowY + this.timeWindow_;
                    }
                    else {
                        this.rangeYLo_ = nowY - this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                    }
                }
                if (yIsTimeVar) {
                    // In 'time graph', have extra space on top so we can see
                    // the leading edge hotspots.
                    if (nowY > this.rangeYHi_ - this.extraMargin * this.timeWindow_) {
                        this.rangeYHi_ = nowY + this.extraMargin * this.timeWindow_;
                        this.rangeYLo_ = this.rangeYHi_ - this.timeWindow_;
                    }
                }
                else {
                    if (nowY > this.rangeYHi_) {
                        this.rangeYHi_ = nowY + this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                    }
                }
            }
        };
        /**
         * Event broadcasted when axis is changed.
         */
        AutoScale.AXIS = 'AXIS';
        /**
         * Event broadcasted when time window is changed.
         */
        AutoScale.TIME_WINDOW = 'TIME_WINDOW';
        /**
         * Name of event broadcast when the active state changes, value is whether active.
         */
        AutoScale.ACTIVE = 'ACTIVE';
        /**
         * Name of event broadcast when a new enclosing simulation rectangle has been calculated.
         */
        AutoScale.AUTO_SCALE = 'AUTO_SCALE';
        /**
         * Name of event broadcast when the enabled state changes, value is whether enabled.
         */
        AutoScale.ENABLED = 'ENABLED';
        return AutoScale;
    }(AbstractSubject));

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * @hidden
     * @param label
     * @param scale
     * @returns
     */
    function makeLabelScale(label, scale) {
        if (Unit.isOne(scale)) {
            return label;
        }
        else {
            return label + " / (" + scale + ")";
        }
    }
    /**
     * Draws linear horizontal and vertical axes within a given simulation coordinates
     * rectangle. The simulation rectangle determines where the axes are drawn, and the
     * numbering scale shown.
     *
     * Axes are drawn with numbered tick marks. Axes are labeled with
     * names which can be specified by `hAxisLabel` and `vAxisLabel`. Axes
     * are drawn using specified font and color.
     *
     * Options exist for drawing the vertical axis near the left, center, or right, and for
     * drawing the horizontal axis near the top, center, or bottom of the screen. See
     * `hAxisAlign` and `vAxisAlign`.
     *
     * To keep the DisplayAxes in sync with a LabView, when
     * doing for example pan/zoom of the LabView, you can arrange for {@link #setSimRect} to
     * be called by an Observer.
     * @hidden
     */
    var DisplayAxes = /** @class */ (function () {
        /**
         * @param simRect the area to draw axes for in simulation coordinates.
         * @param font the Font to draw numbers and names of axes with
         * @param color the Color to draw the axes with
         */
        function DisplayAxes(simRect, font, color) {
            if (simRect === void 0) { simRect = DoubleRect.EMPTY_RECT; }
            if (font === void 0) { font = '14pt sans-serif'; }
            if (color === void 0) { color = 'gray'; }
            this.simRect_ = simRect;
            this.numFont_ = font;
            this.drawColor_ = color;
            this.fontDescent = 8;
            this.fontAscent = 12;
            this.hAxisAlign_ = exports.AlignV.BOTTOM;
            this.vAxisAlign_ = exports.AlignH.LEFT;
            this.numDecimal_ = 0;
            this.needRedraw_ = true;
            this.hLabel_ = 'x';
            this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
            this.vLabel_ = 'y';
            this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
            this.zIndex_ = 100;
        }
        /*
        contains(point) {
            return false;
        }
        */
        DisplayAxes.prototype.draw = function (context, map) {
            // Draws both horizontal and vertical axes, getting the size of the axes from the
            // simulation rectangle
            context.save();
            context.strokeStyle = this.drawColor_;
            context.fillStyle = this.drawColor_;
            context.font = this.numFont_;
            context.textAlign = 'start';
            context.textBaseline = 'alphabetic';
            // figure where to draw axes
            /**
             * screen x-coord of axes, the point where the axes intersect.
             */
            var x0;
            /**
             * screen y-coord of axes, the point where the axes intersect.
             */
            var y0;
            var r = this.simRect_;
            var sim_x1 = r.getLeft();
            var sim_x2 = r.getRight();
            var sim_y1 = r.getBottom();
            var sim_y2 = r.getTop();
            switch (this.vAxisAlign_) {
                case exports.AlignH.RIGHT:
                    x0 = map.simToScreenX(sim_x2 - 0.05 * (sim_x2 - sim_x1));
                    break;
                case exports.AlignH.LEFT:
                    x0 = map.simToScreenX(sim_x1 + 0.05 * (sim_x2 - sim_x1));
                    break;
                default:
                    x0 = map.simToScreenX(r.getCenterX());
            }
            // leave room to draw the numbers below the horizontal axis
            switch (this.hAxisAlign_) {
                case exports.AlignV.TOP:
                    y0 = map.simToScreenY(sim_y2) + (10 + this.fontDescent + this.fontAscent);
                    break;
                case exports.AlignV.BOTTOM:
                    y0 = map.simToScreenY(sim_y1) - (10 + this.fontDescent + this.fontAscent);
                    break;
                default:
                    y0 = map.simToScreenY(r.getCenterY());
            }
            // draw horizontal axis
            context.beginPath();
            context.moveTo(map.simToScreenX(sim_x1), y0);
            context.lineTo(map.simToScreenX(sim_x2), y0);
            context.stroke();
            this.drawHorizTicks(y0, context, map, this.simRect_);
            // draw vertical axis
            context.beginPath();
            context.moveTo(x0, map.simToScreenY(sim_y1));
            context.lineTo(x0, map.simToScreenY(sim_y2));
            context.stroke();
            this.drawVertTicks(x0, context, map, this.simRect_);
            context.restore();
            this.needRedraw_ = false;
        };
        /**
         * Draws the tick marks for the horizontal axis.
         * @param y0 the vertical placement of the horizontal axis, in screen coords
         * @param context the canvas's context to draw into
         * @param map the mapping to use for translating between simulation and screen coordinates
         * @param r the view area in simulation coords
         */
        DisplayAxes.prototype.drawHorizTicks = function (y0, context, map, r) {
            var y1 = y0 - 4; // bottom edge of tick mark
            var y2 = y1 + 8; // top edge of tick mark
            var sim_x1 = r.getLeft();
            var sim_x2 = r.getRight();
            var graphDelta = this.getNiceIncrement(sim_x2 - sim_x1);
            var x_sim = DisplayAxes.getNiceStart(sim_x1, graphDelta);
            while (x_sim < sim_x2) {
                var x_screen = map.simToScreenX(x_sim);
                context.beginPath(); // draw a tick mark
                context.moveTo(x_screen, y1);
                context.lineTo(x_screen, y2);
                context.stroke();
                var next_x_sim = x_sim + graphDelta; // next tick mark location
                if (next_x_sim > x_sim) {
                    // draw a number
                    var s = x_sim.toFixed(this.numDecimal_);
                    var textWidth = context.measureText(s).width;
                    context.fillText(s, x_screen - textWidth / 2, y2 + this.fontAscent);
                }
                else {
                    // This can happen when the range is tiny compared to the numbers
                    // for example:  x_sim = 6.5 and graphDelta = 1E-15.
                    context.fillText('scale is too small', x_screen, y2 + this.fontAscent);
                    break;
                }
                x_sim = next_x_sim;
            }
            // draw name of the horizontal axis
            var hLabel = this.hLabelScaleCache_;
            var w = context.measureText(hLabel).width;
            context.fillText(hLabel, map.simToScreenX(sim_x2) - w - 5, y0 - 8);
        };
        /**
         * Draws the tick marks for the vertical axis.
         * @param x0 the horizontal placement of the vertical axis, in screen coords
         * @param context the canvas's context to draw into
         * @param map the mapping to use for translating between simulation and screen coordinates
         * @param r the view area in simulation coords
         */
        DisplayAxes.prototype.drawVertTicks = function (x0, context, map, r) {
            var x1 = x0 - 4; // left edge of tick mark
            var x2 = x1 + 8; // right edge of tick mark
            var sim_y1 = r.getBottom();
            var sim_y2 = r.getTop();
            var graphDelta = this.getNiceIncrement(sim_y2 - sim_y1);
            var y_sim = DisplayAxes.getNiceStart(sim_y1, graphDelta);
            while (y_sim < sim_y2) {
                var y_screen = map.simToScreenY(y_sim);
                context.beginPath(); // draw a tick mark
                context.moveTo(x1, y_screen);
                context.lineTo(x2, y_screen);
                context.stroke();
                var next_y_sim = y_sim + graphDelta;
                if (next_y_sim > y_sim) {
                    // draw a number
                    var s = y_sim.toFixed(this.numDecimal_);
                    var textWidth = context.measureText(s).width;
                    if (this.vAxisAlign_ === exports.AlignH.RIGHT) {
                        context.fillText(s, x2 - (textWidth + 10), y_screen + (this.fontAscent / 2));
                    }
                    else { // LEFT is default
                        context.fillText(s, x2 + 5, y_screen + (this.fontAscent / 2));
                    }
                }
                else {
                    // This can happen when the range is tiny compared to the numbers
                    // for example:  y_sim = 6.5 and graphDelta = 1E-15.
                    context.fillText('scale is too small', x2, y_screen);
                    break;
                }
                y_sim = next_y_sim; // next tick mark
            }
            // draw label for the vertical axis
            var vLabel = this.vLabelScaleCache_;
            var w = context.measureText(vLabel).width;
            if (this.vAxisAlign_ === exports.AlignH.RIGHT) {
                context.fillText(vLabel, x0 - (w + 6), map.simToScreenY(sim_y2) + 13);
            }
            else { // LEFT is default
                context.fillText(vLabel, x0 + 6, map.simToScreenY(sim_y2) + 13);
            }
        };
        Object.defineProperty(DisplayAxes.prototype, "color", {
            /**
             * Returns the color to draw the graph axes with.
             * @return the color to draw the graph axes with
             */
            get: function () {
                return this.drawColor_;
            },
            /**
             * Set the color to draw the graph axes with.
             * @param color the color to draw the graph axes with
             */
            set: function (color) {
                this.drawColor_ = color;
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the font to draw the graph axes with.
         * @return the font to draw the graph axes with
         */
        DisplayAxes.prototype.getFont = function () {
            return this.numFont_;
        };
        Object.defineProperty(DisplayAxes.prototype, "hAxisLabel", {
            /**
             * Returns the label shown next to the horizontal axis.
             */
            get: function () {
                return this.hLabel_;
            },
            /**
             * Sets the label shown next to the horizontal axis.
             */
            set: function (hAxisLabel) {
                this.hLabel_ = hAxisLabel;
                this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "hAxisScale", {
            get: function () {
                return this.hScale_;
            },
            /**
             * Sets the scale used for the horizontal axis.
             */
            set: function (hAxisScale) {
                this.hScale_ = hAxisScale;
                this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns an increment to use for spacing of tick marks on an axis.
         * The increment should be a 'round' number, with few fractional decimal places.
         * It should divide the given range into around 5 to 7 pieces.
         *
         * Side effect: modifies the number of fractional digits to show
         *
         * @param range the span of the axis
         * @return an increment to use for spacing of tick marks on an axis.
         */
        DisplayAxes.prototype.getNiceIncrement = function (range) {
            // First, scale the range to within 1 to 10.
            var power = Math.pow(10, Math.floor(Math.log(range) / Math.LN10));
            var logTot = range / power;
            // logTot should be in the range from 1.0 to 9.999
            var incr;
            if (logTot >= 8)
                incr = 2;
            else if (logTot >= 5)
                incr = 1;
            else if (logTot >= 3)
                incr = 0.5;
            else if (logTot >= 2)
                incr = 0.4;
            else
                incr = 0.2;
            incr *= power; // scale back to original range
            // setup for nice formatting of numbers in this range
            var dlog = Math.log(incr) / Math.LN10;
            this.numDecimal_ = (dlog < 0) ? Math.ceil(-dlog) : 0;
            return incr;
        };
        /**
         * Returns the starting value for the tick marks on an axis.
         * @param start  the lowest value on the axis
         * @param incr  the increment between tick marks on the axis
         * @return the starting value for the tick marks on the axis.
         */
        DisplayAxes.getNiceStart = function (start, incr) {
            // gives the first nice increment just greater than the starting number
            return Math.ceil(start / incr) * incr;
        };
        /**
         * Returns the bounding rectangle for this DisplayAxes in simulation coordinates,
         * which determines the numbering scale shown.
         * @return DoubleRect the bounding rectangle for this DisplayAxes in simulation coordinates.
         */
        DisplayAxes.prototype.getSimRect = function () {
            return this.simRect_;
        };
        Object.defineProperty(DisplayAxes.prototype, "vAxisLabel", {
            /**
             * Returns the name shown next to the vertical axis.
             */
            get: function () {
                return this.vLabel_;
            },
            /**
             * Sets the name shown next to the vertical axis.
             */
            set: function (vAxisLabel) {
                this.vLabel_ = vAxisLabel;
                this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "vAxisScale", {
            get: function () {
                return this.vScale_;
            },
            /**
             * Sets the scale used for the horizontal axis.
             */
            set: function (vAxisScale) {
                this.vScale_ = vAxisScale;
                this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "hAxisAlign", {
            /**
             * Returns the X-axis alignment: whether it should appear at bottom, top or middle of
             * the simulation rectangle.
             */
            get: function () {
                return this.hAxisAlign_;
            },
            /**
             * Sets the horizontal axis alignment: whether it should appear at bottom, top or middle of the
             * simulation rectangle.
             */
            set: function (alignment) {
                this.hAxisAlign_ = alignment;
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "vAxisAlign", {
            /**
             * Returns the Y-axis alignment : whether it should appear at left, right or middle of
             * the simulation rectangle.
             */
            get: function () {
                return this.vAxisAlign_;
            },
            /**
             * Sets the vertical axis alignment: whether it should appear at left, right or middle of the
             * simulation rectangle.
             */
            set: function (alignment) {
                this.vAxisAlign_ = alignment;
                this.needRedraw_ = true;
            },
            enumerable: false,
            configurable: true
        });
        DisplayAxes.prototype.getZIndex = function () {
            return this.zIndex_;
        };
        DisplayAxes.prototype.isDragable = function () {
            return false;
        };
        /**
         * Whether this DisplayAxes has changed since the last time it was drawn.
         * @return true when this DisplayAxes has changed since the last time draw was called.
         */
        DisplayAxes.prototype.needsRedraw = function () {
            return this.needRedraw_;
        };
        DisplayAxes.prototype.setDragable = function (dragable) {
            // Do nothing.
        };
        /**
         * Set the font to draw the graph axes with.
         * @param font the font to draw the graph axes with
         */
        DisplayAxes.prototype.setFont = function (font) {
            this.numFont_ = font;
            this.needRedraw_ = true;
        };
        /**
         * Sets the bounding rectangle for this DisplayAxes in simulation coordinates; this
         * determines the numbering scale shown.
         * @param simRect the bounding rectangle for this DisplayAxes in simulation coordinates.
         */
        DisplayAxes.prototype.setSimRect = function (simRect) {
            this.simRect_ = simRect;
            this.needRedraw_ = true;
        };
        DisplayAxes.prototype.setZIndex = function (zIndex) {
            if (isDefined(zIndex)) {
                this.zIndex_ = zIndex;
            }
        };
        return DisplayAxes;
    }());

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * Creates a single graph showing several independent GraphLines, and with a horizontal
     * time axis. Because there is a single SimView and DisplayGraph, all the GraphLines are
     * plotted in the same graph coordinates. The horizontal variable can be changed to
     * something other than time. Creates an AutoScale that ensures all of the GraphLines are
     * visible. Creates several controls to modify the graph.
     *
     * This class is a user interface control. It may manipulate the DOM, adding controls.
     * @hidden
     */
    var Graph = /** @class */ (function (_super) {
        __extends(Graph, _super);
        /**
         *
         */
        function Graph(canvasId, varsList) {
            var _this = _super.call(this) || this;
            _this.varsList = varsList;
            /**
             *
             */
            _this.view = new SimView(new DoubleRect(0, 0, 1, 1));
            /**
             *
             */
            _this.autoScale = new AutoScale(_this.view);
            var canvas = document.getElementById(canvasId);
            _this.labCanvas = new LabCanvas(canvas);
            _this.view.hAxisAlign = exports.AlignH.FULL;
            _this.view.vAxisAlign = exports.AlignV.FULL;
            _this.labCanvas.addView(_this.view);
            _this.displayGraph = new DisplayGraph();
            _this.displayGraph.setScreenRect(_this.view.getScreenRect());
            _this.view.getDisplayList().prepend(_this.displayGraph);
            // Find out where the time is stored in the list of variables.
            _this.timeIdx_ = varsList.timeIndex();
            _this.axes = new DisplayAxes(_this.view.getSimRect());
            _this.subscription = new GenericObserver(_this.view, function (event) {
                if (event.nameEquals(SimView.COORD_MAP_CHANGED)) {
                    var simRect = _this.view.getCoordMap().screenToSimRect(_this.view.getScreenRect());
                    _this.axes.setSimRect(simRect);
                }
            });
            _this.view.getDisplayList().add(_this.axes);
            _this.autoScale.extraMargin = 0.05;
            return _this;
        }
        Graph.prototype.destructor = function () {
            if (this.subscription) {
                this.subscription.disconnect();
                this.subscription = void 0;
            }
        };
        /**
         *
         */
        Graph.prototype.addGraphLine = function (hCoordIndex, vCoordIndex, color) {
            if (color === void 0) { color = 'black'; }
            mustBeNumber('hCoordIndex', hCoordIndex);
            mustBeNumber('vCoordIndex', vCoordIndex);
            mustBeString('color', color);
            var graphLine = new GraphLine(this.varsList);
            this.view.addMemo(graphLine);
            graphLine.hCoordIndex = hCoordIndex;
            graphLine.vCoordIndex = vCoordIndex;
            graphLine.color = color;
            graphLine.hotspotColor = color;
            this.displayGraph.addGraphLine(graphLine);
            // Don't use off-screen buffer with time variable because the auto-scale causes
            // graph to redraw every frame.
            this.displayGraph.setUseBuffer(graphLine.hCoordIndex !== this.timeIdx_);
            return graphLine;
        };
        Graph.prototype.removeGraphLine = function (graphLine) {
            this.displayGraph.removeGraphLine(graphLine);
        };
        Graph.prototype.memorize = function () {
            this.labCanvas.memorize();
        };
        Graph.prototype.render = function () {
            this.labCanvas.paint();
        };
        Graph.prototype.reset = function () {
            this.autoScale.reset();
            this.displayGraph.reset();
        };
        return Graph;
    }(AbstractSubject));

    /**
     * @hidden
     * This is currently exposed to support the existing 3D example.
     */
    var EnergyTimeGraph = /** @class */ (function (_super) {
        __extends(EnergyTimeGraph, _super);
        /**
         *
         */
        function EnergyTimeGraph(canvasId, varsList) {
            var _this = _super.call(this, canvasId, varsList) || this;
            // TODO: Make the indices independent of the number of dimensions.
            _this.translationalEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_TRANSLATIONAL_KINETIC_ENERGY, 'red');
            _this.rotationalEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_ROTATIONAL_KINETIC_ENERGY, 'yellow');
            _this.potentialEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_POTENTIAL_ENERGY, 'blue');
            _this.totalEnergyGraphLine = _this.addGraphLine(INDEX_TIME, INDEX_TOTAL_ENERGY, 'white');
            _this.autoScale.timeWindow = 5;
            _this.autoScale.addGraphLine(_this.translationalEnergyGraphLine);
            _this.autoScale.addGraphLine(_this.rotationalEnergyGraphLine);
            _this.autoScale.addGraphLine(_this.potentialEnergyGraphLine);
            _this.autoScale.addGraphLine(_this.totalEnergyGraphLine);
            _this.axes.hAxisAlign = exports.AlignV.BOTTOM;
            _this.axes.vAxisAlign = exports.AlignH.LEFT;
            _this.axes.hAxisLabel = 'time';
            _this.axes.vAxisLabel = 'energy';
            return _this;
        }
        return EnergyTimeGraph;
    }(Graph));

    /**
     * @hidden
     */
    var AdaptiveStepSolver = /** @class */ (function () {
        function AdaptiveStepSolver(diffEq, energySystem, diffEqSolver, metric) {
            this.energySystem = energySystem;
            this.metric = metric;
            this.stepUBound = 1;
            /**
             * The smallest time step that will executed.
             * Setting a reasonable lower bound prevents the solver from taking too long to give up.
             */
            this.stepLBound = 1E-5;
            this.diffEq_ = diffEq;
            this.odeSolver_ = diffEqSolver;
            // this.totSteps_ = 0;
            this.secondDiff_ = true;
            this.tolerance_ = 1E-6;
        }
        AdaptiveStepSolver.prototype.step = function (stepSize, uomStep) {
            var metric = this.metric;
            // save the vars in case we need to back up and start again
            this.savedState = this.diffEq_.getState();
            var startTime = this.diffEq_.time;
            /**
             *
             */
            var d_t = stepSize; // d_t = our smaller step size
            /**
             * number of diffEqSolver steps taken during this step
             */
            // let steps = 0;
            this.diffEq_.epilog(stepSize, uomStep); // to ensure getEnergyInfo gives correct value
            var startEnergy = metric.a(this.energySystem.totalEnergy());
            var lastEnergyDiff = Number.POSITIVE_INFINITY;
            /**
             * the value we are trying to reduce to zero
             */
            var value = Number.POSITIVE_INFINITY;
            var firstTime = true;
            if (stepSize < this.stepLBound) {
                return;
            }
            do {
                var t = startTime; // t = current time
                if (!firstTime) {
                    // restore state and solve again with smaller step size
                    this.diffEq_.setState(this.savedState);
                    this.diffEq_.epilog(stepSize, uomStep);
                    // goog.asserts.assert(Math.abs(this.diffEq_.time - startTime) < 1E-12);
                    // const e = this.energySystem_.totalEnergy();
                    // goog.asserts.assert(Math.abs(e - startEnergy) < 1E-10);
                    d_t = d_t / 5; // reduce step size
                    if (d_t < this.stepLBound) {
                        throw new Error("time step " + d_t + " too small. startEnergy => " + startEnergy + " lastEnergyDiff => " + lastEnergyDiff);
                    }
                }
                // steps = 0;  // only count steps of the last iteration
                // take multiple steps of size d_t to equal the entire requested stepSize
                while (t < startTime + stepSize) {
                    var h = d_t;
                    // if this step takes us past the end of the overall step, then shorten it
                    if (t + h > startTime + stepSize - 1E-10) {
                        h = startTime + stepSize - t;
                    }
                    // steps++;
                    this.odeSolver_.step(h, uomStep);
                    this.diffEq_.epilog(stepSize, uomStep);
                    t += h;
                }
                var finishEnergy = metric.a(this.energySystem.totalEnergy());
                var energyDiff = Math.abs(startEnergy - finishEnergy);
                if (this.secondDiff_) {
                    // reduce time step until change in energy stabilizes
                    // (i.e. change in change in energy goes to zero)
                    if (!firstTime) {
                        value = Math.abs(energyDiff - lastEnergyDiff);
                    }
                }
                else {
                    // reduce time step until change in energy goes to zero
                    value = energyDiff;
                }
                lastEnergyDiff = energyDiff;
                firstTime = false;
            } while (value > this.tolerance_);
            // this.totSteps_ += steps;
        };
        Object.defineProperty(AdaptiveStepSolver.prototype, "secondDiff", {
            /**
             * Returns whether to use second order differences for deciding when to reduce the step
             * size. i.e. whether to use change in change in energy as the criteria for accuracy.
             */
            get: function () {
                return this.secondDiff_;
            },
            /**
             * Whether to use second order differences for deciding when to reduce the step size.
             * The first difference is the change in energy of the system over a time step.
             * We can only use first differences when the energy of the system is constant.
             * If the energy of the system changes over time, then we need to reduce the step size
             * until the change of energy over the step stabilizes.  Put another way:  we reduce
             * the step size until the change in the change in energy becomes small.
             * @param value  true means use *change in change in energy* (second derivative)
             * as the criteria for accuracy
             */
            set: function (value) {
                this.secondDiff_ = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AdaptiveStepSolver.prototype, "tolerance", {
            /**
             * Returns the tolerance used to decide if sufficient accuracy has been achieved.
             * Default is 1E-6.
             */
            get: function () {
                return this.tolerance_;
            },
            /**
             * Sets the tolerance used to decide if sufficient accuracy has been achieved.
             * Default is 1E-6.
             * @param value the tolerance value for deciding if sufficient accuracy
             * has been achieved
             */
            set: function (value) {
                this.tolerance_ = value;
            },
            enumerable: false,
            configurable: true
        });
        return AdaptiveStepSolver;
    }());

    /**
     * An adaptive step solver that adjusts the step size in order to
     * ensure that the energy change be less than a tolerance amount.
     * @hidden
     */
    var ConstantEnergySolver = /** @class */ (function () {
        /**
         * Constructs an adaptive step solver that adjusts the step size in order to
         * ensure that the energy change be less than a tolerance amount.
         */
        function ConstantEnergySolver(simulation, energySystem, solverMethod) {
            this.simulation = simulation;
            this.stepUpperBound = 1;
            /**
             * The smallest time step that will executed.
             * Setting a reasonable lower bound prevents the solver from taking too long to give up.
             */
            this.stepLowerBound = 1E-5;
            /**
             *
             */
            this.tolerance_ = 1E-6;
            this.energySystem_ = energySystem;
            this.solverMethod_ = solverMethod;
            // this.totSteps_ = 0;
        }
        ConstantEnergySolver.prototype.step = function (Δt, uomTime) {
            // save the vars in case we need to back up and start again
            this.savedVals = this.simulation.getState();
            this.savedUoms = this.simulation.getUnits();
            var startTime = this.simulation.time;
            /**
             * The adapted step size.
             */
            var adaptedStepSize = Δt; // adaptedStepSize = our smaller step size
            /**
             * number of diffEqSolver steps taken during this step
             */
            // let steps = 0;
            this.simulation.epilog(Δt, uomTime); // to ensure getEnergyInfo gives correct value
            var metric = this.energySystem_.metric;
            var startEnergy = metric.a(this.energySystem_.totalEnergy());
            // let lastEnergyDiff = Number.POSITIVE_INFINITY;
            /**
             * the value we are trying to reduce to zero
             */
            var value = Number.POSITIVE_INFINITY;
            var firstTime = true;
            if (Δt < this.stepLowerBound) {
                return;
            }
            do {
                var t = startTime; // t = current time
                if (!firstTime) {
                    // restore state and solve again with smaller step size
                    this.simulation.setState(this.savedVals);
                    this.simulation.setUnits(this.savedUoms);
                    this.simulation.epilog(Δt, uomTime);
                    // goog.asserts.assert(Math.abs(this.simulation_.time - startTime) < 1E-12);
                    // const e = this.energySystem_.totalEnergy();
                    // goog.asserts.assert(Math.abs(e - startEnergy) < 1E-10);
                    adaptedStepSize = adaptedStepSize / 5; // reduce step size
                    if (adaptedStepSize < this.stepLowerBound) {
                        throw new Error("Unable to achieve tolerance " + this.tolerance + " with stepLowerBound " + this.stepLowerBound);
                    }
                }
                // steps = 0;  // only count steps of the last iteration
                // take multiple steps of size adaptedStepSize to equal the entire requested stepSize
                while (t < startTime + Δt) {
                    var h = adaptedStepSize;
                    // if this step takes us past the end of the overall step, then shorten it
                    if (t + h > startTime + Δt - 1E-10) {
                        h = startTime + Δt - t;
                    }
                    // steps++;
                    this.solverMethod_.step(h, uomTime);
                    this.simulation.epilog(Δt, uomTime);
                    t += h;
                }
                var finishEnergy = metric.a(this.energySystem_.totalEnergy());
                var energyDiff = Math.abs(startEnergy - finishEnergy);
                // reduce time step until change in energy goes to zero.
                value = energyDiff;
                // lastEnergyDiff = energyDiff;
                firstTime = false;
            } while (value > this.tolerance_);
            // this.totSteps_ += steps;
        };
        Object.defineProperty(ConstantEnergySolver.prototype, "tolerance", {
            /**
             * Returns the tolerance used to decide if sufficient accuracy has been achieved.
             * Default is 1E-6.
             */
            get: function () {
                return this.tolerance_;
            },
            /**
             * Sets the tolerance used to decide if sufficient accuracy has been achieved.
             * Default is 1E-6.
             * @param value the tolerance value for deciding if sufficient accuracy
             * has been achieved
             */
            set: function (value) {
                this.tolerance_ = value;
            },
            enumerable: false,
            configurable: true
        });
        return ConstantEnergySolver;
    }());

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * The Euler algorithm uses the rate of change values at the
     * beginning of the step in order to perform the integration.
     * @hidden
     */
    var EulerMethod = /** @class */ (function () {
        /**
         *
         */
        function EulerMethod(system) {
            this.system = system;
            this.$invals = [];
            this.$inuoms = [];
            this.$k1vals = [];
            this.$k1uoms = [];
            mustBeNonNullObject('system', system);
        }
        EulerMethod.prototype.step = function (stepSize, uomStep) {
            var stateVals = this.system.getState();
            var stateUoms = this.system.getUnits();
            var N = stateVals.length;
            if (this.$invals.length !== N) {
                this.$invals = new Array(N);
                this.$inuoms = new Array(N);
                this.$k1vals = new Array(N);
                this.$k1uoms = new Array(N);
            }
            var invals = this.$invals;
            var inuoms = this.$inuoms;
            var k1vals = this.$k1vals;
            var k1uoms = this.$k1uoms;
            for (var i = 0; i < N; i++) {
                // set up input to diffeqs (note: this protects vars from being changed)
                invals[i] = stateVals[i];
                inuoms[i] = stateUoms[i];
            }
            zeroArray(k1vals); // TODO: Is this redundant for an output variable?
            this.system.evaluate(invals, inuoms, k1vals, k1uoms, 0, uomStep);
            for (var i = 0; i < N; i++) {
                try {
                    if (stateVals[i] !== 0) {
                        stateUoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k1uoms[i], uomStep));
                    }
                    else {
                        stateUoms[i] = Unit.mul(k1uoms[i], uomStep);
                    }
                }
                catch (e) {
                    throw new Error("i=" + i + ", stateVals[" + i + "]=" + stateVals[i] + ", stateUoms[" + i + "]=" + stateUoms[i] + ", k1vals[" + i + "]=" + k1vals[i] + ", k1uoms[" + i + "]=" + k1uoms[i] + ", uomStep=" + uomStep + ". Cause: " + e);
                }
                stateVals[i] += k1vals[i] * stepSize;
            }
            this.system.setState(stateVals);
            this.system.setUnits(stateUoms);
        };
        return EulerMethod;
    }());

    // Copyright 2017-2021 David Holmes.  All Rights Reserved.
    /**
     * The modified Euler algorithm uses the rate of change values at both
     * the beginning of the step and at the end, taking an average in order
     * to perform the integration.
     * @hidden
     */
    var ModifiedEuler = /** @class */ (function () {
        /**
         *
         */
        function ModifiedEuler(system) {
            this.system = system;
            this.$invals = [];
            this.$inuoms = [];
            this.$k1vals = [];
            this.$k1uoms = [];
            this.$k2vals = [];
            this.$k2uoms = [];
            mustBeNonNullObject('system', system);
        }
        ModifiedEuler.prototype.step = function (stepSize, uomStep) {
            var stateVals = this.system.getState();
            var stateUoms = this.system.getUnits();
            var N = stateVals.length;
            if (this.$invals.length !== N) {
                this.$invals = new Array(N);
                this.$inuoms = new Array(N);
                this.$k1vals = new Array(N);
                this.$k1uoms = new Array(N);
                this.$k2vals = new Array(N);
                this.$k2uoms = new Array(N);
            }
            var invals = this.$invals;
            var inuoms = this.$inuoms;
            var k1vals = this.$k1vals;
            var k1uoms = this.$k1uoms;
            var k2vals = this.$k2vals;
            var k2uoms = this.$k2uoms;
            // evaluate at time t
            for (var i = 0; i < N; i++) {
                invals[i] = stateVals[i];
                inuoms[i] = stateUoms[i];
            }
            zeroArray(k1vals);
            this.system.evaluate(invals, inuoms, k1vals, k1uoms, 0, uomStep);
            // evaluate at time t+stepSize
            for (var i = 0; i < N; i++) {
                if (stateVals[i] !== 0) {
                    inuoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k1uoms[i], uomStep));
                }
                else {
                    inuoms[i] = Unit.mul(k1uoms[i], uomStep);
                }
                invals[i] = stateVals[i] + k1vals[i] * stepSize;
            }
            zeroArray(k2vals);
            this.system.evaluate(invals, inuoms, k2vals, k2uoms, stepSize, uomStep);
            for (var i = 0; i < N; i++) {
                if (stateVals[i] !== 0) {
                    if (k2vals[i] !== 0) {
                        stateUoms[i] = Unit.compatible(stateUoms[i], Unit.mul(k2uoms[i], uomStep));
                    }
                }
                else {
                    stateUoms[i] = Unit.mul(k2uoms[i], uomStep);
                }
                stateVals[i] += (k1vals[i] + k2vals[i]) * stepSize / 2;
            }
            this.system.setState(stateVals);
            this.system.setUnits(stateUoms);
        };
        return ModifiedEuler;
    }());

    exports.AdaptiveStepSolver = AdaptiveStepSolver;
    exports.Block1 = Block1;
    exports.Block2 = Block2;
    exports.Block3 = Block3;
    exports.CircularList = CircularList;
    exports.ConstantEnergySolver = ConstantEnergySolver;
    exports.ConstantForceLaw = ConstantForceLaw;
    exports.ConstantForceLaw1 = ConstantForceLaw1;
    exports.ConstantForceLaw2 = ConstantForceLaw2;
    exports.ConstantForceLaw3 = ConstantForceLaw3;
    exports.ConstantTorqueLaw = ConstantTorqueLaw;
    exports.ConstantTorqueLaw1 = ConstantTorqueLaw1;
    exports.ConstantTorqueLaw2 = ConstantTorqueLaw2;
    exports.ConstantTorqueLaw3 = ConstantTorqueLaw3;
    exports.CoulombLaw = CoulombLaw;
    exports.Cylinder3 = Cylinder3;
    exports.DefaultAdvanceStrategy = DefaultAdvanceStrategy;
    exports.Dimensions = Dimensions;
    exports.Disc2 = Disc2;
    exports.DisplayGraph = DisplayGraph;
    exports.Dynamics1 = Dynamics1;
    exports.Dynamics2 = Dynamics2;
    exports.Dynamics3 = Dynamics3;
    exports.EnergyTimeGraph = EnergyTimeGraph;
    exports.Engine = Engine;
    exports.Engine1 = Engine1;
    exports.Engine2 = Engine2;
    exports.Engine3 = Engine3;
    exports.Euclidean1 = Euclidean1;
    exports.Euclidean2 = Euclidean2;
    exports.Euclidean3 = Euclidean3;
    exports.EulerMethod = EulerMethod;
    exports.Force = Force;
    exports.Force1 = Force1;
    exports.Force2 = Force2;
    exports.Force3 = Force3;
    exports.Geometric1 = Geometric1;
    exports.Geometric2 = Geometric2;
    exports.Geometric3 = Geometric3;
    exports.Graph = Graph;
    exports.GraphLine = GraphLine;
    exports.GravitationForceLaw2 = GravitationForceLaw2;
    exports.GravitationForceLaw3 = GravitationForceLaw3;
    exports.GravitationLaw = GravitationLaw;
    exports.LOCAL = LOCAL;
    exports.LabCanvas = LabCanvas;
    exports.LinearDamper = LinearDamper;
    exports.LinearDamper1 = LinearDamper1;
    exports.LinearDamper2 = LinearDamper2;
    exports.LinearDamper3 = LinearDamper3;
    exports.Matrix1 = Matrix1;
    exports.Matrix3 = Matrix3;
    exports.ModifiedEuler = ModifiedEuler;
    exports.Particle = Particle;
    exports.Particle1 = Particle1;
    exports.Particle2 = Particle2;
    exports.Particle3 = Particle3;
    exports.Physics = Physics;
    exports.Physics1 = Physics1;
    exports.Physics2 = Physics2;
    exports.Physics3 = Physics3;
    exports.Polygon2 = Polygon2;
    exports.QQ = QQ;
    exports.RigidBody = RigidBody;
    exports.RigidBody1 = RigidBody1;
    exports.RigidBody2 = RigidBody2;
    exports.RigidBody3 = RigidBody3;
    exports.Rod2 = Rod2;
    exports.RungeKutta = RungeKutta;
    exports.SimView = SimView;
    exports.Sphere3 = Sphere3;
    exports.Spring = Spring;
    exports.Spring1 = Spring1;
    exports.Spring2 = Spring2;
    exports.Spring3 = Spring3;
    exports.SurfaceConstraint2 = SurfaceConstraint2;
    exports.SurfaceConstraint3 = SurfaceConstraint3;
    exports.Torque = Torque;
    exports.Torque2 = Torque2;
    exports.Torque3 = Torque3;
    exports.Unit = Unit;
    exports.VarsList = VarsList;
    exports.WORLD = WORLD;
    exports.config = config;
    exports.setDimensionsChecking = setDimensionsChecking;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
