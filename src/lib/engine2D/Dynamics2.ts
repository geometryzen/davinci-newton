import { Dynamics, INDEX_POTENTIAL_ENERGY, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_TOTAL_ENERGY, INDEX_TRANSLATIONAL_KINETIC_ENERGY, INDEX_RESERVED_LAST } from '../core/Dynamics';
import { VarsList } from "../core/VarsList";
import { Geometric2 } from "../math/Geometric2";
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";

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
export const INDEX_TOTAL_ANGULAR_MOMENTUM_XY = INDEX_RESERVED_LAST + 3;
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
export const OFFSET_ATTITUDE_A = 2;
/**
 * @hidden
 */
export const OFFSET_ATTITUDE_XY = 3;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_X = 4;
/**
 * @hidden
 */
export const OFFSET_LINEAR_MOMENTUM_Y = 5;
/**
 * @hidden
 */
export const OFFSET_ANGULAR_MOMENTUM_XY = 6;

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
    INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];

/**
 * @hidden
 */
export class Dynamics2 implements Dynamics<Geometric2> {
    numVarsPerBody(): number {
        // Each body is described by 7 kinematic components.
        // 2 position
        // 2 attitude (though normalized should be only 1)
        // 2 linear momentum
        // 1 angular momentum
        return 7;
    }
    getVarNames(): string[] {
        return varNames;
    }
    getOffsetName(offset: number): string {
        switch (offset) {
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_POSITION_Y: return "position y";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_ATTITUDE_XY: return "attitude xy";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error(`getVarName(${offset})`);
    }
    discontinuousEnergyVars(): number[] {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    }
    epilog(bodies: ForceBody<Geometric2>[], forceLaws: ForceLaw<Geometric2>[], potentialOffset: Geometric2, varsList: VarsList): void {

        // update the variables that track energy
        let pe = potentialOffset.a;
        let re = 0;
        let te = 0;
        // update the variable that track linear momentum (vector)
        let Px = 0;
        let Py = 0;
        // update the variable that track angular momentum (bivector)
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
                // orbital angular momentum
                Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                // intrinsic angular momentum
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
        varsList.setValue(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
    }
    updateVarsFromBody(body: ForceBody<Geometric2>, idx: number, vars: VarsList): void {
        vars.setValue(OFFSET_POSITION_X + idx, body.X.x);
        vars.setValue(OFFSET_POSITION_Y + idx, body.X.y);

        vars.setValue(OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValue(OFFSET_ATTITUDE_XY + idx, body.R.b);

        vars.setValue(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValue(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);

        vars.setValue(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.b);
    }
    addForceToRateOfChangeLinearMomentumVars(rateOfChange: number[], idx: number, force: Geometric2): void {
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] += force.x;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] += force.y;
    }
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChange: number[], idx: number, torque: Geometric2): void {
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] += torque.b;
    }
    updateBodyFromVars(vars: number[], idx: number, body: ForceBody<Geometric2>): void {
        body.X.a = 0;
        body.X.x = vars[idx + OFFSET_POSITION_X];
        body.X.y = vars[idx + OFFSET_POSITION_Y];
        body.X.b = 0;
        // body.X.uom

        body.R.a = vars[idx + OFFSET_ATTITUDE_A];
        body.R.x = 0;
        body.R.y = 0;
        body.R.b = vars[idx + OFFSET_ATTITUDE_XY];

        // Keep the magnitude of the attitude as close to 1 as possible.
        const R = body.R;
        const magR = Math.sqrt(R.a * R.a + R.b * R.b);
        body.R.a = body.R.a / magR;
        body.R.b = body.R.b / magR;

        body.P.a = 0;
        body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
        body.P.b = 0;
        // body.P.uom

        body.L.a = 0;
        body.L.x = 0;
        body.L.y = 0;
        body.L.b = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        // body.L.uom

        body.updateAngularVelocity();
    }
    setPositionRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<Geometric2>) {
        const P = body.P;
        const mass = body.M.a;
        rateOfChange[idx + OFFSET_POSITION_X] = P.x / mass;
        rateOfChange[idx + OFFSET_POSITION_Y] = P.y / mass;
    }
    setAttitudeRateOfChangeVars(rateOfChange: number[], idx: number, body: ForceBody<Geometric2>): void {
        // Let Ω(t) be the (bivector) angular velocity.
        // Let R(t) be the (spinor) attitude of the rigid body. 
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        const R = body.R;
        const Ω = body.Ω;
        // dR/dt = +(1/2)(Ω.b)(R.b) - (1/2)(Ω.b)(R.a) I, where I = e1e2. 
        rateOfChange[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
        rateOfChange[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);
    }
    zeroLinearMomentumVars(rateOfChange: number[], idx: number): void {
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChange[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
    }
    zeroAngularMomentumVars(rateOfChange: number[], idx: number): void {
        rateOfChange[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
    }
}
