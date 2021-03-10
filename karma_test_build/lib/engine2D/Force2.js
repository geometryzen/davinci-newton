"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Force2 = void 0;
var tslib_1 = require("tslib");
var Force_1 = require("../core/Force");
/**
 *
 */
var Force2 = /** @class */ (function (_super) {
    tslib_1.__extends(Force2, _super);
    function Force2(body) {
        return _super.call(this, body, body.metric) || this;
    }
    return Force2;
}(Force_1.Force));
exports.Force2 = Force2;
