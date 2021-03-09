/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
export function dotVectorE2(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>): number {
    return a.x * b.x + a.y * b.y;
}
