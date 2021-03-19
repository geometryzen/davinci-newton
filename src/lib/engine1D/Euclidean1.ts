import { Force, Torque, Unit } from '../..';
import { ForceBody } from '../core/ForceBody';
import { Metric } from '../core/Metric';
import { Geometric1 } from '../math/Geometric1';
import { Matrix0 } from '../math/Matrix0';
import { MatrixLike } from '../math/MatrixLike';
import { Force1 } from './Force1';

/**
 * @hidden
 */
export class Euclidean1 implements Metric<Geometric1> {
    a(mv: Geometric1): number {
        return mv.a;
    }
    add(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    addVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    applyMatrix(mv: Geometric1, matrix: MatrixLike): Geometric1 {
        throw new Error('Method not implemented.');
    }
    copy(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = source.a;
        target.uom = source.uom;
        return target;
    }
    copyBivector(source: Geometric1, target: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        throw new Error('Method not implemented.');
    }
    copyScalar(a: number, uom: Unit, target: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    copyVector(source: Geometric1, target: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    createForce(body: ForceBody<Geometric1>): Force<Geometric1> {
        return new Force1(body);
    }
    createTorque(body: ForceBody<Geometric1>): Torque<Geometric1> {
        throw new Error('Method not implemented.');
    }
    direction(mv: Geometric1, mutate?: boolean): Geometric1 {
        throw new Error('Method not implemented.');
    }
    divByScalar(lhs: Geometric1, a: number, uom: Unit): Geometric1 {
        throw new Error('Method not implemented.');
    }
    ext(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    identityMatrix(): MatrixLike {
        return new Matrix0(new Float32Array([]));
    }
    invertMatrix(m: MatrixLike): MatrixLike {
        return m;
    }
    isZero(mv: Geometric1): boolean {
        throw new Error('Method not implemented.');
    }
    lock(mv: Geometric1): number {
        return mv.lock();
    }
    magnitude(mv: Geometric1, mutate?: boolean): Geometric1 {
        throw new Error('Method not implemented.');
    }
    mul(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    mulByNumber(lhs: Geometric1, alpha: number): Geometric1 {
        throw new Error('Method not implemented.');
    }
    mulByScalar(lhs: Geometric1, a: number, uom: Unit): Geometric1 {
        throw new Error('Method not implemented.');
    }
    mulByVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    neg(mv: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    quaditude(mv: Geometric1, mutate?: boolean): Geometric1 {
        throw new Error('Method not implemented.');
    }
    rev(mv: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    rotate(mv: Geometric1, spinor: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    scalar(a: number, uom?: Unit): Geometric1 {
        return new Geometric1([a, 0], uom);
    }
    scp(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    setUom(mv: Geometric1, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    subScalar(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    subVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        throw new Error('Method not implemented.');
    }
    unlock(mv: Geometric1, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Geometric1): Unit {
        return mv.uom;
    }
    write(source: Geometric1, target: Geometric1): void {
        throw new Error('Method not implemented.');
    }
    writeVector(source: Geometric1, target: Geometric1): void {
        throw new Error('Method not implemented.');
    }
    /**
     * This doesn't happen in 1D because there are no bivectors.
     */
    writeBivector(source: Geometric1, target: Geometric1): void {
        throw new Error('Method not implemented.');
    }
    zero(): Geometric1 {
        return new Geometric1();
    }
}
