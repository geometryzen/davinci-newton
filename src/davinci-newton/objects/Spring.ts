import AbstractSimObject from './AbstractSimObject';
import CoordType from '../model/CoordType';
import Force from '../model/Force';
import ForceLaw from '../model/ForceLaw';
import GenericVector from '../math/GenericVector';
import Line from './Line';
import MassObject from '../model/MassObject';
import Vector from '../math/Vector';

/**
 * 
 */
export class Spring extends AbstractSimObject implements ForceLaw, Line {
    /**
     * 
     */
    private damping_ = 0;
    /**
     * 
     */
    constructor(name: string, private body1_: MassObject, private attach1_: GenericVector, private body2_: MassObject, private attach2_: GenericVector, private restLength_: number, private stiffness_ = 0, private compressOnly_ = false) {
        super(name);
    }
    getStartPoint(): Vector {
        if (this.attach1_ == null || this.body1_ == null) {
            throw new Error();
        }
        return this.body1_.bodyToWorld(this.attach1_);
    }
    getEndPoint(): Vector {
        if (this.attach2_ == null || this.body2_ == null) {
            throw new Error();
        }
        const p2 = this.body2_.bodyToWorld(this.attach2_);
        if (this.compressOnly_) {
            // 'compress only mode'
            const p1 = this.getStartPoint();
            const dist = p1.distanceTo(p2);
            const rlen = this.restLength_;
            if (dist <= rlen) {
                // spring is compressed, so it works as normal
                return p2;
            }
            else {
                // spring is not compressed, so the end is restLength from p1
                // in the direction towards p2.
                const n = p2.subtract(p1).normalize();
                return p1.add(n.multiply(rlen));
            }
        } else {
            return p2;
        }
    }
    calculateForces(): Force[] {
        const point1 = this.getStartPoint();
        const point2 = this.getEndPoint();
        const v = point2.subtract(point1);
        const len = v.length();
        // force on body 1 is in direction of v
        // amount of force is proportional to stretch of spring
        // spring force is - stiffness * stretch
        var sf = -this.stiffness_ * (len - this.restLength_);
        var fx = -sf * (v.getX() / len);
        var fy = -sf * (v.getY() / len);
        var f = new Vector(fx, fy, 0);
        if (this.damping_ !== 0) {
            // damping does not happen for 'compress only' when uncompressed
            if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                var v1 = this.body1_.getVelocity(this.attach1_);
                var v2 = this.body2_.getVelocity(this.attach2_);
                var df = v1.subtract(v2).multiply(-this.damping_);
                f = f.add(df);
            }
        }
        return [
            new Force('spring', this.body1_, point1, CoordType.WORLD, f, CoordType.WORLD),
            new Force('spring', this.body2_, point2, CoordType.WORLD, f.multiply(-1), CoordType.WORLD)
        ];
    }
    disconnect(): void {
        // Does nothing
    }
    isMassObject(): boolean {
        return false;
    }
    getPotentialEnergy(): number {
        return 0;
    }
    getVector(): Vector {
        return this.getEndPoint().subtract(this.getStartPoint());
    }
}

export default Spring;
