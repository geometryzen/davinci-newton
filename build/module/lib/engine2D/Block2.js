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
import { __extends } from "tslib";
import { Geometric2 } from '../math/Geometric2';
import { Mat1 } from '../math/Mat1';
import { Unit } from '../math/Unit';
import { RigidBody2 } from './RigidBody2';
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
        _this.width_ = Geometric2.copy(width);
        _this.widthLock_ = _this.width_.lock();
        _this.height_ = Geometric2.copy(height);
        _this.heightLock_ = _this.height_.lock();
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
        var s = this.M.a * (hh + ww) / 12;
        var I = new Mat1(s);
        I.uom = Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom));
        this.I = I;
    };
    return Block2;
}(RigidBody2));
export { Block2 };
