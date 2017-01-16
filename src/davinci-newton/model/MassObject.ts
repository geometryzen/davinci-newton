import GenericVector from '../math/GenericVector';
import SimObject from '../core/SimObject';
import Vector from '../math/Vector';

/**
 * An object that has mass, position, velocity and a local coordinate system.
 */
export interface MassObject extends SimObject {
    /**
     * 
     */
    getMass(): number;
    /**
     * Returns the world coordinates of the given body coordinates point,
     * based on current position of this object.
     */
    bodyToWorld(point: GenericVector): Vector;
    /**
     * Rotates a body coordinates vector to its orientation in world coordinates.
     */
    rotateBodyToWorld(body: GenericVector): Vector;
}

export default MassObject;
