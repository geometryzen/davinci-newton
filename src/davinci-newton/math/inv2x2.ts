import det2x2 from '../math/det2x2';

/**
 * Computes the inverse of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
export default function inv2x2(m: Float32Array, te: Float32Array): void {

    const det = det2x2(m);

    const m11 = m[0x0], m12 = m[0x2];
    const m21 = m[0x1], m22 = m[0x3];

    const α = 1 / det;

    te[0x0] = m22 * α; te[0x3] = -m12 * α;
    te[0x1] = -m21 * α; te[0x4] = m11 * α;
}
