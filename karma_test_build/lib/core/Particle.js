"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Particle = void 0;
var tslib_1 = require("tslib");
var RigidBody_1 = require("./RigidBody");
/**
 * An object with no internal structure.
 */
var Particle = /** @class */ (function (_super) {
    tslib_1.__extends(Particle, _super);
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
}(RigidBody_1.RigidBody));
exports.Particle = Particle;
