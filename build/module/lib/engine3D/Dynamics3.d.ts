import { Dynamics } from '../core/Dynamics';
import { ForceBody } from '../core/ForceBody';
import { ForceLaw } from '../core/ForceLaw';
import { VarsList } from '../core/VarsList';
import { Geometric3 } from "../math/Geometric3";
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
export declare const INDEX_TOTAL_LINEAR_MOMENTUM_Z: number;
/**
 * @hidden
 */
export declare const INDEX_TOTAL_ANGULAR_MOMENTUM_YZ: number;
/**
 * @hidden
 */
export declare const INDEX_TOTAL_ANGULAR_MOMENTUM_ZX: number;
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
export declare const OFFSET_POSITION_Z = 2;
/**
 * @hidden
 */
export declare const OFFSET_ATTITUDE_A = 3;
/**
 * @hidden
 */
export declare const OFFSET_ATTITUDE_YZ = 4;
/**
 * @hidden
 */
export declare const OFFSET_ATTITUDE_ZX = 5;
/**
 * @hidden
 */
export declare const OFFSET_ATTITUDE_XY = 6;
/**
 * @hidden
 */
export declare const OFFSET_LINEAR_MOMENTUM_X = 7;
/**
 * @hidden
 */
export declare const OFFSET_LINEAR_MOMENTUM_Y = 8;
/**
 * @hidden
 */
export declare const OFFSET_LINEAR_MOMENTUM_Z = 9;
/**
 * @hidden
 */
export declare const OFFSET_ANGULAR_MOMENTUM_YZ = 10;
/**
 * @hidden
 */
export declare const OFFSET_ANGULAR_MOMENTUM_ZX = 11;
/**
 * @hidden
 */
export declare const OFFSET_ANGULAR_MOMENTUM_XY = 12;
/**
 * @hidden
 */
export declare class Dynamics3 implements Dynamics<Geometric3> {
    numVarsPerBody(): number;
    getVarNames(): string[];
    getOffsetName(offset: number): string;
    discontinuousEnergyVars(): number[];
    epilog(bodies: ForceBody<Geometric3>[], forceLaws: ForceLaw<Geometric3>[], potentialOffset: Geometric3, varsList: VarsList): void;
    updateVarsFromBody(body: ForceBody<Geometric3>, idx: number, vars: VarsList): void;
    addForceToRateOfChangeLinearMomentumVars(rateOfChange: number[], idx: number, force: Geometric3): void;
    getForce(rateOfChange: number[], idx: number, force: Geometric3): void;
    setForce(rateOfChange: number[], idx: number, force: Geometric3): void;
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChange: number[], idx: number, torque: Geometric3): void;
    updateBodyFromVars(vars: number[], idx: number, body: ForceBody<Geometric3>): void;
    setPositionRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<Geometric3>): void;
    setAttitudeRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<Geometric3>): void;
    zeroLinearMomentumVars(rateOfChange: number[], idx: number): void;
    zeroAngularMomentumVars(rateOfChange: number[], idx: number): void;
}
