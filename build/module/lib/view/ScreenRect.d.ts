/**
 * An immutable rectangle corresponding to screen coordinates where the
 * vertical coordinates increase downwards.
 */
export default class ScreenRect {
    private left_;
    private top_;
    private width_;
    private height_;
    /**
     *
     */
    constructor(left: number, top_: number, width: number, height: number);
    /**
     * An empty ScreenRect located at the origin.
     */
    static EMPTY_RECT: ScreenRect;
    /**
     * Returns a copy of the given ScreenRect.
     * @param rect the ScreenRect to clone
     * @return a copy of `rect`
     */
    static clone(rect: ScreenRect): ScreenRect;
    /**
     * Returns true if this ScreenRect is exactly equal to the other ScreenRect.
     * @param otherRect the ScreenRect to compare to
     * @return true if this ScreenRect is exactly equal to the other ScreenRect
     */
    equals(otherRect: ScreenRect): boolean;
    /**
     * Returns true if the object is likely a ScreenRect. Only works under simple
     * compilation, intended for interactive non-compiled code.
     * @param obj the object of interest
     * @return true if the object is likely a ScreenRect
     */
    static isDuckType(obj: any): obj is ScreenRect;
    /**
     * The horizontal coordinate of this ScreenRect center.
     * @return the horizontal coordinate of this ScreenRect center
     */
    getCenterX(): number;
    /**
     * The vertical coordinate of this ScreenRect center
     * @return the vertical coordinate of this ScreenRect center
     */
    getCenterY(): number;
    /**
     * The height of this ScreenRect.
     * @return the height of this ScreenRect.
     */
    getHeight(): number;
    /**
     * The left coordinate of this ScreenRect.
     * @return the left coordinate of this ScreenRect.
     */
    getLeft(): number;
    /**
     * The top coordinate of this ScreenRect.
     * @return the top coordinate of this ScreenRect
     */
    getTop(): number;
    /**
     * The width of this ScreenRect.
     * @return the width of this ScreenRect.
     */
    getWidth(): number;
    /**
     * Returns true if this ScreenRect has zero width or height, within the tolerance
     * @param tolerance tolerance for comparison, default is 1E-14;
     */
    isEmpty(tolerance?: number): boolean;
    /**
     * Creates an oval path in the Canvas context, with the size of this ScreenRect.
     * @param context the Canvas context to draw into
     */
    makeOval(context: CanvasRenderingContext2D): void;
    /**
     * Creates a rectangle path in the Canvas context, with the size of this ScreenRect.
     * @param context the Canvas context to draw into
     */
    makeRect(context: CanvasRenderingContext2D): void;
    /**
     * Returns true if this ScreenRect is nearly equal to another ScreenRect.
     * The optional tolerance value corresponds to the `epsilon`, so the actual tolerance
     * used depends on the magnitude of the numbers being compared.
     * @param otherRect  the ScreenRect to compare to
     * @param opt_tolerance optional tolerance for comparison
     * @return true if this ScreenRect is nearly equal to the other ScreenRect
     */
    nearEqual(otherRect: ScreenRect, opt_tolerance?: number): boolean;
}
