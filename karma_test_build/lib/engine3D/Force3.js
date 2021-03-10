"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Force3 = void 0;
var tslib_1 = require("tslib");
var Force_1 = require("../core/Force");
/**
 *
 */
var Force3 = /** @class */ (function (_super) {
    tslib_1.__extends(Force3, _super);
    function Force3(body) {
        return _super.call(this, body, body.metric) || this;
    }
    return Force3;
}(Force_1.Force));
exports.Force3 = Force3;
