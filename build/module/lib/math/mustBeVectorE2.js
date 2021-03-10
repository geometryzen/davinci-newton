export function mustBeVectorE2(name, v) {
    if (isNaN(v.x) || isNaN(v.y)) {
        throw new Error(name + ", (" + v.x + ", " + v.y + "), must be a VectorE2.");
    }
    return v;
}
