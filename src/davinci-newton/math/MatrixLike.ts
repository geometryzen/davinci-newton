/**
 * 
 */
export interface MatrixLike {
    readonly dimensions: number;
    getElement(row: number, column: number): number;
}

export default MatrixLike;
