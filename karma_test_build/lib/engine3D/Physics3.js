"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Physics3 = void 0;
var tslib_1 = require("tslib");
var State_1 = require("../core/State");
var Dynamics3_1 = require("./Dynamics3");
var Euclidean3_1 = require("./Euclidean3");
/**
 *
 */
var Physics3 = /** @class */ (function (_super) {
    tslib_1.__extends(Physics3, _super);
    function Physics3() {
        return _super.call(this, new Euclidean3_1.Euclidean3(), new Dynamics3_1.Dynamics3()) || this;
    }
    return Physics3;
}(State_1.State));
exports.Physics3 = Physics3;
