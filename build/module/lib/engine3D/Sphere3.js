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
        if (Unit.isOne(radius.uom)) {
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
        this.Ω.quad(); // Ω = r * r (scalar)
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
export { Sphere3 };
