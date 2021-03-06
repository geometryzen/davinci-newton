import { Force } from "../core/Force";
import { ForceBody } from "../core/ForceBody";
import { Metric } from "../core/Metric";
import { Torque } from "../core/Torque";
import { Geometric2 } from "../math/Geometric2";
import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "../math/Unit";
/**
 * @hidden
 */
export declare class Euclidean2 implements Metric<Geometric2> {
    a(mv: Geometric2): number;
    add(lhs: Geometric2, rhs: Geometric2): Geometric2;
    addVector(lhs: Geometric2, rhs: Geometric2): Geometric2;
    applyMatrix(mv: Geometric2, matrix: MatrixLike): Geometric2;
    copy(source: Geometric2, target: Geometric2): Geometric2;
    copyBivector(source: Geometric2, target: Geometric2): Geometric2;
    copyMatrix(m: MatrixLike): MatrixLike;
    copyVector(source: Geometric2, target: Geometric2): Geometric2;
    copyScalar(a: number, uom: Unit, target: Geometric2): Geometric2;
    createForce(body: ForceBody<Geometric2>): Force<Geometric2>;
    createTorque(body: ForceBody<Geometric2>): Torque<Geometric2>;
    direction(mv: Geometric2, mutate: boolean): Geometric2;
    divByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2;
    identityMatrix(): MatrixLike;
    invertMatrix(m: MatrixLike): MatrixLike;
    isZero(mv: Geometric2): boolean;
    lock(mv: Geometric2): number;
    magnitude(mv: Geometric2, mutate: boolean): Geometric2;
    mulByNumber(lhs: Geometric2, alpha: number): Geometric2;
    mulByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2;
    mulByVector(lhs: Geometric2, rhs: Geometric2): Geometric2;
    neg(mv: Geometric2): Geometric2;
    quaditude(mv: Geometric2, mutate: boolean): Geometric2;
    rev(mv: Geometric2): Geometric2;
    rotate(mv: Geometric2, spinor: Geometric2): Geometric2;
    scalar(a: number, uom?: Unit): Geometric2;
    scp(lhs: Geometric2, rhs: Geometric2): Geometric2;
    setUom(mv: Geometric2, uom: Unit): void;
    sub(lhs: Geometric2, rhs: Geometric2): Geometric2;
    subScalar(lhs: Geometric2, rhs: Geometric2): Geometric2;
    subVector(lhs: Geometric2, rhs: Geometric2): Geometric2;
    unlock(mv: Geometric2, token: number): void;
    uom(mv: Geometric2): Unit;
    ext(lhs: Geometric2, rhs: Geometric2): Geometric2;
    write(source: Geometric2, target: Geometric2): void;
    writeVector(source: Geometric2, target: Geometric2): void;
    writeBivector(source: Geometric2, target: Geometric2): void;
    zero(): Geometric2;
}
