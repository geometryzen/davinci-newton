import { Dynamics } from "../core/Dynamics";
import { ForceBody } from "../core/ForceBody";
import { ForceLaw } from "../core/ForceLaw";
import { VarsList } from "../core/VarsList";
import { Spacetime1 } from "../math/Spacetime1";
import { Unit } from "../math/Unit";

export class DynamicsG11 implements Dynamics<Spacetime1> {
    setPositionRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // throw new Error("Method not implemented.");
    }
    setAttitudeRateOfChangeVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // throw new Error("Method not implemented.");
    }
    zeroLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // throw new Error("Method not implemented.");
    }
    zeroAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // throw new Error("Method not implemented.");
    }
    updateBodyFromVars(stateVals: number[], stateUoms: Unit[], idx: number, body: ForceBody<Spacetime1>, uomTime: Unit): void {
        // throw new Error("Method not implemented.");
    }
    updateVarsFromBody(body: ForceBody<Spacetime1>, idx: number, vars: VarsList): void {
        // throw new Error("Method not implemented.");
    }
    addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime1, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    getForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime1): void {
        throw new Error("Method not implemented.");
    }
    setForce(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, force: Spacetime1): void {
        throw new Error("Method not implemented.");
    }
    addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals: number[], rateOfChangeUoms: Unit[], idx: number, torque: Spacetime1, uomTime: Unit): void {
        throw new Error("Method not implemented.");
    }
    epilog(bodies: ForceBody<Spacetime1>[], forceLaws: ForceLaw<Spacetime1>[], potentialOffset: Spacetime1, vars: VarsList): void {
        // throw new Error("Method not implemented.");
    }
    discontinuousEnergyVars(): number[] {
        // throw new Error("Method not implemented.");
        return [];
    }
    getOffsetName(offset: number): string {
        switch (offset) {
            case 0: {
                return `offset-name-${offset}`;
            }
            default: {
                throw new Error(`getOffsetName(${offset}) not implemented.`);
            }
        }
    }
    getVarNames(): string[] {
        return [VarsList.TIME];
    }
    numVarsPerBody(): number {
        return 1;
    }
}
