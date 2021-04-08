import { Force, Torque } from "../..";
import { ForceBody } from "../core/ForceBody";
import { Metric } from "../core/Metric";
import { Geometric3 } from "../math/Geometric3";
import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "../math/Unit";
/**
 * @hidden
 */
export declare class Euclidean3 implements Metric<Geometric3> {
    a(mv: Geometric3): number;
    add(lhs: Geometric3, rhs: Geometric3): Geometric3;
    addVector(lhs: Geometric3, rhs: Geometric3): Geometric3;
    applyMatrix(mv: Geometric3, matrix: MatrixLike): Geometric3;
    clone(source: Geometric3): Geometric3;
    copy(source: Geometric3, target: Geometric3): Geometric3;
    copyBivector(source: Geometric3, target: Geometric3): Geometric3;
    copyMatrix(m: MatrixLike): MatrixLike;
    copyVector(source: Geometric3, target: Geometric3): Geometric3;
    copyScalar(a: number, uom: Unit, target: Geometric3): Geometric3;
    createForce(body: ForceBody<Geometric3>): Force<Geometric3>;
    createTorque(body: ForceBody<Geometric3>): Torque<Geometric3>;
    direction(mv: Geometric3): Geometric3;
    divByScalar(lhs: Geometric3, a: number, uom?: Unit): Geometric3;
    identityMatrix(): MatrixLike;
    invertMatrix(m: MatrixLike): MatrixLike;
    isBivector(mv: Geometric3): boolean;
    isScalar(mv: Geometric3): boolean;
    isSpinor(mv: Geometric3): boolean;
    isVector(mv: Geometric3): boolean;
    isZero(mv: Geometric3): boolean;
    lock(mv: Geometric3): number;
    norm(mv: Geometric3): Geometric3;
    mul(lhs: Geometric3, rhs: Geometric3): Geometric3;
    mulByNumber(lhs: Geometric3, alpha: number): Geometric3;
    mulByScalar(lhs: Geometric3, a: number, uom: Unit): Geometric3;
    mulByVector(lhs: Geometric3, rhs: Geometric3): Geometric3;
    neg(mv: Geometric3): Geometric3;
    squaredNorm(mv: Geometric3): Geometric3;
    rev(mv: Geometric3): Geometric3;
    rotate(mv: Geometric3, spinor: Geometric3): Geometric3;
    scalar(a: number, uom?: Unit): Geometric3;
    scp(lhs: Geometric3, rhs: Geometric3): Geometric3;
    setUom(mv: Geometric3, uom: Unit): void;
    sub(lhs: Geometric3, rhs: Geometric3): Geometric3;
    subScalar(lhs: Geometric3, rhs: Geometric3): Geometric3;
    subVector(lhs: Geometric3, rhs: Geometric3): Geometric3;
    unlock(mv: Geometric3, token: number): void;
    uom(mv: Geometric3): Unit;
    ext(lhs: Geometric3, rhs: Geometric3): Geometric3;
    write(source: Geometric3, target: Geometric3): void;
    writeVector(source: Geometric3, target: Geometric3): void;
    writeBivector(source: Geometric3, target: Geometric3): void;
    one(): Geometric3;
    zero(): Geometric3;
}
