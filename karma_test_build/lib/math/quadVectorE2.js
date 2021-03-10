"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadVectorE2 = void 0;
var dotVectorE2_1 = require("./dotVectorE2");
var isDefined_1 = require("../checks/isDefined");
var isNumber_1 = require("../checks/isNumber");
function quadVectorE2(vector) {
    if (isDefined_1.default(vector)) {
        var x = vector.x;
        var y = vector.y;
        if (isNumber_1.default(x) && isNumber_1.default(y)) {
            return dotVectorE2_1.dotVectorE2(vector, vector);
        }
        else {
            return void 0;
        }
    }
    else {
        return void 0;
    }
}
exports.quadVectorE2 = quadVectorE2;
