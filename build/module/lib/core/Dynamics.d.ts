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
     * @param rateOfChange
     * @param idx
     * @param body
     */
    setPositionRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<T>): void;
    /**
     * Let Ω(t) be the (bivector) angular velocity.
     * Let R(t) be the (spinor) attitude of the rigid body.
     * The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
     * requiring the geometric product of Ω and R.
     * Ω and R are auxiliary and primary variables that have already been computed.
     *
     * @param rateOfChange
     * @param idx
     * @param body
     */
    setAttitudeRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<T>): void;
    /**
     *
     * @param rateOfChange
     * @param idx
     */
    zeroLinearMomentumVars(rateOfChange: number[], idx: number): void;
    /**
     *
     * @param rateOfChange
     * @param idx
     */
    zeroAngularMomentumVars(rateOfChange: number[], idx: number): void;
    /**
     *
     * @param vars
     * @param idx
     * @param body
     */
    updateBodyFromVars(vars: number[], idx: number, body: ForceBody<T>): void;
    /**
     *
     * @param body
     * @param idx
     * @param vars
     */
    updateVarsFromBody(body: ForceBody<T>, idx: number, vars: VarsList): void;
    /**
     * Adds the specified force to the rateOfChange variables for Linear Momentum.
     * @param rateOfChange
     * @param idx
     * @param force
     */
    addForceToRateOfChangeLinearMomentumVars(rateOfChange: number[], idx: number, force: T): void;
    /**
     * Adds the specified torque to the rateOfChange variables for AngularMomentum.
     * @param rateOfChange
     * @param idx
     * @param torque
     */
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChange: number[], idx: number, torque: T): void;
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
