/**
 * Immutable point coordinates in two dimensions.
 * @hidden
 */
export default class Point {
    constructor(private x_: number, private y_: number) {

    }
    get x(): number {
        return this.x_;
    }
    get y(): number {
        return this.y_;
    }
}
