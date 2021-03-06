import { Force, Torque } from "../..";
import { ForceBody } from "../core/ForceBody";
import { Metric } from "../core/Metric";
import { Geometric3 } from "../math/Geometric3";
import { Mat3 } from "../math/Mat3";
import { Matrix3 } from "../math/Matrix3";
import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "../math/Unit";
import { Force3 } from "./Force3";
import { Torque3 } from "./Torque3";

/**
 * @hidden
 */
export class Euclidean3 implements Metric<Geometric3> {
    a(mv: Geometric3): number {
        return mv.a;
    }
    add(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        return lhs.add(rhs);
    }
    addVector(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        return lhs.addVector(rhs);
    }
    applyMatrix(mv: Geometric3, matrix: MatrixLike): Geometric3 {
        throw new Error("applyMatrix(mv, matrix) method not implemented.");
    }
    copy(source: Geometric3, target: Geometric3): Geometric3 {
        return target.copy(source);
    }
    copyBivector(source: Geometric3, target: Geometric3): Geometric3 {
        return target.copyBivector(source);
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        return new Mat3(m);
    }
    copyVector(source: Geometric3, target: Geometric3): Geometric3 {
        return target.copyVector(source);
    }
    copyScalar(a: number, uom: Unit, target: Geometric3): Geometric3 {
        return target.copyScalar(a, uom);
    }
    createForce(body: ForceBody<Geometric3>): Force<Geometric3> {
        return new Force3(body);
    }
    createTorque(body: ForceBody<Geometric3>): Torque<Geometric3> {
        return new Torque3(body);
    }
    direction(mv: Geometric3, mutate: boolean): Geometric3 {
        return mv.direction(mutate);
    }
    divByScalar(lhs: Geometric3, a: number, uom: Unit): Geometric3 {
        return lhs.divByScalar(a, uom);
    }
    identityMatrix(): MatrixLike {
        return new Mat3(Matrix3.one());
    }
    invertMatrix(m: MatrixLike): MatrixLike {
        const I = Matrix3.zero().copy(m).inv();
        return new Mat3(I);
    }
    isZero(mv: Geometric3): boolean {
        return mv.isZero();
    }
    lock(mv: Geometric3): number {
        return mv.lock();
    }
    magnitude(mv: Geometric3, mutate: boolean): Geometric3 {
        return mv.magnitude(mutate);
    }
    mulByNumber(lhs: Geometric3, alpha: number): Geometric3 {
        return lhs.mulByNumber(alpha);
    }
    mulByScalar(lhs: Geometric3, a: number, uom: Unit): Geometric3 {
        return lhs.mulByScalar(a, uom);
    }
    mulByVector(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        return lhs.mulByVector(rhs);
    }
    neg(mv: Geometric3): Geometric3 {
        return mv.neg();
    }
    quaditude(mv: Geometric3, mutate: boolean): Geometric3 {
        return mv.quaditude(mutate);
    }
    rev(mv: Geometric3): Geometric3 {
        return mv.rev();
    }
    rotate(mv: Geometric3, spinor: Geometric3): Geometric3 {
        return mv.rotate(spinor);
    }
    scalar(a: number, uom?: Unit): Geometric3 {
        return Geometric3.scalar(a, uom);
    }
    scp(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        return lhs.scp(rhs);
    }
    setUom(mv: Geometric3, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.sub(rhs);
    }
    subScalar(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subScalar(rhs);
    }
    subVector(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subVector(rhs);
    }
    unlock(mv: Geometric3, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Geometric3): Unit {
        return mv.uom;
    }
    ext(lhs: Geometric3, rhs: Geometric3): Geometric3 {
        return lhs.ext(rhs);
    }
    write(source: Geometric3, target: Geometric3): void {
        source.write(target);
    }
    writeVector(source: Geometric3, target: Geometric3): void {
        source.writeVector(target);
    }
    writeBivector(source: Geometric3, target: Geometric3): void {
        source.writeBivector(target);
    }
    zero(): Geometric3 {
        return Geometric3.zero.clone();
    }
}
