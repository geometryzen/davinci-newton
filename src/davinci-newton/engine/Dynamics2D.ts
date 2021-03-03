import { Geometric2 } from "../math/Geometric2";
import { Dynamics } from '../core/Dynamics';
import { ForceBody2 } from "./ForceBody2";
import { State } from './State';
import { VarsList } from "../core/VarsList";
import { ForceLaw2 } from "./ForceLaw2";

export class Dynamics2D implements Dynamics<Geometric2> {
    epilog(bodies: ForceBody2<Geometric2>[], forceLaws: ForceLaw2<Geometric2>[], potentialOffset: Geometric2, varsList: VarsList): void {

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
                // orbital angular momentum
                // Lyz += wedgeYZ(b.X, b.P);
                // Lzx += wedgeZX(b.X, b.P);
                // Lxy += wedgeXY(b.X, b.P);
                Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                // spin angular momentum
                Lxy += b.L.xy;
            }
        }

        const fs = forceLaws;
        const Nf = fs.length;
        for (let i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy().a;
        }

        varsList.setValue(State.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
        varsList.setValue(State.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
        varsList.setValue(State.INDEX_POTENTIAL_ENERGY, pe, true);
        varsList.setValue(State.INDEX_TOTAL_ENERGY, te + re + pe, true);
        varsList.setValue(State.INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
        varsList.setValue(State.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
        varsList.setValue(State.INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
    }
    updateVarsFromBody(body: ForceBody2<Geometric2>, idx: number, vars: VarsList): void {
        vars.setValue(State.OFFSET_POSITION_X + idx, body.X.x);
        vars.setValue(State.OFFSET_POSITION_Y + idx, body.X.y);

        vars.setValue(State.OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValue(State.OFFSET_ATTITUDE_XY + idx, body.R.b);

        vars.setValue(State.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValue(State.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);

        vars.setValue(State.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.b);
    }
    addForce(rateOfChange: number[], idx: number, force: Geometric2): void {
        rateOfChange[idx + State.OFFSET_LINEAR_MOMENTUM_X] += force.x;
        rateOfChange[idx + State.OFFSET_LINEAR_MOMENTUM_Y] += force.y;
    }
    addTorque(rateOfChange: number[], idx: number, torque: Geometric2): void {
        rateOfChange[idx + State.OFFSET_ANGULAR_MOMENTUM_XY] += torque.b;
    }
    updateBody(vars: number[], idx: number, body: ForceBody2<Geometric2>): void {
        body.X.a = 0;
        body.X.x = vars[idx + State.OFFSET_POSITION_X];
        body.X.y = vars[idx + State.OFFSET_POSITION_Y];
        body.X.b = 0;

        body.R.a = vars[idx + State.OFFSET_ATTITUDE_A];
        body.R.x = 0;
        body.R.y = 0;
        body.R.b = vars[idx + State.OFFSET_ATTITUDE_XY];

        // Keep the magnitude of the attitude as close to 1 as possible.
        const R = body.R;
        const magR = Math.sqrt(R.a * R.a + R.b * R.b);
        body.R.a = body.R.a / magR;
        body.R.b = body.R.b / magR;

        body.P.a = 0;
        body.P.x = vars[idx + State.OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + State.OFFSET_LINEAR_MOMENTUM_Y];
        body.P.b = 0;

        body.L.a = 0;
        body.L.x = 0;
        body.L.y = 0;
        body.L.b = vars[idx + State.OFFSET_ANGULAR_MOMENTUM_XY];

        body.updateAngularVelocity();
    }
    setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody2<Geometric2>) {
        const P = body.P;
        const mass = body.M.a;
        rateOfChange[idx + State.OFFSET_POSITION_X] = P.x / mass;
        rateOfChange[idx + State.OFFSET_POSITION_Y] = P.y / mass;
    }
    setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody2<Geometric2>): void {
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        const R = body.R;
        const Ω = body.Ω;
        rateOfChange[idx + State.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
        rateOfChange[idx + State.OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);
    }
    zeroLinearMomentum(rateOfChange: number[], idx: number): void {
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        rateOfChange[idx + State.OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChange[idx + State.OFFSET_LINEAR_MOMENTUM_Y] = 0;
    }
    zeroAngularMomentum(rateOfChange: number[], idx: number): void {
        rateOfChange[idx + State.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
    }
}
