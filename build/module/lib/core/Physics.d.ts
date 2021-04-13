import { Unit } from '../math/Unit';
import { AbstractSubject } from '../util/AbstractSubject';
import { EnergySystem } from './EnergySystem';
import { ForceBody } from './ForceBody';
import { ForceLaw } from './ForceLaw';
import { GeometricConstraint } from './GeometricConstraint';
import { Kinematics } from './Kinematics';
import { Metric } from './Metric';
import { SimList } from './SimList';
import { Simulation } from './Simulation';
import { TorqueLaw } from './TorqueLaw';
import { VarsList } from './VarsList';
/**
 * The Physics engine computes the derivatives of the kinematic variables X, R, P, J for each body,
 * based upon the state of the system and the known forces, torques, masses, and moments of inertia.
 * @hidden
 */
export declare class Physics<T> extends AbstractSubject implements Simulation, EnergySystem<T> {
    readonly metric: Metric<T>;
    private readonly kinematics;
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
    private readonly $torqueLaws;
    /**
     *
     */
    private readonly $constraints;
    /**
     *
     */
    private readonly $driftLaws;
    /**
     *
     */
    private $showForces;
    /**
     *
     */
    private $showTorques;
    /**
     * Scratch variavle for computing a potential energy offset.
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
    /**
     * We should be able to calculate this from the dimensionality?
     */
    private readonly $numVariablesPerBody;
    /**
     * Constructs a Physics engine for 3D simulations.
     */
    constructor(metric: Metric<T>, kinematics: Kinematics<T>);
    getVariableName(idx: number): string;
    /**
     * Determines whether calculated forces will be added to the simulation list.
     */
    get showForces(): boolean;
    set showForces(showForces: boolean);
    /**
     * Determines whether calculated torques will be added to the simulation list.
     */
    get showTorques(): boolean;
    set showTorques(showTorques: boolean);
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
    /**
     *
     */
    addTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    /**
     *
     */
    removeTorqueLaw(torqueLaw: TorqueLaw<T>): void;
    /**
     *
     */
    addConstraint(geometry: GeometricConstraint<T>): void;
    /**
     *
     * @param geometry
     */
    removeConstraint(geometry: GeometricConstraint<T>): void;
    /**
     *
     */
    addDriftLaw(driftLaw: ForceLaw<T>): void;
    /**
     *
     */
    removeDriftLaw(driftLaw: ForceLaw<T>): void;
    private discontinuousChangeToEnergy;
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
    getUnits(): Unit[];
    setUnits(units: Unit[]): void;
    /**
     * The time value is not being used because the DiffEqSolver has updated the vars?
     * This will move the objects and forces will be recalculated.u
     * @hidden
     */
    evaluate(state: number[], stateUnits: Unit[], rateOfChangeVals: number[], rateOfChangeUoms: Unit[], Δt: number, uomTime?: Unit): void;
    /**
     *
     * @param rateOfChange (output)
     * @param rateOfChangeUnits (output)
     * @param Δt
     * @param uomTime
     */
    private applyForceLaws;
    private applyDriftLaws;
    /**
     * Applying forces gives rise to linear and angular momentum.
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param forceApp The force application which results in a rate of change of linear and angular momentum
     */
    private applyForce;
    private applyTorqueLaws;
    /**
     *
     * @param rateOfChangeVals (input/output)
     * @param rateOfChangeUoms (input/output)
     * @param torqueApp
     * @param Δt
     * @param uomTime
     * @returns
     */
    private applyTorque;
    private applyConstraints;
    private applyConstraint;
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
    epilog(stepSize: number, uomTime?: Unit): void;
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
