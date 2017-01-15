import Vector from './Vector';

interface GenericVector {
    getX(): number;
    getY(): number;
    getZ(): number;
    immutable(): Vector;
}

export default GenericVector;
