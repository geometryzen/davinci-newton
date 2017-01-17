import SimObject from '../core/SimObject';
import Vector from '../math/Vector';
import VectorE3 from '../math/VectorE3';

/**
 * An object that has mass, position, velocity and a local coordinate system.
 */
export interface MassObject extends SimObject {
    /**
     * 
     */
    M: number;
    /**
     * Returns the world coordinates of the given body coordinates point,
     * based on current position of this object.
     */
    bodyToWorld(point: VectorE3): Vector;
    /**
     * Rotates a body coordinates vector to its orientation in world coordinates.
     */
    rotateBodyToWorld(body: VectorE3): Vector;
}

export default MassObject;
