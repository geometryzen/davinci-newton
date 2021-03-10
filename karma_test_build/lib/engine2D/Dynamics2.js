"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamics2 = exports.OFFSET_ANGULAR_MOMENTUM_XY = exports.OFFSET_LINEAR_MOMENTUM_Y = exports.OFFSET_LINEAR_MOMENTUM_X = exports.OFFSET_ATTITUDE_XY = exports.OFFSET_ATTITUDE_A = exports.OFFSET_POSITION_Y = exports.OFFSET_POSITION_X = exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY = exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y = exports.INDEX_TOTAL_LINEAR_MOMENTUM_X = void 0;
var Dynamics_1 = require("../core/Dynamics");
var VarsList_1 = require("../core/VarsList");
exports.INDEX_TOTAL_LINEAR_MOMENTUM_X = Dynamics_1.INDEX_RESERVED_LAST + 1;
exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y = Dynamics_1.INDEX_RESERVED_LAST + 2;
exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY = Dynamics_1.INDEX_RESERVED_LAST + 3;
exports.OFFSET_POSITION_X = 0;
exports.OFFSET_POSITION_Y = 1;
exports.OFFSET_ATTITUDE_A = 2;
exports.OFFSET_ATTITUDE_XY = 3;
exports.OFFSET_LINEAR_MOMENTUM_X = 4;
exports.OFFSET_LINEAR_MOMENTUM_Y = 5;
exports.OFFSET_ANGULAR_MOMENTUM_XY = 6;
var varNames = [
    VarsList_1.VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy",
    "total linear momentum - x",
    "total linear momentum - y",
    "total angular momentum - xy"
];
var DISCONTINUOUS_ENERGY_VARIABLES = [
    Dynamics_1.INDEX_TRANSLATIONAL_KINETIC_ENERGY,
    Dynamics_1.INDEX_ROTATIONAL_KINETIC_ENERGY,
    Dynamics_1.INDEX_POTENTIAL_ENERGY,
    Dynamics_1.INDEX_TOTAL_ENERGY,
    exports.INDEX_TOTAL_LINEAR_MOMENTUM_X,
    exports.INDEX_TOTAL_LINEAR_MOMENTUM_Y,
    exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];
var Dynamics2 = /** @class */ (function () {
    function Dynamics2() {
    }
    Dynamics2.prototype.numVariablesPerBody = function () {
        // Each body is described by 7 kinematic components.
        // 2 position
        // 2 attitude (though normalized should be only 1)
        // 2 linear momentum
        // 1 angular momentum
        return 7;
    };
    Dynamics2.prototype.getVarNames = function () {
        return varNames;
    };
    Dynamics2.prototype.getOffsetName = function (offset) {
        switch (offset) {
            case exports.OFFSET_POSITION_X: return "position x";
            case exports.OFFSET_POSITION_Y: return "position y";
            case exports.OFFSET_ATTITUDE_A: return "attitude a";
            case exports.OFFSET_ATTITUDE_XY: return "attitude xy";
            case exports.OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case exports.OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case exports.OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error("getVarName(" + offset + ")");
    };
    Dynamics2.prototype.discontinuousEnergyVariables = function () {
        return DISCONTINUOUS_ENERGY_VARIABLES;
    };
    Dynamics2.prototype.epilog = function (bodies, forceLaws, potentialOffset, varsList) {
        // update the variables that track energy
        var pe = potentialOffset.a;
        var re = 0;
        var te = 0;
        // update the variable that track linear momentum (vector)
        var Px = 0;
        var Py = 0;
        // update the variable that track angular momentum (bivector)
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
                // orbital angular momentum
                Lxy += b.X.x * b.P.y - b.X.y * b.P.x;
                // intrinsic angular momentum
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
        varsList.setValue(exports.INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
    };
    Dynamics2.prototype.updateVarsFromBody = function (body, idx, vars) {
        vars.setValue(exports.OFFSET_POSITION_X + idx, body.X.x);
        vars.setValue(exports.OFFSET_POSITION_Y + idx, body.X.y);
        vars.setValue(exports.OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValue(exports.OFFSET_ATTITUDE_XY + idx, body.R.b);
        vars.setValue(exports.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValue(exports.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
        vars.setValue(exports.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.b);
    };
    Dynamics2.prototype.addForce = function (rateOfChange, idx, force) {
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_X] += force.x;
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_Y] += force.y;
    };
    Dynamics2.prototype.addTorque = function (rateOfChange, idx, torque) {
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_XY] += torque.b;
    };
    Dynamics2.prototype.updateBody = function (vars, idx, body) {
        body.X.a = 0;
        body.X.x = vars[idx + exports.OFFSET_POSITION_X];
        body.X.y = vars[idx + exports.OFFSET_POSITION_Y];
        body.X.b = 0;
        // body.X.uom
        body.R.a = vars[idx + exports.OFFSET_ATTITUDE_A];
        body.R.x = 0;
        body.R.y = 0;
        body.R.b = vars[idx + exports.OFFSET_ATTITUDE_XY];
        // Keep the magnitude of the attitude as close to 1 as possible.
        var R = body.R;
        var magR = Math.sqrt(R.a * R.a + R.b * R.b);
        body.R.a = body.R.a / magR;
        body.R.b = body.R.b / magR;
        body.P.a = 0;
        body.P.x = vars[idx + exports.OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + exports.OFFSET_LINEAR_MOMENTUM_Y];
        body.P.b = 0;
        // body.P.uom
        body.L.a = 0;
        body.L.x = 0;
        body.L.y = 0;
        body.L.b = vars[idx + exports.OFFSET_ANGULAR_MOMENTUM_XY];
        // body.L.uom
        body.updateAngularVelocity();
    };
    Dynamics2.prototype.setPositionRateOfChange = function (rateOfChange, idx, body) {
        var P = body.P;
        var mass = body.M.a;
        rateOfChange[idx + exports.OFFSET_POSITION_X] = P.x / mass;
        rateOfChange[idx + exports.OFFSET_POSITION_Y] = P.y / mass;
    };
    Dynamics2.prototype.setAttitudeRateOfChange = function (rateOfChange, idx, body) {
        // Let Ω(t) be the (bivector) angular velocity.
        // Let R(t) be the (spinor) attitude of the rigid body. 
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        var R = body.R;
        var Ω = body.Ω;
        // dR/dt = +(1/2)(Ω.b)(R.b) - (1/2)(Ω.b)(R.a) I, where I = e1e2. 
        rateOfChange[idx + exports.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
        rateOfChange[idx + exports.OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);
    };
    Dynamics2.prototype.zeroLinearMomentum = function (rateOfChange, idx) {
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChange[idx + exports.OFFSET_LINEAR_MOMENTUM_Y] = 0;
    };
    Dynamics2.prototype.zeroAngularMomentum = function (rateOfChange, idx) {
        rateOfChange[idx + exports.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
    };
    return Dynamics2;
}());
exports.Dynamics2 = Dynamics2;
