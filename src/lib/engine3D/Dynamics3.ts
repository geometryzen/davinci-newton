import { Dynamics, INDEX_POTENTIAL_ENERGY, INDEX_RESERVED_LAST, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_TOTAL_ENERGY, INDEX_TRANSLATIONAL_KINETIC_ENERGY } from '../core/Dynamics';
import { ForceBody } from '../core/ForceBody';
import { ForceLaw } from '../core/ForceLaw';
import { VarsList } from '../core/VarsList';
import { Geometric3 } from "../math/Geometric3";
import { wedgeXY, wedgeYZ, wedgeZX } from '../math/wedge3';

/**
 * @hidden
 */
export const INDEX_TOTAL_LINEAR_MOMENTUM_X = INDEX_RESERVED_LAST + 1;
/**
 * @hidden
 */
export const INDEX_TOTAL_LINEAR_MOMENTUM_Y = INDEX_RESERVED_LAST + 2;
/**
 * @hidden
 */
export const INDEX_TOTAL_LINEAR_MOMENTUM_Z = INDEX_RESERVED_LAST + 3;
/**
 * @hidden
 */
export const INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = INDEX_RESERVED_LAST + 4;
/**
 * @hidden
 */
export const INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = INDEX_RESERVED_LAST + 5;
/**
 * @hidden
 */
export const INDEX_TOTAL_ANGULAR_MOMENTUM_XY = INDEX_RESERVED_LAST + 6;
/**
 * @hidden
 */
export const OFFSET_POSITION_X = 0;
/**
 * @hidden
 */
export const OFFSET_POSITION_Y = 1;
/**
 * @hidden
 */
export const OFFSET_POSITION_Z = 2;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_A = 3;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_YZ = 4;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_ZX = 5;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_XY = 6;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_X = 7;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_Y = 8;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_Z = 9;
/**
 * @hidden
 */
export const OFFSET_ANGULAR_MOMENTUM_YZ = 10;
/**
 * @hidden
 */
export const OFFSET_ANGULAR_MOMENTUM_ZX = 11;
/**
 * @hidden
 */
export const OFFSET_ANGULAR_MOMENTUM_XY = 12;

/**
 * @hidden
 */
const varNames = [
    VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy",
    "total linear momentum - x",
    "total linear momentum - y",
    "total linear momentum - z",
    "total angular momentum - yz",
    "total angular momentum - zx",
    "total angular momentum - xy"
];

/**
 * @hidden
 */
const DISCONTINUOUS_ENERGY_VARIABLES = [
    INDEX_TRANSLATIONAL_KINETIC_ENERGY,
    INDEX_ROTATIONAL_KINETIC_ENERGY,
    INDEX_POTENTIAL_ENERGY,
    INDEX_TOTAL_ENERGY,
    INDEX_TOTAL_LINEAR_MOMENTUM_X,
    INDEX_TOTAL_LINEAR_MOMENTUM_Y,
    INDEX_TOTAL_LINEAR_MOMENTUM_Z,
    INDEX_TOTAL_ANGULAR_MOMENTUM_YZ,
    INDEX_TOTAL_ANGULAR_MOMENTUM_ZX,
    INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];

/**
 * @hidden
 */
