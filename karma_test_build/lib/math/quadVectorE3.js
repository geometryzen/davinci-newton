"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function quadVectorE3(vector) {
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    return x * x + y * y + z * z;
}
exports.default = quadVectorE3;
