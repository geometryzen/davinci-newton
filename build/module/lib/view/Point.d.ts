/**
 * Immutable point coordinates in two dimensions.
 * @hidden
 */
export default class Point {
    private x_;
    private y_;
    constructor(x_: number, y_: number);
    get x(): number;
    get y(): number;
}
