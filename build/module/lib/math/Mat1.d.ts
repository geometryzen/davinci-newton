import { MatrixLike } from './MatrixLike';
import { Unit } from './Unit';
export declare class Mat1 implements MatrixLike {
    private value;
    constructor(value: number);
    get dimensions(): number;
    uom: Unit;
    getElement(row: number, column: number): number;
}
