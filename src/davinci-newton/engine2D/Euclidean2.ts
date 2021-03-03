import { Geometric2 } from "../math/Geometric2";
import MatrixLike from "../math/MatrixLike";
import { Unit } from "../math/Unit";
import { Metric } from "../core/Metric";

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
    copyVector(source: Geometric2, target: Geometric2): Geometric2 {
        return target.copyVector(source);
    }
    copyScalar(a: number, uom: Unit, target: Geometric2): Geometric2 {
        return target.copyScalar(a, uom);
    }
    direction(mv: Geometric2, mutate: boolean): Geometric2 {
        return mv.direction(mutate);
    }
    divByScalar(lhs: Geometric2, a: number, uom: Unit): Geometric2 {
        return lhs.divByScalar(a, uom);
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
        return lhs.sub(rhs);
    }
    subScalar(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        // TODO: Could generalize to subtracting a fraction...
        return lhs.subScalar(rhs);
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
    wedge(lhs: Geometric2, rhs: Geometric2): Geometric2 {
        return lhs.wedge(rhs);
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
