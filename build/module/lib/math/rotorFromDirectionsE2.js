import { dotVectorE2 as dot } from './dotVectorE2';
import { quadVectorE2 as quad } from './quadVectorE2';
/**
 * @hidden
 */
var sqrt = Math.sqrt;
/**
 * @hidden
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 *
 * @param a The 'from' vector.
 * @param b The 'to' vector.
 * @param m The output multivector.
 * @returns
 */
export function rotorFromDirectionsE2(a, b, m) {
    var quadA = quad(a);
    var absA = sqrt(quadA);
    var quadB = quad(b);
    var absB = sqrt(quadB);
    var BA = absB * absA;
    var dotBA = dot(b, a);
    var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
    if (denom !== 0) {
        m = m.versor(b, a);
        m = m.addScalar(BA, void 0, 1);
        m = m.divByScalar(denom);
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0.
        // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
        // Then a and b are anti-parallel.
        // The plane of the rotation is ambiguous.
        return void 0;
    }
}
