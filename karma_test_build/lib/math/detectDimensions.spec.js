"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detectDimensions_1 = require("./detectDimensions");
var DimensionsSummary_1 = require("./DimensionsSummary");
var QQ_1 = require("./QQ");
var R0 = QQ_1.QQ.valueOf(0, 1);
var R1 = QQ_1.QQ.valueOf(1, 1);
var R2 = R1.add(R1);
var R3 = R2.add(R1);
var M1 = QQ_1.QQ.valueOf(-1, 1);
var M2 = QQ_1.QQ.valueOf(-2, 1);
describe("detectDims", function () {
    it("amount of substance", function () {
        expect(detectDimensions_1.default(R0, R0, R0, R0, R0, R1, R0)).toBe(DimensionsSummary_1.default.AMOUNT_OF_SUBSTANCE);
    });
    it("angular momentum", function () {
        expect(detectDimensions_1.default(R1, R2, M1, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.ANGULAR_MOMENTUM);
    });
    it("area", function () {
        expect(detectDimensions_1.default(R0, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.AREA);
    });
    it("electric charge", function () {
        expect(detectDimensions_1.default(R0, R0, R0, R1, R0, R0, R0)).toBe(DimensionsSummary_1.default.ELECTRIC_CHARGE);
    });
    it("electric current", function () {
        expect(detectDimensions_1.default(R0, R0, M1, R1, R0, R0, R0)).toBe(DimensionsSummary_1.default.ELECTRIC_CURRENT);
    });
    it("electric field", function () {
        expect(detectDimensions_1.default(R1, R1, M2, M1, R0, R0, R0)).toBe(DimensionsSummary_1.default.ELECTRIC_FIELD);
    });
    it("electric permittivity x area", function () {
        expect(detectDimensions_1.default(M1, M1, R2, R2, R0, R0, R0)).toBe(DimensionsSummary_1.default.ELECTRIC_PERMITTIVITY_TIMES_AREA);
    });
    it("energy, work, quantity of heat", function () {
        expect(detectDimensions_1.default(R1, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.ENERGY_OR_TORQUE);
    });
    it("force", function () {
        expect(detectDimensions_1.default(R1, R1, M2, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.FORCE);
    });
    it("luminous intensity", function () {
        expect(detectDimensions_1.default(R0, R0, R0, R0, R0, R0, R1)).toBe(DimensionsSummary_1.default.LUMINOUS_INTENSITY);
    });
    it("inverse length", function () {
        expect(detectDimensions_1.default(R0, M1, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.INV_LENGTH);
    });
    it("inverse mass", function () {
        expect(detectDimensions_1.default(M1, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.INV_MASS);
    });
    it("inverse moment of inertia", function () {
        expect(detectDimensions_1.default(M1, M2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA);
    });
    it("inverse time", function () {
        expect(detectDimensions_1.default(R0, R0, M1, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.INV_TIME);
    });
    it("length", function () {
        expect(detectDimensions_1.default(R0, R1, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.LENGTH);
    });
    it("volume", function () {
        expect(detectDimensions_1.default(R0, R3, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.VOLUME);
    });
    it("mass", function () {
        expect(detectDimensions_1.default(R1, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.MASS);
    });
    it("moment of inertia", function () {
        expect(detectDimensions_1.default(R1, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.MOMENT_OF_INERTIA);
    });
    it("momentum", function () {
        expect(detectDimensions_1.default(R1, R1, M1, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.MOMENTUM);
    });
    it("momentum squared", function () {
        expect(detectDimensions_1.default(R2, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.MOMENTUM_SQUARED);
    });
    it("one", function () {
        expect(detectDimensions_1.default(R0, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.ONE);
    });
    it("rate of change of area", function () {
        expect(detectDimensions_1.default(R0, R2, M1, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA);
    });
    it("stiffness", function () {
        expect(detectDimensions_1.default(R1, R0, M2, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.STIFFNESS);
    });
    it("theromdynamic temperature", function () {
        expect(detectDimensions_1.default(R0, R0, R0, R0, R1, R0, R0)).toBe(DimensionsSummary_1.default.THERMODYNAMIC_TEMPERATURE);
    });
    it("time", function () {
        expect(detectDimensions_1.default(R0, R0, R1, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.TIME);
    });
    it("time squared", function () {
        expect(detectDimensions_1.default(R0, R0, R2, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.TIME_SQUARED);
    });
    it("velocity", function () {
        expect(detectDimensions_1.default(R0, R1, M1, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.VELOCITY);
    });
    it("velocity squared", function () {
        expect(detectDimensions_1.default(R0, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary_1.default.VELOCITY_SQUARED);
    });
});
