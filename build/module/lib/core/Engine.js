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
 * An example of how to wire together the various components.
 * @hidden
 */
var Engine = /** @class */ (function () {
    function Engine(metric, dynamics, options) {
        this.physics = new Physics(metric, dynamics);
        var rk4 = new RungeKutta(this.physics);
        this.strategy = new DefaultAdvanceStrategy(this.physics, rk4);
    }
    Object.defineProperty(Engine.prototype, "varsList", {
        get: function () {
            return this.physics.varsList;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * @param body
     */
    Engine.prototype.addBody = function (body) {
        var contextBuilder = function () { return "Engine.addBody(body: ForceBody): void"; };
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.addBody(body);
    };
    /**
     *
     * @param body
     */
    Engine.prototype.removeBody = function (body) {
        var contextBuilder = function () { return "Engine.removeBody(body: ForceBody): void"; };
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.removeBody(body);
    };
    Engine.prototype.addForceLaw = function (forceLaw) {
        var contextBuilder = function () { return "Engine.addForceLaw(forceLaw: ForceLaw): void"; };
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.addForceLaw(forceLaw);
    };
    Engine.prototype.removeForceLaw = function (forceLaw) {
        var contextBuilder = function () { return "Engine.removeForceLaw(forceLaw: ForceLaw): void"; };
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.removeForceLaw(forceLaw);
    };
    /**
     *
     * @param torqueLaw
     */
    Engine.prototype.addTorqueLaw = function (torqueLaw) {
        var contextBuilder = function () { return "Engine.addTorqueLaw(torqueLaw: TorqueLaw): void"; };
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.addTorqueLaw(torqueLaw);
    };
    /**
     *
     * @param torqueLaw
     */
    Engine.prototype.removeTorqueLaw = function (torqueLaw) {
        var contextBuilder = function () { return "Engine.removeTorqueLaw(torqueLaw: TorqueLaw): void"; };
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.removeTorqueLaw(torqueLaw);
    };
    Engine.prototype.addConstraint = function (geometry) {
        var contextBuilder = function () { return "Engine.addGeometricConstraint(geometry: GeometricConstraint): void"; };
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.addConstraint(geometry);
    };
    Engine.prototype.removeConstraint = function (geometry) {
        var contextBuilder = function () { return "Engine.removeGeometricConstraint(geometry: GeometricConstraint): void"; };
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.removeConstraint(geometry);
    };
    Engine.prototype.addDriftLaw = function (driftLaw) {
        var contextBuilder = function () { return "Engine.addDriftLaw(driftLaw: ForceLaw): void"; };
        mustBeNonNullObject('driftLaw', driftLaw, contextBuilder);
        this.physics.addDriftLaw(driftLaw);
    };
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
     *
     */
    Engine.prototype.updateFromBodies = function () {
        this.physics.updateFromBodies();
    };
    return Engine;
}());
export { Engine };
