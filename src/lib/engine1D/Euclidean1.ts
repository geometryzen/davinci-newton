import { Force } from '../core/Force';
import { ForceBody } from '../core/ForceBody';
import { Metric } from '../core/Metric';
import { Torque } from '../core/Torque';
import { Geometric1 } from '../math/Geometric1';
import { Matrix0 } from '../math/Matrix0';
import { MatrixLike } from '../math/MatrixLike';
import { Unit } from '../math/Unit';
import { Force1 } from './Force1';
import { Torque1 } from './Torque1';

/**
 * @hidden 
 */
function copy(mv: Geometric1): Geometric1 {
    return new Geometric1([mv.a, mv.x], mv.uom);
}

/**
 * @hidden 
 */
function lock(mv: Geometric1): Geometric1 {
    mv.lock();
    return mv;
}

/**
 * @hidden
 */
export class Euclidean1 implements Metric<Geometric1> {
    a(mv: Geometric1): number {
        return mv.a;
    }
    add(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a + rhs.a;
            lhs.x = lhs.x + rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        } else {
            const a = lhs.a + rhs.a;
            const x = lhs.x + rhs.x;
            const uom = Unit.compatible(lhs.uom, rhs.uom);
            return new Geometric1([a, x], uom);
        }
    }
    addVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.x = lhs.x + rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        } else {
            const a = lhs.a;
            const x = lhs.x + rhs.x;
            const uom = Unit.compatible(lhs.uom, rhs.uom);
            return new Geometric1([a, x], uom);
        }
    }
    applyMatrix(mv: Geometric1, matrix: MatrixLike): Geometric1 {
        if (mv.isMutable()) {
            if (mv.isZero()) {
                if (Unit.isOne(matrix.uom)) {
                    return mv;
                } else {
                    mv.uom = Unit.mul(matrix.uom, mv.uom);
                    return mv;
                }
            } else {
                throw new Error(`applyMatrix(mv=Geometric1([${mv.a}, ${mv.x}], mv.uom), matrix=dimensions=${matrix.dimensions} Method not implemented.`);
            }
        } else {
            throw new Error("mv must be defined in Metric.applyMatrix(mv, matrix)");
        }
    }
    copy(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = source.a;
        target.x = source.x;
        target.uom = source.uom;
        return target;
    }
    copyBivector(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = 0;
        target.x = 0;
        target.uom = source.uom;
        return target;
    }
    copyMatrix(m: MatrixLike): MatrixLike {
        if (m.dimensions !== 0) {
            throw new Error("matrix dimensions must be 0.");
        }
        return new Matrix0(new Float32Array([]), m.uom);
    }
    copyScalar(a: number, uom: Unit, target: Geometric1): Geometric1 {
        target.a = a;
        target.x = 0;
        target.uom = uom;
        return target;
    }
    copyVector(source: Geometric1, target: Geometric1): Geometric1 {
        target.a = 0;
        target.x = source.x;
        target.uom = source.uom;
        return target;
    }
    createForce(body: ForceBody<Geometric1>): Force<Geometric1> {
        return new Force1(body);
    }
    createTorque(body: ForceBody<Geometric1>): Torque<Geometric1> {
        return new Torque1(body);
    }
    direction(mv: Geometric1, mutate?: boolean): Geometric1 {
        if (typeof mutate === 'boolean') {
            if (mutate) {
                if (mv.isMutable()) {
                    const a = mv.a;
                    const x = mv.x;
                    const s = Math.sqrt(a * a + x * x);
                    mv.a = a / s;
                    mv.x = x / s;
                    mv.uom = Unit.ONE;
                    return mv;
                } else {
                    return this.direction(copy(mv));
                }
            } else {
                const result = this.direction(copy(mv));
                result.lock();
                return result;
            }
        } else {
            return this.direction(mv, mv.isMutable());
        }
    }
    divByScalar(lhs: Geometric1, a: number, uom: Unit): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a / a;
            lhs.x = lhs.x / a;
            lhs.uom = Unit.div(lhs.uom, uom);
            return lhs;
        } else {
            return lock(this.divByScalar(copy(lhs), a, uom));
        }
    }
    ext(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const Ra = rhs.a;
            const Rx = rhs.x;
            lhs.a = La * Ra;
            lhs.x = La * Rx + Lx * Ra;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.ext(copy(lhs), rhs));
        }
    }
    identityMatrix(): MatrixLike {
        return new Matrix0(new Float32Array([]));
    }
    invertMatrix(m: MatrixLike): MatrixLike {
        return new Matrix0(new Float32Array([]), Unit.div(Unit.ONE, m.uom));
    }
    isZero(mv: Geometric1): boolean {
        return mv.a === 0 && mv.x === 0;
    }
    lock(mv: Geometric1): number {
        return mv.lock();
    }
    magnitude(mv: Geometric1, mutate?: boolean): Geometric1 {
        if (typeof mutate === 'boolean') {
            if (mutate) {
                if (mv.isMutable()) {
                    const a = mv.a;
                    const x = mv.x;
                    const m = Math.sqrt(a * a + x * x);
                    mv.a = m;
                    mv.x = 0;
                    return mv;
                } else {
                    throw new Error('Method not implemented.');
                }
            } else {
                throw new Error('Method not implemented.');
            }
        } else {
            return this.magnitude(mv, mv.isMutable());
        }
    }
    mul(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const Ra = rhs.a;
            const Rx = rhs.x;
            const a = La * Ra + Lx * Rx;    // scp only does this, ext gives La * Ra.
            const x = La * Rx + Lx * Ra;    // ext does this.
            lhs.a = a;
            lhs.x = x;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.mul(copy(lhs), rhs));
        }
    }
    mulByNumber(lhs: Geometric1, alpha: number): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const a = La * alpha;
            const x = Lx * alpha;
            lhs.a = a;
            lhs.x = x;
            return lhs;
        } else {
            return lock(this.mulByNumber(copy(lhs), alpha));
        }
    }
    mulByScalar(lhs: Geometric1, a: number, uom: Unit): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a * a;
            lhs.x = lhs.x * a;
            lhs.uom = Unit.mul(lhs.uom, uom);
            return lhs;
        } else {
            return lock(this.mulByScalar(copy(lhs), a, uom));
        }
    }
    mulByVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const a = lhs.x * rhs.x;
            const x = lhs.a * rhs.x;
            lhs.a = a;
            lhs.x = x;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.mulByVector(copy(lhs), rhs));
        }
    }
    neg(mv: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            mv.a = -mv.a;
            mv.x = -mv.x;
            return mv;
        } else {
            throw new Error('Method not implemented.');
        }
    }
    quaditude(mv: Geometric1, mutate?: boolean): Geometric1 {
        if (typeof mutate === 'boolean') {
            if (mutate) {
                if (mv.isMutable()) {
                    const a = mv.a;
                    const x = mv.x;
                    const uom = mv.uom;
                    mv.a = a * a + x * x;
                    mv.x = 0;
                    mv.uom = Unit.mul(uom, uom);
                    return mv;
                } else {
                    throw new Error('Method not implemented.');
                }
            } else {
                throw new Error('Method not implemented.');
            }
        } else {
            return this.magnitude(mv, mv.isMutable());
        }
    }
    rev(mv: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            return mv;
        } else {
            return lock(this.rev(copy(mv)));
        }
    }
    rotate(mv: Geometric1, spinor: Geometric1): Geometric1 {
        if (mv.isMutable()) {
            // TODO: Assert that the spinor is 1.
            return mv;
        } else {
            return lock(this.rotate(copy(mv), spinor));
        }
    }
    scalar(a: number, uom?: Unit): Geometric1 {
        return new Geometric1([a, 0], uom);
    }
    scp(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            const La = lhs.a;
            const Lx = lhs.x;
            const Ra = rhs.a;
            const Rx = rhs.x;
            lhs.a = La * Ra + Lx * Rx;
            lhs.x = 0;
            lhs.uom = Unit.mul(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.scp(copy(lhs), rhs));
        }
    }
    setUom(mv: Geometric1, uom: Unit): void {
        mv.uom = uom;
    }
    sub(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a - rhs.a;
            lhs.x = lhs.x - rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.sub(copy(lhs), rhs));
        }
    }
    subScalar(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.a = lhs.a - rhs.a;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.subScalar(copy(lhs), rhs));
        }
    }
    subVector(lhs: Geometric1, rhs: Geometric1): Geometric1 {
        if (lhs.isMutable()) {
            lhs.x = lhs.x - rhs.x;
            lhs.uom = Unit.compatible(lhs.uom, rhs.uom);
            return lhs;
        } else {
            return lock(this.subVector(copy(lhs), rhs));
        }
    }
    unlock(mv: Geometric1, token: number): void {
        mv.unlock(token);
    }
    uom(mv: Geometric1): Unit {
        return mv.uom;
    }
    write(source: Geometric1, target: Geometric1): void {
        target.a = source.a;
        target.x = source.x;
        target.uom = source.uom;
    }
    writeVector(source: Geometric1, target: Geometric1): void {
        target.a = 0;
        target.x = source.x;
        target.uom = source.uom;
    }
    /**
     * This doesn't happen in 1D because there are no bivectors.
     */
    writeBivector(source: Geometric1, target: Geometric1): void {
        target.a = 0;
        target.x = 0;
        target.uom = source.uom;
    }
    zero(): Geometric1 {
        return new Geometric1();
    }
}
