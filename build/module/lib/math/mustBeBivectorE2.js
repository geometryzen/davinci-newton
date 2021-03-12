/**
 * @hidden
 * @param name
 * @param B
 * @returns
 */
export function mustBeBivectorE2(name, B) {
    if (isNaN(B.xy)) {
        throw new Error(name + ", (" + B.xy + "), must be a BivectorE2.");
    }
    return B;
}
