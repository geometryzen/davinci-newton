import { Unit } from '../math/Unit';
import { AbstractSubject } from '../util/AbstractSubject';
import { Dynamics } from './Dynamics';
import { EnergySystem } from './EnergySystem';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { Metric } from './Metric';
import { SimList } from './SimList';
import { Simulation } from './Simulation';
import { VarsList } from './VarsList';
/**
 * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * @hidden
 */
export declare class Physics<T> extends AbstractSubject implements Simulation, EnergySystem<T> {
    readonly metric: Metric<T>;
    private readonly dynamics;
    /**
     *
     */
    private readonly $simList;
    /**
     * The list of variables represents the current state of the simulation.
     */
    private readonly $varsList;
    /**
     * The RigidBody(s) in this simulation.
     */
    private readonly $bodies;
    /**
     *
     */
    private readonly $forceLaws;
    /**
     *
     */
    private $showForces;
    /**
     *
     */
    private readonly $potentialOffset;
    /**
     * Scratch variable for computing force.
     */
    private readonly $force;
    /**
     * Scratch variable for computing torque.
     */
    private readonly $torque;
    /**
     * Scratch variable for computing total energy.
     */
    private readonly $totalEnergy;
    private $totalEnergyLock;
    private readonly $numVariablesPerBody;
    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor(metric: Metric<T>, dynamics: Dynamics<T>);
    /**
     * Determines whether calculated forces will be added to the simulation list.
     */
    get showForces(): boolean;
    set showForces(showForces: boolean);
    /**
     *
     */
    addBody(body: ForceBody<T>): void;
    /**
     *
     */
    removeBody(body: ForceBody<T>): void;
    /**
     *
     */
    addForceLaw(forceLaw: ForceLaw<T>): void;
    /**
     *
     */
    removeForceLaw(forceLaw: ForceLaw<T>): void;
    private discontinuosChangeToEnergy;
    /**
     * Transfer state vector back to the rigid bodies.
     * Also takes care of updating auxiliary variables, which are also mutable.
     */
    private updateBodiesFromStateVariables;
    /**
     * Handler for actions to be performed before the evaluate calls.
     * The physics engine removes objects that were temporarily added to the simulation
     * list but have expired.
     * @hidden
     */
    prolog(): void;
    /**
     * Gets the state vector, Y(t).
     * The returned array is a copy of the state vector variable values.
     * However, for performance, the array is maintained between invocations.
     * @hidden
     */
    getState(): number[];
    /**
     * Sets the state vector, Y(t).
     * @hidden
     */
    setState(state: number[]): void;
    /**
     * The time value is not being used because the DiffEqSolver has updated the vars.
     * This will move the objects and forces will be recalculated.
     * If anything it could be passed to forceLaw.updateForces.
     * @hidden
     */
    evaluate(state: number[], rateOfChange: number[], Δt: number, uomTime?: Unit): void;
    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChange The (output) rate of change of the state variables.
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    private applyForce;
    /**
     *
     */
    get time(): number;
    /**
     *
     */
    updateFromBodies(): void;
    /**
     *
     */
    private updateVarsFromBody;
    /**
     * Handler for actions to be performed after the evaluate calls and setState.
     * Computes the system energy, linear momentum and angular momentum.
     * @hidden
     */
    epilog(): void;
    /**
     * Provides a reference to the bodies in the simulation.
     */
    get bodies(): ForceBody<T>[];
    /**
     * @hidden
     */
    get simList(): SimList;
    /**
     * @hidden
     */
    get varsList(): VarsList;
    /**
     * Computes the sum of the translational and rotational kinetic energy of all bodies,
     * and the potential energy due to body interactions for the force laws.
     */
    totalEnergy(): T;
}
