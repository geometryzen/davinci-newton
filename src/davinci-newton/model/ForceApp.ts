import AbstractSimObject from '../objects/AbstractSimObject';
import Bivector3 from '../math/Bivector3';
import BivectorE3 from '../math/BivectorE3';
import CoordType from './CoordType';
import RigidBody from '../engine/RigidBody';
import Vector from '../math/Vector';

/**
 * 
 */
export class ForceApp extends AbstractSimObject {

    /**
     * 
     */
    private torque_ = new Bivector3();

    /**
     * 
     */
    constructor(name: string,
        private body_: RigidBody,
        private location_: Vector,
        private locationCoordType_: CoordType,
        private direction_: Vector,
        private directionCoordType_: CoordType) {
        super(name);
    }

    /**
     * 
     */
    getBody(): RigidBody {
        return this.body_;
    }

    /**
     * The force being applied, F.
     */
    get F(): Vector {
        return this.directionCoordType_ === CoordType.BODY ? this.body_.rotateBodyToWorld(this.direction_) : this.direction_;
    }

    /**
     * The point of application of the force, x.
     */
    get x(): Vector {
        return this.locationCoordType_ === CoordType.BODY ? this.body_.bodyToWorld(this.location_) : this.location_;
    }

    /**
     * Computes the torque, i.e. moment of the force about the center of mass (bivector).
     */
    getTorqueAboutCenterOfMass(): BivectorE3 {
        const r = this.x.subtract(this.body_.X);
        return this.torque_.wedge(r, this.F);
    }

    /**
     * torque, i.e. moment of the force about the center of mass (bivector).
     */
    get Γ(): BivectorE3 {
        return this.getTorqueAboutCenterOfMass();
    }
}

export default ForceApp;
