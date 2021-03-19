import { checkBodyAttitudeUnit } from '../core/checkBodyAttitudeUnit';
import { INDEX_POTENTIAL_ENERGY, INDEX_RESERVED_LAST, INDEX_ROTATIONAL_KINETIC_ENERGY, INDEX_TOTAL_ENERGY, INDEX_TRANSLATIONAL_KINETIC_ENERGY } from '../core/Dynamics';
import { VarsList } from '../core/VarsList';
import { Unit } from '../math/Unit';
import { wedgeXY, wedgeYZ, wedgeZX } from '../math/wedge3';
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
export var INDEX_TOTAL_LINEAR_MOMENTUM_Z = INDEX_RESERVED_LAST + 3;
/**
 * @hidden
 */
export var INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = INDEX_RESERVED_LAST + 4;
/**
 * @hidden
 */
export var INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = INDEX_RESERVED_LAST + 5;
/**
 * @hidden
 */
export var INDEX_TOTAL_ANGULAR_MOMENTUM_XY = INDEX_RESERVED_LAST + 6;
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
export var OFFSET_POSITION_Z = 2;
/**
 * @hidden
 */
export var OFFSET_ATTITUDE_A = 3;
/**
 * @hidden
 */
export var OFFSET_ATTITUDE_YZ = 4;
/**
 * @hidden
 */
export var OFFSET_ATTITUDE_ZX = 5;
/**
 * @hidden
 */
export var OFFSET_ATTITUDE_XY = 6;
/**
 * @hidden
 */
export var OFFSET_LINEAR_MOMENTUM_X = 7;
/**
 * @hidden
 */
export var OFFSET_LINEAR_MOMENTUM_Y = 8;
/**
 * @hidden
 */
export var OFFSET_LINEAR_MOMENTUM_Z = 9;
/**
 * @hidden
 */
export var OFFSET_ANGULAR_MOMENTUM_YZ = 10;
/**
 * @hidden
 */
export var OFFSET_ANGULAR_MOMENTUM_ZX = 11;
/**
 * @hidden
 */
export var OFFSET_ANGULAR_MOMENTUM_XY = 12;
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
    "total linear momentum - z",
    "total angular momentum - yz",
    "total angular momentum - zx",
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
    INDEX_TOTAL_LINEAR_MOMENTUM_Z,
    INDEX_TOTAL_ANGULAR_MOMENTUM_YZ,
    INDEX_TOTAL_ANGULAR_MOMENTUM_ZX,
    INDEX_TOTAL_ANGULAR_MOMENTUM_XY
];
/**
 * @hidden
 */
