import { Unit, VarsList } from "../..";
import { Dynamics } from "../core/Dynamics";
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { Geometric1 } from "../math/Geometric1";

/**
 * @hidden
 */
export class Dynamics1 implements Dynamics<Geometric1> {
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>): void {
        // Do nothing yet.
    }
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>): void {
        // Do nothing yet.
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        // Do nothing yet.
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        // Do nothing yet.
    }
    updateBodyFromVars(vars: number[], units: Unit[], idx: number, body: ForceBody<Geometric1>, uomTime: Unit): void {
        // Do nothing yet.
    }
    updateVarsFromBody(body: ForceBody<Geometric1>, idx: number, vars: VarsList): void {
        // Do nothing yet.
    }
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric1, uomTime: Unit): void {
        // Do nothing yet.
    }
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric1): void {
        // Do nothing yet.
    }
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Geometric1): void {
        // Do nothing yet.
    }
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Geometric1, uomTime: Unit): void {
        // Do nothing yet.
    }
    epilog(bodies: ForceBody<Geometric1>[], forceLaws: ForceLaw<Geometric1>[], potentialOffset: Geometric1, vars: VarsList): void {
        // Do nothing yet.
    }
    discontinuousEnergyVars(): number[] {
        return [];
    }
    getOffsetName(offset: number): string {
        return "position x";
    }
    getVarNames(): string[] {
        return ['TIME'];
    }
    numVarsPerBody(): number {
        return 1;
    }
}
