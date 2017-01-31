import SpinorE2 from '../math/SpinorE2';
import VectorE2 from '../math/VectorE2';

export interface ForceBody2 {
    X: VectorE2;
    R: SpinorE2;
    varsIndex: number;
}

export default ForceBody2;
