"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantForceLaw3 = void 0;
var tslib_1 = require("tslib");
var ConstantForceLaw_1 = require("../core/ConstantForceLaw");
var CoordType_1 = require("../model/CoordType");
var ConstantForceLaw3 = /** @class */ (function (_super) {
    tslib_1.__extends(ConstantForceLaw3, _super);
    function ConstantForceLaw3(body, vector, vectorCoordType) {
        if (vectorCoordType === void 0) { vectorCoordType = CoordType_1.WORLD; }
        return _super.call(this, body, vector, vectorCoordType) || this;
    }
    return ConstantForceLaw3;
}(ConstantForceLaw_1.ConstantForceLaw));
exports.ConstantForceLaw3 = ConstantForceLaw3;
