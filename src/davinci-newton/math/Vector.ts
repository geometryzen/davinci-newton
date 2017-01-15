import GenericVector from './GenericVector';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vector implements GenericVector {
    static ORIGIN = new Vector(0, 0);
    constructor(private x_: number, private y_: number, private z_ = 0) {

    }
    getX(): number {
        return this.x_;
    }
    getY(): number {
        return this.y_;
    }
    getZ(): number {
        return this.z_;
    }
    add(rhs: GenericVector): Vector {
        return void 0;
    }
    subtract(rhs: GenericVector): Vector {
        return void 0;
    }
    multiply(alpha: number): Vector {
        return void 0;
    }
    distanceTo(rhs: GenericVector): number {
        return 0;
    }
    immutable(): Vector {
        return this;
    }
    length(): number {
        return 0;
    }
    nearEqual(vector: GenericVector, opt_tolerance?: number): boolean {
        if (veryDifferent(this.x_, vector.getX(), opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.y_, vector.getY(), opt_tolerance)) {
            return false;
        }
        if (veryDifferent(this.z_, vector.getZ(), opt_tolerance)) {
            return false;
        }
        return true;
    }

    normalize(): Vector {
        return void 0;
    }
    rotate(cosAngle: number, sinAngle: number): Vector {
        return void 0;
    }
}

export default Vector;
