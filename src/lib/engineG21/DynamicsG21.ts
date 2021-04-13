import { Dynamics } from "../core/Dynamics";
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { VarsList } from "../core/VarsList";
import { Spacetime2 } from "../math/Spacetime2";
import { Unit } from "../math/Unit";

export class DynamicsG21 implements Dynamics<Spacetime2> {
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    updateBodyFromVars(stateVals: number[], stateUoms: Unit[], idx: number, body: ForceBody<Spacetime2>, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    updateVarsFromBody(body: ForceBody<Spacetime2>, idx: number, vars: VarsList): void {
        throw new Error("Method not implemented.");
    }
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime2, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime2): void {
        throw new Error("Method not implemented.");
    }
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Spacetime2, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    epilog(bodies: ForceBody<Spacetime2>[], forceLaws: ForceLaw<Spacetime2>[], potentialOffset: Spacetime2, vars: VarsList): void {
        throw new Error("Method not implemented.");
    }
    discontinuousEnergyVars(): number[] {
        throw new Error("Method not implemented.");
    }
    getOffsetName(offset: number): string {
        throw new Error("Method not implemented.");
    }
    getVarNames(): string[] {
        return [VarsList.TIME];
    }
    numVarsPerBody(): number {
        return 1;
    }
}
