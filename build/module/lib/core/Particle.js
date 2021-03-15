import { __extends } from "tslib";
import { RigidBody } from './RigidBody';
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
        // Do nothing yet.
        // The angular velocity will remain at zero.
    };
    /**
     * The inertia tensor should always be zero.
     */
    Particle.prototype.updateInertiaTensor = function () {
        // Do nothing yet.
        // The inertia tensor will remain as the identity matrix.
    };
    return Particle;
}(RigidBody));
export { Particle };
