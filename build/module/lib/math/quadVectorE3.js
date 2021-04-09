/**
 * @hidden
 * @returns x^2 + y^2 + z^2
 */
export function quadVectorE3(vector) {
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    return x * x + y * y + z * z;
}
