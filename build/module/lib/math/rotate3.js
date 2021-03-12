/**
 * @hidden
 * @param x
 * @param y
 * @param z
 * @param spinor
 * @returns
 */
export function rotateX(x, y, z, spinor) {
    var a = spinor.xy;
    var b = spinor.yz;
    var c = spinor.zx;
    var w = spinor.a;
    var ix = w * x - c * z + a * y;
    var iy = w * y - a * x + b * z;
    var iz = w * z - b * y + c * x;
    var iw = b * x + c * y + a * z;
    return ix * w + iw * b + iy * a - iz * c;
}
/**
 * @hidden
 * @param x
 * @param y
 * @param z
 * @param spinor
 * @returns
 */
export function rotateY(x, y, z, spinor) {
    var a = spinor.xy;
    var b = spinor.yz;
    var c = spinor.zx;
    var w = spinor.a;
    var ix = w * x - c * z + a * y;
    var iy = w * y - a * x + b * z;
    var iz = w * z - b * y + c * x;
    var iw = b * x + c * y + a * z;
    return iy * w + iw * c + iz * b - ix * a;
}
/**
 * @hidden
 * @param x
 * @param y
 * @param z
 * @param spinor
 * @returns
 */
export function rotateZ(x, y, z, spinor) {
    var a = spinor.xy;
    var b = spinor.yz;
    var c = spinor.zx;
    var w = spinor.a;
    var ix = w * x - c * z + a * y;
    var iy = w * y - a * x + b * z;
    var iz = w * z - b * y + c * x;
    var iw = b * x + c * y + a * z;
    return iz * w + iw * a + ix * c - iy * b;
}
