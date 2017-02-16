import ForceBody3 from './ForceBody3';
import GeometricE3 from '../math/GeometricE3';

/**
 * 
 */
export interface Charged3 extends ForceBody3 {
    Q: GeometricE3;
}

export default Charged3;
