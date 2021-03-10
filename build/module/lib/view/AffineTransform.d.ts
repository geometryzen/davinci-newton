import Point from './Point';
/**
 * Specifies an immutable 2D affine transform.
 *
 * The affine transform of a point `(x, y)` is given by:
 *
 *  [  m11  m21  dx  ] [ x ]   [ m11 x + m21 y + dx ]
 *  [  m12  m22  dy  ] [ y ] = [ m12 x + m22 y + dy ]
 *  [   0    0    1  ] [ 1 ]   [          1         ]
 *
 * Rotation clockwise by theta radians:
 *
 *  [ cos(theta)  -sin(theta)   0 ]
 *  [ sin(theta)   cos(theta)   0 ]
 *  [     0            0        1 ]
 *
 * Scale:
 *
 *  [  sx   0    0  ]
 *  [  0   sy    0  ]
 *  [  0    0    1  ]
 *
 * Translate:
 *
 *  [  1    0   dx  ]
 *  [  0    1   dy  ]
 *  [  0    0    1  ]
 */
export default class AffineTransform {
    /**
     * The identity AffineTransform, which leaves a point unchanged when it is applied.
     */
    static readonly IDENTITY: AffineTransform;
    private m11_;
    private m12_;
    private m21_;
    private m22_;
    private dx_;
    private dy_;
    /**
     *
     */
    constructor(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number);
    /**
     * Multiplies the affine transform of the given context with this AffineTransform.
     * @param context the canvas context to modify
     */
    applyTransform(context: CanvasRenderingContext2D): this;
    /**
     * Right-multiply this AffineTransform by the given AffineTransform. This has the
     * effect that the given AffineTransform will be applied to the input vector before the
     * current AffineTransform.
     *
     * Concatenating a transform A to transform B is equivalent to matrix multiplication of
     * the two transforms. Note that order matters: matrices are applied in right to left order
     * when transforming a vector
     *
     * A B vector = A * (B * vector)
     *
     * We can think of the B matrix being applied first, then the A matrix.  This method
     * returns the product with the input `at` matrix on the right
     *
     * this * at
     *
     * The mathematics is as follows: this matrix is on the left, the other `at` matrix is on
     * the right:
     *
     *  [  m11  m21  dx  ]  [  a11  a21  ax  ]
     *  [  m12  m22  dy  ]  [  a12  a22  ay  ]
     *  [   0    0    1  ]  [   0    0   1   ]
     *
     * Result is:
     *
     *  [ (m11*a11 + m21*a12)  (m11*a21 + m21*a22)  (m11*ax + m21*ay + dx) ]
     *  [ (m12*a11 + m22*a12)  (m12*a21 + m22*a22)  (m12*ax + m22*ay + dy) ]
     *  [          0                    0                   1              ]
     *
     * @param at the AffineTransform matrix to right-multiply this AffineTransform matrix by
     * @return the product of this AffineTransform matrix right-multiplied by the `at` AffineTransform matrix
     */
    concatenate(at: AffineTransform): AffineTransform;
    /**
     * Draw a line to the transformed point.
     * @param x horizontal coordinate
     * @param y vertical coordinate
     * @param context the canvas context to modify
     */
    lineTo(x: number, y: number, context: CanvasRenderingContext2D): this;
    /**
     * Sets current position in context to the transformed point.
     * @param x horizontal coordinate
     * @param y vertical coordinate
     * @param context the canvas context to modify
     */
    moveTo(x: number, y: number, context: CanvasRenderingContext2D): this;
    /**
     * Concatenates a rotation transformation to this AffineTransform.
     *
     * The mathematics is as follows: this matrix is on the left, the rotation matrix is on
     * the right, and the angle is represented by `t`
     *
     *  [  m11  m21  dx  ]  [ cos(t)  -sin(t)   0 ]
     *  [  m12  m22  dy  ]  [ sin(t)   cos(t)   0 ]
     *  [   0    0    1  ]  [  0        0       1 ]
     *
     * Result is:
     *
     *  [  (m11*cos(t) + m21*sin(t))  (-m11*sin(t) + m21*cos(t))  0  ]
     *  [  (m12*cos(t) + m22*sin(t))  (-m12*sin(t) + m22*cos(t))  0  ]
     *  [              0                          0               1  ]
     *
     * @param angle angle in radians to; positive angle rotates clockwise.
     * @return a new AffineTransform equal to this AffineTransform rotated by the given angle
     */
    rotate(angle: number): AffineTransform;
    /**
     * Concatenates a scaling transformation to this AffineTransform.
     *
     * The mathematics is as follows: this matrix is on the left, the scaling matrix is on
     * the right:
     *
     *  [  m11  m21  dx  ]  [  x   0   0  ]
     *  [  m12  m22  dy  ]  [  0   y   0  ]
     *  [   0    0    1  ]  [  0   0   1  ]
     *
     * Result is:
     *
     *  [  m11*x  m21*y  dx  ]
     *  [  m12*x  m22*y  dy  ]
     *  [   0      0      1  ]
     *
     * @param x factor to scale by in horizontal direction
     * @param y factor to scale by in vertical direction
     * @return a new AffineTransform equal to this AffineTransform scaled by the given x and y factors
     */
    scale(x: number, y: number): AffineTransform;
    /**
     * Set the affine transform of the given context to match this AffineTransform.
     * @param context the canvas context to modify
     */
    setTransform(context: CanvasRenderingContext2D): this;
    /**
     * Apply this transform to the given point, returning the transformation
     * of the given point.
     *
     * The mathematics is as follows:
     *
     *  [  m11  m21  dx  ]  [ x ]
     *  [  m12  m22  dy  ]  [ y ]
     *  [   0    0    1  ]  [ 1 ]
     *
     * Result is:
     *
     *  [ m11 x + m21 y + dx ]
     *  [ m12 x + m22 y + dy ]
     *  [          1         ]
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @return the transformation of the given point.
     */
    transform(x: number, y: number): Point;
    /**
     * Concatenates a translation to this AffineTransform.
     *
     * The mathematics is as follows: this matrix is on the left, the scaling matrix is on
     * the right:
     *
     *  [  m11  m21  dx  ]  [  1    0   x  ]
     *  [  m12  m22  dy  ]  [  0    1   y  ]
     *  [   0    0    1  ]  [  0    0   1  ]
     *
     * Result is:
     *
     *  [ m11  m21  (m11*x + m21*y + dx) ]
     *  [ m12  m22  (m12*x + m22*y + dy) ]
     *  [ 0    0            1            ]
     *
     * @param the x coordinate
     * @param the y coordinate
     * @return a new AffineTransform equal to this AffineTransform  translated by the given amount
     */
    translate(x: number, y: number): AffineTransform;
}
