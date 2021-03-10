import { __extends } from "tslib";
import { RigidBody } from './RigidBody';
/**
 * An object with no internal structure.
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
        throw new Error();
    };
    /**
     * The inertia tensor should always be zero.
     */
    Particle.prototype.updateInertiaTensor = function () {
        // Do nothing yet.
    };
    return Particle;
}(RigidBody));
export { Particle };
