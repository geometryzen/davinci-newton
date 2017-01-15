import GenericVector from '../math/GenericVector';
import Vector from '../math/Vector';

interface MassObject {
    bodyToWorld(point: GenericVector): Vector;
    getVelocity(point: GenericVector): Vector;
    rotateBodyToWorld(body: GenericVector): Vector;
}

export default MassObject;
