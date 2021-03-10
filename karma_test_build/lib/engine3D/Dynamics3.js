"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamics3 = exports.OFFSET_ANGULAR_MOMENTUM_XY = exports.OFFSET_ANGULAR_MOMENTUM_ZX = exports.OFFSET_ANGULAR_MOMENTUM_YZ = exports.OFFSET_LINEAR_MOMENTUM_Z = exports.OFFSET_LINEAR_MOMENTUM_Y = exports.OFFSET_LINEAR_MOMENTUM_X = exports.OFFSET_ATTITUDE_XY = exports.OFFSET_ATTITUDE_ZX = exports.OFFSET_ATTITUDE_YZ = exports.OFFSET_ATTITUDE_A = exports.OFFSET_POSITION_Z = exports.OFFSET_POSITION_Y = exports.OFFSET_POSITION_X = exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY = exports.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = exports.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = exports.INDEX_TOTAL_LINEAR_MOMENTUM_Z = exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y = exports.INDEX_TOTAL_LINEAR_MOMENTUM_X = void 0;
var Dynamics_1 = require("../core/Dynamics");
var VarsList_1 = require("../core/VarsList");
var wedge3_1 = require("../math/wedge3");
exports.INDEX_TOTAL_LINEAR_MOMENTUM_X = Dynamics_1.INDEX_RESERVED_LAST + 1;
exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y = Dynamics_1.INDEX_RESERVED_LAST + 2;
exports.INDEX_TOTAL_LINEAR_MOMENTUM_Z = Dynamics_1.INDEX_RESERVED_LAST + 3;
exports.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = Dynamics_1.INDEX_RESERVED_LAST + 4;
exports.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = Dynamics_1.INDEX_RESERVED_LAST + 5;
exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY = Dynamics_1.INDEX_RESERVED_LAST + 6;
exports.OFFSET_POSITION_X = 0;
exports.OFFSET_POSITION_Y = 1;
exports.OFFSET_POSITION_Z = 2;
exports.OFFSET_ATTITUDE_A = 3;
exports.OFFSET_ATTITUDE_YZ = 4;
exports.OFFSET_ATTITUDE_ZX = 5;
exports.OFFSET_ATTITUDE_XY = 6;
exports.OFFSET_LINEAR_MOMENTUM_X = 7;
exports.OFFSET_LINEAR_MOMENTUM_Y = 8;
exports.OFFSET_LINEAR_MOMENTUM_Z = 9;
exports.OFFSET_ANGULAR_MOMENTUM_YZ = 10;
exports.OFFSET_ANGULAR_MOMENTUM_ZX = 11;
exports.OFFSET_ANGULAR_MOMENTUM_XY = 12;
var varNames = [
    VarsList_1.VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy",
    "total linear momentum - x",
    "total linear momentum - y",
    "total linear momentum - z",
    "total angular momentum - yz",
    "total angular momentum - zx",
    "total angular momentum - xy"
];
var DISCONTINUOUS_ENERGY_VARIABLES = [
    Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY,
    Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY,
    Dynamics_1.INDEX_POTENTIAL_ENERGY,
    Dynamics_1.INDEX_TOTAL_ENERGY,
    exports.INDEX_TOTAL_LINEAR_MOMENTUM_X,
    exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y,
    exports.INDEX_TOTAL_LINEAR_MOMENTUM_Z,
    exports.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ,
    exports.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX,
    exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];
