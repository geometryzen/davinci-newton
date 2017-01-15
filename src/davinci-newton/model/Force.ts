import AbstractSimObject from '../objects/AbstractSimObject';
import CoordType from './CoordType';
import Line from '../objects/Line';
import MassObject from './MassObject';
import SimObject from '../core/SimObject';
import Vector from '../math/Vector';

/**
 * 
 */
export class Force extends AbstractSimObject implements Line {
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
    getTorque(): number {
        return this.torque_;
    }
    isMassObject(): boolean {
        return false;
    }
    setExpireTime(time: number): void {
        throw new Error("TODO");
    }
    similar(obj: SimObject, tolerance?: number): boolean {
        if (!(obj instanceof this.constructor)) {
            return false;
        }
        // require same name: fixes thrust force not appearing when gravity is at same place
        if (obj.getName() !== this.getName()) {
            return false;
        }
        const f: Force = <Force>obj;
        if (!this.getStartPoint().nearEqual(f.getStartPoint(), tolerance)) {
            return false;
        }
        return this.getVector().nearEqual(f.getVector(), tolerance);
    }
}

export default Force;
