import { VarsList } from "../core/VarsList";
import { Geometric1 } from "../math/Geometric1";
import { Unit } from "../math/Unit";
import { Dynamics1 } from "./Dynamics1";
import { Particle1 } from "./Particle1";

describe("Dynamics1", function () {
    describe("constructor", function () {
        it("should be defined.", function () {
            const dynamics = new Dynamics1();
            expect(dynamics).toBeDefined();
        });
    });
    describe("getVarNames", function () {
        it("", function () {
            const dynamics = new Dynamics1();
            const varNames = dynamics.getVarNames();
            expect(varNames).toBeDefined();
            expect(Array.isArray(varNames));
            expect(varNames.indexOf('TIME') >= 0).toBe(true);
        });
    });
    describe("numVarsPerBody() method", function () {
        it("should return an integer which is greater than zero.", function () {
            const dynamics = new Dynamics1();
            const numVarsPerBody = dynamics.numVarsPerBody();
            expect(typeof numVarsPerBody).toBe('number');
            expect(numVarsPerBody > 0).toBe(true);
        });
    });
    describe("discontinuousEnergyVars", function () {
        it("", function () {
            const dynamics = new Dynamics1();
            const vars = dynamics.discontinuousEnergyVars();
            expect(vars).toBeDefined();
            expect(Array.isArray(vars)).toBe(true);
        });
    });
    describe("epilog() method", function () {
        it("should be callable.", function () {
            const varsList = new VarsList(['TIME']);
            const dynamics = new Dynamics1();
            dynamics.epilog([], [], void 0, varsList);
            expect(true).toBe(true);
        });
    });
    describe("getOffsetName() method", function () {
        it("should be callable.", function () {
            const dynamics = new Dynamics1();
            const name = dynamics.getOffsetName(0);
            expect(name).toBeDefined();
            expect(typeof name).toBe('string');
        });
    });
    describe("updateVarsFromBody() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const varsList = new VarsList(['TIME']);
            const M = new Geometric1();
            const Q = new Geometric1();
            const body = new Particle1(M, Q);
            dynamics.updateVarsFromBody(body, 0, varsList);
            expect(true).toBe(true);
        });
    });
    describe("updateBodyFromVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const body = new Particle1(M, Q);
            const vars: number[] = [];
            const units: Unit[] = [];
            const uomTime = Unit.SECOND;
            dynamics.updateBodyFromVars(vars, units, 0, body, uomTime);
            expect(true).toBe(true);
        });
    });
    describe("setPositionRateOfChangeVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const body = new Particle1(M, Q);
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            dynamics.setPositionRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, 0, body);
            expect(true).toBe(true);
        });
    });
    describe("setAttitudeRateOfChangeVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const body = new Particle1(M, Q);
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            dynamics.setAttitudeRateOfChangeVars(rateOfChangeVals, rateOfChangeUoms, 0, body);
            expect(true).toBe(true);
        });
    });
    describe("zeroLinearMomentumVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const body = new Particle1(M, Q);
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            const uomTime = Unit.SECOND;
            dynamics.zeroLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, 0, body, uomTime);
            expect(true).toBe(true);
        });
    });
    describe("zeroAngularMomentumVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const M = new Geometric1();
            const Q = new Geometric1();
            const body = new Particle1(M, Q);
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            const uomTime = Unit.SECOND;
            dynamics.zeroAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, 0, body, uomTime);
            expect(true).toBe(true);
        });
    });
    describe("addForceToRateOfChangeLinearMomentumVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const force = new Geometric1();
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            const uomTime = Unit.SECOND;
            dynamics.addForceToRateOfChangeLinearMomentumVars(rateOfChangeVals, rateOfChangeUoms, 0, force, uomTime);
            expect(true).toBe(true);
        });
    });
    describe("addTorqueToRateOfChangeAngularMomentumVars() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const torque = new Geometric1();
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            const uomTime = Unit.SECOND;
            dynamics.addTorqueToRateOfChangeAngularMomentumVars(rateOfChangeVals, rateOfChangeUoms, 0, torque, uomTime);
            expect(true).toBe(true);
        });
    });
    describe("getForce() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const force = new Geometric1();
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            dynamics.getForce(rateOfChangeVals, rateOfChangeUoms, 0, force);
            expect(true).toBe(true);
        });
    });
    describe("setForce() method", function () {
        it("should work.", function () {
            const dynamics = new Dynamics1();
            const force = new Geometric1();
            const rateOfChangeVals: number[] = [];
            const rateOfChangeUoms: Unit[] = [];
            dynamics.setForce(rateOfChangeVals, rateOfChangeUoms, 0, force);
            expect(true).toBe(true);
        });
    });
});