var Dynamics3 = /** @class */ (function () {
    function Dynamics3() {
    }
    Dynamics3.prototype.numVariablesPerBody = function () {
        return 13;
    };
    Dynamics3.prototype.getVarNames = function () {
        return varNames;
    };
    Dynamics3.prototype.getOffsetName = function (offset) {
        switch (offset) {
            case exports.OFFSET_POSITION_X: return "position x";
            case exports.OFFSET_POSITION_Y: return "position y";
            case exports.OFFSET_POSITION_Z: return "position z";
            case exports.OFFSET_ATTITUDE_A: return "attitude a";
            case exports.OFFSET_ATTITUDE_YZ: return "attitude yz";
            case exports.OFFSET_ATTITUDE_ZX: return "attitude zx";
            case exports.OFFSET_ATTITUDE_XY: return "attitude xy";
            case exports.OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case exports.OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case exports.OFFSET_LINEAR_MOMENTUM_Z: return "linear momentum z";
            case exports.OFFSET_ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
            case exports.OFFSET_ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
            case exports.OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error("getVarName(" + offset + ")");
    };
    Dynamics3.prototype.discontinuousEnergyVariables = function () {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    };
    Dynamics3.prototype.epilog = function (bodies, forceLaws, potentialOffset, varsList) {
        // update the variables that track energy
        var pe = potentialOffset.a;
        var re = 0;
        var te = 0;
        // update the variable that track linear momentum (vector)
        var Px = 0;
        var Py = 0;
        var Pz = 0;
        // update the variable that track angular momentum (bivector)
        var Lyz = 0;
        var Lzx = 0;
        var Lxy = 0;
        var bs = bodies;
        var Nb = bs.length;
        for (var i = 0; i < Nb; i++) {
            var b = bs[i];
            if (isFinite(b.M.a)) {
                re += b.rotationalEnergy().a;
                te += b.translationalEnergy().a;
                // linear momentum
                Px += b.P.x;
                Py += b.P.y;
                Pz += b.P.z;
                // orbital angular momentum
                Lyz += wedge3_1.wedgeYZ(b.X, b.P);
                Lzx += wedge3_1.wedgeZX(b.X, b.P);
                Lxy += wedge3_1.wedgeXY(b.X, b.P);
                // spin angular momentum
                Lyz += b.L.yz;
                Lzx += b.L.zx;
                Lxy += b.L.xy;
            }
        }
        var fs = forceLaws;
        var Nf = fs.length;
        for (var i = 0; i < Nf; i++) {
            pe += fs[i].potentialEnergy().a;
        }
        varsList.setValue(Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
        varsList.setValue(Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
        varsList.setValue(Dynamics_1.INDEX_POTENTIAL_ENERGY, pe, true);
        varsList.setValue(Dynamics_1.INDEX_TOTAL_ENERGY, te + re + pe, true);
        varsList.setValue(exports.INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
        varsList.setValue(exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
        varsList.setValue(exports.INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz, true);
        varsList.setValue(exports.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz, true);
        varsList.setValue(exports.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx, true);
        varsList.setValue(exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
    };
    Dynamics3.prototype.updateVarsFromBody = function (body, idx, vars) {
        vars.setValue(exports.OFFSET_POSITION_X + idx, body.X.x);
        vars.setValue(exports.OFFSET_POSITION_Y + idx, body.X.y);
        vars.setValue(exports.OFFSET_POSITION_Z + idx, body.X.z);
        vars.setValue(exports.OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValue(exports.OFFSET_ATTITUDE_XY + idx, body.R.xy);
        vars.setValue(exports.OFFSET_ATTITUDE_YZ + idx, body.R.yz);
        vars.setValue(exports.OFFSET_ATTITUDE_ZX + idx, body.R.zx);
        vars.setValue(exports.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValue(exports.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
        vars.setValue(exports.OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);
        vars.setValue(exports.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
        vars.setValue(exports.OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
        vars.setValue(exports.OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
    };
    Dynamics3.prototype.addForce = function (rateOfChange, idx, force) {
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_X] += force.x;
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_Y] += force.y;
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_Z] += force.z;
    };
    Dynamics3.prototype.addTorque = function (rateOfChange, idx, torque) {
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_YZ] += torque.yz;
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_ZX] += torque.zx;
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_XY] += torque.xy;
    };
    Dynamics3.prototype.updateBody = function (vars, idx, body) {
        body.X.x = vars[idx + exports.OFFSET_POSITION_X];
        body.X.y = vars[idx + exports.OFFSET_POSITION_Y];
        body.X.z = vars[idx + exports.OFFSET_POSITION_Z];
        body.R.a = vars[idx + exports.OFFSET_ATTITUDE_A];
        body.R.xy = vars[idx + exports.OFFSET_ATTITUDE_XY];
        body.R.yz = vars[idx + exports.OFFSET_ATTITUDE_YZ];
        body.R.zx = vars[idx + exports.OFFSET_ATTITUDE_ZX];
        // Keep the magnitude of the attitude as close to 1 as possible.
        var R = body.R;
        var magR = Math.sqrt(R.a * R.a + R.xy * R.xy + R.yz * R.yz + R.zx * R.zx);
        body.R.a = body.R.a / magR;
        body.R.xy = body.R.xy / magR;
        body.R.yz = body.R.yz / magR;
        body.R.zx = body.R.zx / magR;
        body.P.x = vars[idx + exports.OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + exports.OFFSET_LINEAR_MOMENTUM_Y];
        body.P.z = vars[idx + exports.OFFSET_LINEAR_MOMENTUM_Z];
        body.L.xy = vars[idx + exports.OFFSET_ANGULAR_MOMENTUM_XY];
        body.L.yz = vars[idx + exports.OFFSET_ANGULAR_MOMENTUM_YZ];
        body.L.zx = vars[idx + exports.OFFSET_ANGULAR_MOMENTUM_ZX];
        body.updateAngularVelocity();
    };
    Dynamics3.prototype.setPositionRateOfChange = function (rateOfChange, idx, body) {
        // The rate of change of position is the velocity.
        // dX/dt = V = P / M
        var P = body.P;
        var mass = body.M.a;
        rateOfChange[idx + exports.OFFSET_POSITION_X] = P.x / mass;
        rateOfChange[idx + exports.OFFSET_POSITION_Y] = P.y / mass;
        rateOfChange[idx + exports.OFFSET_POSITION_Z] = P.z / mass;
    };
    Dynamics3.prototype.setAttitudeRateOfChange = function (rateOfChange, idx, body) {
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        var R = body.R;
        var Ω = body.Ω;
        rateOfChange[idx + exports.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
        rateOfChange[idx + exports.OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
        rateOfChange[idx + exports.OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
        rateOfChange[idx + exports.OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
    };
    Dynamics3.prototype.zeroLinearMomentum = function (rateOfChange, idx) {
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_Y] = 0;
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_Z] = 0;
    };
    Dynamics3.prototype.zeroAngularMomentum = function (rateOfChange, idx) {
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
    };
    return Dynamics3;
}());
exports.Dynamics3 = Dynamics3;
