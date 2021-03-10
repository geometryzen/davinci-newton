"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wedgeXY = exports.wedgeZX = exports.wedgeYZ = void 0;
function wedgeYZ(a, b) {
    return a.y * b.z - a.z * b.y;
}
exports.wedgeYZ = wedgeYZ;
function wedgeZX(a, b) {
    return a.z * b.x - a.x * b.z;
}
exports.wedgeZX = wedgeZX;
function wedgeXY(a, b) {
    return a.x * b.y - a.y * b.x;
}
exports.wedgeXY = wedgeXY;
