"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arraysEQ = void 0;
var isDefined_1 = require("../checks/isDefined");
var isNull_1 = require("../checks/isNull");
var isUndefined_1 = require("../checks/isUndefined");
function arraysEQ(a, b) {
    if (isDefined_1.default(a)) {
        if (isDefined_1.default(b)) {
            if (!isNull_1.default(a)) {
                if (!isNull_1.default(b)) {
                    var aLen = a.length;
                    var bLen = b.length;
                    if (aLen === bLen) {
                        for (var i = 0; i < aLen; i++) {
                            if (a[i] !== b[i]) {
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return isNull_1.default(b);
            }
        }
        else {
            return false;
        }
    }
    else {
        return isUndefined_1.default(b);
    }
}
exports.arraysEQ = arraysEQ;