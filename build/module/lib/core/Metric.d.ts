import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "../math/Unit";
import { Force } from "./Force";
import { ForceBody } from "./ForceBody";
/**
 * @hidden
 */
export interface Metric<T> {
    a(mv: T): number;
    add(lhs: T, rhs: T): T;
    addVector(lhs: T, rhs: T): T;
    applyMatrix(mv: T, matrix: MatrixLike): T;
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
    direction(mv: T, mutate: boolean): T;
    divByScalar(lhs: T, a: number, uom: Unit): T;
    ext(lhs: T, rhs: T): T;
    identityMatrix(): MatrixLike;
    invertMatrix(m: MatrixLike): MatrixLike;
    isZero(mv: T): boolean;
    lock(mv: T): number;
    magnitude(mv: T, mutate: boolean): T;
    mulByNumber(lhs: T, alpha: number): T;
    mulByScalar(lhs: T, a: number, uom: Unit): T;
    mulByVector(lhs: T, rhs: T): T;
    neg(mv: T): T;
    quaditude(mv: T, mutate: boolean): T;
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
    writeVector(source: T, target: T): void;
    zero(): T;
}
