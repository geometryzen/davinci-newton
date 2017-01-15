import Vector from './Vector';

interface GenericVector {
    getX(): number;
    getY(): number;
    immutable(): Vector;
}

export default GenericVector;
