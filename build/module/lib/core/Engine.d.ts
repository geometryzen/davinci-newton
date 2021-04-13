import { Unit } from '../math/Unit';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
import { Kinematics } from './Kinematics';
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
 * A generic Physics Engine that may be specialized to a metric.
 */
export declare class Engine<T> {
    private readonly physics;
    private readonly strategy;
    /**
     *
     * @param metric
     * @param dynamics
     * @param options
     */
    constructor(metric: Metric<T>, dynamics: Kinematics<T>, options?: Partial<EngineOptions>);
    /**
     * Returns the state variables of the system.
     */
    get varsList(): VarsList;
    /**
     * Adds a body to the system.
     * The state variables of the body will become part of the state vector of the system.
     * The state variables of the body will be updated each time the system is advanced in time.
     * @param body The body to be added to the system
     */
    addBody(body: ForceBody<T>): void;
    /**
     * Removes a body from the system.
     * @param body The body to be removed from the system.
     */
    removeBody(body: ForceBody<T>): void;
    /**
     * Adds a force law to the system.
     * @param forceLaw The force law to be added to the system.
     */
    addForceLaw(forceLaw: ForceLaw<T>): void;
    /**
     * Removes a force law from the system.
     * @param forceLaw The force law to be removed.
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void;
    /**
     * Adds a torque law to the system.
     * @param torqueLaw The torque law to be added to the system.
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    /**
     * Removes a torque law from the system.
     * @param torqueLaw The torque law to be removed from the system.
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    /**
     * Adds a geometric constraint to the system.
     * Geometric constraints are applied after the force and torques have been computed and before drift forces and torques.
     * @param geometry The geometric constraint to be added to the system.
     */
    addConstraint(geometry: GeometricConstraint<T>): void;
    /**
     * Removes a geometric constraint from the system.
     * @param geometry The geometric constraint to be removed from the system.
     */
    removeConstraint(geometry: GeometricConstraint<T>): void;
    /**
     * Adds a force law that is designed to compensate for numerical drift in the system.
     * A drift law is usually small and may take the form of a spring and/or damping force.
     * The drift laws are applied after any geometric constraints have been applied.
     * @param driftLaw The drift force law to be applied.
     */
    addDriftLaw(driftLaw: ForceLaw<T>): void;
    /**
     * Removes a force law that is designed to compensate for numerical drift in the system.
     * @param driftLaw The drift force law to be removed.
     */
    removeDriftLaw(driftLaw: ForceLaw<T>): void;
    /**
     * Advances the Physics model by the specified time interval, Δt * uomTime.
     * @param Δt The time interval.
     * @param uomTime The optional unit of measure for the time interval.
     */
    advance(Δt: number, uomTime?: Unit): void;
    /**
     * Updates the state vector of the simulation from the states of the bodies in the system.
     * It is necessary to call this method after an intervention which changes the state of
     * a body in the system.
     */
    updateFromBodies(): void;
    /**
     *
     * @returns The total energy (kinetic and potential) of the system.
     */
    totalEnergy(): T;
}
