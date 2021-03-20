import { Dynamics } from '../core/Dynamics';
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { VarsList } from "../core/VarsList";
import { Geometric2 } from "../math/Geometric2";
import { Unit } from '../math/Unit';
/**
 * @hidden
 */
export declare const INDEX_TOTAL_LINEAR_MOMENTUM_X: number;
/**
 * @hidden
 */
export declare const INDEX_TOTAL_LINEAR_MOMENTUM_Y: number;
/**
 * @hidden
 */
export declare const INDEX_TOTAL_ANGULAR_MOMENTUM_XY: number;
/**
 * @hidden
 */
export declare const OFFSET_POSITION_X = 0;
/**
 * @hidden
 */
export declare const OFFSET_POSITION_Y = 1;
/**
 * @hidden
 */
export declare const OFFSET_ATTITUDE_A = 2;
/**
 * @hidden
 */
export declare const OFFSET_ATTITUDE_XY = 3;
/**
 * @hidden
 */
export declare const OFFSET_LINEAR_MOMENTUM_X = 4;
/**
 * @hidden
 */
export declare const OFFSET_LINEAR_MOMENTUM_Y = 5;
/**
 * @hidden
 */
export declare const OFFSET_ANGULAR_MOMENTUM_XY = 6;
/**
 * @hidden
 */
export declare class Dynamics2 implements Dynamics<Geometric2> {
    numVarsPerBody(): number;
    getVarNames(): string[];
    getOffsetName(offset: number): string;
    discontinuousEnergyVars(): number[];
    epilog(bodies: ForceBody<Geometric2>[], forceLaws: ForceLaw<Geometric2>[], potentialOffset: Geometric2, varsList: VarsList): void;
    updateVarsFromBody(body: ForceBody<Geometric2>, idx: number, vars: VarsList): void;
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric2, uomTime: Unit): void;
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric2): void;
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric2): void;
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Geometric2, uomTime: Unit): void;
    updateBodyFromVars(vars: number[], units: Unit[], idx: number, body: ForceBody<Geometric2>, uomTime: Unit): void;
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>): void;
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>): void;
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>, uomTime: Unit): void;
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric2>, uomTime: Unit): void;
}
