import detectDims from './detectDimensions';
// import Dimensions from './Dimensions';
import DimensionsSummary from './DimensionsSummary';
import QQ from './QQ';

const R0 = QQ.valueOf(0, 1);
const R1 = QQ.valueOf(1, 1);
const R2 = R1.add(R1);
const M1 = QQ.valueOf(-1, 1);
const M2 = QQ.valueOf(-2, 1);

describe("detectDims", function () {
    it("Amount", function () {
        expect(detectDims(R0, R0, R0, R0, R0, R1, R0)).toBe(DimensionsSummary.AMOUNT);
    });
    it("AngularMomentum", function () {
        expect(detectDims(R1, R2, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.ANGULAR_MOMENTUM);
    });
    it("Area", function () {
        expect(detectDims(R0, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.AREA);
    });
    it("Charge", function () {
        expect(detectDims(R0, R0, R0, R1, R0, R0, R0)).toBe(DimensionsSummary.CHARGE);
    });
    it("Current", function () {
        expect(detectDims(R0, R0, M1, R1, R0, R0, R0)).toBe(DimensionsSummary.CURRENT);
    });
    it("Electric Field", function () {
        expect(detectDims(R1, R1, M2, M1, R0, R0, R0)).toBe(DimensionsSummary.ELECTRIC_FIELD);
    });
    it("Electric Permittivity times Area", function () {
        expect(detectDims(M1, M1, R2, R2, R0, R0, R0)).toBe(DimensionsSummary.ELECTRIC_PERMITTIVITY_TIMES_AREA);
    });
    it("Energy", function () {
        expect(detectDims(R1, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.ENERGY_OR_TORQUE);
    });
    it("Force", function () {
        expect(detectDims(R1, R1, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.FORCE);
    });
    it("Intensity", function () {
        expect(detectDims(R0, R0, R0, R0, R0, R0, R1)).toBe(DimensionsSummary.INTENSITY);
    });
    it("InverseLength", function () {
        expect(detectDims(R0, M1, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_LENGTH);
    });
    it("InverseMass", function () {
        expect(detectDims(M1, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_MASS);
    });
    it("InverseMomentOfInertia", function () {
        expect(detectDims(M1, M2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_MOMENT_OF_INERTIA);
    });
    it("InverseTime", function () {
        expect(detectDims(R0, R0, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_TIME);
    });
    it("Length", function () {
        expect(detectDims(R0, R1, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.LENGTH);
    });
    it("LengthSquared", function () {
        expect(detectDims(R0, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.AREA);
    });
    it("Mass", function () {
        expect(detectDims(R1, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.MASS);
    });
    it("MomentOfInertia", function () {
        expect(detectDims(R1, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.MOMENT_OF_INERTIA);
    });
    it("Momentum", function () {
        expect(detectDims(R1, R1, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.MOMENTUM);
    });
    it("MomentumSquared", function () {
        expect(detectDims(R2, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.MOMENTUM_SQUARED);
    });
    it("One", function () {
        expect(detectDims(R0, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.ONE);
    });
    it("RateOfChangeOfArea", function () {
        expect(detectDims(R0, R2, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.RATE_OF_CHANGE_OF_AREA);
    });
    it("Stiffness", function () {
        expect(detectDims(R1, R0, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.STIFFNESS);
    });
    it("Temperature", function () {
        expect(detectDims(R0, R0, R0, R0, R1, R0, R0)).toBe(DimensionsSummary.TEMPERATURE);
    });
    it("Time", function () {
        expect(detectDims(R0, R0, R1, R0, R0, R0, R0)).toBe(DimensionsSummary.TIME);
    });
    it("TimeSquared", function () {
        expect(detectDims(R0, R0, R2, R0, R0, R0, R0)).toBe(DimensionsSummary.TIME_SQUARED);
    });
    it("Velocity", function () {
        expect(detectDims(R0, R1, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.VELOCITY);
    });
    it("Velocity Squared", function () {
        expect(detectDims(R0, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.VELOCITY_SQUARED);
    });
});
