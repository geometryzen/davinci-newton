import { AbstractMatrix } from "./AbstractMatrix";
import { Unit } from "./Unit";
export declare class Matrix1 extends AbstractMatrix<Matrix1> {
    static one(): Matrix1;
    static zero(): Matrix1;
    /**
     *
     * @param elements
     * @param uom The optional unit of measure.
     */
    constructor(elements: Float32Array, uom?: Unit);
}
