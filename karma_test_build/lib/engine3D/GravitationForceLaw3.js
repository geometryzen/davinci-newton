"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravitationForceLaw3 = void 0;
var tslib_1 = require("tslib");
var GravitationLaw_1 = require("../core/GravitationLaw");
var Geometric3_1 = require("../math/Geometric3");
var GravitationForceLaw3 = /** @class */ (function (_super) {
    tslib_1.__extends(GravitationForceLaw3, _super);
    function GravitationForceLaw3(body1, body2) {
        return _super.call(this, body1, body2, Geometric3_1.Geometric3.one) || this;
    }
    return GravitationForceLaw3;
}(GravitationLaw_1.GravitationLaw));
exports.GravitationForceLaw3 = GravitationForceLaw3;
