import Vector from './Vector';

export interface GenericVector {
    getX(): number;
    getY(): number;
    getZ(): number;
    immutable(): Vector;
}

export default GenericVector;
