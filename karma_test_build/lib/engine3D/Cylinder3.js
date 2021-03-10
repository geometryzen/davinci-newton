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
exports.Cylinder3 = void 0;
var tslib_1 = require("tslib");
var RigidBody_1 = require("../core/RigidBody");
var Geometric3_1 = require("../math/Geometric3");
var Matrix3_1 = require("../math/Matrix3");
var Unit_1 = require("../math/Unit");
var Euclidean3_1 = require("./Euclidean3");
/**
 * A solid cylinder of uniform density.
 */
var Cylinder3 = /** @class */ (function (_super) {
    tslib_1.__extends(Cylinder3, _super);
    /**
     *
     */
    function Cylinder3(radius, height) {
        if (radius === void 0) { radius = Geometric3_1.Geometric3.one; }
        if (height === void 0) { height = Geometric3_1.Geometric3.one; }
        var _this = _super.call(this, new Euclidean3_1.Euclidean3()) || this;
        _this.radius_ = Geometric3_1.Geometric3.copy(radius);
        _this.radiusLock_ = _this.radius_.lock();
        _this.height_ = Geometric3_1.Geometric3.copy(height);
        _this.heightLock_ = _this.height_.lock();
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
        var I = Matrix3_1.Matrix3.zero();
        I.setElement(0, 0, Irr);
        I.setElement(1, 1, Ihh);
        I.setElement(2, 2, Irr);
        I.uom = Unit_1.Unit.mul(this.M.uom, Unit_1.Unit.mul(r.uom, h.uom));
        this.I = I;
    };
    return Cylinder3;
}(RigidBody_1.RigidBody));
exports.Cylinder3 = Cylinder3;
