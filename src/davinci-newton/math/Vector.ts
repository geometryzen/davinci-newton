import GenericVector from './GenericVector';
import veryDifferent from '../util/veryDifferent';

/**
 * An immutable vector in 3D space; after creation it cannot be altered.
 */
export class Vector implements GenericVector {

    /**
     * 
     */
    static ORIGIN = new Vector(0, 0, 0);

    /**
     * 
     */
    constructor(private x_: number, private y_: number, private z_: number) {

    }

    /**
     * 
     */
    getX(): number {
        return this.x_;
    }

    /**
     * 
     */
    getY(): number {
        return this.y_;
    }

    /**
     * 
     */
    getZ(): number {
        return this.z_;
    }

    /**
     * 
     */
    add(rhs: GenericVector): Vector {
        throw new Error("TODO: add");
    }

    /**
     * 
     */
    subtract(rhs: GenericVector): Vector {
        throw new Error("TODO: subtract");
    }

    /**
     * 
     */
    multiply(alpha: number): Vector {
        throw new Error("TODO: multiply");
    }

    /**
     * 
     */
    distanceTo(rhs: GenericVector): number {
        throw new Error("TODO: distanceTo");
    }

    /**
     * 
     */
    immutable(): Vector {
        return this;
    }

    /**
     * 
     */
    length(): number {
        throw new Error("TODO: length");
    }

    /**
     * 
     */
    nearEqual(vector: GenericVector, tolerance?: number): boolean {
        if (veryDifferent(this.x_, vector.getX(), tolerance)) {
            return false;
        }
        if (veryDifferent(this.y_, vector.getY(), tolerance)) {
            return false;
        }
        if (veryDifferent(this.z_, vector.getZ(), tolerance)) {
            return false;
        }
        return true;
    }

    /**
     * 
     */
    normalize(): Vector {
        throw new Error("TODO: normalize");
    }

    /**
     * 
     */
    rotate(cosAngle: number, sinAngle: number): Vector {
        throw new Error("TODO: rotate");
    }
}

export default Vector;
