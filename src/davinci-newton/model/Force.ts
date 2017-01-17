import AbstractSimObject from '../objects/AbstractSimObject';
import BivectorE3 from '../math/BivectorE3';
import CoordType from './CoordType';
import MassObject from './MassObject';
import Vector from '../math/Vector';

/**
 * 
 */
export class Force extends AbstractSimObject {
    /**
     * 
     */
    constructor(name: string,
        private body_: MassObject,
        private location_: Vector,
        private locationCoordType_: CoordType,
        private direction_: Vector,
        private directionCoordType_: CoordType
        /*private torque_ = 0*/) {
        super(name);
    }
    getBody(): MassObject {
        return this.body_;
    }
    getVector(): Vector {
        return this.directionCoordType_ === CoordType.BODY ? this.body_.rotateBodyToWorld(this.direction_) : this.direction_;
    }
    getStartPoint(): Vector {
        return this.locationCoordType_ === CoordType.BODY ? this.body_.bodyToWorld(this.location_) : this.location_;
    }
    getEndPoint(): Vector {
        return this.getStartPoint().add(this.getVector());
    }
    getTorque(): BivectorE3 {
        throw new Error("TODO");
    }
    setExpireTime(time: number): void {
        throw new Error("TODO");
    }
}

export default Force;
