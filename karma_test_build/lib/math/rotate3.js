"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateZ = exports.rotateY = exports.rotateX = void 0;
function rotateX(x, y, z, spinor) {
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
exports.rotateX = rotateX;
function rotateY(x, y, z, spinor) {
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
exports.rotateY = rotateY;
function rotateZ(x, y, z, spinor) {
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
exports.rotateZ = rotateZ;
