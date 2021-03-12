import Point from './Point';
/**
 * A rectangle whose boundaries are stored with double floating
 * point precision. This is an immutable class: once an instance is created it cannot be
 * changed.
 *
 * Note that for DoubleRect we regard the vertical coordinate as **increasing upwards**, so
 * the top coordinate is greater than the bottom coordinate. This is in contrast to HTML5
 * canvas where vertical coordinates increase downwards.
 * @hidden
 */
export declare class DoubleRect {
    private left_;
    private right_;
    private bottom_;
    private top_;
    constructor(left: number, bottom: number, right: number, top: number);
    /**
     * The empty rectangle (0, 0, 0, 0).
     */
    static EMPTY_RECT: DoubleRect;
    /**
     * Returns a copy of the given DoubleRect.
     * @param rect the DoubleRect to copy
     * @return a copy of the given DoubleRect
     */
    static clone(rect: DoubleRect): DoubleRect;
    /**
     * Returns true if the object is likely a DoubleRect. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a DoubleRect
     */
    static isDuckType(obj: any): obj is DoubleRect;
    /**
     * Returns a DoubleRect spanning the two given points.
     * @param point1
     * @param point2
     * @return a DoubleRect spanning the two given points
     */
    static make(point1: Point, point2: Point): DoubleRect;
    /**
     * Returns a DoubleRect centered at the given point with given height and width.
     * @param center center of the DoubleRect
     * @param width width of the DoubleRect
     * @param height height of the DoubleRect
     * @return a DoubleRect centered at the given point with given height and width
     */
    static makeCentered(center: Point, width: number, height: number): DoubleRect;
    /**
     * Returns a DoubleRect centered at the given point with given size.
     * @param center center of the DoubleRect
     * @param size width and height as a Vector
     * @return a DoubleRect centered at the given point with given size
     */
    static makeCentered2(center: Point, size: Point): DoubleRect;
    /**
     * Returns `true` if the given point is within this rectangle.
     * @param point  the point to test
     * @return `true` if the point is within this rectangle, or exactly on an edge
     */
    contains(point: {
        x: number;
        y: number;
    }): boolean;
    /**
     * Returns `true` if the object is a DoubleRect with the same coordinates.
     * @param obj the object to compare to
     * @return `true` if the object is a DoubleRect with the same coordinates.
     */
    equals(obj: any): boolean;
    /**
     * Returns a copy of this DoubleRect expanded by the given margin in x and y dimension.
     * @param marginX the margin to add at left and right
     * @param marginY the margin to add at top and bottom; if undefined then `marginX` is used for both x and y dimension
     * @return a DoubleRect with same center as this DoubleRect, but expanded or contracted
     */
    expand(marginX: number, marginY: number): DoubleRect;
    /**
     * Returns the smallest vertical coordinate of this DoubleRect
     * @return smallest vertical coordinate  of this DoubleRect
     */
    getBottom(): number;
    /**
     * Returns the center of this DoubleRect.
     */
    getCenter(): Point;
    /**
     * Returns the horizontal coordinate of center of this DoubleRect.
     * @return horizontal coordinate of center of this DoubleRect
     */
    getCenterX(): number;
    /**
     * Returns the vertical coordinate of center of this DoubleRect.
     * @return vertical coordinate of center of this DoubleRect
     */
    getCenterY(): number;
    /**
     * Returns the vertical height of this DoubleRect
     * @return vertical height of this DoubleRect
     */
    getHeight(): number;
    /**
     * Returns the smallest horizontal coordinate of this DoubleRect
     * @return smallest horizontal coordinate of this DoubleRect
     */
    getLeft(): number;
    /**
     * Returns the largest horizontal coordinate of this DoubleRect
     * @return largest horizontal coordinate of this DoubleRect
     */
    getRight(): number;
    /**
     * Returns the largest vertical coordinate of this DoubleRect
     * @return largest vertical coordinate of this DoubleRect
     */
    getTop(): number;
    /**
     * Returns the horizontal width of this DoubleRect
     * @return horizontal width of this DoubleRect
     */
    getWidth(): number;
    /**
     * Returns `true` if width or height of this DoubleRect are zero (within given tolerance).
     * @param tolerance optional tolerance for the test; a width or height smaller than this is regarded as zero; default is 1E-16
     * @return `true` if width or height of this DoubleRect are zero (within given tolerance)
     */
    isEmpty(tolerance?: number): boolean;
    /**
     * Returns true if the line between the two points might be visible in the rectangle.
     * @param p1 first end point of line
     * @param p2 second end point of line
     * @return true if the line between the two points might be visible in the rectangle
     */
    maybeVisible(p1: {
        x: number;
        y: number;
    }, p2: {
        x: number;
        y: number;
    }): boolean;
    /**
     * Returns `true` if this DoubleRect is nearly equal to another DoubleRect.
     * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
     * used depends on the magnitude of the numbers being compared.
     * @param rect  the DoubleRect to compare with
     * @param opt_tolerance optional tolerance for equality test
     * @return `true` if this DoubleRect is nearly equal to another DoubleRect
     */
    nearEqual(rect: DoubleRect, opt_tolerance?: number): boolean;
    /**
     * Returns a copy of this DoubleRect expanded by the given factors in both x and y
     * dimension. Expands (or contracts) about the center of this DoubleRect by the given
     * expansion factor in x and y dimensions.
     * @param factorX the factor to expand width by; 1.1 gives a 10 percent expansion; 0.9 gives a 10 percent contraction
     * @param factorY  factor to expand height by; if undefined then `factorX` is used for both x and y dimension
     * @return a DoubleRect with same center as this DoubleRect, but expanded or contracted
     */
    scale(factorX: number, factorY: number): DoubleRect;
    /**
     * Returns a copy of this rectangle translated by the given amount.
     * @param x horizontal amount to translate by.
     * @param y vertical amount to translate by.
     * @return a copy of this rectangle translated by the given amount
     */
    translate(x: number, y: number): DoubleRect;
    /**
     * Returns a rectangle that is the union of this and another rectangle.
     * @param rect the other rectangle to form the union with.
     * @return the union of this and the other rectangle
     */
    union(rect: DoubleRect): DoubleRect;
    /**
     * Returns a rectangle that is the union of this rectangle and a point
     * @param point the point to form the union with
     * @return the union of this rectangle and the point
     */
    unionPoint(point: Point): DoubleRect;
}
