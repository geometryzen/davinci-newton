/**
 * Returns true if all coordinates of the vector are exactly zero.
 */
export default function isZeroVectorE3(v) {
    return v.x === 0 && v.y === 0 && v.z === 0;
}
