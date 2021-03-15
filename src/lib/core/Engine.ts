import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Unit } from '../math/Unit';
import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { RungeKutta } from '../solvers/RungeKutta';
import { DefaultAdvanceStrategy } from '../strategy/DefaultAdvanceStrategy';
import { DiffEqSolver } from './DiffEqSolver';
import { Dynamics } from './Dynamics';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
import { Metric } from './Metric';
import { Physics } from './Physics';
import { TorqueLaw } from './TorqueLaw';

/**
 * @hidden
 */
const contextBuilderAdvance = () => "Engine.advance(Δt: number, uomTime?: Unit): void";

/**
 * 
 */
export interface EngineOptions {
    method?: 'rk4';
}

/**
 * An example of how to wire together the various components.
 * @hidden
 */
export class Engine<T> {
    private readonly physics: Physics<T>;
    private readonly strategy: AdvanceStrategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>, options?: Partial<EngineOptions>) {
        this.physics = new Physics(metric, dynamics);
        const rk4: DiffEqSolver = new RungeKutta(this.physics);
        this.strategy = new DefaultAdvanceStrategy(this.physics, rk4);
    }
    /**
     * 
     * @param body 
     */
    addBody(body: ForceBody<T>): void {
        const contextBuilder = () => "Engine.addBody(body: ForceBody): void";
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.addBody(body);
    }
    /**
     * 
     * @param body 
     */
    removeBody(body: ForceBody<T>): void {
        const contextBuilder = () => "Engine.removeBody(body: ForceBody): void";
        mustBeNonNullObject('body', body, contextBuilder);
        this.physics.removeBody(body);
    }

    /**
     * 
     * @param forceLaw 
     */
    addForceLaw(forceLaw: ForceLaw<T>): void {
        const contextBuilder = () => "Engine.addForceLaw(forceLaw: ForceLaw): void";
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.addForceLaw(forceLaw);
    }
    /**
     * 
     * @param forceLaw 
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void {
        const contextBuilder = () => "Engine.removeForceLaw(forceLaw: ForceLaw): void";
        mustBeNonNullObject('forceLaw', forceLaw, contextBuilder);
        this.physics.removeForceLaw(forceLaw);
    }

    /**
     * 
     * @param torqueLaw 
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void {
        const contextBuilder = () => "Engine.addTorqueLaw(torqueLaw: TorqueLaw): void";
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.addTorqueLaw(torqueLaw);
    }
    /**
     * 
     * @param torqueLaw 
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void {
        const contextBuilder = () => "Engine.removeTorqueLaw(torqueLaw: TorqueLaw): void";
        mustBeNonNullObject('torqueLaw', torqueLaw, contextBuilder);
        this.physics.removeTorqueLaw(torqueLaw);
    }

    addConstraint(geometry: GeometricConstraint<T>): void {
        const contextBuilder = () => "Engine.addGeometricConstraint(geometry: GeometricConstraint): void";
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.addConstraint(geometry);
    }

    removeConstraint(geometry: GeometricConstraint<T>): void {
        const contextBuilder = () => "Engine.removeGeometricConstraint(geometry: GeometricConstraint): void";
        mustBeNonNullObject('geometry', geometry, contextBuilder);
        this.physics.removeConstraint(geometry);
    }

    /**
     * Advances the Physics model by the specified time interval, Δt * uomTime.   
     * @param Δt The time interval. 
     * @param uomTime The optional unit of measure for the time interval.
     */
    advance(Δt: number, uomTime?: Unit): void {
        mustBeNumber('Δt', Δt, contextBuilderAdvance);
        this.strategy.advance(Δt, uomTime);
    }
    /**
     * 
     */
    updateFromBodies(): void {
        this.physics.updateFromBodies();
    }
}
