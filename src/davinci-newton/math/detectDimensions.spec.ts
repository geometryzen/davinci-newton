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
    it("One", function () {
        expect(detectDims(R0, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.ONE);
    });
    it("Mass", function () {
        expect(detectDims(R1, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.MASS);
    });
    it("Length", function () {
        expect(detectDims(R0, R1, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.LENGTH);
    });
    it("LengthSquared", function () {
        expect(detectDims(R0, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.AREA);
    });
    it("RateOfChangeOfArea", function () {
        expect(detectDims(R0, R2, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.RATE_OF_CHANGE_OF_AREA);
    });
    it("Time", function () {
        expect(detectDims(R0, R0, R1, R0, R0, R0, R0)).toBe(DimensionsSummary.TIME);
    });
    it("TimeSquared", function () {
        expect(detectDims(R0, R0, R2, R0, R0, R0, R0)).toBe(DimensionsSummary.TIME_SQUARED);
    });
    it("Charge", function () {
        expect(detectDims(R0, R0, R0, R1, R0, R0, R0)).toBe(DimensionsSummary.CHARGE);
    });
    it("Current", function () {
        expect(detectDims(R0, R0, M1, R1, R0, R0, R0)).toBe(DimensionsSummary.CURRENT);
    });
    it("Temperature", function () {
        expect(detectDims(R0, R0, R0, R0, R1, R0, R0)).toBe(DimensionsSummary.TEMPERATURE);
    });
    it("Amount", function () {
        expect(detectDims(R0, R0, R0, R0, R0, R1, R0)).toBe(DimensionsSummary.AMOUNT);
    });
    it("Intensity", function () {
        expect(detectDims(R0, R0, R0, R0, R0, R0, R1)).toBe(DimensionsSummary.INTENSITY);
    });
    it("Force", function () {
        expect(detectDims(R1, R1, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.FORCE);
    });
    it("Energy", function () {
        expect(detectDims(R1, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.ENERGY_OR_TORQUE);
    });
    it("Momentum", function () {
        expect(detectDims(R1, R1, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.MOMENTUM);
    });
    it("MomentumSquared", function () {
        expect(detectDims(R2, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.MOMENTUM_SQUARED);
    });
    it("MomentOfInertia", function () {
        expect(detectDims(R1, R2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.MOMENT_OF_INERTIA);
    });
    it("AngularMomentum", function () {
        expect(detectDims(R1, R2, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.ANGULAR_MOMENTUM);
    });
    it("InverseMomentOfInertia", function () {
        expect(detectDims(M1, M2, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_MOMENT_OF_INERTIA);
    });
    it("InverseMass", function () {
        expect(detectDims(M1, R0, R0, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_MASS);
    });
    it("InverseTime", function () {
        expect(detectDims(R0, R0, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.INV_TIME);
    });
    it("Stiffness", function () {
        expect(detectDims(R1, R0, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.STIFFNESS);
    });
    it("Velocity", function () {
        expect(detectDims(R0, R1, M1, R0, R0, R0, R0)).toBe(DimensionsSummary.VELOCITY);
    });
    it("Velocity Squared", function () {
        expect(detectDims(R0, R2, M2, R0, R0, R0, R0)).toBe(DimensionsSummary.VELOCITY_SQUARED);
    });
});
