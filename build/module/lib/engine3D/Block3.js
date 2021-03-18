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
import { Geometric3 } from '../math/Geometric3';
import { Matrix3 } from '../math/Matrix3';
import { Unit } from '../math/Unit';
import { RigidBody } from '../core/RigidBody';
import { Euclidean3 } from './Euclidean3';
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
        _this.width_ = Geometric3.copy(width);
        _this.widthLock_ = _this.width_.lock();
        _this.height_ = Geometric3.copy(height);
        _this.heightLock_ = _this.height_.lock();
        _this.depth_ = Geometric3.copy(depth);
        _this.depthLock_ = _this.depth_.lock();
        if (Unit.isOne(width.uom) && Unit.isOne(height.uom) && Unit.isOne(depth.uom)) {
            // dimensionless
        }
        else {
            _this.M = Geometric3.scalar(_this.M.a, Unit.KILOGRAM);
            _this.I.uom = Unit.JOULE_SECOND.mul(Unit.SECOND);
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
        var I = Matrix3.zero();
        I.setElement(0, 0, s * (hh + dd));
        I.setElement(1, 1, s * (dd + ww));
        I.setElement(2, 2, s * (ww + hh));
        I.uom = Unit.mul(this.M.uom, Unit.mul(w.uom, w.uom));
        this.I = I;
    };
    return Block3;
}(RigidBody));
export { Block3 };
