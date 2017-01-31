/**
 * Computes the determinant of a 2x2 (square) matrix where the elements are assumed to be in column-major order.
 */
export default function det2x2(m: Float32Array): number {

    const m00 = m[0x0], m01 = m[0x2];
    const m10 = m[0x1], m11 = m[0x3];

    return m00 * m11 - m01 * m10;
}
