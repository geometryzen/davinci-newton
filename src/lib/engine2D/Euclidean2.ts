import { Metric } from "../core/Metric";
import { Geometric2 } from "../math/Geometric2";
import { MatrixLike } from "../math/MatrixLike";
import { Unit } from "../math/Unit";
import { Mat1 } from "../math/Mat1";
import { Matrix1 } from "../math/Matrix1";
import { Force } from "../..";
import { ForceBody } from "../core/ForceBody";
import { Force2 } from "./Force2";

/**
 * @hidden
 */
export class Euclidean2 implements Metric<Geometric2> {
    a(mv: Geometric2): number {
        return mv.a;
    }
    add(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.add(rhs);
    }
    addVector(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.addVector(rhs);
    }
    applyMatrix(mv: Geometric2, matrix: MatrixLike): Geometric2 {
        throw new Error("applyMatrix(mv, matrix) method not implemented.");
    }
    copy(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copy(source);
    }
    copyBivector(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copyBivector(source);
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        if (m.dimensions !== 1) {
            throw new Error("matrix dimensions must be 1.");
        }
        const value = m.getElement(0, 0);
        return new Mat1(value);
    }
    copyVector(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copyVector(source);
    }
    copyScalar(a: number, uom: Unit, target: Geometric2): Geometric2 {
        return target.copyScalar(a, uom);
    }
    createForce(body: ForceBody<Geometric2>): Force<Geometric2> {
        return new Force2(body);
    }
    direction(mv: Geometric2, mutate: boolean): Geometric2 {
        return mv.direction(mutate);
    }
    divByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2 {
        return lhs.divByScalar(a, uom);
    }
    identityMatrix(): MatrixLike {
        return new Mat1(1);
    }
    invertMatrix(m: MatrixLike): MatrixLike {
        if (m.dimensions !== 1) {
            throw new Error("matrix dimensions must be 1.");
        }
        return new Matrix1(new Float32Array([1 / m.getElement(0, 0)]), Unit.div(Unit.ONE, m.uom));
    }
    isZero(mv: Geometric2): boolean {
        return mv.isZero();
    }
    lock(mv: Geometric2): number {
        return mv.lock();
    }
    magnitude(mv: Geometric2, mutate: boolean): Geometric2 {
        return mv.magnitude(mutate);
    }
    mulByNumber(lhs: Geometric2, alpha: number): Geometric2 {
        return lhs.mulByNumber(alpha);
    }
    mulByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2 {
        return lhs.mulByScalar(a, uom);
    }
    mulByVector(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.mulByVector(rhs);
    }
    neg(mv: Geometric2): Geometric2 {
        return mv.neg();
    }
    quaditude(mv: Geometric2, mutate: boolean): Geometric2 {
        return mv.quaditude(mutate);
    }
    rev(mv: Geometric2): Geometric2 {
        return mv.rev();
    }
    rotate(mv: Geometric2, spinor: Geometric2): Geometric2 {
        return mv.rotate(spinor);
    }
    scalar(a: number, uom?: Unit): Geometric2 {
        return Geometric2.scalar(a, uom);
    }
    scp(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.scp(rhs);
    }
    setUom(mv: Geometric2, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.sub(rhs, 1);
    }
    subScalar(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.subScalar(rhs.a, rhs.uom, 1);
    }
    subVector(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subVector(rhs);
    }
    unlock(mv: Geometric2, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Geometric2): Unit {
        return mv.uom;
    }
    ext(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.ext(rhs);
    }
    write(source: Geometric2, target: Geometric2): void {
        source.write(target);
    }
    writeVector(source: Geometric2, target: Geometric2): void {
        source.writeVector(target);
    }
    zero(): Geometric2 {
        return Geometric2.zero.clone();
    }
}
