import { Dynamics } from '../core/Dynamics';
import { Geometric3 } from "../math/Geometric3";
import { ForceBody2 } from '../engine/ForceBody2';
import { VarsList } from '../core/VarsList';
import { ForceLaw2 } from '../engine/ForceLaw2';
import { wedgeXY, wedgeYZ, wedgeZX } from '../math/wedge3';

export const INDEX_TIME = 0;
export const INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
export const INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
export const INDEX_POTENTIAL_ENERGY = 3;
export const INDEX_TOTAL_ENERGY = 4;
export const INDEX_TOTAL_LINEAR_MOMENTUM_X = 5;
export const INDEX_TOTAL_LINEAR_MOMENTUM_Y = 6;
export const INDEX_TOTAL_LINEAR_MOMENTUM_Z = 7;
export const INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = 8;
export const INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = 9;
export const INDEX_TOTAL_ANGULAR_MOMENTUM_XY = 10;
export const OFFSET_POSITION_X = 0;
export const OFFSET_POSITION_Y = 1;
export const OFFSET_POSITION_Z = 2;
export const OFFSET_ATTITUDE_A = 3;
export const OFFSET_ATTITUDE_YZ = 4;
export const OFFSET_ATTITUDE_ZX = 5;
export const OFFSET_ATTITUDE_XY = 6;
export const OFFSET_LINEAR_MOMENTUM_X = 7;
export const OFFSET_LINEAR_MOMENTUM_Y = 8;
export const OFFSET_LINEAR_MOMENTUM_Z = 9;
export const OFFSET_ANGULAR_MOMENTUM_YZ = 10;
export const OFFSET_ANGULAR_MOMENTUM_ZX = 11;
export const OFFSET_ANGULAR_MOMENTUM_XY = 12;

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


export class Dynamics3D implements Dynamics<Geometric3> {
    numVariablesPerBody(): number {
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
    discontinuousEnergyVariables(): number[] {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    }
    epilog(bodies: ForceBody2<Geometric3>[], forceLaws: ForceLaw2<Geometric3>[], potentialOffset: Geometric3, varsList: VarsList): void {

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

        varsList.setValue(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
        varsList.setValue(INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
        varsList.setValue(INDEX_POTENTIAL_ENERGY, pe, true);
        varsList.setValue(INDEX_TOTAL_ENERGY, te + re + pe, true);
        varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
        varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
        varsList.setValue(INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz, true);
        varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz, true);
        varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx, true);
        varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
    }
    updateVarsFromBody(body: ForceBody2<Geometric3>, idx: number, vars: VarsList): void {
        vars.setValue(OFFSET_POSITION_X + idx, body.X.x);
        vars.setValue(OFFSET_POSITION_Y + idx, body.X.y);
        vars.setValue(OFFSET_POSITION_Z + idx, body.X.z);

        vars.setValue(OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValue(OFFSET_ATTITUDE_XY + idx, body.R.xy);
        vars.setValue(OFFSET_ATTITUDE_YZ + idx, body.R.yz);
        vars.setValue(OFFSET_ATTITUDE_ZX + idx, body.R.zx);

        vars.setValue(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValue(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
        vars.setValue(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);

        vars.setValue(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
        vars.setValue(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
        vars.setValue(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
    }
    addForce(rateOfChange: number[], idx: number, force: Geometric3): void {
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] += force.x;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] += force.y;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] += force.z;
    }
    addTorque(rateOfChange: number[], idx: number, torque: Geometric3): void {
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_YZ] += torque.yz;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_ZX] += torque.zx;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] += torque.xy;
    }
    updateBody(vars: number[], idx: number, body: ForceBody2<Geometric3>): void {
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
    setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody2<Geometric3>) {
        // The rate of change of position is the velocity.
        // dX/dt = V = P / M
        const P = body.P;
        const mass = body.M.a;
        rateOfChange[idx + OFFSET_POSITION_X] = P.x / mass;
        rateOfChange[idx + OFFSET_POSITION_Y] = P.y / mass;
        rateOfChange[idx + OFFSET_POSITION_Z] = P.z / mass;
    }
    setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody2<Geometric3>): void {
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
    zeroLinearMomentum(rateOfChange: number[], idx: number): void {
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Z] = 0;
    }
    zeroAngularMomentum(rateOfChange: number[], idx: number): void {
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
    }
}
