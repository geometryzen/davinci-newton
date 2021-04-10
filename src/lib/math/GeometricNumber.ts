import { LinearNumber } from './LinearNumber';
import { Unit } from './Unit';

/**
 * @hidden
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 * Notice that the effect on the target depends upon whether the target class in mutable.
 * I: The lightweight interface form of the concreate class, usually just coordinates.
 * M: The concrete class
 * S: The lightweight interface form of the spinor.
 * V: The lightweight interface form of the vector.
 */
export interface GeometricNumber<I, M, S, V> extends LinearNumber<I, M, S, V> {

    /**
     * Addition of a scalar.
     */
    addScalar(a: number, uom?: Unit, α?: number): M;

    /**
     * Assumes a spinor as the multivector.
     * angle(M) = log(M).grade(2)
     * In other words, throw away the scalar part of the result which is the scaling.
     */
    angle(): M;

    /**
     * Makes a copy of this multivector.
     * The resulting multivector is mutable (unlocked).
     */
    clone(): M;

    /**
     * Conjugate
     */
    conj(): M;

    /**
     * Left contraction
     */
    lco(rhs: I): M;

    /**
     * divide really only applies to division algebras, may not be defined.
     */
    div(rhs: I): M;
    /**
     *
     */
    divByVector(rhs: V): M;

    /**
     * dualization: dual(Ak) = Ak << inv(I)
     * 
     * For a Euclidean space inv(I) = + rev(I)
     * 
     * For a Minkowski space inv(I) = - rev(I)
     * 
     * See Geometric Algebra for Computer Science, p80. 
     */
    dual(): M;

    /**
     * Exponential
     */
    exp(): M;

    /**
     * Exterior or Outer Product.
     */
    ext(rhs: I): M;

    /**
     * extraction of grade.
     */
    grade(grade: number): M;

    /**
     * Inverse (may not exist).
     */
    inv(): M;

    /**
     *
     */
    isOne(): boolean;

    /**
     * A multivector is considered to be a scalar if all coordinates with grade other than zero are zero.
     */
    isScalar(): boolean;

    /**
     * A multivector is considered to be a spinor if all coordinates with grade other than 0 and 2 are zero.
     */
    isSpinor(): boolean;

    /**
     * A multivector is considered to be a vector if all coordinates with grade other than 1 are zero.
     */
    isVector(): boolean;

    /**
     * A multivector is considered to be a bivector if all coordinates with grade other than 2 are zero.
     */
    isBivector(): boolean;

    /**
     *
     */
    isZero(): boolean;

    /**
     * Natural logarithm.
     */
    log(): M;

    /**
     * Multiplication.
     */
    mul(rhs: I): M;
    /**
     * 
     * @param rhs
     */
    mulByVector(rhs: V): M;

    /**
     * norm, ||x|| = sqrt(scp(x, rev(x)))
     */
    magnitude(): M;

    /**
     * norm, ||x|| = sqrt(scp(x, rev(x)))
     */
    magnitudeNoUnits(): number;

    /**
     * squared norm, scp(x, rev(x))
     */
    quaditude(): M;

    /**
     * squared norm, scp(x, rev(x))
     */
    quaditudeNoUnits(): number;

    /**
     * Right contraction
     */
    rco(rhs: I): M;

    /**
     * Reverse
     */
    rev(): M;

    /**
     * Scalar Product
     */
    scp(rhs: I): M;

    subScalar(a: number, uom?: Unit, α?: number): M;

    /**
     * squared norm, scp(x, rev(x))
     */
    squaredNorm(): M;
}
