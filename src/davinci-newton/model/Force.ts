import CoordType from './CoordType';
import MassObject from './MassObject';
import SimObject from '../core/SimObject';
import Vector from '../math/Vector';

export class Force implements SimObject {
    /**
     * 
     */
    constructor(name: string,
        private body_: MassObject,
        private location_: Vector,
        private locationCoordType_: CoordType,
        private direction_: Vector,
        private directionCoordType_: CoordType,
        private torque_ = 0) {
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
    getTorque(): number {
        return this.torque_;
    }
    isMassObject(): boolean {
        return false;
    }
    setExpireTime(time: number): void {
        throw new Error("TODO");
    }
}

export default Force;
