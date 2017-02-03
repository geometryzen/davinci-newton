import BivectorE3 from '../math/BivectorE3';
import Geometric3 from '../math/Geometric3';
import GeometricE3 from '../math/GeometricE3';
import SimObject from '../core/SimObject';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

export interface ForceBody3 extends SimObject {
    M: GeometricE3;
    X: VectorE3;
    R: SpinorE3;
    P: VectorE3;
    L: BivectorE3;
    Ω: BivectorE3;
    varsIndex: number;
    rotationalEnergy(): Geometric3;
    translationalEnergy(): Geometric3;
    updateAngularVelocity(): void;
}

export default ForceBody3;
