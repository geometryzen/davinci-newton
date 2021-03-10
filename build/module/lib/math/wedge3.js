export function wedgeYZ(a, b) {
    return a.y * b.z - a.z * b.y;
}
export function wedgeZX(a, b) {
    return a.z * b.x - a.x * b.z;
}
export function wedgeXY(a, b) {
    return a.x * b.y - a.y * b.x;
}
