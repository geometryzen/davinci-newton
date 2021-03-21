import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "../math/Unit";
import { Force } from "./Force";
import { ForceBody } from "./ForceBody";
import { Torque } from "./Torque";

/**
 * @hidden
 */
export interface Metric<T> {
    /**
     * Returns the scalar component of the multivector.
     * @param mv The multivector for which the scalar component is required.
     */
    a(mv: T): number;

    add(lhs: T, rhs: T): T;

    addVector(lhs: T, rhs: T): T;

    /**
     * TODO: Describe semantics of how this is expected to mutate the multivector argument. 
     * @param mv 
     * @param matrix 
     */
    applyMatrix(mv: T, matrix: MatrixLike): T;

    /**
     * Modifies the target to have the same property values as the source.
     * @param source 
     * @param target
     * @returns the target.
     */
    copy(source: T, target: T): T;

    copyBivector(source: T, target: T): T;

    copyMatrix(m: MatrixLike): MatrixLike;

    copyScalar(a: number, uom: Unit, target: T): T;

    copyVector(source: T, target: T): T;

    /**
     * Create a non-generic instance derived from Force; Force is to be considered an abstract base type.
     * This will make it easier for clients; after instanceof Force2 or Force3, the properties of the
     * force application (F, and x) will have non-generic types.
     */
    createForce(body: ForceBody<T>): Force<T>;
    createTorque(body: ForceBody<T>): Torque<T>;

    direction(mv: T, mutate?: boolean): T;

    divByScalar(lhs: T, a: number, uom: Unit): T;

    ext(lhs: T, rhs: T): T;

    identityMatrix(): MatrixLike;

    /**
     * 
     * @param matrix The matrix to be inverted.
     * @returns A new matrix which is the inverse of the specified matrix.
     */
    invertMatrix(matrix: MatrixLike): MatrixLike;

    isZero(mv: T): boolean;

    /**
     * Used to change the mutability of the multivector from mutable to immutable.
     * An immutable multivector is also described as locked. The number returned is
     * a token that may be used to unlock the multivector, making it mutable again.
     * @param mv The multivector to be locked.
     * @returns A token that may be used to unlock the multivector.
     */
    lock(mv: T): number;

    magnitude(mv: T, mutate?: boolean): T;

    mul(lhs: T, rhs: T): T;

    mulByNumber(lhs: T, alpha: number): T;

    mulByScalar(lhs: T, a: number, uom: Unit): T;

    mulByVector(lhs: T, rhs: T): T;

    neg(mv: T): T;

    quaditude(mv: T, mutate?: boolean): T;

    rev(mv: T): T;

    rotate(mv: T, spinor: T): T;

    /**
     * Creates a grade 0 (scalar) multivector with value `a * uom`.
     * The scalar returned is in the unlocked (mutable) state.
     * @param a The scaling factor for the unit of measure.
     * @param uom The optional unit of measure. Equivalent to 1 if omitted.
     */
    scalar(a: number, uom?: Unit): T;

    scp(lhs: T, rhs: T): T;

    setUom(mv: T, uom: Unit): void;

    sub(lhs: T, rhs: T): T;

    subScalar(lhs: T, rhs: T): T;

    subVector(lhs: T, rhs: T): T;

    unlock(mv: T, token: number): void;

    uom(mv: T): Unit;

    write(source: T, target: T): void;

    /**
     * TODO: This looks a lot like copyVector. Is there any difference?
     * @param source 
     * @param target 
     */
    writeVector(source: T, target: T): void;

    writeBivector(source: T, target: T): void;
    /**
     * Constructs a multivector representing the number zero.
     * The returned multivector is mutable.
     */
    zero(): T;
}
