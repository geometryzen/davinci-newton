import { AbstractMeasure } from './AbstractMeasure';
import { MatrixLike } from './MatrixLike';
import { Unit } from './Unit';
/**
 * Base class for matrices with the expectation that they will be used with WebGL.
 * The underlying data storage is a <code>Float32Array</code>.
 * @hidden
 */
export declare class AbstractMatrix<T extends {
    elements: Float32Array;
}> extends AbstractMeasure implements MatrixLike {
    private _elements;
    private _length;
    private _dimensions;
    modified: boolean;
    /**
     * @param elements
     * @param dimensions
     */
    constructor(elements: Float32Array, dimensions: number, uom: Unit);
    get dimensions(): number;
    get elements(): Float32Array;
    set elements(elements: Float32Array);
    copy(source: MatrixLike): T;
    /**
     * Returns the element at the specified (zero-based) row and column.
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    getElement(row: number, column: number): number;
    /**
     * Determines whether this matrix is the identity matrix.
     */
    isOne(): boolean;
    /**
     * @param row The zero-based row.
     * @param column The zero-based column.
     * @param value The value of the element.
     */
    setElement(row: number, column: number, value: number): void;
}
