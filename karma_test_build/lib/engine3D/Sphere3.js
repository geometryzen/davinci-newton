"use strict";
// Copyright 2017-2021 David Holmes.  All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sphere3 = void 0;
var tslib_1 = require("tslib");
var RigidBody_1 = require("../core/RigidBody");
var Geometric3_1 = require("../math/Geometric3");
var Matrix3_1 = require("../math/Matrix3");
var Unit_1 = require("../math/Unit");
var Euclidean3_1 = require("./Euclidean3");
/**
 * A solid sphere of constant density.
 */
var Sphere3 = /** @class */ (function (_super) {
    tslib_1.__extends(Sphere3, _super);
    /**
     *
     */
    function Sphere3(radius) {
        if (radius === void 0) { radius = Geometric3_1.Geometric3.one; }
        var _this = _super.call(this, new Euclidean3_1.Euclidean3()) || this;
        _this.radius_ = Geometric3_1.Geometric3.fromScalar(radius);
        _this.radiusLock_ = _this.radius_.lock();
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
        this.Ω.copyScalar(this.radius_.a, this.radius_.uom);
        this.Ω.quaditude(true);
        this.Ω.mulByScalar(this.M.a, this.M.uom);
        this.Ω.mulByNumber(2 / 5);
        this.Ω.inv();
        this.Ω.mulByBivector(this.L);
    };
    /**
     * Whenever the mass or the dimensions change, we must update the inertia tensor.
     */
    Sphere3.prototype.updateInertiaTensor = function () {
        var r = this.radius_;
        var s = 2 * this.M.a * r.a * r.a / 5;
        var I = Matrix3_1.Matrix3.zero();
        I.setElement(0, 0, s);
        I.setElement(1, 1, s);
        I.setElement(2, 2, s);
        I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(r.uom, r.uom));
        this.I = I;
    };
    return Sphere3;
}(RigidBody_1.RigidBody));
exports.Sphere3 = Sphere3;
