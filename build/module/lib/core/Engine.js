import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { Physics } from './Physics';
/**
 * @hidden
 */
var contextBuilderAdvance = function () { return "Engine.advance(Δt: number, uomTime?: Unit): void"; };
/**
 * A generic Physics Engine that may be specialized to a metric.
 */
var Engine = /** @class */ (function () {
    /**
     *
     * @param metric
     * @param kinematics
     * @param options
     */
    function Engine(metric, kinematics, options) {
        this.kinematics = kinematics;
        this.physics = new Physics(metric, kinematics);
        var rk4 = new RungeKutta(this.physics);
        this.strategy = new DefaultAdvanceStrategy(this.physics, rk4);
    }
    Object.defineProperty(Engine.prototype, "speedOfLight", {
        /**
         * The speed of light.
         * For dimensionless simulations this will default to 1.
         * For S.I. Units, the speed of light may be set.
         */
        get: function () {
            return this.kinematics.speedOfLight;
        },
        set: function (speedOfLight) {
            this.kinematics.speedOfLight = speedOfLight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "bodies", {
        get: function () {
            return this.physics.bodies;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "varsList", {
        /**
         * Returns the state variables of the system.
         */
        get: function () {
            return this.physics.varsList;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "simList", {
        get: function () {
            return this.physics.simList;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a body to the system.
     * The state variables of the body will become part of the state vector of the system.
     * The state variables of the body will be updated each time the system is advanced in time.
     * @param body The body to be added to the system
     */
    Engine.prototype.addBody = function (body) {
        var contextBuilder = function () { return "Engine.addBody(body: ForceBody): void"; };
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.addBody(body);
    };
    /**
     * Removes a body from the system.
     * @param body The body to be removed from the system.
     */
    Engine.prototype.removeBody = function (body) {
        var contextBuilder = function () { return "Engine.removeBody(body: ForceBody): void"; };
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.removeBody(body);
    };
    /**
     * Adds a force law to the system.
     * @param forceLaw The force law to be added to the system.
     */
    Engine.prototype.addForceLaw = function (forceLaw) {
        var contextBuilder = function () { return "Engine.addForceLaw(forceLaw: ForceLaw): void"; };
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.addForceLaw(forceLaw);
    };
    /**
     * Removes a force law from the system.
     * @param forceLaw The force law to be removed.
     */
    Engine.prototype.removeForceLaw = function (forceLaw) {
        var contextBuilder = function () { return "Engine.removeForceLaw(forceLaw: ForceLaw): void"; };
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.removeForceLaw(forceLaw);
    };
    /**
     * Adds a torque law to the system.
     * @param torqueLaw The torque law to be added to the system.
     */
    Engine.prototype.addTorqueLaw = function (torqueLaw) {
        var contextBuilder = function () { return "Engine.addTorqueLaw(torqueLaw: TorqueLaw): void"; };
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.addTorqueLaw(torqueLaw);
    };
    /**
     * Removes a torque law from the system.
     * @param torqueLaw The torque law to be removed from the system.
     */
    Engine.prototype.removeTorqueLaw = function (torqueLaw) {
        var contextBuilder = function () { return "Engine.removeTorqueLaw(torqueLaw: TorqueLaw): void"; };
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.removeTorqueLaw(torqueLaw);
    };
    /**
     * Adds a geometric constraint to the system.
     * Geometric constraints are applied after the force and torques have been computed and before drift forces and torques.
     * @param geometry The geometric constraint to be added to the system.
     */
    Engine.prototype.addConstraint = function (geometry) {
        var contextBuilder = function () { return "Engine.addGeometricConstraint(geometry: GeometricConstraint): void"; };
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.addConstraint(geometry);
    };
    /**
     * Removes a geometric constraint from the system.
     * @param geometry The geometric constraint to be removed from the system.
     */
    Engine.prototype.removeConstraint = function (geometry) {
        var contextBuilder = function () { return "Engine.removeGeometricConstraint(geometry: GeometricConstraint): void"; };
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.removeConstraint(geometry);
    };
    /**
     * Adds a force law that is designed to compensate for numerical drift in the system.
     * A drift law is usually small and may take the form of a spring and/or damping force.
     * The drift laws are applied after any geometric constraints have been applied.
     * @param driftLaw The drift force law to be applied.
     */
    Engine.prototype.addDriftLaw = function (driftLaw) {
        var contextBuilder = function () { return "Engine.addDriftLaw(driftLaw: ForceLaw): void"; };
        mustBeNonNullObject('driftLaw', driftLaw, contextBuilder);
        this.physics.addDriftLaw(driftLaw);
    };
    /**
     * Removes a force law that is designed to compensate for numerical drift in the system.
     * @param driftLaw The drift force law to be removed.
     */
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
     * Updates the state vector of the simulation from the states of the bodies in the system.
     * It is necessary to call this method after an intervention which changes the state of
     * a body in the system.
     */
    Engine.prototype.updateFromBodies = function () {
        this.physics.updateFromBodies();
    };
    /**
     *
     * @returns The total energy (kinetic and potential) of the system.
     */
    Engine.prototype.totalEnergy = function () {
        return this.physics.totalEnergy();
    };
    return Engine;
}());
export { Engine };
