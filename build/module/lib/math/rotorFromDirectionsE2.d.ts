import { SpinorE2 as Spinor } from './SpinorE2';
import { Unit } from './Unit';
import { VectorE2 as Vector } from './VectorE2';
interface Output extends Spinor {
    versor(a: Readonly<Vector>, b: Readonly<Vector>): Output;
    addScalar(α: number, uom?: Unit): Output;
    divByScalar(α: number, uom?: Unit): Output;
}
/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 *
 * @param a The 'from' vector.
 * @param b The 'to' vector.
 * @param m The output multivector.
 * @returns
 */
export declare function rotorFromDirectionsE2(a: Readonly<Vector>, b: Readonly<Vector>, m: Output): void;
export {};