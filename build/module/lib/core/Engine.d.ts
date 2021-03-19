import { Unit } from '../math/Unit';
import { Dynamics } from './Dynamics';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
import { Metric } from './Metric';
import { TorqueLaw } from './TorqueLaw';
import { VarsList } from './VarsList';
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
export declare class Engine<T> {
    private readonly physics;
    private readonly strategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>, options?: Partial<EngineOptions>);
    get varsList(): VarsList;
    /**
     *
     * @param body
     */
    addBody(body: ForceBody<T>): void;
    /**
     *
     * @param body
     */
    removeBody(body: ForceBody<T>): void;
    addForceLaw(forceLaw: ForceLaw<T>): void;
    removeForceLaw(forceLaw: ForceLaw<T>): void;
    /**
     *
     * @param torqueLaw
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    /**
     *
     * @param torqueLaw
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    addConstraint(geometry: GeometricConstraint<T>): void;
    removeConstraint(geometry: GeometricConstraint<T>): void;
    addDriftLaw(driftLaw: ForceLaw<T>): void;
    removeDriftLaw(driftLaw: ForceLaw<T>): void;
    /**
     * Advances the Physics model by the specified time interval, Δt * uomTime.
     * @param Δt The time interval.
     * @param uomTime The optional unit of measure for the time interval.
     */
    advance(Δt: number, uomTime?: Unit): void;
    /**
     *
     */
    updateFromBodies(): void;
    totalEnergy(): T;
}
