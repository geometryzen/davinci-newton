import Matrix2 from './Matrix2';
import MatrixLike from './MatrixLike';

/**
 * 
 */
export class Mat2 implements MatrixLike {
    /**
     * 
     */
    private data = Matrix2.one();
    /**
     * 
     */
    constructor(source: MatrixLike) {
        const n11 = source.getElement(0, 0);
        const n12 = source.getElement(0, 1);
        const n21 = source.getElement(1, 0);
        const n22 = source.getElement(1, 1);
        this.data.set(
            n11, n12,
            n21, n22);
    }

    /**
     * 
     */
    get dimensions(): number {
        return 3;
    }

    /**
     * Returns the element at the specified (zero-based) row and column.
     * @param row The zero-based row.
     * @param column The zero-based column.
     */
    getElement(row: number, column: number): number {
        return this.data.getElement(row, column);
    }

    /**
     * @param i the zero-based index of the row.
     */
    row(i: number): number[] {
        return this.data.row(i);
    }

    /**
     * @param radix
     */
    toString(radix?: number): string {
        return this.data.toString(radix);
    }
}

export default Mat2;
