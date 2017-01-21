// Copyright 2017 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import AbstractSimObject from './AbstractSimObject';
import CoordType from '../model/CoordType';
import ForceApp from '../model/ForceApp';
import ForceLaw from '../model/ForceLaw';
import RigidBody from '../engine/RigidBody';
import Vector from '../math/Vector';
import VectorE3 from '../math/VectorE3';

/**
 * 
 */
export class Spring extends AbstractSimObject implements ForceLaw {
    /**
     * 
     */
    private damping_ = 0;
    private compressOnly_ = false;
    private restLength_ = 1;
    private stiffness_ = 1;
    private attach1_: VectorE3 = Vector.ORIGIN;
    private attach2_: VectorE3 = Vector.ORIGIN;
    /**
     * 
     */
    constructor(name: string, private body1_: RigidBody, private body2_: RigidBody) {
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
                const n = p2.subtract(p1).direction();
                return p1.add(n.multiply(rlen));
            }
        }
        else {
            return p2;
        }
    }

    calculateForces(): ForceApp[] {
        const point1 = this.getStartPoint();
        const point2 = this.getEndPoint();
        const v = point2.subtract(point1);
        const len = v.magnitude();
        // force on body 1 is in direction of v
        // amount of force is proportional to stretch of spring
        // spring force is - stiffness * stretch
        const sf = -this.stiffness_ * (len - this.restLength_);
        const fx = -sf * (v.x / len);
        const fy = -sf * (v.y / len);
        const fz = -sf * (v.z / len);
        let f = new Vector(fx, fy, fz);
        if (this.damping_ !== 0) {
            // damping does not happen for 'compress only' when uncompressed
            if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                const v1 = this.body1_.worldVelocityOfBodyPoint(this.attach1_);
                const v2 = this.body2_.worldVelocityOfBodyPoint(this.attach2_);
                const df = v1.subtract(v2).multiply(-this.damping_);
                f = f.add(df);
            }
        }
        return [
            new ForceApp('spring', this.body1_, point1, CoordType.WORLD, f, CoordType.WORLD),
            new ForceApp('spring', this.body2_, point2, CoordType.WORLD, f.multiply(-1), CoordType.WORLD)
        ];
    }

    disconnect(): void {
        // Does nothing
    }

    /**
     * Returns the distance between start and end points of this spring
     * @return the distance between start and end points of this spring
     */
    getLength(): number {
        return this.getEndPoint().distanceTo(this.getStartPoint());
    }

    getPotentialEnergy(): number {
        // spring potential energy = 0.5 * stiffness * (stretch ^ 2)
        const stretch = this.getStretch();
        return 0.5 * this.stiffness_ * stretch * stretch;
    }

    /**
     * Positive stretch means the spring is expanded, negative stretch means compressed.
     * @return the amount that this line is stretched from its rest length
     */
    getStretch() {
        return this.getLength() - this.restLength_;
    }

    getVector(): Vector {
        return this.getEndPoint().subtract(this.getStartPoint());
    }
}

export default Spring;
