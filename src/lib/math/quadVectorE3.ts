/**
 * @hidden
 * @param vector 
 * @returns 
 */
export default function quadVectorE3(vector: { x: number; y: number; z: number }): number {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;
    return x * x + y * y + z * z;
}
