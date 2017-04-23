import BivectorE3 from '../math/BivectorE3';
import Geometric3 from '../math/Geometric3';
import GeometricE3 from '../math/GeometricE3';
import SimObject from '../core/SimObject';
import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';

export interface ForceBody3 extends SimObject {
    /**
     * A placeholder for applications to define a unique identifier.
     */
    uuid: string;
    /**
     * mass
     */
    M: GeometricE3;
    /**
     * position
     */
    X: VectorE3;
    /**
     * attitude
     */
    R: SpinorE3;
    /**
     * momentum
     */
    P: VectorE3;
    /**
     * angular momentum
     */
    L: BivectorE3;
    /**
     * angular velocity
     */
    Ω: BivectorE3;
    /**
     * offset into state array
     */
    varsIndex: number;
    /**
     * computes the rotational kinetic energy.
     */
    rotationalEnergy(): Geometric3;
    /**
     * computes the translational kinetic energy.
     */
    translationalEnergy(): Geometric3;
    /**
     * updates the angular velocity from the angular momentum.
     */
    updateAngularVelocity(): void;
}

export default ForceBody3;
