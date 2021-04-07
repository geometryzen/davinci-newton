import { Pseudo } from '../math/Pseudo';
import { Scalar } from '../math/Scalar';
import { SpinorM21 } from './SpinorM21';
import { VectorM21 } from './VectorM21';

/**
 * @hidden
 */
export interface GeometricM21 extends Pseudo, Scalar, SpinorM21, VectorM21 {
}
