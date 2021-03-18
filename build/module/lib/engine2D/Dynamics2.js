import { INDEX_POTENTIAL_ENERGY, INDEX_RESERVED_LAST, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_TOTAL_ENERGY, INDEX_TRANSLATIONAL_KINETIC_ENERGY } from '../core/Dynamics';
import { VarsList } from "../core/VarsList";
import { Unit } from '../math/Unit';
/**
 * @hidden
 */
export var INDEX_TOTAL_LINEAR_MOMENTUM_X = INDEX_RESERVED_LAST + 1;
/**
 * @hidden
 */
export var INDEX_TOTAL_LINEAR_MOMENTUM_Y = INDEX_RESERVED_LAST + 2;
/**
 * @hidden
 */
export var INDEX_TOTAL_ANGULAR_MOMENTUM_XY = INDEX_RESERVED_LAST + 3;
/**
 * @hidden
 */
export var OFFSET_POSITION_X = 0;
/**
 * @hidden
 */
export var OFFSET_POSITION_Y = 1;
/**
 * @hidden
 */
export var OFFSET_ATTITUDE_A = 2;
/**
 * @hidden
 */
export var OFFSET_ATTITUDE_XY = 3;
/**
 * @hidden
 */
export var OFFSET_LINEAR_MOMENTUM_X = 4;
/**
 * @hidden
 */
export var OFFSET_LINEAR_MOMENTUM_Y = 5;
/**
 * @hidden
 */
export var OFFSET_ANGULAR_MOMENTUM_XY = 6;
/**
 * @hidden
 */
var varNames = [
    VarsList.TIME,
    "translational kinetic energy",
    "rotational kinetic energy",
    "potential energy",
    "total energy",
    "total linear momentum - x",
    "total linear momentum - y",
    "total angular momentum - xy"
];
/**
 * @hidden
 */
var DISCONTINUOUS_ENERGY_VARIABLES = [
    INDEX_TRANSLATIONAL_KINETIC_ENERGY,
    INDEX_ROTATIONAL_KINETIC_ENERGY,
    INDEX_POTENTIAL_ENERGY,
    INDEX_TOTAL_ENERGY,
    INDEX_TOTAL_LINEAR_MOMENTUM_X,
    INDEX_TOTAL_LINEAR_MOMENTUM_Y,
    INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];
/**
 * @hidden
 */
