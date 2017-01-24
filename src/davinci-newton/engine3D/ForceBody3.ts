import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

export interface ForceBody3 {
    X: VectorE3;
    R: SpinorE3;
    varsIndex: number;
}

export default ForceBody3;
