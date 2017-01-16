import Vector from './Vector';
import VectorE3 from './VectorE3';

export interface GenericVector extends VectorE3 {
    getX(): number;
    getY(): number;
    getZ(): number;
    immutable(): Vector;
}

export default GenericVector;
