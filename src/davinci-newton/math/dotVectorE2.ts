/**
 * Computes the dot product of the Cartesian components in a Euclidean metric
 */
export function dotVectorE2(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return a.x * b.x + a.y * b.y;
}
