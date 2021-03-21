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
import { RigidBody } from '../core/RigidBody';
import { Geometric3 } from '../math/Geometric3';
import { Matrix3 } from '../math/Matrix3';
import { Unit } from '../math/Unit';
import { Euclidean3 } from './Euclidean3';
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
        if (Unit.isOne(radius.uom) && Unit.isOne(height.uom)) {
            // dimensionless
        }
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
export { Cylinder3 };
