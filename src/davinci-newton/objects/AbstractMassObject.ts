import AbstractSimObject from './AbstractSimObject';
import GenericVector from '../math/GenericVector';
import MassObject from '../model/MassObject';
import Vector from '../math/Vector';

export class AbstractMassObject extends AbstractSimObject implements MassObject {
    /**
     * 
     */
    protected loc_world_ = Vector.ORIGIN;
    /**
     * 
     */
    protected sinAngle_ = 0;
    /**
     * 
     */
    protected cosAngle_ = 1;
    /**
     * 
     */
    protected velocity_ = Vector.ORIGIN;
    /**
     * 
     */
    protected angular_velocity_ = 0;
    /**
     * center of mass in body coordinates.
     */
    protected cm_body_ = Vector.ORIGIN;
    constructor(name: string, localName: string) {
        super();
    }
    bodyToWorld(p_body: GenericVector): Vector {
        var rx = p_body.getX() - this.cm_body_.getX();  // vector from cm to p_body
        var ry = p_body.getY() - this.cm_body_.getY();
        var vx = this.loc_world_.getX() + (rx * this.cosAngle_ - ry * this.sinAngle_);
        var vy = this.loc_world_.getY() + (rx * this.sinAngle_ + ry * this.cosAngle_);
        return new Vector(vx, vy);
    }
    getVelocity(p_body: GenericVector): Vector {
        if (p_body) {
            var r = this.rotateBodyToWorld(p_body.immutable().subtract(this.cm_body_));
            return new Vector(this.velocity_.getX() - r.getY() * this.angular_velocity_,
                this.velocity_.getY() + r.getX() * this.angular_velocity_);
        }
        else {
            return this.velocity_;
        }
    }
    rotateBodyToWorld(v_body: GenericVector) {
        return v_body.immutable().rotate(this.cosAngle_, this.sinAngle_);
    }
}

export default AbstractMassObject;
