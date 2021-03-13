import { Unit } from '../math/Unit';
import { AdvanceStrategy } from '../runner/AdvanceStrategy';
import { Dynamics } from './Dynamics';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { Metric } from './Metric';
import { Physics } from './Physics';
/**
 *
 */
export interface EngineOptions {
}
/**
 * An example of how to wire together the various components.
 * @hidden
 */
export declare class Engine<T> {
    readonly physics: Physics<T>;
    readonly strategy: AdvanceStrategy;
    constructor(metric: Metric<T>, dynamics: Dynamics<T>, options?: Partial<EngineOptions>);
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
    /**
     *
     * @param forceLaw
     */
    addForceLaw(forceLaw: ForceLaw<T>): void;
    /**
     *
     * @param forceLaw
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void;
    /**
     * Advances the Physics model by the specified time interval, Δt * uomTime.
     * @param Δt The time interval.
     * @param uomTime The optional unit of measure for the time interval.
     */
    advance(Δt: number, uomTime?: Unit): void;
}
