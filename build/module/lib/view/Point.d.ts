/**
 * Immutable point coordinates in two dimensions.
 */
export default class Point {
    private x_;
    private y_;
    constructor(x_: number, y_: number);
    get x(): number;
    get y(): number;
}
