import { Unit } from "../math/Unit";
import { ForceBody } from "./ForceBody";
import { ForceLaw } from "./ForceLaw";
import { VarsList } from "./VarsList";
/**
 * @hidden
 */
export declare const INDEX_TIME = 0;
/**
 * @hidden
 */
export declare const INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
/**
 * @hidden
 */
export declare const INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
/**
 * @hidden
 */
export declare const INDEX_POTENTIAL_ENERGY = 3;
/**
 * @hidden
 */
export declare const INDEX_TOTAL_ENERGY = 4;
/**
 * @hidden
 */
export declare const INDEX_RESERVED_LAST = 4;
/**
 * @hidden
 */
export interface Dynamics<T> {
    /**
     * The rate of change of position is the velocity.
     * dX/dt = V = P / M
     *
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     */
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>): void;
    /**
     * Let Ω(t) be the (bivector) angular velocity.
     * Let R(t) be the (spinor) attitude of the rigid body.
     * The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
     * requiring the geometric product of Ω and R.
     * Ω and R are auxiliary and primary variables that have already been computed.
     *
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     */
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>): void;
    /**
     *
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     *
     * @param rateOfChangeVals (output)
     * @param rateOfChangeUoms (output)
     * @param idx (input)
     * @param body (input)
     * @param uomTime (input)
     */
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<T>, uomTime: Unit): void;
    /**
     *
     * @param vars
     * @param units
     * @param idx
     * @param body
     */
    updateBodyFromVars(vars: number[], units: Unit[], idx: number, body: ForceBody<T>): void;
    /**
     *
     * @param body
     * @param idx
     * @param vars
     */
    updateVarsFromBody(body: ForceBody<T>, idx: number, vars: VarsList): void;
    /**
     * Adds the specified force to the rateOfChange variables for Linear Momentum.
     * @param rateOfChange (input/output)
     * @param units (input/output)
     * @param idx (input)
     * @param force (input)
     * @param uomTime (input)
     */
    addForceToRateOfChangeLinearMomentumVars(rateOfChange: number[], units: Unit[], idx: number, force: T, uomTime: Unit): void;
    /**
     *
     * @param rateOfChange (input)
     * @param units (input)
     * @param idx (input)
     * @param force (output)
     */
    getForce(rateOfChange: number[], units: Unit[], idx: number, force: T): void;
    /**
     *
     * @param rateOfChange (output)
     * @param units (output)
     * @param idx (input)
     * @param force (input)
     */
    setForce(rateOfChange: number[], units: Unit[], idx: number, force: T): void;
    /**
     * Adds the specified torque to the rateOfChange variables for AngularMomentum.
     * @param rateOfChange (input/output)
     * @param units (input/output)
     * @param idx (input)
     * @param torque (input)
     * @param uomTime (input)
     */
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChange: number[], units: Unit[], idx: number, torque: T, uomTime: Unit): void;
    /**
     *
     * @param bodies
     * @param forceLaws
     * @param potentialOffset
     * @param vars
     */
    epilog(bodies: ForceBody<T>[], forceLaws: ForceLaw<T>[], potentialOffset: T, vars: VarsList): void;
    /**
     *
     */
    discontinuousEnergyVars(): number[];
    /**
     *
     * @param offset
     */
    getOffsetName(offset: number): string;
    /**
     *
     */
    getVarNames(): string[];
    /**
     *
     */
    numVarsPerBody(): number;
}
