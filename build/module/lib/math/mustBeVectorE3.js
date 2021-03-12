/**
 * @hidden
 * @param name
 * @param v
 * @returns
 */
export default function mustBeVectorE3(name, v) {
    if (isNaN(v.x) || isNaN(v.y) || isNaN(v.z)) {
        throw new Error(name + ", (" + v.x + ", " + v.y + ", " + v.z + "), must be a VectorE3.");
    }
    return v;
}