var Dynamics3 = /** @class */ (function () {
    function Dynamics3() {
    }
    Dynamics3.prototype.numVarsPerBody = function () {
        return 13;
    };
    Dynamics3.prototype.getVarNames = function () {
        return varNames;
    };
    Dynamics3.prototype.getOffsetName = function (offset) {
        switch (offset) {
            case OFFSET_POSITION_X: return "position x";
            case OFFSET_POSITION_Y: return "position y";
            case OFFSET_POSITION_Z: return "position z";
            case OFFSET_ATTITUDE_A: return "attitude a";
            case OFFSET_ATTITUDE_YZ: return "attitude yz";
            case OFFSET_ATTITUDE_ZX: return "attitude zx";
            case OFFSET_ATTITUDE_XY: return "attitude xy";
            case OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case OFFSET_LINEAR_MOMENTUM_Z: return "linear momentum z";
            case OFFSET_ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
            case OFFSET_ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
            case OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error("getVarName(" + offset + ")");
    };
    Dynamics3.prototype.discontinuousEnergyVars = function () {
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
                Lyz += wedgeYZ(b.X, b.P);
                Lzx += wedgeZX(b.X, b.P);
                Lxy += wedgeXY(b.X, b.P);
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
        varsList.setValueContinuous(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te);
        // TODO: varsList.setUnit(INDEX_TRANSLATIONAL_KINETIC_ENERGY, te); etc
        varsList.setValueContinuous(INDEX_ROTATIONAL_KINETIC_ENERGY, re);
        varsList.setValueContinuous(INDEX_POTENTIAL_ENERGY, pe);
        varsList.setValueContinuous(INDEX_TOTAL_ENERGY, te + re + pe);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_X, Px);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py);
        varsList.setValueContinuous(INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx);
        varsList.setValueContinuous(INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy);
    };
    Dynamics3.prototype.updateVarsFromBody = function (body, idx, vars) {
        vars.setValueJump(OFFSET_POSITION_X + idx, body.X.x);
        vars.setValueJump(OFFSET_POSITION_Y + idx, body.X.y);
        vars.setValueJump(OFFSET_POSITION_Z + idx, body.X.z);
        vars.setUnit(OFFSET_POSITION_X + idx, body.X.uom);
        vars.setUnit(OFFSET_POSITION_Y + idx, body.X.uom);
        vars.setUnit(OFFSET_POSITION_Z + idx, body.X.uom);
        vars.setValueJump(OFFSET_ATTITUDE_A + idx, body.R.a);
        vars.setValueJump(OFFSET_ATTITUDE_XY + idx, body.R.xy);
        vars.setValueJump(OFFSET_ATTITUDE_YZ + idx, body.R.yz);
        vars.setValueJump(OFFSET_ATTITUDE_ZX + idx, body.R.zx);
        vars.setUnit(OFFSET_ATTITUDE_A + idx, body.R.uom);
        vars.setUnit(OFFSET_ATTITUDE_XY + idx, body.R.uom);
        vars.setUnit(OFFSET_ATTITUDE_YZ + idx, body.R.uom);
        vars.setUnit(OFFSET_ATTITUDE_ZX + idx, body.R.uom);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
        vars.setValueJump(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_X + idx, body.P.uom);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.uom);
        vars.setUnit(OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.uom);
        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
        vars.setValueJump(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.uom);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.uom);
        vars.setUnit(OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.uom);
    };
    Dynamics3.prototype.addForceToRateOfChangeLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, force, uomTime) {
        var Fx = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        if (Fx !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = Fx + force.x;
        var Fy = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
        if (Fy !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = Fy + force.y;
        var Fz = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z];
        if (Fz !== 0) {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z], force.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.uom;
        }
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z] = Fz + force.z;
    };
    Dynamics3.prototype.getForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
        force.x = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X];
        force.y = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y];
        force.z = rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z];
        force.uom = rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X];
    };
    Dynamics3.prototype.setForce = function (rateOfChangeVals, rateOfChangeUoms, idx, force) {
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = force.x;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = force.uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.y;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = force.uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.z;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = force.uom;
    };
    Dynamics3.prototype.addTorqueToRateOfChangeAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, torque, uomTime) {
        var Tyz = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_YZ];
        if (Tyz !== 0) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ], torque.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = torque.uom;
        }
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = Tyz + torque.yz;
        var Tzx = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_ZX];
        if (Tzx !== 0) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX], torque.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = torque.uom;
        }
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = Tzx + torque.zx;
        var Txy = rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        if (Txy !== 0) {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Unit.compatible(rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY], torque.uom);
        }
        else {
            rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = torque.uom;
        }
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = Txy + torque.xy;
    };
    Dynamics3.prototype.updateBodyFromVars = function (vars, units, idx, body, uomTime) {
        body.X.x = vars[idx + OFFSET_POSITION_X];
        body.X.y = vars[idx + OFFSET_POSITION_Y];
        body.X.z = vars[idx + OFFSET_POSITION_Z];
        body.X.uom = units[idx + OFFSET_POSITION_X];
        body.R.a = vars[idx + OFFSET_ATTITUDE_A];
        body.R.xy = vars[idx + OFFSET_ATTITUDE_XY];
        body.R.yz = vars[idx + OFFSET_ATTITUDE_YZ];
        body.R.zx = vars[idx + OFFSET_ATTITUDE_ZX];
        // We will only use one of the following units. Check them all for integrity.
        checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_A], uomTime);
        checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_XY], uomTime);
        checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_YZ], uomTime);
        checkBodyAttitudeUnit(units[idx + OFFSET_ATTITUDE_ZX], uomTime);
        body.R.uom = units[idx + OFFSET_ATTITUDE_A];
        // Keep the magnitude of the attitude as close to 1 as possible.
        var R = body.R;
        var magR = Math.sqrt(R.a * R.a + R.xy * R.xy + R.yz * R.yz + R.zx * R.zx);
        body.R.a = body.R.a / magR;
        body.R.xy = body.R.xy / magR;
        body.R.yz = body.R.yz / magR;
        body.R.zx = body.R.zx / magR;
        body.P.x = vars[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.P.y = vars[idx + OFFSET_LINEAR_MOMENTUM_Y];
        body.P.z = vars[idx + OFFSET_LINEAR_MOMENTUM_Z];
        body.P.uom = units[idx + OFFSET_LINEAR_MOMENTUM_X];
        body.L.xy = vars[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        body.L.yz = vars[idx + OFFSET_ANGULAR_MOMENTUM_YZ];
        body.L.zx = vars[idx + OFFSET_ANGULAR_MOMENTUM_ZX];
        body.L.uom = units[idx + OFFSET_ANGULAR_MOMENTUM_XY];
        body.updateAngularVelocity();
    };
    Dynamics3.prototype.setPositionRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
        // The rate of change of position is the velocity.
        // dX/dt = V = P / M
        var P = body.P;
        var M = body.M;
        var m = M.a;
        rateOfChangeVals[idx + OFFSET_POSITION_X] = P.x / m;
        rateOfChangeVals[idx + OFFSET_POSITION_Y] = P.y / m;
        rateOfChangeVals[idx + OFFSET_POSITION_Z] = P.z / m;
        var uom = Unit.div(P.uom, M.uom);
        rateOfChangeUoms[idx + OFFSET_POSITION_X] = uom;
        rateOfChangeUoms[idx + OFFSET_POSITION_Y] = uom;
        rateOfChangeUoms[idx + OFFSET_POSITION_Z] = uom;
    };
    Dynamics3.prototype.setAttitudeRateOfChangeVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body) {
        // The rate of change of attitude is given by: dR/dt = -(1/2) Ω R,
        // requiring the geometric product of Ω and R.
        // Ω and R are auxiliary and primary variables that have already been computed.
        var R = body.R;
        var Ω = body.Ω;
        rateOfChangeVals[idx + OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
        rateOfChangeVals[idx + OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
        rateOfChangeVals[idx + OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
        rateOfChangeVals[idx + OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
        var uom = Unit.mul(Ω.uom, R.uom);
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_A] = uom;
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_YZ] = uom;
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_ZX] = uom;
        rateOfChangeUoms[idx + OFFSET_ATTITUDE_XY] = uom;
    };
    Dynamics3.prototype.zeroLinearMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
        var P = body.P;
        var uom = Unit.div(P.uom, uomTime);
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_X] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_X] = uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Y] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Y] = uom;
        rateOfChangeVals[idx + OFFSET_LINEAR_MOMENTUM_Z] = 0;
        rateOfChangeUoms[idx + OFFSET_LINEAR_MOMENTUM_Z] = uom;
    };
    Dynamics3.prototype.zeroAngularMomentumVars = function (rateOfChangeVals, rateOfChangeUoms, idx, body, uomTime) {
        var L = body.L;
        var uom = Unit.div(L.uom, uomTime);
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_XY] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_XY] = uom;
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_YZ] = uom;
        rateOfChangeVals[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
        rateOfChangeUoms[idx + OFFSET_ANGULAR_MOMENTUM_ZX] = uom;
    };
    return Dynamics3;
}());
export { Dynamics3 };
