"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravitationForceLaw2 = void 0;
var tslib_1 = require("tslib");
var GravitationLaw_1 = require("../core/GravitationLaw");
var Geometric2_1 = require("../math/Geometric2");
var GravitationForceLaw2 = /** @class */ (function (_super) {
    tslib_1.__extends(GravitationForceLaw2, _super);
    function GravitationForceLaw2(body1, body2) {
        return _super.call(this, body1, body2, Geometric2_1.Geometric2.one) || this;
    }
    return GravitationForceLaw2;
}(GravitationLaw_1.GravitationLaw));
exports.GravitationForceLaw2 = GravitationForceLaw2;
