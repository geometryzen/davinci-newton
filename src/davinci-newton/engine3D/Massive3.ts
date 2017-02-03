import ForceBody3 from './ForceBody3';
import GeometricE3 from '../math/GeometricE3';
/**
 * 
 */
export interface Massive3 extends ForceBody3 {
    M: GeometricE3;
}

export default Massive3;
