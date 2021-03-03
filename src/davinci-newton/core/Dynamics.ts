import { ForceBody2 } from "../engine/ForceBody2";
import { ForceLaw2 } from "../engine/ForceLaw2";
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
    setPositionRateOfChange(rateOfChange: number[], idx: number, body: ForceBody2<T>): void;
    /**
     * 
     * @param rateOfChange 
     * @param idx 
     * @param body 
     */
    setAttitudeRateOfChange(rateOfChange: number[], idx: number, body: ForceBody2<T>): void;
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
    updateBody(vars: number[], idx: number, body: ForceBody2<T>): void;
    updateVarsFromBody(body: ForceBody2<T>, idx: number, vars: VarsList): void;

    addForce(rateOfChange: number[], idx: number, force: T): void;
    addTorque(rateOfChange: number[], idx: number, torque: T): void;
    epilog(bodies: ForceBody2<T>[], forceLaws: ForceLaw2<T>[], potentialOffset: T, vars: VarsList): void;
}
