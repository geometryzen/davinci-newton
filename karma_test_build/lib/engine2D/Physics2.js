"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Physics2 = void 0;
var tslib_1 = require("tslib");
var State_1 = require("../core/State");
var Dynamics2_1 = require("./Dynamics2");
var Euclidean2_1 = require("./Euclidean2");
/**
 *
 */
var Physics2 = /** @class */ (function (_super) {
    tslib_1.__extends(Physics2, _super);
    function Physics2() {
        return _super.call(this, new Euclidean2_1.Euclidean2(), new Dynamics2_1.Dynamics2()) || this;
    }
    return Physics2;
}(State_1.State));
exports.Physics2 = Physics2;