export class Dynamics3 implements Dynamics<Geometric3> {
    numVarsPerBody(): number {
        return 13;
    }
    getVarNames(): string[] {
        return varNames;
    }
    getOffsetName(offset: number): string {
        switch (offset) {
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_POSITION_Y: return "position y";
            case OFFSET_POSITION_Z: return "position z";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_ATTITUDE_YZ: return "attitude yz";
            case OFFSET_ATTITUDE_ZX: return "attitude zx";
            case OFFSET_ATTITUDE_XY: return "attitude xy";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case OFFSET_LINEAR_MOMENTUM_Z: return "linear momentum z";
            case OFFSET_ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
            case OFFSET_ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
            case OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error(`getVarName(${offset})`);
    }
    discontinuousEnergyVars(): number[] {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    }
    epilog(bodies: ForceBody<Geometric3>[], forceLaws: ForceLaw<Geometric3>[], potentialOffset: Geometric3, varsList: VarsList): void {

        // update the variables that track energy
        let pe = potentialOffset.a;
        let re = 0;
        let te = 0;
        // update the variable that track linear momentum (vector)
        let Px = 0;
        let Py = 0;
        let Pz = 0;
        // update the variable that track angular momentum (bivector)
        let Lyz = 0;
        let Lzx = 0;
        let Lxy = 0;

        const bs = bodies;
        const Nb = bs.length;
        for (let i = 0; i < Nb; i++) {
            const b = bs[i];
            if (isFinite(b.M.a)) {
                re += b.rotationalEnergy().a;
                te += b.translationalEnergy().a;
                // linear momentum
                Px += b.P.x;
                Py += b.P.y;
                Pz += b.P.z;
                // orbital angular momentum
                Lyz += wedgeYZ(b.X, b.P);
                Lzx += wedgeZX(b.X, b.P);
                Lxy += wedgeXY(b.X, b.P);
                // spin angular momentum
                Lyz += b.L.yz;
                Lzx += b.L.zx;
                Lxy += b.L.xy;
            }
        }

        const fs = forceLaws;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy().a;
        }

        varsList.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
        varsList.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
        varsList.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
        varsList.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy);
    }
    updateVarsFromBody(body: ForceBody<Geometric3>, idx: number, vars: VarsList): void {
        vars.setValueJump(OFFSET_POSITION_X + idx, body.X.x);
        vars.setValueJump(OFFSET_POSITION_Y + idx, body.X.y);
        vars.setValueJump(OFFSET_POSITION_Z + idx, body.X.z);

        vars.setValueJump(OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValueJump(OFFSET_ATTITUDE_XY + idx, body.R.xy);
        vars.setValueJump(OFFSET_ATTITUDE_YZ + idx, body.R.yz);
        vars.setValueJump(OFFSET_ATTITUDE_ZX + idx, body.R.zx);

        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);

        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
    }
    addForceToRateOfChangeLinearMomentumVars(rateOfChange: number[], idx: number, force: Geometric3): void {
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] += force.x;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] += force.y;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] += force.z;
    }
    getForce(rateOfChange: number[], idx: number, force: Geometric3): void {
        force.x = rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X];
        force.y = rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y];
        force.z = rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z];
    }
    setForce(rateOfChange: number[], idx: number, force: Geometric3): void {
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] = force.x;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.y;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.z;
    }
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChange: number[], idx: number, torque: Geometric3): void {
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_YZ] += torque.yz;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_ZX] += torque.zx;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] += torque.xy;
    }
    updateBodyFromVars(vars: number[], idx: number, body: ForceBody<Geometric3>): void {
        body.X.x = vars[idx + OFFSET_POSITION_X];
        body.X.y = vars[idx + OFFSET_POSITION_Y];
        body.X.z = vars[idx + OFFSET_POSITION_Z];

        body.R.a = vars[idx + OFFSET_ATTITUDE_A];
        body.R.xy = vars[idx + OFFSET_ATTITUDE_XY];
        body.R.yz = vars[idx + OFFSET_ATTITUDE_YZ];
        body.R.zx = vars[idx + OFFSET_ATTITUDE_ZX];

        // Keep the magnitude of the attitude as close to 1 as possible.
        const R = body.R;
        const magR = Math.sqrt(R.a * R.a + R.xy * R.xy + R.yz * R.yz + R.zx * R.zx);
        body.R.a = body.R.a / magR;
        body.R.xy = body.R.xy / magR;
        body.R.yz = body.R.yz / magR;
        body.R.zx = body.R.zx / magR;

        body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
        body.P.z = vars[idx + OFFSET_LINEAR_MOMENTUM_Z];

        body.L.xy = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        body.L.yz = vars[idx + OFFSET_ANGULAR_MOMENTUM_YZ];
        body.L.zx = vars[idx + OFFSET_ANGULAR_MOMENTUM_ZX];

        body.updateAngularVelocity();
    }
    setPositionRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<Geometric3>) {
        // The rate of change of position is the velocity.
        // dX/dt = V = P / M
        const P = body.P;
        const mass = body.M.a;
        rateOfChange[idx + OFFSET_POSITION_X] = P.x / mass;
        rateOfChange[idx + OFFSET_POSITION_Y] = P.y / mass;
        rateOfChange[idx + OFFSET_POSITION_Z] = P.z / mass;
    }
    setAttitudeRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<Geometric3>): void {
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        const R = body.R;
        const Ω = body.Ω;
        rateOfChange[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
        rateOfChange[idx + OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
        rateOfChange[idx + OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
        rateOfChange[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
    }
    zeroLinearMomentumVars(rateOfChange: number[], idx: number): void {
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] = 0;
    }
    zeroAngularMomentumVars(rateOfChange: number[], idx: number): void {
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
    }
}
