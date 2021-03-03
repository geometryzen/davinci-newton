import { SimObject } from '../core/SimObject';
import { BivectorE2 } from '../math/BivectorE2';
import { Geometric2 } from '../math/Geometric2';
import { GeometricE2 } from '../math/GeometricE2';
import { SpinorE2 } from '../math/SpinorE2';
import { VectorE2 } from '../math/VectorE2';

export interface ForceBody2 extends SimObject {
    /**
     * A placeholder for applications to define a unique identifier.
     */
    uuid: string;
    /**
     * mass
     */
    M: GeometricE2;
    /**
     * position
     */
    X: VectorE2;
    /**
     * attitude
     */
    R: SpinorE2;
    /**
     * momentum
     */
    P: VectorE2;
    /**
     * angular momentum
     */
    L: BivectorE2;
    /**
     * angular velocity
     */
    Ω: BivectorE2;
    /**
     * offset into state array
     */
    varsIndex: number;
    /**
     * computes the rotational kinetic energy.
     */
    rotationalEnergy(): Geometric2;
    /**
     * computes the translational kinetic energy.
     */
    translationalEnergy(): Geometric2;
    /**
     * updates the angular velocity from the angular momentum.
     */
    updateAngularVelocity(): void;
}