var Dynamics2 = /** @class */ (function () {
    function Dynamics2() {
        this.debug = false;
    }
    Dynamics2.prototype.numVarsPerBody = function () {
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
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_POSITION_Y: return "position y";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_ATTITUDE_XY: return "attitude xy";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error("getVarName(" + offset + ")");
    };
    Dynamics2.prototype.discontinuousEnergyVars = function () {
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
        varsList.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
        varsList.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
        varsList.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
        varsList.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy);
    };
    Dynamics2.prototype.updateVarsFromBody = function (body, idx, vars) {
        var X = body.X;
        var R = body.R;
        vars.setValueJump(OFFSET_POSITION_X + idx, X.x);
        vars.setValueJump(OFFSET_POSITION_Y + idx, X.y);
        vars.setUnit(OFFSET_POSITION_X + idx, X.uom);
        vars.setUnit(OFFSET_POSITION_Y + idx, X.uom);
        vars.setValueJump(OFFSET_ATTITUDE_A + idx, R.a);
        vars.setValueJump(OFFSET_ATTITUDE_XY + idx, R.b);
        if (!Unit.isOne(R.uom)) {
            throw new Error("R.uom should be one, but was " + R.uom);
        }
        vars.setUnit(OFFSET_ATTITUDE_A + idx, R.uom);
        vars.setUnit(OFFSET_ATTITUDE_XY + idx, R.uom);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.uom);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.uom);
        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.b);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.uom);
    };
    Dynamics2.prototype.addForceToRateOfChangeLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, force, uomTime) {
        if (this.debug) {
            console.log("addForceToRateOfChangeLinearMomentumVars()");
        }
        var Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        var Fy = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
        if (this.debug) {
            console.log("BEFORE");
            console.log("Fx=" + Fx + ", Fy=" + Fy + ", Fuom=" + rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X]);
            console.log("force=" + force + ", uomTime=" + uomTime);
        }
        if (Fx !== 0 || Fy !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X], force.uom);
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = Fx + force.x;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = Fy + force.y;
        if (this.debug) {
            console.log("AFTER");
            console.log("Fx=" + rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] + ", Fxuom=" + rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X]);
            console.log("Fy=" + rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] + ", Fyuom=" + rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y]);
            console.log("force=" + force + ", uomTime=" + uomTime);
        }
    };
    Dynamics2.prototype.getForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
        force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        force.y = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
        force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X];
    };
    Dynamics2.prototype.setForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = force.x;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.y;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
    };
    Dynamics2.prototype.addTorqueToRateOfChangeAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, torque, uomTime) {
        if (this.debug) {
            console.log("addTorqueToRateOfChangeAngularMomentumVars(torque=" + torque + ")");
        }
        var Tb = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        if (Tb !== 0) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY], torque.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = torque.uom;
        }
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Tb + torque.b;
    };
    Dynamics2.prototype.updateBodyFromVars = function (vars, units, idx, body) {
        body.X.a = 0;
        body.X.x = vars[idx + OFFSET_POSITION_X];
        body.X.y = vars[idx + OFFSET_POSITION_Y];
        body.X.b = 0;
        body.X.uom = units[idx + OFFSET_POSITION_X];
        body.R.a = vars[idx + OFFSET_ATTITUDE_A];
        body.R.x = 0;
        body.R.y = 0;
        body.R.b = vars[idx + OFFSET_ATTITUDE_XY];
        body.R.uom = units[idx + OFFSET_ATTITUDE_XY];
        if (!Unit.isOne(body.R.uom)) {
            throw new Error("body.R.uom should be one, but was " + body.R.uom);
        }
        // Keep the magnitude of the attitude as close to 1 as possible.
        var R = body.R;
        var magR = Math.sqrt(R.a * R.a + R.b * R.b);
        body.R.a = body.R.a / magR;
        body.R.b = body.R.b / magR;
        body.P.a = 0;
        body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
        body.P.b = 0;
        body.P.uom = units[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.L.a = 0;
        body.L.x = 0;
        body.L.y = 0;
        body.L.b = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        if (!Unit.isOne(body.L.uom)) {
            if (Unit.isOne(units[idx + OFFSET_ANGULAR_MOMENTUM_XY])) {
                throw new Error("Overwriting Angular Momentum Units!");
            }
        }
        body.L.uom = units[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        body.updateAngularVelocity();
    };
    Dynamics2.prototype.setPositionRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
        var P = body.P;
        var M = body.M;
        if (!Unit.isOne(P.uom)) {
            if (!Unit.isCompatible(P.uom, Unit.KILOGRAM_METER_PER_SECOND)) {
                throw new Error("P.uom should be " + Unit.KILOGRAM_METER_PER_SECOND + ", but was " + P.uom);
            }
        }
        if (!Unit.isOne(M.uom)) {
            if (!Unit.isCompatible(M.uom, Unit.KILOGRAM)) {
                throw new Error("M.uom should be " + Unit.KILOGRAM + ", but was " + M.uom);
            }
        }
        var m = M.a;
        rateOfChangeVals[idx + OFFSET_POSITION_X] = P.x / m;
        rateOfChangeVals[idx + OFFSET_POSITION_Y] = P.y / m;
        var uom = Unit.div(P.uom, M.uom);
        rateOfChangeUoms[idx + OFFSET_POSITION_X] = uom;
        rateOfChangeUoms[idx + OFFSET_POSITION_Y] = uom;
    };
    Dynamics2.prototype.setAttitudeRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
        // Let Ω(t) be the (bivector) angular velocity.
        // Let R(t) be the (spinor) attitude of the rigid body. 
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        var R = body.R;
        var Ω = body.Ω;
        if (!Unit.isOne(R.uom)) {
            throw new Error("R.uom should be one, but was " + R.uom);
        }
        if (!Unit.isOne(Ω.uom)) {
            if (!Unit.isCompatible(Ω.uom, Unit.INV_SECOND)) {
                throw new Error("\u03A9.uom should be " + Unit.INV_SECOND + ", but was " + Ω.uom);
            }
        }
        // dR/dt = +(1/2)(Ω.b)(R.b) - (1/2)(Ω.b)(R.a) I, where I = e1e2. 
        rateOfChangeVals[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy);
        rateOfChangeVals[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a);
        var uom = Unit.mul(Ω.uom, R.uom);
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = uom;
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_XY] = uom;
    };
    Dynamics2.prototype.zeroLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
        var P = body.P;
        var M = body.M;
        if (!Unit.isOne(P.uom)) {
            if (!Unit.isCompatible(P.uom, Unit.KILOGRAM_METER_PER_SECOND)) {
                throw new Error("P.uom should be " + Unit.KILOGRAM_METER_PER_SECOND + ", but was " + P.uom);
            }
        }
        if (!Unit.isOne(M.uom)) {
            if (!Unit.isCompatible(M.uom, Unit.KILOGRAM)) {
                throw new Error("M.uom should be " + Unit.KILOGRAM + ", but was " + M.uom);
            }
        }
        // The rate of change change in linear and angular velocity are set to zero, ready for accumulation.
        var uom = Unit.div(P.uom, uomTime);
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = uom;
    };
    Dynamics2.prototype.zeroAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
        var L = body.L;
        var R = body.R;
        var Ω = body.Ω;
        if (!Unit.isOne(R.uom)) {
            throw new Error("R.uom should be one, but was " + R.uom);
        }
        if (!Unit.isOne(Ω.uom)) {
            if (!Unit.isCompatible(Ω.uom, Unit.INV_SECOND)) {
                throw new Error("\u03A9.uom should be " + Unit.INV_SECOND + ", but was " + Ω.uom);
            }
        }
        var uom = Unit.div(L.uom, uomTime);
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = uom;
    };
    return Dynamics2;
}());
export { Dynamics2 };
