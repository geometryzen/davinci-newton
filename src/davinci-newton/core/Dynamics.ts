import { ForceBody } from "./ForceBody";
import { ForceLaw } from "./ForceLaw";
import { VarsList } from "./VarsList";

export interface Dynamics<T> {
    /**
     * The rate of change of position is the velocity.
     * dX/dt = V = P / M
     * 
     * @param rateOfChange 
     * @param idx 
     * @param body 
     */
    setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<T>): void;
    /**
     * 
     * @param rateOfChange 
     * @param idx 
     * @param body 
     */
    setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody<T>): void;
    /**
     * 
     * @param rateOfChange
     * @param idx 
     */
    zeroLinearMomentum(rateOfChange: number[], idx: number): void;
    /**
     * 
     * @param rateOfChange
     * @param idx 
     */
    zeroAngularMomentum(rateOfChange: number[], idx: number): void;
    /**
     * 
     * @param vars 
     * @param idx 
     * @param body 
     */
    updateBody(vars: number[], idx: number, body: ForceBody<T>): void;
    updateVarsFromBody(body: ForceBody<T>, idx: number, vars: VarsList): void;

    addForce(rateOfChange: number[], idx: number, force: T): void;
    addTorque(rateOfChange: number[], idx: number, torque: T): void;
    epilog(bodies: ForceBody<T>[], forceLaws: ForceLaw<T>[], potentialOffset: T, vars: VarsList): void;
    discontinuousEnergyVariables(): number[];
    getOffsetName(offset: number): string;
    getVarNames(): string[];
    numVariablesPerBody(): number;
}
