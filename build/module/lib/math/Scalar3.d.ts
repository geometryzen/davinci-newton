import { Scalar } from './Scalar';
import { Unit } from './Unit';
export declare class Scalar3 implements Scalar {
    private readonly a_;
    private readonly uom_;
    constructor(a: number, uom: Unit);
    get a(): number;
    get uom(): Unit;
    mulByNumber(alpha: number): Scalar3;
}
export default Scalar3;
