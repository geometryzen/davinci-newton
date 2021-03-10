import { MatrixLike } from './MatrixLike';
import { Unit } from './Unit';
/**
 *
 */
export declare class Mat3 implements MatrixLike {
    /**
     *
     */
    private data;
    /**
     *
     */
    uom: Unit;
    /**
     *
     */
    constructor(source: MatrixLike);
    /**
     *
     */
    get dimensions(): number;
    /**
     * Returns the element at the specified (zero-based) row and column.
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    getElement(row: number, column: number): number;
    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): number[];
    /**
     * @param radix
     */
    toString(radix?: number): string;
}
